const express = require("express");
/* const cors = require("cors");

const allowedOrigins = ['https://assets-ctj8.onrender.com'];

const corsOptions = { 
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};


// Safe CORS config — only use once
app.use(cors(corsOptions));
*/

const app = express();
app.use(express.json());

// Simple root route only
app.get("/", (req, res) => {
  res.send("Backend is running clean");
});

app.use("/api/assets", require("./routes/assets"));
app.use("/api/fund", require("./routes/fund"));
app.use("/api/stock", require("./routes/stock"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
