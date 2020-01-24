import React from "react";
import { Button, Col, Container, Row } from "reactstrap";

import Surface from "../components/Surface";
import Program from "../components/Program";

import { machine } from "../machine/setup";

const RuntimeView = props => {
  return (
    <Container fluid>
      <Row className="mb-2">
        <Col>
          <Button
            color="primary"
            className="mr-1"
            onClick={() => {
              machine.cpu.step();
            }}
          >
            Step
          </Button>
          <Button
            color="danger"
            onClick={() => {
              machine.cpu.run();
            }}
          >
            Run
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Surface width={100} height={100} />
        </Col>
        <Col>
          <Program />
        </Col>
      </Row>
    </Container>
  );
};

export default RuntimeView;
