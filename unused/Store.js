class Store {
  #value;
  #subscribers;

  /**@param {*} value  */
  constructor(value) {
    this.#value = value;
    this.#subscribers = new Set();
  }
  set(newValue) {
    this.#value = newValue;
    this.#subscribers.forEach((callback) => callback());
  }

  get() {
    return this.#value;
  }
  subscribe(callback) {
    this.#subscribers.add(callback);
    return () => this.#subscribers.delete(callback);
  }
}
