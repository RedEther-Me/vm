import React, { useMemo } from "react";
import { Col, Row } from "reactstrap";

import { machine } from "../machine/setup";

const RuntimeView = props => {
  const { registers } = props;
  const { ip } = registers;

  const stack = [];

  let address = 0;
  let zerosCount = 0;
  do {
    const value = machine.mm.getUint8(address);

    if (value === 0) {
      zerosCount += 1;
    } else {
      zerosCount = 0;
    }

    stack.push([address, value]);
    address += 1;
  } while (zerosCount < 6);

  return (
    <Row>
      {stack.map(([address, value]) => (
        <Col key={address} className="col-3">
          {ip === address ? "*" : ""}
          {value.toString(2).padStart(8, "0")}
        </Col>
      ))}
    </Row>
  );
};

export default RuntimeView;
