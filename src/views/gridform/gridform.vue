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
                     :key="item.i" style="background:#eee">
              <v-elemnt-item :formNode='item.node'></v-elemnt-item>
          </grid-item>
      </grid-layout>
  </el-form>
 </div>
</template>
<script>
  import VueGridLayout from 'vue-grid-layout';
  var testLayout = [
  	    {"x":0,"y":0,"w":2,"h":1,"i":"0","node": {'nodeName':'input','label':'你好'}},
  	    {"x":2,"y":0,"w":2,"h":1,"i":"1","node": {'nodeName':'textarea',label:'文本框'}},
  	    {"x":4,"y":0,"w":2,"h":1,"i":"2","node": {'nodeName':'input'}},
  	    {"x":6,"y":0,"w":2,"h":1,"i":"3","node": {'nodeName':'input'}},
  	    {"x":8,"y":0,"w":2,"h":1,"i":"4","node": {'nodeName':'input'}},
  	    {"x":10,"y":0,"w":2,"h":1,"i":"5","node": {'nodeName':'input'}},
  	    {"x":0,"y":2,"w":2,"h":1,"i":"6","node": {'nodeName':'input'}},
  	    {"x":2,"y":3,"w":2,"h":1,"i":"7","node": {'nodeName':'input'}},
  	    {"x":4,"y":2,"w":2,"h":1,"i":"8","node": {'nodeName':'input'}},
  	    {"x":6,"y":2,"w":2,"h":1,"i":"9","node": {'nodeName':'input'}},
  	    {"x":8,"y":2,"w":2,"h":1,"i":"10","node": {'nodeName':'input'}},
  	    {"x":10,"y":2,"w":2,"h":1,"i":"11","node": {'nodeName':'input'}},
  	    {"x":0,"y":10,"w":2,"h":1,"i":"12","node": {'nodeName':'input'}},
  	    {"x":2,"y":10,"w":2,"h":1,"i":"13","node": {'nodeName':'input'}},
  	    {"x":4,"y":8,"w":2,"h":1,"i":"14","node": {'nodeName':'input'}},
  	    {"x":6,"y":8,"w":2,"h":1,"i":"15","node": {'nodeName':'input'}},
  	    {"x":8,"y":10,"w":2,"h":1,"i":"16","node": {'nodeName':'input'}},
  	    {"x":10,"y":4,"w":2,"h":1,"i":"17","node": {'nodeName':'input'}},
  	    {"x":0,"y":9,"w":2,"h":1,"i":"18","node": {'nodeName':'input'}},
  	    {"x":2,"y":6,"w":2,"h":1,"i":"19","node": {'nodeName':'input'}}
  	];
    import FormItemElement from './FormItemElement.vue';
 export default {
   components: {
             GridLayout: VueGridLayout.GridLayout,
             GridItem: VueGridLayout.GridItem,
             'v-elemnt-item': FormItemElement,
         },
  name: 'draggabletest',
  data () {
   return {
    layout: testLayout,
    form:null
  }
 }
 }
</script>
