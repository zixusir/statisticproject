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
export default {
  state,
  setNetFile
}
