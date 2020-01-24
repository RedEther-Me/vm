main:
  PUSH 4
  PUSH 1
  CALL add4
  TERM

## This label will automatically load X arguments into registers,
##   where X is the last value pushed on the stack before transition
add4:
  RET
