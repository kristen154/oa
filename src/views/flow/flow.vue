<template>
  <el-row>
    <el-col :span="4" ref="nodeMenu"><left-menu @addNode="addNode"></left-menu></el-col>
    <el-col :span="20">


      <div id="wrapper">
          <div v-for="item in relations"  class="state-item"  :style="item.position" :id="item.from">
            <div class="move">{{item.title}}</div>
            <div :id="item.from+'-sub'" :ref="item.from+'-sub'" class="state-item-sub"></div>
          </div>
      </div>
     <!-- <ul>
           <li v-for="item in relations">{{item.from}}----position***({{item.position.top}},{{item.position.left}})------to***<span v-for="i in item.to">{{i}},</span></li>
        </ul> -->
    </el-col>
  </el-row>
</template>

<script>
  import leftMenu from "./LeftMenu"
  import {jsPlumb} from 'jsplumb'
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable,
      leftMenu,

    },
    data () {
      let relations = {
              "item-4": {from: 'item-4',title:'item-4', to:['item-1'],position:{top: '150px', left: '150px'}},
              "item-1": {from: 'item-1',title:'item-1', to:['item-5'],position:{top: '150px', left: '250px'}},
              "item-5": {from: 'item-5',title:'item-5', to:['item-2'],position:{top: '150px', left: '450px'}},
              "item-2": {from: 'item-2',title:'item-2', to:['item-6'],position:{top: '350px', left: '150px'}},
              "item-6": {from: 'item-6',title:'item-6', to:['item-3'],position:{top: '350px', left: '350px'}},
              "item-3": {from: 'item-3',title:'item-3', to: [],position:{top: '350px', left: '650px'}},
              "item-7": {from: 'item-7',title:'item-7', to: [],position:{top: '550px', left: '150px'}},
              "item-8": {from: 'item-8',title:'item-8', to: [],position:{top: '650px', left: '350px'}},
              "item-9": {from: 'item-9',title:'item-9', to: [],position:{top: '550px', left: '650px'}},
            };
      let defaultConfig = {
        // 对应上述基本概念
        Anchor: 'Continuous',
        /* Anchors : [ null, null ], */
        Connector: ['StateMachine'],
        Endpoint:'Dot',
        EndpointStyle: {fill: 'lightgray', stroke: 'lightgray', radius: 4, strokeWidth: 1},
        //端点hover时的样式
        EndpointHoverStyle: {fill: '#1565C0', stroke: '#1565C0', radius: 4, strokeWidth: 1},
        // 添加 overlay，如箭头
        Overlays: [ ['Arrow', { width: 8, length: 8, location: 1 }] ] ,// overlay
        DragOptions: {cursor: 'pointer', zIndex: 2000},
        DropOptions: {}, //target Endpoint放置时的默认参数设置
        //连线的叠加组件，如箭头、标签
        ConnectionOverlays: [
          ["Arrow", {
              location: 1,
              visible: true,
              width: 8,
              length: 8,
              id: "ARROW",
              events: {
                  click: function () {
                  }
              }
          }]],
          // 添加样式
        PaintStyle: { stroke: '#909399', strokeWidth: 2 }, // connector
         //连线hover时的样式
        HoverPaintStyle: {stroke: '#1565C0', strokeWidth: 3},
      };
      return {
        relations : relations,
        jsPlumb : null,
        defaultConfig,
        jsplumbSourceOptions: {
           filter: ".state-item-sub"
        },
      }
    },
    mounted () {
      this.jsPlumb = jsPlumb.getInstance()
      this.jsPlumbInit();
    },
    methods : {
      jsPlumbInit(){
        const _this = this
        this.jsPlumb.ready(()=>{
          //导入默认配置
          this.jsPlumb.importDefaults(this.defaultConfig);
          //会使整个jsPlumb立即重会
          this.jsPlumb.setSuspendDrawing(false, true);
          //初始化流程图
          this.loadEasyFlow()

          //绑定一些东西
          // 连线前判断是否连自己
          this.jsPlumb.bind('beforeDrop', (evt) => {
            let from = evt.sourceId, to = evt.targetId
            if(from == to){
              this.$message.error('不能连自己')
              return false;
            }
            if(this.hasLine(from, to)){
              this.$message.error('不能连重复线')
              return false;
            }
            return true;
          })

          // 连接线时 新增关系
          this.jsPlumb.bind('connection', (evt) => {
            let from = evt.source.id
            let to = evt.target.id
            if(this.loadEasyFlowFinish){
              this.relations[from].to.push(to);
            }
          })


          // 改变线的连接节点
          this.jsPlumb.bind('connectionMoved', (evt)=>{
            this.deleteLine(evt.originalSourceId,evt.originalTargetId)
          })

          // 删除线
          this.jsPlumb.bind("connectionDetached", (evt) => {
             this.deleteLine(evt.sourceId,evt.targetId)
          })

          // 单点击了连接线,
          /* this.jsPlumb.bind('click', (conn, originalEvent) => {
              let _conn = conn
              this.$confirm('确定删除所点击的线吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  this.deleteLine(_conn.source.id,_conn.target.id)
                  this.jsPlumb.deleteConnection(conn)
                  console.log(this.relations)
              }).catch(() => {
              })
          }) */


        })
        this.$nextTick(function () {
          console.log(this.jsPlumb.Defaults)
          this.loadEasyFlowFinish = true
        })
      },

      //加载原始数据
      loadEasyFlow() {
        let anchors = ['Right', 'Top', 'Bottom','Left' ];

        for (let key in this.relations){
          let item = this.relations[key];
          this.jsPlumb.makeSource(item.from,this.jsplumbSourceOptions)
          this.jsPlumb.makeTarget(item.from,this.jsplumbSourceOptions)
          var _this = this
          this.jsPlumb.draggable(item.from, {
            containment: 'wrapper',
            //拖拽结束时更新数据
            stop:function (event) {
                _this.dragStop(event)
            }
          })

          // 初始化连线
          if(item.hasOwnProperty('to') && item.to.length != 0){
            item.to.forEach((itemTo)=>{
              this.jsPlumb.connect({
              source: item.from,
              target: itemTo,
            })
          })

          }
        }

      },
      /**
       * @param {Object} from 来源元素
       * @param {Object} to target元素
       */
      hasLine(from, to) {
          let toArr = this.relations[from].to;
          //判断是否存在与to
          if(toArr.includes(to)){
            return true
          }
          return false
      },

      //拖拽结束时触发
      dragStop(event){
        let dragNodeId = event.selection[0][0].id;
        let dragNode = this.relations[dragNodeId]
        dragNode.position.top = event.selection[0][1].top+"px";
        dragNode.position.left = event.selection[0][1].left+"px";
      },
      // 删除连接线
      deleteLine(sourceId,targetId){
        let fromObj = this.relations[sourceId]
        let toArr = fromObj.to;
        if(toArr.includes(targetId)){
          toArr.splice(toArr.indexOf(targetId),1)
        }
      },
      /**
       * 拖拽结束后添加新的节点
       * @param evt
       * @param nodeMenu 被添加的节点对象
       * @param mousePosition 鼠标拖拽结束的坐标
       */
      addNode(evt, nodeMenu, mousePosition){
        console.log(evt)
        let width = this.$refs.nodeMenu.$el.clientWidth
        let nodeId = this.getUUID(), left = mousePosition.left, top = mousePosition.top
        if (left < 0) {
            //left = evt.originalEvent.layerX - width
            left = evt.originalEvent.layerX - width - 40
        }
        if (top < 0) {
            //top = evt.originalEvent.clientY - 50
            top = evt.originalEvent.clientY - 20
        }


        console.log(evt.originalEvent.layerX,evt.originalEvent.clientY)
        //"item-6": {from: 'item-6',title:'item-6', to:['item-3'],position:{top: '350px', left: '350px'}}
        var node = {
            from: nodeId,
            title: nodeId,
            to:[],
            position:{top:top + 'px',left: left + 'px',}
        }
        /**
         * 这里可以进行业务判断、是否能够添加该节点
         */

        this.$set(this.relations, nodeId, node)
        var _this = this
        this.$nextTick(()=> {
            this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
            this.jsPlumb.makeTarget(nodeId, this.jsplumbSourceOptions)
            this.jsPlumb.draggable(nodeId, {
                containment: 'wrapper',
                stop:function(event){
                  _this.dragStop(event)
                }
            })
        })
      },
      initNode(){

      },
      getUUID() {
        return new Date().getTime().toString();
      },
    }
  }


</script>

<style scoped>
  #wrapper {
   box-sizing:border-box;
    background:

      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
      position: relative;
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }
  .state-item {
    position:absolute;
    width: 80px;
    height: 40px;
    color: #606266;
    background: #f6f6f6;
    border: 2px solid rgba(0, 0, 0, 0.05);
    text-align: center;
    line-height: 40px;
    font-family: sans-serif;
    border-radius: 4px;
    margin-right: 60px;
  }
  .move{
    position:absolute;
    cursor: move;
    z-index:10;
    top:7px;
    left: 10px;
    width:60px;
    height: 28px;
    line-height: 28px;
  }
  .state-item-sub{
    position:absolute;
    top:0px;
    left:0px;
    width: 80px;
    height: 40px;
  }
  .line-wrap {
    display: flex;
    margin-bottom: 40px;
  }
</style>
