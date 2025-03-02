import { UseFormRegister } from "react-hook-form";
import { AlcoholicType } from "../../types/features/cocktails";
import { FormErrorMessage } from "./FormErrorMessage";
import { CocktailFormData } from "../../lib/schemas";

interface AlcoholicTypeSelectProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  error?: string;
  register: UseFormRegister<CocktailFormData>;
  name: keyof CocktailFormData;
}

export function AlcoholicTypeSelect({
  id,
  label,
  icon,
  placeholder,
  error,
  register,
  name,
}: AlcoholicTypeSelectProps) {
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
          {Object.values(AlcoholicType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {error && <FormErrorMessage message={error} />}
      </div>
    </div>
  );
}
