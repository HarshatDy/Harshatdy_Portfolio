const slot = process.argv[2];
if (!slot) {
  console.error("Usage: node india-fetch-cron.js <open|midday|close>");
  process.exit(1);
}

const base = process.env.APP_URL || "http://localhost:3000";
const url = `${base}/api/finance/india/fetch?slot=${slot}`;

console.log(`[${new Date().toISOString()}] Fetching ${url}`);

fetch(url)
  .then((res) => {
    console.log(`[${new Date().toISOString()}] ${slot} -> ${res.status}`);
    process.exit(res.ok ? 0 : 1);
  })
  .catch((err) => {
    console.error(`[${new Date().toISOString()}] ${slot} failed:`, err.message);
    process.exit(1);
  });
