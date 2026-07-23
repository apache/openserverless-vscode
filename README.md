# VS Code Extension: Auto-execute OpenServerless (OPS) CLI

This README describes a simple VS Code extension that automatically installs and executes the OpenServerless (OPS) CLI tool when triggered. This extension is designed to simplify the process of setting up and managing an OpenServerless cluster directly within the VS Code environment.

## Features

- Automatically install and configure the OPS CLI tool.
- Execute OPS tasks and commands directly from VS Code.

## Installation

### Prerequisites

Before using this extension, ensure you have one of the following environments:

- **Linux**: Bash shell (pre-installed on most distributions).
- **macOS**: Terminal (pre-installed).
- **Windows**: WSL or GitBash (required for running bash scripts).


#### How It Works
- **Automatic Installation**: When the extension is first activated, it will check if the OPS CLI is installed. If not, it will execute the quick install script based on os env.
- **Task Execution**: You can trigger OPS tasks directly from the VS Code command palette or through pre-configured task runners.
