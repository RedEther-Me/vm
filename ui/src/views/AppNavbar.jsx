import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavItem,
  Nav,
  Input
} from "reactstrap";

import { loadMedia } from "../machine/setup";

const AppNavbar = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">reactstrap</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Input
                type="file"
                name="file"
                id="exampleFile"
                onChange={evt => {
                  const file = evt.target.files[0];
                  console.log(file);

                  const reader = new FileReader();
                  reader.onload = e => {
                    const { result } = e.target;
                    loadMedia(result);
                  };

                  reader.readAsText(file, "UTF-8");
                }}
              />
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
