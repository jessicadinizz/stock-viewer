// src/utils/metrics.ts
import { PricePoint } from "../types/types";

// Retorno médio diário (%)
export function averageDailyReturn(prices: PricePoint[]): number {
  if (prices.length < 2) return 0;
  let totalReturn = 0;
  for (let i = 1; i < prices.length; i++) {
    const dailyReturn = (prices[i].close - prices[i - 1].close) / prices[i - 1].close;
    totalReturn += dailyReturn;
  }
  return (totalReturn / (prices.length - 1)) * 100;
}

// Volatilidade (desvio padrão dos retornos diários, em %)
export function volatility(prices: PricePoint[]): number {
  if (prices.length < 2) return 0;
  const dailyReturns = [];
  for (let i = 1; i < prices.length; i++) {
    dailyReturns.push((prices[i].close - prices[i - 1].close) / prices[i - 1].close);
  }
  const avg = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / (dailyReturns.length - 1);
  return Math.sqrt(variance) * 100;
}

// Máximo Drawdown (%)
export function maxDrawdown(prices: PricePoint[]): number {
  if (prices.length === 0) return 0;
  let peak = prices[0].close;
  let maxDD = 0;
  for (const p of prices) {
    if (p.close > peak) peak = p.close;
    const dd = (peak - p.close) / peak;
    if (dd > maxDD) maxDD = dd;
  }
  return maxDD * 100;
}
