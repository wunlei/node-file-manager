import path from "path";
import fs from "fs/promises";
import { checkIsFileExist } from "./checkIsPathExist.js";
import { validateFile } from "./validatePath.js";

async function renameFile(currDir, source, fileName) {
  try {
    if (source && fileName) {
      const parsedSourcePath = await validateFile(source, currDir);
      const parsedFileName = fileName.replaceAll("\\\\ ", " ");

      if (parsedSourcePath) {
        const sourceDir = path.parse(parsedSourcePath).dir;
        const newFilePath = path.resolve(sourceDir, parsedFileName);

        const isNewFileNameExist = await checkIsFileExist(newFilePath);
        if (isNewFileNameExist) {
          throw new Error("Operation error: file already exist");
        }

        try {
          await fs.rename(parsedSourcePath, newFilePath);
        } catch (err) {
          console.error(err.message);
        }
      }
    } else {
      console.log("Invalid input: Set right path & file name");
    }
  } catch (error) {
    console.error(error.message);
  }
}
export default renameFile;
