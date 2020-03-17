main:
  ## Call Clear Screen
  PUSH 0
  CALL clearScreen

  ## Call Print 'Hello World'
  STORE 'H' 0x1000
  STORE 'e' 0x1002
  STORE 'l' 0x1004
  STORE 'l' 0x1006
  STORE 'o' 0x1008
  STORE ' ' 0x100a
  STORE 'W' 0x100c
  STORE 'o' 0x100e
  STORE 'r' 0x1010
  STORE 'l' 0x1012
  STORE 'd' 0x1014
  STORE '!' 0x1016

  PUSH 0x1000
  PUSH 12
  PUSH 2
  CALL println

  PUSH 0x1000
  PUSH 12
  PUSH 2
  CALL println

  ## Call Print Number
  PUSH 12345
  PUSH 1
  CALL printNum

  ## Call Print Negative Number
  PUSH -10
  PUSH 1
  CALL printNum

  TERM

## ##########################
## Library Functions
##   This library assumes that the memory point 0x7000 to 0x8000 is restricted
## and that display memory starts at 0x3000
## ##########################

## Clear Screen
clearScreen:
  MOV 0xFF00 r4
  STORE r4 0x3000
  STORE 0 0x7000
  RET

## Print X Characters from memory location
println:
  ## ARGS are loaded in reverse order
  ## ARG 1 => r1: Address of first character
  ## ARG 0 => r2: Number of characters

  MOV fp acc
  ADD 22 acc            ## Location of Argument Count
  ADD 2 acc             ## Location of Character Count
  LOAD acc r1
  ADD 2 acc             ## Location of First Character Address
  LOAD acc r2
  
  LOAD 0x7000 r3        ## Load the next row to print to

  MOV 0x3000 r6         ## BEGINING OF DISPLAY
  MOV 80 r7             ## LINE MULTIPLIER
  MOV 1 r8              ## CHARACTER INCREMENTOR

  MULT r3 r7            ## MULTIPLY r3 (row) x r7 (row characters) => r7
  ADD r6 r7             ## ADD r6 (beginning of display) + r7 (row x row characters) => r7
  
  printChar:
  COPY r2 r7            ## PRINT FIRST CHARACTER TO SCREEN
  ADD 2 r2              ## Move to next character
  ADD 1 r7              ## Move to next visual position
  SUB 1 r1              ## Decrement characters left
  CMP 0 r1              ## Compare 0 to $R1
  JNE printChar         ## Jump to label if ZF is not set

  ## Increment the line counter
  ADD 1 r3
  STORE r3 0x7000
  RET

## Print number as characters
printNum:
  MOV fp acc
  ADD 22 acc            ## Location of Argument Count
  ADD 2 acc             ## Location of Number to Print
  LOAD acc r1

  LOAD 0x7000 r3        ## Load the next row to print to

  MOV 0x3000 r6         ## BEGINING OF DISPLAY
  MOV 80 r7             ## LINE MULTIPLIER
  MOV 1 r8              ## CHARACTER INCREMENTOR

  MULT r3 r7            ## MULTIPLY r3 (row) x r7 (row characters) => r7
  ADD r6 r7             ## ADD r6 (beginning of display) + r7 (row x row characters) => r7

  ## Determine if negative number and print '-'
  MOV r1 r2
  SRA 15 r2
  CMP -1 r2
  JNE skipHyphen

  STORE '-' r7
  ADD 1 r7              ## Move to next visual position

  skipHyphen:

  ## Determine count of digits
  MOV r1 r4
  ADD r2 r4
  XOR r4 r2             ## $r2 has absolute value of $r1 now

  MOV 0 r5              ## $r5 is our counter
  countNumberLoop:
  ADD 1 r5
  MOV r2 r1
  ## MOD 10 r1             ## $r1 % 10 => $r1
  ## PUSH r1

  DIV 10 r2
  PUSH acc              ## The remainder is conveniently in $acc
  CMP 0 r2
  JNE countNumberLoop

  printNumberLoop:
  POP r2
  ADD 48 r2
  STORE r2 r7
  ADD 1 r7              ## Move to next visual position

  SUB 1 r5
  CMP 0 r5
  JNE printNumberLoop

  ## Increment the line counter
  ADD 1 r3
  STORE r3 0x7000
  RET
