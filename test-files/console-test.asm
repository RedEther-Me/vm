main:
  ## Call Clear Screen
  PUSH 0
  CALL clearScreen

  ## Call Print 'Hello World'
  STORE 'H' 0x1001 
  STORE 'e' 0x1002 
  STORE 'l' 0x1003 
  STORE 'l' 0x1004 
  STORE 'o' 0x1005 
  STORE ' ' 0x1006 
  STORE 'W' 0x1007 
  STORE 'o' 0x1008 
  STORE 'r' 0x1009 
  STORE 'l' 0x100a 
  STORE 'd' 0x100b 
  STORE '!' 0x100c 

  PUSH 0x1001
  PUSH 12
  PUSH 1
  CALL println

  ## Call Print Number
  PUSH 12345
  PUSH 1
  CALL printNum

  TERM

## ##########################
## Library Functions
##   This library assumes that the memory point 0x7000 to 0x8000 is restricted
## ##########################

## Clear Screen
clearScreen:
  MOV 0xFF00 r4
  STORE r4 0x3000
  STORE 0 0x7000
  RET

## Print X Characters from memory location
println:
  ## ARG 0 => r0: Address of first character
  ## ARG 1 => r1: Number of characters
  LOAD 0x7000 r3        ## Load the next row to print to
  MOV 'H' r4
  STORE r4 0x3001

  ## Increment the line counter
  MOV 1 r4
  ADD r4 r3
  STORE r3 0x7000
  RET

## Print number as characters
printNum:
  MOV 'H' r4
  STORE r4 0x3001
  RET
