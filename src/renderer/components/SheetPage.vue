<template>
  <el-container>
    <el-header class="header">
      <el-row>
        <el-col :span="2">
          <i class="el-icon-news" v-on:click="chooseSheetFile()" style="font-size: 15pt">
            <div style="font-size: 7pt;">选择</div>
          </i>
        </el-col>
        <el-col :span="4" class="align-center">当前:{{this.filename}}</el-col>
        <el-col :span="12">
          <p style="font-size: 20px; padding: 0 20px;" class="align-center">制表导出</p>
        </el-col>
        <el-col :span="6">
          <i class="icon iconfont icon-icon_baocun" v-on:click="outputFile()" style="font-size: 15pt; float: right;">
            <div style="font-size: 7pt;">导出</div>
          </i>
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
        title="选择统计项目"
        :visible.sync="fileChooseDialog"
        :show-close=false
        :close-on-press-escape=false
        width="500px">
        <span>
          <div style="display: flex; justify-content: center;">
            <table style="width: 100%; padding-left: 15px; padding-right: 15px;">
              <tr v-for="item in staItems" :key="item.id" style="width: 100%">
                <td>{{item}}</td>
                <td>
                  <div v-on:click="setSheetPageView(item)">
                    <span>选择</span>
                  </div>
                  <!-- <router-link :to="{name: 'editpage', params: {datafile: item}}">编辑</router-link> -->
                </td>
              </tr>
            </table>
          </div>
        </span>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import Electron from 'electron'
import GlobalData from '@/configData'
export default {
  data () {
    return {
      staItems: [],
      filename: '',
      allItems: [],
      tableHead: [],
      fileChooseDialog: false
    }
  },
  created: function () {
    this.ipcEvents()
    if (this.$route.params && this.$route.params.datafile && this.$route.params.datafile !== '*') {
      this.filename = this.$route.params.datafile
      GlobalData.setCurrentFile(this.filename)
      let ipc = Electron.ipcRenderer
      ipc.send('sheetpage-readitems', this.filename)
      ipc.on('sheetpage-getitems', (event, data) => {
        console.log(data)
        this.allItems = []
        this.tableHead = []
        let tableHOrigin = data[0].content
        if (tableHOrigin.length > 0) {
          tableHOrigin.forEach(each => {
            this.tableHead.push(each.itemName)
          })
        }
        this.allItems = data
      })
    } else {
      this.fileChooseDialog = true
      this.allItems = []
      let ipc = Electron.ipcRenderer
      ipc.send('homepage-findsta')
    }
  },
  methods: {
    ipcEvents () {
      let ipc = Electron.ipcRenderer
      ipc.on('homepage-getsta', (e, d) => {
        // console.log(d)
        this.staItems = d
      })
      ipc.on('sheetpage-getcontentbyname', (event, data) => {
        this.allItems = []
        this.tableHead = []
        let tableHOrigin = data[0].content
        if (tableHOrigin.length > 0) {
          tableHOrigin.forEach(each => {
            this.tableHead.push(each.itemName)
          })
        }
        this.allItems = data
      })
      ipc.on('sheetpage-outputback', (e, data) => {
        this.$message(`导出完成，excel文件位置：${data}`)
      })
    },
    chooseSheetFile () {
      this.fileChooseDialog = true
      let ipc = Electron.ipcRenderer
      // 借用homepage的api
      ipc.send('homepage-findsta')
      // ipc.on('homepage-getsta', (e, d) => {
      //   // console.log(d)
      //   this.staItems = d
      // })
    },
    setSheetPageView (item) {
      this.filename = item
      GlobalData.setCurrentFile(item)
      let ipc = Electron.ipcRenderer
      ipc.send('sheetpage-findcontentbyname', item)
      // ipc.on('sheetpage-getcontentbyname', (event, data) => {
      //   this.allItems = []
      //   this.tableHead = []
      //   let tableHOrigin = data[0].content
      //   if (tableHOrigin.length > 0) {
      //     tableHOrigin.forEach(each => {
      //       this.tableHead.push(each.itemName)
      //     })
      //   }
      //   this.allItems = data
      // })
      this.fileChooseDialog = false
    },
    outputFile () {
      let ipc = Electron.ipcRenderer
      ipc.send('sheetpage-outputdialog', this.allItems, this.filename)
      // ipc.on('sheetpage-outputback', (e, data) => {
      //   this.$message(`导出完成，excel文件位置：${data}`)
      // })
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
