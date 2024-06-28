export const roundToTwoDecimalPlaces = (num: number): number => {
  return Math.round(num * 100) / 100;
};
