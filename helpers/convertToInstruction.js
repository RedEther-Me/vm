import chalk from "chalk";

export default function convertToInstruction(pattern, values) {
  const colorMap = {
    N: i => i,
    I: chalk.yellow,
    T: chalk.blue,
    S: chalk.green,
    V: chalk.red
  };

  const value = Object.entries(pattern).reduce((acc, [key, pat]) => {
    const lookup = values[key];
    const calc = lookup << pat.S;

    return acc + calc;
  }, 0);
  //   const debug = splitInstructionPattern(pattern)
  //     .map(i => {
  //       const value = args[i[0] - 1] || 0;
  //       const padded = value.toString(2).padStart(i.length, "0");

  //       return colorMap[i[0]](padded);
  //     })
  //     .join("");
  //   const instruction = splitInstructionPattern(pattern)
  //     .map(i => {
  //       const value = args[i[0] - 1] || 0;
  //       const padded = value.toString(2).padStart(i.length, "0");

  //       return padded;
  //     })
  //     .join("");

  //   console.log(debug);

  return value;
}
