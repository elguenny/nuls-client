<template>
    <div class="transfer">
        <Back :backTitle="this.$t('message.walletManagement')"></Back>
        <div class="transfer-info">
            <h2>{{$t('message.transfer')}}</h2>
            <el-form :model="transferForm" :rules="rules" ref="transferForm">
                <el-form-item :label="$t('message.sourceAddress')+'：'" class="out-address">
                    <AccountAddressBar @chenckAccountAddress="chenckAccountAddress"></AccountAddressBar>
                </el-form-item>
                <el-form-item :label="$t('message.destinationAddress')+'：'" class="join-address" prop="joinAddress">
                    <el-input type="text" v-model.trim="transferForm.joinAddress"></el-input>
                    <i class="cursor-p" @click="toUsersAddressList"></i>
                </el-form-item>
                <el-form-item :label="$t('message.transferAmount')+'：'" class="join-nos"  prop="joinNo">
                    <span class="allUsable">{{$t("message.currentBalance")}}: {{ usable }} NULS</span>
                    <el-input type="text" v-model.number="transferForm.joinNo" :maxlength="20"></el-input>
                    <span class="allNo" @click="allUsable(usable)">{{$t("message.all")}}</span>
                </el-form-item>
                <el-form-item :label="$t('message.miningFee')" class="service-no">
                </el-form-item>
                <el-form-item :label="$t('message.remarks')+'：'" class="remark">
                    <el-input type="textarea" v-model.trim="transferForm.remark" :maxlength="20" style="padding: 0 2px; color: #FFFFFF"></el-input>
                </el-form-item>
                <el-form-item class="transfer-submit">
                    <el-button type="primary" @click="transferSubmit('transferForm')" id="transferSubmit">{{$t("message.c114")}}</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogTableVisible">
                <el-table :data="userAddressList" @row-dblclick="dbcheckedAddress">
                    <el-table-column property="userAddress" :label="$t('message.tabName')" width="280" align='center'></el-table-column>
                    <el-table-column property="userAlias" :label="$t('message.tabAlias')" width="70" align='center'></el-table-column>
                    <el-table-column property="userHelp" :label="$t('message.remarks')"  width="110" align='center'></el-table-column>
                    <el-table-column :label="$t('message.operation')" width="100" align='center'>
                        <template slot-scope="scope">
                            <span class="cursor-p text-d" @click="checkedAddress(scope.row.userAddress)">{{$t('message.select')}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <Password ref="password" @toSubmit="toSubmit" :submitId="submitId"></Password>

        </div>
    </div>
</template>
<script>
    import Back from '@/components/BackBar.vue';
    import AccountAddressBar from '@/components/AccountAddressBar.vue';
    import Password from '@/components/PasswordBar.vue';
    export default {
        data() {
            let selectAddress = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('message.addressNull')));
                }else {
                    if (this.transferForm.checkPass !== '') {
                        this.$refs.transferForm.validateField('joinNo');
                    }
                    callback();
                }
            };
            let checkJoinAddress = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('message.transferNull')));
                }
                setTimeout(() => {
                    //console.log(this.address !== undefined);
                    if(this.address !== undefined){
                        if (value === this.address) {
                            callback(new Error(this.$t('message.addressOrTransfer')));
                        } else {
                            callback();
                        }
                    }else {
                        this.address = localStorage.getItem("newAccountAddress");
                        if (value === this.address) {
                            callback(new Error(this.$t('message.addressOrTransfer')));
                        } else {
                            callback();
                        }
                    }
                }, 500);
            };
            let checkJoinNo = (rule, value, callback) => {
                if (!value) {
                    callback(new Error(this.$t('message.transferNO')));
                }
                setTimeout(() => {
                    //console.log(value);
                    var re =/(^\+?|^\d?)\d*\.?\d+$/;
                    if (!re.exec(value)){
                        callback(new Error(this.$t('message.transferNO1')));
                    } else if ( value > this.usable-0.01) {
                        callback(new Error(this.$t('message.transferNO2')));
                    }else if(value < 0.01){
                        callback(new Error(this.$t('message.transferNO3')));
                    } else {
                        callback();
                    }

                }, 100);

            };
            return {
                submitId:"transferSubmit",
                usable: 0,
                accountAddress: [],
                remnant:0,
                transferForm: {
                    address: localStorage.getItem('newAccountAddress'),
                    outName: '',
                    joinAddress: '',
                    joinNo: '',
                    serviceNo: '',
                    remark: ''
                },
                rules: {
                    selectAddress:[
                        {validator: selectAddress, trigger: 'blur'}
                    ],
                    joinAddress: [
                        {validator: checkJoinAddress, trigger: 'blur'}
                    ],
                    joinNo: [
                        {validator: checkJoinNo, trigger: 'blur'}
                    ]
                },
                userAddressList: [],
                dialogTableVisible: false,
            }
        },
        components: {
            Back,
            AccountAddressBar,
            Password,
        },
        mounted() {
            let _this = this;
            this.openDB();
            this.getBalanceAddress('/account/balance/' + this.transferForm.address);
        },
        methods: {
            //根据账户地址获取账户余额
            getBalanceAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if(response.success){
                            this.usable = (response.data.usable * 0.00000001).toFixed(8);
                        }
                    });
            },
            //获取下拉选择地址
            chenckAccountAddress(chenckAddress) {
                this.address = chenckAddress;
                this.getBalanceAddress('/account/balance/' + chenckAddress);
                this.$refs.transferForm.validateField('joinAddress');
                this.$refs.transferForm.validateField('joinNo');
            },
            //选择全部金额
            allUsable(no) {
                if(no === 0){
                    this.$message({
                        message: this.$t('message.creditLow'),
                        type: 'warning '
                    });
                }else {
                    this.transferForm.joinNo = parseFloat(no)-0.01;
                }
            },
            //创建usersDB
            openDB() {
                let request = indexedDB.open('usersDB', 1);
                request.onupgradeneeded = function (e) {
                    let db = e.target.result;
                    // 如果不存在Users对象仓库则创建
                    if (!db.objectStoreNames.contains('usersDB')) {
                        let store = db.createObjectStore('addressList', {keyPath: 'userAddress', autoIncrement: false});
                    }
                }
            },
            //选择通讯录
            toUsersAddressList() {
                this.dialogTableVisible = true;
                let request = indexedDB.open('usersDB', 1);
                let dbData = [];
                request.onsuccess = function (event) {
                    let db = event.target.result;
                    let tx = db.transaction('addressList', 'readonly');
                    let store = tx.objectStore('addressList');
                    // 打开游标，遍历customers中所有数据
                    store.openCursor().onsuccess = function (event) {
                        let cursor = event.target.result;
                        if (cursor) {
                            dbData.push(cursor.value);
                            cursor.continue();
                        }
                    }
                };
                this.userAddressList = dbData;
            },
            //选中通讯录地址
            checkedAddress(address) {
                this.transferForm.joinAddress = address;
                this.dialogTableVisible = false;
            },
            //双击选择通讯录地址
            dbcheckedAddress(row, event) {
                this.transferForm.joinAddress = row.userAddress;
                this.dialogTableVisible = false;
            },
            //确认转账
            transferSubmit(fromName) {
                this.$refs[fromName].validate((valid) => {
                    if (valid) {
                        this.$refs.password.showPassword(true);
                    } else {
                        return false;
                    }
                });
            },
            //
            toSubmit(password) {
                let param = '{"address":"' + this.address + '","toAddress":"' + this.transferForm.joinAddress + '","amount":"' + this.transferForm.joinNo * 100000000 + '","password":"' + password + '","remark":"' + this.transferForm.remark + '"}';
                console.log(param);
                this.$post('/wallet/transfer/', param)
                    .then((response) => {
                        console.log(response);
                        if (response.success) {
                            this.$message({
                                message: this.$t('message.passWordSuccess'),
                                type: 'success'
                            });
                            this.transferForm.joinAddress = '';
                            this.transferForm.joinNo = '';
                            this.transferForm.remark = '';
                            this.getBalanceAddress('/account/balance/' + this.transferForm.address);
                        } else {
                            this.$message({
                                message: this.$t('message.passWordFailed') + response.msg,
                                type: 'warning',
                            });
                        }
                    })
            },
        }
    }
