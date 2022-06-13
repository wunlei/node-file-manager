import path from "path";
import fs from "fs/promises";
import { validateFile } from "../utils/validatePath.js";
import { checkIsFileExist } from "../utils/checkIsPathExist.js";
import { handleError } from "../utils/handleErrors.js";
import { ErrorMsg } from "../../constants.js";

async function renameFile(currDir, source, fileName) {
  try {
    if (currDir && source && fileName) {
      const parsedSourcePath = await validateFile(currDir, source);

      const parsedFileName = fileName.replaceAll("\\\\ ", " ");

      if (parsedSourcePath) {
        const sourceDir = path.parse(parsedSourcePath).dir;

        const newFilePath = path.resolve(sourceDir, parsedFileName);

        const isNewFileNameExist = await checkIsFileExist(newFilePath);

        if (isNewFileNameExist) {
          handleError(ErrorMsg.FILE_ALREADY_EXIST);
          return false;
        }

        try {
          await fs.rename(parsedSourcePath, newFilePath);
        } catch (err) {
          handleError(ErrorMsg.OPERATION_FAIL);
          console.error(err.message);
        }
      } else {
        handleError(ErrorMsg.FILE_NOT_EXIST);
      }
    } else {
      return null;
    }
  } catch (error) {
    handleError(ErrorMsg.OPERATION_FAIL);
    console.error(error.message);
  }
}
export default renameFile;
