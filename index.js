require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const urlParser = require("url");
const { urlencoded } = require("body-parser");
// Basic Configuration
const port = process.env.PORT || 3000;
let urlData = [];
// app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.static(__dirname + "/public/"));

app.use(cors());
app.use(urlencoded({ extended: true }));
app.get("/", function (req, res) {
  // res.sendFile(process.cwd() + "/views/index.html");
  res.sendFile(__dirname + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const longUrl = req.body.url;
  dns.lookup(urlParser.parse(longUrl).hostname, (err, address) => {
    if (!address) {
      res.send({ error: "invalid-url" });
    } else {
      const urlShortObj = { longUrl, shortUrl: urlData.length + 1 };
      urlData.push(urlShortObj);
      res.send(urlShortObj);
    }
  });
});
app.get("/api/:url", function (req, res) {
  const url = req.params.url;
  const redirectUrl = urlData.filter((items) => items.shortUrl == url)[0]
    .longUrl;
  res.redirect(redirectUrl);
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
