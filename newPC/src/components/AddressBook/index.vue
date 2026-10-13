<template>
  <span>
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
          <span class="search-item-des">{{item.name}}</span>
        </span>
      </div>
      <span v-show="chosedHeadRealyData.length===0" class="noda-info">点击选择范围</span>
    </div>
    <el-dialog :title="config.title?config.title:'地址簿'" :visible.sync="dialogTableVisible"
               :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
      <div class="address-body">
        <div class="address-input">
          <div class="search-input">
            <span class="search-item" v-for="item in chosedHeadData">
              <img v-if="item.dataType==='user'" :src="item.avatar">
              <img v-if="item.dataType==='depart'" :src="require('@/assets/images/depart.png')">
              <img v-if="item.dataType==='group'" :src="require('@/assets/images/group.png')">
                <img v-if="item.dataType==='schoolType'" :src="require('@/assets/images/depart.png')">
            <img v-if="item.dataType==='school'" :src="require('@/assets/images/depart.png')">
              <span class="search-item-des">{{item.name}}</span>
              <span class="search-item-del" @click="delCurrentHeaderData(item)"></span>
            </span>
          </div>
            <!-- <el-autocomplete class="inline-input" v-model="searchContent" :fetch-suggestions="querySearch" placeholder="请输入姓名或手机快速找人" :trigger-on-focus="false"></el-autocomplete> -->
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane v-if="config.depart" label="组织架构" name="departTree">
            <div>
              <el-breadcrumb separator="/">

                <el-breadcrumb-item v-for="item in chosedOrgData" :key="item.id" @click.native="loadMenuData(item.id)">{{item.name}}</el-breadcrumb-item>
                  <!-- <el-breadcrumb-item>红山路小学</el-breadcrumb-item>
                                                            <el-breadcrumb-item>教师</el-breadcrumb-item>
                                                            <el-breadcrumb-item>德育处</el-breadcrumb-item> -->
              </el-breadcrumb>
              <div class="address-datalist">
                <!-- <el-table ref="addressTable" :data="activeDepartData" show-overflow-tooltip style="width: 100%" :show-header='false' :max-height="480" @select="handleSelectionChange">
                                <el-table-column>
                                  <template slot-scope="scope">
                                    <img v-if="scope.row.dataType==='depart'" class="address-data-img" :src="require('@/assets/images/depart.png')" />
                                    <img v-else class="address-data-img" :src="scope.row.avatar" />
                                    <span :class="{ 'link-type':scope.row.hasChild}" @click="loadNextDepart(scope.row)">{{ scope.row.name }}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column type="selection" width="55">
                                </el-table-column>
                              </el-table> -->

                <ul class="address-box">

                  <li v-for="item in activeDepartData">
                    <div class="address-box-item">
                      <div class="address-list-title">
                        <img v-if="item.dataType==='depart'" class="address-data-img"
                             :src="require('@/assets/images/depart.png')"/>
                        <img v-else class="address-data-img" :src="item.avatar"/>
                        <span :class="{ 'link-type':item.hasChild}" @click="loadNextDepart(item)">{{ item.name }}</span>
                      </div>
                      <div class="address-list-bars">
                        <el-checkbox :key="item.id" v-model="item.checked"
                                     @change="handleSelectionChange(item)"></el-checkbox>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <!-- <el-checkbox style="float:right;" :indeterminate="isIndeterminateOrg" v-model="orgCheckAll" @change="handleOrgCheckAllChange">全选</el-checkbox> -->
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="config.group" label="常用组" name="group">
            <div>
              <el-button v-show="showGroupBackBtn" type="text" @click.native="loadInitGroup">&lt; 返回</el-button>
              <div class="address-datalist">
                <el-table
                    stripe
                    ref="groupTable"
                    :data="groupData"
                    show-overflow-tooltip
                    style="width: 100%"
                    :show-header='false'
                    :max-height="480"
                    @select="handleSelectionChange"
                >
                              <el-table-column>
                                <template slot-scope="scope">
                                  <img v-if="scope.row.dataType==='group'" class="address-data-img"
                                       :src="require('@/assets/images/group.png')"/>
                                  <img v-else class="address-data-img" :src="scope.row.avatar"/>
                                  <span :class="{ 'link-type':scope.row.hasChild}" @click="loadGroupUsers(scope.row)">{{ scope.row.name }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column type="selection" width="55">
                              </el-table-column>
                            </el-table>
                <ul class="address-box">
                  <li v-for="item in groupData">
                    <div class="address-box-item">
                      <div class="address-list-title">
                        <img v-if="item.dataType==='group'" class="address-data-img"
                             :src="require('@/assets/images/group.png')"/>
                        <img v-else class="address-data-img" :src="item.avatar"/>
                        <span :class="{ 'link-type':item.hasChild}" @click="loadGroupUsers(item)">{{ item.name }}</span>
                      </div>
                      <div class="address-list-bars">
                        <el-checkbox :key="item.id" @change="handleSelectionChange(item)"></el-checkbox>
                      </div>
                    </div>
                  </li>
                </ul>
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
        queryByDepartId,
        packgeDepartArray,
        packageCheckedOrg,
        getChosedData,
        delCurrentHeaderData,
        retrievalUsers,
        queryByGroupId,
        getCommitAddressParams
    } from '@/api/addressBox';

    export default {
        props: {
            default: {
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
                orgCheckAll: true,
                isIndeterminateOrg: true

            }
        },
        created() {
            const token = this.$store.getters.token;
            init(token).then(res => {
                const packgeData = packgeDepartArray(res.data.data.departs, res.data.data.users);
                //this.departData = this.departData.concat(packgeData);
                this.activeDepartData = packgeData;
                this.groupData = packgeDepartArray([], [], res.data.data.groups);
            }).catch();
            this.chosedHeadData = this.default.length > 0 ? this.chosedHeadData.concat(JSON.parse(this.default.departJson)).concat(JSON.parse(this.default.userJson)).concat(JSON.parse(this.default.groupJson)) : [];
            this.chosedHeadRealyData = this.chosedHeadData;
        },
        methods: {
            loadNextDepart(row) {
                const id = row.id;
                const token = this.$store.getters.token;
                queryByDepartId(id, '1', token).then(res => {
                    const packgeData = packgeDepartArray(res.data.data.departs, res.data.data.users);
                    this.activeDepartData = packgeData;
                    this.chosedOrgData.push({name: row.name, id: row.id});
                    this.$nextTick(function () {
                        this.initTableChecked();
                    })
                }).catch();
            },
            loadInitGroup() {//初始化群组信息
                const token = this.$store.getters.token;
                init(token).then(res => {
                    this.groupData = packgeDepartArray([], [], res.data.data.groups);
                }).catch();
                this.showGroupBackBtn = false;
            },
            loadGroupUsers(row) {//加载群组用户
                const token = this.$store.getters.token;
                queryByGroupId(row.id, token).then(res => {
                    this.groupData = packgeDepartArray([], res.data.data.users, []);
                }).catch();
                this.showGroupBackBtn = true;
            },
            querySearch(queryString, cb) {
                let results = [];
                const token = this.$store.getters.token;
                let queryList = {
                    condition: queryString,
                    userTypes: '1',
                    token: token,
                    excludeUserIdsStr: '',
                    departId: this.activeDepartData[0].id
                };
                retrievalUsers(queryList).then(res => {
                    cb(results);
                }).catch();
            },
            loadMenuData(id) {
                this.chosedOrgData = packageCheckedOrg(this.chosedOrgData, id);//处理地址簿导航栏
                const token = this.$store.getters.token;
                if (id === -1000) {
                    init(token).then(res => {
                        const packgeData = packgeDepartArray(res.data.data.departs, res.data.data.users);
                        this.activeDepartData = packgeData;
                    }).catch();
                } else {
                    queryByDepartId(id, '1', token).then(res => {//加载点击数据
                        const packgeData = packgeDepartArray(res.data.data.departs, res.data.data.users);
                        this.activeDepartData = packgeData;
                    }).catch();
                }
                this.initTableChecked();
            },
            handleSelectionChange(row) {//列表checkbox点击事件
                this.chosedHeadData = getChosedData(this.chosedHeadData, row);
            },
            delCurrentHeaderData(row) {//头部删除当前的选择项
                this.chosedHeadData = delCurrentHeaderData(this.chosedHeadData, row.id);
                let array = new Array();
                this.activeDepartData.forEach(function (item) {
                    if (item.id === row.id) {
                        item.checked = !item.checked;
                    }
                    array.push(item);
                });
                this.activeDepartData = array;
            },
            initTableChecked() {//初始化列表中的checkedbox
                // let _this = this;
                // setTimeout(function () {
                //   _this.$refs.addressTable.toggleRowSelection(_this.chosedHeadData[0]);
                // }, 2000);
                if (this.chosedHeadData) {
                    this.chosedHeadData.forEach(item => {
                        this.$refs.addressTable.toggleRowSelection(item);
                    });
                }

            },
            choseAddressBtn() {//地址簿确定按钮
                this.chosedHeadRealyData = this.chosedHeadData;
                this.$emit('AddressValue', getCommitAddressParams(this.chosedHeadRealyData));
                this.dialogTableVisible = false;
            },
            handleOrgCheckAllChange(event) {
                let array = new Array();
                this.activeDepartData.forEach(function (item) {
                    item.checked = event.target.checked;
                    array.push(item);
                });
                this.activeDepartData = array;
                this.isIndeterminateOrg = false;
            },
            setdefault(vaule) {

                this.chosedHeadData = this.chosedHeadData.concat(JSON.parse(vaule.departJson)).concat(JSON.parse(vaule.userJson)).concat(JSON.parse(vaule.groupJson));
                this.chosedHeadRealyData = this.chosedHeadData;
                this.choseAddressBtn();
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
        max-height: 90px;
        overflow-y: auto;
    }

    .noda-info {
        color: #bfcbd9;
        padding-left: 10px;
    }

    .address-body {
        min-height: 400px;
        max-height: 600px;
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
    }

    .search-input {
        /* width: 520px;
          min-height: 35px;
          max-height: 65px;
          padding-left: 10px;
          border: 1px solid #E5E5E5;
          border-radius: 5px;
          margin-left: auto;
          margin-right: auto;
          margin-top: 20px;
          overflow-y: auto; */
        /* float: left;
        padding-left: 4px; */
    }

    .search-item {
        height: 25px;
        margin-left: 4px;
        margin-top: 5px;
        margin-right: 5px;
        line-height: 25px;
        display: inline-block;
        background-color: #eee;
        border-radius: 3px;
        padding-right: 4px;
        float: left;
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
        height: 460px;
        overflow-y: auto;
        -webkit-padding-start: 0px;
        @include scrollBar;
        border-left: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
    }

    .address-box li {
        list-style: none;
        border-bottom: 1px solid #dfe6ec;
        padding: 2px 10px;
    }

    .address-box li:hover {
        background-color: #eef1f6;
    }

    .address-box-item {
        display: flex;
    }

    .address-list-title {
        flex: 1;
    }

    .address-list-bars {
        width: 20px;
    }
</style>

