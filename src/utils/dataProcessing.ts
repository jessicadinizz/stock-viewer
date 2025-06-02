import { subDays, subMonths, startOfYear } from 'date-fns';
import { StockData, PricePoint } from '../types/types';

// Função para processar os dados da API e formatá-los para o formato esperado
const processStockData = (apiData: any, ticker: string, dateRange: string): StockData => {
  const timeSeries = apiData['Time Series (Daily)'];
  if (!timeSeries) throw new Error('Dados inválidos da API');

  const allPrices: PricePoint[] = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
    date: new Date(date),
    close: parseFloat(values['4. close']),
  })).sort((a, b) => a.date.getTime() - b.date.getTime());

  const today = new Date();
  let startDate: Date;

  switch (dateRange) {
    case '7d':
      startDate = subDays(today, 7);
      break;
    case '30d':
      startDate = subDays(today, 30);
      break;
    case '3m':
      startDate = subMonths(today, 3);
      break;
    case '12m':
      startDate = subMonths(today, 12);
      break;
    case 'ytd':
      startDate = startOfYear(today);
      break;
    case 'max':
      startDate = new Date(0); // 01/01/1970 - pega todos os dados disponíveis
      break;
    default:
      startDate = subDays(today, 30);
  }
  

  const filteredPrices = allPrices.filter(
    (point) => point.date >= startDate && point.date <= today
  );

  if (filteredPrices.length === 0) {
    throw new Error('Nenhum dado disponível para o período selecionado');
  }

  const initialPrice = filteredPrices[0].close;
  const finalPrice = filteredPrices[filteredPrices.length - 1].close;
  const returnPercent = ((finalPrice - initialPrice) / initialPrice) * 100;

  return {
    ticker,
    prices: filteredPrices,
    initialPrice,
    finalPrice,
    return: returnPercent,
  };
};

// Função para calcular a Média Móvel Simples (SMA)
const calculateSMA = (data: PricePoint[], period: number): [number, number][] => {
  const smaData: [number, number][] = [];

  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, point) => acc + point.close, 0);
    const avg = sum / period;
    smaData.push([data[i].date.getTime(), parseFloat(avg.toFixed(2))]);
  }

  return smaData;
};

export { processStockData, calculateSMA };
