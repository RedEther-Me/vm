main:
  ## Call Clear Screen
  PUSH 0
  CALL clearScreen

  ## Call Print 'Hello World'
  MEM 0x1001 'H'
  MEM 0x1002 'e'
  MEM 0x1003 'l'
  MEM 0x1004 'l'
  MEM 0x1005 'o'
  MEM 0x1006 ' '
  MEM 0x1007 'W'
  MEM 0x1008 'o'
  MEM 0x1009 'r'
  MEM 0x100a 'l'
  MEM 0x100b 'd'
  MEM 0x100c '!'

  PUSH 0x1001
  PUSH 12
  PUSH 1
  CALL print

  ## Call Print Number
  PUSH 12345
  PUSH 1
  CALL printNum

  TERM

## Clear Screen
clearScreen:
  MOV 0xFF00 r4
  MEM 0x3000 r4
  RET


## Print X Characters from memory location
print:
  MOV 'H' r4
  MEM 0x3001 r4
  RET

## Print number as characters
printNum:
  MOV 'H' r4
  MEM 0x3001 r4
  RET
