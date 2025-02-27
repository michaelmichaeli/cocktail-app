export interface SelectOption {
  value: string;
  label: string;
}

export interface BaseSelectProps {
  label?: string;
  placeholder?: string;
  error?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export interface SingleSelectProps extends BaseSelectProps {
  name: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
}
