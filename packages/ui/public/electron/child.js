import {
  CPU,
  MemoryController,
  createMemory,
  BOOT_ADDRESS,
} from "@emulator/core";

let machine;

// Initialize Machine
(() => {
  if (!machine) {
    const memory = createMemory(256 * 256);

    const mm = new MemoryController({
      listener: (data) => {
        process.send(data);
      },
    });
    mm.map("memory", memory, 0, 0xffff);

    const cpu = new CPU(mm, { logger: console });
    cpu.addListener("program", (data) => {
      process.send(data);
    });

    machine = {
      cpu,
      mm,
    };
  }
})();

process.on("message", ({ event, ...args }) => {
  if (event === "register-device") {
    const { name, from, to } = args;
    machine.mm.map(
      name,
      {
        getUint16: () => 0,
        getUint8: () => 0,
        setUint16: (address, data) => {
          process.send({ event: name, method: "setUint16", address, data });
        },
      },
      from,
      to
    );
  }
});
