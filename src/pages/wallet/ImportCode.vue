<template>
    <div class="import-code">
        <Back :backTitle="this.$t('message.inportAccount')"></Back>
        <h2>{{$t("message.code")}}</h2>
        <p>{{$t('message.keyLow')}}</p>
        <el-form >
            <el-upload class="avatar-uploader"
                       action=""
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-form-item>
                <el-button type="primary" @click="codeSubmit">{{$t('message.confirmButtonText')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
    import {qrcode} from './../../assets/js/qrcode.js';
    export default {
        data() {
            return {
                imageUrl: '',
                imagesPash:'',
            };
        },
        components: {
            Back,
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
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
                console.log(this.imageUrl);
                qrcode.decode(this.imageUrl);
                qrcode.callback = function(imgMsg){
                    fn(imgMsg,url);
                }
                //console.log(this.qrcode.decode(this.imagesPash));
            },
            codeSubmit(){
                alert("开发中.....");
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
        p{
            text-align: center;
            font-size: 12px;
            color: #C1C5C9;
            line-height: 30px;
        }
        form {
            width: 60%;
            margin: auto;
            text-align: center;
            .el-form-item {
                margin-bottom: 22px;
                margin-top: 30px;
            }
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
