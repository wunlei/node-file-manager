import { validateFile } from "./validatePath.js";
import path from "path";
import zlib from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { finished } from "stream/promises";

async function compressBr(currDir, source, dest) {
  const sourceFile = await validateFile(source, currDir);
  const sourceData = path.parse(sourceFile);
  console.log(sourceData);
  const parsedPath = dest.replaceAll("\\\\ ", " ") + sourceData.ext + ".br";
  const destFile = path.resolve(currDir, parsedPath);

  const readable = createReadStream(sourceFile);
  const writable = createWriteStream(destFile);
  const gZip = zlib.createBrotliCompress();
  console.log("Please wait...");
  readable
    .pipe(gZip)
    .pipe(writable)
    .on("error", (err) => {
      console.error(err);
    });
  await finished(writable);
}

export default compressBr;
