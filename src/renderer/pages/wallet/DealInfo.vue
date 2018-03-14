<template>
    <div class="deal-info">
        <Back :backTitle="backTitle"></Back>
        <div class="deal-info-top">
            <div class="deal-left fl">
                <div>输入<span>26036.12512862NULS</span></div>
                <ul>
                    <li>1CX3....Q08y<span>036.1251</span></li>
                </ul>
            </div>
            <div class="deal-right fr">
                <div>输出<span>26036.12512862NULS</span></div>
                <ul>
                    <li>1CX3s......Q08y<span>036.1251</span></li>
                    <li>1CX3s......Q08y<span>07897836.1251</span></li>
                </ul>
            </div>
        </div>
        <div class="deal-case">
            <h3>概览</h3>
            <ul>
                <li><span>大小 </span>225（字节）</li>
                <li><span>重量 </span>900</li>
                <li><span>接收时间 </span>2017-09-09 08:15:56</li>
                <li><span>锁定时间 </span>区块：484321</li>
                <li><span>在区块内 </span>484321（2017-09-09 08:15:56 + 0时间</li>
                <li><span>确认 </span>21344确认</li>
                <li><span>可视化 </span>浏览树状图</li>
            </ul>
        </div>

    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
    export default {
        data() {
            return {
                backTitle: '交易管理',
                hash:this.$route.params.hash,

            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.getHashInfo('/tx/hash/'+this.hash);
        },
        methods: {
            getHashInfo(url){
                this.$fetch(url)
                    .then((response) => {
                        console.log(response)
                        //this.freezeData =response.data
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
            .deal-left,.deal-right{
                width: 48%;
                line-height: 30px;
                font-size: 12px;
                div{
                    width: 100%;
                    background-color: #222d3f;
                    text-align: left;
                    padding-left: 5px;
                    span{
                        float: right;
                        padding-right: 5px;
                    }
                }
                ul{
                    li{
                        width: 100%;
                        text-align: left;
                        padding-left: 5px;
                        span{
                            float: right;
                            padding-right: 5px;
                        }
                    }
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
            ul li {
                border-bottom: 1px solid #1c2738;
                line-height: 2rem;
                font-size: 0.8rem;
                font-weight: 400;
            }
            ul li span {
                display: block;
                width: 5rem;
                float: left;
            }
        }
    }
</style>