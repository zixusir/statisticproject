'use strict'

import { app, BrowserWindow, ipcMain, dialog, shell, Menu } from 'electron'
import DataBase from '../database/index'
import Server from '../server/index'
// import Path from 'path'
// import Path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

let template = [{
  label: '编辑',
  submenu: [{
    label: '撤销',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: '重做',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: '剪切',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: '复制',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: '粘贴',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: '全选',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  }]
}, {
  label: '查看',
  submenu: [{
    label: '重载',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        // 重载之后, 刷新并关闭所有之前打开的次要窗体
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(win => {
            if (win.id > 1) win.close()
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: '切换全屏',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    label: '切换开发者工具',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }, {
    type: 'separator'
  }, {
    label: '应用程序菜单演示',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        const options = {
          type: 'info',
          title: '应用程序菜单演示',
          buttons: ['好的'],
          message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
        }
        dialog.showMessageBox(focusedWindow, options, function () {})
      }
    }
  }]
}, {
  label: '窗口',
  role: 'window',
  submenu: [{
    label: '最小化',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: '关闭',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, {
    type: 'separator'
  }, {
    label: '重新打开窗口',
    accelerator: 'CmdOrCtrl+Shift+T',
    enabled: false,
    key: 'reopenMenuItem',
    click: () => {
      app.emit('activate')
    }
  }]
}, {
  label: '帮助',
  role: 'help',
  submenu: [{
    label: '学习更多',
    click: () => {
      shell.openExternal('http://electron.atom.io')
    }
  }]
}]

function createWindow () {
  // 设定菜单
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  /**
   * 扫描数据库文件
   */
  DataBase.skanDatabase()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/*
* ipcMain 主进程操作
*/
const fileDialog = dialog
const ipc = ipcMain

ipc.on('open-file-dialog', (e) => {
  console.log('start choose')
  let startPath = ''
  fileDialog.showOpenDialog({
    title: '选择文件',
    properties: ['openFile'],
    defaultPath: startPath,
    buttonLabel: 'select...'
  }, (files) => {
    if (files) {
      e.sender.send('selectedItems', files)
    }
  })
  console.log(e)
})

/*
* 配合editpage的主进程
*/
ipc.on('editpage-chooseformat', (e) => {
  let appPath = app.getAppPath()
  fileDialog.showOpenDialog({
    title: '选择文件',
    properties: ['openFile'],
    defaultPath: appPath,
    buttonLabel: '选择',
    filters: [
      {name: 'sta格式文件', extensions: ['sta']}
    ]
  }, (files) => {
    if (files) {
      e.sender.send('editpage-getformat', files)
    }
  })
  console.log(e)
})
ipc.on('editpage-newdatabase', (e, arg) => {
  DataBase.init(arg)
})

/**
 * 配合fillpage的主进程
 */
ipc.on('fillpage-choosefillfile', (e) => {
  let appPath = app.getAppPath()
  fileDialog.showOpenDialog({
    title: '选择文件',
    properties: ['openFile'],
    defaultPath: appPath,
    buttonLabel: '选择',
    filters: [
      {name: 'sta格式文件', extensions: ['sta']}
    ]
  }, (files) => {
    if (files) {
      e.sender.send('fillpage-getfillfile', files)
    }
  })
})

ipc.on('fillpage-insertdata', (e, arg1, arg2) => {
  console.log(arg1)
  console.log(arg2)
  let data = {
    content: arg2
  }
  DataBase.insert(arg1, data)
})

/**
 * 配合sheetpage的 主进程
 */
ipc.on('sheetpage-readitems', (e) => {
  let appPath = app.getAppPath()
  fileDialog.showOpenDialog({
    title: '选择文件',
    properties: ['openFile'],
    defaultPath: appPath,
    buttonLabel: '选择',
    filters: [
      {name: 'sta文件', extensions: ['sta']}
    ]
  }, (file) => {
    if (file) {
      let fileArr = file[0].split('\\')
      let filename = fileArr[fileArr.length - 1].split('.')[0]
      DataBase.findCollection(filename).then(
        ret => e.sender.send('sheetpage-getitems', ret)
      )
      console.log('find data')
    }
  })
})

/**
 * 配合netpage的主进程
 */
ipc.on('netpage-choosenetfile', (e) => {
  let appPath = app.getAppPath()
  fileDialog.showOpenDialog({
    title: '选择文件',
    properties: ['openFile'],
    defaultPath: appPath,
    buttonLabel: '选择',
    filters: [
      {name: 'sta文件', extensions: ['sta']}
    ]
  }, (file) => {
    e.sender.send('netpage-getnetfile', file)
  })
})
ipc.on('netpage-startserver', (e, arg1, arg2) => {
  Server.startServer(arg1, arg2)
})
ipc.on('netpage-stopserver', (e) => {
  Server.stopServer()
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
