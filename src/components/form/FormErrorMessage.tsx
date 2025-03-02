import { AlertCircle } from "lucide-react";

interface FormErrorMessageProps {
  message: string;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  return (
    <span className="mt-2 text-sm text-error flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      {message}
    </span>
  );
}
