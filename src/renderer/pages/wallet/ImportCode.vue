<template>
    <div class="import-code">
        <h2>二维码导入</h2>
        <el-form >
            <el-upload class="avatar-uploader"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-form-item>
                <el-button type="primary" @click="codeSubmit">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {qrcode} from '@/assets/js/qrcode.js';
    export default {
        data() {
            return {
                imageUrl: '',
                imagesPash:'',
            };
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(file.raw.path);
                this.imagesPash = file.raw.path;
                this.getUrl();
            },
            beforeAvatarUpload(file) {
                const isPNG = file.type === 'image/png';
                const isJPG = file.type === 'image/jpg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是PNG或 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return (isJPG || isPNG) && isLt2M;
            },
            //识别二维码
            getUrl(){
                //console.log(this.imagesPash);
                console.log(this.qrcode.decode(this.imagesPash));
            },
            codeSubmit(){
                alert("开发中.....")
                console.log("codeSubmit");
            }
        }
    }
</script>

<style lang="less">
    .import-code {
        width: 90%;
        margin: auto;
        h2 {
            text-align: center;
            line-height: 3rem;
        }
        form {
            width: 60%;
            margin: auto;
            text-align: center;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>