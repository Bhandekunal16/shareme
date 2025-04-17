const { spawn } = require("child_process");
const readline = require("readline");

let [clientProcess, serverProcess] = [null, null];

class Application {
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
  clientProcess = app.interfaceCreator("./shareme-client", ["npm", "start"]);
  app.runnerProcess(clientProcess, "React");
}

function runServer() {
  console.log("Starting Express server...");
  serverProcess = app.interfaceCreator("./server", ["node", "server.js"]);
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
