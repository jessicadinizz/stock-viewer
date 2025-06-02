// Define o tipo PricePoint que é usado para representar um ponto de dados de preço de uma ação
export interface PricePoint {
  date: Date;   // A data em que o preço foi registrado, do tipo Date, para facilitar operações com datas
  close: number; // O valor de fechamento da ação naquele dia, do tipo número (R$)
}

// Define o tipo StockData que é utilizado para armazenar informações sobre uma ação
export interface StockData {
  ticker: string;          // O código de identificação da ação (ex: PETR4, ITUB4), do tipo string
  prices: PricePoint[];    // Um array de objetos do tipo PricePoint, representando os preços históricos da ação
  initialPrice: number;    // O preço de abertura da ação, normalmente o preço no primeiro dia de análise (R$)
  finalPrice: number;      // O preço de fechamento da ação no último dia de análise (R$)
  return: number;      // O retorno percentual da ação durante o período de análise (ex: 5.5 para 5.5%)
  isIndex?: boolean;
}
