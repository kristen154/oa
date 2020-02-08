<template>
  <div>
    <div class="move" :style="moveStyle"   @dblclick="editNode">{{node.title}}</div>
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
        stateItemStyle: null,
        moveStyle: null,
        stateItemSubStyle: null,
      }
    },
    mounted(){
      let node = this.node;
      this.moveStyle = {height: (node.height - 10) + 'px', width: (node.width - 10) +'px', top: '5px', left:'5px', background:'red'}
      this.stateItemSubStyle = {height: node.height, width: node.width};
      console.log(this.stateItemStyle)
    },
    methods:{
      editNode(){
        this.$emit('editNode', this.node.id)
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
</style>
