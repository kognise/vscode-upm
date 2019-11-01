const vscode = require('vscode')
const execa = require('execa')

module.exports = (context) => {
  context.subscriptions.push(vscode.commands.registerCommand('extension.remove', () => {
    vscode.window.showInputBox({
      placeHolder: 'Space separated list of packages',
      validateInput: (text) => {
        if (/["'`]/.test(text)) {
          return 'Please don\'t use quotation marks'
        } else {
          return null
        }
      }
    }).then((packages) => {
      if (!packages.trim()) return

      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Removing packages...',
        cancellable: true
      }, (_, token) => {
        const channel = vscode.window.createOutputChannel('UPM')
        channel.show()

        const spawned = execa('upm', ['remove', ...packages.trim().split(' ')])

        token.onCancellationRequested(() => spawned.kill())

        spawned.stdout.on('data', (data) => channel.append(data.toString()))
        spawned.stderr.on('data', (data) => channel.append(data.toString()))

        return spawned
      })
    })
  }))
}