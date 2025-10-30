export const formatNumber = (val: number | string, maximumFractionDigits = 0): string => {
  const n = Number(String(val).replace(/[^0-9.-]+/g, ""));
  if (Number.isNaN(n)) return String(val);
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits }).format(n);
};

export default formatNumber;