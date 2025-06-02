import React, { useState, useMemo, useEffect, useContext } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
// import { StockData } from "./types/types";
import { fetchStockData } from "./utils/api";
import { processStockData } from "./utils/dataProcessing";
import { useStockData } from "./hooks/useStockData";
import TickerInput from "./components/TickerInput/TickerInput";
import DateRangeSelector from "./components/DateRangeSelector/DateRangeSelector";
import Chart from "./components/Chart/Chart";
import ReturnsTable from "./components/ReturnsTable/ReturnsTable";
import LoadingError from "./components/LoadingError/LoadingError";
// import SavedQueriesList from "./components/SavedQueriesList/SavedQueriesList";
import "./App.css";

// interface SavedQuery {
//   name: string;
//   tickers: string[];
//   data: Record<string, StockData>;
// }

// const SAVED_QUERIES_KEY = "savedQueries";


const App: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [tickers, setTickers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>("30d");
  const [cachedDataMap, setCachedDataMap] = useState<Record<string, any>>({});

  // const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(() => {
  //   const saved = localStorage.getItem(SAVED_QUERIES_KEY);
  //   return saved ? JSON.parse(saved) : [];
  // });

  const memoizedCachedDataMap = useMemo(
    () => cachedDataMap,
    [JSON.stringify(cachedDataMap)]
  );

  const { data, loading, error } = useStockData(
    tickers,
    dateRange,
    memoizedCachedDataMap
  );

  // const saveCurrentQuery = (name: string) => {
  //   if (!name.trim()) {
  //     alert("Nome inválido para salvar a consulta.");
  //     return;
  //   }
  //   if (savedQueries.find((q) => q.name === name)) {
  //     alert("Já existe uma consulta salva com esse nome.");
  //     return;
  //   }
  //   const queryData: Record<string, StockData> = {};
  //   data.forEach((stock) => {
  //     queryData[stock.ticker] = stock;
  //   });

  //   const newQuery: SavedQuery = { name, tickers, data: queryData };
  //   const updated = [...savedQueries, newQuery];
  //   setSavedQueries(updated);
  //   localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(updated));
  //   alert(`Consulta "${name}" salva com sucesso.`);
  // };

  // const loadQuery = (query: SavedQuery) => {
  //   setTickers(query.tickers);
  //   setCachedDataMap(query.data);
  // };

  // const removeQuery = (name: string) => {
  //   const updated = savedQueries.filter((q) => q.name !== name);
  //   setSavedQueries(updated);
  //   localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(updated));
  // };

  const handleAddTicker = async (ticker: string, cachedData?: any) => {
    if (tickers.includes(ticker)) return;
    if (tickers.length >= 10) {
      alert("Você pode adicionar no máximo 10 ações por gráfico.");
      return;
    }
    if (cachedData) {
      setTickers((prev) => [...prev, ticker]);
      setCachedDataMap((prev) => ({ ...prev, [ticker]: cachedData }));
    } else {
      try {
        await fetchStockData(ticker);
        setTickers((prev) => [...prev, ticker]);
      } catch (error: any) {
        alert(`Erro ao buscar dados para ${ticker}: ${error.message}`);
      }
    }
  };

  const handleRemoveTicker = (tickerToRemove: string) => {
    setTickers((prev) => prev.filter((ticker) => ticker !== tickerToRemove));
    setCachedDataMap((prev) => {
      const copy = { ...prev };
      delete copy[tickerToRemove];
      return copy;
    });
  };

  const updateCurrentQuery = async () => {
    if (tickers.length === 0) {
      alert("Nenhum ticker para atualizar.");
      return;
    }

    try {
      const results = await Promise.all(
        tickers.map((ticker) => fetchStockData(ticker))
      );

      const processedData = results.map((result, i) =>
        processStockData(result, tickers[i], dateRange)
      );

      const newCacheMap: Record<string, any> = {};
      processedData.forEach((stock) => {
        newCacheMap[stock.ticker] = stock;
      });

      setCachedDataMap(newCacheMap);
      alert("Consulta atualizada com sucesso!");
    } catch (error: any) {
      alert("Erro ao atualizar consulta: " + (error.message || "Desconhecido"));
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-wrapper">

          <button
            onClick={toggleTheme}
            style={{
              marginLeft: "auto",
              padding: "6px 12px",
              cursor: "pointer",
            }}
            title="Alternar modo claro/escuro"
          >
            {theme === "light" ? "Modo Escuro" : "Modo Claro"}
          </button>
        </div>
      </header>

      <main className="app-content">
        <div className="controls-section">
          {/* <div style={{ marginBottom: "16px" }}>
            <button
              onClick={() => {
                const name = prompt(
                  "Digite um nome para salvar essa consulta:"
                );
                if (name) saveCurrentQuery(name);
              }}
            >
              Salvar Consulta Atual
            </button>

            <button onClick={updateCurrentQuery} style={{ marginLeft: "10px" }}>
              Atualizar Consulta Atual
            </button>
          </div> */}

          {/* <SavedQueriesList
            savedQueries={savedQueries}
            onLoadQuery={loadQuery}
            onRemoveQuery={removeQuery}
          /> */}

          <TickerInput onAddTicker={handleAddTicker} />

          <DateRangeSelector
            selectedRange={dateRange}
            onRangeChange={setDateRange}
          />

          {tickers.length > 0 && (
            <div className="selected-tickers">
              <h3>Ações selecionadas:</h3>
              <div className="ticker-tags">
                {tickers.map((ticker) => (
                  <span key={ticker} className="ticker-tag">
                    {ticker}
                    <button
                      onClick={() => handleRemoveTicker(ticker)}
                      className="remove-ticker"
                      title="Remover ação"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <LoadingError loading={loading} error={error} />

        <div className="visualization-section">
          <Chart stockData={data} />
          <ReturnsTable stockData={data} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Dados fornecidos por Alpha Vantage</p>
      </footer>
    </div>
  );
};

export default App;
