<template>
  <span>
    <template v-if="hasTolls">
      <el-button v-if="isbutton" type="primary" icon="plus" size="medium"
                 @click="dialogTableVisible = true"><slot></slot></el-button>
      <div v-else class="address-input" @click="dialogTableVisible = true">
        <div class="search-input">
          <span class="search-item" v-for="item in chosedHeadRealyData">
            <img v-if="item.dataType==='user'" :src="item.avatar">
            <img v-if="item.dataType==='depart'" :src="require('@/assets/images/depart.png')">
            <img v-if="item.dataType==='group'" :src="require('@/assets/images/group.png')">
            <img v-if="item.dataType==='school'" :src="require('@/assets/images/depart.png')">
            <span class="search-item-des">{{item.name}}<template
                v-if="item.dataType === 'user' || item.dataType === 'depart'">({{item.schoolName}})</template></span>
          </span>
        </div>
        <span v-show="chosedHeadRealyData.length===0" class="noda-info">点击选择范围</span>
      </div>
    </template>
    <el-dialog id="address-dialog" :title="config.title?config.title:'请选择操作范围'" :visible.sync="dialogTableVisible"
               :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false'
               top="50px !important" @open="addressOpen">
      <div class="address-body">
        <div class="address-input el-table__body-wrapper">
          <div class="search-input">
            <span class="search-item" v-for="item in chosedHeadData">
              <img v-if="item.dataType==='user'" :src="item.avatar">
              <img
                  v-if="item.dataType==='depart' || item.dataType === 'school' || item.dataType === 'schoolType' || item.dataType === 'area'"
                  :src="require('@/assets/images/depart.png')">
              <img v-if="item.dataType==='group'" :src="require('@/assets/images/group.png')">
             <span class="search-item-des">{{item.name}}<span
                 v-if="item.dataType === 'user'">({{item.schoolName}})</span></span>
              <span class="search-item-del" @click="delCurrentHeaderData(item)"></span>
            </span>
          </div>
          <el-input v-if="config.depart.target!='depart'" class="inline-input" v-model="searchContent"
                    placeholder="请输入姓名或手机快速找人" icon="search" @input="handleInputChange"></el-input>
        </div>
        <div class="search-result-box">

      <div class="search-result el-table__body-wrapper" v-show="searchContent.length>0">
        <ul>
          <li v-if="searchData.length>0" v-for="item in searchData" @click="searchChose(item)" class=""><img
              class="seacher-img" :src="item.avatar">
            <span >{{item.name}}({{item.schoolName}})</span>
          </li>
          <li v-if="searchData.length==0" class=""><span>没有匹配的信息~</span></li>
        </ul>
      </div>

        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane v-if="config.depart" label="组织架构" name="departTree">
            <div>
              <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in chosedOrgData" :key="item.id" @click.native="loadMenuData(item)">{{item.name}}</el-breadcrumb-item>
              </el-breadcrumb>
              <div class="address-datalist">
                <ul class="address-box">
                 <template v-if="activeDepartData.length > 0" v-for="item in activeDepartData">
                    <li v-if="checkShowOrg(item.dataType)">
                      <div class="address-box-item" v-if="checkShowOrg(item.dataType)">
                        <div class="address-list-title">
                          <img
                              v-if="item.dataType === 'depart' || item.dataType === 'school'"
                              class="address-data-img"
                              :src="require('@/assets/images/depart.png')"/>
                          <img v-else class="address-data-img" :src="item.avatar"/>
                            <span v-if="item.dataType==='depart'" class="link-type-gray"
                                  :class="{ 'link-type':item.hasChild==1}"
                                  @click="loadNextDepart(item)">{{ item.name }}</span>

                            <template v-else-if="item.dataType==='school'">
                                <template v-if="!checkOnlySchool">
                                    <span class="link-type-gray"
                                          :class="{ 'link-type':item.hasChild==1}"
                                          @click="loadSchool(item)">{{ item.name }}</span>
                                </template>
                                <template v-else>
                                    <span class="link-type-gray" style="cursor: default;">{{ item.name }}</span>
                                </template>
                            </template>
                            <span v-else>{{ item.name }}</span>
                        </div>
                        <div class="address-list-bars">
                          <el-checkbox v-if="checkOrgCheckBox(item)" :key="item.id" :disabled="item.disabled"
                                       :checked="item.checked" v-model="item.checked"
                                       @change="handleSelectionChange(item)"></el-checkbox>
                        </div>
                      </div>
                  </li>
                </template>
                <template v-if="activeDepartData.length === 0">
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
                  <el-radio-group v-if="isOrg" @change="userTypesChange" v-model="userType">
                    <el-radio :label="0">全部</el-radio>
                    <el-radio :label="1">老师</el-radio>
                    <el-radio :label="3">家长</el-radio>
                  </el-radio-group>
                <el-checkbox style="float:right;" v-if="!config.SingleChose"
                             @change="handleOrgCheckAllChange">全选</el-checkbox>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="config.group" label="常用组" name="group">
            <div>
              <el-button v-show="showGroupBackBtn" type="text" @click.native="loadInitGroup">&lt; 返回</el-button>
              <div class="address-datalist">
                <ul class="address-box">
                  <li v-for="item in groupData">
                    <div class="address-box-item">
                      <div class="address-list-title">
                        <img v-if="item.dataType==='group'" class="address-data-img"
                             :src="require('@/assets/images/group.png')"/>
                        <img v-else class="address-data-img" :src="item.avatar"/>
                        <span :class="{ 'link-type':item.hasChild}" class="link-type-gray"
                              @click="loadGroupUsers(item)">{{ item.name | strToHtml }}<span
                            v-if="item.dataType === 'user'">({{item.schoolName}})</span></span>
                      </div>
                      <div class="address-list-bars">
                        <el-checkbox :key="item.id" :disabled="item.disabled" v-model="item.checked"
                                     @change="handleSelectionChange(item)"></el-checkbox>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <el-checkbox style="float:right;" v-if="!config.SingleChose && checkIsChooseAll()"
                             @change="handleGroupCheckAllChange">全选</el-checkbox>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="choseAddressBtn" size="medium">确 定</el-button>
      </div>
    </el-dialog>
  </span>
