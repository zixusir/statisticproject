<template>
  <div>
    <el-row>
      <el-col :span="12"><p>最小长度</p></el-col>
      <el-col :span="12">
        <el-input-number v-model="min" :min="1" :max="150" label="用于限制用户输入文本的最小长度"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><p>最大长度</p></el-col>
      <el-col :span="12">
        <el-input-number v-model="max" :min="1" :max="150" label="用于限制用户输入文本的最大长度"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><p>语言</p></el-col>
      <el-col :span="12">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      min: 1,
      max: 1,
      options: [{
        value: '选项1',
        label: '仅汉字'
      }, {
        value: '选项2',
        label: '仅英文'
      }, {
        value: '选项3',
        label: '混合'
      }],
      value: ''
    }
  },
  props: [
    'item'
  ]
}
</script>

<style>

</style>
