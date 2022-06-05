import fs from "fs/promises";
import { checkIsDirExist } from "./checkIsPathExist.js";

const listFiles = async (path) => {
  const isDirExist = await checkIsDirExist(path);
  if (!isDirExist) {
    throw new Error("Operation failed");
  }
  const files = await fs.readdir(path);
  return files;
};

export default listFiles;
