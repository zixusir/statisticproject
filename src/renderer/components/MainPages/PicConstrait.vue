<template>
  <div>
    <el-row>
      <el-col :span="12"><p>宽度</p></el-col>
      <el-col :span="12">
        <el-input-number v-model="width" :min="1" :max="150" label="图片宽度"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><p>高度</p></el-col>
      <el-col :span="12">
        <el-input-number v-model="height" :min="1" :max="500" label="图片高度"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><p>文件大小</p></el-col>
      <el-col :span="12">
        <el-input-number v-model="height" :min="1" :max="150" label="图片高度"></el-input-number>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: 100,
      height: 300,
      size: 2
    }
  }
}
</script>

<style>

</style>
