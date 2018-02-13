<template>
    <div id="password" class="password">
        <!--<el-button type="text" @click="dialogFormVisible = true">打开密码输入框</el-button>-->
        <el-dialog title="请输入钱包密码" :visible.sync="dialogFormVisible" center>
            <el-form :model="form">
                <el-form-item :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.passwords" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确认提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogFormVisible: true,
                form: {
                    passwords: '',
                    region: '',
                    type: []
                },
                formLabelWidth: ''
            };
        }
    };
</script>

<style>
    .password {
        margin-top: 5rem;
    }
</style>