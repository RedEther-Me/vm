class MemoryController {
  constructor(opts = {}) {
    const { listener = () => {} } = opts;

    this.regions = [];
    this.listener = listener;
  }

  map(deviceName, device, start, end, remap = true) {
    const region = {
      deviceName,
      device,
      start,
      end,
      size: end - start,
      remap,
    };

    this.regions.unshift(region);

    return () => {
      this.regions = this.regions.filter((x) => x !== region);
    };
  }

  findRegion(address) {
    const region = this.regions.find(
      (r) => address >= r.start && address <= r.end
    );
    if (!region) {
      throw new Error(`No memory region found for address ${address}`);
    }

    return region;
  }

  getUint8(address) {
    const region = this.findRegion(address);
    const finalAddress = region.remap ? address - region.start : address;

    return region.device.getUint8(finalAddress);
  }

  getUint16(address) {
    const region = this.findRegion(address);
    const finalAddress = region.remap ? address - region.start : address;

    return region.device.getUint16(finalAddress);
  }

  getInt16(address) {
    const region = this.findRegion(address);
    const finalAddress = region.remap ? address - region.start : address;

    return region.device.getInt16(finalAddress);
  }

  setUint8(address, value) {
    const region = this.findRegion(address);
    const finalAddress = region.remap ? address - region.start : address;

    this.listener({
      event: "memory",
      type: "setUint8",
      address: finalAddress,
      value,
    });

    return region.device.setUint8(finalAddress, value);
  }

  setUint16(address, value) {
    const region = this.findRegion(address);
    const finalAddress = region.remap ? address - region.start : address;

    this.listener({
      event: "memory",
      type: "setUint16",
      address: finalAddress,
      value,
    });

    return region.device.setUint16(finalAddress, value);
  }
}

export default MemoryController;
