const express = require("express");
const router = express.Router();
const { fetchFundPrice, fetchFundHistory } = require("../services/fetchFund");

router.get("/:code", fetchFundPrice);
router.get("/:code/history", fetchFundHistory);

module.exports = router;