import crypto from "crypto";
import { createReadStream } from "fs";
import stream from "stream/promises";

const calculateHash = async (pathToFile) => {
  const hash = crypto.createHash("sha256");
  const readStream = createReadStream(pathToFile);
  readStream.on("data", (chunk) => hash.update(chunk));
  readStream.on("error", (error) => {
    console.error(error.message);
  });
  await stream.finished(readStream);
  console.log("File hash: ", hash.digest("hex"));
};

export default calculateHash;
