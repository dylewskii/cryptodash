const formatCurrency = (value: number, currency: string = "USD") => {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currencyFormatter.format(value);
};

export default formatCurrency;
