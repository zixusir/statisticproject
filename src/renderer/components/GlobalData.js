let state = {
  editFile: '',
  newEdit: true,
  fillFile: '',
  newFill: true,
  sheetFile: '',
  newSheet: true
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

export default {
  state,
  setEditFile,
  setFillFile,
  setSheetFile
}
