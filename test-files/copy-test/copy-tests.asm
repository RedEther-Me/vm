.code
  main:
    COPY 0x3000 0x3001
    COPY r4 0x3001
    COPY 0x3000 r4
    COPY r3 r4
    TERM
