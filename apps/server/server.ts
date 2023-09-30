import { Server } from "socket.io";
import * as Y from "yjs";
import { prisma } from "database/client";

interface ServerToClientEvents {
  syncStep2: (state: ArrayBuffer) => void;
  update: (update: ArrayBuffer) => void;
}

interface ClientToServerEvents {
  syncStep1: (state: ArrayBuffer) => void;
  update: (update: ArrayBuffer) => void;
}

const PORT = 8080;

const io = new Server<ClientToServerEvents, ServerToClientEvents>(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const DB = Symbol("database");
const docs = new Map<string, Y.Doc>();

function getDoc(id: string, initialize?: (doc: Y.Doc) => void): Y.Doc {
  let doc = docs.get(id);

  if (!doc) {
    doc = new Y.Doc();
    initialize?.(doc);
    docs.set(id, doc);
  }

  return doc;
}

function parseCookie(str: string): Record<string, string> {
  return str
    .split(";")
    .map((v) => v.split("="))
    .reduce<Record<string, string>>((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

const workspaces = io.of(/workspace:.+/);

workspaces.use(async (socket, next) => {
  const workspaceId = getWorkspaceId(socket.nsp.name);

  const sessionToken = parseCookie(socket.request.headers.cookie ?? "")[
    "next-auth.session-token"
  ];

  if (!sessionToken) {
    next(new Error("Session token not found"));
    return;
  }

  const session = await prisma.session.findUnique({
    where: {
      sessionToken,
    },
    select: {
      user: true,
    },
  });

  if (!session) {
    next(new Error("Session not found"));
    return;
  }

  const connection = await prisma.userOnWorkspace.findUnique({
    where: {
      userId_workspaceId: {
        workspaceId,
        userId: session.user.id,
      },
    },
  });

  if (!connection) {
    next(new Error("Not Authorized"));
  }

  next();
});

workspaces.use(async (socket, next) => {
  const id = getWorkspaceId(socket.nsp.name);

  const workspace = await prisma.workspace.findUnique({
    where: { id },
    select: {
      snapshot: true,
      updates: true,
    },
  });

  if (!workspace) {
    next(new Error("Workspace not found"));
    return;
  }

  const { snapshot, updates } = workspace;

  const doc = getDoc(id, (doc) => {
    const blobs = updates.map(({ blob }) => new Uint8Array(blob));
    if (snapshot) {
      blobs.unshift(new Uint8Array(snapshot.blob));
    }
    Y.applyUpdate(doc, Y.mergeUpdates(blobs), DB);
  });

  async function onUpdate(update: Uint8Array, origin: unknown) {
    if (origin === DB) return;
    await prisma.update.create({
      data: {
        blob: Buffer.from(update),
        workspaceId: id,
      },
    });
    socket.broadcast.emit("update", update);
  }

  doc.on("update", onUpdate);

  socket.on("disconnect", async () => {
    if (socket.nsp.sockets.size === 0) {
      const blob = Buffer.from(Y.encodeStateAsUpdate(doc));
      await prisma.snapshot.upsert({
        where: {
          id: snapshot?.id,
          workspaceId: id,
        },
        create: {
          blob,
          workspaceId: id,
        },
        update: {
          blob,
        },
      });
      await prisma.update.deleteMany({
        where: {
          workspaceId: id,
        },
      });
    }
    doc.off("update", onUpdate);
  });

  next();
});

workspaces.on("connect", async (socket) => {
  const doc = getDoc(getWorkspaceId(socket.nsp.name));

  socket.on("syncStep1", (state) => {
    socket.emit("syncStep2", Y.encodeStateAsUpdate(doc, new Uint8Array(state)));
  });

  socket.on("update", (update) => {
    Y.applyUpdate(doc, new Uint8Array(update));
  });
});

function getWorkspaceId(namespace: string): string {
  return namespace.replace("/workspace:", "");
}
