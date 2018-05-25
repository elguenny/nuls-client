<template>
	<div class="import-account">
		<Back :backTitle="this.$t('message.firstInfoTitle')"></Back>
		<h1>{{$t("message.inportAccount")}}</h1>
		<ul>
			<li @click="importKey">
				<span>{{$t("message.key")}}</span>
			</li>
			<!--<li @click="importCode">
				<span>{{$t("message.code")}}</span>
			</li>-->
			<li @click="importNuls" v-show="false">
				<span>{{$t("message.c146")}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
  import Back from '@/components/BackBar.vue';
  export default {
    data() {
      return {
      }
    },
    components: {
      Back,
    },
    methods: {
      importKey() {
        this.$router.push({
          path: '/firstInto/firstInfo/importKey'
        })
      },
      /*importCode() {
          this.$router.push({
              path: '/firstInto/firstInfo/importCode'
          })
      },*/
      importNuls() {
        this.$router.push({
          path: '/firstInto/firstInfo/importNuls'
        })
      }
    }
  }
</script>

<style lang="less">
	.import-account {
		width: 100%;
		height: 100%;
		margin:auto;
		text-align: center;
		font-size: 0.9rem;
		line-height: 1.6rem;
		h1 {
			line-height: 3rem;
			font-size: 16px;
			font-weight: 500;
		}
		ul {
			width: 650px;
			height: 182px;
			margin: 50px auto;
			li {
				width: 185px;
				height: 11rem;
				float: left;
				margin-right: 40px;
				margin-left: 235px;
				border: 1px solid #1e314d;
				background-color: #181f2f;
				text-align: center;
				cursor: pointer;
				span {
					display: block;
					font-size: 16px;
					line-height: 170px;
				}
				label {
					display: block;
					font-size: 0.8rem;
					padding: 0 1.5rem;
					text-align: center;
				}
			}
			li:hover{
				cursor: pointer;
				border-color: #658ec7;
			}
			li:last-child {}
		}
	}
</style>