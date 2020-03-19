const isTypeOf = (item, type) => {
  if (type === "string" && typeof item === "string") {
    return true;
  }

  return typeof item !== "string" && item.type === type;
};

const printAddress = address => address.toString(2).padStart(16, "0");

const countKey = "@@@@___count";

export default program => {
  const setup = [["main", printAddress(0)]];

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
    { [countKey]: 2 }
  );

  const replaced = program.map(item => {
    if (isTypeOf(item, "address")) {
      const address = labelMap[item.name];

      if (address === undefined) {
        throw new Error(`${item.name} is not defined`);
      }

      return printAddress(address);
    }

    if (isTypeOf(item, "data")) {
      return item.value;
    }

    return item;
  });

  // Filter out LABELS
  const filtered = replaced.filter(item => !isTypeOf(item, "key"));

  const setupArr = setup.map(([key, value]) =>
    printAddress(labelMap[key] || value)
  );

  return [...setupArr, ...filtered];
};
