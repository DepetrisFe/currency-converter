import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

const CurrencySelector: React.FC<Props> = ({ value, onChange, options, label }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        {options.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
