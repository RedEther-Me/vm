import commander from "commander";

import { readFileAsync, writeFileAsync } from "../helpers/index.js";

import assembler from "./assembler.js";

commander
  .option("-s, --source [file].asm", "asm source file")
  .option("-o, --output [file].bin", "output binary file");

commander.parse(process.argv);

function outputName(source, output) {
  if (output) {
    return output;
  }

  const endsWithAsm = source.toUpperCase().indexOf(".ASM");
  const base = endsWithAsm
    ? source.substring(0, source.lastIndexOf("."))
    : source;

  return `${base}.bin`;
}

async function runner() {
  const { source, output } = commander;

  const input = await readFileAsync(source);
  const result = await assembler(input);

  await writeFileAsync(outputName(source, output), result);
}

runner();
