export default function(pattern, values) {
  const value = Object.entries(pattern).reduce((acc, [key, pat]) => {
    const lookup = values[key];
    const calc = lookup << pat.S;

    return acc + calc;
  }, 0);

  return value;
}
