import React from "react";
import { Button, Col, Container, Row } from "reactstrap";

import Surface from "../components/Surface";
import Program from "../components/Program";
import RunControls from "../components/RunControls";

import { machine } from "../machine/setup";

const RuntimeView = props => {
  return (
    <Container fluid>
      <Row className="mb-2">
        <Col>
          <RunControls />
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
