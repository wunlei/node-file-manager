import { validateFile } from "./validatePath.js";
import path from "path";
import zlib from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { finished } from "stream/promises";

async function decompressBr(currDir, source, dest) {
  const sourceFile = await validateFile(source, currDir);
  const sourceData = path.parse(sourceFile);
  let ext = "";
  if (sourceData.ext === ".br") {
    ext = path.parse(sourceFile.slice(0, -3)).ext;
  }
  console.log(ext);

  const parsedPath = dest.replaceAll("\\\\ ", " ") + ext;

  const destFile = path.resolve(currDir, parsedPath);
  console.log(destFile);
  const readable = createReadStream(sourceFile);
  const writable = createWriteStream(destFile);
  const gZip = zlib.createBrotliDecompress();
  readable
    .pipe(gZip)
    .pipe(writable)
    .on("error", (err) => {
      console.error(err);
    });
  await finished(writable);
}

export default decompressBr;
