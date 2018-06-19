<template>
  <div class="freeze-list">
    <Back :backTitle="this.$t('message.accountManagement')"></Back>
    <div class="freeze-list-tabs">
      <h2>{{$t('message.freezeList')}}</h2>
      <el-table :data="freezeData">
        <el-table-column prop="txType" :label="$t('message.type')" min-width="60" align='center'>
          <template slot-scope="scope">
            {{$t('message.type'+scope.row.txType)}}
          </template>
        </el-table-column>
        <el-table-column prop="value" :label="$t('message.amount')" width="150" align='right'>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('message.freezeTime')" min-width="100" align='center'>
        </el-table-column>
        <el-table-column prop="lockTime" :label="$t('message.thawingTime')" min-width="100" align='center'>
          <template slot-scope="scope">
            {{parseInt(scope.row.lockTime) > 1000000000000 ? scope.row.lockTimes : (parseInt(scope.row.lockTime) === -1
            ? $t('message.c158'): $t('message.c139') + scope.row.lockTime)}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :page-size="20" :total=this.totalAll class="cb"
                     v-show="totalAllOk = this.totalAll>20 ? true:false"
                     @current-change="freezeSize"></el-pagination>
    </div>

  </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import moment from 'moment'
  import {BigNumber} from 'bignumber.js'

  export default {
    data() {
      return {
        address: this.$route.params.address,
        freezeData: [],
        totalAll: 0,
        pageNumber: 1,
        freezeSetInterval: null,
      }
    },
    components: {
      Back,
    },
    mounted() {
      let _this = this;
      this.getLocked('/accountledger/utxo/lock/' + this.address, {'pageSize': 20, 'pageNumber': 1});
      this.freezeSetInterval = setInterval(() => {
        this.getLocked('/accountledger/utxo/lock/' + this.address, {'pageSize': 20, 'pageNumber': this.pageNumber})
      }, 2000)
    },
    destroyed() {
      clearInterval(this.freezeSetInterval)
    },
    methods: {
      //获取冻结列表
      getLocked(url, param) {
        this.$fetch(url, param)
          .then((response) => {
            //console.log(response);
            if (response.success) {
              let leftShift = new BigNumber(0.00000001);
              this.totalAll = response.data.total;
              for (let i = 0; i < response.data.list.length; i++) {
                response.data.list[i].value = parseFloat(leftShift.times(response.data.list[i].value).toString());
                response.data.list[i].createTime = moment(response.data.list[i].createTime).format('YYYY-MM-DD HH:mm:ss');
                response.data.list[i].lockTimes = response.data.list[i].lockTime;
                if (response.data.list[i].lockTime > 1000000000000) {
                  console.log(response.data.list[i].lockTime > 1000000000000);
                  response.data.list[i].lockTimes = moment(response.data.list[i].lockTime).format('YYYY-MM-DD HH:mm:ss')
                }
              }
              this.freezeData = response.data.list
            } else {
              this.freezeData = []
            }
          })
      },
      //交易列表分页
      freezeSize(events) {
        this.pageNumber = events;
        this.getLocked('/accountledger/utxo/lock/' + this.address, {'pageSize': 20, 'pageNumber': events})
      },
    }
  }
</script>

<style lang="less">
  @import url("../../assets/css/style.less");

  .freeze-list {
    width: 1024px;
    margin: auto;
    .freeze-list-tabs {
      width: 100%;
      margin: auto;
      h2 {
        line-height: 3rem;
        text-align: center;
      }
      .el-table th {
        background-color: #222d3f;
      }
      .el-table tr {
        background-color: #0c1323;
      }
      .el-pagination {
        margin-top: 1rem;
        text-align: center;
      }
    }

  }
</style>
