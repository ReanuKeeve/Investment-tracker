const express = require("express");
const router = express.Router();

// Temporary in-memory asset store
let assets = [];

router.get("/", (req, res) => {
  res.json(assets);
});

router.post("/", (req, res) => {
  const { name, value } = req.body;
  if (!name || typeof value !== "number") {
    return res.status(400).json({ error: "Invalid asset data" });
  }

  const newAsset = { name, value };
  assets.push(newAsset);
  res.status(201).json(newAsset);
});

module.exports = router;