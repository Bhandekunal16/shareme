const express = require("express");
const app = express();

const fs = require("fs");
const multer = require("multer");
const path = require("path");
const port = 3000;
const ip = "10.2.1.133";
const uploadDir = "../data";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendStatus(200).send("Hello World");
});

app.post("/upload", upload.single("myFile"), (req, res) => {
  console.log("Uploaded file:", req.file);
  res.send("File uploaded successfully!");
});

app.listen(port, ip, () => {
  console.log(`Listening on ${ip}:${port}`);
});
