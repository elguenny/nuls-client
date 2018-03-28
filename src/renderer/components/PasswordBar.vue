<template>
    <div class="password">
        <el-dialog title="请输入钱包密码" :visible.sync="passwordVisible" center>
            <el-form :model="form">
                <el-form-item :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.passwords" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="passwordVisible = false">取 消</el-button>
                <el-button type="primary" @click="passwordVisible = false">确认提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['passwordVisible'],
        data() {
            return {
                //passwordVisible: false,
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