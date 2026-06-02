import { InfoItem } from "./InfoItem";

export  function OrganizationInfo() {
  return (
    <div className="flex-1 bg-white rounded-xl shadow border p-5 flex flex-col gap-4">

      <h2 className="text-lg font-extrabold text-slate-700">
        Informações
      </h2>

      <div className="flex justify-between gap-6">

        <div className="flex flex-col gap-6">
          <InfoItem label="NOME" value="Instituto Saúde Viva" />
          <InfoItem label="EXTERNAL_ID" value="EXT - 1001" />
          <InfoItem label="CRIADO EM" value="12/03/2026" />
        </div>

        <div className="flex flex-col gap-6">
          <InfoItem label="ID" value="b3e4001f-aa11-4cde-89ab-112233445501" />
          <InfoItem label="MEMBROS" value="24" />
          <InfoItem label="ATUALIZADO EM" value="29/05/2026" />
        </div>

      </div>

    </div>
  );
}