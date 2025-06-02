import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchStockData = async (ticker: string) => {
  try {
    const isBrazilianStock = /\d$/.test(ticker);
    const formattedTicker = isBrazilianStock ? `${ticker}.SA` : ticker.toUpperCase();

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: formattedTicker,
        outputsize: 'full',
        apikey: API_KEY,
      },
    });

    // Checagem extra para erros e mensagens da API
    if (response.data['Error Message']) {
      throw new Error(`Erro API: ${response.data['Error Message']}`);
    }

    if (response.data['Note']) {
      throw new Error(`Limite de requisições da API atingido: ${response.data['Note']}`);
    }

    if (!response.data['Time Series (Daily)']) {
      throw new Error('Dados inválidos da API: time series ausente');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro desconhecido na requisição da API');
  }
};
