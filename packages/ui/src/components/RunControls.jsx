import React, { Fragment, useEffect, useReducer } from "react";
import { Button } from "reactstrap";

import cpuInterface from "../machine/interface";

const reducer = (state, action) => {
  switch (action.type) {
    case "halt": {
      return {
        ...state,
        status: "halt",
      };
    }
    case "reset": {
      return {
        ...state,
        status: "reset",
      };
    }
    default:
      return state;
  }
};

const RunControls = (props) => {
  const [controls, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    cpuInterface.addEventListener("controls", "all", dispatch);

    return () => {
      cpuInterface.removeEventListener("controls");
    };
  }, []);

  return (
    <Fragment>
      <Button
        color="primary"
        className="mr-1"
        onClick={() => {
          cpuInterface.step();
        }}
        disabled={controls.status === "halt"}
      >
        Step
      </Button>
      <Button
        color="danger"
        className="mr-5"
        onClick={() => {
          cpuInterface.run();
        }}
        disabled={controls.status === "halt"}
      >
        Run
      </Button>
      <Button
        color="secondary"
        onClick={() => {
          cpuInterface.reset();
        }}
      >
        Reset
      </Button>
    </Fragment>
  );
};

export default RunControls;
