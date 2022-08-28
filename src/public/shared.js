function processMidiMessage({ data }) {
  return {
    command: data[0] >> 4,
    channel: data[0] & 0xf,
    note: data[1],
    velocity: data[2],
  };
}
