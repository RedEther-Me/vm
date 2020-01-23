import createMemory from "../emulator/memory";
import MemoryController from "../emulator/memory-controller";
import CPU from "../emulator/cpu";

export let machine;

export const loadMedia = file => {
  const lines = file.match(/.{1,16}/g);

  lines.forEach((line, index) => {
    machine.mm.setUint16(index * 2, parseInt(line, 2));
  });

  machine.cpu.run();
};

// Initialize Machine
(() => {
  if (!machine) {
    const memory = createMemory(256 * 256);

    const mm = new MemoryController();
    mm.map("memory", memory, 0, 0xffff);

    const cpu = new CPU(mm);

    machine = {
      cpu,
      mm
    };
  }
})();
