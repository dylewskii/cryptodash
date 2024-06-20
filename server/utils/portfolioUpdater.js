const cron = require("node-cron");

// cron job every hr
cron.schedule("0 * * * *", () => {
  console.log("portfolio value has been saved");
  // update portfolio values function here
});
