'use strict'

import { app, BrowserWindow, ipcMain, dialog, shell, Menu } from 'electron'
import DataBase from '../database/index'
import Server from '../server/index'
import XLSX from 'xlsx'
import OS from 'os'
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
/**
 * 配合homepage的主进程
 */
ipc.on('homepage-findsta', e => {
  DataBase.findSta().then(
    content => {
      if (content.length && content.length > 0) {
        let staNames = []
        content.forEach((each) => {
          staNames.push(each.name)
        })
        // console.log(staNames)
        e.sender.send('homepage-getsta', staNames)
      }
    }
  )
})
ipc.on('homepage-delete', (event, file) => {
  console.log(`main process get delete order now database will delete ${file}`)
  DataBase.deleteSta(file).then((resolveArg) => {
    if (resolveArg.length && resolveArg.length > 0) {
      let staNames = []
      resolveArg.forEach(each => {
        staNames.push(each.name)
      })
      event.sender.send('homepage-deleteback', staNames)
    }
  })
})

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
ipc.on('editpage-findsta', (e, arg1) => {
  console.log(`editpage main process get${arg1}`)
  // 从数据库提取sta数据
  DataBase.findStaByName(arg1).then(
    (content) => {
      console.log(`the value get from database is ${content}`)
      e.sender.send('editpage-getsta', content)
    }
  )
})
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
ipc.on('editpage-newdatabase', (e, arg, staContent) => {
  DataBase.init(arg)
  DataBase.addSta(arg, staContent).then(
    () => {
      e.sender.send('editpage-newdbback', 1)
    },
    () => {
      e.sender.send('editpage-newdbback', 0)
    })
})
ipc.on('editpage-updatedatabase', (e, arg, staContent) => {
  DataBase.updateSta(arg, staContent).then((resolveMsg) => {
    e.sender.send('editpage-updateback', resolveMsg)
  })
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

ipc.on('fillpage-insertdata', (e, arg1, arg2, arg3) => {
  console.log(arg1)
  console.log(arg2)
  console.log(arg3)
  let data = {
    submitKey: arg2,
    content: arg3
  }
  DataBase.insert(arg1, data).then(resolveMsg => {
    console.log('main progress read back state:')
    console.log(resolveMsg)
    e.sender.send('fillpage-insertback', resolveMsg)
  })
})

/**
 * 配合sheetpage的主进程
 */
ipc.on('sheetpage-readitems', (e, datafile) => {
  DataBase.findCollection(datafile).then(resolveMsg => {
    e.sender.send('sheetpage-getitems', resolveMsg)
  })
})
ipc.on('sheetpage-findcontentbyname', (e, datafile) => {
  DataBase.findCollection(datafile).then(resolveMsg => {
    e.sender.send('sheetpage-getcontentbyname', resolveMsg)
  })
})
ipc.on('sheetpage-outputdialog', (e, data, name) => {
  let appPath = app.getAppPath()
  fileDialog.showOpenDialog({
    title: '选择文件保存位置',
    properties: ['openDirectory'],
    defaultPath: appPath,
    buttonLabel: '选择'
  }, (filepath) => {
    xlsxWrite(filepath, data, name)
    e.sender.send('sheetpage-outputback', filepath)
  })
})
function xlsxWrite (path, data, name) {
  console.log(`file write into ${path}`)
  let header
  let content
  if (data instanceof Array && data[0].content instanceof Array) {
    let temp = []
    data[0].content.forEach(each => {
      temp.push(each.itemName)
    })
    header = temp.map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65 + i) + 1}))
      .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {})

    let temp3 = []
    let temp1 = []
    data.map((v, j) => {
      v.content.forEach(each => {
        temp1.push(each.value)
      })
      console.log(temp1)
      let temp2
      temp2 = temp1.map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65 + i) + (j + 2)}))
        .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {})
      temp3.push(temp2)
      temp1 = []
    })
    content = temp3.reduce((prev, next) => Object.assign({}, prev, next), {})
  }

  // 合并 header 和 content
  let output = Object.assign({}, header, content)
  // 获取所有单元格的位置
  let outputPos = Object.keys(output)
  // 计算出范围
  let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]
  // 构建 workbook 对象
  let wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      'mySheet': Object.assign({}, output, { '!ref': ref })
    }
  }
  // 导出 Excel
  XLSX.writeFile(wb, name + '.xlsx')
}

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
ipc.on('netpage-startserver', (e, arg1) => {
  Server.startServer(arg1)
  let localhost = ''
  try {
    var network = OS.networkInterfaces()
    localhost = network[Object.keys(network)[0]][1].address
  } catch (e) {
    localhost = 'localhost'
  }
  e.sender.send('netpage-startback', localhost)
  // console.log(localhost)
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
