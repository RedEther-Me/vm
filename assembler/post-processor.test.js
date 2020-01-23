const postProcessor = require("./post-processor");

const _8bits = "00000000";
const _16bits = "0000000000000000";

describe.only("postProcessor.js", () => {
  it("basic - no labels", () => {
    const program = [_8bits, _8bits, _8bits, _8bits];

    const result = postProcessor(program);

    expect(result).toEqual(program.join(""));
  });

  it("basic - only label", () => {
    const program = [
      _8bits,
      _8bits,
      { type: "key", name: "main" },
      _8bits,
      _8bits
    ];

    const result = postProcessor(program);

    expect(result).toEqual([_8bits, _8bits, _8bits, _8bits].join(""));
  });

  it("basic - one address", () => {
    const program = [
      _8bits,
      _8bits,
      { type: "key", name: "main" },
      _8bits,
      _8bits,
      { type: "address", name: "main" }
    ];

    const result = postProcessor(program);

    expect(result).toEqual(
      [_8bits, _8bits, _8bits, _8bits, "0000000000000010"].join("")
    );
  });

  it("basic with 16 offset - one address", () => {
    const program = [
      _8bits,
      _16bits,
      { type: "key", name: "main" },
      _8bits,
      _8bits,
      { type: "address", name: "main" }
    ];

    const result = postProcessor(program);

    expect(result).toEqual(
      [_8bits, _16bits, _8bits, _8bits, "0000000000000011"].join("")
    );
  });
});
