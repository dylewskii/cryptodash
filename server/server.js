const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/api", (req, res, next) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

app.listen(PORT, () => {
  console.log(`Express listening on port: ${PORT}`);
});
