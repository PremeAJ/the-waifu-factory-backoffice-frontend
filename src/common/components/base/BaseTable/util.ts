import { DataItem, TableHeader } from "./interface";

export const renderCell = (header: TableHeader, item: DataItem) => {
  if (header.render) {
    return header.render(item[header.key], item);
  }
  return item[header.key];
};

export const getColumnWidth = (header: TableHeader) => ({
  ...(header.width && { width: header.width }),
  ...(typeof header.width === "string" && header.width.includes("%") && { width: header.width }),
  ...(typeof header.width === "number" && { width: `${header.width}px` }),
});
