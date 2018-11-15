<template>
  <el-container class="mainContainer">
    <el-header class="header">
      <el-row :gutter="0">
        <el-col :span="1">
          <i class="el-icon-plus" v-on:click="newEdit()" style="font-size: 15pt">
            <div style="font-size: 7pt;">新建</div>
          </i>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-news" v-on:click="chooseEdit()" style="font-size: 15pt">
            <div style="font-size: 7pt;">选择</div>
          </i>
        </el-col>
        <el-col :span="4" class="align-center">当前:{{this.fileName}}</el-col>
        <el-col :span="12"><p style="font-size: 20px; padding: 0 20px;" class="align-center">修改统计项目</p></el-col>
        <el-col :span="6">
          <i class="el-icon-check" v-on:click="save()" style="font-size: 15pt; float: right;">
            <div style="font-size: 7pt;">保存</div>
          </i>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-container v-for="item in items" :key="item.id" class="item">
        <el-row style="width: 100%; background-color: azure; padding-top: 6px;">
          <el-col :span="6">
            <el-input v-model="item.itemName" placeholder="请输入内容" class="itemName"></el-input>
          </el-col>
          <el-col :span="14">
            <div v-if="item.type === 'text'">
              <text-constrait ref="textCt" v-bind:item="item" v-on:childByValue="childByValue"></text-constrait>
            </div>
            <div v-if="item.type === 'num'">
              <num-constrait ref="numCt" v-bind:item="item" v-on:childByValue="childByValue"></num-constrait>
            </div>
            <div v-if="item.type === 'date'">
              <date-constrait v-bind:item="item" v-on:childByValue="childByValue"></date-constrait>
            </div>
            <div v-if="item.type === 'time'">
              <time-constrait v-bind:item="item" v-on:childByValue="childByValue"></time-constrait>
            </div>
            <div v-if="item.type === 'longtext'"> 
              <langtext-constrait v-bind:item="item" v-on:childByValue="childByValue"></langtext-constrait>
            </div>
            <div v-if="item.type === 'pic'">
              <pic-constrait ref="picCt" v-bind:item="item" v-on:childByValue="childByValue"></pic-constrait>
            </div>
            <div v-if="item.type === 'percent'"
              style="line-height: 40px;">
              预设百分数约束条件
            </div>
            <div v-if="item.type === 'zip'"
              style="line-height: 40px;">
              预设邮编约束条件
            </div>
            <div v-if="item.type === 'idcard'"
              style="line-height: 40px;">
              预设身份证约束条件
            </div>
            <div v-if="item.type === 'email'"
              style="line-height: 40px;">
              预设邮箱约束条件 
            </div>
          </el-col>
          <el-col :span="4"
            style="display: flex; justify-content: center;">
            <div style="display: block; width: 20px;">
              <i class="el-icon-delete" v-on:click="deleteThis(item)"></i>
              <i class="el-icon-caret-top" v-on:click="itemUp(item)"></i>
              <i class="el-icon-caret-bottom" v-on:click="itemDown(item)"></i>
            </div>
          </el-col>
        </el-row>
      </el-container>

      <el-dialog
        title="输入统计名称"
        :visible.sync="newFileDialog"
        :show-close=false
        :close-on-press-escape=false
        width="500px">
        <span style="min-width: 500px">
          <div style="display: flex; justify-content: center; min-width: 500px">
            <span style="line-height: 40px">名称</span>
            <el-input v-model="fileName" style="width: 300px;padding-left: 20px; padding-right: 20px;"></el-input>
            <el-button type="primary" v-on:click="createNewFile()">新建</el-button>
          </div>
        </span>
      </el-dialog>

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
                  <div v-on:click="chooseFormat(item)">
                    <span>选择</span>
                  </div>
                  <!-- <router-link :to="{name: 'editpage', params: {datafile: item}}">编辑</router-link> -->
                </td>
              </tr>
            </table>
          </div>
        </span>
      </el-dialog>

      <el-dialog 
        title="保存文件名"
        :visible.sync="saveDialog"
        width="500px">
        <span>
          <div>
            <el-input v-model="fileName" width="50%"></el-input>
            <el-button type="primary" style="margin: 5px" v-on:click="confirmSave()">确认保存</el-button>
          </div> 
        </span>
      </el-dialog>
    </el-main>

    <el-footer style="height: initial; padding: 0;">
      <el-container class="center mainContent">
        <div style="width: 100%;">
          <div class="el-icon-circle-plus-outline"></div>
          <div class="newitem">
            <el-row>
              <el-button v-on:click="addText()">文本</el-button>
              <el-button type="info" v-on:click="addNumber()">数字</el-button>
              <el-button type="info" v-on:click="addPercent()">百分数</el-button>
              <el-button type="primary" v-on:click="addDate()">日期</el-button>
              <el-button type="success" v-on:click="addTime()">时间</el-button>
              <el-button v-on:click="addLongText()">长文本</el-button>
              <el-button type="danger" v-on:click="addPic()">图片</el-button>
              <el-button type="primary" v-on:click="addZip()">邮编</el-button>
              <el-button v-on:click="addIdcard()">身份证号</el-button>
              <el-button type="warning" v-on:click="addEmail()">邮箱</el-button>
            </el-row>
          </div>
        </div>
      </el-container>
    </el-footer>
  </el-container>
