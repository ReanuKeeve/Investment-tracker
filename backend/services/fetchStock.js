const yahooFinance = require("yahoo-finance2").default;

exports.fetchStockPrice = async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const result = await yahooFinance.quote(symbol);
    if (!result || !result.symbol) {
      return res.status(404).json({ error: "Symbol not found" });
    }

    res.json({
      symbol: result.symbol,
      name: result.shortName || result.longName || symbol,
      price: result.regularMarketPrice,
      updatedAt: new Date(result.regularMarketTime * 1000).toISOString()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
};

exports.fetchStockHistory = async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const results = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      interval: "1d"
    });

    const history = results.map(entry => ({
      date: entry.date.toISOString().split("T")[0],
      value: entry.close
    }));

    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch stock history" });
  }
};