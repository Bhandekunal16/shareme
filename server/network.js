const os = require("os");

class networkInterface {
  ip;

  constructor() {
    this.#getLocalIP();
  }

  #getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
      for (const net of interfaces[name]) {
        if (net.family === "IPv4" && !net.internal)
          return (this.ip = net.address);
      }
    }
    return (this.ip = "127.0.0.1");
  }
}

module.exports = networkInterface;
