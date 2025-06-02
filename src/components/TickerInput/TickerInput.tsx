import React, { useState, useEffect, useRef } from "react";
import "./TickerInput.css";

interface TickerInputProps {
  onAddTicker: (ticker: string) => void;
}

interface Suggestion {
  symbol: string;
  name: string;
}

const TickerInput: React.FC<TickerInputProps> = ({ onAddTicker }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([]);
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://brapi.dev/api/quote/list?search=${inputValue.toUpperCase()}&limit=5`
        );
        const data = await res.json();
        if (data && data.stocks) {
          setSuggestions(
            data.stocks.map((stock: any) => ({
              symbol: stock.stock,
              name: stock.name,
            }))
          );
        }
      } catch (e) {
        console.error("Erro ao buscar sugestões", e);
      }
    }, 400);
  }, [inputValue]);

  const validateTicker = (ticker: string): boolean => {
    if (!ticker.trim()) {
      setError("Por favor, insira um ticker válido");
      return false;
    }
    if (!/^[A-Z0-9]{4,5}$/.test(ticker.trim())) {
      setError("Ticker inválido. Exemplo: PETR4, ITUB4");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateTicker(inputValue)) return;
    onAddTicker(inputValue.trim().toUpperCase());
    setInputValue("");
    setSuggestions([]);
  };

  const handleSelectSuggestion = (symbol: string) => {
    if (!validateTicker(symbol)) return;
    onAddTicker(symbol);
    setInputValue("");
    setSuggestions([]);
  };

  return (
    <div className="ticker-input-container">
      <form onSubmit={handleSubmit} className="ticker-form" noValidate>
        <label className="input-label">
          <div className="input-wrapper">
            <div className="input-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <input
              type="text"
              className="ticker-input"
              placeholder="Enter stock tickers (e.g., ABC, XYZ)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              autoComplete="off"
            />
          </div>
        </label>
      </form>

      {suggestions.length > 0 && (
        <ul className="ticker-suggestions">
          {suggestions.map((sug) => (
            <li
              key={sug.symbol}
              onClick={() => handleSelectSuggestion(sug.symbol)}
              className="ticker-suggestion-item"
            >
              <strong>{sug.symbol}</strong> - {sug.name}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TickerInput;
