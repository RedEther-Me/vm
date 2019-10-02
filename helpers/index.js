const readFileAsync = require("./readFileAsync");
const writeFileAsync = require("./writeFileAsync");

const convertToInstruction = require("./convertToInstruction");
const convertFromInstruction = require("./convertFromInstruction");

module.exports = {
  readFileAsync,
  writeFileAsync,
  convertToInstruction,
  convertFromInstruction
};
