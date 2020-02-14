<template>
<div>
  <!-- 调用组件 -->
   <el-form ref="form" :model="form" label-width="80px">
      <grid-layout
                  :layout.sync="layout"
                  :col-num="12"
                  :row-height="40"
                  :is-draggable="true"
                  :is-resizable="true"
                  :is-mirrored="false"
                  :vertical-compact="true"
                  :margin="[20, 20]"
                  :use-css-transforms="true"
          >
          <grid-item v-for="item in layout"
                     :x="item.x"
                     :y="item.y"
                     :w="item.w"
                     :h="item.h"
                     :i="item.i"
                     :key="item.i">
              <form-item :formNode='item.node'></form-item>
          </grid-item>
      </grid-layout>
  </el-form>
 </div>
</template>
<script>
  import VueGridLayout from 'vue-grid-layout';
  import {fetchNodeList} from '@/api/gridLayout'
  import FormItemElement from './FormItemElement.vue';
  export default {
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      formItem: FormItemElement,
    },
    name: 'draggabletest',
    data () {
      return {
       layout: [],
       form:null
      }
    },
    mounted () {
      fetchNodeList().then(response => {
        this.layout = response.data
      })
    },
    methods: {
    }
  }
</script>
<style scoped>
  
</style>