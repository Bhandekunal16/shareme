const os = require("os");
const fs = require("fs");

class networkInterface {
  ip;

  constructor() {
    this.#getLocalIP();
  }

  #getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
      for (const net of interfaces[name]) {
        if (net.family === "IPv4" && !net.internal){
          this.#writeToFile({ip : net.address});
          return (this.ip = net.address);
        }
          
      }
    }
    return (this.ip = "127.0.0.1");
  }

  #writeToFile(input) {
    try {
      console.log("i am in");
      fs.writeFileSync("../shareme-client/public/config.json", JSON.stringify(input, null, 2));
      console.log("File written successfully");
    } catch (err) {
      console.error("Error writing file:", err);
    }
  }
}

module.exports = networkInterface;
