import fs from "fs/promises";
import { checkIsDirExist } from "../utils/checkIsPathExist.js";

const listFiles = async (path) => {
  const isDirExist = await checkIsDirExist(path);
  if (!isDirExist) {
    return false;
  }
  const files = await fs.readdir(path);
  return files;
};

export default listFiles;
