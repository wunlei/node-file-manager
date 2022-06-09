import { validateDir } from "../utils/validatePath.js";

async function getDir(startDir, currDir, pathToDir) {
  const newPath = await validateDir(currDir, pathToDir);
  if (newPath) {
    if (newPath.startsWith(startDir)) {
      return newPath;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export default getDir;
