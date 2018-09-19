<template>
  <div class="dateContrait">
    <el-row style="margin: 0; background-color: #B3C0D1; padding: 2px 0px;">设定限制条件</el-row>
    <el-row style="margin-top: 4px;">
      <el-col :span="8"><p>日期范围</p></el-col>
      <el-col :span="16"
        style="line-height: 39px;">
        <el-date-picker
          size="small"
          v-model="min"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        之后
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><p>日期范围</p></el-col>
      <el-col :span="16"
        style="line-height: 39px;">
        <el-date-picker
          size="small"
          v-model="max"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        之前
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      min: '',
      max: ''
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
.dateContrait {
  background-color:azure;
  padding-bottom: 5px;
}
</style>
