<template>
  <div>
    <div v-if="formNode.nodeName.toUpperCase() === 'INPUT'">
      <el-form-item :label="formNode.label"><el-input></el-input></el-form-item>
    </div>
    <div v-else-if="formNode.nodeName.toUpperCase() === 'TEXTAREA'">
      <el-form-item :label="formNode.label">
          <el-input type="textarea"></el-input>
        </el-form-item>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      formNode:{
        type:Object,
        }
      },
  }
</script>

<style>
</style>
