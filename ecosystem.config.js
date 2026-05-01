module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "india-cron-open",
      script: "scripts/india-fetch-cron.js",
      args: "open",
      cron_restart: "0 4 * * 1-5",
      autorestart: false,
      watch: false,
      env: {
        APP_URL: "http://localhost:3000",
      },
    },
    {
      name: "india-cron-midday",
      script: "scripts/india-fetch-cron.js",
      args: "midday",
      cron_restart: "0 7 * * 1-5",
      autorestart: false,
      watch: false,
      env: {
        APP_URL: "http://localhost:3000",
      },
    },
    {
      name: "india-cron-close",
      script: "scripts/india-fetch-cron.js",
      args: "close",
      cron_restart: "30 10 * * 1-5",
      autorestart: false,
      watch: false,
      env: {
        APP_URL: "http://localhost:3000",
      },
    },
  ],
};
