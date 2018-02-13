<template>
	<div class="import-nuls">
		<h2>NULS格式导入</h2>
		<el-form  >
			<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
			<el-form-item>
				<el-button type="primary" @click="nulsSubmit">确定</el-button>
			</el-form-item>
		</el-form>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogImageUrl: '',
				dialogVisible: false
			};
		},
		methods: {
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			nulsSubmit(){
				console.log('NULS导入')
			}
		}
	}
</script>

<style lang="less">
	.import-nuls {
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
		.el-textarea__inner {
			background-color: #17202e;
		}
		.el-form-item__content {
			text-align: center;
			margin-top: 3rem;
			button {
				width: 30%;
			}
		}
	}
</style>