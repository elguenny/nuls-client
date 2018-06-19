<template>
  <div class="node-info">
    <Back :backTitle="this.$t('message.consensusManagement')"></Back>
    <h2>{{this.myNodeInfo.agentId}}</h2>
    <ul>
      <li>
        <label>{{$t('message.c16')}}</label><span>{{ this.myNodeInfo.agentName ? this.myNodeInfo.agentName : this.myNodeInfo.agentAddress}}</span>
      </li>
      <li>
        <label>{{$t('message.state')}}</label><span> {{ $t('message.status'+this.myNodeInfo.status) }}</span>
      </li>
      <!-- <li>
           <label>{{$t('message.c7')}}</label><span>{{this.myNodeInfo.reward }} NULS</span>
       </li>-->
      <li>
        <label>{{$t('message.c25')}}</label><span>{{this.myNodeInfo.deposit}}</span>
      </li>
      <li>
        <label>{{$t('message.c17')}}</label><span>{{this.myNodeInfo.commissionRate}} %</span>
      </li>
      <li>
        <label>{{$t('message.c18')}}</label><span>{{this.myNodeInfo.creditVal}}</span>
      </li>
      <li>
        <label>{{$t('message.c19')}}</label><span>{{this.myNodeInfo.memberCount}}</span>
      </li>
      <li>
        <label>{{$t('message.c1')}}</label><span class="cursor-p text-d" @click="toallPledge">{{this.myNodeInfo.totalDeposit}}</span>
      </li>
      <!--<li>
          <label>{{$t('message.c27')}}</label><span class="overflow">{{this.myNodeInfo.introduction}}</span>
      </li>-->
    </ul>
    <el-button @click="closedNode" type="button" class="bottom-btn">{{$t('message.c62')}}</el-button>
    <Password ref="password" @toSubmit="toSubmit"></Password>
  </div>
</template>

<script>
  import Back from './../../components/BackBar.vue'
  import Password from '@/components/PasswordBar.vue'
  import {BigNumber} from 'bignumber.js'

  export default {
    data() {
      return {
        txHash: this.$route.params.txHash,
        myNodeInfo: [],
      }
    },
    components: {
      Back,
      Password,
    },
    mounted() {
      let _this = this;
      this.getMyNodeInfo('/consensus/agent/' + this.txHash)
    },
    methods: {
      //获取我创建的节点信息
      getMyNodeInfo(url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              //response.data.reward = parseFloat(leftShift.times(response.data.reward).toString())
              response.data.deposit = parseFloat(leftShift.times(response.data.deposit).toString());
              response.data.totalDeposit = parseFloat(leftShift.times(response.data.totalDeposit).toString());
              this.myNodeInfo = response.data
            }
          })
      },
      //关闭我创建的节点信息
      closedNode() {
        this.$confirm(this.$t('message.c98') + " " + this.myNodeInfo.agentId + " " + this.$t('message.c99') + this.$t('message.miningFee'), this.$t('message.c86'), {
          confirmButtonText: this.$t('message.confirmButtonText'),
          cancelButtonText: this.$t('message.cancelButtonText'),
        }).then(() => {
          if (localStorage.getItem('encrypted') === "true") {
            this.$refs.password.showPassword(true)
          } else {
            this.toSubmit('')
          }
        }).catch(() => {
          this.$message({
            type: 'waring',
            message: this.$t('message.c59'),
            duration: '1000'
          })
        })

      },
      //
      toSubmit(password) {
        let param = {'address': localStorage.getItem('newAccountAddress'), 'password': password}
        this.$post('/consensus/agent/stop', param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$message({
                type: 'success',
                message: this.$t('message.passWordSuccess')
              });
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
      toallPledge() {
        this.$router.push({
          name: '/allPledge',
          params: {'agentName': this.myNodeInfo.agentId, 'txHash': this.myNodeInfo.txHash}
        })
      }
    }
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .node-info {
    width: 1024px;
    margin: auto;
    text-align: center;
    h2 {
      font-size: 16px;
      text-align: center;
      line-height: 20px;
      margin-bottom: 5px;
      font-weight: bold;
    }
    ul {
      width: 100%;
      height: 100%;
      margin: 18px auto 20px;
      font-size: 12px;
      li {
        text-align: left;
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
