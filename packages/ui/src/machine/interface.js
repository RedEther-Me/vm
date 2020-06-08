function createMemory(size) {
  const ab = new ArrayBuffer(size);
  const dv = new DataView(ab);

  return dv;
}

class CpuInterface {
  constructor() {
    this.eventListeners = {};

    window.ipcRerenderer.on("message", (event, data) => {
      Object.values(this.eventListeners).forEach((listener) => {
        if (listener.event === data.event || listener.event === "any") {
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

  step() {
    window.ipcRerenderer.send("message", {
      event: "step",
    });
  }

  run() {
    window.ipcRerenderer.send("message", {
      event: "run",
    });
  }

  reset() {
    window.ipcRerenderer.send("message", {
      event: "reset",
    });
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
