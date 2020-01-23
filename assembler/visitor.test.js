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

      expect(result).toEqual(["01010100", "00001011"]);
    });

    it("valid - sub", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          SUB: []
        }
      });

      expect(result).toEqual(["01010100", "00011011"]);
    });

    it("valid - mult", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          MULT: []
        }
      });

      expect(result).toEqual(["01010100", "00111011"]);
    });

    it("valid - div", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          DIV: []
        }
      });

      expect(result).toEqual(["01010100", "00101011"]);
    });
  });
});
