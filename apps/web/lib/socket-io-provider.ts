import * as Y from "yjs";
import * as A from "y-protocols/awareness";
import { Socket } from "socket.io-client";

interface ServerToClientEvents {
  syncStep2: (state: ArrayBuffer) => void;
  update: (update: ArrayBuffer) => void;
  queryRemoteAwareness: (remoteState: ArrayBuffer) => void;
  awarenessUpdate: (update: ArrayBuffer) => void;
}

interface ClientToServerEvents {
  syncStep1: (state: ArrayBuffer) => void;
  update: (update: ArrayBuffer) => void;
  queryRemoteAwareness: (localState: ArrayBuffer) => void;
  awarenessUpdate: (update: ArrayBuffer) => void;
}

export type SyncSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type AwarenessUpdate = {
  added: number[];
  updated: number[];
  removed: number[];
};
export class SocketIoProvider {
  public constructor(
    public doc: Y.Doc,
    public socket: SyncSocket,
    public awareness: A.Awareness = new A.Awareness(doc)
  ) {
    this.onSyncStep2 = this.onSyncStep2.bind(this);
    this.onSocketUpdate = this.onSocketUpdate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);

    this.onSocketQueryRemoteAwareness =
      this.onSocketQueryRemoteAwareness.bind(this);
    this.onSocketAwarenessUpdate = this.onSocketAwarenessUpdate.bind(this);
    this.onAwarenessUpdate = this.onAwarenessUpdate.bind(this);

    this.socket.emit("syncStep1", Y.encodeStateVector(this.doc));
    this.socket.emit(
      "queryRemoteAwareness",
      A.encodeAwarenessUpdate(this.awareness, [this.doc.clientID])
    );

    this.socket.on("syncStep2", this.onSyncStep2);
    this.socket.on("update", this.onSocketUpdate);
    this.doc.on("update", this.onUpdate);

    this.socket.on("queryRemoteAwareness", this.onSocketQueryRemoteAwareness);
    this.socket.on("awarenessUpdate", this.onSocketAwarenessUpdate);
    this.awareness.on("update", this.onAwarenessUpdate);
  }

  private onSyncStep2(state: ArrayBuffer) {
    Y.applyUpdate(this.doc, new Uint8Array(state), this);
  }

  private onSocketUpdate(update: ArrayBuffer) {
    Y.applyUpdate(this.doc, new Uint8Array(update), this);
  }

  private onUpdate(update: Uint8Array, origin: unknown) {
    if (origin === this) return;
    this.socket.emit("update", update);
  }

  private onSocketQueryRemoteAwareness(remoteState: ArrayBuffer) {
    A.applyAwarenessUpdate(this.awareness, new Uint8Array(remoteState), this);
    this.socket.emit(
      "awarenessUpdate",
      A.encodeAwarenessUpdate(
        this.awareness,
        Array.from(this.awareness.getStates().keys())
      )
    );
  }

  private onSocketAwarenessUpdate(update: ArrayBuffer) {
    A.applyAwarenessUpdate(this.awareness, new Uint8Array(update), this);
  }

  private onAwarenessUpdate(
    { added, updated, removed }: AwarenessUpdate,
    origin: unknown
  ) {
    if (origin === this) return;
    const clients = added.concat(updated).concat(removed);
    const update = A.encodeAwarenessUpdate(this.awareness, clients);
    this.socket.emit("awarenessUpdate", update);
  }

  public destroy() {
    A.removeAwarenessStates(this.awareness, [this.doc.clientID], "destroy");

    this.socket.off("syncStep2", this.onSyncStep2);
    this.socket.off("update", this.onSocketUpdate);
    this.doc.off("update", this.onUpdate);

    this.socket.off("queryRemoteAwareness", this.onSocketQueryRemoteAwareness);
    this.socket.off("awarenessUpdate", this.onSocketAwarenessUpdate);
    this.awareness.off("update", this.onAwarenessUpdate);

    this.socket.close();
  }
}
