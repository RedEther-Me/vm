const TERMINATE = "TERMINATE";

const MOV_LIT_REG = "MOV_LIT_REG";

const STORE_REG_HEX = "STORE_REG_HEX";
const STORE_REG_REG = "STORE_REG_REG";
const STORE_LIT_HEX = "STORE_LIT_HEX";
const STORE_LIT_REG = "STORE_LIT_REG";

const LOAD_ADR = "LOAD_ADR";
const LOAD_REG = "LOAD_REG";

const COPY_MEM_HEX_HEX = "COPY_MEM_HEX_HEX";
const COPY_MEM_REG_REG = "COPY_MEM_REG_REG";
const COPY_MEM_REG_HEX = "COPY_MEM_REG_HEX";
const COPY_MEM_HEX_REG = "COPY_MEM_HEX_REG";

const JMP_NOT_EQ = "JMP_NOT_EQ";
const CAL_LIT = "CAL_LIT";
const CAL_REG = "CAL_REG";
const RET = "RET";

const PSH_LIT = "PSH_LIT";
const PSH_REG = "PSH_REG";
const POP = "POP";

const ARITH_ADD = "ARITH_ADD";
const ARITH_SUB = "ARITH_SUB";
const ARITH_MULT = "ARITH_MULT";
const ARITH_DIV = "ARITH_DIV";

const instructions = {
  [TERMINATE]: 0x00,

  [MOV_LIT_REG]: 0x01,

  [JMP_NOT_EQ]: 0x10,
  [CAL_LIT]: 0x11,
  [CAL_REG]: 0x12,
  [RET]: 0x13,

  [PSH_LIT]: 0x21,
  [PSH_REG]: 0x22,
  [POP]: 0x23,

  [STORE_REG_HEX]: 0x30,
  [STORE_REG_REG]: 0x31,
  [STORE_LIT_HEX]: 0x32,
  [STORE_LIT_REG]: 0x33,

  [LOAD_ADR]: 0x40,
  [LOAD_REG]: 0x41,

  [COPY_MEM_HEX_HEX]: 0x50,
  [COPY_MEM_REG_REG]: 0x51,
  [COPY_MEM_REG_HEX]: 0x52,
  [COPY_MEM_HEX_REG]: 0x53,

  [ARITH_ADD]: 0x60,
  [ARITH_SUB]: 0x61,
  [ARITH_MULT]: 0x62,
  [ARITH_DIV]: 0x63
};

export default {
  [TERMINATE]: {
    instruction: instructions[TERMINATE]
  },

  [MOV_LIT_REG]: {
    instruction: instructions[MOV_LIT_REG],
    mask: "0000RRRR",
    pattern: {
      R: { P: 0x0f, S: 0 }
    }
  },

  [STORE_REG_HEX]: {
    instruction: instructions[STORE_REG_HEX],
    mask: "0000SSSS",
    pattern: {
      S: { P: 0x0f, S: 0 }
    }
  },

  [STORE_REG_REG]: {
    instruction: instructions[STORE_REG_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [STORE_LIT_HEX]: {
    instruction: instructions[STORE_LIT_HEX]
  },

  [STORE_LIT_REG]: {
    instruction: instructions[STORE_LIT_REG],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [LOAD_ADR]: {
    instruction: instructions[LOAD_ADR],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [LOAD_REG]: {
    instruction: instructions[LOAD_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [COPY_MEM_HEX_HEX]: {
    instruction: instructions[COPY_MEM_HEX_HEX]
  },

  [COPY_MEM_REG_REG]: {
    instruction: instructions[COPY_MEM_REG_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [COPY_MEM_REG_HEX]: {
    instruction: instructions[COPY_MEM_REG_HEX],
    mask: "0000SSSS",
    pattern: {
      S: { P: 0x0f, S: 0 }
    }
  },

  [COPY_MEM_HEX_REG]: {
    instruction: instructions[COPY_MEM_HEX_REG],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [JMP_NOT_EQ]: {
    instruction: instructions[JMP_NOT_EQ]
  },

  [CAL_LIT]: {
    instruction: instructions[CAL_LIT]
  },

  [CAL_REG]: {
    instruction: instructions[CAL_REG],
    mask: "0000RRRR",
    pattern: {
      R: { P: 0x0f, S: 0 }
    }
  },

  [RET]: {
    instruction: instructions[RET]
  },

  [PSH_LIT]: {
    instruction: instructions[PSH_LIT]
  },

  [PSH_REG]: {
    instruction: instructions[PSH_REG],
    mask: "0000RRRR",
    pattern: {
      R: { P: 0x0f, S: 0 }
    }
  },

  [POP]: {
    instruction: instructions[POP],
    mask: "0000RRRR",
    pattern: {
      R: { P: 0x0f, S: 0 }
    }
  },

  [ARITH_ADD]: {
    instruction: instructions[ARITH_ADD],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_SUB]: {
    instruction: instructions[ARITH_SUB],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_MULT]: {
    instruction: instructions[ARITH_MULT],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_DIV]: {
    instruction: instructions[ARITH_DIV],
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