</script>

<style lang="less">
    @import url("../../assets/css/style.less");
    .transfer {
        width: 100%;
        margin: auto;
        .transfer-info {
            width: 70%;
            margin: auto;
            .joinNo {
                .el-input__inner {
                    background-color: #17202e;
                    border: 1px solid #24426c;
                }
            }
            .out-name {
                font-size: 14px;
                color: #606266;
            }
            .out-name,
            .service-no {
                label {
                    float: left;
                    padding-right: 0.5rem;
                }
            }
            .out-address {
                .address-select {
                    width: 553px;
                    right: 0;
                    .sub-select-item {
                        width: 553px;
                    }
                }
            }
            .join-address {
                i {
                    width: 40px;
                    height: 40px;
                    background-size: @bg-size;
                    background: @bg-image -40px -67px;
                    position: relative;
                    z-index: 8;
                    float: right;
                    margin-top: -36px;
                    margin-right: 0;
                }
            }
            .remark {
                .el-textarea__inner {
                    background-color: #17202e;
                    padding: 0 2px;
                    color: #FFFFFF;
                }
            }
            .transfer-submit {
                text-align: center;
                button {
                    width: 30%;
                }
            }
            h2 {
                text-align: center;
                line-height: 3rem;
            }
            input[type="text"],
            input[type="password"],
            select {
                background: #17202e;
            }
        }

        .el-form-item {
            margin-bottom: 5px;
        }
        .join-address, .join-nos {
            margin-bottom: 15px;
        }
        .el-form-item__label {
            line-height: 25px;
            padding: 0;
            color: white;
        }
        .el-input__suffix {
            margin-top: 0;
        }
        .el-select .el-input .el-select__caret {
            font-size: 14px;
        }
        .el-form-item__content {
            line-height: 30px;
        }
        .el-select-dropdown {
            background-color: #17202e;
        }
        .el-select-dropdown__item.hover,
        .el-select-dropdown__item:hover {
            background-color: #17202e;
        }
        .transfer-submit {
            margin-top: 30px;
        }
        .el-dialog {
            width: 70%;
            .el-dialog__header {
                padding: 0;
            }
            .el-dialog__body {
                padding: 0;
            }
        }
        input[type="text"], input[type="password"], select {
            border: 1px solid #24426c;
            font-size: 14px;
            padding: 0 2px;
            color: white;
        }
        .password-dialog{
            width: 560px;
            margin: auto;
        }
        .el-select-dropdown__list{
            width: 100%;
        }

    }
    .el-popper[x-placement^=bottom] .popper__arrow{
        display: none;
    }
    .el-select-dropdown__item{
        padding: 0 2px;
    }
</style>