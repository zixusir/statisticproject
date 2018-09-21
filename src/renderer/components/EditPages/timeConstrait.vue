<template>
  <div class="timeContrait">
    <el-row style="margin: 0; background-color: #B3C0D1; padding: 2px 0px;">设定限制条件</el-row>
    <el-row style="margin-top: 4px;">
      <el-col :span="8"><p>{{showMin}}</p></el-col>
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
      <el-col :span="8"><p>{{showMax}}</p></el-col>
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
  created: function () {
    // let taftertemp = new Date(this.item.constrait.tafter)
    // let tbeforetemp = new Date(this.item.constrait.tbefore)
    // this.tafter = taftertemp
    // this.tbefore = tbeforetemp
  },
  computed: {
    showMin: function () {
      let mintemp = new Date(this.item.constrait.tafter)
      return mintemp.toTimeString().split(' ')[0]
    },
    showMax: function () {
      let maxtemp = new Date(this.item.constrait.tbefore)
      return maxtemp.toTimeString().split(' ')[0]
    }
  },
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
