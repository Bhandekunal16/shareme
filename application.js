const { spawn } = require("child_process");
const readline = require("readline");

let ShoutDownSignals = ["SIGINT", "SIGTERM"];
let [clientProcess, serverProcess] = [null, null];

class Application {
  #config = {
    client: {
      path: "./shareme-client",
      command: "npm",
      args: "start",
    },
    server: {
      path: "./server",
      command: "node",
      args: "server.js",
    },
  };

  #interfaceCreator(path, arr) {
    return spawn(arr[0], [arr[1]], { cwd: path, shell: true });
  }

  #runnerProcess(process, processName) {
    const rl = readline.createInterface({
      input: process.stdout,
      terminal: false,
    });

    rl.on("line", (line) => {
      console.log(`[${processName}] ${line}`);
    });

    process.stderr.on("data", (data) => {
      console.error(`[${processName} Error] ${data.toString()}`);
    });

    process.on("exit", (code) => {
      console.log(`${processName} process exited with code ${code}`);
    });
  }

  #runClient() {
    console.log("Starting React client...");
    clientProcess = this.#interfaceCreator(this.#config.client.path, [
      this.#config.client.command,
      this.#config.client.args,
    ]);
    this.#runnerProcess(clientProcess, "React");
  }

  #runServer() {
    console.log("Starting Express server...");
    serverProcess = this.#interfaceCreator(this.#config.server.path, [
      this.#config.server.command,
      this.#config.server.args,
    ]);
    this.#runnerProcess(serverProcess, "Express");
  }

  shutdown() {
    console.log("\nShutting down processes...");
    let Process = [clientProcess, serverProcess];
    for (let i = 0; i < Process.length; i++) {
      if (Process[i]) Process[i].kill();
    }
    process.exit(0);
  }

  start() {
    this.#runClient();
    this.#runServer();
    console.log("Both client and server are running. Press Ctrl+C to stop.");
  }
}

const app = new Application();

for (let i = 0; i < ShoutDownSignals.length; i++) {
  process.on(ShoutDownSignals[i], app.shutdown.bind(app));
}

app.start();
