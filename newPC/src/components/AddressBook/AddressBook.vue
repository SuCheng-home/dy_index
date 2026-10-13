<template>
    <div>
        <template v-if="isShowEntry">
            <el-button v-if="isButton" class="filter-item" type="primary" icon="plus"
                       @click="isShowAddressDialog = true">
                <slot></slot>
            </el-button>
            <div v-else class="address-input" @click="isShowAddressDialog = true">
                <div class="search-input">
                    <div class="search-item" v-for="item in choosedData">
                        <img v-if="item.dataType==='user'" :src="item.avatar">
                        <img v-if="item.dataType==='depart'" :src="require('@/assets/images/depart.png')">
                        <img v-if="item.dataType==='group'" :src="require('@/assets/images/group.png')">
                        <span class="search-item-des">{{item.name}}</span>
                    </div>
                </div>
                <span v-show="choosedData.length===0" class="noda-info">点击选择范围</span>
            </div>
        </template>
        <el-dialog id="address-dialog" :title="config.title || '请选择操作范围'" :visible.sync="isShowAddressDialog"
                   :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false'
                   top="50px !important" @open="addressOpen">
            <div class="address-body">
                <div class="address-input el-table__body-wrapper">
                    <div class="search-input">
                        <div class="search-item" v-for="item in choosedHeadData">
                            <img v-if="item.dataType==='user'" :src="item.avatar">
                            <img v-if="item.dataType==='depart'" :src="require('@/assets/images/depart.png')">
                            <img v-if="item.dataType==='group'" :src="require('@/assets/images/group.png')">
                            <span class="search-item-des">{{item.name}}</span>
                            <span class="search-item-del" @click="delCurrentHeaderData(item)"></span>
                        </div>
                    </div>
                    <el-input v-if="isShowSearch" class="inline-input" v-model.trim="searchContent"
                              placeholder="请输入姓名或手机快速找人" icon="search" @input="handleInputChange"></el-input>
                </div>
                <div class="search-result-box">
                    <div class="search-result el-table__body-wrapper" v-show="searchContent !== ''">
                        <ul>
                            <li v-if="searchData.length !== 0" v-for="item in searchData" @click="searchChose(item)">
                                <img class="seacher-img" :src="item.avatar">
                                <span>{{item.name}}</span>
                            </li>
                            <li v-else><span>没有匹配的信息</span></li>
                        </ul>
                    </div>
                </div>
                <el-tabs v-model="activeName">
                    <el-tab-pane v-if="config.depart" label="组织架构" name="departTree">
                        <div>
                            <el-breadcrumb separator="/">
                                <el-breadcrumb-item v-for="item in navData" :key="item.id"
                                                    @click.native="loadMenuData(item.id)">{{item.name}}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                            <div class="address-datalist">
                                <ul class="address-box">
                                    <template v-if="currentDepartData.length>0" v-for="item in currentDepartData">
                                        <li v-if="checkShowOrg(item.dataType)">
                                            <div class="address-box-item">
                                                <div class="address-list-title">
                                                    <template v-if="item.dataType === 'depart'">
                                                        <img class="address-data-img"
                                                             :src="require('@/assets/images/depart.png')"/>
                                                        <span
                                                            :class="{
                                                                'link-type': item.hasChild==1,
                                                                'link-type-gray': true
                                                              }"
                                                            @click="loadNextDepart(item)">{{ item.name }}</span>
                                                    </template>
                                                    <template v-else>
                                                        <img class="address-data-img" :src="item.avatar"/>
                                                        <span>{{ item.name }}</span>
                                                    </template>
                                                </div>
                                                <div class="address-list-bars">
                                                    <el-checkbox v-if="checkOrgCkeckBox(item)" :key="item.id"
                                                                 :disabled="item.disabled"
                                                                 :checked="item.checked" v-model="item.checked"
                                                                 @change="handleSelectionChange(item)"></el-checkbox>
                                                </div>
                                            </div>
                                        </li>
                                    </template>
                                    <template v-if="currentDepartData.length === 0">
                                        <li>
                                            <div class="address-box-item">
                                                <div class="address-list-title">
                                                    <span>暂无数据！</span>
                                                </div>
                                            </div>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                            <div>
                                <el-checkbox style="float:right;" v-if="!config.singleChoose"
                                             @change="handleOrgCheckAllChange">全选
                                </el-checkbox>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane v-if="config.group" label="常用组" name="group">
                        <div>
                            <el-button v-show="isShowGroupBackBtn" type="text" @click.native="loadInitGroup">&lt; 返回
                            </el-button>
                            <div class="address-datalist">
                                <ul class="address-box">
                                    <li v-for="item in groupData">
                                        <div class="address-box-item">
                                            <div class="address-list-title">
                                                <img v-if="item.dataType==='group'" class="address-data-img"
                                                     :src="require('@/assets/images/group.png')"/>
                                                <img v-else class="address-data-img" :src="item.avatar"/>
                                                <span :class="{ 'link-type':item.hasChild}" class="link-type-gray"
                                                      @click="loadGroupUsers(item)">{{ item.name }}</span>
                                            </div>
                                            <div class="address-list-bars">
                                                <el-checkbox :key="item.id" :disabled="item.disabled"
                                                             v-model="item.checked"
                                                             @change="handleSelectionChange(item)"></el-checkbox>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <el-checkbox style="float:right;" v-if="!config.singleChoose"
                                             @change="handleGroupCheckAllChange">全选
                                </el-checkbox>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowAddressDialog = false">取 消</el-button>
                <el-button type="primary" @click="addressBookConfirmHandler">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        init,
        queryByDepartId,
        packgeHeaderArray,
        delCurrentHeaderData,
        retrievalUsers,
        queryByGroupId,
        getCommitAddressParams,
        getUserDepartOrg
    } from '@/api/addressBox';
    import mixin from '@/mixins/windowResize';
    import $ from 'jquery';
    import debounce from 'lodash/debounce';

    //通过部门id检测此部门是否在当前的departType控制线显示
    function checkShowDepartBytype(departType, type) {
        var isShowDepart = false;
        switch (departType) {
            case 't':
                isShowDepart = [1, 7, 5].indexOf(type) !== -1;
                break;
            case 's':
                isShowDepart = [2, 3, 4, 5].indexOf(type) !== -1;
                break;
            case 'sf':
                isShowDepart = [10, 5, 11, 12].indexOf(type) !== -1;
                break;
            case 'outside':
                isShowDepart = [20, 5, 21].indexOf(type) !== -1;
                break;
            case 'tOrOutside':
                isShowDepart = [1, 7, 20, 5, 21].indexOf(type) !== -1;
                break;
            case 'all':
                isShowDepart = true;
                break;
        }
        return isShowDepart;
    }

    export default {
        props: {
            value: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            isShowSearch: {
                type: Boolean,
                default: true
            },
            config: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            mode: {
                type: String,
                default: 'release'
            },
            isButton: {
                type: Boolean,
                default: false
            },
            isShowEntry: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                activeName: this.config.depart ? 'departTree' : 'group',
                isShowAddressDialog: false,
                searchContent: '',
                departData: [],//所有depart集合包含user
                currentDepartData: [],//当前选中的depart列表包含user
                departMenu: [],//部门menu
                groupData: [],
                groupMenu: [],//群组menu
                navData: [{name: '全部', id: -1000}],//已选择的部门、用户、群组数据
                choosedHeadData: [],//头部选中的集合
                choosedData: [],//头部集合实际数据，在点击确定时赋值
                isShowGroupBackBtn: false,//控制显示加载群组返回按钮
                orgCheckAll: false,
                groupCheckAll: false,
                isIndeterminateOrg: true,
                cutH: 0,
                dragging: false,
                searchData: [],//检索结果
                seatchRootIds: ''//检索条件用的参数，用于记录搜索根目录下的部门id拼接

            }
        },
        watch: {
            value(val) {
                let arrayHeaderData = [];
                this.choosedData = packgeHeaderArray({
                    departArray: val.departJson,
                    userArray: val.userJson,
                    groupArray: val.groupJson
                });
                this.choosedHeadData = this.choosedData;
            }
        },
        mixins: [mixin],
        created() {
            this.initCreated();
        },
        mounted() {
            // this.$nextTick(() => {
            //     let _this = this;
            //     // $('#address-dialog .el-dialog').height(this.maxH );
            //     $('#address-dialog .address-box').height(this.maxH - 100 - 300);
            //     let iX = 0;
            //     let iY = 0;
            //     $(".el-dialog__header").mousedown(function (e) {
            //         _this.dragging = true;
            //         iX = e.clientX - $('#address-dialog .el-dialog').position().left;
            //         iY = e.clientY - $('#address-dialog .el-dialog').position().top;
            //         return false;
            //     });
            //     document.onmousemove = function (e) {
            //         if (_this.dragging) {
            //             var e = e || window.event;
            //             var oX = e.clientX - iX;
            //             var oY = e.clientY - iY;
            //             if (oY > 0) {
            //                 $("#address-dialog .el-dialog").css('cssText', 'left:' + oX + 'px !important;' + 'top:' + oY + 'px !important');
            //             } else {
            //                 _this.dragging = false;
            //             }
            //             return false;
            //         }
            //     };
            //     $("#address-dialog .el-dialog__header").mouseup(function (e) {
            //         _this.dragging = false;
            //     });
            // })
        },
        methods: {
            getHeaderJson(data) {
                let result = {
                    id: data.id,
                    name: data.name,
                    dataType: data.dataType,
                    type: data.type
                };
                switch (data.dataType) {
                    case 'depart':
                        result.wxDepartId = data.wxDepartId;
                        break;
                    case 'user':
                        result.loginname = data.loginname;
                        result.avatar = data.avatar;
                        result.mobile = data.mobile;

                        break;
                    case 'group':
                        result.wxTagId = data.wxTagId;
                        break;
                }
                return result;
            },

            getChosedData(chosedArray, currentObj) {
                const choosedData = [];
                if (this.config.depart.target === 'all' || this.config.depart.target === currentObj.dataType) {
                    if (this.config.singleChoose) {
                        choosedData.push(this.getHeaderJson(currentObj));
                    } else {
                        let flag = 0;
                        this.choosedData.forEach(item => {
                            if (item.id !== currentObj.id) {
                                choosedData.push(this.getHeaderJson(item));
                            } else {
                                flag++;
                            }
                        });
                        if (flag === 0) {
                            
                            choosedData.push(this.getHeaderJson(currentObj));
                        }
                    }
                }
                this.choosedHeadData = choosedData;
            },
            getDepartIds() {
                let departIds = '';
                if (this.currentDepartData) {
                    for (let i = 0; i < this.currentDepartData.length; i++) {
                        if (this.currentDepartData[i].dataType === 'depart') {
                            departIds += this.currentDepartData[i].id + ',';
                        }
                    }
                }
                return departIds;

            },
            packgeDepartArray(dataArray, pchecked) {
                const departType = this.config.depart.departType || 'all';
                let packageArray = [];
                ['depart', 'user', 'group']
                    .forEach(keyName => {
                        const key = `${keyName}Array`;
                        if (!!dataArray[key]) {

                            for (let item of dataArray[key]) {
                                if (key !== 'departArray' || checkShowDepartBytype(departType, item.type)) {
                                    const dataItem = {
                                        id: item.id,
                                        pid: item.pid,
                                        name: item.name,
                                        checked: pchecked || this.choosedHeadData.some(function (headerItem) {
                                            return headerItem.id === item.id;
                                        }),
                                        dataType: keyName,
                                        children: [],
                                        disabled: pchecked,
                                        type: item.type,
                                        hasChild: keyName === 'depart' ? item.hasChild === 1 : false,
                                    };
                                    if (key === 'groupArray') {
                                        dataItem.wxTagId = item.wxTagId;
                                    } else if (key === 'departArray') {
                                        dataItem.wxDepartId = item.wxDepartId;
                                    } else {
                                        dataItem.loginname = item.loginname;
                                        dataItem.mobile = item.mobile;
                                        dataItem.avatar = item.photoImg;
                                    }
                                    packageArray.push(dataItem);
                                }
                            }
                        }
                    });
                return packageArray;
            },
            initCreated() {//初始化cretead方法，用于在creared和open的时候调用
                new Promise((resolve => {
                    if(this.mode === 'release') {
                        init().then(res => {
                            resolve(res.data.data);
                        });
                    } else {
                        getUserDepartOrg()
                            .then(res => {
                                resolve(res.data);
                            });
                    }
                }))
                    .then(data => {
                        this.currentDepartData = this.packgeDepartArray({
                            departArray: data.departs,
                            userArray: data.users
                        }, false);

                        this.groupData = this.packgeDepartArray({groupArray: data.groups}, false);
                        this.choosedHeadData = this.choosedData;

                        if (this.value) {
                            this.choosedData = packgeHeaderArray({
                                departArray: this.value.departJson,
                                userArray: this.value.userJson,
                                groupArray: this.value.groupJson
                            });
                            this.choosedHeadData = this.choosedData;
                        }

                        this.navData = [{name: '全部', id: -1000}];
                        this.seatchRootIds = this.getDepartIds();
                    });

                init().then(res => {

                }).catch();
            },
            loadNextDepart(row) {
                if (this.config.depart.target !== 'depart' || row.hasChild) {
                    const id = row.id;
                    new Promise(resolve => {
                        if(this.mode === 'release') {
                            queryByDepartId(id, this.config.depart.userTypes)
                                .then(res => resolve(res.data.data));
                        } else {
                            getUserDepartOrg(id)
                                .then(res => resolve(res.data));
                        }

                    })
                        .then(data => {
                            this.currentDepartData = this.packgeDepartArray({
                                departArray: data.departs,
                                userArray: data.users
                            }, row.checked);
                            this.navData.push({
                                name: row.name,
                                id: row.id
                            });
                        }).catch();

                }

            },
            loadInitGroup() {//初始化群组信息
                init()
                    .then(res => {
                        this.groupData = this.packgeDepartArray({groupArray: res.data.data.groups}, false);
                    }).catch();
                this.isShowGroupBackBtn = false;
            },
            loadGroupUsers(row) {//加载群组用户
                queryByGroupId(row.id).then(res => {
                    this.groupData = this.packgeDepartArray({userArray: res.data.data.users}, row.checked);
                }).catch();
                this.isShowGroupBackBtn = true;
            },
            loadMenuData(id) {
                this.navData = this.navData.slice(0, this.navData.findIndex(item => item.id === id) + 1);//处理地址簿导航栏
                new Promise((resolve) => {
                    if (id === -1000) {
                        if(this.mode === 'release') {
                            init()
                                .then(res => {
                                    resolve(res.data.data)
                                });
                        } else {
                            getUserDepartOrg()
                                .then(res => resolve(res.data));
                        }

                    } else {
                        if(this.mode === 'release') {
                            queryByDepartId(id, this.config.depart.userTypes).then(res => {
                                resolve(res.data.data);
                            });
                        } else {
                            getUserDepartOrg(id)
                                .then(res => resolve(res.data));
                        }

                    }
                })
                    .then(data => {
                        this.currentDepartData = this.packgeDepartArray({
                            departArray: data.departs,
                            userArray: data.users
                        }, false);
                    });
            },
            handleSelectionChange(row) {//列表checkbox点击事件
                if (row.checked) {
                    this.getChosedData(this.choosedHeadData, row);
                    if (this.config.singleChoose) {
                        this.currentDepartData.forEach(function (item) {
                            item.checked = false;
                        });
                        this.groupData.forEach(function (item) {
                            item.checked = false;
                        });
                        row.checked = true;
                    }
                } else {
                    this.delCurrentHeaderData(row);
                    row.checked = false;
                }


            },
            delCurrentHeaderData(row) {//头部删除当前的选择项
                this.choosedHeadData = delCurrentHeaderData(this.choosedHeadData, row.id);
                let array = [];
                this.currentDepartData.forEach(function (item) {
                    if (item.id === row.id) {
                        item.checked = !item.checked;
                    }
                    array.push(item);
                });
                this.currentDepartData = array;
            },
            addressBookConfirmHandler() {//地址簿确定按钮
                this.isShowAddressDialog = false;
                this.$emit('input', getCommitAddressParams(this.choosedHeadData));

            },
            handleOrgCheckAllChange(event) {
                let array = [];
                let _this = this;
                this.currentDepartData.forEach(function (item) {
                    if (event && item.checked == false) {//如果全选按钮是选中且当前数据不是选中状态
                        this.getChosedData(_this.choosedHeadData, item);
                    }
                    if (event == false && item.checked == true) {//如果全选按钮是选中且当前数据是选中状态，则删除
                        _this.choosedHeadData = delCurrentHeaderData(_this.choosedHeadData, item.id);
                    }

                    item.checked = event;//将当前数据的状态同全选复选框状态保持一致
                    array.push(item);

                });
                this.currentDepartData = array;
                this.isIndeterminateOrg = false;
            }, handleGroupCheckAllChange(event) {
                let array = [];
                let _this = this;
                this.groupData.forEach(function (item) {
                    if (event && item.checked == false) {//如果全选按钮是选中且当前数据不是选中状态
                        this.getChosedData(_this.choosedHeadData, item);
                    }
                    if (event == false && item.checked == true) {
                        _this.choosedHeadData = delCurrentHeaderData(_this.choosedHeadData, item.id);
                    }
                    item.checked = event;//将当前数据的状态同全选复选框状态保持一致
                    array.push(item);

                });
                this.groupData = array;
                this.isIndeterminateOrg = false;
            },
            setdefault(vaule) {
                this.choosedHeadData = this.choosedHeadData.concat(JSON.parse(vaule.departJson)).concat(JSON.parse(vaule.userJson)).concat(JSON.parse(vaule.groupJson));
                this.choosedData = this.choosedHeadData;
                this.addressBookConfirmHandler();
            },
            checkShowOrg(data) {//检查是否显示部门,用于控制部门和用户的显示，根据config.target参数来控制
                let ckeckResult = true;
                if (this.config.depart.target == 'depart' && data == 'user') {
                    ckeckResult = false;
                }
                return ckeckResult;
            },
            checkOrgCkeckBox(data) {//检查是否显示checkbox复选框
                let ckeckResult = true;
                if (this.config.depart.target == 'user' && data.dataType == 'depart') {
                    ckeckResult = false;
                }
                if (this.config.depart.isIgnoreDepart) {
                    if (data.type == 1 || data.type == 2 || data.type == 5) {
                        ckeckResult = false;
                    }
                }
                return ckeckResult;
            },
            handleInputChange: debounce(
                function (val) {
                    const token = this.$store.getters.token;
                    let excludeUserIdsStr = '';
                    this.choosedHeadData.forEach(function (item) {
                        excludeUserIdsStr += item.id + ',';
                    });
                    let queryList = {
                        condition: this.searchContent.trim(),
                        userTypes: this.config.depart.userTypes,
                        token: token,
                        excludeUserIdsStr: excludeUserIdsStr,
                        departIds: this.seatchRootIds
                    };
                    if (this.seatchRootIds.length > 0) {
                        retrievalUsers(queryList).then(res => {
                            this.searchData = this.packgeDepartArray({userArray: res.data.data}, false);
                        }).catch();
                    }
                },
                500
            ),
            searchChose(row) {
                //处理选择的数据
                this.getChosedData(this.choosedHeadData, row);
                if (this.config.singleChoose) {
                    this.currentDepartData.forEach(function (item) {
                        item.checked = false;
                    });
                    this.groupData.forEach(function (item) {
                        item.checked = false;
                    });
                    row.checked = true;
                }

                //选择完成后列表数据的处理
                this.searchContent = '';
                this.searchData = [];
            },
            addressOpen() {
                this.initCreated();
            },
            showAddress() {//此方法用于ref的调用，适用isShowEntry为false的情况
                this.isShowAddressDialog = true;
            }
        }
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
        border: 0 solid #bfcbd9 !important;
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
        z-index: 99999999;
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


