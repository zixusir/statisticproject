<template>
  <div class="timeContrait">
    <el-row style="margin: 0; background-color: #B3C0D1; padding: 2px 0px;">设定限制条件</el-row>
    <el-row style="margin-top: 4px;">
      <el-col :span="8"><p>时间范围</p></el-col>
      <el-col :span="16"
        style="line-height: 39px;">
        <el-time-picker
          size="small"
          v-model="tafter"
          placeholder="任意时间点">
        </el-time-picker>
        之后
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><p>时间范围</p></el-col>
      <el-col :span="16"
        style="line-height: 39px;">
        <el-time-picker
          size="small"
          v-model="tbefore"
          placeholder="任意时间点">
        </el-time-picker>
        之前
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tafter: '',
      tbefore: ''
    }
  },
  props: [
    'item'
  ],
  watch: {
    tafter: function () {
      let data = {
        constrait: {
          tafter: this.tafter,
          tbefore: this.tbefore
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    },
    tbefore: function () {
      let data = {
        constrait: {
          tafter: this.tafter,
          tbefore: this.tbefore
        },
        item: this.item
      }
      this.$emit('childByValue', data)
    }
  }
}
</script>

<style>
.timeContrait {
  background-color:azure;
  padding-bottom: 5px;  
}
</style>
