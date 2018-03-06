<template>
    <div class="modal-overlay" @click="hideShow">
        <div class="modal-data">
            <div class="qrcode">
            </div>
        </div>
    </div>
</template>
<script>
    import {jquery} from '@/assets/js/jquery.min.js'
    import {jvectormap} from '@/assets/js/jquery.qrcode.min.js'
    export default {
        data() {
            return {
            }
        },
        mounted() {
            let _this = this;
        },
        methods: {
            codeMaker(codeInfo){
                $('.qrcode').html("");
                $('.qrcode').qrcode({
                    render: "canvas",
                    width: 256,
                    height: 256,
                    text: codeInfo,
                    typeNumber: -1,
                    correctLevel: 2,
                    background: "#ffffff",
                    foreground: "#000000"
                });
            },
            /** Hidden hideShow
             * @method hideShow
             * @author Wave
             * @date 2018-2-11
             * @version 1.0
             **/
            hideShow() {
                this.$emit("codeShowOks","false");
            }
        }
    }
</script>
<style lang="less">
    .modal-overlay {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        text-align: center;
        z-index: 1000;
        background-color: #333;
        opacity: 0.85;
        .modal-data {
            width: 100%;
            height: 100%;
            padding: 100px auto;
            text-align: center;
            .qrcode {
                padding: 20% 0 0 0;
            }
        }
    }
</style>