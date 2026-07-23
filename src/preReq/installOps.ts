import * as vscode from "vscode";
import { exec } from "child_process";
import { platform } from "os";
import path = require("path");
import * as fs from "fs";
import * as os from "os";

const outputChannel = vscode.window.createOutputChannel("Ops Installer");

const runCommand = (command: string, firstCommand?: boolean): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (firstCommand) {
          outputChannel.appendLine(`Oooops! Ops is not installed :)`);
        } else {
          outputChannel.appendLine(`Error executing command: ${stderr}`);
        }
        reject(stderr);
        return;
      }
      outputChannel.appendLine(stdout);
      resolve();
    });
  });
};

export const installOpsFlow = async () => {
  outputChannel.show();
  outputChannel.appendLine(`Going to install ops!`);
  const osType = platform();
  const isOpsInstalled = await checkIfOpsIsAlreadyInstalled(osType);

  if (!isOpsInstalled) {
    try {
      await installOps(osType);
      await configureOpsBranch();
    } catch (error) {
      outputChannel.appendLine(`An error occurred: ${error}`);
    }
    vscode.window.showInformationMessage(
      "Installation complete. Please restart your terminal."
    );
  } else {
    outputChannel.appendLine("Ops has already been installed!");
    await configureOpsBranch();
  }
};

const checkIfOpsIsAlreadyInstalled = async (
  osType: string
): Promise<boolean> => {
  try {
    let command: string;
    if (osType === "linux" || osType === "darwin") {
      command = "which ops";
    } else if (osType === "win32") {
      command = "where ops";
    } else {
      return false;
    }

    await runCommand(command, true);
    return true;
  } catch (error) {
    return false;
  }
};

const configureOpsBranch = async () => {
  try {
    const osType = platform();
    let setBranchCommand = "";

    if (osType === "linux" || osType === "darwin") {
      const homeDir = os.homedir();
      const bashrcPath = path.join(homeDir, ".bashrc");
      const zshrcPath = path.join(homeDir, ".zshrc");

      if (fs.existsSync(bashrcPath)) {
        await runCommand(`echo 'export OPS_BRANCH=main' >> ${bashrcPath}`);
      } else if (fs.existsSync(zshrcPath)) {
        await runCommand(`echo 'export OPS_BRANCH=main' >> ${zshrcPath}`);
      } else {
        outputChannel.appendLine("No .bashrc or .zshrc found.");
      }

      setBranchCommand = "export OPS_BRANCH=main && ops -update";
    } else if (osType === "win32") {
      setBranchCommand =
        '[System.Environment]::SetEnvironmentVariable("OPS_BRANCH", "main", "User"); ops -update';
    }

    await runCommand(setBranchCommand);
    outputChannel.appendLine("Ops branch set to main and ops updated!");
  } catch (error) {
    outputChannel.appendLine(`Failed to set OPS_BRANCH: ${error}`);
  }
};

async function installOpsOnMac() {
  try {
    await runCommand("curl -sL bit.ly/get-ops -o ~/get-ops.sh");
    await runCommand("chmod +x ~/get-ops.sh");
    await runCommand("sh ~/get-ops.sh");

    const opsPath = path.join(os.homedir(), ".local/bin/ops");
    if (fs.existsSync(opsPath)) {
      outputChannel.appendLine("Ops installed successfully on MAC OS.");
    } else {
      throw new Error("Ops not present on .local/bin path");
    }
  } catch (error) {
    outputChannel.appendLine(`Installation failed on MAC OS: ${error}`);
  }
}

async function installOpsOnWindows() {
  try {
    await runCommand('powershell.exe -Command "irm bit.ly/get-ops-exe | iex"');
    const opsPath = path.join(os.homedir(), ".local/bin/ops.exe");
    if (fs.existsSync(opsPath)) {
      outputChannel.appendLine("Ops installed successfully on Windows.");
    } else {
      throw new Error("Ops not present on .local/bin path");
    }
  } catch (error) {
    outputChannel.appendLine(`Installation failed on Windows: ${error}`);
  }
}

async function installOpsOnLinux() {
  try {
    await runCommand("curl -sL bit.ly/get-ops -o ~/get-ops.sh");
    await runCommand("chmod +x ~/get-ops.sh");
    await runCommand("sh ~/get-ops.sh");

    const opsPath = path.join(os.homedir(), ".local/bin/ops");
    if (fs.existsSync(opsPath)) {
      outputChannel.appendLine("Ops installed successfully on Linux.");
    } else {
      throw new Error("Ops not present on .local/bin path");
    }
  } catch (error) {
    outputChannel.appendLine(`Installation failed on Linux: ${error}`);
  }
}

async function installOps(osType: NodeJS.Platform) {
  if (osType === "darwin") {
    outputChannel.appendLine("Installing ops on MAC OS...");
    await installOpsOnMac();
  } else if (osType === "linux") {
    const version = fs.readFileSync("/proc/version", "utf8");
    if (version.includes("Microsoft")) {
      outputChannel.appendLine("Installing ops on WSL...");
      await installOpsOnWindows();
    } else {
      outputChannel.appendLine("Installing ops on Linux...");
      await installOpsOnLinux();
    }
  } else if (osType === "win32") {
    outputChannel.appendLine("Installing ops on Windows...");
    await installOpsOnWindows();
  } else {
    outputChannel.appendLine("Unsupported platform.");
  }
}
