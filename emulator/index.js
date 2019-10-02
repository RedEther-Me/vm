const commander = require("commander");

const { readFileAsync } = require("../helpers");

const createMemory = require("./memory");
const CPU = require("./cpu");

commander.option("-f, --file [file]", "executable file", "output.bin");

commander.parse(process.argv);

async function processFile() {
  const file = await readFileAsync(commander.file);
  const lines = file.split("\n");

  const memory = createMemory(256);
  const wBytes = new Uint16Array(memory.buffer);

  lines.forEach((line, index) => {
    wBytes[index] = parseInt(line, 2);
  });

  console.log(memory);

  const cpu = new CPU(memory);

  while (true) {
    cpu.step();
  }
}

processFile();

// const createMemory = require("./memory");
// const CPU = require("./cpu");
// const instructions = require("./instructions");

// const memory = createMemory(256);
// const wBytes = new Uint8Array(memory.buffer);

// const cpu = new CPU(memory);

// wBytes[0] = instructions.MOV_LIT_R1;
// wBytes[1] = 0x0;
// wBytes[2] = 0x1;

// wBytes[3] = instructions.MOV_LIT_R2;
// wBytes[4] = 0x0;
// wBytes[5] = 0x3;

// wBytes[6] = instructions.ADD_REG_REG;
// wBytes[7] = 2;
// wBytes[8] = 3;

// wBytes[6] = instructions.ADD_REG_REG;
// wBytes[7] = 2;
// wBytes[8] = 3;

// wBytes[9] = instructions.PRINT_REG;
// wBytes[10] = 1;

// wBytes[11] = instructions.TERMINATE;

// while (true) {
//   cpu.step();
// }
