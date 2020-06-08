import React, { useMemo, useState, Fragment } from "react";
import { Table, Input } from "reactstrap";

import { machine } from "../machine/setup";

const RuntimeView = (props) => {
  const { registers } = props;
  const { ip = 0, id } = registers;

  const stack = useMemo(() => {
    const list = [];

    let address = 0;
    for (address = 0; address < 16; address += 4) {
      const value1 = machine.mm.getUint8(ip + address + 0);
      const value2 = machine.mm.getUint8(ip + address + 1);
      const value3 = machine.mm.getUint8(ip + address + 2);
      const value4 = machine.mm.getUint8(ip + address + 3);

      list.push([ip + address, value1, value2, value3, value4]);
    }

    return list;
  }, [ip, id]);

  const [lookup, setLookup] = useState([0, 0, 0, 0]);
  const updateLookup = (evt) => {
    const { value } = evt.target;

    const isHex = value.indexOf("0x") >= 0;
    const asInt = parseInt(value, isHex ? 16 : 10);

    if (asInt > 0) {
      const value1 = machine.mm.getUint8(asInt + 0);
      const value2 = machine.mm.getUint8(asInt + 1);
      const value3 = machine.mm.getUint8(asInt + 2);
      const value4 = machine.mm.getUint8(asInt + 3);
      setLookup([value1, value2, value3, value4]);
    }
  };

  return (
    <Fragment>
      <h3>Memory</h3>
      <Table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {stack.map(([address, value1, value2, value3, value4]) => (
            <tr key={address}>
              <td>{address}</td>
              <td>
                {value1.toString(2).padStart(8, "0")}{" "}
                {value2.toString(2).padStart(8, "0")}{" "}
                {value3.toString(2).padStart(8, "0")}{" "}
                {value4.toString(2).padStart(8, "0")}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Input onChange={updateLookup} />
            </td>
            <td>
              {lookup[0].toString(2).padStart(8, "0")}{" "}
              {lookup[1].toString(2).padStart(8, "0")}{" "}
              {lookup[2].toString(2).padStart(8, "0")}{" "}
              {lookup[3].toString(2).padStart(8, "0")}
            </td>
          </tr>
        </tbody>
      </Table>
    </Fragment>
  );
};

export default RuntimeView;
