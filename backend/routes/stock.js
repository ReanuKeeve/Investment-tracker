const express = require("express");
const router = express.Router();
const { fetchStockPrice, fetchStockHistory } = require("../services/fetchStock");

router.get("/:symbol", fetchStockPrice);
router.get("/:symbol/history", fetchStockHistory);

module.exports = router;