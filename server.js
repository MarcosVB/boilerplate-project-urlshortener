require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/shorturl", (req, res) => {
  if (!/https?:\/\/(?:www\.)?.+\..+(?:\/.*)?/.test(req.body.url)) {
    res.json({ error: "invalid url" });
    return;
  }

  const urlObject = postUrl(req.body.url);
  res.json(urlObject);
});

app.get("/api/shorturl/:shortUrl", (req, res) => {
  res.redirect(urlDB[req.params.shortUrl].original_url);
});

const urlDB = [];

function postUrl(url) {
  const shortUrl = urlDB.length;
  urlDB.push({
    original_url: url,
    short_url: shortUrl
  });
  return urlDB[shortUrl];
}
