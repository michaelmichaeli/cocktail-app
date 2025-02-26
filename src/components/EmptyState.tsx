import { Wine } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string | React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, icon = <Wine className="h-12 w-12 text-base-content/20" /> }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-base-content/60 mb-2">
        {title}
      </h3>
      <div className="text-base-content/50 text-sm max-w-[24rem] mx-auto">
        {message}
      </div>
    </div>
  );
}
