class CpuInterface {
  constructor() {
    this.eventListeners = {};

    window.ipcRerenderer.on("message", (event, data) => {
      console.log("------", event);
      Object.values(this.eventListeners).forEach((listener) => {
        if (listener.event === event || listener.event === "any") {
          listener.handler(data);
        }
      });
    });
  }

  addEventListener(name, event, handler) {
    this.eventListeners[name] = { event, handler };
  }

  removeEventListener(name) {
    delete this.eventListeners[name];
  }

  registerDevice(name, device, from, to) {
    window.ipcRerenderer.send("message", {
      event: "register-device",
      name,
      from,
      to,
    });
    this.addEventListener(name, name, device);
  }
}

export default new CpuInterface();
