.code
  main:
    MOV -10 r1

    MOV r1 r2
    SRA 15 r2

    MOV r1 r4
    ADD r2 r4
    XOR r4 r2             ## $r2 has absolute value of $r1 now

    MOV 10 r1

    MOV r1 r3
    SRA 15 r3

    MOV r1 r4
    ADD r3 r4
    XOR r4 r3             ## $r3 has absolute value of $r1 now

    TERM
