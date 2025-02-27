import { UseFormRegister } from "react-hook-form";
import { FormErrorMessage } from "../FormErrorMessage";
import { CocktailFormData } from "../../lib/schemas";

interface TextFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  error?: string;
  register: UseFormRegister<CocktailFormData>;
  name: keyof CocktailFormData;
  type?: "text" | "textarea";
  textareaRows?: number;
}

export function TextField({
  id,
  label,
  icon,
  placeholder,
  error,
  register,
  name,
  type = "text",
  textareaRows,
}: TextFieldProps) {
  return (
    <div className="form-control">
      <label className="label" htmlFor={id}>
        <span className="label-text flex items-center gap-2">
          {icon}
          {label}
        </span>
      </label>
      <div>
        {type === "textarea" ? (
          <textarea
            id={id}
            className={`textarea textarea-bordered h-36 w-full ${error ? "textarea-error" : ""}`}
            placeholder={placeholder}
            rows={textareaRows}
            {...register(name)}
          />
        ) : (
          <input
            type="text"
            id={id}
            className={`input input-bordered w-full ${error ? "input-error" : ""}`}
            placeholder={placeholder}
            {...register(name)}
          />
        )}
        {error && <FormErrorMessage message={error} />}
      </div>
    </div>
  );
}
