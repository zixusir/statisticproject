<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4" class="align-center">当前</el-col>
        <el-col :span="16">
          <p style="font-size: 20px; padding: 0 20px;" class="align-center">通过你的网络发起统计</p>
        </el-col>
        <el-col :span="4">
          <i class="el-icon-check" style="float: right; padding: 20px;" v-on:click="formSubmit()"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div>
        <img src="../assets/server.png" style="width:50%">
        <p>当前服务器文件配置{{this.netFile}}</p>
        <p>这项功能将会在你的本地开启一个http服务器，通过这个简单的服务器，你可以在你的本地网络中发起统计</p>
        <el-switch
          v-model="serverState"
          active-text="启动"
          inactive-text="关闭"
          style="display:block; text-align:center">
        </el-switch>
      </div>

      <!-- dialog -->
      <el-dialog
        title="选择文件"
        :visible.sync="fileChooseDialog"
        :show-close=false
        :close-on-press-escape=false
        width="50%">
        <span>选择你的数据文件</span>
        <el-button type="primary" v-on:click="chooseNetFile()">选择</el-button>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import GlobalData from '@/components/GlobalData'
import Electron from 'electron'
import Fs from 'fs'
export default {
  data () {
    return {
      fileChooseDialog: false,
      netFile: '',
      serverState: false
    }
  },
  created: function () {
    if (GlobalData.state.netFile === '' && GlobalData.state.newNet) {
      this.fileChooseDialog = true
    }
  },
  watch: {
    serverState: function () {
      this.toogleServer()
    }
  },
  methods: {
    /**
     * 选择数据文件
     */
    chooseNetFile () {
      let ipc = Electron.ipcRenderer
      ipc.send('netpage-choosenetfile')
      ipc.on('netpage-getnetfile', (event, file) => {
        this.netFile = file[0]
        let netFileArr = this.netFile.split('\\')
        GlobalData.setNetFile(netFileArr[netFileArr.length - 1].split('.')[0])
        this.fileChooseDialog = false
        if (GlobalData.state.netFile !== '') {
          Fs.readFile(this.netFile, 'utf-8', (err, data) => {
            if (err) {
              console.log('fail to get tht sta file')
            } else {
              GlobalData.state.netData = JSON.parse(data)
              console.log(GlobalData.state.netData)
            }
          })
        } else {
          console.log('fail to set the sta file')
        }
      })
    },
    /**
     * 更改服务器状态
     */
    toogleServer () {
      let ipc = Electron.ipcRenderer
      console.log('改变状态')
      if (GlobalData.state.newNet && GlobalData.state.netFile === '') {
        this.$message.error('还没有选择数据文件')
        this.serverState = false
        this.fileChooseDialog = true
      } else {
        if (this.serverState) {
          ipc.send('netpage-startserver', GlobalData.state.netData, GlobalData.state.netFile)
        } else {
          ipc.send('netpage-stopserver')
        }
      }
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
 .itemName {
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
 .align-center {
    -webkit-margin-before: 0 !important;
    -webkit-margin-after: 0 !important;
    line-height: 60px;
  }
</style>
