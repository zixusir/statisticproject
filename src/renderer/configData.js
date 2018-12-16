let state = {
  currentFile: '*',
  netFile: '',
  netState: false,
  netData: []
}

let setNetFile = function (newFile) {
  state.netFile = newFile
  state.newNet = false
}

let setCurrentFile = function (file) {
  state.currentFile = file
  console.log(`current state:`)
  console.log(state)
}
let setNetData = function (datafile) {
  state.netData = []
  state.netData[0] = datafile
}
let addNetData = function (datafile) {
  state.netData.push(datafile)
}
let clearNetData = function () {
  state.netData = []
}
export default {
  state,
  setNetFile,
  setCurrentFile,
  setNetData,
  addNetData,
  clearNetData
}
