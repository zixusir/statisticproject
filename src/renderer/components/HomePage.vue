<template>
  <el-container>
    <el-header>
      <div style="line-height: 60px; font-size: 20px">欢迎使用</div>
    </el-header>

    <el-main style="
      display: flex;
      align-items: center;
      align-content: center;">
      <div style="background-color: green; width: 300px; height: 400px; margin: auto">
        <p style="font-size: 25px">选择你的操作</p>
        <router-link to="/">新建一个统计</router-link>
        <p style="font-size: 25px">或者</p>
        <table style="width: 100%; padding-left: 15px; padding-right: 15px;">
          <tr v-for="item in staItems" :key="item.id" style="width: 100%">
            <td>{{item}}</td>
            <td>
              <router-link :to="{name: 'editpage', params: {data: item}}">编辑</router-link>
            </td>
            <td>
              <router-link :to="{name: 'fillpage', params: {data: item}}">统计</router-link>
            </td>
            <td>
              <router-link :to="{name: 'sheetpage', params: {data: item}}">汇总</router-link>
            </td>
          </tr>
        </table>
      </div>
    </el-main>

    <el-footer style="line-height: 60px">
      快速实现统计分发
    </el-footer>
  </el-container>
</template>

<script>
import Electron from 'electron'
export default {
  data () {
    return {
      staItems: []
    }
  },
  created: function () {
    let ipc = Electron.ipcRenderer
    ipc.send('homepage-findsta')
    ipc.on('homepage-getsta', (e, d) => {
      // console.log(d)
      this.staItems = d
    })
  }
}
</script>

<style>
  .align-center {
    -webkit-margin-before: 0 !important;
    -webkit-margin-after: 0 !important;
    line-height: 60px;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    float: left;
    height: auto;
    /* line-height: 60px; */
  }
  .header i {
    padding: 15px;
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
</style>
