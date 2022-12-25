const isJsonString = (string: string) => {
  try {
    JSON.parse(string);
  } catch (_err) {
    return false;
  }

  return true;
};

export default isJsonString;
