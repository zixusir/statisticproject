<template>
  <div id="app">
    <div id = "mainContent">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item index="1" v-on:click="folder()">
          <i class="icon iconfont icon-yingyongguanli"  style="font-size: 16pt"></i>
        </el-menu-item>
        <router-link :to="{name: 'homepage'}">
          <el-menu-item index="2">
            <i class="icon iconfont icon-changjingguanli" style="font-size: 16pt"></i>
            <span slot="title">管理</span>
          </el-menu-item>
        </router-link>
        <router-link :to="{name: 'editpage', params: {datafile: Global.state.currentFile}}">
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">编辑表</span>
          </el-menu-item>
        </router-link>
        <router-link :to="{name: 'fillpage', params: {datafile: Global.state.currentFile}}">
          <el-menu-item index="4">           
            <i class="el-icon-edit"></i>
            <span slot="title">填表</span>
          </el-menu-item>
        </router-link>
        <router-link :to="{name: 'sheetpage', params: {datafile: Global.state.currentFile}}">
          <el-menu-item index="5" >
            <i class="el-icon-printer"></i>
            <span slot="title">制表导出</span>
          </el-menu-item>
        </router-link>
        <router-link :to="{name: 'netpage'}">
          <el-menu-item index="6">
            <i class="el-icon-upload"></i>
            <span slot="title">发起统计</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </div>
    <router-view id="router"></router-view>
  </div>
</template>

<script>
  import GlobalData from '@/configData'
  export default {
    name: 'statistic',
    data () {
      return {
        isCollapse: true,
        Global: null
      }
    },
    created: function () {
      // console.log(GlobalData.state)
      this.Global = GlobalData
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      folder () {
        if (this.isCollapse) {
          this.isCollapse = false
        } else {
          this.isCollapse = true
        }
      }
    }
  }
</script>

<style>
  /* CSS */
  #app {
    /* float: left; */
  }
  a:link {text-decoration:none;}
  #mainContent {
    float: left;
    height: 100vh;
    /* width: 100vw; */
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100vh;
  }
  .el-menu--collapse {
    height: 100vh;
  }
  #router {
    height: 100vh;
  }
  body {
    min-width: 950px;
  }
</style>
