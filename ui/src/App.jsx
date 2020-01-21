import React, { Fragment } from "react";
import { Container } from "reactstrap";

import AppNavbar from "./views/AppNavbar";
import Surface from "./components/Surface";

function App() {
  return (
    <Fragment>
      <AppNavbar />
      <Container>
        <Surface width={100} height={100} />
      </Container>
    </Fragment>
  );
}

export default App;
