<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4" class="align-center">当前：{{this.fillFile}}</el-col>
        <el-col :span="16">
          <p style="font-size: 20px; padding: 0 20px;" class="align-center">填表</p>
        </el-col>
        <el-col :span="4">
          <i class="el-icon-check" style="float: right; padding: 20px;" v-on:click="formSubmit()"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="display: flex;">
      <el-form ref="form" label-width="80px" style="width: 500px; text-align: left;">
        <el-form-item v-for="item in items" :key="item.id" :label="item.itemName">
          <div v-if="item.type === 'text'">
            <el-input
              v-model="item.value"
              placeholder="请输入内容"
              :clearable=true
              v-on:change="checkInput(item)">
            </el-input>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
          <div v-if="item.type === 'num'">
            <el-input
              v-model="item.value"
              placeholder="请输入内容"
              :clearable=true
              v-on:change="checkInput(item)">
            </el-input>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
          <div v-if="item.type === 'date'">
            <el-date-picker
              v-on:change="checkInput(item)"
              v-model="item.value"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
          <div v-if="item.type === 'time'">
            <el-time-picker
              v-on:change="checkInput(item)"
              v-model="item.value"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="任意时间点">
            </el-time-picker>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
          <div v-if="item.type === 'longtext'">
            <el-input
              v-on:change="checkInput(item)"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入内容"
              v-model="item.value">
            </el-input>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
          <div v-if="item.type === 'pic'">
            <div>
              <el-button size="small" type="primary" v-on:click="chooseFile(item)">选择</el-button>
              <div slot="tip" class="el-upload__tip">只能上传{{item.constrait.checkList}}文件，且不超过{{item.constrait.max}}MB</div>
              <img v-bind:src="item.value" style="height: 100px; wdith: 100px;"/>
              <div
                class="warning"
                v-for="warn in item.warn"
                :key="warn.id">
                {{warn}}
              </div>
              <!-- <img src="src\renderer\assets\images\81f937cegw1f34qco2koaj20xc0wsk52.jpg" alt=""> -->
            </div>
          </div>
          <div v-if="item.type === 'email'">
            <el-input
              v-on:change="checkInput(item)"
              v-model="item.value"
              placeholder="请输入内容"
              :clearable=true>
            </el-input>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
          <div v-if="item.type === 'idcard'">
            <el-input
              v-on:change="checkInput(item)"
              v-model="item.value"
              placeholder="请输入内容"
              :clearable=true>
            </el-input>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
          <div v-if="item.type === 'zip'">
            <el-input
              v-on:change="checkInput(item)"
              v-model="item.value"
              placeholder="请输入内容"
              :clearable=true></el-input>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
          <div v-if="item.type === 'percent'">
            <el-input
              v-on:change="checkInput(item)"
              v-model="item.value"
              placeholder="请输入内容"
              :clearable=true>
              <template slot="append">%</template>
            </el-input>
            <div
              class="warning"
              v-for="warn in item.warn"
              :key="warn.id">
              {{warn}}
            </div>
          </div>
        </el-form-item>
      </el-form>

      <el-dialog
        title="选择文件"
        :visible.sync="fileChooseDialog"
        :show-close=false
        :close-on-press-escape=false
        width="50%">
        <span>
          <div >
            <p>在开始之前，请选择你要填写的统计表（在文件系统中选择一个‘.sta’后缀名文件）</p>
            <el-button type="primary" v-on:click="chooseFillFile()">选择</el-button>
          </div>
        </span>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import fs from 'fs'
import Path from 'path'
import Vue from 'vue'
import electron from 'electron'
import GlobalData from '@/components/GlobalData'

