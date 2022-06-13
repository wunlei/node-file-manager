import { createReadStream } from "fs";
import stream from "stream/promises";

async function readFile(inputPath) {
  console.log("-- Start of File --");
  const readStream = createReadStream(inputPath, { encoding: "utf-8" });
  readStream.on("data", (chunk) => console.log(chunk));
  readStream.on("error", (error) => {
    console.error(error.message);
  });
  await stream.finished(readStream);
  console.log("-- End of File --");
}

export { readFile };
