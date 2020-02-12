<template>
  <div>
    <el-form-item :label="formNode.label">
      <template v-if="nodeName === 'INPUT'"2>
        <el-input v-model="value"></el-input>
      </template>

      <template v-else-if="nodeName === 'TEXTAREA'">
        <el-input type="textarea" v-model="value"></el-input>
      </template>

      <template v-else-if="nodeName === 'NUMBER'">
        <el-input-number v-model="value"></el-input-number>
      </template>

      <template v-else-if="nodeName === 'SELECT'">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in formNode.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>

      <template v-else-if="nodeName === 'DATETIME'">
         <el-date-picker
          v-model="value"
          type="datetime"
          placeholder="选择日期时间"
          :default-value="new Date()">
          </el-date-picker>
      </template>


      <template v-else-if="nodeName === 'DATE'">
         <el-date-picker
          v-model="value"
          type="date"
          placeholder="选择日期时间"
          :default-value="new Date()"
          >
          </el-date-picker>
      </template>
    </el-form-item>
  </div>
</template>

<script>
  export default{
    props: {
      formNode:{
        type:Object,
        }
    },
    data(){
      return {
        value:"",
      }
    },
    computed:{
      nodeName(){
        return this.formNode.nodeName.toUpperCase();
      }
    }
  }
</script>

<style>
</style>
