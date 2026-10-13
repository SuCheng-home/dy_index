<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <el-tabs @tab-click="tabsfunc" v-model="activeName" type="border-card">
            <el-tab-pane label="按用户统计" name="accountingByUser">
                <div>
                    <div class="top">
                        <el-date-picker size="medium" ref="date"  v-model="duration" type="daterange" class="filter-item mywidthdaterange"
                                        :editable="false"
                                        :clearable='false' align="right" unlink-panels placeholder="选择时间范围"
                                        @change="statisticsByUserFunc"></el-date-picker>
                           <el-select
                                size="medium"
                                placeholder="请选择"
                                value-key="id" style="width:150px"
                                v-model="useType"
                                @change="statisticsByUserFunc()"
                            >
                        <el-option label="全部分类" :value="0"></el-option>
                        <el-option :label="item.name"  v-for="(item,index) in applyTypeList" :key="index" :value="item.id"></el-option>
                    </el-select> 
                        <a class="export-btn" :href="exportUrl" download="用户统计" target="_blank" v-if="dataList.length">
                            <el-button size="medium" class="filter-item" type="primary" icon="upload">导出</el-button>
                        </a>
                        <el-input size="medium" placeholder="请输入申请人姓名" v-model="searchTitle" class="search-input"
                                  @keyup.enter.native="statisticsByUserFunc">
                            <el-button size="medium" slot="append" icon="el-icon-search" @click="statisticsByUserFunc"></el-button>
                        </el-input>
                    </div>
                    <el-table stripe :data="dataList" border fit highlight-current-row
                              style="width: 100%" :height="maxH-10">
                        <el-table-column align="center" label="用户" prop="teacherName">
                        </el-table-column>
                        <el-table-column align="center" label="A3" v-if="typeList.indexOf('A3') != -1">
                            <el-table-column align="center" label="单页" prop="A3S">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="A3D">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="A4" v-if="typeList.indexOf('A4') != -1">
                            <el-table-column align="center" label="单页" prop="A4S">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="A4D">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="B5" v-if="typeList.indexOf('B5') != -1">
                            <el-table-column align="center" label="单页" prop="B5S">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="B5D">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="16K" v-if="typeList.indexOf('16K') != -1">
                            <el-table-column align="center" label="单页" prop="16KS">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="16KD">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="32K" v-if="typeList.indexOf('32K') != -1">
                            <el-table-column align="center" label="单页" prop="32KS">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="32KD">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="8K" v-if="typeList.indexOf('8K') != -1">
                            <el-table-column align="center" label="单页" prop="8KS">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="8KD">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="总张数" prop="totalNum">
                        </el-table-column>
                        <el-table-column align="center" label="总金额(元)" prop="totalCost">
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="按纸张统计" name="accountingByPaper"></el-tab-pane>
            <el-tab-pane label="按用途类型统计" name="accountingByUsage"></el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getSchoolTimeAllList} from '@/api/wtManager';
    import {getDicByCode} from '@/utils/utils';
    import {statisticsByUser,findPriceList,getTypeTree} from '@/api/printApplication';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            Backtool
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo']),
            exportUrl() {
                return `${global.BasePath}structure/printSeniorApply/exportStatisticsByUser?kind=1&useType=${this.useType}&searchTitle=${this.searchTitle}&startDate=${this.$moment(this.duration[0]).format('YYYY-MM-DD')}&endDate=${this.$moment(this.duration[1]).format('YYYY-MM-DD')}&token=${this.$store.getters.token}`;
            }
        },
        data() {
            return {
                activeName: 'accountingByUser',
                duration: [this.$moment().startOf('month'), new Date()],
                searchTitle: '',
                dataList: [],
                typeList: [],
                useType:0,
                applyTypeList:[],
                kind:'file',
                newdataList:[],
                typeList: [],
            };
        },
        mixins: [mixin, baseMixin],
        created() {
              this.getTypeTreeData();
            getDicByCode('printSeniorApplyPaperSizeType')
                .then(list => {
                    findPriceList()
                        .then(res => res.data)
                        .then(data => {
                            const types = data.data.map(({type}) => `${type}`);
                            this.typeList = list.filter(({code}) => types.indexOf(`${code}`) != -1).map(item => item.value);
                        })
                });
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    const currentTerm = data.data.find(item => item.isCurrent == 1);
                    if(currentTerm) {
                        if(currentTerm.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.duration = [new Date(),currentTerm.startDate];
                            }else{
                              this.duration = [currentTerm.startDate,new Date()];
                            }
                    }
                    this.statisticsByUserFunc();
                });
        },
        methods: {
              getTypeTreeData() {
                return Promise.all([
                    getTypeTree({
                        kind: 1
                    })
                        .then(res => res.data.data),
                    getTypeTree({
                        kind: 2
                    })
                        .then(res => res.data.data)
                ])
                    .then(([type1Data, type2Data]) => {
                        if(this.kind === 'file' && (!type1Data || type1Data.length == 0 || type1Data[0].children.length == 0)) {
                            // this.$message.error('请设置印制申请用途类型')
                        } else if(this.kind !== 'file' && (!type2Data || type2Data.length == 0 || type2Data[0].children.length == 0)) {
                            // this.$message.error('请设置耗材申请用途类型')
                        } else {
                            this.applyTypeList = this.kind === 'file' ? type1Data[0].children : type2Data[0].children;
                        }
                    })
            },
            tabsfunc() {
                if (this.activeName === 'accountingByPaper') {
                    this.jumpToPage('printAccountingByPaper');
                } else if (this.activeName === 'accountingByUsage') {
                    this.jumpToPage('printAccountingByUsage');
                }
            },
            statisticsByUserFunc() {
                statisticsByUser({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    kind: 1,
                    searchTitle: this.searchTitle,
                    useType:this.useType
                })
                    .then(res => res.data)
                    .then(data => {
                        const typeList = [
                            '', 'A3', 'A4', 'B5', '16K', '32K', '8K'
                        ];
                        data.data.forEach(item => {
                            Object.keys(item.typeMap).forEach(type => {
                                item[`${typeList[type]}S`] = item.typeMap[type].totalPaperSingle || 0;
                                item[`${typeList[type]}D`] = item.typeMap[type].totalPaperDouble || 0;

                            })
                        });
                        this.dataList = data.data;
                    })
            }
        }
    }
</script>
<style scoped lang="scss">
    .search-input {
        width: 200px;
        float: right;
    }
     .top{
      padding-bottom: 10px;
      border-bottom: 1px solid #e7eaec;     
    }
</style>
