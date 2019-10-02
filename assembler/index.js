const commander = require("commander");

const { readFileAsync, writeFileAsync } = require("../helpers");

const assembler = require("./assembler");

commander
  .option("-s, --source [file]", "asm source file")
  .option("-o, --output [file].bin", "output binary file", "output.bin");

commander.parse(process.argv);

async function runner() {
  const input = await readFileAsync(commander.source);
  const result = await assembler(input);
  await writeFileAsync(commander.output, result);
}

runner();
