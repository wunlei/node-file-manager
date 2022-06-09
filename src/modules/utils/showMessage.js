function showGoodbyeMsg(name) {
  const goodbyeMsg = `Thank you for using File Manager, ${name}!\n`;
  console.log("\n", "\x1b[1m", goodbyeMsg, "\x1b[0m");
}

function showCurrPath(path) {
  console.log(`\nYou are currently in ${path}`);
}

function showGreeting(name) {
  const greetingMsg = `Welcome to the File Manager, ${name}!\n`;
  console.log("\x1b[1m", greetingMsg, "\x1b[0m");
}

export { showGoodbyeMsg, showCurrPath, showGreeting };
