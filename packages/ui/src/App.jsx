import React, { Fragment } from "react";

import AppNavbar from "./views/AppNavbar";
import RuntimeView from "./views/RuntimeView";

function App() {
  return (
    <Fragment>
      <AppNavbar />
      <RuntimeView />
    </Fragment>
  );
}

export default App;
