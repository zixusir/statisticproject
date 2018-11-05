let state = {
  currentFile: '',
  netFile: '',
  newNet: true,
  netData: ['test']
}

let setNetFile = function (newFile) {
  state.netFile = newFile
  state.newNet = false
}

let setCurrentFile = function (file) {
  state.currentFile = file
}
export default {
  state,
  setNetFile,
  setCurrentFile
}
