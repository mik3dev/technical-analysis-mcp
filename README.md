# Technical Analysis MCP Server

A Model Context Protocol (MCP) server that provides technical analysis of financial charts using AI vision capabilities. The server captures screenshots of financial charts and uses AI to interpret the patterns, indicators, and provide trading recommendations.

## Features

- Capture financial chart screenshots from any symbol (stocks, crypto, forex)
- Support for multiple timeframes (1m, 5m, 15m, 30m, 1h, 2h, 4h, daily, weekly)
- Analyze charts with various technical indicators (MACD, RSI, Bollinger Bands, etc.)
- AI-powered interpretation of chart patterns and indicators
- Trading recommendations based on technical analysis

## Architecture

The application consists of the following components:

1. **MCP Server**: Provides a standard interface for client applications to request technical analysis
2. **Browserless Integration**: Captures screenshots of financial charts
3. **OpenAI Integration**: Analyzes chart images to provide technical analysis

## Prerequisites

- Node.js (>= 18.x)
- API keys for:
  - Browserless API
  - OpenAI API (with GPT-4 Vision capabilities)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your API keys:

```
BROWSERLESS_BASE_URL=https://your-browserless-instance.com
BROWSERLESS_TOKEN=your_browserless_token

OPENAI_API_KEY=your_openai_api_key
FINCHARTS_BASE_URL=https://your-fincharts-url.com
```

4. Build the project:

```bash
npm run build
```

## Usage

Run the MCP server:

```bash
node build/index.js
```

The server exposes the following tool:

### get_technical_analysis

Analyzes a financial chart and provides technical analysis.

**Parameters:**

- `symbol` (string): The trading symbol to analyze (e.g., 'BINANCE:BTCUSDT', 'NASDAQ:MSFT', 'EURUSD', 'AAPL')
- `interval` (enum): The timeframe for analysis ('1', '5', '15', '30', '60', '120', '240', 'D', 'W')
- `studies` (array of string, optional): Technical indicators to include in the analysis

**Response:**

Returns a technical analysis of the chart, including:
- Current market conditions
- Identified patterns
- Indicator readings
- Support and resistance levels
- Trading recommendations

## Available Technical Indicators

The service supports numerous technical indicators, including but not limited to:

- Bollinger Bands (BB)
- Moving Average Convergence Divergence (MACD)
- Relative Strength Index (RSI)
- Stochastic RSI
- Volume
- Ichimoku Cloud
- Moving Averages (Simple, Exponential, Weighted)
- And many more...

## Development

1. Build the project in watch mode:

```bash
tsc --watch
```

2. Make your changes and test them

## License

ISC
