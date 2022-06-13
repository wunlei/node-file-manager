const osCommands = [
  "--EOL",
  "--cpus",
  "--homedir",
  "--username",
  "--architecture",
];

const fmCommands = [
  ".exit",
  "up",
  "cd",
  "ls",
  "cat",
  "add",
  "rn",
  "cp",
  "mv",
  "rm",
  "os",
  "hash",
  "compress",
  "decompress",
];

const ErrorMsg = {
  NO_USER: "Username was not given",
  INVALID_INPUT: "Invalid input",
  OPERATION_FAIL: "Operation failed",
  HOME_DIR_REACHED: "Operation failed: Can't go up from root directory",
  NO_PATH: "Invalid input: Provide valid path",
  DIR_NOT_EXIST: "Invalid input: No such directory",
  DIR_NOT_EXITS_OP: "Operation failed: No such directory",
  FILE_NOT_EXIST: "Invalid input: No such file",
  FILE_ALREADY_EXIST: "Operation failed: File already exist",
  ARGUMENTS_LIMIT:
    "Invalid input: Too many arguments. For path with spaces - escape every space with '\\\\', e.g.: cd My\\\\ folder",
  ARGUMENTS_OS: `Invalid input: provide one of the arguments: ${osCommands.join(
    ", "
  )}`,
  EMPTY_NAME: "Invalid input: Filename can't be empty",
  EMPTY_COMMAND: `Invalid input: available commands: ${fmCommands.join(", ")}`,
  INVALID_ARGUMENTS:
    "Invalid input: Provide path_to_file & path_to_new_file/new_filename",
};

const regexpSpaces = /(?<!\\) /g;

export { osCommands, ErrorMsg, regexpSpaces };
