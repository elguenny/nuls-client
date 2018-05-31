<template>
    <div class="my-node">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{this.agentAddressInfo.agentName}}</h2>
        <div class="div-icon1 node-page-top">
            <p class="subscript" :class="this.agentAddressInfo.status === 0  ? 'stay' : ''">
                {{ $t('message.status'+this.agentAddressInfo.status) }}
            </p>
            <ul>
                <li class="li-bg overflow">
                    <label>{{$t('message.c16')}}：</label>{{this.agentAddressInfo.agentAddresss}}
                    <span v-show="toCheckOk" @click="toCheck" class="cursor-p text-d">{{$t('message.c5_1')}}</span>
                </li>
                <li>
                    <label>{{$t('message.c17')}}：</label>{{this.agentAddressInfo.commissionRate}}%
                </li>
                <li>
                    <label>{{$t('message.c25')}}：</label>{{this.agentAddressInfo.deposit}}
                    NULS
                </li>
                <li>
                    <label>{{$t('message.c19')}}：</label>{{this.agentAddressInfo.memberCount}}
                </li>
                <li>
                    <label>{{$t('message.c18')}}：</label>
                    <ProgressBar
                            :colorData="this.agentAddressInfo.creditVals < 0 ? '#f64b3e':'#82bd39'"
                            :widthData="this.agentAddressInfo.creditVal"></ProgressBar>
                    <span>&nbsp;{{this.agentAddressInfo.creditVals}}</span>
                </li>
                <li>
                    <label>{{$t('message.c47')}}：</label>
                    <ProgressBar colorData="#58a5c9" :widthData="this.agentAddressInfo.totalDeposit"></ProgressBar>
                    <span>&nbsp;{{this.agentAddressInfo.totalDeposits}}</span>
                </li>
                <li class="li-info overflow">
                    <label>{{$t('message.c27')}}：</label>{{this.agentAddressInfo.introduction}}
                </li>
            </ul>
        </div>
        <div class="my-node-bottom">
            <div class="my-node-list">
                {{$t('message.c56')}}
                <span class="text-d cursor-p fr" @click="addNode">{{$t('message.c57')}}</span>
            </div>
            <el-table :data="myMortgageData">
                <el-table-column prop="deposit" :label="$t('message.c51')" min-width="100" align='center'>
                </el-table-column>
                <el-table-column :label="$t('message.state')" width="70" align='center'>
                    <template slot-scope="scope">
                        {{$t('message.status'+scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column prop="time" :label="$t('message.c49')" min-width="85" align='center'>
                </el-table-column>
                <el-table-column :label="$t('message.operation')" align='center'>
                    <template slot-scope="scope">
                        <el-button @click="outNode(scope.row)" type="text" size="small">{{$t('message.c58')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :page-size="3" :total=this.total
                           v-show="totalOK = this.total > 3 ? true:false" @current-change="myMortgageSize"
                           class="cb"></el-pagination>
        </div>
        <Password ref="password" @toSubmit="toSubmit"></Password>
    </div>
</template>

<script>
  import Back from './../../components/BackBar.vue'
  import ProgressBar from './../../components/ProgressBar.vue'
  import moment from 'moment'
  import Password from '@/components/PasswordBar.vue'
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
      return {
        address: '',
        agentAddress: this.$route.params.agentAddress,
        agentHash: this.$route.params.agentHash,
        agentAddressInfo: [],
        myMortgageData: [],
        total: 0,
        pageNumber:'1',
        outInfo: {
          address: '',
          txHash: '',
        },
        myNodeSetInterval:null,
        toCheckOk:false,
      }
    },
    components: {
      Back,
      ProgressBar,
      Password,
    },
    mounted () {
      let _this = this
      this.getAgentAddressInfo('/consensus/agent/' + this.agentAddress)
      this.getAddressList('/consensus/deposit/address/' + localStorage.getItem('newAccountAddress'), {
        'agentHash': this.agentHash,
        'pageSize': '3',
        'pageNumber': this.pageNumber
      })

      this.myNodeSetInterval = setInterval(() => {
        this.getAgentAddressInfo('/consensus/agent/' + this.agentAddress)
        this.getAddressList('/consensus/deposit/address/' + localStorage.getItem('newAccountAddress'), {
          'agentHash': this.agentHash,
          'pageSize': '3',
          'pageNumber': this.pageNumber
        })
      },5000)
    },
    destroyed() {
      clearInterval(this.myNodeSetInterval)
    },
    methods: {
      //根据agentAddress获取共识节点列表信息
      getAgentAddressInfo (url, params) {
        this.$fetch(url, params)
          .then((response) => {
            //console.log(params)
            console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.toCheckOk = response.data.agentAddress === localStorage.getItem("newAccountAddress");
              response.data.deposit = parseFloat(leftShift.times(response.data.deposit).toString());
              response.data.creditVals = response.data.creditVal;
              response.data.creditVal = (((((response.data.creditVal + 1) / 2)) * 100).toFixed()).toString() + '%';
              response.data.agentAddresss = (response.data.agentAddress).substr(0, 10) + '...' + (response.data.agentAddress).substr(-10);
              response.data.totalDeposits = (response.data.totalDeposit * 0.00000001).toFixed(0) + '/500000';
              if (response.data.totalDeposit > 50000000000000) {
                response.data.totalDeposit = '100%'
              } else {
                response.data.totalDeposit = (response.data.totalDeposit / 500000000000).toString() + '%'
              }
              this.agentAddressInfo = response.data
            }
          })
      },
      //根据address获取我的抵押list
      getAddressList (url, params) {
        this.$fetch(url, params)
          .then((response) => {
            if (response.success) {
              //console.log(url);
              //console.log(params);
              //console.log(response);
              let leftShift = new BigNumber(0.00000001)
              this.total = response.data.total
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].deposit = parseFloat(leftShift.times(response.data.list[i].deposit).toString())
                response.data.list[i].time = moment(response.data.list[i].time).format('YYYY-MM-DD HH:mm:ss')
              }
              this.myMortgageData = response.data.list
              //console.log(this.myMortgageData);
            }
          })
      },
      //分页功能
      myMortgageSize (events) {
        this.pageNumber = events;
        this.getAddressList('/consensus/deposit/address/' + localStorage.getItem('newAccountAddress'), {
          'agentHash': this.agentAddress,
          'pageSize': '3',
          'pageNumber': events
        })
      },
      //查看节点
      toCheck () {
        this.$router.push({
          name: '/nodeInfo',
          params: {txHash: this.agentAddressInfo.agentHash},
        })
      },
      //全部退出
      /*allOut(){
          console.log('全部退出');
      },*/
      //追加共识
      addNode () {
        if (this.$store.getters.getNetWorkInfo.localBestHeight === this.$store.getters.getNetWorkInfo.netBestHeight) {
          this.$router.push({
            name: '/addNode',
            params: {agentAddress: this.agentAddress, agentId: this.agentAddressInfo.agentHash},
          })
        } else {
          this.$message({
            message: this.$t('message.c133'),
          })
        }
      },
      //退出共识
      outNode (row) {
        this.$confirm(this.$t('message.c60') + row.agentName + '？( ' + this.$t('message.c51') + row.deposit + ' NULS)', this.$t('message.c61'), {
          confirmButtonText: this.$t('message.confirmButtonText'),
          cancelButtonText: this.$t('message.cancelButtonText'),
        }).then(() => {
          this.outInfo.address = row.address
          this.outInfo.txHash = row.txHash

          if(localStorage.getItem('encrypted')==="true"){
            this.$refs.password.showPassword(true)
          }else{
            this.toSubmit ('')
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.c59')
          })
        })
      },
      //
      toSubmit (password) {
        let param = {'address': this.outInfo.address, 'password': password, 'txHash': this.outInfo.txHash}
        this.$post('/consensus/withdraw/', param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              this.$message({
                type: 'success',
                message: this.$t('message.passWordSuccess')
              })
              this.getAddressList('/consensus/deposit/address/' + localStorage.getItem('newAccountAddress'), {
                'agentHash': this.agentHash,
                'pageSize': '3',
                'pageNumber': this.pageNumber
              })
            } else {
              this.$message({
                type: 'warning',
                message: this.$t('message.passWordFailed') + response.msg
              })
            }
            this.outInfo.address = ''
            this.outInfo.txHash = ''
          })
      },

    }
  }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .my-node {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 28px;
        }
        .div-icon {
            height: 118px;
            width: 80%;
            margin: auto;
            border: 1px solid #658ec7;
        }
        ul {
            width: 100%;
            height: 105px;
            margin: auto;
            font-size: 12px;
            background-color: #17202e;
            padding-top: 15px;
            li {
                color: #c1c5c9;
                line-height: 22px;
                width: 45%;
                float: left;
                label {
                    display: block;
                    width: 75px;
                    float: left;
                    padding-left: 25px;
                }
                span {
                }
            }
            .li-info {
                width: 100%;
                text-align: left;
            }
            li.number,
            .el-icon {
                width: auto;
                float: none;
                background-color: #17202e;
            }
        }
        .el-pager {
            width: auto;
            height: auto;
            padding: 0;
            background-color: #17202e;
        }
        .my-node-bottom {
            width: 80%;
            height: 200px;
            margin: 20px auto 0;
            border: 1px solid #658ec7;
            background-color: #17202e;
            .my-node-list {
                text-align: center;
                font-size: 14px;
                line-height: 25px;
                color: #c1c5c9;
                span {
                    margin-right: 30px;
                }
            }
            .el-table tr {
                /*background-color: #17202e;
                border-bottom: 1px solid #00FFFF;*/
            }
            .el-pagination {
                margin-top: 0;
                padding: 0;
            }
            .el-pagination button.disabled {
                background-color: #17202e;
            }
            .btn-next,
            .btn-prev {
                background: center center no-repeat #17202e;
            }
        }
    }
</style>