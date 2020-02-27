export const getTrimmedStr = (str) => {
  return str.length > 50 ? str.slice(0, 49) + "..." : str;
};
