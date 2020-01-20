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

  MOV_REG_MEM: {
    instruction: 0x2,
    mask: "0000000000RRIIII",
    pattern: {
      R: { P: 0x0030, S: 4 },
      I: { P: 0x000f, S: 0 }
    }
  },

  ARITHMETIC: {
    instruction: 0x4,
    mask: "000000OOSSTTIIII",
    pattern: {
      O: { P: 0xff00, S: 8 },
      S: { P: 0x00c0, S: 6 },
      T: { P: 0x0030, S: 4 },
      I: { P: 0x000f, S: 0 }
    }
  }
};

// Common masks
// XXXXXXXX00000000 0xFF00
// 00000000XX000000 0x00?0
// 0000000000XX0000 0x0030
// 000000000000XXXX 0x000F

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