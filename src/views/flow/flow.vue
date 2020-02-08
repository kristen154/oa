<template>
  <div class="app-container">
  <el-row>
    <el-col :span="4" ref="nodeMenu"><left-menu @addNode="addNode"></left-menu></el-col>
    <el-col :span="16">
      <div id="wrapper">
          <div v-for="item in itemObjs" class="state-item" :class="item.classes" :key="item.id" :style="{height:item.height+'px',width:item.width+'px', top: item.top +'px', left: item.left+'px'}" :id="item.id">
            <flow-node :node="item" @editNode="editNode"></flow-node>
           <!--<div class="move"   @dblclick="editNode">{{item.title}}</div>
           <div :id="item.id+'-sub'" :ref="item.id+'-sub'"  class="state-item-sub"></div>-->
          </div>
      </div>
    </el-col>
    <el-col :span="4">
      <ul>
            <li v-for="item in relations" @dblclick="editNode">{{item.from}}----> {{item.to}}</li>
       </ul>
    </el-col>
  </el-row>
  </div>
</template>

<script>
  import leftMenu from "./LeftMenu"
  import {jsPlumb} from 'jsplumb'
  import draggable from 'vuedraggable'
  import flowNode from './node'
  export default {
    components: {
      draggable,
      leftMenu,
       flowNode,
    },
    data () {
      //
      let itemObjs = {
		  "item-4": {id: 'item-4', title: 'item-4', classes: "normal-item", width: "80", height: "40", top: '150', left: '150'},
		  "item-1": {id: 'item-1', title: 'item-1', classes: "normal-item", width: "80", height: "40", top: '150', left: '250'},
		  "item-5": {id: 'item-5', title: 'item-5', classes: "normal-item", width: "80", height: "40", top: '150', left: '450'},
		  "item-2": {id: 'item-2', title: 'item-2', classes: "normal-item", width: "80", height: "40", top: '350', left: '150'},
		  "item-6": {id: 'item-6', title: 'item-6', classes: "normal-item", width: "80", height: "40", top: '350', left: '350'},
		  "item-3": {id: 'item-3', title: 'item-3', classes: "normal-item", width: "80", height: "40", top: '350', left: '650'},
		  "item-7": {id: 'item-7', title: 'item-7', classes: "normal-item", width: "80", height: "40", top: '550', left: '150'},
		  "item-8": {id: 'item-8', title: 'item-8', classes: "normal-item", width: "80", height: "40", top: '650', left: '350'},
		  "item-9": {id: 'item-9', title: 'item-9', classes: "normal-item", width: "80", height: "40", top: '550', left: '650'},
		};

	  let relations = [
		  {from:'item-4',to:'item-1'},
		  {from:'item-5',to:'item-3'},
		  {from:'item-6',to:'item-7'},
		  {from:'item-8',to:'item-6'},
		  {from:'item-9',to:'item-5'},
	  ]
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
        itemObjs,
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
            if(this.hasLine(from, to) != -1){
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
              this.relations.push(this.initNewRelation(from, to))
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
           this.jsPlumb.bind('dblclick', (conn, originalEvent) => {
              this.$message.error("你双击了连接线"+conn.sourceId+"----->"+conn.targetId)
          })


        })
        this.$nextTick(function () {
          console.log(this.jsPlumb.Defaults)
          this.loadEasyFlowFinish = true
        })
      },

      //加载原始数据
      loadEasyFlow() {
        for (let key in this.itemObjs){
          let item = this.itemObjs[key];
          this.jsPlumb.makeSource(item.id,this.jsplumbSourceOptions)
          this.jsPlumb.makeTarget(item.id,this.jsplumbSourceOptions)
          var _this = this
          this.jsPlumb.draggable(item.id, {
            containment: 'wrapper',
            //拖拽结束时更新数据
            stop:function (event) {
                _this.dragStop(event)
            }
          })
        }


        // 初始化连线
        this.relations.forEach((item) => {
          this.jsPlumb.connect({
            source: item.from,
            target: item.to,
          })
        })


      },
      /**
       * @param {Object} sourceId 来源元素
       * @param {Object} to targetId元素
       */
      hasLine(sourceId, targetId) {
        let lineIndex = -1;
        for(let i = 0, len = this.relations.length; i<len; i++){
          let relationItem = this.relations[i]
          if(relationItem.from == sourceId && relationItem.to == targetId){
            lineIndex = i
            //this.relations.splice(i, 1);//删除改元素
            break;
          }
        }
        return lineIndex;
      },



      // 删除连接线
      deleteLine(sourceId, targetId){
        let lineIndex = this.hasLine(sourceId, targetId);
        if(lineIndex == -1){
          return false;
        }
        this.relations.splice(lineIndex, 1);//删除改元素

      },
      /**
       * 拖拽结束后添加新的节点
       * @param evt
       * @param nodeMenu 被添加的节点对象
       * @param mousePosition 鼠标拖拽结束的坐标
       */
      addNode(evt, nodeMenu, mousePosition){
        let width = this.$refs.nodeMenu.$el.clientWidth
        let nodeId = this.getUUID(), left = mousePosition.left, top = mousePosition.top
        if (left < 0) {
            //left = evt.originalEvent.layerX - width
            left = evt.originalEvent.layerX - width - 40
        }
        if (top < 0) {
            //top = evt.originalEvent.clientY - 50
            top = evt.originalEvent.clientY - 142
        }


        let nodeHeight = evt.item.clientHeight
        let nodeWidth = evt.item.clientWidth
        let classes = evt.item.className
        //console.log(evt.originalEvent.layerX,evt.originalEvent.clientY)
        //"item-6": {from: 'item-6',title:'item-6', to:['item-3'],position:{top: '350px', left: '350px'}}
        var node = {
            id: nodeId,
            title: nodeId,
            top:top,
            left: left,
            classes: classes,
            height:nodeHeight,
            width: nodeWidth,
        }
        /**
         * 这里可以进行业务判断、是否能够添加该节点
         */

        this.$set(this.itemObjs, nodeId, node)
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

      editNode(nodeId){
        console.log(nodeId)
        this.$message("你双击了元素"+nodeId)
      },
      //拖拽结束时触发, 重新设置position
      dragStop(event){
        console.log("dd")
        let dragNodeId = event.selection[0][0].id;
        let dragNode = this.itemObjs[dragNodeId]
        console.log(dragNode.top,dragNode.left)
        console.log(event.selection[0][1].top,event.selection[0][1].left)
        dragNode.top = event.selection[0][1].top;
        dragNode.left = event.selection[0][1].left;
      },
      initNewRelation(sourceId, targetId){
        return {from: sourceId, to: targetId};
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
    background:radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    position: relative;
    height: calc(100vh - 124px);
    width: 100%;
  }
  .state-item {
      position:absolute;
 /*     width: 80px;
      height: 40px;
      color: #606266;
      background: #f6f6f6;
      border: 2px solid rgba(0, 0, 0, 0.05);
      text-align: center;
      line-height: 40px;
      font-family: sans-serif;
      border-radius: 4px;
      margin-right: 60px; */

      -webkit-transition: none;
      transition: none;
    }

 /*   .state-item-sub{
      position:absolute;
      top:0px;
      left:0px;
      height: 40px;
      width:40px;
      background:red;
    } */
  .line-wrap {
    display: flex;
    margin-bottom: 40px;
  }
  .normal-item{
    display: inline-block;
        line-height: 1;
        white-space: nowrap;
        background: #fff;
        border: 1px solid #DCDFE6;
        border-color: #DCDFE6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        font-weight: 400;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
  }
</style>
