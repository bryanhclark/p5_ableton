const express = require("express");

const app = express();

const PORT = 42069;

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => console.log(`fuck yo bitch on port ${PORT}`));
