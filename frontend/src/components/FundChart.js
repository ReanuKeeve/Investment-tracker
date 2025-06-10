import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function FundChart({ code }) {
  const [data, setData] = useState([]);
  const [price, setPrice] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const isFund = /^[0-9]+$/.test(code);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!code) return;

    const fetchPrice = () => {
      const priceUrl = isFund
        ? `${API_BASE}/api/fund/${code}`
        : `${API_BASE}/api/stock/${code}`;

      fetch(priceUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch price");
          return res.json();
        })
        .then((res) => {
          setPrice(res.price);
          setUpdatedAt(res.updatedAt || null);
          setName(res.name || code);
        })
        .catch((err) => {
          console.error("Price fetch error:", err);
          setPrice(null);
          setUpdatedAt(null);
        });
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 1000);
    return () => clearInterval(interval);
  }, [code]);

  useEffect(() => {
    if (!code) return;

    const historyUrl = isFund
      ? `${API_BASE}/api/fund/${code}/history`
      : `${API_BASE}/api/stock/${code}/history`;

    fetch(historyUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch historical data");
        return res.json();
      })
      .then((res) => {
        setData(res); // Expected format: [{ date, value }]
      })
      .catch((err) => {
        console.error("History fetch error:", err);
        setError("Could not load historical chart data");
        setData([]);
      });
  }, [code]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Chart for {name || code}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ marginTop: "1rem" }}>
            <strong>Real-Time Price:</strong>{" "}
            {price ? (
              <>
                {isFund ? "¥" : "$"} {price.toFixed(4)}{" "}
                {updatedAt && <em>(as of {updatedAt})</em>}
              </>
            ) : (
              "Loading..."
            )}
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
