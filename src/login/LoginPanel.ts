import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";

export class LoginPanel {
  public static currentPanel: LoginPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri
    );
    this._setWebviewMessageListener(this._panel.webview);
  }
  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;

        switch (command) {
          case "login":
            // Handle login form submission
            const { username, password, apiHost } = message;
            // Pass the login details back to the extension
            if (this._onLoginCallback && username && password && apiHost) {
              this._onLoginCallback(username, password, apiHost);
            }
            break;
        }
      },
      undefined,
      this._disposables
    );
  }
  private _getWebviewContent(
    webview: vscode.Webview,
    extensionUri: vscode.Uri
  ) {
    const webviewUri = getUri(webview, extensionUri, ["out", "login.js"]);
    // const logoUri =
    //   "https://ops-aws-s3-bucket.s3.eu-west-1.amazonaws.com/os-logo-full-horizontal-transparent.png";
    const logoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "logoFull.png")
    );

    const nonce = getNonce();
    return /*html*/ `
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
    `;
  }

  private _onLoginCallback:
    | ((username: string, password: string, apiHost: string) => void)
    | undefined;
  public static render(
    onLogin: (username: string, password: string, apiHost: string) => void,
    extensionUri: vscode.Uri
  ) {
    if (LoginPanel.currentPanel) {
      LoginPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
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
            vscode.Uri.joinPath(extensionUri, "media"),
          ],
        }
      );
      LoginPanel.currentPanel = new LoginPanel(panel, extensionUri);
    }
    LoginPanel.currentPanel._onLoginCallback = onLogin;
  }

  public dispose() {
    LoginPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
