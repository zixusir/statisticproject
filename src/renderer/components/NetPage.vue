<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">当前</el-col>
        <el-col :span="18">
          <p style="font-size: 20px; padding: 0 20px;">通过你的网络发起统计</p>
        </el-col>
        <el-col :span="2">
          <i class="el-icon-check" v-on:click="formSubmit()"></i>
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
        this.netFile = file
        this.fileChooseDialog = false
      })
    },
    /**
     * 更改服务器状态
     */
    toogleServer () {
      let ipc = Electron.ipcRenderer
      console.log('改变状态')
      if (this.serverState) {
        ipc.send('netpage-startserver')
      } else {
        ipc.send('netpage-stopserver')
      }
    }
  }
}
</script>

<style>

</style>
