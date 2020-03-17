const isTypeOf = (item, type) => {
  if (type === "string" && typeof item === "string") {
    return true;
  }

  return typeof item !== "string" && item.type === type;
};

const countKey = "@@@@___count";

export default program => {
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
        return { ...map, [countKey]: map[countKey] + item.size };
      }

      return { ...map, [countKey]: map[countKey] + item.length / 8 };
    },
    { [countKey]: 0 }
  );

  const replaced = program.map(item => {
    if (isTypeOf(item, "address")) {
      const address = labelMap[item.name];

      return address.toString(2).padStart(16, "0");
    }

    if (isTypeOf(item, "data")) {
      return item.value;
    }

    return item;
  });

  // Filter out LABELS
  const filtered = replaced.filter(item => !isTypeOf(item, "key"));

  const setup = {
    main: labelMap.main.toString(2).padStart(16, "0")
  };
  const setupArr = [setup.main];

  return [...setupArr, ...filtered];
};
