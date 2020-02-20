<template>
  <div class="app-container">
  <el-row :gutter="20">
    <el-col :span="2" ref="nodeMenu"><left-menu @addNode="addNode"></left-menu></el-col>
    <el-col :span="16">
      <div id="wrapper">
          <div v-for="item in nodeObjs" class="state-item" :class="item.classes" :key="item.id" :style="{height:item.height+'px',width:item.width+'px', top: item.y +'px', left: item.x+'px'}" :id="item.id">
            <flow-node :node="item" @editNode="editNode" @deleteNode="deleteNode"></flow-node>
          </div>
      </div>
    </el-col>
    <el-col :span="6">
      <node-form v-if="nodeFormVisible" @repaint="repaint" ref="nodeForm"></node-form>
      <relation-form v-if="relationFormVisible" ref="relationForm"></relation-form>
      <!-- <ul>
        <li v-for="item in relations" @dblclick="editNode">{{item.from}} {{item.to}}</li>
      </ul>
      <ul>
        <li v-for="ob in nodeObjs">{{ob.id}}</li>
      </ul> -->
    </el-col>
  </el-row>

  </div>
</template>

<script>
  import leftMenu from "./LeftMenu"
  import {jsPlumb} from 'jsplumb'
  import draggable from 'vuedraggable'
  import flowNode from './node'
  import nodeForm from './nodeForm'
  import relationForm from './relationForm'
  import {fetchNodeList, fetchRelationList} from '@/api/flow'
  export default {
    components: {
      draggable,
      leftMenu,
      flowNode,
      nodeForm,
      relationForm
    },
    data () {
      const defaultConfig = {
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
        //连接关系
        relations: null,
        //节点对象
        nodeObjs: null,
        jsPlumb: null,
        defaultConfig,
        jsplumbSourceOptions: {
          //通过遮罩层解决makesource和draggle的冲突
           filter: ".state-item-sub"
        },
        // 控制表单显示与隐藏
        nodeFormVisible: true,
        relationFormVisible: false,
        //当前编辑的节点
        currentEditNode: '',
        //当前编辑的关系
        currentEditRelation: '',
        flowId: ''
      }
    },
    mounted () {
      this.getData().then(()=>{
        this.jsPlumb = jsPlumb.getInstance()
        this.jsPlumbInit();
      })
    },
    updated () {
      console.log('update')
      //this.jsPlumb.repaint();
    },
    methods : {
      //获取数据
      getData(){
        return new Promise((resolve,rej)=>{
          fetchNodeList().then(response => {
            this.nodeObjs = response.data
          }).then(_=>{
            fetchRelationList().then(response => {
              console.log(response)
              this.relations = response.data
              resolve()
            })
          })
        })
      },
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
          this.jsPlumb.bind('click', (conn, originalEvent) => {
             this.editRelation(conn.sourceId,conn.targetId)
          })


        })
        this.$nextTick(function () {
          this.loadEasyFlowFinish = true
          let firstNodeKey
          //取第一个属性
          for (var key in this.nodeObjs){
            firstNodeKey = key
            break
          }
          this.editNode(firstNodeKey)
        })
      },

      //加载原始数据
      loadEasyFlow() {
        for (let key in this.nodeObjs){
          let item = this.nodeObjs[key];
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
        let title = '';
        if(classes.includes('start')) {
          title = '开始'
        } else if(classes.includes('end')) {
          title = '结束'
        } else {
          title = nodeId
        }
        let node = {
            id: nodeId,
            node_name: title,
            y: top,
            x: left,
            classes: classes,
            height:nodeHeight,
            width: nodeWidth,
        }
        /**
         * 这里可以进行业务判断、是否能够添加该节点
         */

        this.$set(this.nodeObjs, nodeId, node)
        let _this = this
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


      //编辑节点
      editNode(nodeId){
        this.showRight('nodeForm')
        this.$nextTick(function () {
            this.$refs.nodeForm.init(this.nodeObjs, nodeId)
        })
      },

      //删除节点
      deleteNode(nodeId){
        this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
        }).then(() => {
            //删除连接线
          this.relations.forEach((item,index)=>{
            if(nodeId == item.from || nodeId == item.to){
              console.log(index)
              this.relations.splice(index,1);
            }
          })
          //删除对象
          delete this.nodeObjs[nodeId]
          this.$nextTick(function () {
              this.jsPlumb.removeAllEndpoints(nodeId);
          })
        })
        .catch(() => {})
        return false;

      },

      //编辑关系
      editRelation(sourceId, targetId){
        this.showRight('relationForm')
        this.$nextTick(() => {
          let lineIndex = this.hasLine(sourceId,targetId)
          this.$refs.relationForm.init(this.relations[lineIndex])
        })
      },


      //拖拽结束时触发, 重新设置position
      dragStop(event){
        let dragNodeId = event.selection[0][0].id;
        let dragNode = this.nodeObjs[dragNodeId]
        dragNode.y = event.selection[0][1].top;
        dragNode.x = event.selection[0][1].left;
      },

      /**
       * 获取关系index
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

      initNewRelation(sourceId, targetId){
        return {from: sourceId, to: targetId};
      },
      getUUID() {
        return new Date().getTime().toString();
      },

      showRight(nodeFormType) {
        if(nodeFormType == 'nodeForm'){
          if(this.nodeFormVisible == false){
            this.relationFormVisible = false
            this.nodeFormVisible = true
          }
        }else if(nodeFormType == 'relationForm'){
          if(this.relationFormVisible == false){
            this.nodeFormVisible = false
            this.relationFormVisible = true
          }
        }

      },

      //修改表单数据重绘
      repaint() {
        this.jsPlumb.repaintEverything();
      }
    }
  }


</script>

<style scoped>
  #wrapper {
    position: relative;
    width: 100%;
    height: calc(100vh - 124px);
    box-sizing:border-box;
    background:radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    );

    background: #fff;
    background-image:
    linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0),
    linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0);
    background-position: 0 0, 15px 15px;
    background-size: 30px 30px;

  }
  .state-item {
      position:absolute;
      /* 解决拖拽有延迟问题*/
      -webkit-transition: none;
      transition: none;
    }


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
