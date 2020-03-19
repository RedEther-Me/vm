# MOV

```
MOV value[literal|hex|char|label] register
```

# MEMORY

```
LOAD address[hex|register] register
```

```
STORE value[register|hex|literal|char] address[hex]
```

```
COPY from[hex|register] to[hex|register]
```

# STACK

```
PUSH value[literal|hex|char|register]
```

```
POP target[register]
```

# CALL

```
CALL address[label|hex|register]
```

# RET

```
RET
```

# JUMP

## Jump Not Equal

```
JNE address[label]
```

if \$acc contains EQ Flag, will jump to address

# TERM

```
TERM
```

# ARITHMATIC

```
ADD v1[literal|register] v2[register]
```

```
ADDU v1[literal|register] v2[register]
```

stores the result of v2 + v1 into v2

```
SUB v1[literal|register] v2[register]
```

stores the result of v2 - v1 into v2

```
MULT v1[literal|register] v2[register]
```

stores the result of v2 \* v1 into v2

```
DIV v1[literal|register] v2[register]
```

stores the result of v2 / v1 into v2

# COMPARE

```
CMP v1[literal|register] v2[register]
```

```
CMPU v1[literal|register] v2[register]
```

Sets the value of \$acc based on this chart
| Comparison | Result | Flags |
| ------------- |:-------------:| ----: |
| v2 = v1 | 0001 | EQ |
| v2 > v1 | 0010 | GT |
| v2 < v1 | 0100 | LT |

# BINARIES

## SRA

```
SRA v1[literal|register] v2[register]
```

stores the result of v2 >> v1 into v2

## SLA

```
SLA v1[literal|register] v2[register]
```

stores the result of v2 << v1 into v2

## AND

```
AND v1[literal|register] v2[register]
```

stores the result of v2 & v1 into v2

## OR

```
OR v1[literal|register] v2[register]
```

stores the result of v2 | v1 into v2

## XOR

```
XOR v1[literal|register] v2[register]
```

stores the result of v2 ^ v1 into v2
