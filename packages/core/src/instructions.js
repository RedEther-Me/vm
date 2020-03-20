const TERMINATE = "TERMINATE";

const MOV_LIT_REG = "MOV_LIT_REG";
const MOV_REG_REG = "MOV_REG_REG";

const STORE_REG_HEX = "STORE_REG_HEX";
const STORE_REG_REG = "STORE_REG_REG";
const STORE_LIT_HEX = "STORE_LIT_HEX";
const STORE_LIT_REG = "STORE_LIT_REG";
const STORE_REL_REG_HEX = "STORE_REL_REG_HEX";
const STORE_REL_LIT_HEX = "STORE_REL_LIT_HEX";

const LOAD_ADR = "LOAD_ADR";
const LOAD_REG = "LOAD_REG";
const LOAD_REL_ADR = "LOAD_REL_ADR";

const COPY_HEX_HEX = "COPY_HEX_HEX";
const COPY_REG_REG = "COPY_REG_REG";
const COPY_REG_HEX = "COPY_REG_HEX";
const COPY_HEX_REG = "COPY_HEX_REG";

const CAL_LIT = "CAL_LIT";
const CAL_REG = "CAL_REG";
const RET = "RET";

const JMP_NOT_EQ = "JMP_NOT_EQ";
const JMP_EQ = "JMP_EQ";
const JMP = "JMP";

const PSH_LIT = "PSH_LIT";
const PSH_REG = "PSH_REG";
const POP = "POP";

const ADD_REG = "ADD_REG";
const ADD_LIT = "ADD_LIT";
const ADDU_REG = "ADDU_REG";
const ADDU_LIT = "ADDU_LIT";
const SUB_REG = "SUB_REG";
const SUB_LIT = "SUB_LIT";
const MULT_REG = "MULT_REG";
const MULT_LIT = "MULT_LIT";
const DIV_REG = "DIV_REG";
const DIV_LIT = "DIV_LIT";
const MOD_REG = "MOD_REG";
const MOD_LIT = "MOD_LIT";

const CMP_REG = "CMP_REG";
const CMP_LIT = "CMP_LIT";
const CMPU_REG = "CMPU_REG";
const CMPU_LIT = "CMPU_LIT";

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

const SET_IVT = "SET_IVT";

const instructions = {
  [TERMINATE]: 0x00,

  [MOV_LIT_REG]: 0x01,
  [MOV_REG_REG]: 0x02,

  [CAL_LIT]: 0x10,
  [CAL_REG]: 0x11,
  [RET]: 0x13,
  [JMP_NOT_EQ]: 0x15,
  [JMP_EQ]: 0x16,
  [JMP]: 0x17,

  [PSH_LIT]: 0x21,
  [PSH_REG]: 0x22,
  [POP]: 0x23,

  [STORE_REG_HEX]: 0x30,
  [STORE_REG_REG]: 0x31,
  [STORE_LIT_HEX]: 0x32,
  [STORE_LIT_REG]: 0x33,
  [STORE_REL_REG_HEX]: 0x34,
  [STORE_REL_LIT_HEX]: 0x35,

  [LOAD_ADR]: 0x40,
  [LOAD_REG]: 0x41,
  [LOAD_REL_ADR]: 0x42,

  [COPY_HEX_HEX]: 0x50,
  [COPY_REG_REG]: 0x51,
  [COPY_REG_HEX]: 0x52,
  [COPY_HEX_REG]: 0x53,

  [ADD_REG]: 0x60,
  [ADD_LIT]: 0x61,
  [ADDU_REG]: 0x62,
  [ADDU_LIT]: 0x63,

  [SUB_REG]: 0x64,
  [SUB_LIT]: 0x65,

  [MULT_REG]: 0x66,
  [MULT_LIT]: 0x67,

  [DIV_REG]: 0x68,
  [DIV_LIT]: 0x69,

  [MOD_REG]: 0x6a,
  [MOD_LIT]: 0x6b,

  [CMP_REG]: 0x6c,
  [CMP_LIT]: 0x6d,
  [CMPU_REG]: 0x6e,
  [CMPU_LIT]: 0x6f,

  [SRA_REG]: 0x80,
  [SRA_LIT]: 0x81,
  [SLA_REG]: 0x82,
  [SLA_LIT]: 0x83,
  [AND_REG]: 0x84,
  [AND_LIT]: 0x85,
  [OR_REG]: 0x86,
  [OR_LIT]: 0x87,
  [XOR_REG]: 0x88,
  [XOR_LIT]: 0x89,

  [SET_IVT]: 0xf0
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

  [STORE_REL_REG_HEX]: {
    instruction: instructions[STORE_REL_REG_HEX],
    mask: "0000SSSS",
    pattern: {
      S: { P: 0x0f, S: 0 }
    }
  },

  [STORE_REL_LIT_HEX]: {
    instruction: instructions[STORE_REL_LIT_HEX]
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

  [LOAD_REL_ADR]: {
    instruction: instructions[LOAD_REL_ADR],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [COPY_HEX_HEX]: {
    instruction: instructions[COPY_HEX_HEX]
  },

  [COPY_REG_REG]: {
    instruction: instructions[COPY_REG_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [COPY_REG_HEX]: {
    instruction: instructions[COPY_REG_HEX],
    mask: "0000SSSS",
    pattern: {
      S: { P: 0x0f, S: 0 }
    }
  },

  [COPY_HEX_REG]: {
    instruction: instructions[COPY_HEX_REG],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [JMP_NOT_EQ]: {
    instruction: instructions[JMP_NOT_EQ]
  },

  [JMP_EQ]: {
    instruction: instructions[JMP_EQ]
  },

  [JMP]: {
    instruction: instructions[JMP]
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

  [ADD_REG]: {
    instruction: instructions[ADD_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ADDU_REG]: {
    instruction: instructions[ADDU_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [ADD_LIT]: {
    instruction: instructions[ADD_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [ADDU_LIT]: {
    instruction: instructions[ADDU_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [SUB_REG]: {
    instruction: instructions[SUB_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [SUB_LIT]: {
    instruction: instructions[SUB_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [MULT_REG]: {
    instruction: instructions[MULT_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [MULT_LIT]: {
    instruction: instructions[MULT_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [DIV_REG]: {
    instruction: instructions[DIV_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [DIV_LIT]: {
    instruction: instructions[DIV_LIT],
    mask: "TTTT0000",
    pattern: {
      T: { P: 0xf0, S: 4 }
    }
  },

  [MOD_REG]: {
    instruction: instructions[MOD_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [MOD_LIT]: {
    instruction: instructions[MOD_LIT],
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

  [CMPU_REG]: {
    instruction: instructions[CMPU_REG],
    mask: "TTTTSSSS",
    pattern: {
      S: { P: 0x0f, S: 0 },
      T: { P: 0xf0, S: 4 }
    }
  },

  [CMPU_LIT]: {
    instruction: instructions[CMPU_LIT],
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
  },

  [SET_IVT]: {
    instruction: instructions[SET_IVT]
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
