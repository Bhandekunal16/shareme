const os = require("os");
const fs = require("fs");

class networkInterface {
  ip;
  #config = "../shareme-client/public/config.json";
  #localHost = "127.0.0.1";
  #interfaces = os.networkInterfaces();

  constructor() {
    this.#getLocalIP();
  }

  #getLocalIP() {
    for (const name in this.#interfaces) {
      for (const net of this.#interfaces[name]) {
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
    } catch (e) {
      console.error("Error", e);
    }
  }
}

module.exports = networkInterface;
