.code
  main:
    MOV 3 r1
    MOV 4 r2
    ADD r1 r2
    MOV 0xFF00 r4
    STORE r4 0x3000
    MOV 'H' r4
    STORE r4 0x3001
    MOV 'e' r4
    STORE r4 0x3002
    MOV 'l' r4
    STORE r4 0x3003
    MOV 'l' r4
    STORE r4 0x3004
    MOV 'o' r4
    STORE r4 0x3005
    MOV ',' r4
    STORE r4 0x3006
    MOV ' ' r4
    STORE r4 0x3007
    MOV 'W' r4
    STORE r4 0x3008
    MOV 'o' r4
    STORE r4 0x3009
    MOV 'r' r4
    STORE r4 0x300a
    MOV 'l' r4
    STORE r4 0x300b
    MOV 'd' r4
    STORE r4 0x300c
    MOV '!' r4
    STORE r4 0x300d
    TERM
