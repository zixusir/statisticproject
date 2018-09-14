'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
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

function createWindow () {
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
      let database = DataBase.findCollection(filename)
      console.log('find data')
      database.then(ret => e.sender.send('sheetpage-getitems', ret))
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
ipc.on('netpage-startserver', (e) => {
  Server.startServer()
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
