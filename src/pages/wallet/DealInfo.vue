<template>
  <div class="deal-info">
    <Back :backTitle="this.$t('message.transactionManagement')"></Back>
    <div class="deal-info-top">
      <div class="deal-left fl">
        <div>{{$t('message.input')}}<span> {{this.allInputs.toString()}} NULS</span></div>
        <ul>
          <li v-for="inItem in inputs">
            <label @click="hashCopy(inItem.address)" class="cursor-p" >{{ inItem.address
              }}</label>
            <span>{{inItem.value.toString()}}</span>
          </li>
        </ul>
      </div>
      <div class="deal-right fr">
        <div>{{$t('message.output')}}<span>{{this.allOutputs.toString()}} NULS</span></div>
        <ul>
          <li v-for="outItem in outputs">
            <label @click="hashCopy(outItem.address)" class="cursor-p">{{ outItem.address
              }}</label>
            <span>{{outItem.value.toString()}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="deal-case">
      <h3>{{$t('message.overview')}}</h3>
      <ul>
        <li><span>{{$t('message.tradingTime')}}</span>{{this.times}}</li>
        <li v-show="!contractIf"><span>{{$t('message.miningFee1')}}</span>{{infoData.fee}} NULS</li>
        <li v-show="contractIf">
          <span>{{$t('message.miningFee1')}}</span>
          {{ this.infoData.totalFee }}({{$t('message.c210')}}) =
          {{ this.infoData.txSizeFee }}（{{$t('message.c211')}}）+
          {{ this.infoData.actualContractFee }}（{{$t('message.type'+infoData.type)}}）+
          {{ this.infoData.refundFee }}（{{$t('message.c213')}}）
          <label class="unit">{{$t('message.c214')}}: NULS</label>
        </li>
        <li><span>{{$t('message.autograph')}}</span><label class="text-ds cursor-p" @click="hashCopy(infoData.hash)">{{infoData.hash}}</label>
        </li>
        <li><span>{{$t('message.transactionType')}}</span>{{$t('message.type'+infoData.type)}}</li>
        <li><span>{{$t('message.transactionState')}}</span>{{ $t('message.statusS'+infoData.status) }}</li>

        <li v-show="contractIf || infoData.type === 102 "><span>{{$t('message.c215')}}</span>{{ infoData.contractAddress }}</li>
        <li v-show="contractIf || infoData.type === 102 "><span>{{$t('message.c247')}}</span>{{ infoData.modelIf }}</li>
        <li v-show="insideIf" v-for="item in infoData.insideItme">
          <span>{{item.name ===''? '&nbsp;': item.name}}</span>
          From <label class="text-ds cursor-p" @click="hashCopy(item.from)">{{item.from}}</label>
          To <label class="text-ds cursor-p" @click="hashCopy(item.to)">{{item.to}}</label>
          for <label class="text-ds">{{item.value}}</label> {{infoData.insideUnit}}
          <p><span>&nbsp;</span>TXID: <label class="text-ds cursor-p" @click="hashCopy(item.to)">{{item.txHash}}</label></p>
        </li>
       <!-- <li v-show="insideIf"><span>&nbsp;</span>TXID: <label class="text-ds cursor-p">dfdsf14234563543654</label></li>-->
        <li v-show="tokenIf" v-for="itme in infoData.tokenItme">
          <span>{{itme.name}}&nbsp;</span>
          From <label class="text-ds cursor-p" @click="hashCopy(itme.from)">{{itme.from}}</label>
          To <label class="text-ds cursor-p" @click="hashCopy(itme.to)">{{itme.to}}</label>
          for <label class="text-ds">{{itme.value}}</label> {{infoData.tokenUnit}}
        </li>

        <li v-show="contractIf"><span>GasLimit</span>{{ infoData.gasLimit }}</li>
        <li v-show="contractIf"><span>{{$t('message.c216')}}</span>{{ infoData.price }}</li>
        <li v-show="contractIf"><span>GasUsed</span>{{ infoData.gasUsed }}</li>

        <li v-show="callIf"><span>{{$t('message.c217')}}</span>{{$t('message.c218')}}: {{infoData.callName}}</li>
        <li v-show="callIf"><span>&nbsp;</span>{{$t('message.c219')}}: {{infoData.callParmas}}</li>
        <li v-show="callIf"><span>&nbsp;</span>{{$t('message.c2201')}}: {{infoData.callResult}}</li>

        <li><span>{{$t('message.blockHeight')}}</span>{{infoData.blockHeight < 0 ? "- -":infoData.blockHeight }}</li>
        <li><span>{{$t('message.c221')}}</span>{{ infoData.confirmCount }}</li>
        <li v-show="infoData.type !== 102">
          <span>TxData</span>
          <pre v-show="!contractIf" class="out-pre">{{ infoData.txDataHexString ===''? '&#8195':infoData.txDataHexString }}</pre>
          <pre id="outPre" class="out-pre" v-show="contractIf"></pre>
        </li>

        <li><span>{{$t('message.remarks')}}</span>{{infoData.remark===''? '&#8195':infoData.remark}}</li>
      </ul>
    </div>

  </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import moment from 'moment'
  import {BigNumber} from 'bignumber.js'
  import {copys, LeftShiftEight, getLocalTime, htmlDecodeByRegExp,Power,Division} from '@/api/util.js'
  import {getHashInfo} from '@/api/httpData.js'

  export default {
    data() {
      return {
        hash: this.$route.query.hash,
        infoData: [],
        inputs: [],
        allInputs: 0,
        outputs: [],
        allOutputs: 0,
        times: '',
        //是否是合约交易
        contractIf: false,
        //是否合约调用
        callIf: false,
        //是否内部转账
        insideIf: false,
        //是否代币交易
        tokenIf: false,
      }
    },
    components: {
      Back,
    },
    mounted() {
      let _this = this;
      this.getHashInfo(this.hash)
    },
    methods: {
      //根据hash获取交易信息
      getHashInfo(hash) {
        let url = '';
        const outPre = document.getElementById('outPre');
        if (this.$route.query.type === 100 || this.$route.query.type === 101 || this.$route.query.type === 102 || this.$route.query.type === 103 || this.$route.query.type === 1000) {
          url = '/contract/tx/' + hash;
        } else {
          url = '/accountledger/tx/' + hash;
        }
        //console.log(url)
        this.$fetch(url)
          .then((response) => {
            console.log(response);
            this.infoData = response.data;

            this.infoData.fee = LeftShiftEight(response.data.fee).toString();
            this.times = moment(getLocalTime(response.data.time)).format('YYYY-MM-DD HH:mm:ss');
            response.data.remark = response.data.remark ? htmlDecodeByRegExp(response.data.remark) : '';
            if (response.data.inputs.length > 0) {
              for (let i = 0; i < response.data.inputs.length; i++) {
                response.data.inputs[i].value = LeftShiftEight(response.data.inputs[i].value);
                this.allInputs = BigNumber(this.allInputs).plus(response.data.inputs[i].value).toString()
              }
            }
            this.inputs = response.data.inputs;
            if (response.data.outputs.length > 0) {
              for (let i = 0; i < response.data.outputs.length; i++) {
                response.data.outputs[i].value = LeftShiftEight(response.data.outputs[i].value);
                this.allOutputs = BigNumber(this.allOutputs).plus(response.data.outputs[i].value).toString()
              }
            }
            this.outputs = response.data.outputs;

            //判断是否合约交易
            if (response.data.type === 100 || response.data.type === 101 || response.data.type === 102 || response.data.type === 1000) {
              this.contractIf = true;
              if (response.data.type === 100) {

              } else if (response.data.type === 101) {
                this.callIf = true;
                //调用方式数据
                response.data.callName = response.data.txData.data.methodName;
                //调用方的参数
                response.data.callParmas='';
                if(response.data.txData.data.args.length > 0){
                  for(let i of response.data.txData.data.args){
                    response.data.callParmas += i[0] + ',';
                  }
                  //去掉最后一个逗号
                  if (response.data.callParmas.length > 0) {
                    response.data.callParmas = response.data.callParmas.substr(0, response.data.callParmas.length - 1);
                  }
                }
                //调用方法的返回结果
                response.data.callResult = response.data.contractResult.result;

                //判断是否合约内部转账
                if (response.data.contractResult.transfers.length > 0) {
                  this.insideIf = true;
                  //代币单位
                  response.data.insideUnit = 'NULS';
                  let tokenTransfers = response.data.contractResult.transfers;
                  for (let i in tokenTransfers) {
                    if(i.toString() === '0'){
                      tokenTransfers[i].name = this.$t('message.c222');
                    }else {
                      tokenTransfers[i].name ='';
                    }
                    tokenTransfers[i].value = LeftShiftEight( tokenTransfers[i].value).toString();
                  }
                   response.data.insideItme = response.data.contractResult.transfers;
                }
                //判断是否是代币交易
                if (response.data.contractResult.tokenTransfers.length > 0) {
                  this.tokenIf = true;
                  //代币单位
                  response.data.tokenUnit = response.data.contractResult.symbol;
                  //代币数字次方
                  let powerNo = Power(response.data.contractResult.decimals);
                  let tokenTransfers = response.data.contractResult.tokenTransfers;
                  for (let i in tokenTransfers) {
                    if(i.toString() === '0'){
                      tokenTransfers[i].name ='Token';
                    }else {
                      tokenTransfers[i].name ='';
                    }
                    tokenTransfers[i].value = Division( tokenTransfers[i].value,powerNo).toString();
                  }
                  response.data.tokenItme = response.data.contractResult.tokenTransfers;


                }
              } else {
                this.contractIf = false;
                response.data.txDataHexString = '';
                response.data.contractAddress = response.data.contractResult.contractAddress;
              }
              response.data.totalFee = LeftShiftEight(response.data.contractResult.totalFee).toString();
              response.data.txSizeFee = LeftShiftEight(response.data.contractResult.txSizeFee).toString();
              response.data.actualContractFee = LeftShiftEight(response.data.contractResult.actualContractFee).toString();
              response.data.refundFee = LeftShiftEight(response.data.contractResult.refundFee).toString();
              response.data.contractAddress = response.data.contractResult.contractAddress;
              response.data.gasLimit = response.data.contractResult.gasLimit;
              response.data.price = response.data.contractResult.price;
              response.data.gasUsed = response.data.contractResult.gasUsed;

              response.data.modelIf = response.data.contractResult.success ? 'true' : response.data.contractResult.success +'('+ response.data.contractResult.errorMessage +')';

              outPre.innerText = JSON.stringify(response.data.txData.data, null, 2);

            } else {

            }

          })
      },
      //复制功能
      hashCopy(hash) {
        if(hash.length > 50){
          window.open('https://nulscan.io/transactionHash?hash='+hash, '_blank')
        }else {
          window.open('https://nulscan.io/accountInfo?address='+hash, '_blank')
        }
      },
    },
    beforeRouteLeave(to, from, next) {
      if (to.name !== '/wallet') {
        sessionStorage.removeItem('walletTotalAll');
        sessionStorage.removeItem('walletPages');
        sessionStorage.removeItem('walletTypes')
      }
      next();
    },
  }
</script>

<style lang="less">
  .deal-info {
    width: 1024px;
    margin: auto;
    .deal-info-top {
      width: 100%;
      height: 6rem;
      margin: 1rem auto 0;
      .deal-left, .deal-right {
        width: 48.2%;
        line-height: 30px;
        font-size: 12px;
        div {
          width: 100%;
          background-color: #222d3f;
          text-align: left;
          font-size: 12px;
          span {
            float: right;
            padding-right: 5px;
          }
        }
        ul {
          height: 4rem;
          width: 100%;
          overflow: scroll;
          overflow-x: hidden;
          li {
            width: 100%;
            text-align: left;
            padding-left: 5px;
            font-size: 10px;
            span {
              float: right;
              padding-right: 5px;
            }
          }
        }
        ul::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
          background-color: #0c1323;
          border-radius: 10px;
        }

        ul::-webkit-scrollbar {
          width: 3px;
          background-color: #0c1323;
        }

        ul::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-image: -webkit-gradient(linear, 40% 0%, 75% 84%, from(#FFFFFF), to(#FFFFFF), color-stop(.6, #FFFFFF))
        }
      }
    }
    .deal-case {
      width: 100%;
      margin: 3px auto 0;
      h3 {
        background-color: #222d3f;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
      }
      ul {
        li {
          border-bottom: 1px solid #1c2738;
          line-height: 2rem;
          font-size: 0.8rem;
          font-weight: 400;
          span {
            display: block;
            width: 125px;
            float: left;
          }
          .unit {
            float: right;
            margin-right: 30px;
          }
          .out-pre {
            width: auto;
            max-height: 100px;
            overflow: auto;
            &::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
              background-color: #0c1323;
              border-radius: 10px;
            }

            &::-webkit-scrollbar {
              width: 3px;
              height: 3px;
              background-color: #0c1323;
            }

            &::-webkit-scrollbar-thumb {
              border-radius: 10px;
              background-image: -webkit-gradient(linear, 40% 0%, 75% 84%, from(#FFFFFF), to(#FFFFFF), color-stop(.6, #FFFFFF))
            }
          }

        }
      }
    }
  }
</style>
