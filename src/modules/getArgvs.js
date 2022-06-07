const getArgvs = () => {
  const argvs = process.argv.slice(2);
  const regexp = /--(\w+)=(\w+)/im;
  const result = {};
  argvs.forEach((el) => {
    const match = el.match(regexp);
    if (match && match.length) {
      result[match[1]] = match[2];
    }
  });
  return result;
};

export default getArgvs;
