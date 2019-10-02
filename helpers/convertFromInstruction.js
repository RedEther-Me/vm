const chalk = require("chalk");

module.exports = function convertFromInstruction(pattern, instruction) {
  const colorMap = {
    N: i => i,
    I: chalk.yellow,
    T: chalk.blue,
    S: chalk.green,
    V: chalk.red
  };

  const result = Object.entries(pattern).reduce((acc, [key, pat]) => {
    const value = instruction & pat.P;
    const unshifted = value >> pat.S;

    return { ...acc, [key]: unshifted };
  }, {});

  return result;
};
