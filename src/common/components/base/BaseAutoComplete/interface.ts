import { AutocompleteProps } from "@mui/material";

export interface BaseAutoCompleteProps<T = any> extends Omit<AutocompleteProps<T, boolean, false, boolean>, "renderInput" | "onChange" | "value"> {
  formik?: any;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  orderBy?: (a: T, b: T) => number;
  loading?: boolean;
  renderOption?: (props: any, option: T) => React.ReactNode;
  renderInput?: (params: any) => React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  toValue?: (option: T) => any;
  dimOnOpen?: boolean;
  backdropSx?: any;
  highlightOnOpen?: boolean;
  highlightSx?: any;
}