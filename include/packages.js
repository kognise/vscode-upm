const vscode = require('vscode')
const execa = require('execa')
const watch = require('node-watch').default

const linesToMap = (lines) => {
  const map = {}
  for (let line of lines) {
    const halves = line.split(/\s+/)
    map[halves[0]] = halves[1]
  }
  return map
}

class TreeDataProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter()
    this.onDidChangeTreeData = this._onDidChangeTreeData.event
  }

  refresh() {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element) {
    return element
  }

  getChildren() {
    return execa('upm', ['list']).then(({ stdout }) => {
      const dependencies = linesToMap(stdout.trim().split('\n').slice(2))
      return Object.keys(dependencies).map((key) => ({
        label: key,
        description: dependencies[key],
        contextValue: 'package'
      }))
    })
  }
}

module.exports = (context) => {
  const treeDataProvider = new TreeDataProvider()

  context.subscriptions.push(vscode.commands.registerCommand('packages.remove', (item) => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Removing ${item.label}...`,
      cancellable: true
    }, (_, token) => {
      const channel = vscode.window.createOutputChannel('UPM')
      channel.show()

      const spawned = execa('upm', ['remove', item.label])

      token.onCancellationRequested(() => spawned.kill())

      spawned.stdout.on('data', (data) => channel.append(data.toString()))
      spawned.stderr.on('data', (data) => channel.append(data.toString()))

      return spawned.then(() => treeDataProvider.refresh())
    })
  }))

  vscode.window.registerTreeDataProvider('packages', treeDataProvider)
  vscode.commands.registerCommand('packages.refresh', () => treeDataProvider.refresh())
  watch(process.cwd(), { recursive: false }, () => treeDataProvider.refresh())
} 