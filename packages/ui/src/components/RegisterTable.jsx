import React from "react";
import { Table } from "reactstrap";

const RuntimeView = props => {
  const { registers } = props;

  const registerNames = Object.keys(registers);
  return (
    <Table>
      <thead>
        <tr>
          {registerNames.map(key => {
            return <th key={key}>{key}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        <tr>
          {registerNames.map(key => {
            return <th key={`${key}-literal`}>{registers[key]}</th>;
          })}
        </tr>
        <tr>
          {registerNames.map(key => {
            return <th key={`${key}-hex`}>0x{registers[key].toString(16)}</th>;
          })}
        </tr>
      </tbody>
    </Table>
  );
};

export default RuntimeView;
