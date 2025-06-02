// src/components/ReturnsTable/ReturnsTable.tsx
import React from "react";
import "./ReturnsTable.css";
import { StockData } from "../../types/types";
import {
  averageDailyReturn,
  volatility,
  maxDrawdown,
} from "../../utils/metrics";

interface ReturnsTableProps {
  stockData: StockData[];
}

const ReturnsTable: React.FC<ReturnsTableProps> = ({ stockData }) => {
  if (stockData.length === 0) return null;

  return (
    <div className="returns-table-container">
      <h3 className="table-title">Retorno Percentual e Métricas</h3>
      <table className="returns-table">
        <thead>
          <tr>
            <th>Ação</th>
            <th>Retorno (%)</th>
            <th>Preço Inicial (R$)</th>
            <th>Preço Final (R$)</th>
            <th>Retorno Médio Diário (%)</th>
            <th>Volatilidade (%)</th>
            <th>Máximo Drawdown (%)</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((stock) => (
            <tr key={stock.ticker}>
              <td>{stock.ticker}</td>
              <td className={stock.return >= 0 ? "positive" : "negative"}>
                {stock.return.toFixed(2)}%
              </td>
              <td>{stock.initialPrice.toFixed(2)}</td>
              <td>{stock.finalPrice.toFixed(2)}</td>
              <td>{averageDailyReturn(stock.prices).toFixed(2)}</td>
              <td>{volatility(stock.prices).toFixed(2)}</td>
              <td>{maxDrawdown(stock.prices).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnsTable;
