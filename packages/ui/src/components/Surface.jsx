import React, { useRef, useLayoutEffect } from "react";

import cpuInterface from "../machine/interface";

const NUM_COLS = 80;
const NUM_ROWS = 30;

const color = "grey";

const Surface = (props) => {
  const surfaceRef = useRef();

  useLayoutEffect(() => {
    const clearScreen = () => {
      const { width, height } = surfaceRef.current;

      const ctx = surfaceRef.current.getContext("2d");
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    };

    const writeCharacter = ({ char = "", x = 0, y = 0 }) => {
      if (x > NUM_COLS || x < 0 || y > NUM_ROWS || y < 0) {
        console.log("invalid location");
        return;
      }

      const ctx = surfaceRef.current.getContext("2d");
      ctx.font = "17px Consolas";
      ctx.fillStyle = "black";
      ctx.fillText(char, 25 + x * 9.4, 40 + y * 15);
    };

    const displayDevice = {
      getUint16: () => 0,
      getUint8: () => 0,
      setUint16: (address, data) => {
        const command = (data & 0xff00) >> 8;
        const characterValue = data & 0x00ff;

        switch (command) {
          case 0xff: {
            clearScreen();
            return;
          }
          default: {
            const x = address % NUM_COLS;
            const y = Math.floor(address / NUM_COLS);

            const char = String.fromCharCode(characterValue);
            writeCharacter({ char, x, y });
          }
        }
      },
    };

    clearScreen();
    cpuInterface.registerDevice("display", displayDevice, 0x3000, 0x30ff);
  }, []);

  // BORDER TEST
  // setTimeout(() => {
  //   console.log("begin sequence");
  //   let x = 0;
  //   let y = 0;

  //   const nextPos = () => {
  //     clearScreen();
  //     writeCharacter({ x, y, char: "X" });

  //     if (x < NUM_COLS && y === 0) {
  //       x += 1;
  //     }

  //     if (x > 0 && y === NUM_ROWS) {
  //       x -= 1;
  //     }

  //     if (x === NUM_COLS && y < NUM_ROWS) {
  //       y += 1;
  //     }

  //     if (x === 0 && y > 0) {
  //       y -= 1;
  //     }

  //     setTimeout(() => {
  //       nextPos();
  //     }, 50);
  //   };

  //   nextPos();
  // }, 5000);

  return <canvas id="display" ref={surfaceRef} width="800" height="500" />;
};

export default Surface;
