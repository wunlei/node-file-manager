import { ErrorMsg } from "../../constants.js";
import { handleError } from "./handleErrors.js";

function validateArguments(input, maxArgsCount, command) {
  if (input.length < maxArgsCount) {
    switch (command) {
      case "cd":
      case "hash":
      case "cat":
      case "add":
      case "rm":
        handleError(ErrorMsg.NO_PATH);
        break;
      case "rn":
      case "cp":
      case "mv":
      case "compress":
      case "decompress":
        handleError(ErrorMsg.INVALID_ARGUMENTS);
        break;
      case "os":
        handleError(ErrorMsg.ARGUMENTS_OS);
        break;

      default:
        handleError(ErrorMsg.OPERATION_FAIL);
        break;
    }
    return false;
  } else if (input.length > maxArgsCount) {
    handleError(ErrorMsg.ARGUMENTS_LIMIT);
    return false;
  }
  return true;
}

export default validateArguments;
