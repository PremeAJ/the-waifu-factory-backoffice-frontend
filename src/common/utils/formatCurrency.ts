import formatNumber from "./formatNumber";

const formatCurrency = (val: number | string, decimals = 0, suffix = "฿") => {
  const formatted = formatNumber(val, decimals);
  return `${formatted} ${suffix}`;
};

export default formatCurrency;