.data
  banner: .ascii "BasicOS 0.1\n"
  second_line: .ascii "This is a product of interest\n"

.code
  main:
    MOV banner $r1
    PUSH $r1
    PUSH 1
    CALL printString

    MOV second_line $r1
    PUSH $r1
    PUSH 1
    CALL printString

    TERM
