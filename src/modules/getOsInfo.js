import os from "os";

function getOsInfo(arg) {
  if (arg === "--cpus") {
    const cpusData = os.cpus();
    const cpuList = cpusData.map((data) => {
      const speed = (
        data.speed > 1000 ? data.speed / 1000 : data.speed / 10
      ).toFixed(2);
      return [data.model, speed + "GHz"];
    });

    console.log("CPUS amount: ", cpusData.length);
    console.table(cpuList);
  } else if (arg === "--EOL") {
    const eol = `System End-Of-Line: ${JSON.stringify(os.EOL)}`;
    console.log(eol);
  } else if (arg === "--homedir") {
    const homedir = `Home directory: ${os.homedir()}`;
    console.log(homedir);
  } else if (arg === "--username") {
    const username = `System user name: ${os.userInfo().username}`;
    console.log(username);
  } else if (arg === "--architecture") {
    const arch = `CPU architecture: ${os.arch()}`;
    console.log(arch);
  }
}

export default getOsInfo;
