<template>
    <div class="node-info">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{this.myNodeInfo.agentName}}</h2>
        <ul>
            <li>
                <label>{{$t('message.c16')}}</label><span>{{this.myNodeInfo.agentAddress}}</span>
            </li>
            <li>
                <label>{{$t('message.state')}}</label><span> {{ $t('message.status'+this.myNodeInfo.status) }}</span>
            </li>
            <li>
                <label>{{$t('message.c7')}}</label><span>{{this.myNodeInfo.reward }} NULS</span>
            </li>
            <li>
                <label>{{$t('message.c25')}}</label><span>{{this.myNodeInfo.owndeposit}}</span>
            </li>
            <li>
                <label>{{$t('message.c17')}}</label><span>{{this.myNodeInfo.commissionRate}} %</span>
            </li>
            <li>
                <label>{{$t('message.c18')}}</label><span>{{this.myNodeInfo.creditRatio}}</span>
            </li>
            <li>
                <label>{{$t('message.c19')}}</label><span>{{this.myNodeInfo.memberCount}}</span>
            </li>
            <li>
                <label>{{$t('message.c1')}}</label><span class="cursor-p text-d" @click="toallPledge">{{this.myNodeInfo.totalDeposit}}</span>
            </li>
            <li>
                <label>{{$t('message.c27')}}</label><span class="overflow">{{this.myNodeInfo.introduction}}！</span>
            </li>
        </ul>
        <el-button @click="closedNode" type="button" class="bottom-btn">{{$t('message.c62')}}</el-button>
        <Password ref="password" @toSubmit="toSubmit"></Password>
    </div>
</template>

<script>
  import Back from './../../components/BackBar.vue'
  import Password from '@/components/PasswordBar.vue'
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
      return {
        myNodeInfo: [],
      }
    },
    components: {
      Back,
      Password,
    },
    mounted () {
      let _this = this
      this.getMyNodeInfo('/consensus/agent/' + localStorage.getItem('newAccountAddress'))
    },
    methods: {
      //获取我创建的节点信息
      getMyNodeInfo (url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001)
              response.data.reward = parseFloat(leftShift.times(response.data.reward).toString())
              response.data.owndeposit = parseFloat(leftShift.times(response.data.owndeposit).toString())
              response.data.totalDeposit = parseFloat(leftShift.times(response.data.totalDeposit).toString())
              this.myNodeInfo = response.data
            }
          })
      },
      //关闭我创建的节点信息
      closedNode () {
        this.$confirm(this.$t('message.c98')+" " + this.myNodeInfo.agentName + " " + this.$t('message.c99') + this.$t('message.miningFee'), this.$t('message.c86'), {
          confirmButtonText: this.$t('message.confirmButtonText'),
          cancelButtonText: this.$t('message.cancelButtonText'),
        }).then(() => {
          this.$refs.password.showPassword(true)
        }).catch(() => {
          this.$message({
            type: 'waring',
            message: this.$t('message.c59'),
            duration: '1000'
          })
        })

      },
      //
      toSubmit (password) {
        let param = {'address': localStorage.getItem('newAccountAddress'), 'password': password}
        this.$post('/consensus/agent/stop', param)
          .then((response) => {
            if (response.success) {
              this.$message({
                type: 'success',
                message: this.$t('message.passWordSuccess')
              })
              this.$router.push({
                name: '/consensus',
                params: {'activeName': 'first'}
              })
            } else {
              this.$message({
                type: 'waring',
                message: this.$t('message.passWordFailed') + response.msg
              })
            }
          })
      },
      //查看我创建节点的抵押明细
      toallPledge () {
        this.$router.push({
          name: '/allPledge',
          params: {'agentName': this.myNodeInfo.agentName}
        })
      }
    }
  }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .node-info {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 5px;
        }
        ul {
            width: 80%;
            height: 100%;
            margin: 18px auto 0;
            font-size: 12px;
            li {
                color: #c1c5c9;
                line-height: 34px;
                border-bottom: 1px solid #1c2738;
                label {
                    display: block;
                    width: 18%;
                    float: left;
                    padding-left: 3%;
                }
                span {
                }
            }
        }
    }

    .el-message--waring {
        p.el-message__content {
            color: #909399;
        }
    }
</style>