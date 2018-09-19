<template>
  <div class="textConstrait">
    <el-row style="margin: 0; background-color: #B3C0D1; padding: 2px 0px;">设定限制条件</el-row>
    <el-row style="margin-top: 4px;">
      <el-col :span="8"><p>限制最短</p></el-col>
      <el-col :span="16">
        <el-input-number size="medium" v-model="min" :min="1" :max="150" label="用于限制用户输入文本的最小长度"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><p>限制最长</p></el-col>
      <el-col :span="16">
        <el-input-number size="medium" v-model="max" :min="1" :max="150" label="用于限制用户输入文本的最大长度"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><p>语言</p></el-col>
      <el-col :span="16" style="line-height: 39px;">
        <el-radio size="medium" v-model="lang" label="mix">中英混合</el-radio>
        <el-radio size="medium" v-model="lang" label="chn">限制中文</el-radio>
        <el-radio size="medium" v-model="lang" label="eng">限制英文</el-radio>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      min: 1,
      max: 20,
      lang: 'mix'
    }
  },
  props: [
    'item'
  ],
  watch: {
    min: function () {
      let data = {
        constrait: {
          min: this.min,
          max: this.max,
          lang: this.lang
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    },
    max: function () {
      let data = {
        constrait: {
          min: this.min,
          max: this.max,
          lang: this.lang
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    },
    lang: function () {
      let data = {
        constrait: {
          min: this.min,
          max: this.max,
          lang: this.lang
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    }
  }
}
</script>

<style>
.textConstrait {
  background-color:azure;
  padding-bottom: 5px;
}
</style>
