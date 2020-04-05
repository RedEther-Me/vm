.data
  banner: .ascii "BasicOS 0.1\n"
  second_line: .ascii "Waiting for Application to load at 0x8000 \n"

.code
  main:
    SIVT interrupt_handler

    MOV banner $r1
    PUSH $r1
    PUSH 1
    CALL printString

    MOV second_line $r1
    PUSH $r1
    PUSH 1
    CALL printString

    wait:
    LOAD 0x8000 $r2
    CMP 0 $r2
    JE wait

    MOV 0x8000 $rip
    CALL 0x8000

    TERM

  ## $v0,$v1 contain interrupt arguements
  ##
  ## $v0  # type of interrupt
  ## ---- # --------------------- #
  ## 0    # NOOP                  #
  ## 1    # System Shutdown       #
  ## 2    # Print String          #
  ## 3    # Print Number          #
  ## 4    #                       #
  ## 5    #                       #
  ## 6    # Read String           #
  ## 7    # Read Number           #
  ## 8    #                       #
  ## 9    #                       #
  ##
  interrupt_handler:

    CMP 2 $v0
    JNE skipPrintString

    PUSH $v1
    PUSH 1
    CALL printString

    skipPrintString:

    CMP 3 $v0
    JNE skipPrintNumber

    PUSH $v1
    PUSH 1
    CALL printNumber

    skipPrintNumber:

    RET
