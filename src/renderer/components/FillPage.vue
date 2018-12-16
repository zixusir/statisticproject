<template>
  <el-container>
    <el-header class="header">
      <el-row :gutter="0">
        <el-col :span="2">
          <i class="el-icon-news" v-on:click="chooseFillFile()" style="font-size: 15pt">
            <div style="font-size: 7pt;">选择</div>
          </i>
        </el-col>
        <el-col :span="4" class="align-center">当前:{{this.fileName}}</el-col>
        <el-col :span="12"><p style="font-size: 20px; padding: 0 20px;" class="align-center">修改统计项目</p></el-col>
        <el-col :span="6">
          <i class="el-icon-check" v-on:click="openSubmitDialog()" style="font-size: 15pt; float: right;">
            <div style="font-size: 7pt;">保存</div>
          </i>
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
              style="display:flex;"
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
              style="display:flex;"
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
                  <div v-on:click="setFillPageView(item)">
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
        title="提交预览"
        :visible.sync="submitDialog"
        :show-close=false
        :close-on-press-escape=false
        width="500px">
        <span>
          <el-input placeholder="请输入区分标识（比如用户名，id，证件号码）" v-model="submitKey">
            <template slot="prepend">区分标识</template>
          </el-input>
          <div style="overflow-y: scroll; height: 300px; padding-top: 5px; padding-bottom: 5px;">
            <table style="width: 100%;">
              <tr v-for="item in items" :key="item.id">
                <td>{{item.itemName}}</td>
                <td>{{item.value}}</td>
              </tr>
            </table> 
          </div>
          <el-button type="primary" v-on:click="formSubmit()">确定提交</el-button>
        </span>

      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import fs from 'fs'
import Path from 'path'
import Vue from 'vue'
import Electron from 'electron'
import GlobalData from '@/configData'

export default {
  data () {
    return {
      items: [],
      staItems: [],
      fileChooseDialog: false,
      submitDialog: false,
      submitKey: '',
      fileName: ''
    }
  },
  created: function () {
    this.ipcEvents()
    if (this.$route.params && this.$route.params.datafile && this.$route.params.datafile !== '*') {
      console.log('fillpage正在渲染...')
      console.log(this.$route.params.datafile)
      this.fileName = this.$route.params.datafile
      // 设置global
      GlobalData.setCurrentFile(this.fileName)
      // 调用editpage接口获取sta内容
      let ipc = Electron.ipcRenderer
      ipc.send('editpage-findsta', this.fileName)
      // ipc.on('editpage-getsta', (event, data) => {
      //   // console.log(1)
      //   this.items = data[0].staContent
      // })
    } else {
      this.fileChooseDialog = true
      this.items = []
      let ipc = Electron.ipcRenderer
      ipc.send('homepage-findsta')
    }
  },
  methods: {
    ipcEvents () {
      let ipc = Electron.ipcRenderer
      ipc.on('editpage-getsta', (event, data) => {
        // console.log(1)
        this.items = data[0].staContent
      })
      ipc.on('fillpage-insertback', (event, data) => {
        console.log('fillpage新提交')
        console.log(data)
        if (data === 'update') {
          this.$message(`成功更新数据库${this.fileName}`)
        } else if (data === 'insert') {
          this.$message(`成功插入数据库${this.fileName}`)
        } else {
          this.$message.error('写入数据库错误')
        }
        this.submitDialog = false
      })
      ipc.on('homepage-getsta', (e, d) => {
        // console.log(d)
        this.staItems = d
      })
    },
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
      let ipc = Electron.ipcRenderer
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
    openSubmitDialog () {
      this.submitDialog = true
    },
    formSubmit () {
      let ipc = Electron.ipcRenderer
      let saveItems = []
      this.items.forEach(element => {
        saveItems.push({
          itemName: element.itemName,
          type: element.type,
          value: element.value
        })
      })
      ipc.send('fillpage-insertdata', this.fileName, this.submitKey, saveItems)
      // ipc.on('fillpage-insertback', (event, data) => {
      //   console.log('fillpage新提交')
      //   console.log(data)
      //   if (data === 'update') {
      //     this.$message(`成功更新数据库${this.fileName}`)
      //   } else if (data === 'insert') {
      //     this.$message(`成功插入数据库${this.fileName}`)
      //   } else {
      //     this.$message.error('写入数据库错误')
      //   }
      //   this.submitDialog = false
      // })
    },
    /**
     * chooseFillFile() 选择一个填写文件
     */
    chooseFillFile () {
      this.fileChooseDialog = true
      let ipc = Electron.ipcRenderer
      // 借用homepage的api
      ipc.send('homepage-findsta')
      // ipc.on('homepage-getsta', (e, d) => {
      //   // console.log(d)
      //   this.staItems = d
      // })
    },
    /**
     * setFillPageView() 触发视图更改
     */
    setFillPageView (item) {
      if (this.fileName !== '') {
        let ipc = Electron.ipcRenderer
        ipc.send('editpage-findsta', item)
        ipc.on('editpage-getsta', (event, data) => {
          // console.log(2)
          this.items = data[0].staContent
          this.fileName = item
        })
      } else {
        this.$message.error('未给定文件名')
      }
      this.fileChooseDialog = false
    },
    /**
     * checkInput() 验证表单输入
     */
    checkInput (item) {
      console.log('>>>>onChange>>>>>')
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
          let min = new Date(item.constrait.min)
          let max = new Date(item.constrait.max)
          if (item.value > max || item.value < min) {
            let warnStr = `请输入${min.toLocaleDateString()}与${max.toLocaleDateString()}之间的日期`
            warn.push(warnStr)
          }
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'time':
          warn = []
          let tmin = new Date(item.constrait.tafter)
          let tmax = new Date(item.constrait.tbefore)
          if (item.value > tmax || item.value < tmin) {
            let warnStr = `请输入${tmin.toLocaleTimeString()}与${tmax.toLocaleTimeString()}之间的时间`
            warn.push(warnStr)
          }
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'email':
          warn = []
          let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
          if (!emailReg.test(item.value)) warn.push('请输入正确的邮箱地址')
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'longtext':
          warn = []
          if (item.value.length > item.constrait.num) warn.push(`段落长度不超${item.constrait.num}字`)
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'pic':
          break
        case 'zip':
          warn = []
          let zipReg = /^\d{6}$/
          if (!zipReg.test(item.value)) warn.push(`请输入6位邮政编码`)
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
          break
        case 'idcard':
          warn = []
          let idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if (!idcardReg.test(item.value)) warn.push('请输入15或18位身份证号码，最后一位为x请用X或x替代')
          newItem = item
          newItem.warn = warn
          Vue.set(this.items, this.items.indexOf(item), newItem)
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
