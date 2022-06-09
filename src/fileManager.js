import fs from "fs/promises";
import os from "os";
import path from "path";
import readline from "readline";
import getArgvs from "./modules/utils/getArgvs.js";
import listFiles from "./modules/navigation/listFiles.js";
import getOsInfo from "./modules/os/getOsInfo.js";
import calculateHash from "./modules/hash/calcHash.js";
import compressBr from "./modules/zlib/compress.js";
import decompressBr from "./modules/zlib/decompress.js";
import copyFile from "./modules/filesystem/copyFile.js";
import renameFile from "./modules/filesystem/renameFile.js";
import { readFile } from "./modules/filesystem/readFile.js";
import { validateFile } from "./modules/utils/validatePath.js";
import { checkIsFileExist } from "./modules/utils/checkIsPathExist.js";
import { ErrorMsg, osCommands, regexpSpaces } from "./constants.js";
import {
  showCurrPath,
  showGoodbyeMsg,
  showGreeting,
} from "./modules/utils/showMessage.js";
import { handleError } from "./modules/utils/handleErrors.js";
import validateArguments from "./modules/utils/validateArguments.js";
import getDir from "./modules/navigation/changeDir.js";
import getParsedPath from "./modules/utils/getParsedPath.js";

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

  setOnClose() {
    this.rl.on("SIGINT", () => {
      showGoodbyeMsg(this.variables.username);
      this.rl.close();
    });
  }

  setOnInput() {
    this.rl.on("line", async (input) => {
      if (input === ".exit") {
        showGoodbyeMsg(this.variables.username);
        this.rl.close();
      } else {
        await this.checkUserInput(input);
        showCurrPath(this.currDir);
        this.rl.prompt();
      }
    });
  }

  init() {
    if (!this.variables.username) {
      console.log(ErrorMsg.NO_USER);
      this.rl.close();
      process.exit(1);
    }

    showGreeting(this.variables.username);
    showCurrPath(this.currDir);
    this.rl.prompt();
  }

  async checkUserInput(input) {
    if (input === "") {
      handleError(ErrorMsg.INVALID_INPUT);
      return;
    }

    const inputArray = input.split(regexpSpaces);
    const command = inputArray[0];
    const commandArg = inputArray[1];
    const commandArgExtra = inputArray[2];

    if (command === "up") {
      try {
        this.executeUp();
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "cd") {
      try {
        const isValidInput = validateArguments(inputArray, 2, "cd");

        if (isValidInput) {
          await this.executeCd(commandArg);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "ls") {
      try {
        const files = await listFiles(this.currDir);
        if (files) {
          console.log(files);
        } else {
          handleError(ErrorMsg.DIR_NOT_EXITS_OP);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "os") {
      try {
        const isValidInput = validateArguments(inputArray, 2, "os");
        if (isValidInput) {
          if (osCommands.includes(commandArg)) {
            getOsInfo(commandArg);
          } else {
            handleError(ErrorMsg.ARGUMENTS_OS);
          }
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "hash") {
      try {
        const isValidInput = validateArguments(inputArray, 2, "hash");
        if (isValidInput) {
          await this.executeHash(commandArg);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "cat") {
      try {
        const isValidInput = validateArguments(inputArray, 2, "cat");
        if (isValidInput) {
          await this.executeCat(commandArg);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "add") {
      try {
        const isValidInput = validateArguments(inputArray, 2, "add");
        if (isValidInput) {
          await this.executeAdd(commandArg);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "rn") {
      try {
        const isValidInput = validateArguments(inputArray, 3, "rn");
        if (isValidInput) {
          await renameFile(this.currDir, commandArg, commandArgExtra);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "rm") {
      try {
        const isValidInput = validateArguments(inputArray, 2, "rm");
        if (isValidInput) {
          await this.executeRm(commandArg);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "cp") {
      try {
        const isValidInput = validateArguments(inputArray, 3, "cp");
        if (isValidInput) {
          await this.executeCp(commandArg, commandArgExtra);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "mv") {
      try {
        const isValidInput = validateArguments(inputArray, 3, "mv");
        if (isValidInput) {
          await this.executeMv(commandArg, commandArgExtra);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "compress") {
      try {
        const isValidInput = validateArguments(inputArray, 3, "compress");

        if (isValidInput) {
          await this.executeCompress(commandArg, commandArgExtra);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else if (command === "decompress") {
      try {
        const isValidInput = validateArguments(inputArray, 3, "compress");

        if (isValidInput) {
          await this.executeDecompress(commandArg, commandArgExtra);
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      handleError(ErrorMsg.EMPTY_COMMAND);
    }
  }

  executeUp() {
    if (this.currDir !== this.startDir) {
      const parsedPath = path.parse(this.currDir);
      this.currDir = parsedPath.dir;
      return true;
    } else {
      handleError(ErrorMsg.HOME_DIR_REACHED);
      return false;
    }
  }

  async executeCd(pathToDir) {
    try {
      const newDir = await getDir(this.startDir, this.currDir, pathToDir);
      if (newDir) {
        this.currDir = newDir;
        return true;
      } else {
        handleError(ErrorMsg.DIR_NOT_EXIST);
        return false;
      }
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }

  async executeHash(inputPath) {
    try {
      const pathToFile = await validateFile(this.currDir, inputPath);
      if (pathToFile) {
        await calculateHash(pathToFile);
      } else {
        handleError(ErrorMsg.FILE_NOT_EXIST);
      }
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }

  async executeCat(inputPath) {
    try {
      const pathToFile = await validateFile(this.currDir, inputPath);
      if (pathToFile) {
        await readFile(pathToFile);
      } else {
        handleError(ErrorMsg.FILE_NOT_EXIST);
      }
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }

  async executeAdd(inputPath) {
    try {
      if (inputPath) {
        const filePath = getParsedPath(this.currDir, inputPath);
        const isFileExist = await checkIsFileExist(filePath);
        if (isFileExist) {
          handleError(ErrorMsg.FILE_ALREADY_EXIST);
          return false;
        }
        await fs.writeFile(filePath, "", { flag: "wx" });
      }
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }

  async executeRm(inputPath) {
    try {
      const source = await validateFile(this.currDir, inputPath);
      if (source) {
        await fs.rm(source);
      } else {
        handleError(ErrorMsg.FILE_NOT_EXIST);
      }
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }

  async executeMv(source, copyPath) {
    if (copyPath === "") {
      handleError(ErrorMsg.EMPTY_NAME);
      return false;
    }
    try {
      const sourceFile = await this.executeCp(source, copyPath);
      if (sourceFile) {
        await fs.rm(sourceFile);
      }
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }

  async executeCp(source, copyPath) {
    if (copyPath === "") {
      handleError(ErrorMsg.EMPTY_NAME);
      return false;
    }
    try {
      const result = await copyFile(this.currDir, source, copyPath);
      return result;
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }

  async executeCompress(source, dest) {
    if (dest === "") {
      handleError(ErrorMsg.EMPTY_NAME);
      return false;
    }
    try {
      await compressBr(this.currDir, source, dest);
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }

  async executeDecompress(source, dest) {
    if (dest === "") {
      handleError(ErrorMsg.EMPTY_NAME);
      return false;
    }
    try {
      await decompressBr(this.currDir, source, dest);
    } catch (error) {
      handleError(ErrorMsg.OPERATION_FAIL);
      console.error(error.message);
    }
  }
}

export { FileManager };
