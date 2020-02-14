<template>
    <div 
       :visible.sync="visible"
    >
        <div>关系{{relation.from}} --&gt;  {{relation.to}}属性</div>
        <el-form :model="relation" ref="dataForm" label-width="80px">
            <el-form-item label="源">
                <el-input v-model="relation.from"></el-input>
            </el-form-item>
            <el-form-item label="目标">
                <el-input v-model="relation.to"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="visible = false">确定</el-button>
        </span>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                relation: {}
            }
        },
        methods: {
            /**
             * 表单修改，这里可以根据传入的ID进行业务信息获取
             * @param data
             * @param id
             */
            init(data) {
                this.visible = true
                this.relation = data
            }
        }
    }
</script>
