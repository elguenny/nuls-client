<template>
    <div class="all-pledge">
       <!-- <Back :backTitle="backTitle"></Back>-->
        <Back :backTitle="backTitle"  :backUrl="backUrl" :backParams="backParams"></Back>
        <h2>{{$t('message.c55')}}</h2>
        <el-table :data="pledgeData" :stripe="false">
            <el-table-column prop="address" :label="$t('message.tabName')" width="450" align='center'>
            </el-table-column>
            <el-table-column prop="deposit" :label="$t('message.amount')"  width="140" align='center'>
            </el-table-column>
            <el-table-column prop="status" :label="$t('message.state')" width="100" align='center'>
                <template slot-scope="scope">
                    {{$t('message.status'+scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column prop="time" :label="$t('message.c49')" min-width="180" align='center'>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :page-size="20" :total=this.total class="cb"
                       v-show="totalOK = this.total > 20 ? true:false" @current-change="pledgeSize"></el-pagination>
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
        backUrl:'/nodeInfo',
        backParams:this.$route.params.txHash,
        txHash: this.$route.params.txHash,
        pledgeData: [],
        total: 0,
      }
    },
    components: {
      Back,
    },
    mounted () {
      let _this = this;
      this.getConsensusDeposit('/consensus/deposit/agent/' + this.txHash, {
        'pageSize': '20',
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
            //console.log(response);
            if (response.success) {
              this.total = response.data.total;
              let leftShift = new BigNumber(0.00000001);
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].deposit =  parseFloat(leftShift.times(response.data.list[i].deposit).toString());
                response.data.list[i].time = moment(response.data.list[i].time).format('YYYY-MM-DD hh:mm:ss')
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
        this.getConsensusDeposit('/consensus/deposit/agent/' + this.txHash, {
          'pageNumber': events,
          'pageSize': '20'
        })
      },
    }
  }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");

    .all-pledge {
      width: 1024px;
      margin: auto;
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 28px;
        }
        .el-table {
            width: 100%;
            margin: auto;
        }
    }
</style>
