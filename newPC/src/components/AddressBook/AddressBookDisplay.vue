<template>
    <div>
        <div class="address-input">
            <div class="search-input">
          <span class="search-item" v-for="item in chosedHeadRealyData">
            <img v-if="item.dataType==='user'" :src="item.avatar">
            <img v-if="item.dataType==='depart'" :src="require('@/assets/images/depart.png')">
            <img v-if="item.dataType==='group'" :src="require('@/assets/images/group.png')">
            <img v-if="item.dataType==='schoolType'" :src="require('@/assets/images/depart.png')">
            <img v-if="item.dataType==='school'" :src="require('@/assets/images/depart.png')">
              <img v-if="item.dataType==='area'" :src="require('@/assets/images/depart.png')">
            <span class="search-item-des">{{item.name}}<span
                v-if="item.dataType === 'user'">({{item.schoolName}})</span></span>
          </span>
            </div>
            <span v-show="chosedHeadRealyData.length===0" class="noda-info">暂无数据</span>
        </div>
    </div>
</template>
<script>
    import {strToHtml} from '@/utils/utils';
    import mixin from '@/mixins/windowResize';

    function packgeHeaderArray(dataArray) {
        let packageArray = [];

        if (dataArray.departArray !== undefined) {
            dataArray.departArray.forEach(schoolItem => {
                for (let item of schoolItem.departList) {
                    packageArray.push({
                        id: item.id,
                        name: item.name,
                        wxDepartId: item.wxDepartId,
                        schoolId: item.schoolId,
                        schoolName: item.schoolName,
                        dataType: 'depart',
                        type: item.type,
                    });
                }
            });
        }
        if (dataArray.userArray !== undefined) {
            dataArray.userArray.forEach(schoolItem => {
                for (let item of schoolItem.userList) {
                    packageArray.push({
                        id: item.id,
                        name: item.name,
                        loginname: item.loginname,
                        schoolId: item.schoolId,
                        schoolName: item.schoolName,
                        dataType: 'user',
                        avatar: item.avatar,
                        mobile: item.mobile,
                        type: item.type,
                    });
                }
            })

        }
        if (dataArray.groupArray !== undefined) {
            for (let item of dataArray.groupArray) {
                packageArray.push({
                    id: item.id,
                    name: item.name,
                    wxTagId: item.wxTagId,
                    dataType: 'group',
                    type: item.type,
                });
            }
        }
        if (dataArray.schoolArray !== undefined) {
            for (let item of dataArray.schoolArray) {
                packageArray.push({
                    id: item.id,
                    name: item.name,
                    dataType: 'school',
                    schoolType: item.schoolType
                });
            }
        }
        if (dataArray.schoolTypeArray !== undefined) {
            for (let item of dataArray.schoolTypeArray) {
                packageArray.push({
                    id: item.id,
                    name: item.name,
                    dataType: 'schoolType',
                    type: item.type,
                });
            }
        }
        if (dataArray.areaArray !== undefined) {
            for (let item of dataArray.areaArray) {
                if (item) {
                    packageArray.push({
                        id: item.id,
                        name: item.name,
                        dataType: 'area',
                        type: 'area',
                    });
                }
            }
        }
        return packageArray;
    }

    export default {
        props: {
            value: {
                type: Array,
                default: function () {
                    return []
                }
            },
        },
        data() {
            return {
                chosedHeadData: [],//头部选中的集合
                chosedHeadRealyData: [],//头部集合实际数据，在点击确定时赋值
            }
        },
        filters: {strToHtml},
        watch: {
            value(val) {
                const obj = {
                    departArray: val.departJson || [],
                    userArray: val.userJson || [],
                    groupArray: val.groupJson || [],
                    schoolArray: val.schoolJson || [],
                    schoolTypeArray: val.schoolTypeJson || [],
                    areaArray: [val.postJson] || []
                };
                this.chosedHeadRealyData = packgeHeaderArray(obj);
                this.chosedHeadData = this.chosedHeadRealyData;
            }
        },
        mixins: [mixin],
        created() {
            if (this.value) {
                let obj = {
                    departArray: this.value.departJson || [],
                    userArray: this.value.userJson || [],
                    groupArray: this.value.groupJson || [],
                    schoolTypeArray: this.value.schoolTypeJson || [],
                    schoolArray: this.value.schoolJson || [],
                    areaArray: this.value.postJson ? [this.value.postJson] : []
                };

                this.chosedHeadRealyData = packgeHeaderArray(obj);
                this.chosedHeadData = this.chosedHeadRealyData;
            }

            this.chosedOrgData = [{name: '全部', id: -1000}];
        },
    }
