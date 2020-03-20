.code
  main:
    STORE 0x3000 0x3001
    STORE $r4 0x3001
    STORE 'H' 0x3001
    STORE 5 0x3001
    STORE 0x3000 $r4
    STORE $r3 $r4
    STORE 'H' $r4
    STORE 5 $r4
    TERM
