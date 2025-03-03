import { useEffect } from "react";
import { DeleteDialogProps } from '../types';

export function DeleteDialog({ isOpen, onClose, onConfirm, title, message }: DeleteDialogProps) {
  useEffect(() => {
    const dialog = document.getElementById("deleteDialog") as HTMLDialogElement;
    if (isOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  return (
    <dialog id="deleteDialog" className="modal" onClose={onClose}>
      <div className="modal-box bg-base-100">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-ghost mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-base-100/80">
        <button>close</button>
      </form>
    </dialog>
  );
}
