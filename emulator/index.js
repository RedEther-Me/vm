const commander = require("commander");

const { readFileAsync } = require("../helpers");

const createMemory = require("./memory");
const CPU = require("./cpu");
const MemoryController = require("./memory-controller");
const createDisplayDevice = require("./display-controller");

commander.option("-f, --file [file]", "executable file", "output.bin");

commander.parse(process.argv);

async function processFile() {
  const file = await readFileAsync(commander.file);
  const lines = file.split("\n");

  const memory = createMemory(256);
  const wBytes = new Uint16Array(memory.buffer);

  lines.forEach((line, index) => {
    wBytes[index] = parseInt(line, 2);
    // console.log(
    //   index,
    //   line,
    //   wBytes[index],
    //   wBytes[index].toString(2).padStart(16, "0"),
    //   memory.getUint16(index * 2, true),
    //   memory
    //     .getUint16(index * 2, true)
    //     .toString(2)
    //     .padStart(16, "0")
    // );
  });

  const mm = new MemoryController();
  mm.map('memory', memory, 0, 0xffff);
  mm.map('display', createDisplayDevice(25), 0x3000, 0x30ff);

  const cpu = new CPU(mm);

  cpu.run();
}

processFile();
