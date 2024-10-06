"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  EmptyTreeDataProvider: () => EmptyTreeDataProvider,
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode3 = __toESM(require("vscode"));

// src/login/LoginPanel.ts
var vscode = __toESM(require("vscode"));

// src/utilities/getUri.ts
var import_vscode = require("vscode");
function getUri(webview, extensionUri, pathList) {
  return webview.asWebviewUri(import_vscode.Uri.joinPath(extensionUri, ...pathList));
}

// src/utilities/getNonce.ts
function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// src/login/LoginPanel.ts
var LoginPanel = class _LoginPanel {
  constructor(panel, extensionUri) {
    this._disposables = [];
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri
    );
    this._setWebviewMessageListener(this._panel.webview);
  }
  _setWebviewMessageListener(webview) {
    webview.onDidReceiveMessage(
      (message) => {
        const command = message.command;
        switch (command) {
          case "login":
            const { username, password, apiHost } = message;
            if (this._onLoginCallback && username && password && apiHost) {
              this._onLoginCallback(username, password, apiHost);
            }
            break;
        }
      },
      void 0,
      this._disposables
    );
  }
  _getWebviewContent(webview, extensionUri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "login.js"]);
    const logoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "logoFull.png")
    );
    const nonce = getNonce();
    return (
      /*html*/
      `
   <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OPS - Login!</title>
    <style>
        body {
          font-family: Arial, sans-serif;
          background-color: transparent;
          padding: 20px;
          
        }
        .login-container {
            border-radius: 10px;
          max-width: 400px;
          margin: 0 auto;
          background-color: #276089;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        
        }
        .login-container h2 {
          text-align: center;
        }
        .login-form {
          display: flex;
          flex-direction: column;
        }
        .login-form input {
            border-radius: 10px;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ccc;
        }
        
        .login-form vscode-button {
            margin: 0 auto;
          width: 100px;
          border-radius: 10px;
          padding: 10px;
          background-color: #00AD83;
          text-align: center;
          color: #fff;
          border: none;
          cursor: pointer;
          font-weight: bolder;
        }
        .logo-img {
            border-radius: 10px;;
          background-color: white;
        }
        .input-error {
          border: 2px solid red !important;
        }
        .input-success {
          border: 2px solid #00AD83 !important;
        }
        .error-message {
          color: #ffa944;
          font-size: 0.8em;
          font-weight: 900;
        }
        


      </style>
  </head>
  <body> 
    <div class="login-container">
    <img src="${logoUri}" class="logo-img"></img>
    <h2>Login</h2>
    <form class="login-form" id="login-form">
      <input type="text" id="username-input" name="username" placeholder="Username" autocomplete="username">
      <input type="password" id="password-input" name="password" placeholder="Password" autocomplete="current-password">
     
        <input type="text" id="api-host-input" name="apiHost" placeholder="API Host URL" value="https://openserverless.dev">
    
      <vscode-button id="login-button" type="submit"> L O G I N </vscode-button>
    
    </form>
   
    <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
  </body>
</html>
    `
    );
  }
  static render(onLogin, extensionUri) {
    if (_LoginPanel.currentPanel) {
      _LoginPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel(
        "login-panel",
        "Login",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` and `media` directory
          localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, "out"),
            vscode.Uri.joinPath(extensionUri, "media")
          ]
        }
      );
      _LoginPanel.currentPanel = new _LoginPanel(panel, extensionUri);
    }
    _LoginPanel.currentPanel._onLoginCallback = onLogin;
  }
  dispose() {
    _LoginPanel.currentPanel = void 0;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
};

// src/enumerators.ts
var CliCommands = /* @__PURE__ */ ((CliCommands2) => {
  CliCommands2["Devel"] = "ops ide devel";
  CliCommands2["Deploy"] = "ops ide deploy";
  return CliCommands2;
})(CliCommands || {});

// src/extension.ts
var import_child_process2 = require("child_process");

// src/preReq/installOps.ts
var vscode2 = __toESM(require("vscode"));
var import_child_process = require("child_process");
var import_os = require("os");
var fs = __toESM(require("fs"));
var os = __toESM(require("os"));
var path = require("path");
var outputChannel = vscode2.window.createOutputChannel("Ops Installer");
var runCommand = (command, firstCommand) => {
  return new Promise((resolve, reject) => {
    (0, import_child_process.exec)(command, (error, stdout, stderr) => {
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
var installOpsFlow = async () => {
  outputChannel.show();
  outputChannel.appendLine(`Going to install ops!`);
  const osType = (0, import_os.platform)();
  const isOpsInstalled = await checkIfOpsIsAlreadyInstalled(osType);
  if (!isOpsInstalled) {
    try {
      await installOps(osType);
      await configureOpsBranch();
    } catch (error) {
      outputChannel.appendLine(`An error occurred: ${error}`);
    }
    vscode2.window.showInformationMessage(
      "Installation complete. Please restart your terminal."
    );
  } else {
    outputChannel.appendLine("Ops has already been installed!");
    await configureOpsBranch();
  }
};
var checkIfOpsIsAlreadyInstalled = async (osType) => {
  try {
    let command;
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
var configureOpsBranch = async () => {
  try {
    const osType = (0, import_os.platform)();
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
      setBranchCommand = '[System.Environment]::SetEnvironmentVariable("OPS_BRANCH", "main", "User"); ops -update';
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
async function installOps(osType) {
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

// src/extension.ts
var context;
async function activate(ctx) {
  try {
    vscode3.window.registerTreeDataProvider(
      "command-palette",
      new EmptyTreeDataProvider()
    );
    await installOpsFlow();
    context = ctx;
    if (!isLoggedIn()) {
      LoginPanel.render(handleLogin, context.extensionUri);
    }
    Object.entries(CliCommands).forEach(
      ([name, command]) => context.subscriptions.push(
        vscode3.commands.registerCommand(`ops.${name.toLowerCase()}`, () => {
          if (!isLoggedIn()) {
            LoginPanel.render(handleLogin, context.extensionUri);
            return;
          }
          launchTerminal(command);
        })
      )
    );
    context.subscriptions.push(
      vscode3.commands.registerCommand("ops.login", () => {
        LoginPanel.render(handleLogin, context.extensionUri);
      })
    );
  } catch (error) {
    printError(error);
    throw error;
  }
}
function isLoggedIn() {
  try {
    (0, import_child_process2.execSync)("ops -wsk namespace list");
    return true;
  } catch (error) {
    return false;
  }
}
function handleLogin(username, password, apiHost) {
  const loginOutput = vscode3.window.createOutputChannel("Ops Login");
  loginOutput.show();
  try {
    loginOutput.appendLine("Launching login script...");
    const execLogin = (0, import_child_process2.execSync)(
      `ops ide login "${username}" "${apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost}"`,
      {
        env: { ...process.env, OPS_PASSWORD: password }
      }
    );
    loginOutput.appendLine(execLogin.toString());
    printInfo(
      "You successfully logged in. You can now use the ops command palette."
    );
  } catch (error) {
    loginOutput.appendLine(error);
    printError(
      "An error occurred in the login process. Check the output window for further details."
    );
    throw error;
  }
}
function launchTerminal(command) {
  try {
    const terminal = vscode3.window.createTerminal("Ops Terminal");
    terminal.show();
    terminal.sendText(command, true);
  } catch (error) {
    printError(error);
    throw error;
  }
}
function printError(error) {
  return vscode3.window.showErrorMessage(error.toString());
}
function printInfo(info) {
  return vscode3.window.showInformationMessage(info);
}
function deactivate() {
}
var EmptyTreeDataProvider = class {
  constructor() {
  }
  getTreeItem(element) {
    return {};
  }
  getChildren(element) {
    return new Promise((resolve) => resolve([]));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmptyTreeDataProvider,
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
