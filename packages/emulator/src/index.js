import commander from "commander";

import {
  readFileAsync,
  createMemory,
  CPU,
  MemoryController,
  BOOT_ADDRESS
} from "@emulator/core";

import createDisplayDevice from "./display-controller.js";

const stdin = process.openStdin();

commander.option("-f, --file [file]", "executable file", "output.bin");

commander.parse(process.argv);

async function processFile() {
  const file = await readFileAsync(commander.file);

  const memory = createMemory(256 * 256);

  const lines = file.match(/.{1,16}/g);

  lines.forEach((line, index) => {
    memory.setUint16(BOOT_ADDRESS + index * 2, parseInt(line, 2));
  });

  const mm = new MemoryController();
  mm.map("memory", memory, 0, 0xffff);
  mm.map("display", createDisplayDevice(25), 0x3000, 0x30ff);

  const cpu = new CPU(mm);

  cpu.run();
}

processFile();

stdin.on("data", function(chunk) {
  process.exit(0);
});
