function createMemory(size) {
  const ab = new ArrayBuffer(size);
  const dv = new DataView(ab);

  return dv;
}

module.exports = createMemory;
