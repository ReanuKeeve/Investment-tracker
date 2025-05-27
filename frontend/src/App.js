import React, { useState, useEffect } from "react";

function App() {
  const [assets, setAssets] = useState([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  // Fetch assets on load
  useEffect(() => {
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch((err) => console.error("Failed to fetch assets:", err));
  }, []);

  const handleAddAsset = () => {
    const numericValue = parseFloat(value);
    if (!name || isNaN(numericValue)) return;

    fetch("http://localhost:5000/api/assets", {
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

      <div style={{ marginBottom: "1rem" }}>
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
    </div>
  );
}

export default App;