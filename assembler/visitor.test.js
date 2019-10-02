const generator = require("./visitor");

describe("convertToInstruction.js", () => {
  const TestClass = generator({
    getBaseCstVisitorConstructor: () => {
      class Test {
        validateVisitor() {}
      }

      return Test;
    }
  });

  const tester = new TestClass();

  describe("arithmetic", () => {
    it("valid - add", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          ADD: []
        }
      });

      expect(result).toEqual("0000000010110100");
    });

    it("valid - sub", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          SUB: []
        }
      });

      expect(result).toEqual("0000000110110100");
    });

    it("valid - mult", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          MULT: []
        }
      });

      expect(result).toEqual("0000001110110100");
    });

    it("valid - div", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          DIV: []
        }
      });

      expect(result).toEqual("0000001010110100");
    });
  });
});
