const convertToInstruction = require("./convertToInstruction");

describe("convertToInstruction.js", () => {
  it("valid instruction set", () => {
    const pattern = {
      V: { P: 0xff00, S: 8 },
      R: { P: 0x0030, S: 4 },
      I: { P: 0x000f, S: 0 }
    };
    const args = { V: 3, R: 2, I: 1 };

    const result = convertToInstruction(pattern, args);

    expect(result.toString(2).padStart(16, "0")).toEqual("0000001100100001");
  });
});
