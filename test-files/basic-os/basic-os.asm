.data
  banner: .ascii "BasicOS 0.1\n"
  second_line: .ascii "We provide very basic support for an application\n"

.code
  main:
    SIVT interupt_handler

    MOV banner $r1
    PUSH $r1
    PUSH 1
    CALL printString

    MOV second_line $r1
    PUSH $r1
    PUSH 1
    CALL printString

    TERM

  interupt_handler:
    RET
