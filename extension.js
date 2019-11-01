const vscode = require('vscode')

const activate = (context) => {
	console.log('Congratulations, your extension "vscode-upm" is now active!')
	process.chdir(vscode.workspace.rootPath) // Ik it's deprecated, temporary solution
	require('./include/install')(context)
	require('./include/add')(context)
	require('./include/remove')(context)
	require('./include/packages')(context)
}

const deactivate = () => { /* No-op */ }

module.exports = {
	activate,
	deactivate
}