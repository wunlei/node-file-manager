import { checkPathType } from "./checkIsPathExist.js";
import getParsedPath from "./getParsedPath.js";

const validateDir = async (currDir, destPath) => {
  try {
    if (destPath && currDir) {
      const dirPath = getParsedPath(currDir, destPath);
      const pathType = await checkPathType(dirPath);
      if (pathType === "dir") {
        return dirPath;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const validateFile = async (currDir, destPath) => {
  try {
    if (destPath && currDir) {
      const filePath = getParsedPath(currDir, destPath);
      const pathType = await checkPathType(filePath);
      if (pathType === "file") {
        return filePath;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export { validateDir, validateFile };
