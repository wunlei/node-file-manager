import fs from "fs/promises";

const checkIsFileExist = async (filePath) => {
  try {
    await fs.readFile(filePath);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.log(err);
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
      console.log(err);
    }
    return false;
  }
};

export { checkIsDirExist, checkIsFileExist };
