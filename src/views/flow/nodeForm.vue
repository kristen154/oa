<template>
    <div :visible.sync="visible">
      <el-tag>{{node.node_name}}</el-tag>
      <el-form label-position="top" :model="node" ref="dataForm" label-width="10px">
          <el-form-item label="名称">
              <el-input v-model="node.node_name"></el-input>
          </el-form-item>
          <el-form-item label="坐标X">
              <el-input @keyup.native="repaint"  v-model="node.x"></el-input>
          </el-form-item>
          <el-form-item label="坐标Y">
              <el-input @keyup.native="repaint" v-model="node.y" ></el-input>
          </el-form-item>
          <el-form-item label="节点初始化脚本">
              <el-input type="textarea" :autosize="autosize" v-model="node.scripts_init" ></el-input>
          </el-form-item>
          <el-form-item label="节点运行时脚本">
              <el-input type="textarea" :autosize="autosize" v-model="node.scripts_run" ></el-input>
          </el-form-item>
          <el-form-item label="节点完成后脚本">
              <el-input type="textarea" :autosize="autosize" v-model="node.scripts_after" ></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
          <el-button type="primary" icon="el-icon-check" @click="visible = false">确定</el-button>
      </span>
    </div>
</template>

<script>
  import _ from 'lodash'
    export default {
        data() {
            return {
                visible: false,
                node: {},
                autosize: { minRows: 3, maxRows: 5}
            }
        },
        methods: {
            /**
             * 表单修改，这里可以根据传入的ID进行业务信息获取
             * @param data
             * @param id
             */
            init(data, id) {
                this.visible = true
                console.log(data,id)
                this.node = data[id]
            },
            repaint: _.debounce(function () {
              this.$emit('repaint')
            }, 100),
        }
    }
</script>
