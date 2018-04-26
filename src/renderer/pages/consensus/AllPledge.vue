<template>
    <div class="all-pledge">
        <Back :backTitle="backTitle"></Back>
        <h2>{{$t('message.c55')}}</h2>
        <el-table :data="pledgeData" :stripe="false">
            <el-table-column prop="address" :label="$t('message.tabName')" min-width="120" align='center'>
            </el-table-column>
            <el-table-column prop="amount" :label="$t('message.amount')" align='center'>
            </el-table-column>
            <el-table-column prop="status" :label="$t('message.state')" min-width="35" align='center'>
                <template slot-scope="scope">
                    {{$t('message.status'+scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column prop="depositTime" :label="$t('message.c49')" min-width="65" align='center'>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total=this.total class="cb"
                       v-show="totalOK = this.total > 10 ? true:false" @current-change="pledgeSize"></el-pagination>
    </div>
</template>

<script>
  import Back from './../../components/BackBar.vue'
  import moment from 'moment'
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
      return {
        backTitle: this.$route.params.agentName,
        pledgeData: [],
        total: 0,
      }
    },
    components: {
      Back,
    },
    mounted () {
      let _this = this
      this.getConsensusDeposit('/consensus/deposit/agent/' + localStorage.getItem('newAccountAddress'), {
        'pageSize': '10',
        'pageNumber': '1'
      })
    },
    methods: {
      /**
       * 获取我的抵押总额明细列表
       * Get a list of my total mortgage
       * @param url params
       * */
      getConsensusDeposit (url, params) {
        this.$fetch(url, params)
          .then((response) => {
            if (response.success) {
              this.total = response.data.total
              let leftShift = new BigNumber(0.00000001)
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].amount =  parseFloat(leftShift.times(response.data.list[i].amount).toString())
                response.data.list[i].depositTime = moment(response.data.list[i].depositTime).format('YYYY-MM-DD hh:mm:ss')
              }
              this.pledgeData = response.data.list
            }
          })
      },

      /**
       * 分页功能
       * Paging function
       * @param events
       */
      pledgeSize (events) {
        this.getConsensusDeposit('/consensus/deposit/agent/' + localStorage.getItem('newAccountAddress'), {
          'pageNumber': events,
          'pageSize': '10'
        })
      },
    }
  }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .all-pledge {
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 28px;
        }
        .el-table {
            width: 85%;
            margin: auto;
        }
    }
</style>