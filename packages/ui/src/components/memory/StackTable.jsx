import React, { useMemo, Fragment } from "react";
import { Table } from "reactstrap";

const RuntimeView = (props) => {
  const { registers, memory } = props;

  const stackTop = memory.end - 1;
  const stackSize = registers.sp ? stackTop - registers.sp : 0;

  const stack = useMemo(() => {
    const arr = [];

    let i = 0;
    for (i = 0; i < stackSize; i += 2) {
      const address = stackTop - i;
      const value = memory.getUint16(address);
      arr.push([address, value]);
    }

    return arr;
  }, [stackTop, stackSize]);

  return (
    <Fragment>
      <h3>Stack</h3>
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
    </Fragment>
  );
};

export default RuntimeView;
