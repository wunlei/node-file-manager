import os from "os";
import path from "path";
import readline from "readline";
import getArgvs from "./modules/getArgvs.js";
import listFiles from "./modules/listFiles.js";
import getOsInfo from "./modules/getOsInfo.js";
import calculateHash from "./modules/calcHash.js";
import { osCommands } from "./constants.js";
import { readFile } from "./modules/readFile.js";
import { validateDir, validateFile } from "./modules/validatePath.js";
import { checkIsFileExist } from "./modules/checkIsPathExist.js";
import fs from "fs/promises";
import zlib from "zlib";
import renameFile from "./modules/renameFile.js";
import copyFile from "./modules/copyFile.js";
import { createReadStream, createWriteStream } from "fs";
import { finished } from "stream/promises";
import compressBr from "./modules/compress.js";
import decompressBr from "./modules/decompress.js";

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
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file");
      } else if (inputArray.length > 2) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeCat(commandArg);
      }
    } else if (command === "add") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file");
      } else if (inputArray.length > 2) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeAdd(commandArg);
      }
    } else if (command === "rn") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file & new file name");
      } else if (inputArray.length > 3) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await renameFile(this.currDir, commandArg, inputArray[2]);
      }
    } else if (command === "rm") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file");
      } else if (inputArray.length > 2) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeRm(commandArg);
      }
    } else if (command === "cp") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file & new file name");
      } else if (inputArray.length > 3) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeCp(commandArg, inputArray[2]);
      }
    } else if (command === "mv") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file & new file name");
      } else if (inputArray.length > 3) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeMv(commandArg, inputArray[2]);
      }
    } else if (command === "compress") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file & new file name");
      } else if (inputArray.length > 3) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeCompress(commandArg, inputArray[2]);
      }
    } else if (command === "decompress") {
      if (inputArray.length === 1) {
        console.log("Invalid input: Provide path to file & new file name");
      } else if (inputArray.length > 3) {
        console.log(
          "Invalid input: too many arguments. For path with spaces escape every space with '\\\\', e.g.: cd My\\\\ folder"
        );
      } else {
        await this.executeDecompress(commandArg, inputArray[2]);
      }
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

  async executeCat(inputPath) {
    try {
      const pathToFile = await validateFile(inputPath, this.currDir);
      if (pathToFile) {
        await readFile(pathToFile);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async executeAdd(inputPath) {
    try {
      if (inputPath) {
        const parsedPath = inputPath.replaceAll("\\\\ ", " ");
        const newPath = path.resolve(this.currDir, parsedPath);
        const isFileExist = await checkIsFileExist(newPath);
        if (isFileExist) {
          throw new Error("Operation failed: File already exist");
        }
        await fs.writeFile(newPath, "", { flag: "wx" });
      } else {
        console.log("Invalid input: Set right path");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async executeRm(inputPath) {
    try {
      const source = await validateFile(inputPath, this.currDir);
      if (source) {
        await fs.rm(source);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async executeMv(source, copyPath) {
    const sourceFile = await this.executeCp(source, copyPath);
    console.log(sourceFile);

    if (sourceFile) {
      await fs.rm(sourceFile);
    }
  }

  async executeCp(source, copyPath) {
    const result = await copyFile(this.currDir, source, copyPath);
    return result;
  }

  async executeCompress(source, dest) {
    await compressBr(this.currDir, source, dest);
  }

  async executeDecompress(source, dest) {
    await decompressBr(this.currDir, source, dest);
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
