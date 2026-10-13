<template>
  <span>
    <template v-if="hasTolls">
      <el-button v-if="isbutton" class="filter-item" type="primary" icon="plus"
                 @click="dialogTableVisible = true"><slot></slot></el-button>
      <div v-else class="address-input" @click="dialogTableVisible = true">
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
          <template v-if="!isOrg">
              <el-input v-if="config.depart.target!='depart'" class="inline-input" v-model="searchContent"
                        placeholder="请输入姓名或手机快速找人" icon="search" @input="handleInputChange"></el-input>
          </template>
        </div>
        <div class="search-result-box">

          <div class="search-result el-table__body-wrapper" v-show="searchContent.length>0">
            <ul>
              <li v-if="searchData.length>0" v-for="item in searchData" @click="searchChose(item)" class=""><img
                  class="seacher-img" :src="item.avatar">
                <span>{{item.name}}({{item.schoolName}})</span>
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
                              v-if="item.dataType === 'depart' || item.dataType === 'schoolType' || item.dataType === 'school' || item.dataType === 'area'"
                              class="address-data-img"
                              :src="require('@/assets/images/depart.png')"/>
                          <img v-else class="address-data-img" :src="item.avatar"/>
                            <span v-if="item.dataType==='depart'" class="link-type-gray"
                                  :class="{ 'link-type':item.hasChild==1}"
                                  @click="loadNextDepart(item)">{{ item.name }}</span>


                            <template v-else-if="item.dataType==='schoolType'">
                                <span class="link-type-gray"
                                      :class="{ 'link-type':item.hasChild==1}"
                                      @click="loadSchoolType(item)">{{ item.name }}</span>
                            </template>


                            <template v-else-if="item.dataType==='school'">
                                <template v-if="!isOrg">
                                    <span class="link-type-gray"
                                          :class="{ 'link-type':item.hasChild==1}"
                                          @click="loadSchool(item)">{{ item.name }}</span>
                                </template>
                                <template v-else>
                                    <span class="link-type-gray" style="cursor: default;">{{ item.name }}</span>
                                </template>
                            </template>
                            <template v-else-if="item.dataType === 'area'">
                                <span class="link-type-gray"
                                      :class="{ 'link-type':item.hasChild==1}"
                                      @click="loadArea(item)">{{ item.name }}</span>
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
                   <el-radio-group v-if="!isOrg && hasScope" @change="userTypesChange" v-model="userType">
                    <el-radio :label="0">全部</el-radio>
                    <el-radio :label="1">老师</el-radio>
                    <el-radio :label="3">家长</el-radio>
                  </el-radio-group>
                <el-checkbox style="float:right;" v-if="!config.SingleChose"
                             @change="handleOrgCheckAllChange">全选</el-checkbox>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="choseAddressBtn">确 定</el-button>
      </div>
    </el-dialog>
  </span>
