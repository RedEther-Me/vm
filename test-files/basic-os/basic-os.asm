.data
  banner: .ascii "BasicOS 0.1"

.code
  main:
    MOV banner $r1
    PUSH $r1
    PUSH 11
    PUSH 2
    CALL printString

    TERM
