<template>
  <div>
  <div v-for="item in nodeList">
    <draggable  @end="addNode" @choose="move"><el-button :class="item.type" :id="item.id">{{item.title}}</el-button></draggable>
  </div>
 </div>
</template>

<script>
  import draggable from 'vuedraggable'

  var mousePosition = {
      left: -1,
      top: -1
  }
  export default {
    name:"LeftMenu",
    components: {
      draggable
    },
    data(){
      return {
        nodeList:
        {
          '1':{
            id:'1',
            title: '开始',
            type: 'start'
          },
          '2':{
            id:'2',
            title: '一般',
            type: 'default'
          },
          '3':{
            id:'3',
            title: '计算',
            type: 'calculate'
          },
          '4':{
            id:'4',
            title: '结束',
            type: 'end'
          },
        },
        nodeMenu:null,
      }
    },

    created(){
      /**
       * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
       * @param event
       */
      if (this.isFirefox()) {
          document.body.ondrop = function (event) {
              // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
              mousePosition.left = event.layerX
              mousePosition.top = event.clientY - 50
              event.preventDefault();
              event.stopPropagation();
          }
      }
    },
    methods:{
      // 拖拽开始时触发
      move(evt) {
        console.log(evt)
          var type = evt.item.id
          this.nodeMenu = this.nodeList[type]
      },
      // 拖拽结束时触发
      addNode(evt, e) {
          this.$emit('addNode', evt, this.nodeMenu, mousePosition)
      },

      // 是否是火狐浏览器
      isFirefox() {
          var userAgent = navigator.userAgent
          if (userAgent.indexOf("Firefox") > -1) {
              return true
          }
          return false
      }
    }


  }
</script>

<style scoped="scoped">
  .start, .calculate, .end{
    color: #fff;
  }
  .start{
    background:#e6a23c
  }
  .default{
    background: white;
  }
  .calculate{
    background:#409eff;
  }
  .end{
    background: #f56c6c;
  }
</style>
