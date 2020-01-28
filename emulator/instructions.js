module.exports = {
  TERMINATE: {
    instruction: 0x00
  },

  MOV_LIT_REG: {
    instruction: 0x01,
    mask: "0000RRRR",
    pattern: {
      R: { P: 0x0f, S: 0 }
    }
  },

  STORE_REG_HEX: {
    instruction: 0x30,
    mask: "0000SSSS",
    pattern: {
      S: { P: 0x0f, S: 0 }
    }
  },

  STORE_REG_REG: {
    instruction: 0x31,
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  STORE_LIT_HEX: {
    instruction: 0x32
  },

  STORE_LIT_REG: {
    instruction: 0x33,
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  LOAD_REG: {
    instruction: 0x40,
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  LOAD_ADR: {
    instruction: 0x41,
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  COPY_MEM_HEX_HEX: {
    instruction: 0x05
  },

  COPY_MEM_REG_REG: {
    instruction: 0x06,
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  COPY_MEM_REG_HEX: {
    instruction: 0x07,
    mask: "0000SSSS",
    pattern: {
      S: { P: 0x0f, S: 0 }
    }
  },

  COPY_MEM_HEX_REG: {
    instruction: 0x08,
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  JMP_NOT_EQ: {
    instruction: 0x11
  },

  CAL_LIT: {
    instruction: 0x12
  },

  CAL_REG: {
    instruction: 0x13,
    mask: "0000RRRR",
    pattern: {
      R: { P: 0x0f, S: 0 }
    }
  },

  RET: {
    instruction: 0x14
  },

  PSH_LIT: {
    instruction: 0x21
  },

  PSH_REG: {
    instruction: 0x22,
    mask: "0000RRRR",
    pattern: {
      R: { P: 0x0f, S: 0 }
    }
  },

  POP: {
    instruction: 0x23,
    mask: "0000RRRR",
    pattern: {
      R: { P: 0x0f, S: 0 }
    }
  },

  ARITH_ADD: {
    instruction: 0x54,
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  ARITH_SUB: {
    instruction: 0x55,
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  ARITH_MULT: {
    instruction: 0x56,
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  ARITH_DIV: {
    instruction: 0x57,
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  }
};

// Common masks
// XX000000 0xc0
// 00XX0000 0x30
// 0000XX00 0x0c
// 000000XX 0x03
// 0000XXXX 0x0F

// 0000 0   0
// 0001 1   1
// 0010 2   2
// 0011 3   3
// 0100 4   4
// 0101 5   5
// 0110 6   6
// 0111 7   7
// 1000 8   8
// 1001 9   9
// 1010 10  a
// 1011 11  b
// 1100 12  c
// 1101 13  d
// 1110 14  e
// 1111 15  f
