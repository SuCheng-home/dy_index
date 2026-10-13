<template>
    <div id="app">
        <keep-alive>
                <router-view v-if="$route.meta.isCached"></router-view>
            </keep-alive>
        <router-view v-if="!$route.meta.isCached"></router-view>
        <div id="wxcep-dialog"></div>
    </div>
</template>

<script>
    export default {
        name: 'APP',
        beforeDestroy() {
            sessionStorage.setItem('standaloneHasLogin', 0);
        }
    }
</script>
<style>
  pre {
    white-space: pre-wrap;       /* 允许文本换行 */
    word-wrap: break-word;       /* 确保长单词也能换行 */
    overflow-wrap: break-word;   /* 与 word-wrap 相同，用于现代浏览器 */
    max-width: 100%;            /* 设置最大宽度 */
  }
.el-button--text {
    padding: 4px !important;
}
.no_list_msg{
    text-align: center;
}
.mywidthdaterange{
    width:220px !important;
}
.el-pagination{
        float: right !important;
}
.el-button.is-disabled.buttontextred {
        color: #C0C4CC !important;
    }
.buttontextred {
        color: #F56C6C !important;
    }
    .important-hint {
        color: #ff0000;
    }
    .link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-menu{
        border-right: none !important;
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 4px;
    }

    .el-table td, .el-table th {
        padding: 8px 0;
    }

    ::-webkit-scrollbar {
        width: 6px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    ::-webkit-scrollbar-thumb {
        background-color: #999;
    }

    ::-webkit-scrollbar-track {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .el-radio-group {
        overflow: hidden;
    }

    .side-item .side-item__icon {
        margin-right: 5px;
    }

    .el-submenu__title i {
        margin-right: 5px;
    }
    .new-editor .el-form-item__error{
        left:-69px !important;
    }
</style>

<style lang="scss">
    .rich-editor {
        line-height: 1em;
    }

    .print-only {
        display: none !important;
    }

    @media print {
        .noprint {
            display: none !important;
        }
        .print-only {
            display: block !important;

            &.print-only--inline-block {
                display: inline-block !important;
            }
        }
    }

    body {
        -webkit-print-color-adjust: exact;
        background: #fff;
    }

    .form-item--richtext .el-form-item__content {
        line-height: inherit !important;
    }

    .form-item--richtext {
        .el-form-item__content {
            transform: translateX(1px);
        }
    }

    .page-main--scroller {
        overflow-y: auto;
        height: 600px;
        overflow-x: hidden;
    }

    .page-main--scroller::-webkit-scrollbar {
        width: 6px;
    }

    .page-main--scroller::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
    }

    .page-main--scroller::-webkit-scrollbar-track-piece {
        background: #d3dce6;
    }

    .search-input--right {
        width: 20.83333% !important;
        float: right;
    }
    .form--display {
        .el-form-item {
            margin: 17px 0 34px 0;
            line-height: 1em;
        }
        .el-form-item__label, .el-form-item__content {
            line-height: 1em;
        }
        .el-form-item__label {
            color: #5f5f5f;
        }
        .el-form-item__content {
            color: #333;
        }
    }
    .pagination-container {
        margin-top: 10px;
    }
    @media (max-height: 800px) {
        .el-table td, .el-table th {
            padding: 5px 0;
        }
    }

</style>
