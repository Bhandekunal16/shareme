const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const multer = require("multer");
const path = require("path");
const port = 3000;
const ip = "10.2.1.133";
const uploadDir = "../data";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const removeFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return reject(new Error("File does not exist"));
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          return reject(unlinkErr);
        }

        resolve(`File ${path.basename(filePath)} successfully deleted`);
      });
    });
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app.use(cors());

app.get("/", (req, res) => {
  res.sendStatus(200).send("Hello World");
});

app.get("/api/files", (req, res) => {
  const directoryPath = path.join(__dirname, uploadDir);
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading directory" });
    }
    res.json(files);
  });
});

app.get("/api/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, uploadDir, filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File not found");
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error during file download", err);
      }
    });
  });
});

app.post("/upload", upload.single("myFile"), (req, res) => {
  console.log("Uploaded file:", req.file);
  res.send("File uploaded successfully!");
});

app.delete("/api/remove/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, uploadDir, filename);

  try {
    const msg = await removeFile(filePath);
    res.status(200).send(msg);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.listen(port, ip, () => {
  console.log(`Listening on ${ip}:${port}`);
});
