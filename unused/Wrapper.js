import Peer from "peerjs";
import Stream from "./Stream";

/**
 * @typedef {Object} ConstructorProp
 * @property {(error:string) => void} onError
 * @property {Constraint} constraint
 * @property {HTMLVideoElement} localElement
 * @property {HTMLVideoElement} remoteElement
 */
/**@typedef {("idle"|"connected"|"incoming"|"calling")} CallState */
/**
 * @typedef {{height:number, weight:number}} Constraint
 */
/**
 * @typedef {Object} StartCallProp
 * @property {string} id
 * @property {Constraint} constraint
 */

class PeerJsWrapper {
  /**@type {Peer} */
  #peer;

  /**@type {Constraint} */
  #constraints;

  /**@type {import("peerjs").MediaConnection} */
  #currentConnection;

  /**@type {(error:string) => void} */
  #onError;

  /**@param {ConstructorProp} prop */
  constructor({ onOpen, onError, constraint, localElement, remoteElement }) {
    this.#onError = onError;
    this.localStream = new Stream(localElement);
    this.remoteStream = new Stream(remoteElement);
    this.#constraints = constraint ?? {
      video: true,
      audio: true,
    };

    /**@type {Store} */
    this.callState = new Store();

    this.#peer = new Peer(id);
    this.#peer.on("connection", (connection) => {
      connection.on("data", (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === "Decline") {
          this.#handleDeclinedCall(connection.peer);
        }
      });
    });

    this.#peer.on("error", this.#handleError);
    this.#peer.on("open", onOpen);
    this.#peer.on("call", async (call) => {
      this.#currentConnection = call;
      call.on("close", this.#endCall);
      call.on("error", this.#handleError);
      this.callState.set("incoming");
    });
  }

  #endCall = () => {
    this.localStream.stop();
    this.remoteStream.stop();
    this.#currentConnection?.close();
    this.callState.set("idle");
  };

  #handleError = (error) => {
    console.error(error);
    this.#onError?.(error);
    this.#endCall();
  };

  /**@param {string} peerId */
  #handleDeclinedCall = (peerId) => {
    const connection = this.#currentConnection;
    if (!connection || connection.open || connection.peer !== peerId) return;
    this.#endCall();
  };

  handleDecline() {
    if (!this.#currentConnection) return;
    if (this.#currentConnection.open) {
      this.#endCall();
    } else {
      const dataConnection = this.#peer.connect(this.#currentConnection.peer);
      dataConnection.on("open", () => {
        dataConnection.send(JSON.stringify({ type: "Decline" }));
        dataConnection.close();
        this.#endCall();
      });
    }
  }

  async answerCall() {
    const connection = this.#currentConnection;
    if (!connection) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        this.#constraints
      );
      this.callState.set("connected");
      this.localStream.start(stream);
      connection.answer(stream);
      connection.on("stream", this.remoteStream.start);
    } catch (error) {
      this.#handleError(error);
    }
  }

  /**@param {StartCallProp} prop */
  async startCall({ id, constraint }) {
    if (!id?.trim() || this.callState.get() !== "idle" || !this.#peer) return;
    this.callState.set("calling");

    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        constraint ?? this.#constraints
      );
      this.callState.set("connected");
      this.localStream.start(stream);

      const connection = this.#peer.call(id, stream);
      connection.on("stream", this.remoteStream.start);
      connection.on("close", this.#endCall);
      connection.on("error", this.#handleError);
      this.#currentConnection = connection;
    } catch (error) {
      this.#handleError(error);
    }
  }

  destroy() {
    this.#endCall();
    this.#peer?.destroy();
  }
}

export default PeerJsWrapper;
