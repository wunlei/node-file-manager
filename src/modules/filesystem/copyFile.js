import { validateFile } from "../utils/validatePath.js";
import { createReadStream, createWriteStream } from "fs";
import { finished } from "stream/promises";
import { ErrorMsg } from "../../constants.js";
import getParsedPath from "../utils/getParsedPath.js";
import { handleError } from "../utils/handleErrors.js";

async function copyFile(currDir, source, copyPath) {
  try {
    const sourceFile = await validateFile(currDir, source);

    if (!sourceFile) {
      handleError(ErrorMsg.FILE_NOT_EXIST);
      return null;
    }

    let destFile = await validateFile(currDir, copyPath);

    if (destFile) {
      handleError(ErrorMsg.FILE_ALREADY_EXIST);
      return null;
    }

    if (destFile === sourceFile) {
      handleError(ErrorMsg.FILE_ALREADY_EXIST);
      return null;
    }

    destFile = getParsedPath(currDir, copyPath);

    const readStream = createReadStream(sourceFile);
    const writeStream = createWriteStream(destFile);
    readStream.pipe(writeStream).on("error", (error) => {
      console.error(error.message);
    });

    await finished(writeStream);
    return sourceFile;
  } catch (error) {
    handleError(ErrorMsg.OPERATION_FAIL);
    console.error(error.message);
    return null;
  }
}

export default copyFile;
