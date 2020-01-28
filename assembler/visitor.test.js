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

  describe("memory", () => {
    describe("load", () => {
      it("LOAD 0x3000 r4", () => {
        const result = tester.load({
          children: {
            REG: [{ image: "r4" }],
            HEX_VALUE: [{ image: "0x3000" }]
          }
        });

        expect(result).toEqual(["00000100", "00000101", "0011000000000000"]);
      });
    });

    describe("store", () => {
      it("STORE r4 0x3000", () => {
        const result = tester.store({
          children: {
            REG: [{ image: "r4" }],
            HEX_VALUE: [{ image: "0x3000" }]
          }
        });

        expect(result).toEqual(["00000010", "00000101", "0011000000000000"]);
      });

      it("STORE 0x01 0x3000", () => {
        const result = tester.store({
          children: {
            HEX_VALUE: [{ image: "0x01" }, { image: "0x3000" }]
          }
        });

        expect(result).toEqual([
          "00000011",
          "0000000000000001",
          "0011000000000000"
        ]);
      });

      it("STORE 5 0x3000", () => {
        const result = tester.store({
          children: {
            LITERAL: [{ image: "5" }],
            HEX_VALUE: [{ image: "0x3000" }]
          }
        });

        expect(result).toEqual([
          "00000011",
          "0000000000000101",
          "0011000000000000"
        ]);
      });

      it("STORE 'H' 0x3000", () => {
        const result = tester.store({
          children: {
            CHAR: [{ image: "'H'" }],
            HEX_VALUE: [{ image: "0x3000" }]
          }
        });

        expect(result).toEqual([
          "00000011",
          "0000000001001000",
          "0011000000000000"
        ]);
      });
    });

    describe("copy", () => {
      it("COPY 0x3000 0x3001", () => {
        const result = tester.copy({
          children: {
            HEX_VALUE: [{ image: "0x3000" }, { image: "0x3001" }]
          }
        });

        expect(result).toEqual([
          "00000101",
          "0011000000000000",
          "0011000000000001"
        ]);
      });

      it("COPY r3 r4", () => {
        const result = tester.copy({
          children: {
            REG: [{ image: "r3" }, { image: "r4" }]
          }
        });

        expect(result).toEqual(["00000110", "01010100"]);
      });

      it("COPY r4 0x3001", () => {
        const result = tester.copy({
          children: {
            REG: [{ image: "r4", startOffset: 0 }],
            HEX_VALUE: [{ image: "0x3001", startOffset: 1 }]
          }
        });

        expect(result).toEqual(["00000111", "00000101", "0011000000000001"]);
      });

      it("COPY 0x3000 r4", () => {
        const result = tester.copy({
          children: {
            REG: [{ image: "r4", startOffset: 1 }],
            HEX_VALUE: [{ image: "0x3000", startOffset: 0 }]
          }
        });

        expect(result).toEqual(["00001000", "01010000", "0011000000000000"]);
      });
    });
  });

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
