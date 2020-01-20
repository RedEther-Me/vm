class MemoryController {
  constructor() {
    this.regions = [];
  }

  map(deviceName, device, start, end, remap = true) {
    const region = {
      deviceName,
      device,
      start,
      end,
      size: end - start,
      remap
    };

    this.regions.unshift(region);

    return () => {
      this.regions = this.regions.filter(x => x !== region);
    };
  }

  findRegion(address) {
    const region = this.regions.find(
      r => address >= r.start && address <= r.end
    );
    if (!region) {
      throw new Error(`No memory region found for address ${address}`);
    }

    return region;
  }

  getUint16(address, littleEndien) {
    const region = this.findRegion(address);
    const finalAddress = region.remap ? address - region.start : address;

    return region.device.getUint16(finalAddress, littleEndien);
  }

  setUint16(address, value) {
    const region = this.findRegion(address);
    const finalAddress = region.remap ? address - region.start : address;

    return region.device.setUint16(finalAddress, value);
  }
}

module.exports = MemoryController;
