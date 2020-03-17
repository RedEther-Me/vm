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

async function assemble({ main, output, files }) {
  const input = await readFileAsync(main);
  const result = await assembler(input);

  await writeFileAsync(outputName(main, output), result);
}

async function runner() {
  const { source, output, makefile } = commander;

  if (makefile) {
    const config = await yaml.read(`${makefile}/makefile`);

    await Object.entries(config).reduce(
      async (prev, [key, { main, files = [] }]) => {
        await prev;
        await assemble({
          main: `${makefile}/${key}/${main}`,
          files: files.map(f => `${makefile}/${key}/${f}`)
        });
        return;
      },
      Promise.resolve()
    );
  } else {
    assemble({ main: source, output });
  }
}

try {
  runner();
} catch (err) {
  console.log(err);
}
