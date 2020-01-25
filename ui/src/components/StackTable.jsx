import React, { useMemo } from "react";
import { Table } from "reactstrap";

import { machine } from "../machine/setup";

const RuntimeView = props => {
  const { registers } = props;

  const { regions } = machine.mm;
  const memory = regions.find(reg => reg.deviceName === "memory");

  const stackTop = memory.end - 1;
  const stackSize = registers.sp ? stackTop - registers.sp : 0;

  const stack = useMemo(() => {
    const arr = [];

    let i = 0;
    for (i = 0; i < stackSize; i += 2) {
      const address = stackTop - i;
      const value = machine.mm.getUint16(address);
      arr.push([address, value]);
    }

    return arr;
  }, [stackTop, stackSize]);

  return (
    <Table>
      <thead>
        <tr>
          <th>Address</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {stack.map(([address, value]) => (
          <tr key={address}>
            <td>{address}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RuntimeView;
