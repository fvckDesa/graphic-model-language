import * as Y from "yjs";
import { Socket } from "socket.io-client";

interface ServerToClientEvents {
  syncStep2: (state: ArrayBuffer) => void;
  update: (update: ArrayBuffer) => void;
}

interface ClientToServerEvents {
  syncStep1: (state: ArrayBuffer) => void;
  update: (update: ArrayBuffer) => void;
}

export type SyncSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export class SocketIoProvider {
  public constructor(public doc: Y.Doc, public socket: SyncSocket) {
    this.onSyncStep2 = this.onSyncStep2.bind(this);
    this.onSocketUpdate = this.onSocketUpdate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);

    this.socket.emit("syncStep1", Y.encodeStateVector(this.doc));

    this.socket.on("syncStep2", this.onSyncStep2);
    this.socket.on("update", this.onSocketUpdate);
    this.doc.on("update", this.onUpdate);
  }

  private onSyncStep2(state: ArrayBuffer) {
    Y.applyUpdate(this.doc, new Uint8Array(state), this);
  }

  private onSocketUpdate(update: ArrayBuffer) {
    console.log("socket update");
    Y.applyUpdate(this.doc, new Uint8Array(update), this);
  }

  private onUpdate(update: Uint8Array, origin: unknown) {
    if (origin !== this) {
      this.socket.emit("update", update);
    }
  }

  public destroy() {
    this.socket.off("update", this.onSocketUpdate);
    this.doc.off("update", this.onUpdate);
    this.socket.close();
  }
}
