import os from "os";
import path from "path";
import readline from "readline";
import getArgvs from "./modules/getArgvs.js";
import listFiles from "./modules/listFiles.js";
import { validateDir, validateFile } from "./modules/validatePath.js";

import getOsInfo from "./modules/getOsInfo.js";
import calculateHash from "./modules/calcHash.js";
import { checkPathType } from "./modules/checkIsPathExist.js";
import { osCommands } from "./constants.js";
import fs from "fs/promises";
import { createReadStream } from "fs";
import stream from "stream/promises";

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
    this.setOnInput();
  }

  init() {
    if (!this.variables.username) {
      console.log("Username was not given");
      this.rl.close();
      process.exit(1);
    }
    const greetingMsg = `Welcome to the File Manager, ${this.variables.username}!\n`;
    console.log("\x1b[1m", greetingMsg, "\x1b[0m");
    this.showCurrPath();
    this.rl.prompt();
  }

  showCurrPath() {
    const pathMsg = `You are currently in ${this.startDir}\n`;
    console.log(pathMsg);
  }

  showGoodbyeMsg() {
    const goodbyeMsg = `Thank you for using File Manager, ${this.variables.username}!\n`;
    console.log("\n", "\x1b[1m", goodbyeMsg, "\x1b[0m");
  }

  async checkInput(input) {
    const regexp = /(?<!\\) /g;
    if (input === "") {
      console.log("Invalid input");
      return;
    }
    const inputArray = input.split(regexp);
    const command = inputArray[0];
    const commandArg = inputArray[1];

    if (command === "up") {
      this.executeUp();
    } else if (command === "cd") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to directory");
      } else if (inputArray.length > 2) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeCd(commandArg);
      }
    } else if (command === "ls") {
      try {
        const files = await listFiles(this.currDir);
        console.log(files);
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "os") {
      if (inputArray.length === 1) {
        console.log(
          `Invalid input: provide one of the arguments: ${osCommands.join(
            ", "
          )}`
        );
      } else if (inputArray.length > 2) {
        console.log("Invalid input: too many arguments.");
      } else {
        if (osCommands.includes(commandArg)) {
          try {
            getOsInfo(commandArg);
          } catch (err) {
            console.error(err.message);
          }
        } else {
          console.log("Invalid input");
          console.log(`Available commands: ${osCommands.join(", ")}`);
        }
      }
    } else if (command === "hash") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file");
      } else if (inputArray.length > 2) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeHash(commandArg);
      }
    } else if (command === "cat") {
      const newPath = path.resolve(this.currDir, commandArg);
      const rs = createReadStream(newPath, { encoding: "utf-8" });
      rs.on("data", (chunk) => console.log(chunk));
      // rs.pipe(process.stdout);
      // rs.resume();
      await stream.finished(rs);
      console.log("finished");
    } else {
      console.log("Invalid input");
    }
  }

  executeUp() {
    if (this.currDir !== this.startDir) {
      const parsedPath = path.parse(this.currDir);
      this.currDir = parsedPath.dir;
    } else {
      console.log("Operation failed: Can't go up from root directory");
    }
  }

  async executeCd(pathToFile) {
    try {
      const newPath = await validateDir(pathToFile, this.currDir);
      if (newPath) {
        if (newPath.startsWith(this.startDir)) {
          this.currDir = newPath;
        } else {
          console.log("Operation failed: Can't go up from root directory");
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async executeHash(inputPath) {
    try {
      const pathToFile = await validateFile(inputPath, this.currDir);
      if (pathToFile) {
        await calculateHash(pathToFile);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  setOnInput() {
    this.rl.on("line", async (input) => {
      if (input === ".exit") {
        this.showGoodbyeMsg();
        this.rl.close();
      } else {
        await this.checkInput(input);
        console.log(`\nYou are currently in ${this.currDir}`);
        this.rl.prompt();
      }
    });
  }

  setOnClose() {
    this.rl.on("SIGINT", () => {
      this.showGoodbyeMsg();
      this.rl.close();
    });
  }
}

export { FileManager };
