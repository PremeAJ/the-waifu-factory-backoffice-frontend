export const formatNumber = (val: number | string, maximumFractionDigits = 0, minimumFractionDigits = 0): string => {
  const n = Number(String(val).replace(/[^0-9.-]+/g, ""));
  if (Number.isNaN(n)) return String(val);
  const value = new Intl.NumberFormat("th-TH", { 
    maximumFractionDigits,
    minimumFractionDigits 
  }).format(n);
  return value;
};

export const removeCommas = (value: string): string => {
  return value.replace(/,/g, "");
};

export default formatNumber;