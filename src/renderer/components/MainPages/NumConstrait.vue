<template>
  <div>
    <el-row>
      <el-col :span="12"><p>最小值</p></el-col>
      <el-col :span="12">
        <el-input-number v-model="min" :min="1" :max="150" label="用于限制用户输入文本的最小值"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><p>最大值</p></el-col>
      <el-col :span="12">
        <el-input-number v-model="max" :min="1" :max="150" label="用于限制用户输入文本的最大值"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6"><p>固定长度</p></el-col>
      <el-col :span="6">
        <el-switch
          v-model="constant"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-col>
      <el-col :span="6">
        <el-input-number v-if="constant" v-model="constLength" :min="1" :max="150" label="数字的固定长度"></el-input-number>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      min: 0,
      max: 10000000,
      constant: false,
      constLength: 10
    }
  }
}
</script>

<style>

</style>
