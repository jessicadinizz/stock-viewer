import React, { useState, useEffect } from "react";
import { fetchStockData } from "../../utils/api";
import { processStockData } from "../../utils/dataProcessing";
import { StockData } from "../../types/types";

const FAVORITES_KEY = "favoriteTickers";
const FAVORITES_DATA_KEY = "favoritesData";

interface FavoritesProps {
  onUseFavorite: (ticker: string, data: StockData) => void;
}

export default function Favorites({ onUseFavorite }: FavoritesProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesData, setFavoritesData] = useState<Record<string, StockData>>(
    {}
  );

  // Função para atualizar cache e localStorage junto
  const updateFavoriteData = (ticker: string, data: StockData) => {
    setFavoritesData((prev) => {
      const newData = { ...prev, [ticker]: data };
      localStorage.setItem(FAVORITES_DATA_KEY, JSON.stringify(newData));
      return newData;
    });
  };

  useEffect(() => {
    const favs = localStorage.getItem(FAVORITES_KEY);
    const favsData = localStorage.getItem(FAVORITES_DATA_KEY);

    if (favs) setFavorites(JSON.parse(favs));
    if (favsData) {
      const parsedData = JSON.parse(favsData);
      (Object.values(parsedData) as StockData[]).forEach((stock) => {
        stock.prices = stock.prices.map((p) => ({
          ...p,
          date: new Date(p.date),
        }));
      });
      setFavoritesData(parsedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const handleClickFavorite = (ticker: string) => {
    const data = favoritesData[ticker];
    if (data) {
      onUseFavorite(ticker, data);
    } else {
      alert("Sem dados cacheados para esse favorito.");
    }
  };

  const handleUpdateFavorite = async (ticker: string) => {
    try {
      const apiData = await fetchStockData(ticker);
      const processed = processStockData(apiData, ticker, "30d");
      updateFavoriteData(ticker, processed);
      onUseFavorite(ticker, processed);
      alert(`${ticker} atualizado com sucesso!`);
    } catch {
      alert(`Erro ao atualizar ${ticker}`);
    }
  };

  return (
    <div>
      <h3>Favoritos</h3>
      {favorites.length === 0 && <p>Nenhum favorito adicionado.</p>}
      <ul>
        {favorites.map((ticker) => (
          <li key={ticker}>
            <button onClick={() => handleClickFavorite(ticker)}>
              {ticker}
            </button>
            <button onClick={() => handleUpdateFavorite(ticker)}>
              Atualizar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
