<template>
    <div class="pledge-info">
        <Back :backTitle="this.$t('message.consensusManagement')"></Back>
        <h2>{{$t('message.c48')}}</h2>
        <el-table :data="pledgeData">
            <el-table-column prop="agentName" :label="$t('message.c24')" min-width="120" align='center'>
            </el-table-column>
            <el-table-column prop="amount" :label="$t('message.amount')" min-width="210" align='center'>
            </el-table-column>
            <el-table-column prop="status" :label="$t('message.state')" width="100" align='center'>
                <template slot-scope="scope">
                    {{$t('message.status'+scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column prop="depositTime" :label="$t('message.c49')" width="160" align='center'>
            </el-table-column>
            <el-table-column :label="$t('message.operation')" width="90" align='center'>
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('message.c50')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :page-size="8" :total=this.total class="cb"
                       @current-change="pledgeSize" v-show="totalOK = this.total > 8 ? true:false"></el-pagination>
    </div>
</template>

<script>
  import Back from './../../components/BackBar.vue'
  import moment from 'moment'
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
      return {
        pledgeData: [],
        total: 0,
      }
    },
    components: {
      Back,
    },
    mounted () {
      let _this = this
      if (localStorage.getItem('newAccountAddress') !== '') {
        this.getConsensusDeposit('/consensus/deposit/address/' + localStorage.getItem('newAccountAddress'), {
          'pageSize': '8',
          'pageNumber': 1
        })
      }

    },
    methods: {
      //获取我的抵押总额明细列表
      getConsensusDeposit (url, params) {
        this.$fetch(url, params)
          .then((response) => {
            //console.log(url + params)
            //console.log(response)
            if (response.success) {
              let leftShift = new BigNumber(0.00000001)
              this.total = response.data.total
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].amount = parseFloat(leftShift.times(response.data.list[i].amount).toString())
                response.data.list[i].depositTime = moment(response.data.list[i].depositTime).format('YYYY-MM-DD HH:mm:ss')
              }
              this.pledgeData = response.data.list
            }
          })
      },
      //分页功能
      pledgeSize (events) {
        this.getConsensusDeposit('/consensus/deposit/address/' + localStorage.getItem('newAccountAddress'), {
          'pageNumber': events,
          'pageSize': '8'
        })
      },
      //查看节点详情
      handleClick (row) {
        this.$router.push({
          name: '/myNode',
          params: {agentAddress: row.agentAddress},
        })
      }
    }
  }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .pledge-info {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 28px;
        }
        .el-table {
            width: 85%;
            margin: auto;
            .cell {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

    }
</style>