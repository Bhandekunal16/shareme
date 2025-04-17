const { spawn } = require("child_process");
const readline = require("readline");

let [clientProcess, serverProcess] = [null, null];

function runClient() {
  console.log("Starting React client...");
  clientProcess = spawn("npm", ["start"], {
    cwd: "./shareme-client",
    shell: true,
  });

  const rl = readline.createInterface({
    input: clientProcess.stdout,
    terminal: false,
  });

  rl.on("line", (line) => {
    console.log(`[React] ${line}`);
  });

  clientProcess.stderr.on("data", (data) => {
    console.error(`[React Error] ${data.toString()}`);
  });

  clientProcess.on("exit", (code) => {
    console.log(`React client exited with code ${code}`);
  });
}

function runServer() {
  console.log("Starting Express server...");
  serverProcess = spawn("node", ["server.js"], {
    cwd: "./server",
    shell: true,
  });

  const rl = readline.createInterface({
    input: serverProcess.stdout,
    terminal: false,
  });

  rl.on("line", (line) => {
    console.log(`[Express] ${line}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`[Express Error] ${data.toString()}`);
  });

  serverProcess.on("exit", (code) => {
    console.log(`Express server exited with code ${code}`);
  });
}

function shutdown() {
  console.log("\nShutting down processes...");
  if (clientProcess) clientProcess.kill();
  if (serverProcess) serverProcess.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function application() {
  await Promise.all([runClient(), runServer()]);
  console.log("Both client and server are running. Press Ctrl+C to stop.");
}

application();
