<template>
  <div class="numContrait">
    <el-row style="margin: 0; background-color: #B3C0D1; padding: 2px 0px;">设定限制条件</el-row>
    <el-row style="margin-top: 4px;">
      <el-col :span="8"><p>最小值</p></el-col>
      <el-col :span="16">
        <el-input-number size="medium" v-model="min" :min="1" :max="150" label="用于限制用户输入文本的最小值"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><p>最大值</p></el-col>
      <el-col :span="16">
        <el-input-number size="medium" v-model="max" :min="1" :max="1000000" label="用于限制用户输入文本的最大值"></el-input-number>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      min: 0,
      max: 100
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
          max: this.max
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    },
    max: function () {
      let data = {
        constrait: {
          min: this.min,
          max: this.max
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    }
  }
}
</script>

<style>
.numContrait {
  background-color:azure;
  padding-bottom: 5px;  
}
</style>
