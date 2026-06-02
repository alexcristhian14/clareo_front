import { useState } from "react";

const TABS = [
  { id: "overview", label: "Visão Geral", width: "w-32" },
  { id: "contributors", label: "Contribuidores", width: "w-32" },
  { id: "wallet", label: "Wallet", width: "w-32" },
  { id: "campaigns", label: "Campanhas", width: "w-32" },
  { id: "payments", label: "Métodos de Pagamento", width: "w-48" },
];

export function OrganizationTabs({ defaultTab = "overview", onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  function handleTabClick(tabId) {
    setActiveTab(tabId);

    // 🔥 preparado pra API / pai / URL
    if (onChange) onChange(tabId);
  }

  return (
    <div className="
      self-stretch h-12 bg-white rounded-[10px]
      shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]
      outline outline-1 outline-offset-[-1px] outline-zinc-400
      flex items-center px-6 gap-4 font-montserrat
    ">

      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              h-8 px-2.5 py-1.5 rounded-[10px]
              flex items-center justify-center
              transition-all duration-200 font-montserrat
              ${tab.width}
              ${isActive ? "bg-blue-600" : "bg-slate-100"}
            `}
          >
            <span
              className={`
                text-sm font-['Montserrat']
                transition-all
                ${
                  isActive
                    ? "text-white font-bold"
                    : "text-stone-900 font-light"
                }
              `}
            >
              {tab.label}
            </span>
          </button>
        );
      })}

    </div>
  );
}