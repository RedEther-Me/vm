main:
  ## Clear Screen
  MOV 0xFF00 r4
  STORE r4 0x3000
  
  ## Create X
  MOV 'X' r4
  STORE r4 0x3001

  TERM