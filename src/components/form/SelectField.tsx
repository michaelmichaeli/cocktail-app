import { UseFormRegister, Path } from "react-hook-form";
import { CocktailFormData } from "../../lib/schemas";
import { FormErrorMessage } from "./FormErrorMessage";

interface SelectFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: string[];
  placeholder: string;
  error?: string;
  register: UseFormRegister<CocktailFormData>;
  name: Path<CocktailFormData>;
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
        {error && <FormErrorMessage message={error} />}
      </div>
    </div>
  );
}
