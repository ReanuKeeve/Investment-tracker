const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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