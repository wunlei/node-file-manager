import path from "path";

function getParsedPath(source, destination) {
  const parsedPath = destination.replaceAll("\\\\ ", " ");
  const newPath = path.resolve(source, parsedPath);
  return newPath;
}

export default getParsedPath;
