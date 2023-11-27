class Stream {
  /**@type {HTMLVideoElement}  */
  #element;

  /**@type {() => void} */
  #notify;

  /**@param {HTMLVideoElement} element  */
  constructor(element, notify) {
    this.#element = element;
    this.micState = true;
    this.cameraState = true;
    this.#notify = notify;
  }

  /** @param {MediaStream} stream */
  async start(stream) {
    if (!stream || !this.#element) return;
    this.#element.srcObject = stream;
    await this.#element.play();
  }

  get stream() {
    return this.#element?.srcObject;
  }

  toggleMic() {
    if (!this.stream) return;
    this.stream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    this.micState = !this.micState;
    this.#notify();
  }

  toggleCamera() {
    if (!this.stream) return;
    this.stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    this.cameraState = !this.cameraState;
    this.#notify();
  }

  stop() {
    if (!this.stream) return;
    this.stream.getTracks().forEach((track) => track.stop());
    this.cameraState = true;
    this.micState = true;
    this.#notify();
  }
}

export default Stream;
