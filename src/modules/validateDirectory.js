import path from "path";
import { checkPathType } from "./checkIsPathExist.js";

const validateDir = async (destPath, currDir) => {
  try {
    if (destPath) {
      const parsedPath = destPath.replaceAll("\\\\ ", " ");
      console.log("parsed", parsedPath);
      const newPath = path.resolve(currDir, parsedPath);
      const pathType = await checkPathType(newPath);
      if (pathType === "dir") {
        return newPath;
      } else {
        console.log("Invalid input: no such directory");
        return null;
      }
    } else {
      console.log("Invalid input: Set right path");
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default validateDir;
