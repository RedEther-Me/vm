.code
  main:
    MOV -10 r1
    MOV -1 r2

    SRA 15 r1
    SLA 15 r1
    AND -1 r1
    AND r2 r1
    OR -1 r1
    OR r2 r1
    XOR -1 r1
    XOR r2 r1

    TERM
