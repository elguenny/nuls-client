<template>
    <div class="users">
        <Back :backTitle="backTitle"></Back>
        <h2>通讯录</h2>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="userAddress" label="账户" min-width="60" align='center'>
            </el-table-column>
            <el-table-column prop="userAlias" label="别名" min-width="10" align='center'>
            </el-table-column>
            <el-table-column prop="userHelp" label="备注" min-width="10" align='center'>
            </el-table-column>
            <el-table-column label="操作" min-width="20" align='center'>
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
                        编辑
                    </el-button>
                    <el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--<el-pagination layout="prev, pager, next" :total="1000" class="cb"></el-pagination>-->
    </div>
</template>

<script>
    import Back from '@/components/BackBar.vue';

    export default {
        data() {
            return {
                backTitle: "设置",
               /* tableData: [
                    {"userAddress":"2CfnhnNxNorPiug5knrn1txaRpReCGn","userAlias":"linxin","userHelp":"456"},
                    {"userAddress":"2CidJFvJhyruCS9RQLSVMVcYgm845Fh","userAlias":"789","userHelp":"456"},
                    {"userAddress":"2CkFHVWKVogUQRScVzgsu8oEA5Txz8W","userAlias":"96358964","userHelp":"85568"}
                    ],*/
                tableData:[],
            }
        },
        components: {
            Back,
        },
        mounted() {
            let _this = this;
            this.openDB();
            //this.addUserDB();
            this.getUserList();
            console.log(this.tableData);
        },
        methods: {
            //创建usersDB
            openDB()
            {
                var request = indexedDB.open('usersDB', 1);
                request.onupgradeneeded = function (e) {
                    var db = e.target.result;
                    console.log("====" + !db.objectStoreNames.contains('usersDB'));
                    // 如果不存在Users对象仓库则创建
                    if (!db.objectStoreNames.contains('usersDB')) {
                        var store = db.createObjectStore('addressList', {keyPath: 'userAddress', autoIncrement: false});
                    }
                }
            },
            //给userlist添加数据
            addUserDB()
            {
                var request = indexedDB.open('usersDB', 1);
                var db;
                request.onsuccess = function (event) {
                    db = event.target.result;
                    var tx = db.transaction('addressList', 'readwrite');
                    var store = tx.objectStore('addressList');
                    var value = {
                        'userAddress': '2CkFHVWKVogUQRScVzgsu8oEA5Txz8W',
                        'userAlias': '96358964',
                        'userHelp': '85568'
                    }
                    store.put(value);
                }
            },
            //读取userList
            getUserList(callback){
                var request = indexedDB.open('usersDB', 1);
                var dbData=[{"userAddress":"2CfnhnNxNorPiug5knrn1txaRpR1234","userAlias":"linxin","userHelp":"456"}];
                request.onsuccess = function(event){
                    var db = event.target.result;
                    var tx = db.transaction('addressList','readonly');
                    var store = tx.objectStore('addressList');

                    // 打开游标，遍历customers中所有数据
                    store.openCursor().onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            //console.log(JSON.stringify(cursor.value));
                            dbData.push({"userAddress":cursor.value.userAddress,"userAlias":cursor.value.userAlias,"userHelp":cursor.value.userHelp});                            cursor.continue();
                        }
                    }
                    this.tableData=dbData;
                    console.log(this.tableData);
                }
            },
        }
    }
</script>
<style lang="less">
    @import url("../../assets/css/style.less");

    .users {
        width: 90%;
        margin: auto;
        h2 {
            font-size: 16px;
            text-align: center;
            line-height: 20px;
            margin-bottom: 28px;
        }
        .back {
            margin-left: 0px;
        }
    }
</style>