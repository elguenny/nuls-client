<template>
	<div class="edit-aliasing">
		<Back :backTitle="backTitle"></Back>
		<div class="edit-info">
			<h2>修改别名</h2>
			<el-form :model="aliasingData">
				<el-form-item label="账户地址:">
					<el-input type="text" disabled v-model="aliasingData.address"></el-input>
				</el-form-item>
				<el-form-item label="别名:" class="label-aliasing">
					<el-input v-model="aliasingData.aliasing" class="bt-aliasing"></el-input>
				</el-form-item>
				<el-form-item label="手续费:">
					<el-input type="text" disabled v-model="aliasingData.serviceNo"></el-input>
				</el-form-item>
				<el-form-item class="aliasing-submit">
					<el-button type="primary" @click="aliasingSubmit">确定</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
	export default {
		data() {
			return {
                backTitle:'账户管理',
				aliasingData: {
					address: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					aliasing: '',
					serviceNo: '0.01NULS'
				}
			}
		},
        components: {
            Back,
        },
		methods: {
			back() {
				this.$router.go(-1);
			},
			aliasingSubmit() {
				console.log('提交');
			}
		}
	}
</script>
<style lang="less">
	.edit-aliasing {
		width: 100%;
		margin: auto;
		.edit-info {
			width: 50%;
			margin: auto;
			h2 {
				text-align: center;
				line-height: 3rem;
			}
			.aliasing-submit {
				text-align: center;
				button {
					width: 30%;
				}
			}
			input[type="text"],
			input[type="password"],
			select {
				background: #0b1422;
			}
			.el-form-item__label {
				text-align: left;
			}
			.el-input__inner {
				border-color: #0b1422;
			}
			.bt-aliasing .el-input__inner {
				border-color: #17202e;
			}
		}
	}
	
	.edit-aliasing .edit-info .el-form-item__label {
		width: 80px;
	}
	
	.el-form-item__content{
		margin-left: 80px;	
	}
	.label-aliasing label {
		float: none;
	}
	.label-aliasing .el-form-item__content {
		margin-left: 0px;
	}
</style>