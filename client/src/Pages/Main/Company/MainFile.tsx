import { useState } from "react";
import Company from "./Company/Company";
import Settings from "./Settings/Settings";
import Subscriptions from "./Subscriptions/Subscriptions";

const tabs = [
  { key: "company", label: "Company" },
  { key: "settings", label: "Settings" },
  { key: "subscriptions", label: "Subscriptions" },
];

const MainFile = () => {
  const [stage, setStage] = useState("company");

  const renderTab = () => {
    switch (stage) {
      case "company":
        return <Company />;
      case "settings":
        return <Settings />;
      case "subscriptions":
        return <Subscriptions />;

      default:
        return <Company />;
    }
  };

  return (
    <>
      <div className="flex items-center gap-8 border-b-2 border-[#2e3b51] px-6 pt-6">
        {tabs.map((tab) => {
          const isActive = stage === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setStage(tab.key)}
              className={`-mb-0.5 cursor-pointer px-4 py-2.5 text-sm font-semibold tracking-wide transition ${
                isActive
                  ? "rounded-t-lg border-2 border-b-0 border-blue-500 bg-[#000d24] text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {renderTab()}
    </>
  );
};

export default MainFile;
