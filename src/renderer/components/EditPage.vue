<template>
  <el-container class="mainContainer">
    <el-header class="header">
      <el-row :gutter="20">
        <el-col :span="22"><p>修改统计项目</p></el-col>
        <el-col :span="2"><i class="el-icon-check" v-on:click="save()"></i></el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-container v-for="item in items" :key="item.id" class="item">
        <el-row style="width: 100%">
          <el-col :span="6">
            <el-input v-model="item.itemName" placeholder="请输入内容" class="itemName"></el-input>
          </el-col>
          <el-col :span="14">
            <div v-if="item.type === 'text'">
              <text-constrait ref="textCt" v-bind="item"></text-constrait>
            </div>
            <div v-if="item.type === 'num'">
              <num-constrait ref="numCt" v-bind="item"></num-constrait>
            </div>
            <div v-if="item.type === 'date'"> </div>
            <div v-if="item.type === 'time'"> </div>
            <div v-if="item.type === 'email'"> </div>
            <div v-if="item.type === 'longtext'"> </div>
            <div v-if="item.type === 'pic'">
              <pic-constrait ref="picCt" v-bind="item"></pic-constrait>
            </div>
          </el-col>
          <el-col :span="2">
            <i class="el-icon-delete" v-on:click="deleteThis(item)"></i>
            <i class="el-icon-caret-top" v-on:click="itemUp(item)"></i>
            <i class="el-icon-caret-bottom" v-on:click="itemDown(item)"></i>
          </el-col>
        </el-row>
      </el-container>
      <el-dialog
        title="选择文件"
        :visible.sync="fileChooseDialog"
        :show-close=false
        :close-on-press-escape=false
        width="50%">
        <span>
          <div >
            <el-button type="primary" v-on:click="newFormat()">新建一个表</el-button>
            <el-button type="primary" v-on:click="chooseFormat()">修改现有表</el-button>
          </div>
        </span>
      </el-dialog>

      <el-dialog 
        title="保存文件名"
        :visible.sync="saveDialog"
        width="50%">
        <span>
          <div>
            <el-input v-model="formatName" width="50%"></el-input>
            <el-button type="primary" v-on:click="confirmSave()">确认保存</el-button>
          </div> 
        </span>
      </el-dialog>
    </el-main>

    <el-footer style="height: initial; padding: 0;">
      <el-container class="center mainContent">
        <div>
          <div class="el-icon-circle-plus-outline"></div>
          <div class="newitem">
            <el-row>
              <el-button v-on:click="addText()">文本</el-button>
              <el-button type="info" v-on:click="addNumber()">数字</el-button>
              <el-button type="primary" v-on:click="addDate()">日期</el-button>
              <el-button type="success" v-on:click="addTime()">时间</el-button>
              <el-button type="warning" v-on:click="addEmail()">邮箱</el-button>
              <el-button type="danger" v-on:click="addLongText()">长文本</el-button>
              <el-button type="danger" v-on:click="addPic()">图片</el-button>
            </el-row>
          </div>
        </div>
      </el-container>
    </el-footer>
  </el-container>
</template>

<script>
import Vue from 'vue'
import fs from 'fs'
import path from 'path'
import Electron from 'electron'
import textConstrait from '@/components/EditPages/TextConstrait'
import numConstrait from '@/components/EditPages/NumConstrait'
import picConstrait from '@/components/EditPages/PicConstrait'
import Global from '@/components/Global'
export default {
  data () {
    return {
      isCollapse: true,
      items: [],
      dialogVisible: false,
      dialogItem: null,
      fileChooseDialog: false,
      formatFile: '',
      saveDialog: false,
      formatName: ''
    }
  },
  components: {
    textConstrait,
    numConstrait,
    picConstrait
  },
  created () {
    if (this.formatFile === '') this.fileChooseDialog = true
  },
  computed: {
    currentFile: function () {
      return Global.state.currentFile
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
          max: 150,
          constant: 0, // 如果常数为0，表示不定长度，否则表示定长，min与max自动失效
          lang: 'mix' // pureEng, pureChn, mix三种混合选项
        }
      }
      this.items.push(text)
      console.log(this.$refs.textCt)
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
    addDate () {
      let date = {
        id: this.items.length + 1,
        type: 'date',
        itemName: '日期',
        constrait: '无约束'
      }
      this.items.push(date)
    },
    addTime () {
      let time = {
        id: this.items.length + 1,
        type: 'time',
        itemName: '时间',
        constrait: '无约束'
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
        itemName: '多行文本',
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
          width: 100,
          height: 300,
          size: 2
        }
      }
      this.items.push(pic)
    },
    deleteThis (item) {
      let index = this.items.indexOf(item)
      this.items.splice(index, 1)
      for (let i = index; i < this.items.length; i++) {
        this.items[i].id--
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    constrait (item) {
      this.dialogItem = item
      this.dialogVisible = true
      switch (item.type) {
        case 'text':
          console.log('set constraits to text')
          break
        case 'number':
          console.log('set constraits to number')
          break
      }
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
      if (this.formatName === '') {
        this.$message({message: '没有定义文件名', type: 'warning'})
      } else {
        console.log('保存文件')
        const h = this.$createElement
        this.$notify({
          title: '提示',
          message: h('i', {style: 'color: teal'}, '正在保存')
        })
        let filePath = path.join('./', this.formatName + '.sta')
        fs.writeFile(filePath, JSON.stringify(this.items), (err) => {
          if (err) {
            this.$notify({
              title: '错误',
              duration: 1500,
              message: h('i', {style: 'color: teal'}, '文件保存错误')
            })
          } else {
            ipc.send('editpage-newdatabase', this.formatName)
            this.$notify({
              title: '成功',
              duration: 1500,
              message: h('i', {style: 'color: teal'}, '文件保存成功在：' + filePath)
            })
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
    },
    /*
    * newFormat() 新建一个格式表
    */
    newFormat () {
      this.items = []
      this.fileChooseDialog = false
    },
    /*
    * chooseFormat()更改格式文件
    */
    chooseFormat () {
      let G = Global.state
      console.log(G)
      let ipc = Electron.ipcRenderer
      ipc.send('editpage-chooseformat')
      ipc.on('editpage-getformat', (e, d) => {
        console.log(Global)
        this.formatFile = d[0]
        // G.state.currentFile = this.formatFile
        this.setFormatView()
      })
    },
    /*
    * setFormatView() 根据格式文件修改视图，准确的说，修改视图数据this.items
    */
    setFormatView () {
      if (this.formatFile !== '') {
        fs.readFile(this.formatFile, 'utf-8', (err, data) => {
          if (err) {
            this.notice('读取格式文件失败')
          } else {
            this.items = JSON.parse(data)
            this.fileChooseDialog = false
          }
        })
      } else {
        this.notice('没有选择格式文件')
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
 .itemName{
   width: 150px;
 }
 .item p{
   width: 150px;
   margin: 0;
   padding: 10px 5px 10px 5px;
 }
 .item i{
  margin: 10px;
 }
</style>
