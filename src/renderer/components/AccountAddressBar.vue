<template>
    <div class="account-address">
        <el-select v-model="accountAddressValue" :placeholder="$t('message.addressNull')" @change="accountAddressChecked">
            <el-option v-for="item in getAddressList" :key="item.address" :label="item.address" :value="item.address">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                accountAddressValue: '',
            }
        },
        computed:{
            getAddressList(){
                return this.$store.getters.getAddressList;
            },
        },
        created(){
            //判断是不有默认账户
            if (localStorage.getItem("newAccountAddress") !== '') {
                this.accountAddressValue = localStorage.getItem("newAccountAddress");
            }
            //判断vuex账户列表里有没有数据
            if (this.$store.getters.getAddressList.length === 0) {
                this.getAccountList("/account/list");
            }
        },

        methods: {
            //获取账户地址列表
            getAccountList(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            localStorage.setItem('newAccountAddress', response.data[0].address);
                            this.$store.commit("setAddressList", response.data.list);
                        } else {
                            this.$store.commit("setAddressList", '');
                        }
                    }).catch((reject) => {
                    console.log("User List err" + reject);
                    this.$store.commit("setAddressList", '');
                });
            },
            //选择账户地址
            accountAddressChecked(accountAddress) {
                this.$emit("chenckAccountAddress", accountAddress);
                localStorage.setItem('newAccountAddress', accountAddress);
            },
        }
    }
</script>

<style lang="less">
    .account-address {
        height: 50px;
        margin: 20px auto 0px;
        width: 440px;
        label {
            font-size: 14px;
            margin-right: 15px;
        }
        .el-input--suffix .el-input__inner {
            width: 415px;
            color: white;
        }
        .el-select .el-input .el-select__caret {
            font-size: 14px;
        }
        .el-popper[x-placement^=bottom] .popper__arrow {
            display: none;
        }
    }
</style>