const express = require("express");
const cors = require("cors");

const allowedOrigins = ['https://assets-ctj8.onrender.com'];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

const app = express();

// ✅ CORS before any other middleware or routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running! You're great!");
});

app.use("/api/assets", require("./routes/assets"));
app.use("/api/fund", require("./routes/fund"));
app.use("/api/stock", require("./routes/stock"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
