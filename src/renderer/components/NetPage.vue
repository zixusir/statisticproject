<template>
  <el-container>
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-news" v-on:click="chooseNetFile()" style="font-size: 15pt">
            <div style="font-size: 7pt;">选择</div>
          </i>
        </el-col>
        <el-col :span="16">
          <p style="font-size: 20px; padding: 0 20px;" class="align-center">通过你的网络发起统计</p>
        </el-col>
        <el-col :span="4">
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div>
        <img src="../assets/server.png" style="height: 300px; width: 300px;">
        <div style="display: flex; justify-content: center;">当前服务器文件配置{{this.netFile}}
          <div style="color: red; display: float; padding-left: 5px;" v-on:click="clear()">清空</div>
        </div>
        
        <p>这项功能将会在你的本地开启一个http服务器，通过这个简单的服务器，你可以在你的本地网络中发起统计</p>
        <el-switch
          v-model="serverState"
          active-text="启动"
          inactive-text="关闭"
          style="display:block; text-align:center">
        </el-switch>
        <div>请通过下面的地址访问本服务<a>http://{{this.ipadress}}:5050/index.html</a></div>
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

      <el-dialog
        title="选择统计项目"
        :visible.sync="fileChooseDialog"
        :show-close=true
        :close-on-press-escape=false
        width="500px">
        <span>
          <div style="display: flex; justify-content: center;">
            <table style="width: 100%; padding-left: 15px; padding-right: 15px;">
              <tr v-for="item in staItems" :key="item.id" style="width: 100%">
                <td>{{item}}</td>
                <td>
                  <div v-on:click="choose(item)">
                    <span>选择</span>
                  </div>
                </td>
                <td>
                  <div v-on:click="addInto(item)">
                    <span>添加</span>
                  </div>
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
import GlobalData from '@/configData'
import Electron from 'electron'
// import Fs from 'fs'
export default {
  data () {
    return {
      staItems: [],
      fileChooseDialog: false,
      netFile: '',
      serverState: false,
      ipadress: ''
    }
  },
  created: function () {
    if (GlobalData.state.netState) {
      this.serverState = true
      this.netFile = GlobalData.state.netData
    } else {
      this.chooseNetFile()
      GlobalData.state.netData = []
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
      this.fileChooseDialog = true
      let ipc = Electron.ipcRenderer
      ipc.send('homepage-findsta')
      ipc.on('homepage-getsta', (e, d) => {
        console.log(d)
        this.staItems = d
      })
    },
    /**
     * 选择一个统计数据
     */
    choose (item) {
      console.log(item)
      GlobalData.setNetData(item)
      this.netFile = GlobalData.state.netData
      this.fileChooseDialog = false
    },
    /**
     * 添加一个选择
     */
    addInto (item) {
      console.log(item)
      if (!GlobalData.state.netData.includes(item)) {
        GlobalData.addNetData(item)
        this.netFile = GlobalData.state.netData
      }
    },
    /**
     * 清空选择
     */
    clear () {
      GlobalData.clearNetData()
      this.netFile = GlobalData.state.netData
    },
    /**
     * 更改服务器状态
     */
    toogleServer () {
      let ipc = Electron.ipcRenderer
      console.log('改变状态')
      console.log(GlobalData.state.netData)
      if (GlobalData.state.netData.length < 1) {
        this.$message.error('还没有添加统计文件，点击左上角的添加按钮进行添加')
        this.serverState = false
        this.fileChooseDialog = true
      } else {
        if (this.serverState) {
          ipc.send('netpage-startserver', GlobalData.state.netData)
          ipc.on('netpage-startback', (e, data) => {
            this.ipadress = data
          })
          GlobalData.state.netState = true
        } else {
          ipc.send('netpage-stopserver')
          GlobalData.state.netState = false
          // this.serverState = false
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
