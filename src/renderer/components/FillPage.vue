<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="22">
          <p style="font-size: 20px; padding: 0 20px;">填表</p>
        </el-col>
        <el-col :span="2">
          <i class="el-icon-check"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="display: flex;">
      <el-form ref="form" label-width="80px" style="width: 500px; text-align: left;">
        <el-form-item v-for="item in items" :key="item.id" :label="item.itemName">
          <div v-if="item.type === 'text'">
            <el-input v-model="item.value" placeholder="请输入内容"></el-input>
          </div>
          <div v-if="item.type === 'num'">
            <el-input v-model="item.value" placeholder="请输入内容"></el-input>
          </div>
          <div v-if="item.type === 'date'">
            <el-date-picker
              v-model="item.value"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div v-if="item.type === 'time'">
            <el-time-picker
              v-model="item.value"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="任意时间点">
            </el-time-picker>
          </div>
          <div v-if="item.type === 'longtext'">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入内容"
              v-model="item.value">
            </el-input>
          </div>
          <div v-if="item.type === 'pic'">
            <div>
              <el-button size="small" type="primary" v-on:click="chooseFile(item)">选择</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              <img v-bind:src="item.value" style="height: 100px; wdith: 100px;"/>
              <!-- <img src="src\renderer\assets\images\81f937cegw1f34qco2koaj20xc0wsk52.jpg" alt=""> -->
            </div>
          </div>
          <div v-if="item.type === 'email'">
            <el-input v-model="item.value" placeholder="请输入内容"></el-input>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import fs from 'fs'
import Path from 'path'
import Vue from 'vue'
import electron from 'electron'
// let ipc = electron.ipcRenderer
let tempPath = ''
console.log(tempPath)
export default {
  data () {
    return {
      items: []
    }
  },
  created: function () {
    let filePath = Path.join(__dirname, 'statisticData.sta')
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        this.notice('error', '读取文件失败')
      } else {
        this.notice('info', '请稍等，正在读取文件')
        this.items = JSON.parse(data)
        this.items.forEach(item => {
          item.value = ''
          if (item.type === 'pic') {
            item.value = 'src\\renderer\\assets\\images\\81f937cegw1f34qco2koaj20xc0wsk52.jpg'
          }
        })
      }
    })
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
      // tempPath = item
      console.log(tempPath)
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
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    /* &:last-child {
      margin-bottom: 0;
    } */
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
