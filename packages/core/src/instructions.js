const TERMINATE = "TERMINATE";

const MOV_LIT_REG = "MOV_LIT_REG";
const MOV_REG_REG = "MOV_REG_REG";

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

const CAL_LIT = "CAL_LIT";
const CAL_REG = "CAL_REG";
const RET = "RET";

const JMP_NOT_EQ = "JMP_NOT_EQ";

const PSH_LIT = "PSH_LIT";
const PSH_REG = "PSH_REG";
const POP = "POP";

const ARITH_ADD_REG = "ARITH_ADD_REG";
const ARITH_ADD_LIT = "ARITH_ADD_LIT";
const ARITH_SUB_REG = "ARITH_SUB_REG";
const ARITH_SUB_LIT = "ARITH_SUB_LIT";
const ARITH_MULT_REG = "ARITH_MULT_REG";
const ARITH_MULT_LIT = "ARITH_MULT_LIT";
const ARITH_DIV_REG = "ARITH_DIV_REG";
const ARITH_DIV_LIT = "ARITH_DIV_LIT";

const CMP_REG = "CMP_REG";
const CMP_LIT = "CMP_LIT";

const SRA_REG = "SRA_REG";
const SRA_LIT = "SRA_LIT";
const SLA_REG = "SLA_REG";
const SLA_LIT = "SLA_LIT";
const AND_REG = "AND_REG";
const AND_LIT = "AND_LIT";
const OR_REG = "OR_REG";
const OR_LIT = "OR_LIT";
const XOR_REG = "XOR_REG";
const XOR_LIT = "XOR_LIT";

const instructions = {
  [TERMINATE]: 0x00,

  [MOV_LIT_REG]: 0x01,
  [MOV_REG_REG]: 0x02,

  [CAL_LIT]: 0x10,
  [CAL_REG]: 0x11,
  [RET]: 0x13,
  [JMP_NOT_EQ]: 0x15,

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

  [ARITH_ADD_REG]: 0x60,
  [ARITH_ADD_LIT]: 0x61,
  [ARITH_SUB_REG]: 0x62,
  [ARITH_SUB_LIT]: 0x63,
  [ARITH_MULT_REG]: 0x64,
  [ARITH_MULT_LIT]: 0x65,
  [ARITH_DIV_REG]: 0x66,
  [ARITH_DIV_LIT]: 0x67,
  [CMP_REG]: 0x6a,
  [CMP_LIT]: 0x6b,

  [SRA_REG]: 0x70,
  [SRA_LIT]: 0x71,
  [SLA_REG]: 0x72,
  [SLA_LIT]: 0x73,
  [AND_REG]: 0x74,
  [AND_LIT]: 0x75,
  [OR_REG]: 0x76,
  [OR_LIT]: 0x77,
  [XOR_REG]: 0x78,
  [XOR_LIT]: 0x79
};

export default {
  [TERMINATE]: {
    instruction: instructions[TERMINATE]
  },

  [MOV_LIT_REG]: {
    instruction: instructions[MOV_LIT_REG],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [MOV_REG_REG]: {
    instruction: instructions[MOV_REG_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
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

  [ARITH_ADD_REG]: {
    instruction: instructions[ARITH_ADD_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_ADD_LIT]: {
    instruction: instructions[ARITH_ADD_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_SUB_REG]: {
    instruction: instructions[ARITH_SUB_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_SUB_LIT]: {
    instruction: instructions[ARITH_SUB_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_MULT_REG]: {
    instruction: instructions[ARITH_MULT_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_MULT_LIT]: {
    instruction: instructions[ARITH_MULT_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_DIV_REG]: {
    instruction: instructions[ARITH_DIV_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ARITH_DIV_LIT]: {
    instruction: instructions[ARITH_DIV_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [CMP_REG]: {
    instruction: instructions[CMP_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [CMP_LIT]: {
    instruction: instructions[CMP_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [SRA_REG]: {
    instruction: instructions[SRA_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [SRA_LIT]: {
    instruction: instructions[SRA_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [SLA_REG]: {
    instruction: instructions[SLA_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [SLA_LIT]: {
    instruction: instructions[SLA_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [AND_REG]: {
    instruction: instructions[AND_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [AND_LIT]: {
    instruction: instructions[AND_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [OR_REG]: {
    instruction: instructions[OR_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [OR_LIT]: {
    instruction: instructions[OR_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [XOR_REG]: {
    instruction: instructions[XOR_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [XOR_LIT]: {
    instruction: instructions[XOR_LIT],
    mask: "TTTT0000",
    pattern: {
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
