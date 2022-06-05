import readline from "readline";
import os from "os";
import getArgvs from "./modules/getArgvs.js";
import path from "path";
import listFiles from "./modules/listFiles.js";
import changeDirectory from "./modules/changeDirectory.js";
import getOsInfo from "./modules/getOsInfo.js";

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
    const pathMsg = `You are currently in ${this.startDir}\n`;
    console.log("\x1b[1m", greetingMsg, "\x1b[0m");
    console.log(pathMsg);
    this.rl.prompt();
  }

  async checkInput(input) {
    if (input.trim() === "up") {
      if (this.currDir !== this.startDir) {
        const parsedPath = path.parse(this.currDir);
        this.currDir = parsedPath.dir;
      } else {
        console.log("Operation failed: Can't go up from root directory");
      }
    } else if (input.startsWith("cd ")) {
      try {
        const newPath = await changeDirectory(input, this.currDir);
        if (newPath.startsWith(this.startDir)) {
          this.currDir = newPath;
        } else {
          console.log("Operation failed: Can't go up from root directory");
        }
      } catch (error) {
        console.error(error.message);
      }
    } else if (input.trim() === "ls") {
      try {
        const files = await listFiles(this.currDir);
        console.log(files);
      } catch (err) {
        console.error(err.message);
        return;
      }
    } else if (input.startsWith("os ")) {
      const commands = [
        "--EOL",
        "--cpus",
        "--homedir",
        "--username",
        "--architecture",
      ];

      const inputArg = input.replace("os ", "").trim();

      if (commands.includes(inputArg)) {
        try {
          getOsInfo(inputArg);
        } catch (err) {
          console.error(err.message);
        }
      } else {
        console.log("Invalid input");
        console.log(`Available commands: ${commands.join(", ")}`);
      }
    } else {
      console.log("Invalid input");
    }
  }

  setOnClose() {
    const goodbyeMsg = `Thank you for using File Manager, ${this.variables.username}!\n`;

    this.rl.on("SIGINT", () => {
      console.log("\n", "\x1b[1m", goodbyeMsg, "\x1b[0m");
      this.rl.close();
    });

    this.rl.on("line", async (input) => {
      if (input === ".exit") {
        console.log("\x1b[1m", goodbyeMsg, "\x1b[0m");
        this.rl.close();
      } else {
        await this.checkInput(input);

        console.log(`\nYou are currently in ${this.currDir}`);
        this.rl.prompt();
      }
    });
  }
}

export { FileManager };
