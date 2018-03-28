<template>
    <div class="users">
        <Back :backTitle="backTitle"></Back>
        <h2>{{$t('message.c93')}}</h2>
        <el-button type="primary" icon="el-icon-plus" @click="toNewAccount()" class="newAccount"></el-button>
        <el-table :data="tableData">
            <el-table-column prop="userAddress" :label="$t('message.c69')" width="288" align='center'>
            </el-table-column>
            <el-table-column prop="userAlias" :label="$t('message.tabAlias')" width="100" align='center'>
            </el-table-column>
            <el-table-column prop="userHelp" :label="$t('message.remarks')"  width="180" align='center'>
            </el-table-column>
            <el-table-column :label="$t('message.operation')" width="120" align='center'>
                <template slot-scope="scope">
                    <el-button @click="editorRow(scope.row.userAddress,scope.row.userAlias,scope.row.userHelp)"
                               type="text" size="small">
                        {{$t('message.c94')}}
                    </el-button>
                    <el-button @click="deleteRow(scope.row.userAddress)" type="text" size="small">
                        {{$t('message.c95')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="$t('message.c96')" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="80px" :rules="formRules"  ref="form">
                <el-form-item :label="$t('message.c69')">
                    <el-input v-model="form.userAddress"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.remarks')">
                    <el-input v-model="form.userHelp"></el-input>
                </el-form-item>
                <div class="userAlias">{{$t('message.tabAlias')}} {{form.userAlias}}</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addUserAccount">{{$t('message.confirmButtonText')}}</el-button>
            </div>
        </el-dialog>
        <!--<el-pagination layout="prev, pager, next" :total="1000" class="cb"></el-pagination>-->
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            var userAddressRules = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('message.passWordHintEmpty')));
                }
            };
            return {
                backTitle: this.$t('message.setManagement'),
                tableData: [],
                dialogFormVisible: false,
                form: {
                    userAddress: '',
                    userAlias: '',
                    userHelp: '',
                },
                formRules: {
                    pass: [{
                        validator: userAddressRules,
                        trigger: 'blur'
                    }]
                }
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.openDB();
            this.getUserList();
        },
        methods: {
            //创建usersDB
            openDB() {
                var request = indexedDB.open('usersDB', 1);
                request.onupgradeneeded = function (e) {
                    var db = e.target.result;
                    // 如果不存在Users对象仓库则创建
                    if (!db.objectStoreNames.contains('usersDB')) {
                        var store = db.createObjectStore('addressList', {keyPath: 'userAddress', autoIncrement: false});
                    }
                }
            },
            //给userlist添加数据
            addUserAccount() {
                var request = indexedDB.open('usersDB', 1);
                var db;
                let value = {
                    'userAddress': this.form.userAddress,
                    'userAlias': this.form.userAlias,
                    'userHelp': this.form.userHelp
                };
                request.onsuccess = function (event) {
                    db = event.target.result;
                    var tx = db.transaction('addressList', 'readwrite');
                    var store = tx.objectStore('addressList');
                    store.put(value);
                }
                this.getUserList();
                this.form.userAddress = '';
                this.form.userHelp = '';
                this.dialogFormVisible = false
            },
            //读取userList
            getUserList() {
                var request = indexedDB.open('usersDB', 1);
                var dbData = [];
                request.onsuccess = function (event) {
                    var db = event.target.result;
                    var tx = db.transaction('addressList', 'readonly');
                    var store = tx.objectStore('addressList');
                    // 打开游标，遍历customers中所有数据
                    store.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            dbData.push(cursor.value);
                            cursor.continue();
                        }
                    }
                }
                this.tableData = dbData;
            },
            //新增通讯录
            toNewAccount() {
                this.dialogFormVisible = true
            },
            //修改一条通讯录
            editorRow(userAddress, userAlias, userHelps) {
                this.dialogFormVisible = true;
                this.form.userAddress = userAddress;
                this.form.userAlias = userAlias;
                this.form.userHelp = userHelps;
            },
            //删除通讯录一条记录
            deleteRow(userAddress) {
                var request = indexedDB.open('usersDB', 1);
                var db;
                request.onsuccess = function (event) {
                    db = event.target.result;
                    var tx = db.transaction('addressList', 'readwrite');
                    var store = tx.objectStore('addressList');
                    store.delete(userAddress);
                };
                this.getUserList();
            }

        }
    }
</script>
<style lang="less">
    @import url("../../assets/css/style.less");

    .users {
        width: 86%;
        margin: auto;
        .newAccount {
            width: 30px;
            line-height: 20px;
            height: 20px;
            background-color: #0b1422;
            float: right;
            border: 1px solid #0b1422;
            margin-bottom: 10px;
        }
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
        }
        .back {
            margin-left: 50px;
        }
        .el-dialog {
            background-color: #0b1422;
            .userAlias {
                line-height: 20px;
                margin-left: 40px;
                color: #606266;
            }
            .el-dialog__title {
                color: #C1C5C9;
                font-size: 14px;
            }
            .el-dialog__header {
                padding: 10px 10px 0px;
            }
            .el-dialog__footer {
                text-align: center;
            }
        }
    }
</style>