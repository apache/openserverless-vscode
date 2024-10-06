npm install -g @vscode/vsce
npm install
npm run package
vsce package
vsce publish

VER="$(jq -r .version package.json)"
cp ops-vscode-extension-$VER.vsix ops-vscode-extension.vsix
gh release create v$VER -t v$VER ops-vscode-extension.vsix
