import createMemory from "../emulator/memory";
import MemoryController from "../emulator/memory-controller";
import CPU from "../emulator/cpu";

export let machine;

export const loadMedia = file => {
  const lines = file.match(/.{1,8}/g);

  lines.forEach((line, index) => {
    machine.mm.setUint8(index, parseInt(line, 2));
  });
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
