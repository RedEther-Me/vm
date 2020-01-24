main:
  MOV 3 r1
  MOV 4 r2
  ADD r1 r2
  MOV 0xFF00 r4
  MEM 0x3000 r4
  MOV 'H' r4
  MEM 0x3001 r4
  MOV 'e' r4
  MEM 0x3002 r4
  MOV 'l' r4
  MEM 0x3003 r4
  MOV 'l' r4
  MEM 0x3004 r4
  MOV 'o' r4
  MEM 0x3005 r4
  MOV ',' r4
  MEM 0x3006 r4
  MOV ' ' r4
  MEM 0x3007 r4
  MOV 'W' r4
  MEM 0x3008 r4
  MOV 'o' r4
  MEM 0x3009 r4
  MOV 'r' r4
  MEM 0x300a r4
  MOV 'l' r4
  MEM 0x300b r4
  MOV 'd' r4
  MEM 0x300c r4
  MOV '!' r4
  MEM 0x300d r4
  TERM