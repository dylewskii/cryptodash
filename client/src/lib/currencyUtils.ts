export const formatCurrency = (
  value: number,
  currency: string = "USD",
  maximumFractionDigits: number = 2,
  minimumFractionDigits: number = 2
) => {
  const currencyFormatted = currency.toUpperCase();
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyFormatted,
    maximumFractionDigits,
    minimumFractionDigits,
  });

  return currencyFormatter.format(value);
};

export const roundToTwoDecimalPlaces = (num: number): number => {
  return Math.round(num * 100) / 100;
};
