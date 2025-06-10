import React, { useState, useEffect } from "react";
import FundChart from "./components/FundChart";

function App() {
  const [assets, setAssets] = useState([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [selectedCode, setSelectedCode] = useState("002610");
  const fundOptions = [
    { code: "002610", name: "Bosera Gold ETF Linkage A" },
    { code: "AAPL", name: "Apple Inc." },
    { code: "GOOGL", name: "Alphabet Inc." },
    { code: "TSLA", name: "Tesla Inc." },
    { code: "AMZN", name: "Amazon.com Inc." },
    { code: "MSFT", name: "Microsoft Corp." },
    { code: "BABA", name: "Alibaba Group Holding Ltd." },
    { code: "FB", name: "Meta Platforms Inc." },
    { code: "NFLX", name: "Netflix Inc." },
    { code: "NVDA", name: "NVIDIA Corp." },
    { code: "V", name: "Visa Inc." },
    { code: "JPM", name: "JPMorgan Chase & Co." },
    { code: "WMT", name: "Walmart Inc." },
    { code: "DIS", name: "Walt Disney Co." },
    { code: "PYPL", name: "PayPal Holdings Inc." },
    { code: "INTC", name: "Intel Corp." },
    { code: "CSCO", name: "Cisco Systems Inc." },
    { code: "PEP", name: "PepsiCo Inc." },
    { code: "KO", name: "Coca-Cola Co." },
    { code: "MRK", name: "Merck & Co. Inc." },
    { code: "SPY", name: "S&P 500 ETF Trust" }
  ]

  // Fetch assets on load
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/assets`)
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch((err) => console.error("Failed to fetch assets:", err));
  }, []);

  const handleAddAsset = () => {
    const numericValue = parseFloat(value);
    if (!name || isNaN(numericValue)) return;

    fetch(`${process.env.REACT_APP_API_BASE}/api/assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value: numericValue }),
    })
      .then((res) => res.json())
      .then((newAsset) => {
        setAssets([...assets, newAsset]);
        setName("");
        setValue("");
      })
      .catch((err) => console.error("Failed to add asset:", err));
  };

  const totalNetWorth = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Investment Tracker</h1>

      <div class='inputs' style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Asset Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Asset Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <button onClick={handleAddAsset} style={{ padding: "0.5rem 1rem" }}>
          Add
        </button>
      </div>

      <h2>Assets:</h2>
      <ul>
        {assets.map((asset, index) => (
          <li key={index}>
            {asset.name}: RMB {asset.value.toFixed(2)}
          </li>
        ))}
      </ul>

      <h2>Total Net Worth: RMB {totalNetWorth.toFixed(2)}</h2>
        <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="fund-select">Select Fund: </label>
        <select
          id="fund-select"
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
        >
          {fundOptions.map((fund) => (
            <option key={fund.code} value={fund.code}>
              {fund.name}
            </option>
          ))}
        </select>
      </div>
      <FundChart code={selectedCode} />
    </div>
    
    
  );
}

export default App;