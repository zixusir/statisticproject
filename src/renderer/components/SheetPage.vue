<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">当前</el-col>
        <el-col :span="18">
          <p style="font-size: 20px; padding: 0 20px;">制表导出</p>
        </el-col>
        <el-col :span="2">
          <i class="el-icon-check" v-on:click="formSubmit()"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <!-- sheet -->
      <table style="width:100%" border="0" cellspacing="1" cellpadding="4" bgcolor="#cccccc">
        <tr>
          <th v-for="item in tableHead" :key="item.id" bgcolor="#e9faff">{{item}}</th>
        </tr>
        <tr v-for="item in allItems" :key="item.id">
          <td v-for="each in item.content" :key="each.id" bgcolor="#E9EEF3">
            {{each.value}}
          </td>
        </tr>
      </table>

      <!-- dialog -->
      <el-dialog
        title="选择文件"
        :visible.sync="fileChooseDialog"
        :show-close=false
        :close-on-press-escape=false
        width="50%">
        <span>选择你的数据库</span>
        <el-button type="primary" v-on:click="chooseSheetFile()">选择</el-button>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import Electron from 'electron'
import GlobalData from '@/components/GlobalData'
// import Vue from 'vue'
// import Path from 'path'
// import Fs from 'fs'
export default {
  data () {
    return {
      filename: '',
      allItems: [],
      tableHead: [],
      fileChooseDialog: false
    }
  },
  created: function () {
    if (GlobalData.state.newSheet && GlobalData.state.sheetFile === '') {
      this.fileChooseDialog = true
    }
  },
  methods: {
    chooseSheetFile () {
      let ipc = Electron.ipcRenderer
      ipc.send('sheetpage-readitems')
      ipc.on('sheetpage-getitems', (event, data) => {
        // console.log(data)
        this.fileChooseDialog = false
        this.allItems = data
        // 更新表头
        let length = this.allItems[0].content.length
        for (let i = 0; i < length; i++) {
          this.tableHead.push(this.allItems[0].content[i].itemName)
        }
      })
    }
  }
}
</script>

<style>

</style>
