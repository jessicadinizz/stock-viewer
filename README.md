
# Interactive Stock Viewer

### Key Features:

* **Ticker Input**: Users can enter one or more stock tickers to view their financial information.
* **Ticker Autocomplete**: Real-time suggestions with debounce to assist with typing stock codes.
* **Interactive Chart**: Displays stock price evolution over time using a line chart, allowing comparison between multiple stocks.
* **Simple Moving Average (SMA 10)**: For each added stock, an additional line is shown representing the 10-day simple moving average to help identify trends.
* **Time Range Selection**: Users can select different time intervals for analysis (Last 7 days, 30 days, 3 months, 12 months, Year-to-Date, Max).
* **Index Comparison**: Shows the performance of IBOV and S\&P500 on the chart, normalized to accumulated percentage return for easier comparison.
* **Returns & Metrics Table**: In addition to percentage return and initial/final prices, the table also displays average daily return, volatility, and maximum drawdown for each stock.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API Key

This project uses the Alpha Vantage API to fetch financial data. To configure:

* Get a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key).
* Create a `.env` file in the root directory and add your API key:

```env
REACT_APP_API_KEY=your-api-key
```

### 4. Start the project

```bash
npm start
```

The app will be available at `http://localhost:3000`.

