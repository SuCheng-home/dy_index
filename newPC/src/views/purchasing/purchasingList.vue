<template>
    <div class="page">
        <div class="header">
            <el-date-picker size="medium" ref="date"  v-model="duration" type="daterange" class="filter-item mywidthdaterange"
                            :editable="false"
                            :clearable='false' align="right" unlink-panels placeholder="选择时间范围"
                            @change="searchTitleHandler">
            </el-date-picker>
            <el-cascader v-show="typeList.length !== 0" size="medium" v-model="typeId" :props="props" placeholder="请选择采购类型" clearable @change="typeChangeHandler"></el-cascader>
            <!-- <el-select v-show="typeList.length !== 0" size="medium" @change="typeChangeHandler" v-model="typeId"
                       placeholder="请选择采购类型">
                <el-option
                    key="0"
                    label="全部"
                    value="0">
                </el-option>
                <el-option
                    v-for="item in typeList"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code">
                </el-option>
            </el-select> -->
            <a :href="exportUrl" target="_blank" download="请假列表"  v-if="dataList.length">
                <el-button type="primary" size="medium">导出</el-button>
            </a>
            <el-input size="medium" placeholder="请输入申请人姓名" v-model="createUserName" class="search-input"
                      @keyup.enter.native="searchTitleHandler">
                <el-button size="medium" slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
            </el-input>
        </div>
        <div class="main-container">
            <el-table stripe :data="dataList" border style="width: 100%;" :height="maxH">
                <el-table-column label="采购名称">
                    <template slot-scope="scope">
                        <router-link style="color: #409EFF;"
                                     :to="{path: 'purchasingDetail', query: {id: scope.row.id}}">{{scope.row.source}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" prop="createUserName">
                </el-table-column>
                <el-table-column label="申请部门" prop="departName">
                </el-table-column>
                <el-table-column label="采购类型" v-if="typeList.length !== 0" prop="typeName">
                </el-table-column>
                <el-table-column label="申请时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | timeFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="当前环节">
                    <template slot-scope="scope">
                        {{scope.row.state == 1 ? '草稿' : scope.row.stepStateName}}
                    </template>
                </el-table-column>
                <el-table-column label="总价（元）">
                    <template slot-scope="scope">
                        {{scope.row.priceTotal / 100}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getProcureListByDateScope
    } from '@/api/purchasing';
    import { getSchoolDicDetailsByCode } from '@/api/common/common.js'
    import {
        getSchoolDicByCode
    } from '@/utils/utils';
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {mapGetters} from 'vuex';

    export default {
        name: "purchasingList",
        data() {
            return {
                duration: [this.$moment().startOf('month'), new Date()],
                typeId: '0',
                dataList: [],
                typeList: [],
                activeName: 'second',
                createUserName: '',
                props: {
                    lazy: true,
                    emitPath: false,
                    lazyLoad: (node, resolve) => {
                        const { level, data } = node;
                        if (level === 0) {
                            getSchoolDicDetailsByCode('caigoudan')
                                .then(res => res.data)
                                .then(res => {
                                    if(res.data && res.data.length) {
                                        this.typeList = res.data
                                            .map(i => ({
                                                label: i.name,
                                                value: i.code,
                                                children: []
                                            }))
                                        // this.typeList.unshift({ label: '全部', value: '0', leaf: true })
                                        resolve(this.typeList);
                                    }
                                });
                        } else {
                            getSchoolDicByCode(data.value)
                                .then(data => {
                                    resolve(data.map(i => ({
                                        value: i.code,
                                        label: i.value,
                                        leaf: true
                                    })));                    
                                });
                        }
                    }
                }
            }
        },
        computed: {
            ...mapGetters(['isStandalone']),
            exportUrl() {
                return `${global.BasePath}structure/procure/exportProcureListByDateScope?startDate=${this.$moment(this.duration[0]).format('YYYY-MM-DD')}&endDate=${this.$moment(this.duration[1]).format('YYYY-MM-DD')}&typeId=${this.typeId}&token=${this.$store.getters.token}`;
            },
        },
        filters: {
            timeFilter(value) {
                return value.slice(0, value.lastIndexOf('.'));
            }
        },
        mixins: [BaseMixin, mixins],
        created() {
            this.getProcureListByDateScopeFunc();
        },
        methods: {
            searchTitleHandler() {
                this.createUserName = this.createUserName.trim();
                this.pagination.pageNo = 1;
                this.getProcureListByDateScopeFunc();
            },
            typeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getProcureListByDateScopeFunc();
            },
            tabClickHandler(tab) {
                if (tab.index === '0') {
                    this.$router.replace({
                        path: 'leaveAccounting'
                    });
                }
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageNo = 1;
                this.pagination.pageSize = pageSize;
                this.getProcureListByDateScopeFunc();
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getProcureListByDateScopeFunc();

            },
            getProcureListByDateScopeFunc() {
                getProcureListByDateScope({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    createUserName: this.createUserName,
                    typeId: this.typeId || '0'
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .page {
        padding: 10px;
    }

    .header {
        margin-bottom: 10px;
    }

    .search-input {
        width: 200px;
        float: right;
    }
</style>
