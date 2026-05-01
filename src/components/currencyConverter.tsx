import React, { useEffect, useState } from "react";
import CurrencySelector from "./currencySelector";
import CurrencySwapBtn from "./currencySwapBtn";

type CurrencyRecord = Record<string, string>;

interface CurrencyOption {
  code: string;
  name: string;
}

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>("");

  const [fromCurrency, setFromCurrency] = useState<string>(
    () => localStorage.getItem("fromCurrency") || "AUD"
  );

  const [toCurrency, setToCurrency] = useState<string>(
    () => localStorage.getItem("toCurrency") || "EUR"
  );

  const [result, setResult] = useState<number>(0);

  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);

  const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    localStorage.setItem("fromCurrency", fromCurrency);
  }, [fromCurrency]);

  useEffect(() => {
    localStorage.setItem("toCurrency", toCurrency);
  }, [toCurrency]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoadingCurrencies(true);
        const res = await fetch("https://api.frankfurter.dev/v1/currencies");
        const data: CurrencyRecord = await res.json();

        const mapped: CurrencyOption[] = Object.entries(data).map(
          ([code, name]) => ({
            code,
            name,
          })
        );

        setCurrencies(mapped);

        const codes = mapped.map((c) => c.code);

        if (!codes.includes(fromCurrency)) setFromCurrency("USD");
        if (!codes.includes(toCurrency)) setToCurrency("EUR");
      } catch (error) {
        console.error("Error loading currencies", error);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setResult(0);
      return;
    }

    // Validación extra para evitar llamadas innecesarias a la API
    if (fromCurrency === toCurrency) {
      setResult(numericAmount);
      return;
    }

    const fetchConversion = async () => {
      try {
        const res = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=${fromCurrency}&symbols=${toCurrency}`
        );

        const data = await res.json();
        const rate = data.rates[toCurrency];
        setResult(parseFloat((numericAmount * rate).toFixed(2)));

      } catch (error) {
        console.error("Error fetching conversion", error);
        setResult(0);
      }
    };

    if (!loadingCurrencies) fetchConversion();
  }, [amount, fromCurrency, toCurrency, loadingCurrencies]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg text-white">
      <h1 className="text-xl mb-4 text-center">Currency Converter</h1>

      <div className="mb-4">
        <label className="text-gray-400 mb-1 block">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white font-bitcount text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Enter amount"
        />
      </div>

      <CurrencySelector
        label="From"
        value={fromCurrency}
        onChange={setFromCurrency}
        options={currencies}
        disabled={loadingCurrencies}
        loading={loadingCurrencies}
      />

      <CurrencySelector
        label="To"
        value={toCurrency}
        onChange={setToCurrency}
        options={currencies}
        disabled={loadingCurrencies}
        loading={loadingCurrencies}
      />

      <div className="flex space-x-2 my-8">
        <div className="w-full p-4 bg-gray-800 rounded text-center text-xl">
          {loadingCurrencies ? (
            "Loading currencies..."
          ) : (
            <>
              {amount.length ? amount : 0} {fromCurrency} ={" "}
              {result.toFixed(2)} {toCurrency}
            </>
          )}
        </div>

        <CurrencySwapBtn
          onClick={swapCurrencies}
          disabled={loadingCurrencies}
        />
      </div>

      <div className="flex flex-col">
        <span className="text-sm">{`${currentYear} - Federico Depetris`}</span>

        <a
          href="https://github.com/DepetrisFe"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm"
        >
          https://github.com/DepetrisFe
        </a>
      </div>
    </div>
  );
};

export default CurrencyConverter;
