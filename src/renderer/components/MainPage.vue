<template>
  <el-container class="mainContainer">
    <el-header class="header">
      <el-row :gutter="20">
        <el-col :span="22"><p>依次增加统计项目</p></el-col>
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
          </el-col>
        </el-row>
      </el-container>
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
import fs from 'fs'
import path from 'path'
// import JSON from 'JSON'
import textConstrait from '@/components/MainPages/TextConstrait'
import numConstrait from '@/components/MainPages/NumConstrait'
import picConstrait from '@/components/MainPages/PicConstrait'
export default {
  data () {
    return {
      isCollapse: true,
      items: [],
      dialogVisible: false,
      dialogItem: null
    }
  },
  components: {
    textConstrait,
    numConstrait,
    picConstrait
  },
  created () {
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
    save () {
      console.log('保存文件')
      const h = this.$createElement
      this.$notify({
        title: '提示',
        message: h('i', {style: 'color: teal'}, '正在保存')
      })
      let filePath = path.join(__dirname, 'statisticData.sta')
      fs.writeFile(filePath, JSON.stringify(this.items), (err) => {
        if (err) {
          this.$notify({
            title: '错误',
            message: h('i', {style: 'color: teal'}, '文件保存错误')
          })
        } else {
          this.$notify({
            title: '成功',
            message: h('i', {style: 'color: teal'}, '文件保存成功在：' + filePath)
          })
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
  margin: 10px;
 }
</style>
