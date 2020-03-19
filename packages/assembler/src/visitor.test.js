import generator from "./visitor";

import INSTRUCTIONS from "../emulator/instructions";

const i2s = (command, length = 8) =>
  command.instruction.toString(2).padStart(length, "0");

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
    describe.only("load", () => {
      it("LOAD 0x3000 r4", () => {
        const result = tester.load({
          children: {
            REG: [{ image: "r4" }],
            reg_hex: [
              {
                children: {
                  HEX_VALUE: [{ image: "0x3000" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.LOAD_ADR),
          "01010000",
          "0011000000000000"
        ]);
      });

      it("LOAD r3 r4", () => {
        const result = tester.load({
          children: {
            REG: [{ image: "r4" }],
            reg_hex: [
              {
                children: {
                  REG: [{ image: "r3" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([i2s(INSTRUCTIONS.LOAD_REG), "01010100"]);
      });
    });

    describe.only("store", () => {
      it("STORE r4 0x3000", () => {
        const result = tester.store({
          children: {
            reg_lit_hex_char: [
              {
                children: {
                  REG: [{ image: "r4" }]
                }
              }
            ],
            reg_hex: [
              {
                children: {
                  HEX_VALUE: [{ image: "0x3000" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.STORE_REG_HEX),
          "00000101",
          "0011000000000000"
        ]);
      });

      it("STORE 0x01 0x3000", () => {
        const result = tester.store({
          children: {
            reg_lit_hex_char: [
              {
                children: {
                  HEX_VALUE: [{ image: "0x01" }]
                }
              }
            ],
            reg_hex: [
              {
                children: {
                  HEX_VALUE: [{ image: "0x3000" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.STORE_LIT_HEX),
          "0000000000000001",
          "0011000000000000"
        ]);
      });

      it("STORE 5 0x3000", () => {
        const result = tester.store({
          children: {
            reg_lit_hex_char: [
              {
                children: {
                  LITERAL: [{ image: "5" }]
                }
              }
            ],
            reg_hex: [
              {
                children: {
                  HEX_VALUE: [{ image: "0x3000" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.STORE_LIT_HEX),
          "0000000000000101",
          "0011000000000000"
        ]);
      });

      it("STORE 'H' 0x3000", () => {
        const result = tester.store({
          children: {
            reg_lit_hex_char: [
              {
                children: {
                  CHAR: [{ image: "'H" }]
                }
              }
            ],
            reg_hex: [
              {
                children: {
                  HEX_VALUE: [{ image: "0x3000" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.STORE_LIT_HEX),
          "0000000001001000",
          "0011000000000000"
        ]);
      });

      it("STORE r4 r5", () => {
        const result = tester.store({
          children: {
            reg_lit_hex_char: [
              {
                children: {
                  REG: [{ image: "r4" }]
                }
              }
            ],
            reg_hex: [
              {
                children: {
                  REG: [{ image: "r5" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([i2s(INSTRUCTIONS.STORE_REG_REG), "01100101"]);
      });

      it("STORE 0x01 r5", () => {
        const result = tester.store({
          children: {
            reg_lit_hex_char: [
              {
                children: {
                  HEX_VALUE: [{ image: "0x01" }]
                }
              }
            ],
            reg_hex: [
              {
                children: {
                  REG: [{ image: "r5" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.STORE_LIT_REG),
          "01100000",
          "0000000000000001"
        ]);
      });

      it("STORE 5 r5", () => {
        const result = tester.store({
          children: {
            reg_lit_hex_char: [
              {
                children: {
                  LITERAL: [{ image: "5" }]
                }
              }
            ],
            reg_hex: [
              {
                children: {
                  REG: [{ image: "r5" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.STORE_LIT_REG),
          "01100000",
          "0000000000000101"
        ]);
      });

      it("STORE 'H' r5", () => {
        const result = tester.store({
          children: {
            reg_lit_hex_char: [
              {
                children: {
                  CHAR: [{ image: "'H'" }]
                }
              }
            ],
            reg_hex: [
              {
                children: {
                  REG: [{ image: "r5" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.STORE_LIT_REG),
          "01100000",
          "0000000001001000"
        ]);
      });
    });

    describe.only("copy", () => {
      it("COPY 0x3000 0x3001", () => {
        const result = tester.copy({
          children: {
            reg_hex: [
              {
                children: {
                  HEX_VALUE: [{ image: "0x3000" }]
                }
              },
              {
                children: {
                  HEX_VALUE: [{ image: "0x3001" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.COPY_HEX_HEX),
          "0011000000000000",
          "0011000000000001"
        ]);
      });

      it("COPY r3 r4", () => {
        const result = tester.copy({
          children: {
            reg_hex: [
              {
                children: {
                  REG: [{ image: "r3" }]
                }
              },
              {
                children: {
                  REG: [{ image: "r4" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([i2s(INSTRUCTIONS.COPY_REG_REG), "01010100"]);
      });

      it("COPY r4 0x3001", () => {
        const result = tester.copy({
          children: {
            reg_hex: [
              {
                children: {
                  REG: [{ image: "r4" }]
                }
              },
              {
                children: {
                  HEX_VALUE: [{ image: "0x3001" }]
                }
              }
            ]
          }
        });

        expect(result).toEqual([
          i2s(INSTRUCTIONS.COPY_REG_HEX),
          "00000101",
          "0011000000000001"
        ]);
      });

      it("COPY 0x3000 r4", () => {});
      const result = tester.copy({
        children: {
          reg_hex: [
            {
              children: {
                HEX_VALUE: [{ image: "0x3000" }]
              }
            },
            {
              children: {
                REG: [{ image: "r4" }]
              }
            }
          ]
        }
      });

      expect(result).toEqual([
        i2s(INSTRUCTIONS.COPY_HEX_REG),
        "01010000",
        "0011000000000000"
      ]);
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

      expect(result).toEqual(["01010100", "00110010"]);
    });

    it("valid - sub", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          SUB: []
        }
      });

      expect(result).toEqual(["01010101", "00110010"]);
    });

    it("valid - mult", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          MULT: []
        }
      });

      expect(result).toEqual(["01010110", "00110010"]);
    });

    it("valid - div", () => {
      const result = tester.arithmetic({
        children: {
          REG: [{ image: "r1" }, { image: "r2" }],
          DIV: []
        }
      });

      expect(result).toEqual(["01010111", "00110010"]);
    });
  });
});
