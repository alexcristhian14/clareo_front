import { useState, useRef } from "react";
import { Button } from "../../common/Button";
import { UploadCloud, FileText } from "lucide-react";

export function CreateEvidenceModal({
  isOpen,
  onClose,
  onCreate,
  mode = "organization",
}) {
  const [type, setType] = useState("update");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  }

  function validate() {
    if (!title) return "Título obrigatório";

    if (type === "expense") {
      if (!value) return "Valor obrigatório para despesa";
      if (!file) return "Comprovante obrigatório para despesa";
    }

    return null;
  }

  function handleSubmit() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    onCreate?.({
      id: Date.now(),
      type,
      title,
      description,
      value: value ? `R$ ${value}` : null,
      date,
      file: file
        ? {
            name: file.name,
            type: file.type,
          }
        : null,
    });

    setType("update");
    setTitle("");
    setDescription("");
    setValue("");
    setDate("");
    setFile(null);
    setError("");

    onClose();
  }

  const inputClass =
    "w-full p-2 bg-neutral-100 rounded-[10px] outline outline-1 outline-slate-300 text-sm";

  const labelClass = "text-slate-600 text-xs font-bold";

  const organizationTypes = [
    { value: "update", label: "Atualização" },
    { value: "expense", label: "Despesa" },
    { value: "milestone", label: "Marco" },
  ];

  const adminTypes = [
    { value: "milestone", label: "Marco oficial" },
    { value: "audit", label: "Auditoria" },
    { value: "adjustment", label: "Ajuste" },
  ];

  const types = mode === "admin" ? adminTypes : organizationTypes;

  const isMilestone = type === "milestone";
  const isExpense = type === "expense";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="w-[520px] bg-white rounded-[10px] p-6 flex flex-col gap-4 shadow-lg">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Nova Evidência
          </h2>
          <p className="text-sm text-slate-500">
            Adicione uma atualização à timeline
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="flex flex-col gap-3">

          {/* TYPE */}
          <div>
            <p className={labelClass}>Tipo</p>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClass}
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div>
            <p className={labelClass}>Título</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Ex: Compra de materiais"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <p className={labelClass}>Descrição</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Detalhes da evidência"
            />
          </div>

          {/* VALUE */}
          {!isMilestone && (
            <div>
              <p className={labelClass}>
                Valor {isExpense && <span className="text-red-500">*</span>}
              </p>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputClass}
                placeholder="Ex: 150,00"
                type="number"
              />
            </div>
          )}

          {/* DATE */}
          <div>
            <p className={labelClass}>Data</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* UPLOAD */}
          {!isMilestone && (
            <div>
              <p className={labelClass}>
                Comprovante {isExpense && <span className="text-red-500">*</span>}
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="
                  mt-2 w-full
                  border-2 border-dashed border-slate-300
                  rounded-[12px]
                  p-4
                  flex flex-col items-center justify-center
                  gap-2
                  bg-slate-50
                  cursor-pointer
                  hover:bg-slate-100
                  transition
                "
              >
                <UploadCloud className="text-slate-500" size={28} />

                <p className="text-sm text-slate-600 font-medium">
                  Clique para enviar comprovante
                </p>

                <p className="text-xs text-slate-400">
                  PDF, imagem ou vídeo
                </p>

                {file && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700 bg-white px-3 py-1 rounded">
                    <FileText size={16} />
                    <span className="truncate max-w-[200px]">
                      {file.name}
                    </span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-2">

          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            className="w-full"
            onClick={handleSubmit}
          >
            Criar
          </Button>

        </div>

      </div>
    </div>
  );
}