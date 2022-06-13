import { validateFile } from "../utils/validatePath.js";
import path from "path";
import zlib from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { finished } from "stream/promises";
import { handleError } from "../utils/handleErrors.js";
import { ErrorMsg } from "../../constants.js";
import getParsedPath from "../utils/getParsedPath.js";

async function decompressBr(currDir, source, dest) {
  try {
    const sourceFile = await validateFile(currDir, source);

    if (!sourceFile) {
      handleError(ErrorMsg.FILE_NOT_EXIST);
      return null;
    }

    const sourceData = path.parse(sourceFile);

    let ext = "";

    if (sourceData.ext === ".br") {
      ext = path.parse(sourceFile.slice(0, -3)).ext;
    }
    const destWithExt = dest + ext;
    let destFile = await validateFile(currDir, destWithExt);

    if (destFile) {
      handleError(ErrorMsg.FILE_ALREADY_EXIST);
      return null;
    }

    if (destFile === sourceFile) {
      handleError(ErrorMsg.FILE_ALREADY_EXIST);
      return null;
    }
    destFile = getParsedPath(currDir, destWithExt);

    const readStream = createReadStream(sourceFile);
    const writeStream = createWriteStream(destFile);
    const decompressStream = zlib.createBrotliDecompress();

    readStream
      .pipe(decompressStream)
      .pipe(writeStream)
      .on("error", (err) => {
        console.error(err);
      });

    await finished(writeStream);
  } catch (error) {
    handleError(ErrorMsg.OPERATION_FAIL);
    console.error(error.message);
    return null;
  }
}

export default decompressBr;
