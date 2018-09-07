import PATH from 'path'
import DataStore from 'nedb'
import Fs from 'fs'

let dbs = []
let dataFilePath = __dirname
/*
* skanDatabase() 程序开始后扫描数据库文件
*/
let skanDatabase = function () {
  Fs.readdir(dataFilePath, (e, f) => {
    if (e) {
      console.log('数据库扫描失败')
    } else {
      f.forEach((eachFile) => {
        let str = eachFile.split('.')
        let ext = str[str.length - 1]
        if (ext === 'db') {
          // let db = DataStore.load(PATH.join(__dirname, eachFile + '.db'))
          let db = new DataStore({
            filename: PATH.join(__dirname, eachFile),
            autoload: true
          })
          db.name = str[0]
          dbs.push(db)
        }
      })
      console.log(dbs)
    }
  })
}

/*
* init(str)初始化一个数据库,str为数据库的名字
*/
let init = function (str) {
  let db
  db = new DataStore({
    filename: PATH.join(__dirname, str + '.db'),
    autoload: true
  })
  console.log('___init Database!___')
  dbs.push(db)
}
/**
 * 向指定数据库插入一项数据
 * @param {*} databaseName 数据库名称
 * @param {*} data 要插入的数据
 */
let insert = function (databaseName, data) {
  console.log('insert a data')
  for (let i = 0; i < dbs.length; i++) {
    if (dbs[i].name === databaseName) {
      dbs[i].insert(data)
    }
  }
}

export {
  init,
  insert,
  skanDatabase
}
