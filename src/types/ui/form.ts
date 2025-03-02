import type { BaseProps } from "../common";

export interface SelectOption {
  value: string;
  label: string;
}

export interface BaseSelectProps extends BaseProps {
  label?: string;
  placeholder?: string;
  error?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export interface SingleSelectProps extends BaseSelectProps {
  name: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
}

export interface UseFormNavigationProps {
  isDirty: boolean;
  onSave?: () => void;
}
