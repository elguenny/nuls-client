<template>
	<!--select-->
	<div class="base-select fl" @click="showDataList" v-bind:style="{width: widthData}">
		<div class="sub-selected-value">
			<img :src="selectedValue.value"  class="language-img">
			<ul v-bind:style="{width: widthData}" v-if="showData">
				<li v-for="(item, index) in dataList" @click.stop="select(item, index)">
					<img :src="item.value" class="language-img">
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				showData: false
			}
		},
		props: {
			dataList: Array,
			selectedValue: Object, 
			widthData: {
				type: String,
				default: "160px"
			}
		},
		methods: {
			showDataList() {
				this.showData = !this.showData
			},
			select(item, index) {
				this.showData = false;
				//赋值的时候要分开写
				this.selectedValue.key = item.key;
				this.selectedValue.value = item.value;
				this.$emit('select');
			},
		},
		mounted() {}
	}
</script>
<style lang="less">
	.base-select {
		position: relative;
		top: 0px;
		height: 1.25rem;
		width: 2rem;
		.sub-selected-value {
			position: absolute;
			top: -0.35rem;
			width: 2rem;
			text-align: center;
			ul {
				position: absolute;
				top: 2.15rem;
				width: 3rem;
				z-index: 9;
				li {
					width: auto;
					min-width: 2rem;
					height: 1.5rem;
					position: relative;
					text-align: center;
					border-radius: 0.2rem;
					.language-img{
    					margin-top: 0.25rem;
					}
				}
				:hover{
					background-color: #17202e;
					
				}
			}
			.language-img{
				width: 1.5rem;
    			margin-top: 0.95rem;
			}
		}
	}
</style>
