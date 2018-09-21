<template>
  <div class="langtextContrait">
    <el-row style="margin: 0; background-color: #B3C0D1; padding: 2px 0px;">设定限制条件</el-row>
    <el-row style="margin-top: 4px;">
      <el-col :span="8"><p>限制字数</p></el-col>
      <el-col :span="16"
        style="line-height: 39px;">
        <el-input-number 
          size="medium"
          v-model="num"
          :step="100">
        </el-input-number>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      num: 200
    }
  },
  props: [
    'item'
  ],
  created: function () {
    this.num = this.item.constrait.num
  },
  watch: {
    num: function () {
      let data = {
        constrait: {
          num: this.num
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    }
  }
}
</script>

<style>
.langtextContrait {
  background-color:azure;
  padding-bottom: 5px;  
}
</style>
