module.exports = col => {
  const eraseScreen = () => {
    process.stdout.write('\x1b[2J');
  }

  const moveTo = (x, y) => {
    process.stdout.write(`\x1b[${y};${x}H`);
  };

  return {
    getUint16: () => 0,
    getUint8: () => 0,
    setUint16: (address, data) => {
      const command = (data * 0xff00) >> 8;
      const characterValue = data & 0x00ff;

      switch(command) {
        case 0xff: {
          eraseScreen();
          return;
        }
        default: {
          const x = address % col;
          const y = Math.floor(address / col);

          moveTo(x, y);

          const character = String.fromCharCode(characterValue);
          process.stdout.write(character);
        }
      }
    }
  };
};
