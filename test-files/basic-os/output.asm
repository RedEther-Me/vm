.data
  row: .word 0
  col: .word 0

  char_per_row: .word 80

  display: .word 0x3000

## .global printNumber
## .global printString

.code
  printNumber:
    RET

  printString:
    MOV $fp $acc
    ADDU 24 $acc               ## Location of Argument Count
    ADDU 2 $acc                ## Location of First Character Address
    LOAD $acc $r2

    LOAD row $r3              ## Load the row to print to
    LOAD col $r4              ## Load the col to print to

    LOAD display $r6          ## BEGINING OF DISPLAY
    LOAD char_per_row $r7     ## LINE MULTIPLIER
    MOV 1 $r8                 ## CHARACTER INCREMENTOR
    MOV $r7 $r5               ## COPY LINE MULTIPLIER

    MULT $r3 $r7              ## MULTIPLY $r3 (row) x $r7 (row characters) => $r7
    ADD $r6 $r7               ## ADD $r6 (beginning of display) + $r7 (row x row characters) => $r7
    ADD $r4 $r7

    printChar:
    LOAD $r2 $r1

    CMP 0 $r1
    JE skipPrintChar

    CMP 10 $r1
    JNE skipNewLine

    MOV $r7 $r3
    SUB $r6 $r3
    DIV $r5 $r3               ## $acc now has the number of characters into the line
    MOV $r5 $r3               ## $r3 is 80
    SUB $acc $r3              ## 80 - R => C, C is the compliment
    ADD $r3 $r7
    SUB 1 $r7

    skipNewLine:

    COPY $r2 $r7              ## Print character to screen
    ADD 2 $r2                 ## Move to next character
    ADD 1 $r7                 ## Move to next visual position

    J printChar             ## Jump to label if ZF is not set

    skipPrintChar:

    ## Increment the line counter
    SUB $r6 $r7
    DIV $r5 $r7               ## Divide current visual position by characters per row
    STORE $acc col            ## Store remaineder into [col]
    STORE $r7 row             ## Store row count into [row]
    RET
