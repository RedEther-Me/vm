import {
  CPU,
  MemoryController,
  createMemory,
  BOOT_ADDRESS
} from "@emulator/core";

export let machine;

export const loadMedia = file => {
  const lines = file.match(/.{1,8}/g);

  lines.forEach((line, index) => {
    machine.mm.setUint8(BOOT_ADDRESS + index, parseInt(line, 2));
  });

  machine.cpu.reset();
};

// Initialize Machine
(() => {
  if (!machine) {
    const memory = createMemory(256 * 256);

    const mm = new MemoryController();
    mm.map("memory", memory, 0, 0xffff);

    const cpu = new CPU(mm, { logger: console });

    machine = {
      cpu,
      mm
    };
  }
})();