</template>
<script>
    import {
        init,
        queryByDepartIdDistrict,
        delCurrentHeaderData,
        retrievalUsersDistrict,
        queryByGroupId,
        intAreaOrg
    } from '@/api/addressBox';
    import mixin from '@/mixins/windowResize';
    import $ from 'jquery';
    import debounce from 'lodash/debounce';

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

    /**
     * 根据部门集合获取id拼接
     * @param {*} activeDepartData
     */
    export function getDepartIds(activeDepartData) {
        if (activeDepartData) {
            return activeDepartData.map(({dataType, id}) => dataType === 'depart' ? id : '').filter((item => item !== '')).join(',');
        } else {
            return '';
        }
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

    /**
     * 处理头部集合数据
     * @param {*} json
     */
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
                if(item) {
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


    //通过部门id检测此部门是否在当前的departType控制线显示
    function checkShowDepartBytype(departType, type, userType) {
        var isShowDepart = false;
        if (type == '21' || type == '20' || type == '10' || type == '5' || type == '7' || type == '11' || type == '12') {
            isShowDepart = true;
        }

        switch (userType) {
            // case 't':
            case 1:
                if (type == '1' || type == '7') {
                    isShowDepart = true;
                }
                break;
            case 3:
                if (type == '2' || type == '3' || type == '4') {
                    isShowDepart = true;
                }
                break;
            case 0:
                isShowDepart = true;
                break;

        }
        return isShowDepart;
    }


    function packgeDepartArray(dataArray, pchecked, headerList, filterJson) {
        if (filterJson.departType === undefined) {
            filterJson.departType = 'all';
        }
        const packageArray = [];
        if (dataArray.areaArray !== undefined) {
            for (let item of dataArray.areaArray) {
                packageArray.push({
                    id: item.id,
                    name: item.name,
                    dataType: 'area',
                    hasChild: true,
                    children: item.childs,
                    checked: isHeaderHasSameId(headerList, item.id),
                    isChecked: item.isChecked
                });
            }
        }

        if (dataArray.schoolTypeArray !== undefined) {
            for (let item of dataArray.schoolTypeArray) {
                packageArray.push({
                    id: item.id,
                    pid: item.pId,
                    rawDataType: item.dataType,
                    name: item.name,
                    checked: !!pchecked || isHeaderHasSameId(headerList, item.id),
                    dataType: 'schoolType',
                    hasChild: item.hasChild === 1,
                    children: item.childs,
                    disabled: !!pchecked,
                    type: item.type,
                    isChecked: item.isChecked
                });
            }
        }

        if (dataArray.schoolArray !== undefined) {
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

        if (dataArray.departArray !== undefined) {
            for (let item of dataArray.departArray) {
                if (checkShowDepartBytype(filterJson.departType, item.type, this.userType)) {
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
        }
        if (dataArray.userArray !== undefined) {

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
        if (dataArray.groupArray !== undefined) {
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
            hasScope: {
                type: Boolean,
                default: true
            },
            isOrg: {
                type: Boolean,
                default: false
            }
        },
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
                searchRootIds: '',//检索条件用的参数，用于记录搜索根目录下的部门id拼接
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
                $('#address-dialog .address-box').height(this.maxH - 100 - 300);
                let iX = 0;
                let iY = 0;
                $(".el-dialog__header").mousedown(function (e) {
                    const $elDialog = $('#address-dialog').find('.el-dialog');
                    _this.dragging = true;
                    iX = e.clientX - $elDialog.position().left;
                    iY = e.clientY - $elDialog.position().top;
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
            initCreated() {//初始化cretead方法，用于在creared和open的时候调用
                intAreaOrg()
                    .then(res => {
                        res.data.data.childs.forEach((item) => {
                            item.id = item.type;
                        });
                        this.activeDepartData = this.packgeDepartArray({
                            areaArray: [res.data.data]
                        }, false, this.chosedHeadData, {departType: this.config.depart.departType});
                    })
                    .then(() => {
                        if (this.value) {
                            let obj = {
                                departArray: this.value.departJson,
                                userArray: this.value.userJson,
                                groupArray: this.value.groupJson,
                                schoolTypeArray: this.value.schoolTypeJson,
                                schoolArray: this.value.schoolJson,
                                areaArray: [this.value.postJson]
                            };
                            this.chosedHeadRealyData = packgeHeaderArray(obj);
                            this.chosedHeadData = this.chosedHeadRealyData;
                        }

                        this.chosedOrgData = [{name: '全部', id: -1000}];
                        this.searchRootIds = getDepartIds(this.activeDepartData);
                    });
                // init()
                //     .then(res => {
                //     res.data.data.forEach((item) => {
                //         item.id = item.type;
                //     });
                //     this.activeDepartData = this.packgeDepartArray({
                //         schoolTypeArray: res.data.data,
                //     }, false, this.chosedHeadData, {departType: this.config.depart.departType});
                // })
                //     .then(() => {
                //         if (this.value) {
                //             let obj = {
                //                 departArray: this.value.departJson,
                //                 userArray: this.value.userJson,
                //                 groupArray: this.value.groupJson,
                //                 schoolTypeArray: this.value.schoolTypeJson,
                //                 schoolArray: this.value.schoolJson
                //             };
                //             this.chosedHeadRealyData = packgeHeaderArray(obj);
                //             this.chosedHeadData = this.chosedHeadRealyData;
                //         }
                //
                //         this.chosedOrgData = [{name: '全部', id: -1000}];
                //         this.searchRootIds = getDepartIds(this.activeDepartData);
                //     });
            },
            loadNextDepart(item) {
                if (this.config.depart.target !== 'depart' || item.hasChild) {//如果是选择部门且没有子部门
                    const id = item.id;
                    queryByDepartIdDistrict({
                        departId: id,
                        userTypes: this.userType === 0 ? '1,3' : this.userType
                    }).then(res => {
                        this.activeDepartData = this.packgeDepartArray({
                            departArray: res.data.data.departs,
                            userArray: res.data.data.users
                        }, item.checked, this.chosedHeadData, {departType: this.config.depart.departType});
                        this.chosedOrgData.push({name: item.name, id: item.id});
                    }).catch();
                }

            },
            loadArea(item, isTrack = true) {
                this.activeDepartData = this.packgeDepartArray({
                    schoolTypeArray: item.children,
                }, item.checked, this.chosedHeadData, {departType: this.config.depart.departType});
                if (isTrack) {
                    this.chosedOrgData.push({
                        name: item.name,
                        children: item.children,
                        type: 'area',
                        id: item.id
                    });
                }
            },
            loadSchoolType(item, isTrack = true) {
                this.activeDepartData = this.packgeDepartArray({
                    schoolArray: item.children,
                }, item.checked, this.chosedHeadData, {departType: this.config.depart.departType});
                if (isTrack) {
                    this.chosedOrgData.push({
                        name: item.name,
                        children: item.children,
                        type: 'schoolType',
                        id: item.id
                    });
                }
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

                            this.groupData = this.packgeDepartArray({groupArray: data.data.groups}, false, this.chosedHeadData, {departType: this.config.depart.departType});

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
            loadInitGroup() {//初始化群组信息
                init().then(res => {
                    this.groupData = this.packgeDepartArray({groupArray: res.data.data.groups}, false, this.chosedHeadData, {departType: this.config.depart.departType});
                }).catch();
                this.showGroupBackBtn = false;
            },
            loadGroupUsers(item) {//加载群组用户
                queryByGroupId(item.id).then(res => {
                    this.groupData = this.packgeDepartArray({userArray: res.data.data.users}, item.checked, this.chosedHeadData, {departType: this.config.depart.departType});
                }).catch();
                this.showGroupBackBtn = true;
            },
            loadMenuData(item) {
                const id = item.type === 'school' ? item.rawId : item.id;
                const type = item.type;
                this.chosedOrgData = packageCheckedOrg(this.chosedOrgData, id);//处理地址簿导航栏
                if (type === 'area') {
                    this.loadArea(item, false);
                } else if (type === 'school') {
                    this.loadSchool(item, false);
                } else if (type === 'schoolType') {
                    this.loadSchoolType(item, false);
                } else {
                    if (id === -1000) {
                        intAreaOrg()
                            .then(res => {
                                res.data.data.childs.forEach((item) => {
                                    item.id = item.type;
                                });
                                this.activeDepartData = this.packgeDepartArray({
                                    areaArray: [res.data.data]
                                }, false, this.chosedHeadData, {departType: this.config.depart.departType});
                            })
                            .catch();
                    } else {
                        queryByDepartIdDistrict({
                            departId: id,
                            userTypes: this.userType === 0 ? '1,3' : this.userType
                        }).then((res) => {//加载点击数据
                            this.activeDepartData = this.packgeDepartArray({
                                departArray: res.data.data.departs,
                                userArray: res.data.data.users
                            }, false, this.chosedHeadData, {departType: this.config.depart.departType});
                        }).catch();
                    }
                }

            },
            handleSelectionChange(item) {//列表checkbox点击事件
                if (item.checked) {
                    this.chosedHeadData = getChosedData(this.chosedHeadData, item, this.config.SingleChose, this.config.depart.target);
                    if (this.config.SingleChose) {
                        this.activeDepartData.forEach(function (departItem) {
                            departItem.checked = false;
                        });
                        this.groupData.forEach(function (departItem) {
                            departItem.checked = false;
                        });
                        item.checked = true;
                    }
                } else {
                    this.delCurrentHeaderData(item);
                    item.checked = false;
                }


            },
            delCurrentHeaderData(item) {//头部删除当前的选择项
                this.chosedHeadData = delCurrentHeaderData(this.chosedHeadData, item.id);
                const array = [];
                this.activeDepartData.forEach(function (departItem) {
                    if (departItem.id === item.id) {
                        departItem.checked = !departItem.checked;
                    }
                    array.push(departItem);
                });
                this.activeDepartData = array;
            },
            choseAddressBtn() {//地址簿确定按钮
                this.dialogTableVisible = false;
                this.$emit('input', this.getCommitAddressParams(this.chosedHeadData));
                this.$emit('confirm', this.getCommitAddressParams(this.chosedHeadData));
            },
            handleOrgCheckAllChange(event) {
                const array = [];
                this.activeDepartData.forEach(item => {
                    if (event && !item.checked) {//如果全选按钮是选中且当前数据不是选中状态
                        this.chosedHeadData = getChosedData(this.chosedHeadData, item, this.config.SingleChose, this.config.depart.target);
                    }
                    if (!event && !!item.checked) {//如果全选按钮是选中且当前数据是选中状态，则删除
                        this.chosedHeadData = delCurrentHeaderData(this.chosedHeadData, item.id);
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
            setdefault(vaule) {
                this.chosedHeadData = this.chosedHeadData.concat(JSON.parse(vaule.departJson)).concat(JSON.parse(vaule.userJson)).concat(JSON.parse(vaule.groupJson));
                this.chosedHeadRealyData = this.chosedHeadData;
                this.choseAddressBtn();
            },
            checkShowOrg(data) {//检查是否显示部门,用于控制部门和用户的显示，根据config.target参数来控制
                let ckeckResult = true;
                if (this.config.depart.target == 'depart' && data == 'user') {
                    ckeckResult = false;
                }
                return ckeckResult;
            },
            checkOrgCheckBox(data) {//检查是否显示checkbox复选框
                let ckeckResult = true;
                if(data.dataType === 'schoolType' || data.dataType === 'school' || data.dataType === 'area') {
                    return this.isOrg || data.isChecked === 0;
                }
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
            handleInputChange() {
                let excludeUserIdsStr = '';
                this.chosedHeadData.forEach(function (item) {
                    excludeUserIdsStr += item.id + ',';
                });
                let queryList = {
                    condition: this.searchContent.trim(),
                    userTypes: this.userType === 0 ? '1,3' : this.userType,
                    excludeUserIdsStr: excludeUserIdsStr,
                };
                retrievalUsersDistrict(queryList).then(res => {
                    const packgeData = this.packgeDepartArray({userArray: res.data.data}, false, this.chosedHeadData, {departType: this.config.depart.departType});
                    this.searchData = packgeData;
                }).catch();
            },
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
            },
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
 .address-input .el-icon-plus{
        position: absolute;
        top:10px;
        right: 10px;
        font-size: 20px;
        color: #909399;
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
