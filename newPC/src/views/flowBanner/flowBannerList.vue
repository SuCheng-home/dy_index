<template>
    <div class="flow_banner_list_wrap">
        <div class="header">
            <el-select size="medium" v-model="selectWeek" placeholder="请选择" @change="changeWeek">
                <el-option v-for="item in weekList" :key="item.week" :label="`第${item.week}周`" :value="item.week">
                </el-option>
            </el-select>
            <el-button size="medium" class="filter-item" type="primary" @click="toSetIndex">流动红旗设置</el-button>
        </div>
        <div class="flow_banner_table_wrap">
            <el-table stripe :data="dataList" ref="table" style="width: 100%" border highlight-current-row
                      :height="boxH - 200">
                <el-table-column label="班级" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.className || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="typeItem.name" :key="typeIndex" align="center"
                                 v-for="(typeItem, typeIndex) in allTypeList">
                    <template slot-scope="scope">
            <span>
              <img :src="typeItem.logo" alt=""
                   @click="addFlowBanner(typeItem, scope.row, scope.row.typeAwardList[typeIndex])"
                   class="flow_img" :style="`${scope.row.typeAwardList[typeIndex] ? '' : 'filter: grayscale(1);'}`">
            </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getSeveralWeekList, getWeekFlowBannerDetails, awardFlowBanner, withdrawFlowBanner} from '@/api/flowBanner';

    export default {
        name: "flowBannerList",
        data() {
            return {
                searchLoading: false,
                selectWeek: null,
                currentWeek: null,
                schoolTimeId: null,
                weekList: [],
                dataList: [],
                allTypeList: [],
                timer: null
            }
        },
        mixins: [mixins],
        created() {
            this.getSeveralWeekList();
        },
        mounted() {
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.table.doLayout()
                }, 300)
            })
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        },
        methods: {
            toSetIndex() {
                this.$router.push({path: 'setList'});
            },
            changeWeek() {
                this.getWeekFlowBannerDetails();
            },
            getSeveralWeekList() {
                getSeveralWeekList().then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data.length) {
                        this.weekList = data;
                        this.schoolTimeId = data[0].schoolTimeId;
                        data.forEach((item) => {
                            if (item.nowWeek) {
                                this.currentWeek = item.week;
                                this.selectWeek = item.week;
                            }
                        });
                        this.getWeekFlowBannerDetails();
                    }
                }).catch();
            },
            getWeekFlowBannerDetails() {
                if (!this.selectWeek) {
                    return;
                }
                getWeekFlowBannerDetails({
                    isCurrWeek: this.currentWeek === this.selectWeek,
                    schoolTimeId: this.schoolTimeId,
                    week: this.selectWeek
                }).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data.awarded) {
                        this.allTypeList = data.typeList;
                        this.dataList = data.classFlowBannerList;
                    } else {
                        this.allTypeList = [];
                        this.dataList = [];
                    }
                    this.$nextTick(() => {
                        this.timer = setTimeout(() => {
                            this.$refs.table.doLayout()
                        }, 300)
                    })
                }).catch();
            },
            addFlowBanner(typeItem, classItem, isAward) {
                if (this.currentWeek !== this.selectWeek) {
                    return;
                }
                if (isAward) { // 取消
                    this.$confirm('是否确定收回流动红旗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let query = {
                            classId: classItem.classId,
                            schoolTimeId: this.schoolTimeId,
                            typeId: typeItem.id,
                            week: this.selectWeek
                        };

                        this.withdrawFlowBanner(query);
                    }).catch(() => {
                    });
                } else { // 选中
                    this.$confirm('是否确定发放流动红旗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let query = {
                            classId: classItem.classId,
                            className: classItem.className,
                            gradeId: classItem.gradeId,
                            gradeName: classItem.gradeName,
                            schoolTimeId: this.schoolTimeId,
                            typeId: typeItem.id,
                            typeListJson: JSON.stringify(this.allTypeList),
                            typeLogo: typeItem.logo,
                            typeName: typeItem.name,
                            week: this.selectWeek
                        };

                        this.awardFlowBanner(query);
                    }).catch(() => {
                    });
                }
            },
            awardFlowBanner(query) {
                awardFlowBanner(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '颁发成功',
                            type: 'success'
                        });
                        this.getWeekFlowBannerDetails();
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            withdrawFlowBanner(query) {
                withdrawFlowBanner(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '撤回成功',
                            type: 'success'
                        });
                        this.getWeekFlowBannerDetails();
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .flow_banner_list_wrap {
        padding: 12px;

        .header {
            padding-bottom: 10px;
            margin-bottom: 0;
        }

        .flow_banner_table_wrap {
            margin: 0 auto;

            .flow_img {
                display: block;
                width: 24px;
                height: 24px;
                margin: 0 auto;
                cursor: pointer;
            }
        }
    }
</style>
