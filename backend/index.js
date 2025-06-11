const express = require("express");
const cors = require("cors");
const allowedOrigins = ['https://assets-ctj8.onrender.com'];

const app = express();
app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const PORT = process.env.PORT || 5000;

// Basic root route
app.get("/", (req, res) => {
  res.send("Backend is running! You're great!");
});

// Route imports
app.use("/api/assets", require("./routes/assets"));
app.use("/api/fund", require("./routes/fund"));
app.use("/api/stock", require("./routes/stock"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
