import convertFromInstruction from "./convertFromInstruction";

describe("convertFromInstruction.js", () => {
  it("valid instruction set", () => {
    const pattern = {
      V: { P: 0xff00, S: 8 },
      R: { P: 0x0030, S: 4 },
      I: { P: 0x000f, S: 0 }
    };
    const instructionString = "0000001100100001";
    const instruction = parseInt(instructionString, 2);

    const result = convertFromInstruction(pattern, instruction);

    expect(result).toEqual({ V: 3, R: 2, I: 1 });
  });
});
