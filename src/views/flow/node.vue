<template>
  <div
    @mouseenter="mouseEnter=true"
    @mouseleave="mouseEnter=false">
    <div class="close" v-show="mouseEnter" @click="deleteNode"><i class="el-icon-error"></i></div>
    <div class="move" :style="moveStyle" @click="editNode">{{node.node_name}}</div>
    <div :id="node.id+'-sub'" :ref="node.id+'-sub'" :style="stateItemSubStyle" class="state-item-sub"></div>
  </div>
</template>

<script>
  export default {
    props: {
        node: Object
    },
    data(){
      return{
        mouseEnter: false,
        stateItemStyle: null,
        moveStyle: null,
        stateItemSubStyle: null,
      }
    },
    mounted(){
      let node = this.node;
      this.moveStyle = {height: (node.height - 20) + 'px', width: (node.width - 20) +'px', top: '10px', left:'10px',lineHeight:(node.height - 20) + 'px'}
      this.stateItemSubStyle = {height: node.height + 'px', width: node.width + 'px'};
    },
    methods:{
      editNode(){
        this.$emit('editNode', this.node.id)
      },
      deleteNode(){
        this.$emit('deleteNode',this.node.id)
      }
    }
  }
</script>

<style scoped>

  .state-item-sub{
    position:absolute;
    top:0px;
    left:0px;
  }
  .move{
    position:absolute;
    cursor: move;
    z-index:10;
    line-height: 28px;
  }
  .close{
    position: absolute;
    cursor: pointer;
    color: red;
    right: -10px;
    top: -10px;
    font-size: 20px;
  }
</style>
