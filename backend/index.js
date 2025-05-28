const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio"); // cheerio for web scraping
const API_KEY = "4fcd4fd5632040f2918d46201cf7771d"; //  twelvedata  api key
const yahooFinance = require("yahoo-finance2").default; // yahoo finance api

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Temporary in-memory store (resets on server restart)
let assets = [];

app.get("/", (req, res) => {
  res.send("Backend is running! You're great!");
});

app.get("/api/assets", (req, res) => {
  res.json(assets);
});

app.post("/api/assets", (req, res) => {
  const { name, value } = req.body;
  if (!name || typeof value !== "number") {
    return res.status(400).json({ error: "Invalid asset data" });
  }

  const newAsset = { name, value };
  assets.push(newAsset);
  res.status(201).json(newAsset);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// fetching stock price from Twelve Data API
// This endpoint fetches the current price of a stock by its symbol
app.get("/api/stock/twelvedata/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${API_KEY}`;
    const response = await axios.get(url);

    if (response.data && response.data.price) {
      res.json({ symbol, price: parseFloat(response.data.price) });
    } else {
      res.status(400).json({ error: "No price found for this symbol." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch stock price" });
  }
});

app.get("/api/stock/yahoo/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

    try {
    const quote = await yahooFinance.quote(symbol);
    if (quote && quote.regularMarketPrice) {
      res.json({ symbol: quote.symbol, price: quote.regularMarketPrice });
    } else {
      res.status(404).json({ error: "Symbol not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// Fetching NAV (Net Asset Value) of a mutual fund from Eastmoney
app.get("/api/fund/:code", async (req, res) => {
  const code = req.params.code;
  const url = `https://fundgz.1234567.com.cn/js/${code}.js`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Referer': `https://fund.eastmoney.com/${code}.html`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      responseType: 'text'
    });

    const match = response.data.match(/^jsonpgz\((.*)\);?$/);
    if (!match || !match[1]) {
      return res.status(500).json({ error: "Invalid API format" });
    }

    const fundData = JSON.parse(match[1]);

    res.json({
      symbol: fundData.fundcode,
      name: fundData.name,
      price: Number(fundData.gsz), // use Number instead of parseFloat to avoid NaN
      updatedAt: fundData.gztime
    });

  } catch (err) {
    console.error("ERROR:", err.message);
    return res.status(500).json({ error: "Failed to fetch fund info" });
  }
});

app.get("/api/fund/:code/history", async (req, res) => {
  const code = req.params.code;
  const pageSize = 30; // last 30 days
  const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=${pageSize}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Referer': `https://fund.eastmoney.com/${code}.html`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const rawList = response.data?.Data?.LSJZList;
    if (!rawList || rawList.length === 0) {
      return res.status(404).json({ error: "No history data found" });
    }

    const history = rawList.map(entry => ({
      date: entry.FSRQ, // date string
      value: parseFloat(entry.DWJZ) // daily NAV
    }));

    res.json(history.reverse()); // reverse for oldest-to-newest order
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch fund history" });
  }
});

app.get("/api/stock/:symbol/history", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const queryOptions = {
      period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      interval: "1d",
    };

    const results = await yahooFinance.historical(symbol, queryOptions);

    const history = results.map(entry => ({
      date: entry.date.toISOString().split("T")[0],
      value: entry.close,
    }));

    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch stock history" });
  }
});


app.get("/api/stock/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const result = await yahooFinance.quote(symbol);

    res.json({
      symbol: result.symbol,
      name: result.shortName || result.longName || symbol,
      price: result.regularMarketPrice,
      updatedAt: new Date(result.regularMarketTime * 1000).toISOString(), // convert timestamp
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch stock price" });
  }
});