export default {
  data () {
    return {
      items: [],
      fileChooseDialog: false,
      fillFile: ''
    }
  },
  created: function () {
    if (GlobalData.state.fillFile === '') {
      this.fileChooseDialog = true
    } else {
      console.log(GlobalData.state.fillFile)
      this.fillFile = GlobalData.state.fillFile
      let filePath = Path.join('./', GlobalData.state.fillFile)
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          this.notice('error', '读取文件失败')
        } else {
          this.notice('info', '请稍等，正在读取文件')
          let temp = JSON.parse(data)
          temp.forEach(item => {
            item.value = ''
            if (item.type === 'pic') {
              item.value = 'src\\renderer\\assets\\images\\81f937cegw1f34qco2koaj20xc0wsk52.jpg'
            }
          })
          this.items = temp
        }
      })
    }
  },
  methods: {
    notice (type, str) {
      const h = this.$createElement
      switch (type) {
        case 'info':
          this.$notify.info({
            title: '提示',
            message: h('i', {style: 'color: teal'}, str)
          })
          break
        case 'error':
          this.$notify.error({
            title: '错误',
            message: h('i', {style: 'color: teal'}, str)
          })
      }
    },
    chooseFile (item) {
      let ipc = electron.ipcRenderer
      let _path = Path
      let _this = this
      ipc.send('open-file-dialog')
      ipc.on('selectedItems', (e, p) => {
        let filePath = p[0]
        let fileNameArr = filePath.split('\\')
        let fileName = fileNameArr[fileNameArr.length - 1]
        let fileReadStream = fs.createReadStream(filePath)
        let imgPath = _path.join('.', 'static/images/', fileName)
        let fileWriteStream = fs.createWriteStream(imgPath)
        fileReadStream.pipe(fileWriteStream)
        fileWriteStream.on('close', () => {
          console.log('文件拷贝完成')
          item.value = imgPath
          Vue.set(_this.items, _this.items.indexOf(item), item)
        })
      })
    },
    formSubmit () {
      console.log('提交')
      console.log(this.items)
      let ipc = electron.ipcRenderer
      ipc.send('fillpage-insertdata', this.fillFile.split('.')[0], this.items)
    },
    /**
     * chooseFillFile() 选择一个填写文件
     */
    chooseFillFile () {
      let ipc = electron.ipcRenderer
      ipc.send('fillpage-choosefillfile')
      ipc.on('fillpage-getfillfile', (e, d) => {
        console.log(d[0])
        let fileNameArr = d[0].split('\\')
        this.fillFile = fileNameArr[fileNameArr.length - 1]
        GlobalData.setFillFile(this.fillFile)
        this.setFillPageView()
      })
    },
    /**
     * setFillPageView() 触发视图更改
     */
    setFillPageView () {
      if (this.fillFile !== '') {
        fs.readFile(this.fillFile, 'utf-8', (err, data) => {
          if (err) {
            this.$message.error('读取格式文件失败')
          } else {
            this.$message({
              message: '正在使用' + this.fillFile,
              type: 'sucess'
            })
            this.items = JSON.parse(data)
            this.items.forEach(each => {
              each.item = null
            })
            this.fileChooseDialog = false
          }
        })
      } else {
        this.$message.error('读取格式文件失败')
      }
    },
    /**
     * checkInput() 验证表单输入
     */
    checkInput (item) {
      console.log('onChange>>>>>')
      let newItem = null
      let warn = []
      switch (item.type) {
        case 'text':
          warn = []
          if (item.value.length < item.constrait.min || item.value.length > item.constrait.max) {
            let warnStr = '文本长度在' + item.constrait.min + '与' + item.constrait.max + '之间'
            warn.push(warnStr)
          }
          let chn = /[\u4E00-\u9FA5]+/
          let eng = /[A-Za-z]+/
          if (item.constrait.lang === 'eng') {
            console.log(chn.test(item.value))
            if (chn.test(item.value)) warn.push('仅允许输入英文')
          } else if (item.constrait.lang === 'chn') {
            if (eng.test(item.value)) warn.push('仅允许输入中文')
          }
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'num':
          warn = []
          let numReg = /^[0-9]+(.[0-9]*)?$/
          if (!numReg.test(item.value)) {
            warn.push('请输入数字')
          } else {
            if (item.value > item.constrait.max || item.value < item.constrait.min) {
              let warnStr = '数据大小在' + item.constrait.min + '与' + item.constrait.max + '之间'
              warn.push(warnStr)
            }
          }
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'percent':
          warn = []
          let numReg2 = /^[0-9]+(.[0-9]*)?$/
          if (!numReg2.test(item.value)) {
            warn.push('请输入数字')
          } else if (item.value > 100 || item.value < 0) {
            let warnStr = `请输入0-100之间的数`
            warn.push(warnStr)
          }
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'date':
          warn = []
          // console.log(item.value > item.constrait.max)
          // let sMin = item.constrait.min.split('-')
          // let sMax = item.constrait.max.split('-')
          // let min = new Date()
          // let max = new Date()
          // min.setFullYear(parseInt(sMin[0]), parseInt(sMin[1]) - 1, parseInt(sMin[2]))
          // max.setFullYear(parseInt(sMax[0]), parseInt(sMax[1]) - 1, parseInt(sMax[2]))
          if (item.value > item.constrait.max || item.value < item.constrait.min) {
            let warnStr = `请输入${item.constrait.min.toDateString()}与${item.constrait.max.toDateString()}之间的日期`
            warn.push(warnStr)
          }
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'time':
          break
        case 'email':
          break
        case 'longtext':
          break
        case 'pic':
          break
        case 'zip':
          break
        case 'idcard':
          break
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
  .warning{
    color: crimson;
    font-size: 1em;
    padding: 1px;
    display: inline;
    margin-right: 3px;
    border: solid;
    border-radius: 1em;
    text-align: center;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
</style>
