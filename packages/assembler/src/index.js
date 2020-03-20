import commander from "commander";
import yaml from "node-yaml";

import { readFileAsync, writeFileAsync } from "@emulator/core";

import preprocessor from "./pre-processor/pre-processor.js";
import processor from "./processor/processor.js";
import postProcessor from "./post-processor/post-processor.js";

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

  const filePromises = files.map(async f => [f, await readFileAsync(f)]);

  const joinFiles = await Promise.all(filePromises);

  const globals = await joinFiles.reduce(async (acc, [name, fileContents]) => {
    const globals = await preprocessor(fileContents);

    return globals.reduce((inner, global) => {
      if (inner[global.name]) {
        throw new Error(`Global Previously Defined: ${global.name}`);
      }

      return {
        ...inner,
        [global.name]: { ...global, file: name }
      };
    }, acc);
  }, {});

  const result = await processor({ input, globals, filename: "main" });

  const test = await joinFiles.reduce(
    async (acc, [filename, fileContents]) => [
      ...acc,
      ...(await processor({
        input: fileContents,
        globals,
        filename: filename.substring(filename.lastIndexOf("/") + 1)
      }))
    ],
    result
  );

  await writeFileAsync(outputName(main, output), postProcessor(test, globals));
}

async function runner() {
  const { source, output, makefile } = commander;

  if (makefile) {
    const [filename, command] = makefile.split(":");
    const config = await yaml.read(`${filename}/makefile`);

    const entries = command
      ? [[command, config[command]]]
      : Object.entries(config);

    await entries.reduce(async (prev, [key, { main, files = [] }]) => {
      await prev;
      console.log(`${filename}/${key}/${main}`);
      await assemble({
        main: `${filename}/${key}/${main}`,
        files: files.map(f => `${filename}/${key}/${f}`)
      });
      return;
    }, Promise.resolve());
  } else {
    assemble({ main: source, output });
  }
}

try {
  runner();
} catch (err) {
  console.log(err);
}
