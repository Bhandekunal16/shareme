const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const network = require("./network");
const appConfig = require("./app.json");

const app = express();
const port = appConfig.port;
const ip = new network().ip;
const uploadDir = appConfig.uploadDir;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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

app.post("/upload", upload.array("myFiles"), (req, res) => {
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

app.listen(port, ip, (err) => {
  err
    ? console.error(err)
    : console.log(`Server is running at http://${ip}:${port}`);
});
