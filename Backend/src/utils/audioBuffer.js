const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const dataArray = chunks.reduce(
    // flattens all the individual Uint8Array chunks into one big Uint8Array
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );
  return Buffer.from(dataArray.buffer);
};

module.exports = getAudioBuffer