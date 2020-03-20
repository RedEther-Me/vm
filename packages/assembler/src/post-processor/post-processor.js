import { IVT_SIZE } from "@emulator/core";

const isTypeOf = (item, type) => {
  if (type === "string" && typeof item === "string") {
    return true;
  }

  return typeof item !== "string" && item.type === type;
};

const printAddress = address => address.toString(2).padStart(16, "0");

const countKey = "@@@@___count";

export default (program, globals) => {
  const setup = [
    ["main", () => printAddress(IVT_SIZE)],
    ["@@@@____program-size", firstpass => firstpass.length / 8]
  ];
  const sizeOfHeaders = setup.length * 2;

  // Replace ADDRESS with values

  // build label map
  const labelMap = program.reduce(
    (map, item) => {
      if (isTypeOf(item, "key")) {
        // TODO: Check if key already exists

        return { ...map, [item.name]: map[countKey] };
      }

      if (isTypeOf(item, "address")) {
        return { ...map, [countKey]: map[countKey] + 2 };
      }

      if (isTypeOf(item, "data")) {
        return {
          ...map,
          [item.name]: map[countKey],
          [countKey]: map[countKey] + item.size / 8
        };
      }

      return { ...map, [countKey]: map[countKey] + item.length / 8 };
    },
    { [countKey]: IVT_SIZE + sizeOfHeaders }
  );

  const replaced = program.map(item => {
    if (isTypeOf(item, "address")) {
      const address = labelMap[item.name];

      if (address === undefined) {
        if (globals[item.name]) {
          return globals[item.name];
        }

        throw new Error(`${item.name} is not defined`);
      }

      return printAddress(address);
    }

    if (isTypeOf(item, "global")) {
      const address = labelMap[item.name];

      return printAddress(address);
    }

    if (isTypeOf(item, "data")) {
      return item.value;
    }

    return item;
  });

  // Filter out LABELS
  const filtered = replaced.filter(item => !isTypeOf(item, "key"));

  const firstArr = setup.map(([key, calcValue]) =>
    printAddress(labelMap[key] || calcValue(""))
  );

  const firstpass = [...firstArr, ...filtered].join("");

  const setupArr = setup.map(([key, calcValue]) =>
    printAddress(labelMap[key] || calcValue(firstpass))
  );

  return [...setupArr, ...filtered].join("");
};
