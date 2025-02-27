import { Maximize2 } from "lucide-react";

interface ImageWithModalProps {
  src: string;
  alt: string;
  modalId?: string;
}

export function ImageWithModal({ src, alt, modalId = "imageModal" }: ImageWithModalProps) {
  return (
    <div className="relative group">
      <div className="h-50">
        <figure className="relative rounded-xl overflow-hidden shadow-xl h-full">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
          />
          <button
            onClick={() => {
              const modal = document.getElementById(modalId) as HTMLDialogElement;
              modal?.showModal();
            }}
            className="btn btn-circle btn-ghost absolute top-2 right-2 bg-base-100/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-base-100 hover:scale-110"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </figure>

        <dialog id={modalId} className="modal">
          <div className="modal-box max-w-5xl w-full p-0 bg-base-100 overflow-hidden">
            <div className="relative">
              <img
                src={src}
                alt={alt}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
              <button 
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => {
                  const modal = document.getElementById(modalId) as HTMLDialogElement;
                  modal?.close();
                }}
              >✕</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop bg-base-100/90" />
        </dialog>
      </div>
    </div>
  );
}
