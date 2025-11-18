export interface TableHeader {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string | number;
  render?: (value: any, row: DataItem) => React.ReactNode;
}

export interface DataItem extends Record<string, any> {
  id: string;
  subItems?: DataItem[];
}

export type ActionTemplate = {
  key?: string;
  type?: string;
  icon?: React.ReactNode;
  tooltip?: string | ((item: DataItem) => string);
  hide?: boolean | ((item: DataItem) => boolean);
  color?: "inherit" | "primary" | "error" | "default" | "secondary" | "info" | "success" | "warning" | string;
  disabled?: (item: DataItem) => boolean;
  href?: string | ((item: DataItem) => string); // เพิ่ม
  onClick?: (item: DataItem) => void;
};

export interface BaseTableProps<T extends readonly TableHeader[]> {
  headers: T;
  data: DataItem[];
  actions?: (item: DataItem) => React.ReactNode;
  enableSelection?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  loading?: boolean;
  pagination?: {
    total: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  rowHeaderColor?: "primary" | "success" | "error";
  actionTemplates?: ActionTemplate[];
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  isReachingEnd?: boolean;
}

export interface RenderActionButtonsProps {
  item: DataItem;
  actionTemplates?: ActionTemplate[];
  actions?: (item: DataItem) => React.ReactNode;
}

export interface DesktopTableProps<T extends readonly TableHeader[]> {
  headers: T;
  data: DataItem[];
  loading: boolean;
  enableSelection: boolean;
  selectedItems: string[];
  openRows: Record<string, boolean>;
  hasActions: boolean;
  pagination?: BaseTableProps<T>["pagination"];
  actionTemplates?: BaseTableProps<T>["actionTemplates"];
  actions?: BaseTableProps<T>["actions"];
  onToggleRow: (id: string) => void;
  onSelectItem: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  theme: any;
}

export interface RenderEmptyStateProps {
  headers: TableHeader[];
  enableSelection: boolean;
  hasActions: boolean;
}

export interface RenderLoadingRowsProps {
  headers: TableHeader[];
  enableSelection: boolean;
  hasActions: boolean;
  pagination?: {
    rowsPerPage: number;
  };
}

export interface MobileTableProps<T extends readonly TableHeader[]> {
  headers: T;
  data: DataItem[];
  loading: boolean;
  openRows: Record<string, boolean>;
  hasActions: boolean;
  cardBoxShadow: string;
  rowHeaderColor?: "primary" | "success" | "error";
  actionTemplates?: BaseTableProps<T>["actionTemplates"];
  actions?: BaseTableProps<T>["actions"];
  pagination?: BaseTableProps<T>["pagination"];
  isLoadingMore?: boolean;
  isReachingEnd?: boolean;
  scrollRef?: React.Ref<HTMLDivElement>;
  onToggleRow: (id: string) => void;
  theme: any;
}

export interface MobileCardItemProps<T extends readonly TableHeader[]> {
  item: DataItem;
  headers: T;
  primaryHeader: TableHeader;
  openRows: Record<string, boolean>;
  cardBoxShadow: string;
  rowHeaderColor: string;
  hasActions: boolean;
  actionTemplates?: BaseTableProps<T>["actionTemplates"];
  actions?: BaseTableProps<T>["actions"];
  onToggleRow: (id: string) => void;
  theme: any;
}

export interface MobileSubItemContentProps<T extends readonly TableHeader[]> {
  subItem: DataItem;
  headers: T;
  hasActions: boolean;
  actionTemplates?: BaseTableProps<T>["actionTemplates"];
  actions?: BaseTableProps<T>["actions"];
}

export interface MobileLoadingSkeletonProps {
  headers: TableHeader[];
  cardBoxShadow: string;
  rowHeaderColor: string;
  theme: any;
}