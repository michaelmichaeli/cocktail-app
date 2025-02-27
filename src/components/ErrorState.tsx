import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  message: string;
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-error" />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-base-content/70">{message}</p>
      </div>
    </div>
  );
}
