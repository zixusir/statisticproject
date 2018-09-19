let state = {
  editFile: '',
  newEdit: true,
  fillFile: '',
  newFill: true,
  sheetFile: '',
  newSheet: true,
  netFile: '',
  newNet: true,
  netData: ['test']
}

let setEditFile = function (newFile) {
  state.editFile = newFile
  state.newEdit = false
}

let setFillFile = function (newFile) {
  state.fillFile = newFile
  state.newFill = false
}

let setSheetFile = function (newFile) {
  state.sheetFile = newFile
  state.newSheet = false
}

let setNetFile = function (newFile) {
  state.netFile = newFile
  state.newNet = false
}
export default {
  state,
  setEditFile,
  setFillFile,
  setSheetFile,
  setNetFile
}
