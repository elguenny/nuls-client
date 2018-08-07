<template>
  <div class="users">
    <Back :backTitle="this.$t('message.setManagement')"></Back>
    <div class="users-conter">
      <h2>{{$t('message.c93')}}</h2>
      <el-button type="primary" icon="el-icon-plus" @click="toNewAccount()" class="newAccount"></el-button>
      <el-table :data="tableData">
        <el-table-column prop="userAddress" :label="$t('message.c69')" min-width="288" align='center'>
        </el-table-column>
        <!--<el-table-column prop="userAlias" :label="$t('message.tabAlias')" width="100" align='center'>
        </el-table-column>-->
        <el-table-column prop="userHelp" :label="$t('message.remarks')" width="180" align='center'>
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
      <el-pagination layout="prev, pager, next" :page-size="15" :total=this.totalAll
                     v-show="totalAllOk = this.totalAll>15 ?true:false" class="cb"
                     @current-change="consensusSize"></el-pagination>
    </div>
    <el-dialog :title="$t('message.c96')" :visible.sync="dialogFormVisible" top="24vh" @close="userListClose">
      <el-form ref="userListForm" :model="userListForm" :rules="userListFormRules" label-width="80px">
        <el-form-item :label="$t('message.c69')" prop="userAddress">
          <el-input v-model.trim="userListForm.userAddress" :maxlength="35"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.remarks')">
          <el-input v-model.trim="userListForm.userHelp" :maxlength="20"></el-input>
        </el-form-item>
        <!--<div class="userAlias">{{$t('message.tabAlias')}} {{userListForm.userAlias}}</div>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserAccount('userListForm')" id="userList">
          {{$t('message.confirmButtonText')}}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Back from '@/components/BackBar.vue';
  import {setDB, Editor} from '@/api/indexDB.js'

  export default {
    data() {
      return {
        tableData: [],
        database: null,
        dialogFormVisible: false,
        totalAll: 0,
        userListForm: {
          userAddress: '',
          userAlias: '',
          userHelp: '',
        },
        userListFormRules: {
          userAddress: [
            {required: true, message: this.$t('message.c116'), trigger: 'blur'},
            {min: 10, max: 35, message: this.$t('message.c117'), trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      Back,
    },
    mounted() {
      this.justifyIndexDEB();
      setTimeout(() => {
        this.getUserList(this.database,1, 15);
      }, 200);
    },
    methods: {

      //给userlist添加数据
      addUserAccount(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              'userAddress': this.userListForm.userAddress,
              'userHelp': this.userListForm.userHelp
            };
            _this.editData(_this.database, params);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      /**
       * 判断是否支持indexedDB执行下面函数
       **/
      justifyIndexDEB() {
        if ("indexedDB" in window) {
          this.createindexDB();
        } else {
          console.log("对不起，您的浏览器不支持indexedDB，建议您使用google浏览器");
        }
      },

      /**
       * 创建或者打开indexedDB
       */
      createindexDB() {
        let _this = this;
        const dbInfo = {
          dbName: "usersDB",
          dbVersion: 1,
          dbInstance: {}
        };
        //创建数据库 indexedDB.open方法用于打开数据库。返回的是一个对象，第一个参数是数据库名称，格式为字符串。第二个参数是数据库版本。
        let openRequest = window.indexedDB.open(dbInfo.dbName, dbInfo.dbVersion);
        //创建数据库时会触发三个事件onupgradeneeded，success，onerror
        openRequest.onupgradeneeded = function (e) {
          let db = e.target.result;
          let storeNames = db.objectStoreNames;
          //创建数据库的表格（或者叫数据库仓库）
          if (!storeNames.contains('addressList')) {
            db.createObjectStore('addressList', {
              keyPath: "userAddress",
              autoIncrement: false
            })
          }
        };
        //success：打开成功
        openRequest.onsuccess = function (e) {
          _this.database = e.target.result;
        };
        //数据库打开失败
        openRequest.onerror = function (e) {
          console.log("数据库打开失败...");
          console.dir(e);
        }
      },

      /**
       *添加、编辑数据
       * @param db
       * @param params
       **/
      editData(db, params) {
        let _this = this;
        let transaction = db.transaction(["addressList"], "readwrite");
        let objectStore = transaction.objectStore("addressList");
        let request = objectStore.put(params);
        request.onsuccess = function (e) {
          _this.getUserList(_this.database,1, 15);
          _this.userListForm.userAddress = '';
          _this.userListForm.userHelp = '';
          _this.dialogFormVisible = false
        };
        request.onerror = function (e) {
          console.log("Error", e);
        };
      },

      /**
       * 删除数据
       * @param db
       * * @param userAddress
       */
      delData(db,userAddress) {
        let _this = this;
        let transaction = db.transaction(["addressList"], "readwrite");
        let req = transaction.objectStore("addressList").delete(userAddress);
        req.onerror = function (e) {
          console.log("删除数据失败！");
        };
        req.onsuccess = function (e) {
          _this.getUserList(_this.database,1, 15);
        }
      },

      /**
       * 遍历数据：读取userList
       *
       **/
      getUserList(db,pageNumber, pageSize) {
        let dbData = [];
        let trans = db.transaction(["addressList"], "readonly");
        let store = trans.objectStore("addressList");
        let cursor = store.openCursor();
        cursor.onsuccess = function (e) {
          let res = e.target.result;
          if (res) {
            dbData.push(res.value);
            res.continue();
          }
        };
        //显示总条数
        setTimeout(() => {
          this.totalAll = dbData.length;
          if (pageNumber === 1) {
            //console.log(pageNumber)
            this.tableData = dbData.slice(0, pageSize);
          } else {
            this.tableData = dbData.slice((pageNumber - 1) * 15, pageNumber * 15);
          }
        }, 50);
      },

      /**
       * 交易列表分页
       * @param events
       */
      consensusSize(events) {
        this.getUserList(events, 15);
      },

      //新增通讯录
      toNewAccount() {
        this.dialogFormVisible = true;
        this.userListForm.userAddress = '';
        this.userListForm.userAlias = '';
        this.userListForm.userHelp = '';
      },

      //修改一条通讯录
      editorRow(userAddress, userAlias, userHelps) {
        this.dialogFormVisible = true;
        this.userListForm.userAddress = userAddress;
        this.userListForm.userAlias = userAlias;
        this.userListForm.userHelp = userHelps;
      },

      //删除通讯录一条记录
      deleteRow(userAddress) {
        let _this = this;
        this.$confirm(this.$t('message.c115'), this.$t('message.c86'), {
          confirmButtonText: this.$t('message.confirmButtonText'),
          cancelButtonText: this.$t('message.cancelButtonText'),
        }).then(() => {
          _this.delData(_this.database,userAddress);
        }).catch(() => {
        });
      },

      //关闭清理数据
      userListClose() {
        this.$refs['userListForm'].resetFields();
      },
    }
  }
</script>
<style lang="less">
  @import url("../../assets/css/style.less");

  .users {
    width: 1024px;
    margin: auto;
    .users-conter {
      width: 100%;
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
    }

    .el-dialog {
      background-color: #0b1422;
      .userAlias {
        line-height: 20px;
        margin-left: 40px;
        color: #606266;
        margin-bottom: 10px;
      }
      .el-dialog__title {
        color: #C1C5C9;
        font-size: 16px;
        text-align: center;
        line-height: 4rem;
        font-weight: bold;
      }
      .el-dialog__header {
        padding: 30px 0 20px;
        text-align: center;
      }
      .el-dialog__body {
        .el-form {
          .el-form-item {
            .el-form-item__label {
              padding: 13px 10px 0 0;
            }
            margin-bottom: 10px;
            .el-input {
              height: 35px;
              input {
                padding: 0 5px;
                color: #f0f7ff;
              }
            }
            .el-form-item__error {
              top: 20px;
              padding: 0;
            }
          }
        }
      }
      .el-dialog__footer {
        text-align: center;
        .el-button--primary {
          width: 145px;
          margin-right: 0;
        }
      }
    }
  }
</style>
