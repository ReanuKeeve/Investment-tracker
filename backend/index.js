const express = require("express");
const cors = require("cors");
const axios = require("axios");
const API_KEY = "4fcd4fd5632040f2918d46201cf7771d"; //  twelvedata  api key
const yahooFinance = require("yahoo-finance2").default; // yahoo finance api


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Temporary in-memory store (resets on server restart)
let assets = [];

app.get("/", (req, res) => {
  res.send("API is running!");
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