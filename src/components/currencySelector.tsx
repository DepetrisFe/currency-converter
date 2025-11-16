import React from "react";

interface CurrencyOption {
  code: string;
  name: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: CurrencyOption[];
  label: string;
  disabled?: boolean;
  loading?: boolean;
}

const CurrencySelector: React.FC<Props> = ({
  value,
  onChange,
  options,
  label,
  disabled = false,
  loading = false,
}) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-400 mb-1">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <option>Cargando...</option>
        ) : (
          options.map(({ code, name }) => (
            <option key={code} value={code}>
              {code} — {name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default CurrencySelector;
