module.exports = {
  TERMINATE: {
    instruction: 0x0
  },

  MOV_LIT_REG: {
    instruction: 0x1,
    mask: "VVVVVVVV00RRIIII",
    pattern: {
      V: { P: 0xff00, S: 8 },
      R: { P: 0x0030, S: 4 },
      I: { P: 0x000f, S: 0 }
    }
  },

  ARITHMETIC: {
    instruction: 0x4,
    mask: "000000OOSSTTIIII",
    pattern: {
      O: { P: 0x3, S: 8 },
      S: { P: 0x3, S: 6 },
      T: { P: 0x3, S: 4 },
      I: { P: 0xf, S: 0 }
    }
  },

  PRINT_REG: 0x5
};
