import React, { Fragment, useReducer, useEffect } from "react";
import { Row, Col } from "reactstrap";

import cpuInterface from "../machine/interface";

import RegisterTable from "./RegisterTable";
import Memory from "./memory/Memory";

const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
    case "initial": {
      const { type, ...registers } = action;
      return {
        ...state,
        ...registers,
        id: state.id + 1,
      };
    }
    case "setRegister": {
      const { register, value } = action;
      return {
        ...state,
        [register]: value,
      };
    }
    default:
      return state;
  }
};

function Program() {
  const [registers, dispatch] = useReducer(reducer, { id: 0 });

  useEffect(() => {
    cpuInterface.addEventListener("program", "any", dispatch);
    cpuInterface.reset();

    return () => {
      cpuInterface.removeEventListener("program");
    };
  }, []);

  return (
    <Fragment>
      <Row>
        <Col>
          <RegisterTable {...{ registers }} />
        </Col>
      </Row>
      <Memory {...{ registers }} />
    </Fragment>
  );
}

export default Program;
