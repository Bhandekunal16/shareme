const os = require("os");
const fs = require("fs");

class networkInterface {
  ip;
  #config = "../shareme-client/public/config.json";
  #localHost = "127.0.0.1";

  constructor() {
    this.#getLocalIP();
  }

  #getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
      for (const net of interfaces[name]) {
        if (net.family === "IPv4" && !net.internal) {
          this.#writeToFile({ ip: net.address });
          return (this.ip = net.address);
        }
      }
    }
    return (this.ip = this.#localHost);
  }

  #writeToFile(input) {
    try {
      fs.writeFileSync(this.#config, JSON.stringify(input, null, 2));
    } catch (err) {
      console.error("Error writing file:", err);
    }
  }
}

module.exports = networkInterface;
