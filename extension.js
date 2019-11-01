const activate = (context) => {
	console.log('Congratulations, your extension "vscode-upm" is now active!')
	process.chdir('/home/kognise/test')
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