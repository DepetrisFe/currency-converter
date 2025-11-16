import React from "react";
import { IoSwapVertical } from "react-icons/io5";

interface Props {
  disabled: boolean;
  onClick: () => void;
}

const CurrencySwapBtn: React.FC<Props> = ({ disabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white transition"
    >
      <IoSwapVertical />
    </button>
  );
};

export default CurrencySwapBtn;
