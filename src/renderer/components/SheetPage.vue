<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4" class="align-center">当前</el-col>
        <el-col :span="16">
          <p style="font-size: 20px; padding: 0 20px;" class="align-center">制表导出</p>
        </el-col>
        <el-col :span="4">
          <i class="el-icon-check" style="float: right; padding: 20px;" v-on:click="formSubmit()"></i>
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
        <span>选择你的数据文件</span>
        <el-button type="primary" v-on:click="chooseSheetFile()">选择</el-button>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import Electron from 'electron'
import GlobalData from '@/configData'
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
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    float: left;
    height: auto;
    /* line-height: 60px; */
  }
  .header i {
    padding: 20px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /* line-height: 160px; */
  }

 .mainContent {
    /* margin: auto; */
    text-align: center;
    background-color: #99CCFF;
    padding: 0;
    display: block;
 }
 .el-icon-circle-plus-outline{
   text-align: center;
   margin: 12px;
 }
 .newitem{
   background-color: #B3C0D1;
   padding: 10px 0;
 }
 .mainContainer {
   max-height: 100vh;
 }
 .item{
   margin-bottom: 7px;
 }
 .itemName{
   width: 150px;
 }
 .item p{
   width: 150px;
   margin: 0;
   padding: 10px 5px 10px 5px;
 }
 .item i{
  /* margin: 10px; */
 }
  body{
    margin: 0;
    background-color: beige;
  }
  .align-center {
    -webkit-margin-before: 0 !important;
    -webkit-margin-after: 0 !important;
    line-height: 60px;
  }
</style>
