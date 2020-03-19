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
const dataRegex = /\.data[.\s\S]*\.code/gm;
const codeRegex = /\.code[.\s\S]*/gm;

function splitData(fileString) {
  const [data] = fileString.match(dataRegex) || [];
  const innerData = data ? data.substring(5, data.length - 5) : data;

  const [code] = fileString.match(codeRegex) || [];
  const innerCode = code.substring(5);

  return { data: innerData, code: innerCode };
}

async function assemble({ main, output, files }) {
  const input = await readFileAsync(main);

  const filePromises = files.map(f => readFileAsync(f));
  const joinFiles = await Promise.all(filePromises);

  const { data, code } = joinFiles.reduce((acc, file) => {
    const { data: d, code: c } = splitData(file);
    return {
      data: acc.data + d,
      code: acc.code + c
    };
  }, splitData(input));

  const printData = data ? `.data\n${data}\n` : "";
  const final = `${printData}\n.code\n${code}`;
  // console.log(final);

  const result = await assembler(final);

  await writeFileAsync(outputName(main, output), result);
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
