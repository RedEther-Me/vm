import React, { Fragment, useEffect, useReducer } from "react";
import { Button } from "reactstrap";

import { machine } from "../machine/setup";

const reducer = (state, action) => {
  switch (action.type) {
    case "halt": {
      return {
        ...state,
        status: "halt"
      };
    }
    case "reset": {
      return {
        ...state,
        status: "reset"
      };
    }
    default:
      return state;
  }
};

const RunControls = props => {
  const [controls, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    machine.cpu.addListener("controls", dispatch);

    return () => {
      machine.cpu.removeListener("controls");
    };
  }, []);

  return (
    <Fragment>
      <Button
        color="primary"
        className="mr-1"
        onClick={() => {
          machine.cpu.step();
        }}
        disabled={controls.status === "halt"}
      >
        Step
      </Button>
      <Button
        color="danger"
        className="mr-5"
        onClick={() => {
          machine.cpu.run();
        }}
        disabled={controls.status === "halt"}
      >
        Run
      </Button>
      <Button
        color="secondary"
        onClick={() => {
          machine.cpu.reset();
        }}
      >
        Reset
      </Button>
    </Fragment>
  );
};

export default RunControls;
