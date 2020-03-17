import commander from "commander";
import yaml from "node-yaml";

import { readFileAsync, writeFileAsync } from "@emulator/core";

import assembler from "./assembler.js";

commander
  .option("-m, --makefile [folder]", "makefile")
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

async function assemble(source, output) {
  const input = await readFileAsync(source);
  const result = await assembler(input);

  await writeFileAsync(outputName(source, output), result);
}

async function runner() {
  const { source, output, makefile } = commander;

  if (makefile) {
    const config = await yaml.read(`${makefile}/makefile`);

    await Object.entries(config).reduce(async (prev, [key, files]) => {
      await prev;
      await assemble(`${makefile}/${key}/${files[0]}`);
      return;
    }, Promise.resolve());
  } else {
    assemble(source, output);
  }
}

try {
  runner();
} catch (err) {
  console.log(err);
}
