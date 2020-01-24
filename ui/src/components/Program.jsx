import React, { Fragment, useReducer, useEffect } from "react";
import { Row, Col } from "reactstrap";

import { machine } from "../machine/setup";

import RegisterTable from "./RegisterTable";
import StackTable from "./StackTable";

const reducer = (state, action) => {
  switch (action.type) {
    case "initial": {
      const { type, ...registers } = action;
      return {
        ...state,
        ...registers
      };
    }
    case "setRegister": {
      const { register, value } = action;
      return {
        ...state,
        [register]: value
      };
    }
    default:
      return state;
  }
};

function Program() {
  const [registers, dispatch] = useReducer(reducer, {});

  // const updateState = () => {
  //   console.log(machine.mm);

  //   const { regions } = machine.mm;

  //   // Get Registers
  //   const sp = machine.cpu.getRegister("sp");
  //   const fp = machine.cpu.getRegister("fp");
  //   const ip = machine.cpu.getRegister("ip");
  //   const acc = machine.cpu.getRegister("acc");
  //   const r1 = machine.cpu.getRegister("r1");
  //   const r2 = machine.cpu.getRegister("r2");
  //   const r3 = machine.cpu.getRegister("r3");
  //   const r4 = machine.cpu.getRegister("r4");
  //   const r5 = machine.cpu.getRegister("r5");
  //   const r6 = machine.cpu.getRegister("r6");
  //   const r7 = machine.cpu.getRegister("r7");
  //   const r8 = machine.cpu.getRegister("r8");

  //   // Get Stack Info

  //   // const memory = regions.find(reg => reg.deviceName === "memory");

  //   // if (memory) {
  //   //   const stackTop = memory.end - 1;
  //   //   const stackSize = stackTop - sp;

  //   //   console.log({ sp, fp, ip, stackTop, stackSize });
  //   // }

  //   setState({ ...state });
  // };

  useEffect(() => {
    machine.cpu.addListener("program", dispatch);

    return () => {
      machine.cpu.removeListener("program");
    };
  }, []);

  return (
    <Fragment>
      <Row>
        <Col>
          <RegisterTable {...{ registers }} />
        </Col>
      </Row>
      <Row>
        <Col>
          <StackTable {...{ registers }} />
        </Col>
      </Row>
    </Fragment>
  );
}

export default Program;