</template>

<script>
import Vue from 'vue'
// import fs from 'fs'
// import path from 'path'
import Electron from 'electron'
import textConstrait from '@/components/EditPages/TextConstrait'
import numConstrait from '@/components/EditPages/NumConstrait'
import picConstrait from '@/components/EditPages/PicConstrait'
import dateConstrait from '@/components/EditPages/dateConstrait'
import timeConstrait from '@/components/EditPages/timeConstrait'
import langtextConstrait from '@/components/EditPages/langtextConstrait'
import GlobalData from '@/configData'
// import DataBase from '../../database/index'
export default {
  data () {
    return {
      isCollapse: true,
      items: [],
      dialogVisible: false,
      dialogItem: null,
      newFileDialog: false,
      formatFile: '',
      saveDialog: false,
      fileName: '',
      fileChooseDialog: false,
      staItems: []
    }
  },
  components: {
    textConstrait,
    numConstrait,
    picConstrait,
    dateConstrait,
    timeConstrait,
    langtextConstrait
  },
  created () {
    if (this.$route.params && this.$route.params.datafile && this.$route.params.datafile !== '') {
      console.log('正在渲染……')
      console.log(this.$route.params.datafile)
      let staName = this.$route.params.datafile
      let ipc = Electron.ipcRenderer
      this.fileName = staName
      ipc.send('editpage-findsta', staName)
      ipc.on('editpage-getsta', (event, data) => {
        this.items = data[0].staContent
        GlobalData.setCurrentFile(data[0].name)
      })
    } else {
      // 如果路径上没有指明文件，就新建一个
      this.items = []
      this.newFileDialog = true
      console.log('we find nothing')
    }
  },
  methods: {
    addText () {
      console.log('点击事件触发')
      let text = {
        id: this.items.length + 1,
        type: 'text',
        itemName: '文本',
        constrait: {
          min: 0,
          max: 20,
          lang: 'mix' // pureEng, pureChn, mix三种混合选项
        }
      }
      this.items.push(text)
      // console.log(this.$refs.textCt)
    },
    addNumber () {
      let number = {
        id: this.items.length + 1,
        type: 'num',
        itemName: '数字',
        constrait: {
          length: 1,
          min: 0,
          max: 100000
        }
      }
      this.items.push(number)
    },
    addPercent () {
      let percent = {
        id: this.items.length + 1,
        type: 'percent',
        itemName: '百分数',
        constrait: {
        }
      }
      this.items.push(percent)
    },
    addDate () {
      let start = new Date()
      start.setFullYear(1980, 1, 1)
      let end = new Date()
      end.setFullYear(2100, 1, 1)
      let date = {
        id: this.items.length + 1,
        type: 'date',
        itemName: '日期',
        constrait: {
          min: start,
          max: end
        }
      }
      this.items.push(date)
    },
    addTime () {
      let start = new Date()
      start.setHours(0, 0, 0)
      let end = new Date()
      end.setHours(23, 59, 59)
      let time = {
        id: this.items.length + 1,
        type: 'time',
        itemName: '时间',
        constrait: {
          tafter: start,
          tbefore: end
        }
      }
      this.items.push(time)
    },
    addEmail () {
      let email = {
        id: this.items.length + 1,
        type: 'email',
        itemName: '邮箱',
        constrait: '无约束'
      }
      this.items.push(email)
    },
    addLongText () {
      let longText = {
        id: this.items.length + 1,
        type: 'longtext',
        itemName: '段落',
        constrait: '无约束'
      }
      this.items.push(longText)
    },
    addPic () {
      let pic = {
        id: this.items.length + 1,
        type: 'pic',
        itemName: '图片',
        constrait: {
          checkList: [],
          max: 50
        }
      }
      this.items.push(pic)
    },
    addZip () {
      let zip = {
        id: this.items.length + 1,
        type: 'zip',
        itemName: '邮编',
        constrait: {
        }
      }
      this.items.push(zip)
    },
    addIdcard () {
      let idcard = {
        id: this.items.length + 1,
        type: 'idcard',
        itemName: '身份证号',
        constrait: {
        }
      }
      this.items.push(idcard)
    },
    deleteThis (item) {
      let index = this.items.indexOf(item)
      this.items.splice(index, 1)
      for (let i = index; i < this.items.length; i++) {
        this.items[i].id--
      }
    },
    childByValue (arg) {
      arg.item.constrait = arg.constrait
    },
    getConstrait () {
      this.dialogVisible = false
      let item = this.dialogItem
      switch (item.type) {
        case 'text':
          item.constrait.min = this.$refs.textCt.min
          item.constrait.max = this.$refs.textCt.max
          if (item.constrait.min > item.constrait.max) {
            this.notice('文本条件错误：最小值大于最大值,最小值自动修正为最大值')
            item.constrait.min = item.constrait.max
          }
          console.log(this.items)
          break
      }
    },
    notice (str) {
      const h = this.$createElement
      this.$notify.error({
        title: '错误',
        message: h('i', {style: 'color: teal'}, str)
      })
    },
    /**
     * 新建一个统计
     */
    newEdit () {
      // 1.清空当前items
      this.items = []
      this.newFileDialog = true
    },
    createNewFile () {
      let ipc = Electron.ipcRenderer
      // console.log(DataBase)
      // 通知数据库
      if (this.fileName) {
        ipc.send('editpage-newdatabase', this.fileName, [])
        ipc.on('editpage-newdbback', (event, backcode) => {
          console.log(`the backcode is ${backcode}`)
          if (backcode === 0) {
            this.$message({
              message: '已存在相同名称的统计数据库',
              type: 'warning'
            })
          } else {
            this.newFileDialog = false
            // 配置configData
            GlobalData.setCurrentFile(this.fileName)
          }
        })
      }
    },
    chooseEdit () {
      this.fileChooseDialog = true
      let ipc = Electron.ipcRenderer
      // 借用homepage的api
      ipc.send('homepage-findsta')
      ipc.on('homepage-getsta', (e, d) => {
        console.log(d)
        this.staItems = d
      })
    },
    /*
    * chooseFormat()更改格式文件
    */
    chooseFormat (fileName) {
      let ipc = Electron.ipcRenderer
      ipc.send('editpage-findsta', fileName)
      ipc.on('editpage-getsta', (event, data) => {
        this.items = data[0].staContent
        GlobalData.setCurrentFile(data[0].name)
        this.fileName = data[0].name
        this.fileChooseDialog = false
      })
    },
    /*
    * save() 保存
    */
    save () {
      this.saveDialog = true
    },
    /*
    * confirmSave() 确认保存
    */
    confirmSave () {
      let ipc = Electron.ipcRenderer
      if (this.fileName === '') {
        this.$message({message: '没有定义文件名', type: 'warning'})
      } else {
        console.log('保存文件')
        const h = this.$createElement
        this.$notify({
          title: '提示',
          message: h('i', {style: 'color: teal'}, '正在保存')
        })
        ipc.send('editpage-updatedatabase', this.fileName, this.items)
        ipc.on('editpage-updateback', (e, d) => {
          if (d) {
            this.saveDialog = false
          }
        })
      }
    },
    /*
    * itemUp() 项目前移
    */
    itemUp (item) {
      let index = this.items.indexOf(item)
      if (index > 0) {
        let item1 = this.items[index - 1]
        let item2 = this.items[index]
        let id = item2.id
        item2.id = item1.id
        item1.id = id
        Vue.set(this.items, index - 1, item2)
        Vue.set(this.items, index, item1)
      }
    },
    /*
    * itemDown() 项目下移
    */
    itemDown (item) {
      let index = this.items.indexOf(item)
      if (index < this.items.length - 1) {
        let item1 = this.items[index + 1]
        let item2 = this.items[index]
        let id = item2.id
        item2.id = item1.id
        item1.id = id
        Vue.set(this.items, index + 1, item2)
        Vue.set(this.items, index, item1)
      }
    }
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
