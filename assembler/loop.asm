main:
  ## Clear Screen
  MOV 0xFF00 r4
  MEM 0x3000 r4
  
  ## Create X
  MOV 'X' r4
  MEM 0x3001 r4

  TERM