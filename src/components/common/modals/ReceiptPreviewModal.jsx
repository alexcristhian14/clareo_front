import { X } from "lucide-react";
import { Button } from "../Button";

export function ReceiptPreviewModal({ isOpen, onClose, file }) {
  if (!isOpen || !file) return null;

  const isImage = file.type?.startsWith("image");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[600px] bg-white rounded-[10px] p-4 flex flex-col gap-3">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-slate-800">
            Comprovante
          </h2>

          <Button variant="outline" onClick={onClose} icon={X}>
            Fechar
          </Button>
        </div>

        {/* CONTENT */}
        <div className="bg-slate-100 rounded p-3 flex justify-center items-center">

          {isImage ? (
            <img
              src={file.url}
              alt="comprovante"
              className="max-h-[500px] object-contain"
            />
          ) : (
            <iframe
              src={file.url}
              className="w-full h-[500px] rounded"
              title="comprovante"
            />
          )}

        </div>

      </div>
    </div>
  );
}