import { Server } from "socket.io";
import * as Y from "yjs";

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
    origin: "*",
  },
});
const workspaces = io.of(/workspace:.+/);

const docs = new Map<string, Y.Doc>();

function getDoc(name: string): Y.Doc {
  let doc = docs.get(name);

  if (!doc) {
    doc = new Y.Doc();
    docs.set(name, doc);
  }

  return doc;
}

workspaces.on("connect", async (socket) => {
  const doc = getDoc(socket.nsp.name);
  socket.emit("update", Y.encodeStateAsUpdate(doc));

  function onUpdate(update: Uint8Array) {
    socket.broadcast.emit("update", update);
  }

  doc.on("update", onUpdate);

  socket.on("syncStep1", (state) => {
    socket.emit("syncStep2", Y.encodeStateAsUpdate(doc, new Uint8Array(state)));
  });

  socket.on("update", (update) => {
    Y.applyUpdate(doc, new Uint8Array(update));
  });

  socket.on("disconnect", () => {
    doc.off("update", onUpdate);
  });
});
