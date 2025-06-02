# Visualizador de Ações Interativo

### Funcionalidades Principais:
- **Inserção de Tickers**: O usuário pode inserir o código (ticker) de uma ou mais ações da bolsa para visualizar suas informações financeiras.
- **Autocomplete de Tickers**: Sugestões em tempo real com debounce para facilitar a digitação do código das ações.
- **Gráfico Interativo**: Exibe a evolução do preço das ações ao longo do tempo em um gráfico de linhas, permitindo a comparação de múltiplas ações.
- **Média Móvel Simples (SMA 10)**: Para cada ação adicionada, é exibida também uma linha adicional representando a média móvel simples dos últimos 10 dias, facilitando a visualização de tendências.
- **Seleção de Intervalos de Tempo**: O usuário pode escolher diferentes períodos de tempo para a análise (Últimos 7 dias, 30 dias, 3 meses, 12 meses, No Ano, Máximo).
- **Comparação com Índices**: Exibição do desempenho do IBOV e do S&P500 no gráfico, normalizados para retorno percentual acumulado, facilitando a comparação com as ações.
- **Tabela de Retorno Percentual e Métricas**: Além do retorno percentual e preços inicial/final, exibe também retorno médio diário, volatilidade e máximo drawdown para cada ação.

## Como Configurar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
````

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração da API Key

Este projeto utiliza a API da Alpha Vantage para obter dados financeiros. Para configurá-la:

* Crie uma chave de API gratuita no [Alpha Vantage](https://www.alphavantage.co/support/#api-key).
* Crie um arquivo `.env` na raiz do projeto e adicione a chave de API da seguinte forma:

```env
REACT_APP_API_KEY=sua-chave-de-api
```

### 4. Inicie o projeto

```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`.


