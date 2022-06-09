# node-file-manager

- The program is started by `npm-script start` in following way:

```bash
npm run start -- --username=your_username
```

List of operations and their syntax:

- Navigation & working directory (nwd)
  - Go upper from current directory
  ```bash
  up
  ```
  - Go to dedicated folder from current directory (`path_to_directory` can be relative or absolute)
  ```bash
  cd path_to_directory
  ```
  - List all files and folder in current directory and print it to console
  ```bash
  ls
  ```
- Basic operations with files
  - Read file and print it's content in console:
  ```bash
  cat path_to_file
  ```
  - Create empty file in current working directory or provided directory:
  ```bash
  add new_file_name
  ```
  - Rename file:
  ```bash
  rn path_to_file new_filename
  ```
  - Copy file:
  ```bash
  cp path_to_file path_to_file_copy
  ```
  - Move file:
  ```bash
  mv path_to_file path_to_new_file
  ```
  - Delete file:
  ```bash
  rm path_to_file
  ```
- Operating system info (prints following information in console)
  - Get EOL (default system End-Of-Line)
  ```bash
  os --EOL
  ```
  - Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)
  ```bash
  os --cpus
  ```
  - Get home directory:
  ```bash
  os --homedir
  ```
  - Get current _system user name_
  ```bash
  os --username
  ```
  - Get CPU architecture for which Node.js binary has compiled
  ```bash
  os --architecture
  ```
- Hash calculation
  - Calculate hash for file and print it into console
  ```bash
  hash path_to_file
  ```
- Compress and decompress operations
  (files extensions are optional)
  - Compress _file_ (using Brotli algorithm)
  ```bash
  compress path_to_file path_to_compressed_file
  ```
  - Decompress _file_ (using Brotli algorithm)
  ```bash
  decompress path_to_compressed_file path_to_decompressed_filename
  ```
