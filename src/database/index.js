import PATH from 'path'
import DataStore from 'nedb'
let db = new DataStore({
  filename: PATH.join(__dirname, 'data.db')
})
console.log(db)
let init = function () {
  console.log('database is ready!!')
}

export {
  init
}
