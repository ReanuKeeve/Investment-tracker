const axios = require("axios");

exports.fetchFundPrice = async (req, res) => {
  const code = req.params.code;
  const url = `https://fundgz.1234567.com.cn/js/${code}.js`;

  try {
    const response = await axios.get(url, {
      headers: {
        Referer: `https://fund.eastmoney.com/${code}.html`,
        "User-Agent": "Mozilla/5.0"
      },
      responseType: "text"
    });

    const match = response.data.match(/^jsonpgz\((.*)\);?$/);
    if (!match || !match[1]) {
      return res.status(500).json({ error: "Invalid API format" });
    }

    const fundData = JSON.parse(match[1]);

    res.json({
      symbol: fundData.fundcode,
      name: fundData.name,
      price: Number(fundData.gsz),
      updatedAt: fundData.gztime
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch fund info" });
  }
};

exports.fetchFundHistory = async (req, res) => {
  const code = req.params.code;
  const pageSize = 30;
  const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=${pageSize}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Referer: `https://fund.eastmoney.com/${code}.html`,
        "User-Agent": "Mozilla/5.0"
      }
    });

    const rawList = response.data?.Data?.LSJZList;
    if (!rawList || rawList.length === 0) {
      return res.status(404).json({ error: "No history data found" });
    }

    const history = rawList.map(entry => ({
      date: entry.FSRQ,
      value: parseFloat(entry.DWJZ)
    }));

    res.json(history.reverse());
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch fund history" });
  }
};