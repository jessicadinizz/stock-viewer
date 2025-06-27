import { useState, useEffect } from "react";
import { fetchStockData } from "../utils/api";
import { processStockData } from "../utils/dataProcessing";
import { StockData } from "../types/types";

const CACHE_EXPIRATION_MS = 1000 * 60 * 60; // 1 hora
const CACHE_KEY = "stockDataCache";

export const useStockData = (
  tickers: string[],
  dateRange: string,
  cachedDataMap: Record<string, StockData | undefined> = {}
) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cachedDataMapString = JSON.stringify(cachedDataMap);

  useEffect(() => {
    if (tickers.length === 0) {
      setData([]);
      return;
    }

    const cachedStorage = localStorage.getItem(CACHE_KEY);
    let cache: Record<string, { data: StockData; timestamp: number }> = {};
    if (cachedStorage) {
      cache = JSON.parse(cachedStorage);

      // Converte strings para Date no cache localStorage
      Object.values(cache).forEach(({ data }) => {
        data.prices = data.prices.map((p: any) => ({
          ...p,
          date: new Date(p.date),
        }));
      });
    }

    const now = Date.now();

    const tickersToFetch = tickers.filter((ticker) => {
      const cached = cache[`${ticker}_${dateRange}`];
      return !cached || now - cached.timestamp > CACHE_EXPIRATION_MS;
    });

    setLoading(true);
    setError(null);

    const fetchAndProcess = async () => {
      try {
        // Converte strings para Date em cachedDataMap vindo das props
        const cachedFromProps = Object.entries(cachedDataMap)
          .filter(([_, v]) => v)
          .map(([_, v]) => {
            v!.prices = v!.prices.map((p: any) => ({
              ...p,
              date: new Date(p.date),
            }));
            return v!;
          }) as StockData[];

        const validCachedData = tickers
          .filter((t) => !tickersToFetch.includes(t))
          .map((t) => cache[`${t}_${dateRange}`].data);

        const fetchedData =
          tickersToFetch.length > 0
            ? await Promise.all(tickersToFetch.map((t) => fetchStockData(t)))
            : [];

        const processedFetched = fetchedData.map((result, i) =>
          processStockData(result, tickersToFetch[i], dateRange)
        );

        processedFetched.forEach((stock) => {
          cache[`${stock.ticker}_${dateRange}`] = { data: stock, timestamp: now };
        });
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

        const allData = [...validCachedData, ...cachedFromProps, ...processedFetched];

        const uniqueData = allData.reduce((acc: StockData[], curr) => {
          if (!acc.find((s) => s.ticker === curr.ticker)) acc.push(curr);
          return acc;
        }, []);

        setData(uniqueData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcess();
  }, [tickers, dateRange, cachedDataMapString]);

  return { data, loading, error };
};
