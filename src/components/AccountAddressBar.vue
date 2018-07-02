<template>
  <!--账户地址下拉框 address select -->
  <div class="address-select" @click="showDataList">
    <div class="sub-selected-value">
      {{accountAddressValue}}
      <div class="sub-select-list" v-if="showData">
        <div class="sub-select-item" v-for="item in getAddressList"
             @click.stop="accountAddressChecked(item.address,item.encrypted)">
          {{item.address}}
        </div>
      </div>
    </div>
    <i class="el-icon-arrow-up" :class="showData ? 'i_reverse':''"></i>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showData: false,
        accountAddressValue: '',
      }
    },
    computed: {
      getAddressList() {
        return this.$store.getters.getAddressList
      },
    },
    created() {
      /**
       * 判断是不有默认账户
       * There is no default account
       */
      if (localStorage.getItem('newAccountAddress') !== '') {
        this.accountAddressValue = localStorage.getItem('newAccountAddress')
      } else {
        this.accountAddressValue = this.$t('message.addressNull')
      }

      /**
       * 判断vuex账户列表里有没有数据
       * vuex in no data
       */
      if (this.$store.getters.getAddressList.length === 0) {
        this.getAccountList('/account')
      }
    },
    methods: {
      showDataList() {
        if (this.$store.getters.getAddressList.length !== 0) {
          this.showData = !this.showData
        } else {
          this.accountAddressValue = this.$t('message.c134')
        }
      },
      /**
       * 获取账户地址列表
       * Get a list of account addresses
       * @param url
       */
      getAccountList(url) {
        this.$fetch(url)
          .then((response) => {
            if (response.success) {
              localStorage.setItem('newAccountAddress', response.data.list[0].address);
              localStorage.setItem('encrypted', response.data.list[0].encrypted);
              this.$store.commit('setAddressList', response.data.list)
            } else {
              this.$store.commit('setAddressList', '')
            }
          }).catch((reject) => {
          //console.log('User List err' + reject);
          this.$store.commit('setAddressList', '')
        })
      },

      /**
       * 选择账户地址
       *Select account address
       * @param accountAddress
       */
      accountAddressChecked(accountAddress, encrypted) {
        this.showData = false;
        this.accountAddressValue = accountAddress;
        this.$emit('chenckAccountAddress', accountAddress);
        localStorage.setItem('newAccountAddress', accountAddress);
        localStorage.setItem('encrypted', encrypted)
        //console.log(accountAddress);
      }
    },
  }
</script>
<style lang="less">
  .address-select {
    position: relative;
    float: left;
    border: 1px solid #658ec7;
    height: 24px;
    width: 410px;
    color: #FFFFFF;
    right: 0;
    top: -1px;
    font-size: 12px;
    line-height: 24px;
    padding: 0 0 0 2px;
    i {
      position: absolute;
      top: 3px;
      right: 5px;
      content: '';
      width: 20px;
      height: 15px;
      color: #FFFFFF;
      text-align: center;
      transform: rotateZ(180deg);
      transition: transform .3s;
      &.i_reverse {
        transform: rotateZ(0);
        top: 5px;
      }
    }
    .sub-selected-value {
      position: absolute;
      padding-left: 6px;
      .sub-select-list {
        position: absolute;
        top: 32px;
        background: white;
        border: 1px solid #658ec7;
        z-index: 9;
        margin-left: -9px;
        max-height: 350px;
        overflow-x: auto;
        transition: transform .3s;
        .sub-select-item {
          width: 410px;
          height: 26px;
          line-height: 26px;
          position: relative;
          text-align: left;
          color: #FFFFFF;
          background-color: #0c1323;
          padding: 0 0 0 5px;
          &:hover {
            background-color: #17202e;
          }
        }
        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
          background-color: #0c1323;
          border-radius: 10px;
        }

        &::-webkit-scrollbar {
          width: 3px;
          background-color: #0c1323;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-image: -webkit-gradient(linear, 40% 0%, 75% 84%, from(#FFFFFF), to(#FFFFFF), color-stop(.6, #FFFFFF))
        }
      }
    }

  }
</style>
