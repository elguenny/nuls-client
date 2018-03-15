<template>
    <div class="deal-info">
        <Back :backTitle="backTitle"></Back>
        <div class="deal-info-top">
            <div class="deal-left fl">
                <div>输入<span> {{this.allInputs*0.00000001}} NULS</span></div>
                <ul>
                    <li v-for="inItem in inputs">
                        {{ inItem.address }}<span>{{inItem.value*0.00000001}}</span>
                    </li>
                </ul>
            </div>
            <div class="deal-right fr">
                <div>输出<span>{{this.allOutputs*0.00000001}} NULS</span></div>
                <ul>
                    <li v-for="outItem in outputs">
                        {{ outItem.address }}<span>{{outItem.value*0.00000001}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="deal-case">
            <h3>概览</h3>
            <ul>
                <li><span>交易时间 </span>{{this.times}}</li>
                <li><span>手续费 </span>{{parseFloat(infoData.fee) * 0.00000001}} NULS</li>
                <li><span>签名 </span>{{infoData.sign}}</li>
                <li><span>交易类型 </span>{{infoData.transferType === '1' ?"转入":"转出"}}</li>
                <li><span>交易状态 </span>{{infoData.status === '1' ? '已确认':'待确认'}}</li>
                <li><span>区块高度 </span>{{infoData.blockHeight}}</li>
                <li><span>备注 </span>{{infoData.remark}}</li>
            </ul>
        </div>

    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
    import moment from 'moment';
    export default {
        data() {
            return {
                backTitle: '交易管理',
                hash: this.$route.params.hash,
                infoData: [],
                inputs: [],
                allInputs: 0,
                outputs: [],
                allOutputs: 0,
                times:'',

            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getHashInfo('/tx/hash/' + this.hash);
        },
        methods: {
            //根据hash获取交易信息
            getHashInfo(url) {
                this.$fetch(url)
                    .then((response) => {
                        console.log(response)
                        this.infoData = response.data;
                        this.times =  moment(response.data.time).format('YYYY-MM-DD hh:mm:ss');
                        this.inputs = response.data.inputs;
                        if (response.data.inputs.length > 0) {
                            for (var i = 0; i < response.data.inputs.length; i++) {
                                this.allInputs = this.allInputs + parseFloat(response.data.inputs[i].value);
                            }
                        }
                        this.outputs = response.data.outputs;
                        if (response.data.outputs.length > 0) {
                            for (var i = 0; i < response.data.outputs.length; i++) {
                                //console.log(parseFloat(response.data.outputs[i].value)*0.0000001);
                                this.allOutputs = this.allOutputs + parseFloat(response.data.outputs[i].value);
                            }
                        }
                    })
            }
        }
    }
</script>

<style lang="less">
    .deal-info {
        width: 100%;
        margin: auto;
        .deal-info-top {
            width: 86%;
            height: 6rem;
            margin: auto;
            margin-top: 1rem;
            .deal-left, .deal-right {
                width: 48%;
                line-height: 30px;
                font-size: 12px;
                div {
                    width: 100%;
                    background-color: #222d3f;
                    text-align: left;
                    padding-left: 5px;
                    span {
                        float: right;
                        padding-right: 5px;
                    }
                }
                ul {
                    height: 4rem;
                    width: 101%;
                    overflow:scroll;
                    overflow-x: hidden;
                    li {
                        width: 100%;
                        text-align: left;
                        padding-left: 5px;
                        span {
                            float: right;
                            padding-right: 5px;
                        }
                    }
                }
                ul::-webkit-scrollbar-track
                {
                    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
                    background-color: #0c1323;
                    border-radius: 10px;
                }

                ul::-webkit-scrollbar
                {
                    width: 3px;
                    background-color: #0c1323;
                }

                ul::-webkit-scrollbar-thumb
                {
                    border-radius: 10px;
                    background-color: #FFF;
                    background-image: -webkit-gradient(linear, 40% 0%, 75% 84%, from(#222d3f), to(#82bd39), color-stop(.6,#222d3f))
                }
            }
        }
        .deal-case {
            width: 86%;
            margin: auto;
            margin-top: 3px;
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
                        width: 5rem;
                        float: left;
                    }
                }
            }
        }
    }
</style>