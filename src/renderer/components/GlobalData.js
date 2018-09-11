let state = {
  editFile: '',
  newEdit: true,
  fillFile: '',
  newFill: true
}

let setEditFile = function (newFile) {
  state.editFile = newFile
  state.newEdit = false
}

let setFillFile = function (newFile) {
  state.fillFile = newFile
  state.newFill = false
}

export default {
  state,
  setEditFile,
  setFillFile
}
