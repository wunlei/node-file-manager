import path from "path";
import { checkIsDirExist } from "./checkIsPathExist.js";

const changeDirectory = async (input, currDir) => {
  try {
    const inputPath = input.replace("cd ", "").trim();
    if (inputPath) {
      const newPath = path.resolve(currDir, inputPath);

      const isDirExist = await checkIsDirExist(newPath);

      if (!isDirExist) {
        throw new Error("Operation failed: No such directory");
      }

      return newPath;
    } else {
      console.log("Invalid input: Set right path");
    }
  } catch (error) {
    throw error;
  }
};

export default changeDirectory;
