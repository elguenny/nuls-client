<template>
    <div class="deal-info">
        <Back :backTitle="this.$t('message.transactionManagement')"></Back>
        <div class="deal-info-top">
            <div class="deal-left fl">
                <div>&nbsp;&nbsp;{{$t('message.input')}}<span> {{this.allInputs.toString()}} NULS</span></div>
                <ul>
                    <li v-for="inItem in inputs">
                        <label @click="hashCopy(inItem.address)" class="cursor-p" :title="$t('message.c145')">{{ inItem.address }}</label>
                      <span>{{inItem.value.toString()}}</span>
                    </li>
                </ul>
            </div>
            <div class="deal-right fr">
                <div>&nbsp;&nbsp;{{$t('message.output')}}<span>{{this.allOutputs.toString()}} NULS</span></div>
                <ul>
                    <li v-for="outItem in outputs">
                      <label @click="hashCopy(outItem.address)" class="cursor-p" :title="$t('message.c145')">{{ outItem.address }}</label>
                      <span>{{outItem.value.toString()}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="deal-case">
            <h3>{{$t('message.overview')}}</h3>
            <ul>
                <li><span>{{$t('message.tradingTime')}}</span>{{this.times}}</li>
                <li><span>{{$t('message.miningFee1')}}</span>{{parseFloat(infoData.fee) * 0.00000001}} NULS</li>
                <li @click="hashCopy(infoData.hash)" class="cursor-p" :title="$t('message.c145')"><span>{{$t('message.autograph')}}</span>{{infoData.hash}}
                </li>
                <li><span>{{$t('message.transactionType')}}</span>
                    {{$t('message.type'+infoData.type)}}
                </li>
                <li><span>{{$t('message.transactionState')}}</span>{{ $t('message.statusS'+infoData.status) }}
                </li>
                <li><span>{{$t('message.blockHeight')}}</span>{{infoData.blockHeight < 0 ? "- -":infoData.blockHeight }}</li>
                <li><span>{{$t('message.remarks')}}</span>{{infoData.remark}}</li>
            </ul>
        </div>

    </div>
</template>

<script>
  import Back from '@/components/BackBar.vue'
  import copy from 'copy-to-clipboard'
  import moment from 'moment'
  import { BigNumber } from 'bignumber.js'

  export default {
    data () {
      return {
        hash: this.$route.params.hash,
        infoData: [],
        inputs: [],
        allInputs: 0,
        outputs: [],
        allOutputs: 0,
        times: '',

      }
    },
    components: {
      Back,
    },
    mounted () {
      let _this = this;
      this.getHashInfo('/accountledger/tx/' + this.hash)
    },
    methods: {
      //根据hash获取交易信息
      getHashInfo (url) {
        this.$fetch(url)
          .then((response) => {
            //console.log(response);
            this.infoData = response.data;
            this.times = moment(response.data.time).format('YYYY-MM-DD HH:mm:ss');
            let leftShift = new BigNumber(0.00000001);
            if (response.data.inputs.length > 0) {
              for (let i = 0; i < response.data.inputs.length; i++) {
                //response.data.inputs[i].address = response.data.inputs[i].address.substr(0, 10) + '...' + response.data.inputs[i].address.substr(length - 10)
                response.data.inputs[i].value =leftShift.times(response.data.inputs[i].value).toFixed(8);
                this.allInputs = BigNumber(this.allInputs).plus(response.data.inputs[i].value).toString()
              }
            }
            this.inputs = response.data.inputs;

            if (response.data.outputs.length > 0) {
              for (let i = 0; i < response.data.outputs.length; i++) {
                //response.data.outputs[i].address = response.data.outputs[i].address.substr(0, 10) + '...' + response.data.outputs[i].address.substr(length - 10)
                response.data.outputs[i].value = leftShift.times(response.data.outputs[i].value).toFixed(8);
                this.allOutputs = BigNumber(this.allOutputs).plus(response.data.outputs[i].value).toString()
              }
            }
            this.outputs = response.data.outputs
          })
      },
      //复制功能
      hashCopy (hash) {
        copy(hash);
        this.$message({
          message: this.$t('message.c129'), type: 'success', duration: '800'
        })
      },
    }
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
                }
            }
        }
    }
</style>
