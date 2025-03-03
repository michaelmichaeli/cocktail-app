import { Button } from "./Button";
import type { DeleteDialogProps } from "../../types/components/ui";

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-base-100 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-base-content">{title}</h2>
        <p className="mt-2 text-sm text-base-content/70">{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
} 