</script>

<style lang="scss" scoped>
    @import "./../../styles/mixin.scss";

    .address-input {
        border: 1px solid #bfcbd9;
        min-height: 36px;
        background-image: none;
        border-radius: 4px;
        max-height: 70px;
        overflow-y: auto;
        position: relative;
    }

    .noda-info {
        color: #bfcbd9;
        padding-left: 10px;
        line-height: 34px;
    }

    .address-body {
        min-height: 400px;
        position: relative;
    }

    .el-dialog__body {
        border-top: 1px solid #bfcbd9;
    }

    .address-input input {
        border: 0px solid #bfcbd9 !important;
    }

    .el-dialog__body {
        padding-top: 10px !important;
    }

    .address-data-img {
        position: relative;
        top: 8px;
        width: 24px;
        max-height: 24px;
    }

    .search-input {
        padding-top: 2px;
    }

    .search-item {
        height: 25px;
        margin-left: 4px;
        margin-top: 2px;
        margin-right: 5px;
        line-height: 25px;
        display: inline-block;
        background-color: #eee;
        border-radius: 3px;
        padding-right: 4px;
        float: left;
        margin-bottom: 2px;
    }

    .search-item > img {
        float: left;
        width: 25px;
        height: 25px;
        margin-right: 3px;
    }

    .search-item-del {
        display: block;
        float: right;
        width: 13px;
        height: 13px;
        margin-top: 6px;
        margin-left: 4px;
        background: url(../../assets/images/close.png) left top no-repeat;
        cursor: pointer;
    }

    .search-item-del:hover {
        background-position: 0px -13px;
    }

    .address-box {
        height: 300px;
        overflow-y: auto;
        -webkit-padding-start: 0px;
        @include scrollBar;
        border-left: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
    }

    .search-result ul {
        -webkit-padding-start: 0px;
        padding-left: 0px;

    }

    .search-result ul img {
        position: relative;
        top: 6px;
    }

    .address-box li {
        height: 45px;
    }

    .address-box li, .search-result li {
        list-style: none;
        border-bottom: 1px solid #dfe6ec;
        padding: 2px 10px;
    }

    .address-box li:hover, .search-result li:hover {
        background-color: #eef1f6;
    }

    .address-box-item {
        // display: flex;
        position: relative;
    }

    .address-list-title {
        // flex: 1;
        display: inline-block;
    }

    .address-list-bars {
        width: 20px;
        float: right;
        display: inline-block;
    }

    .search-result {
        min-height: 35px;
        max-height: 130px;
        border: 1px solid #E5E5E5;
        margin-left: auto;
        margin-right: auto;
        overflow-y: auto;
        background-color: white;
        opacity: 1;
        position: relative;
        left: 0;
        top: 0;
        z-index: 9999;
    }

    .search-result img {
        width: 23px;
    }

    .search-result li span {
        margin-left: 10px;
    }

    .search-result-box {
        position: absolute;
        width: 100%;
    }

    #address-dialog .inline-input {
        width: 220px;
    }

    .link-type-gray {
        cursor: pointer;
    }

    .seacher-img {
        width: 24px;
        height: 24px;
    }

</style>
<style>
    #address-dialog .el-dialog__header {
        cursor: move;
    }

    #address-dialog .el-checkbox {
        line-height: 40px;
    }

    #address-dialog .inline-input input {
        border: 0px solid #d1dbe5;
        border-radius: 4px 0px 0px 0px;
        padding-left: 30px;
        padding-right: 0px;
    }

    #address-dialog .inline-input .el-input__icon {
        left: 0px !important;
    }

    #address-dialog .el-dialog {
        /* position: absolute; */
        margin: 0 auto;
        max-height: 700px;
    }

    #address-dialog .el-dialog__body {
        padding: 5px 20px;
    }

</style>