</template>
<script>
    import {strToHtml} from '@/utils/utils';

    import {
        intAreaOrg,
        queryByDepartId,
        retrievalUsers,
        queryByGroupId
    } from '@/api/schoolUnion/organization';
    import {
        delCurrentHeaderData,
        queryByDepartIdDistrict,

    } from '@/api/addressBox';
    import mixin from '@/mixins/windowResize';
    import $ from 'jquery';
    import debounce from 'lodash/debounce';

    export function getDepartIds(activeDepartData) {
        let departIds = '';
        if (activeDepartData) {
            for (let i = 0; i < activeDepartData.length; i++) {
                if (activeDepartData[i].dataType == 'depart' || activeDepartData[i].dataType == 'school') {
                    departIds += activeDepartData[i].id + ',';
                }
            }
        }
        return departIds;
    }

    function packageCheckedOrg(menuData, id) {
        let packgeArray = [];
        for (let item of menuData) {
            packgeArray.push(item);
            if (item.type === 'school') {
                if (item.rawId === id) {
                    break;
                }
            } else {
                if (item.id === id) {
                    break;
                }
            }

        }
        return packgeArray;
    }

    // 获取提交数据库时处理过的数据
    function getCommitAddressParams(chosedArray) {
        const userSchoolIdList = [], departSchoolIdList = [];
        const departArray = [];
        const groupArray = [];
        const userArray = [];
        const schoolArray = [];
        const schoolTypeArray = [];
        const areaArray = [];
        chosedArray.forEach(function (element) {
            let itemJsonStr = element;
            switch (element.dataType) {
                case 'area':
                    areaArray.push(itemJsonStr);
                    break;
                case 'depart':
                    if (departSchoolIdList.indexOf(itemJsonStr.schoolId) !== -1) {
                        departArray.find(({schoolId}) => schoolId === itemJsonStr.schoolId).departList.push(itemJsonStr);
                    } else {
                        departSchoolIdList.push(itemJsonStr.schoolId);
                        departArray.push({
                            schoolId: itemJsonStr.schoolId,
                            schoolName: itemJsonStr.schoolName,
                            departList: [itemJsonStr]
                        });
                    }
                    break;
                case 'group':
                    groupArray.push(itemJsonStr);
                    break;
                case 'user':
                    if (userSchoolIdList.indexOf(itemJsonStr.schoolId) !== -1) {
                        userArray.find(({schoolId}) => schoolId === itemJsonStr.schoolId).userList.push(itemJsonStr);
                    } else {
                        userSchoolIdList.push(itemJsonStr.schoolId);
                        userArray.push({
                            schoolId: itemJsonStr.schoolId,
                            schoolName: itemJsonStr.schoolName,
                            userList: [itemJsonStr]
                        });
                    }
                    break;
                case 'school':
                    schoolArray.push(itemJsonStr);
                    break;
                case 'schoolType':
                    schoolTypeArray.push(itemJsonStr);
                    break;
            }
        });
        return {
            userType: this.userType,
            departJson: departArray,
            groupJson: groupArray,
            userJson: userArray,
            schoolJson: schoolArray,
            schoolTypeJson: schoolTypeArray,
            postJson: areaArray && areaArray.length !== 0 ? areaArray[0] : null
        };
    }

    function getHeaderJson(data) {
        let result = '';
        switch (data.dataType) {
            case 'area':
                result = {
                    id: data.id,
                    name: data.name,
                    dataType: 'area',
                    type: 'area',
                };
                break;
            case 'depart':
                result = {
                    id: data.id,
                    name: data.name,
                    wxDepartId: data.wxDepartId,
                    schoolName: data.schoolName,
                    dataType: 'depart',
                    type: data.type,
                    schoolId: data.schoolId,
                };
                break;
            case 'user':
                result = {
                    id: data.id,
                    name: data.name,
                    loginname: data.loginname,
                    schoolId: data.schoolId,
                    schoolName: data.schoolName,
                    dataType: 'user',
                    avatar: data.avatar,
                    mobile: data.mobile,
                    type: data.type,
                };
                break;
            case 'group':
                result = {
                    id: data.id,
                    name: data.name,
                    wxTagId: data.wxTagId,
                    dataType: 'group',
                    type: data.type,
                };
                break;
            case 'school':
                result = {
                    id: data.id,
                    name: data.name,
                    dataType: 'school',
                };
                break;
            case 'schoolType':
                result = {
                    id: data.id,
                    name: data.name,
                    dataType: 'schoolType',
                    type: data.type,
                };
                break;
        }
        return result;
    }

    /**
     * 获取头部选择的集合
     * @param {*} chosedArray
     * @param {*} currentObj
     */
    export function getChosedData(chosedArray, currentObj, SingleChose, target) {
        let newChosedArray = [];
        if (target === 'all' || target == currentObj.dataType) {
            if (SingleChose) { //如果是线段
                newChosedArray.push(getHeaderJson(currentObj));
            } else {
                if (chosedArray.length > 0) {
                    let flag = 0;
                    for (let item of chosedArray) {
                        if (item.id != currentObj.id) {
                            newChosedArray.push(getHeaderJson(item));
                        } else {
                            flag++;
                        }
                    }
                    if (flag === 0) {
                        newChosedArray.push(getHeaderJson(currentObj));
                    }
                } else {
                    newChosedArray.push(getHeaderJson(currentObj));
                }
            }
        } else {
            newChosedArray = chosedArray;
        }
        return newChosedArray;
    }

    function packgeHeaderArray(dataArray) {
        console.log(333, dataArray)
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

    //检测是否存在相同的数据，用于判断头部是否有当前列表的数据
    function isHeaderHasSameId(headerList, id, schoolId) {
        let result = headerList.filter(function (item) {
            if (item.dataType === 'school') {
                return item.id == schoolId;
            } else {
                return item.id == id;
            }
        });
        return result.length > 0;
    }


    function packgeDepartArray(dataArray, pchecked, headerList, filterJson) {
        if (filterJson.departType === undefined) {
            filterJson.departType = 'all';
        }
        const packageArray = [];
        if (dataArray.schoolArray) {
            for (let item of dataArray.schoolArray) {
                packageArray.push({
                    id: item.schoolId,
                    rawId: item.id,
                    pid: item.pId,
                    rawDataType: item.dataType,
                    name: item.name,
                    checked: !!pchecked || isHeaderHasSameId(headerList, item.id, item.schoolId),
                    dataType: 'school',
                    hasChild: item.hasChild === 1,
                    children: [],
                    disabled: !!pchecked,
                    isChecked: item.isChecked
                });
            }
        }

        if (dataArray.departArray) {
            for (let item of dataArray.departArray) {
                packageArray.push({
                    id: item.id,
                    pid: item.pid,
                    name: item.name,
                    wxDepartId: item.wxDepartId,
                    schoolId: item.schoolId,
                    schoolName: item.schoolName,
                    checked: !!pchecked || isHeaderHasSameId(headerList, item.id),
                    dataType: 'depart',
                    hasChild: item.hasChild === 1,
                    children: [],
                    disabled: !!pchecked,
                    type: item.type,
                    isChecked: 0
                });
            }
        }
        if (dataArray.userArray) {

            for (let item of dataArray.userArray) {
                packageArray.push({
                    id: item.id,
                    pid: item.pid,
                    name: item.name,
                    schoolId: item.schoolId,
                    schoolName: item.schoolName,
                    loginname: item.loginname,
                    checked: !!pchecked || isHeaderHasSameId(headerList, item.id),
                    mobile: item.mobile,
                    dataType: 'user',
                    hasChild: false,
                    avatar: item.photoImg,
                    disabled: !!pchecked,
                    type: item.type,
                    isChecked: 0
                });
            }
        }
        if (dataArray.groupArray) {
            for (let item of dataArray.groupArray) {
                packageArray.push({
                    id: item.id,
                    pid: item.pid,
                    name: item.name,
                    wxTagId: item.wxTagId,
                    checked: !!pchecked || isHeaderHasSameId(headerList, item.id),
                    dataType: 'group',
                    hasChild: false,
                    disabled: !!pchecked,
                    type: item.type,
                    isChecked: 0
                });
            }
        }
        return packageArray;
    }

    export default {
        props: {
            checkOnlySchool: {
                type: Boolean,
                default: false
            },
            value: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            config: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            isbutton: {
                type: Boolean,
                default: false
            },
            hasTolls: {
                type: Boolean,
                default: true
            },
            dataSuffix: {
                type: String,
                default: 'Json'
            },
            isOrg: {
                type: Boolean,
                default: false
            },
        },
        filters: {strToHtml},

        data() {
            return {
                activeName: this.config.depart ? 'departTree' : 'group',
                dialogTableVisible: false,
                searchContent: '',
                departData: [],//所有depart集合包含user
                activeDepartData: [],//当前选中的depart列表包含user
                departMenu: [],//部门menu
                groupData: [],
                groupMenu: [],//群组menu
                chosedOrgData: [{name: '全部', id: -1000}],//已选择的部门、用户、群组数据
                chosedHeadData: [],//头部选中的集合
                chosedHeadRealyData: [],//头部集合实际数据，在点击确定时赋值
                showGroupBackBtn: false,//控制显示加载群组返回按钮
                orgCheckAll: false,
                groupCheckAll: false,
                isIndeterminateOrg: true,
                cutH: 0,
                dragging: false,
                searchData: [],//检索结果
                seatchRootIds: '',//检索条件用的参数，用于记录搜索根目录下的部门id拼接
                userType: this.isOrg ? 0 : 1
            }
        },
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
                this.userType = val.userType === undefined ? 1 : val.userType;
                this.chosedHeadRealyData = packgeHeaderArray(obj);
                this.chosedHeadData = this.chosedHeadRealyData;
            }
        },
        mixins: [mixin],
        created() {
            this.initCreated();
        },
        mounted() {
            this.$nextTick(() => {
                let _this = this;
                // $('#address-dialog .el-dialog').height(this.maxH );
                $('#address-dialog .address-box').height(this.maxH - 100 - 300);
                let iX = 0;
                let iY = 0;
                $(".el-dialog__header").mousedown(function (e) {
                    _this.dragging = true;
                    iX = e.clientX - $('#address-dialog .el-dialog').position().left;
                    iY = e.clientY - $('#address-dialog .el-dialog').position().top;
                    return false;
                });
                document.onmousemove = function (e) {
                    if (_this.dragging) {
                        var e = e || window.event;
                        var oX = e.clientX - iX;
                        var oY = e.clientY - iY;
                        if (oY > 0) {
                            $("#address-dialog .el-dialog").css('cssText', 'left:' + oX + 'px !important;' + 'top:' + oY + 'px !important');
                        } else {
                            _this.dragging = false;
                        }
                        return false;
                    }
                };
                $("#address-dialog .el-dialog__header").mouseup(function (e) {
                    _this.dragging = false;
                });
            })
        },
        methods: {
            getCommitAddressParams,
            packgeDepartArray,
            userTypesChange() {
                this.chosedHeadData = [];
                const array = [];
                this.activeDepartData.forEach(function (departItem) {
                    departItem.checked = false;
                    array.push(departItem);
                });
                this.activeDepartData = array;
                this.$emit('input', this.getCommitAddressParams(this.chosedHeadData));

                this.initCreated();
            },
            checkIsChooseAll() {
                return true;
                // console.log(this.chosedOrgData[this.chosedOrgData.length - 1]);
                // if(this.chooseAllScopes.length === 0) {
                //     return true;
                // } else {
                //     return this.chooseAllScopes.indexOf(this.chosedOrgData[this.chosedOrgData.length - 1].type) !== -1;
                // }
            },
            initCreated() {//初始化cretead方法，用于在creared和open的时候调用
                intAreaOrg()
                    .then(res => res.data)
                    .then(data => {
                        this.generateInitTree(data);
                    })
                    .then(res => {
                        this.chosedHeadData = this.chosedHeadRealyData;

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
                        this.seatchRootIds = getDepartIds(this.activeDepartData);
                    }).catch();
            },
            loadSchool(item, isTrack = true) {
                if (this.config.depart.target !== 'school' || item.hasChild) {
                    queryByDepartIdDistrict({
                        departId: item.rawId,
                        userTypes: this.userType === 0 ? '1,3' : this.userType
                    })
                        .then(res => res.data)
                        .then(data => {
                            this.activeDepartData = this.packgeDepartArray({
                                departArray: data.data.departs,
                                userArray: data.data.users
                            }, item.checked, this.chosedHeadData, {departType: this.config.depart.departType});


                            this.searchRootIds = getDepartIds(this.activeDepartData);

                            if (isTrack) {
                                this.chosedOrgData.push({
                                    name: item.name,
                                    type: 'school',
                                    id: item.id,
                                    rawId: item.rawId
                                });
                            }
                        })
                }
            },
            loadNextDepart(row) {
                if (this.config.depart.target == 'depart' && row.hasChild == false) {//如果是选择部门且没有子部门
                    return;
                }
                const id = row.id;
                queryByDepartId({
                    departId: id,
                    userTypes: this.userType == 0 ? '1,3' : this.userType
                }).then(res => {
                    const packgeData = packgeDepartArray({
                        departArray: res.data.data.departs,
                        userArray: res.data.data.users
                    }, row.checked, this.chosedHeadData, {departType: this.config.depart.departType});
                    this.activeDepartData = packgeData;
                    this.chosedOrgData.push({name: row.name, id: row.id});
                    this.$nextTick(function () {
                        this.initTableChecked();
                    })
                }).catch();
            },
            loadInitGroup() {//初始化群组信息
                intAreaOrg()
                    .then(res => res.data)
                    .then(data => {
                        this.generateInitTree(data);
                    }).catch();
                this.showGroupBackBtn = false;
            },
            generateInitTree(data) {
                const pageData = data.data;

                const packgeData = packgeDepartArray({
                    schoolArray: pageData.school.childs,
                    userArray: pageData.users
                }, false, this.chosedHeadData, {departType: this.config.depart.departType});
                this.activeDepartData = packgeData;
                this.groupData = packgeDepartArray({
                    groupArray: pageData.groups
                }, false, this.chosedHeadData, {departType: this.config.depart.departType});
            },
            loadGroupUsers(row) {//加载群组用户
                console.log(row)
                if(row.dataType === 'group') {
                    queryByGroupId({
                        groupId: row.id
                    }).then(res => {
                        this.groupData = packgeDepartArray({userArray: res.data.data.users}, row.checked, this.chosedHeadData, {departType: this.config.depart.departType});
                    }).catch();
                    this.showGroupBackBtn = true;
                }
            },
            checkOrgCheckBox(data) {//检查是否显示checkbox复选框
                let ckeckResult = true;
                if (data.dataType === 'school') {
                    if (this.config.depart.isIgnoreSchool) {
                        ckeckResult = false;
                    } else {
                        return data.isChecked === 0;
                    }
                }
                if (this.config.depart.target == 'user' && data.dataType == 'depart') {
                    ckeckResult = false;
                }
                if (this.config.depart.isIgnoreDepart) {
                    if (data.type == 2 || data.type == 5) {
                        ckeckResult = false;
                    }
                }
                return ckeckResult;
            },
            loadMenuData(item) {
                const id = item.type === 'school' ? item.rawId : item.id;
                const type = item.type;
                this.chosedOrgData = packageCheckedOrg(this.chosedOrgData, id);//处理地址簿导航栏
                if (type === 'school') {
                    this.loadSchool(item, false);
                } else {
                    if (id === -1000) {
                        intAreaOrg()
                            .then(res => {
                                const packgeData = packgeDepartArray({
                                    schoolArray: res.data.data.school.childs,
                                    userArray: res.data.data.users
                                }, false, this.chosedHeadData, {departType: this.config.depart.departType});
                                this.activeDepartData = packgeData;
                            }).catch();
                    } else {
                        queryByDepartId({
                            departId: id,
                            userTypes: this.userType == 0 ? '1,3' : this.userType

                        }).then(res => {//加载点击数据
                            const packgeData = packgeDepartArray({
                                departArray: res.data.data.departs,
                                userArray: res.data.data.users
                            }, false, this.chosedHeadData, {departType: this.config.depart.departType});
                            this.activeDepartData = packgeData;
                        }).catch();
                    }
                }

            },
            handleSelectionChange(row) {//列表checkbox点击事件
                if (row.checked) {
                    this.chosedHeadData = getChosedData(this.chosedHeadData, row, this.config.SingleChose, this.config.depart.target);
                    if (this.config.SingleChose) {
                        this.activeDepartData.forEach(function (item) {
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
                this.chosedHeadData = delCurrentHeaderData(this.chosedHeadData, row.id);
                let array = [];
                this.activeDepartData.forEach(function (item) {
                    if (item.id === row.id) {
                        item.checked = !item.checked;
                    }
                    array.push(item);
                });
                this.activeDepartData = array;
            },
            initTableChecked() {//初始化列表中的checkedbox

            },
            choseAddressBtn() {//地址簿确定按钮
                this.dialogTableVisible = false;
                let outAddress = this.getCommitAddressParams(this.chosedHeadData);
                this.$emit('input', outAddress);
                this.$emit('confirm', outAddress);

            },
            handleOrgCheckAllChange(event) {
                let array = [];
                let _this = this;
                this.activeDepartData.forEach(function (item) {

                    console.log(item)

                    if (event && item.checked == false && (item.type || item.dataType === 'school')) {//如果全选按钮是选中且当前数据不是选中状态
                        _this.chosedHeadData = getChosedData(_this.chosedHeadData, item, _this.config.SingleChose, _this.config.depart.target);
                    }
                    if (event == false && item.checked == true) {//如果全选按钮是选中且当前数据是选中状态，则删除
                        _this.chosedHeadData = delCurrentHeaderData(_this.chosedHeadData, item.id);
                    }
                    item.checked = event;//将当前数据的状态同全选复选框状态保持一致
                    array.push(item);

                });
                this.activeDepartData = array;
                this.isIndeterminateOrg = false;
            },
            handleGroupCheckAllChange(event) {
                let array = [];
                let _this = this;
                this.groupData.forEach(function (item) {
                    if (event && item.checked == false) {//如果全选按钮是选中且当前数据不是选中状态
                        _this.chosedHeadData = getChosedData(_this.chosedHeadData, item, _this.config.SingleChose, _this.config.depart.target);
                    }
                    if (event == false && item.checked == true) {
                        _this.chosedHeadData = delCurrentHeaderData(_this.chosedHeadData, item.id);
                    }
                    item.checked = event;//将当前数据的状态同全选复选框状态保持一致
                    array.push(item);

                });
                this.groupData = array;
                this.isIndeterminateOrg = false;
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
                if (data.type == 5) {
                    ckeckResult = !this.config.depart.notCheckSchool;
                }

                return ckeckResult;
            },
            handleInputChange: debounce(
                function (val) {
                    console.log(this.searchContent);
                    let excludeUserIdsStr = '';
                    this.chosedHeadData.forEach(function (item) {
                        excludeUserIdsStr += item.id + ',';
                    });
                    let queryList = {
                        condition: this.searchContent.trim(),
                        excludeUserIdsStr: excludeUserIdsStr
                    };
                    console.log(this.seatchRootIds);
                    if (this.seatchRootIds.length > 0) {
                        retrievalUsers(queryList).then(res => {
                            const packgeData = packgeDepartArray({userArray: res.data.data}, false, this.chosedHeadData, {departType: this.config.depart.departType});
                            this.searchData = packgeData;
                        }).catch();
                    }
                },
                500
            ),
            searchChose(row) {
                //处理选择的数据
                this.chosedHeadData = getChosedData(this.chosedHeadData, row, this.config.SingleChose, this.config.depart.target);
                if (this.config.SingleChose) {
                    this.activeDepartData.forEach(function (item) {
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
            showAddress() {//此方法用于ref的调用，适用hasTolls为false的情况
                this.dialogTableVisible = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../../styles/mixin.scss";

    .address-input {
        border: 1px solid #bfcbd9;
        min-height: 40px;
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


