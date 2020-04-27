const BYTES = [4, 2, 2, 2, 2, 2, 2, 2, 2, 2];

export const deviceParser = (data) => {
  // e.g. 01030124092f017a000000
  let start = 0;
  const bytes = BYTES.reduce((prev, cur) => {
    const text = data.substr(start, cur);
    start += cur;
    return [...prev, text];
  }, []);
  return bytes;
};
