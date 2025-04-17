const { spawn } = require("child_process");
const readline = require("readline");

let [clientProcess, serverProcess] = [null, null];

class Application {
  static config = {
    client: {
      path: "./shareme-client",
      command: "npm",
      args: ["start"],
    },
    server: {
      path: "./server",
      command: "node",
      args: ["server.js"],
    },
  };

  interfaceCreator(path, arr) {
    return spawn(arr[0], [arr[1]], { cwd: path, shell: true });
  }

  runnerProcess(process, processName) {
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
}

const app = new Application();

function runClient() {
  console.log("Starting React client...");
  clientProcess = app.interfaceCreator(app.config.client.path, [
    app.config.client.command,
    app.config.client.args,
  ]);
  app.runnerProcess(clientProcess, "React");
}

function runServer() {
  console.log("Starting Express server...");
  serverProcess = app.interfaceCreator(app.config.server.path, [
    app.config.server.command,
    app.config.server.args,
  ]);
  app.runnerProcess(serverProcess, "Express");
}

function shutdown() {
  console.log("\nShutting down processes...");
  let Process = [clientProcess, serverProcess];
  for (let i = 0; i < Process.length; i++) {
    if (Process[i]) Process[i].kill();
  }
  process.exit(0);
}

let ShoutDownSignals = ["SIGINT", "SIGTERM"];

for (let i = 0; i < ShoutDownSignals.length; i++) {
  process.on(ShoutDownSignals[i], shutdown);
}
function application() {
  runClient();
  runServer();
  console.log("Both client and server are running. Press Ctrl+C to stop.");
}

application();
