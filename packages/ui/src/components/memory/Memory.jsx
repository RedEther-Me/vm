import React, { useReducer } from "react";
import { Row, Col } from "reactstrap";

import cpuInterface from "../../machine/interface";

import MemoryTable from "./MemoryTable";
import StackTable from "./StackTable";

function createMemory(size) {
  const ab = new ArrayBuffer(size);
  const dv = new DataView(ab);

  return dv;
}

const reducer = (state, action) => {
  const { type, address, value } = action;
  switch (type) {
    case "setUint8": {
      state.setUint8(address, value);
      return state;
    }
    case "setUint16": {
      state.setUint16(address, value);
      return state;
    }
    default:
      return state;
  }
};

const Memory = (props) => {
  const { registers } = props;

  const [memory, dispatch] = useReducer(reducer, createMemory(256 * 256));
  cpuInterface.addEventListener("memory", "memory", dispatch);

  return (
    <Row>
      <Col>
        <MemoryTable {...{ registers, memory }} />
      </Col>
      <Col>
        <StackTable {...{ registers, memory }} />
      </Col>
    </Row>
  );
};

export default Memory;
