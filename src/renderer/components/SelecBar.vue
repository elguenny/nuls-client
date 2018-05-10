<template>
    <!--select-->
    <div class="base-select fl" @click="showDataList">
        <div class="sub-selected-value">
            <span>{{selectedValue.value}}</span>
            <!--<img :src="selectedValue.value" class="language-img" :title="$t('message.c140')">-->
            <ul class="ul" v-bind:style="{width: widthData}" v-if="showData">
                <li v-for="(item, index) in dataList" @click.stop="select(item, index)">
                   <!-- <img :src="item.value" class="language-img">-->
                    {{item.value}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                showData: false
            }
        },
        props: {
            dataList: {
                type: Array,
                default: [{
                    key: "en",
                    value: "English"
                }]
            },
            selectedValue: {
                type: Object,
                default: {value: "English"}
            },
            widthData: {
                type: String,
                default: "160px"
            }
        },
        methods: {
            //下拉框数据加载
            select(item) {
                this.showData = false;
                //赋值的时候要分开写
                this.selectedValue.key = item.key;
                this.selectedValue.value = item.value;
                this.$emit('select');
                localStorage.setItem('language', item.key);
            },
            //点击显示隐藏下拉框
            showDataList() {
                this.showData = !this.showData;
            },
        },
        mounted() {
            //监听点击隐藏
            document.addEventListener('click', (e) => {
                if (!this.$el.contains(e.target)) this.showData = false
            })
        },
    }
</script>
<style lang="less">
    .base-select {
        position: relative;
        top: 0;
        width: 25px;
        height: 25px;
        cursor: pointer;
        .sub-selected-value {
            position: absolute;
            top: -0.35rem;
            text-align: center;
            span{
                font-size: 12px;
                width: 21px;
                margin-top: 18px;
            }
            ul {
                position: absolute;
                top: 2.15rem;
                width: 3rem;
                z-index: 9;
                margin-left: -5px;
                li {
                    width: 70px;
                    height: 30px;
                    right: 15px;
                    position: relative;
                    text-align: center;
                    border-radius: 0.2rem;
                    .language-img {
                        margin-top: 0.25rem;
                    }
                }
                :hover {
                    background-color: #17202e;
                }
            }
            .language-img {
                width: 21px;
                margin-top: 18px;
            }
        }
    }
</style>
