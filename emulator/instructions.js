module.exports = {
  TERMINATE: {
    instruction: 0x0
  },

  MOV_LIT_REG: {
    instruction: 0x1,
    mask: "000000RR",
    pattern: {
      R: { P: 0x03, S: 0 }
    },
    tail: 16
  },

  MOV_REG_MEM: {
    instruction: 0x2,
    mask: "000000RR",
    pattern: {
      R: { P: 0x03, S: 0 }
    },
    tail: 16
  },

  ARITHMETIC: {
    instruction: 0x4,
    mask: "00OOSSTT",
    pattern: {
      O: { P: 0x30, S: 4 },
      S: { P: 0x0c, S: 2 },
      T: { P: 0x03, S: 0 }
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
