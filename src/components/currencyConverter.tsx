import React, { useEffect, useState } from 'react';
import CurrencySelector from './currencySelector';

// Lista de monedas soportadas
const CURRENCY_OPTIONS = [
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'ARS', name: 'Argentine Peso' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'UYU', name: 'Uruguayan Peso' },
  { code: 'CLP', name: 'Chilean Peso' },
  { code: 'PEN', name: 'Peruvian Sol' },
  { code: 'COP', name: 'Colombian Peso' },
];

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('0');
  const [fromCurrency, setFromCurrency] = useState<string>(() => localStorage.getItem('fromCurrency') || 'AUD');
  const [toCurrency, setToCurrency] = useState<string>(() => localStorage.getItem('toCurrency') || 'EUR');
  const [result, setResult] = useState<number>(0);
  const currentYear = new Date().getFullYear();

  // Guardar monedas por defecto en localStorage
  useEffect(() => { localStorage.setItem('fromCurrency', fromCurrency); }, [fromCurrency]);
  useEffect(() => { localStorage.setItem('toCurrency', toCurrency); }, [toCurrency]);

  // Llamada a la API de Frankfurt para conversión
  useEffect(() => {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    setResult(0);
    return;
  }

  const fetchConversion = async () => {
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${numericAmount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setResult(data.rates[toCurrency]);
    } catch (error) {
      console.error('Error fetching conversion', error);
      setResult(0);
    }
  };

  fetchConversion();
}, [amount, fromCurrency, toCurrency]);

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg text-white">
      <h1 className="text-xl mb-4 text-center">Currency Converter</h1>

      {/* Input de amount */}
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

      {/* Selectores de monedas */}
      <CurrencySelector
        label="From"
        value={fromCurrency}
        onChange={setFromCurrency}
        options={CURRENCY_OPTIONS.map(c => c.code)}
      />

      <CurrencySelector
        label="To"
        value={toCurrency}
        onChange={setToCurrency}
        options={CURRENCY_OPTIONS.map(c => c.code)}
      />

      {/* Resultado de la conversión */}
      <div className="mt-6 mb-6 p-4 bg-gray-800 rounded text-center text-xl">
        {result !== null ? (
          <>
            {amount.length ? amount : 0} {fromCurrency} = {result.toFixed(2)} {toCurrency}
          </>
        ) : (
          'Loading...'
        )}
      </div>
      <div className='flex flex-col'>
        <span className="text-sm">{`${currentYear} - Federico Depetris`}</span>
        
        <a 
        href="https://github.com/DepetrisFe" 
  target="_blank" 
  rel="noopener noreferrer"
className='text-sm'
>
  https://github.com/DepetrisFe
</a>
      </div>

    </div>
  );
};

export default CurrencyConverter;
