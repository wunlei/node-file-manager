import readline from "readline";
import os from "os";
import { getArgvs } from "./modules/getArgvs.js";

class FileManager {
  constructor() {
    this.startDir = os.homedir();
    this.currDir = this.startDir;
    this.variables = getArgvs();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.setOnClose();
  }

  init() {
    const greetingMsg = `Welcome to the File Manager, ${this.variables.username}!\n`;
    console.log("\x1b[1m", greetingMsg, "\x1b[0m");
  }

  checkInput(input) {}

  setOnClose() {
    const goodbyeMsg = `Thank you for using File Manager, ${this.variables.username}!\n`;

    this.rl.on("SIGINT", () => {
      console.log("\x1b[1m", goodbyeMsg, "\x1b[0m");
      this.rl.close();
    });

    this.rl.on("line", (input) => {
      if (input === ".exit") {
        console.log("\x1b[1m", goodbyeMsg, "\x1b[0m");
        this.rl.close();
      } else {
        this.checkInput(input);
      }
    });
  }
}

export { FileManager };
