import { ChevronDown, Loader2 } from "lucide-react";
import type { SingleSelectProps } from "../../types/form";

export function Select({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  error,
  isLoading,
  isDisabled,
  required,
  className = "",
}: SingleSelectProps) {
  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled || isLoading}
          required={required}
          className={`select select-bordered w-full ${error ? "select-error" : ""} 
            ${isDisabled ? "select-disabled" : ""} pr-10`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-base-content/50" />
          ) : (
            <ChevronDown className="h-4 w-4 text-base-content/50" />
          )}
        </div>
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
