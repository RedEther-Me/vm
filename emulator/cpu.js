const createMemory = require("./memory");
const INSTRUCTIONS = require("./instructions");

class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registerNames = [
      "ip",
      "acc",
      "r1",
      "r2",
      "r3",
      "r4",
      "r5",
      "r6",
      "r7",
      "r8"
    ];

    this.registers = createMemory(this.registerNames.length * 2);

    this.registerMap = this.registerNames.reduce(
      (acc, name, index) => ({ ...acc, [name]: index * 2 }),
      {}
    );
  }

  debug() {
    this.registerNames.forEach(name => {
      console.log(
        `${name}: 0x${this.getRegister(name)
          .toString(16)
          .padStart(4, "0")}`
      );
    });
    console.log();
  }

  getRegister(name) {
    if (!(name in this.registerMap)) {
      throw new Error(`getRegister: Unable to find register ${name}`);
    }

    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegister(name, value) {
    if (!(name in this.registerMap)) {
      throw new Error(`setRegister: Unable to find register ${name}`);
    }

    return this.registers.setUint16(this.registerMap[name], value);
  }

  fetch16() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint16(nextInstructionAddress, true);
    // console.log(
    //   this.memory.getUint16(nextInstructionAddress, true).toString(2)
    // );
    this.setRegister("ip", nextInstructionAddress + 1);
    return instruction;
  }

  execute(command) {
    const instruction = command & 15;
    console.log(
      instruction,
      command.toString(2),
      instruction.toString(2),
      (15).toString(2)
    );

    console.log(instruction.toString(16).padStart(2));
    switch (instruction) {
      case INSTRUCTIONS.TERMINATE: {
        process.exit(0);
      }

      default: {
        throw new Error(
          `Illegal Instruction: ${instruction.toString(16).padStart(2)}`
        );
      }

      // case INSTRUCTIONS.MOV_LIT_R1: {
      //   const literal = this.fetch16();
      //   this.setRegister("r1", literal);
      //   return;
      // }

      // case INSTRUCTIONS.MOV_LIT_R2: {
      //   const literal = this.fetch16();
      //   this.setRegister("r2", literal);
      //   return;
      // }

      // case INSTRUCTIONS.ADD_REG_REG: {
      //   const a1 = this.fetch();
      //   const a2 = this.fetch();

      //   const v1 = this.registers.getUint16(a1 * 2);
      //   const v2 = this.registers.getUint16(a2 * 2);

      //   this.setRegister("acc", v1 + v2);
      //   return;
      // }

      // case INSTRUCTIONS.PRINT_REG: {
      //   const a1 = this.fetch();
      //   const v1 = this.registers.getUint16(a1 * 2);

      //   console.log(v1, v1.toString(16).padStart(4, "0"));
      // }
    }
  }

  step() {
    const instruction = this.fetch16();
    return this.execute(instruction);
  }
}

module.exports = CPU;
