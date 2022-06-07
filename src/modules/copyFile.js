import { validateFile } from "./validatePath.js";
import { createReadStream, createWriteStream } from "fs";
import { finished } from "stream/promises";
import path from "path";

async function copyFile(currDir, source, copyPath) {
  const sourceFile = await validateFile(source, currDir);

  let destFile = await validateFile(copyPath, currDir);

  try {
    if (destFile) {
      throw new Error("File already exist");
    } else {
      const parsedPath = copyPath.replaceAll("\\\\ ", " ");
      destFile = path.resolve(currDir, parsedPath);
    }
    if (!sourceFile) {
      throw new Error("File doesn't exist");
    } else if (destFile === sourceFile) {
      throw new Error("wrong name");
    }
  } catch (error) {
    console.error(error.message);
    return;
  }

  try {
    const readStream = createReadStream(sourceFile);
    const writeStream = createWriteStream(destFile);
    readStream.pipe(writeStream);
    await finished(writeStream);
    console.log("copied!");
    return sourceFile;
  } catch (error) {
    console.error(error.message);
  }
}

export default copyFile;
