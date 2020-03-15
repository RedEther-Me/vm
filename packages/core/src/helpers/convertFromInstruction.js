export default function(pattern, instruction) {
  const result = Object.entries(pattern).reduce((acc, [key, pat]) => {
    const value = instruction & pat.P;
    const unshifted = value >> pat.S;

    return { ...acc, [key]: unshifted };
  }, {});

  return result;
}
