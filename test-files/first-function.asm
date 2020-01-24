main:
  MOV 0xFF00 r4
  MEM 0x3000 r4
  PUSH 4
  PUSH 1
  CALL add4
  MOV 'e' r4
  MEM 0x3002 r4
  TERM

## This label will automatically load X arguments into registers,
##   where X is the last value pushed on the stack before transition
add4:
  MOV 'H' r4
  MEM 0x3001 r4
  RET
