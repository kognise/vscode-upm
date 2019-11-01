const vscode = require('vscode')
const execa = require('execa')
const fs = require('fs-extra')

module.exports = (context) => {
  context.subscriptions.push(vscode.commands.registerCommand('extension.install', () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Installing packages...',
      cancellable: true
    }, (_, token) => {
      const channel = vscode.window.createOutputChannel('UPM')
      channel.show()

      return fs.remove('.upm/').then(() => {
        const spawned = execa('upm', ['add', '--guess'])

        token.onCancellationRequested(() => spawned.kill())

        spawned.stdout.on('data', (data) => channel.append(data.toString()))
        spawned.stderr.on('data', (data) => channel.append(data.toString()))

        return spawned
      })
    })
  }))
}