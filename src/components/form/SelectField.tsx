import { ChevronDown } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { FormErrorMessage } from "../FormErrorMessage";
import { CocktailFormData } from "../../lib/schemas";

interface SelectFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: string[];
  placeholder: string;
  error?: string;
  register: UseFormRegister<CocktailFormData>;
  name: keyof CocktailFormData;
}

export function SelectField({
  id,
  label,
  icon,
  options,
  placeholder,
  error,
  register,
  name,
}: SelectFieldProps) {
  return (
    <div className="form-control">
      <label className="label" htmlFor={id}>
        <span className="label-text flex items-center gap-2">
          {icon}
          {label}
        </span>
      </label>
      <div className="relative">
        <select
          id={id}
          className={`select select-bordered w-full appearance-none ${error ? "select-error" : ""}`}
          {...register(name)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base-content/70" />
        {error && <FormErrorMessage message={error} />}
      </div>
    </div>
  );
}
