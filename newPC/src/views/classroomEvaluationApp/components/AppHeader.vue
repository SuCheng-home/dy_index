<template>
    <div class="main-header">
        <div class="logo">
            <img src="https://cdnfile-10043692.file.myqcloud.com/schoollogo/defaultschoollogo.png">
            <span>智慧校园课堂</span>
        </div>
        <div class="info">
            <img :src="userInfo.avatar"><span class="info__name">{{userInfo.name}}</span>
        </div>
        <h1>
            <slot></slot>
            <span class="sub-title">
                <slot name="sub"></slot>
            </span>
        </h1>
    </div>
</template>

<script>
    import {mapGetters } from 'vuex';
    export default {
        name: "header",
        computed: {
            ...mapGetters(['userInfo'])
        }
    }
</script>

<style lang="scss" scoped>
    body, h1, h2, h3, h4, h5, h6, ul, ol, p {
        font-family: "Microsoft YaHei";
        margin: 0;
        padding: 0;
        font-weight: normal;
    }
    .main-header {
        text-align: center;
        background-color: #0099E8;
        color: #fff;
        padding: 0 20px;
    }
    .logo {
        float: left;
        height: 50px;
        padding-top: 6px;
        img {
            height: 38px;
            width: 38px;
            vertical-align: middle;
        }
    }
    .main-header h1 {
        font-size: 18px;
        line-height: 50px;
    }
    .info {
        float: right;
        height: 50px;
        padding-top: 6px;
        img {
            border-radius: 50%;
            height: 38px;
            vertical-align: middle;
            width: 38px;
        }
        .info__name {
            margin: 0 20px;
        }
    }
    .sub-title {
        font-size: 16px;
    }
</style>
