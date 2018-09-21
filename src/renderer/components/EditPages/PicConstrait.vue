<template>
  <div class="picContrait">
    <el-row style="margin: 0; background-color: #B3C0D1; padding: 2px 0px;">设定限制条件</el-row>
    <el-row style="margin-top: 4px;">
      <el-col :span="8"><p>允许文件格式</p></el-col>
      <el-col :span="16">
        <el-checkbox-group v-model="checkList" style="line-height: 39px;">
          <el-checkbox label="jpg"></el-checkbox>
          <el-checkbox label="png"></el-checkbox>
          <el-checkbox label="gif"></el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><p>文件大小限制</p></el-col>
      <el-col :span="16">
        <el-input-number size="medium" v-model="max" :min="1" :step="1" :max="10" label="用于限制用户输入文本的最大值"></el-input-number>
        MB      
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checkList: ['jpg'],
      max: 10
    }
  },
  props: [
    'item'
  ],
  watch: {
    checkList: function () {
      let data = {
        constrait: {
          checkList: this.checkList,
          max: this.max
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    },
    max: function () {
      let data = {
        constrait: {
          checkList: this.checkList,
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
.picContrait {
  background-color:azure;
  padding-bottom: 5px;  
}
</style>
