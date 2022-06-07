import fs from "fs/promises";

const checkIsFileExist = async (filePath) => {
  try {
    await fs.readFile(filePath);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(err);
    }
    return false;
  }
};

const checkIsDirExist = async (folderPath) => {
  try {
    await fs.opendir(folderPath);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(err);
    }
    return false;
  }
};

const checkPathType = async (path) => {
  try {
    const pathStat = await fs.stat(path);
    if (pathStat.isDirectory()) {
      return "dir";
    } else {
      return "file";
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(err);
    }
    return null;
  }
};

export { checkIsDirExist, checkIsFileExist, checkPathType };
