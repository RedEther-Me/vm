import React, { Fragment, useReducer, useEffect } from "react";
import { Row, Col } from "reactstrap";

import { machine } from "../machine/setup";

import RegisterTable from "./RegisterTable";
import StackTable from "./StackTable";
import MemoryTable from "./MemoryTable";

const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
    case "initial": {
      const { type, ...registers } = action;
      return {
        ...state,
        ...registers,
        id: state.id + 1
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
  const [registers, dispatch] = useReducer(reducer, { id: 0 });

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
          <MemoryTable {...{ registers }} />
        </Col>
        <Col>
          <StackTable {...{ registers }} />
        </Col>
      </Row>
    </Fragment>
  );
}

export default Program;
