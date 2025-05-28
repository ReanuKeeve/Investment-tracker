const axios = require("axios");

async function fetchFund(code) {
  const url = `https://fundgz.1234567.com.cn/js/${code}.js`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Referer': `https://fund.eastmoney.com/${code}.html`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      responseType: 'text'
    });

    console.log("Raw response:\n", response.data);

    const match = response.data.match(/^jsonpgz\((.*)\);?$/);
    if (!match || !match[1]) {
      console.log("⚠️ Could not extract JSON from response.");
      return;
    }

    const fundData = JSON.parse(match[1]);
    console.log("Parsed data:\n", fundData);

  } catch (error) {
    console.error("Error fetching fund data:", error.message);
  }
}

fetchFund("002610");
