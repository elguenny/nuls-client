<template>
	<div class="import-key">
		<h2>明文私钥导入</h2>
		<el-form ref="keyData" :model="keyData" label-position="top">
			<el-form-item label="请输入明文私钥:">
				<el-input type="textarea" v-model="keyData.keyInfo"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="keySubmit">确定</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
  export default {
    data() {
      return {
        keyData: {
          keyInfo: ''
        }
      }
    },
    methods: {
      keySubmit() {
        console.log('明文提交');
      }
    }
  }
</script>

<style lang="less">
	.import-key{
		 width: 90%;
		 margin: auto;
		h2{
			text-align: center;
			line-height: 3rem;
		}
		form{
			width: 60%;
			margin: auto;
		}
		.el-textarea__inner {
					background-color: #17202e;
				}
		.el-form-item__content {
				text-align: center;
				button {
					width: 30%;
				}
			}
	}
</style>