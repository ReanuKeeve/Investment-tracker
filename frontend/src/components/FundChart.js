import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// Component to display chart and real-time price of a fund or stock
export default function FundChart({ code }) {
  // State to hold historical data for chart
  const [data, setData] = useState([]);

  // State to hold real-time price and update time
  const [price, setPrice] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [name,  setName] = useState("");  // State to hold the name of the fund or stock
  // Error state for display fallback
  const [error, setError] = useState(null);

  // Determine if the code is a fund (numeric only) or a stock (contains letters)
  const isFund = /^[0-9]+$/.test(code);

  // useEffect runs whenever `code` changes
useEffect(() => {
  if (!code) return;

  const isFund = /^[0-9]+$/.test(code);
  const priceUrl = isFund
    ? `http://localhost:5000/api/fund/${code}`
    : `http://localhost:5000/api/stock/${code}`;

  const fetchPrice = () => {
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
      .catch(() => {
        setPrice(null);
        setUpdatedAt(null);
      });
  };

  // Initial fetch immediately
  fetchPrice();

  // Set interval to fetch every 5 seconds
  const interval = setInterval(fetchPrice, 1000);

  // Cleanup interval on component unmount or code change
  return () => clearInterval(interval);
}, [code]);

  // Render the component
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Chart for {code}</h2>

      {/* Show error if there's a problem */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show chart if data is loaded */}
      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          {/* Show real-time price under the chart */}
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