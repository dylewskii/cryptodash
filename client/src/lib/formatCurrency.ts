const formatCurrency = (
  value: number,
  currency: string = "USD",
  maxFractionDigits: number = 2
) => {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFractionDigits,
  });

  return currencyFormatter.format(value);
};

export default formatCurrency;
