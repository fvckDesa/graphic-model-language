import * as Y from "yjs";

type BroadcastEvent<T extends string = string, D = null> = {
  eventType: T;
  payload: D;
};

function isBroadcastEvent(
  message: MessageEvent
): message is MessageEvent<BroadcastEvent<string, unknown>> {
  return (
    !!message.data &&
    typeof message.data === "object" &&
    "eventType" in message.data &&
    "payload" in message.data
  );
}

type SyncStep1Event = BroadcastEvent<"sync-step-1", Uint8Array>;

function isSyncStep1Event(
  message: MessageEvent
): message is MessageEvent<SyncStep1Event> {
  return (
    isBroadcastEvent(message) &&
    message.data.eventType === "sync-step-1" &&
    message.data.payload instanceof Uint8Array
  );
}

type SyncStep2Event = BroadcastEvent<"sync-step-2", Uint8Array>;

function isSyncStep2Event(
  message: MessageEvent
): message is MessageEvent<SyncStep2Event> {
  return (
    isBroadcastEvent(message) &&
    message.data.eventType === "sync-step-2" &&
    message.data.payload instanceof Uint8Array
  );
}

type UpdateEvent = BroadcastEvent<"update", Uint8Array>;

function isUpdateEvent(
  message: MessageEvent
): message is MessageEvent<UpdateEvent> {
  return (
    isBroadcastEvent(message) &&
    message.data.eventType === "update" &&
    message.data.payload instanceof Uint8Array
  );
}

export class BroadcastProvider {
  private channel: BroadcastChannel;

  public constructor(public doc: Y.Doc, public name: string) {
    this.channel = new BroadcastChannel(this.name);

    this.onUpdate = this.onUpdate.bind(this);
    this.onMessage = this.onMessage.bind(this);

    this.channel.addEventListener("message", this.onMessage);

    this.send({
      eventType: "sync-step-1",
      payload: Y.encodeStateVector(this.doc),
    });

    this.doc.on("update", this.onUpdate);
  }

  private onMessage(message: MessageEvent) {
    if (isSyncStep1Event(message)) {
      this.send({
        eventType: "sync-step-2",
        payload: Y.encodeStateAsUpdate(this.doc, message.data.payload),
      });
    } else if (isSyncStep2Event(message)) {
      Y.applyUpdate(this.doc, message.data.payload, this.channel);
    } else if (isUpdateEvent(message)) {
      Y.applyUpdate(this.doc, message.data.payload, this.channel);
    } else if (isBroadcastEvent(message)) {
      throw new Error(`Event ${message.data.eventType} is not supported`);
    } else {
      console.log(message);
      throw new Error("Invalid broadcast event");
    }
  }

  private onUpdate(update: Uint8Array, origin: unknown) {
    if (origin !== this.channel && origin !== "store") {
      this.send({
        eventType: "update",
        payload: update,
      });
    }
  }

  public send(event: SyncStep1Event | SyncStep2Event | UpdateEvent) {
    this.channel.postMessage(event);
  }

  public destroy() {
    this.channel.removeEventListener("message", this.onMessage);
    this.doc.off("update", this.onUpdate);
    this.channel.close();
  }
}
