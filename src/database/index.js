import PATH from 'path'
import DataStore from 'nedb'
import Fs from 'fs'

let dbs = []
let sta
let dataFilePath = PATH.join(__static, 'dbs')
/*
* skanDatabase() 程序开始后扫描数据库文件
*/
let skanDatabase = function () {
  // 装在sta数据库
  sta = new DataStore({
    filename: PATH.join(__static, 'sta.db'),
    autoload: true
  })
  console.log(sta.filename)

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
            filename: PATH.join(dataFilePath, eachFile),
            autoload: true
          })
          db.name = str[0]
          dbs.push(db)
        }
      })
      // console.log(dbs)
    }
  })
}

/*
* init(str)初始化一个数据库,str为数据库的名字
*/
let init = function (str) {
  let db
  db = new DataStore({
    filename: PATH.join(dataFilePath, str + '.db'),
    autoload: true
  })
  console.log('___init Database!___')
  db.name = str
  dbs.push(db)
}
/**
 * 向指定数据库插入一项数据
 */
let insert = function (databaseName, data) {
  console.log('insert a data')
  for (let i = 0; i < dbs.length; i++) {
    if (dbs[i].name === databaseName) {
      dbs[i].insert(data)
      break
    }
    if (i === dbs.length - 1) console.log('数据插入错误')
  }
}
/**
 * 删除数据库中的一条记录
 */
let del = function (databaseName, data) {}
/**
 * 查找你一记录
 */
let find = function (databaseName, indexStr) { }
/**
 * 更新一条记录
 */
let change = function (databaseName, oldstr, newstr) {}

/**
 * 查找一整个数据集
 */
let findCollection = async function (databaseName) {
  let ret
  ret = await findDocs(databaseName)
  // console.log(ret)
  return ret
}
let findDocs = function (databaseName) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < dbs.length; i++) {
      if (dbs[i].name === databaseName) {
        dbs[i].find({}, (err, docs) => {
          if (err) {
            reject(docs)
          } else {
            resolve(docs)
          }
        })
      }
    }
  })
}

/**
 * STA数据库相关操作
 */
let findSta = function () {
  return new Promise((resolve, reject) => {
    sta.find({}, (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

let findStaByName = function (staName) {
  return new Promise((resolve, reject) => {
    sta.find({name: staName}, (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

let addSta = function (name, staContent) {
  let insertData = {
    name: name,
    staContent: staContent
  }
  sta.insert(insertData)
}

export default {
  init,
  skanDatabase,
  insert,
  del,
  find,
  change,
  findCollection,
  findSta,
  findStaByName,
  addSta
}
