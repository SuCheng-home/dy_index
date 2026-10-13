<template>
    <div class="page addTabSwitch4">
        <div class="header">
            <el-select
                size="medium"
                class="filter-item btnLeftLine"
                v-model="dutySel"
                placeholder="请选择值班组"
                @change="getDutyList"
            >
                <el-option
                    v-for="item in dutyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-select
                size="medium"
                class="filter-item btnLeftLine"
                v-model="gardenSel"
                placeholder="请选择年级"
                @change="getList"
            >
                <el-option label="全部年级" :value="0"></el-option>
                <el-option
                    v-for="item in gradeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <!-- <el-button class="filter-item" type="primary" icon="upload" @click="handleprint">打印</el-button> -->
            <a :href="exportURL" download="导出结果" target="_blank" v-if="dateList.length">
                <el-button
                    size="medium"
                    class="filter-item"
                    type="primary"
                    icon="upload"
                >导出
                </el-button
                >
            </a>
        </div>
        <div class="header">
            <div class="nav-info">
                <el-radio-group v-model="isActive">
                    <el-radio-button @click.native="tagClickHandler(item.id, item.itemName, index)" v-for="(item, index) in itemList" :label="index">{{item.itemName}}</el-radio-button>
                </el-radio-group>

            </div>
        </div>
        <el-table
            stripe
            :key="tableKey"
            :data="dateList"
            v-loading.body="listLoading"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :height="maxH-50"
        >
            <el-table-column align="center" label="班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.className }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="评分">
                <template slot-scope="scope">
                    <span>{{ scope.row.score }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.batchContent }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="previewImage"
                align="center"
                label="图片"
                :resizable="false"
            >
                <template slot-scope="scope">
                    <image-previewer
                        class="image-plate"
                        :images="scope.row.picList"
                        tag="img"
                        text="图片预览"
                        v-if="scope.row.picList.length !== 0"
                        style="color: #1992fb"
                    >
                    </image-previewer>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="检查时间"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="检查人">
                <template slot-scope="scope">
                    <span>{{ scope.row.createUserName }}</span>
                </template>
            </el-table-column>
             <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" type="text" @click="newjumpTo(scope.row)"
                                      >
                                编辑
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNo"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {findDutyList, findStatisticByItem} from "@/api/compositeExam";
     import {getDutyById} from '@/api/generalCheckN';
    import mixin from "@/mixins/windowResize";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

    export default {
        components: {
            ImagePreviewer,
        },
        data() {
            return {
                typeSel: "",
                typeName: "",
                gardenSel: "", //选中年级
                gradeList: [],
                dutySel: "", //选中值班组
                dutyList: [],
                dateList: [], //表格主题数据
                listLoading: false,
                itemList: [],
                tableKey: 0,
                title1: "",
                title2: "",
                titleMax: "",
                score: [],
                isActive: 0,
                total: null,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                },
                exportURL: "",
                isRemindClassHeader:0
            };
        },
        created() {
            this.gardenSel = 0;
            this.getTypeListFunc();
        },
        mounted() {
            this.findDutyListFunc();
        },
        mixins: [mixin],
        methods: { 
             newjumpTo(classItem) {
                getDutyById({
                    dutyId: this.itemList[this.isActive].dutyId//值班表详情
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.isRemindClassHeader = data.data.isRemindClassHeader;
                           if (this.itemList[this.isActive].isStar == 1) {
                                 window.sessionStorage.removeItem("generalCheckTitle");
            window.sessionStorage.removeItem("isQuickEvaluation");
            window.sessionStorage.removeItem("quickEvaluationDCode");
            window.sessionStorage.removeItem("classItem");
                                this.$router.push({
                                    path: 'generalStarAdd',
                                    query: {
                                        dutyId:  this.itemList[this.isActive].dutyId,
                                        itemId:  this.itemList[this.isActive].id,
                                        checkId: classItem.id,
                                        isRemindClassHeader: this.isRemindClassHeader,
                                        isUpdateHis:2
                                    }
                                })
                            } else if (this.itemList[this.isActive].isStar == 2) {
                                window.sessionStorage.removeItem("generalCheckTitle");
            window.sessionStorage.removeItem("isQuickEvaluation");
            window.sessionStorage.removeItem("quickEvaluationDCode");
            window.sessionStorage.removeItem("classItem");
                                this.$router.push({
                                    path: 'generalScoreAdd',
                                    query: {
                                        dutyId:  this.itemList[this.isActive].dutyId,
                                        itemId:  this.itemList[this.isActive].id,
                                        checkId: classItem.id,
                                        isRemindClassHeader: this.isRemindClassHeader,
                                        isUpdateHis:2
                                    }
                                })
                            }

                        }
                    }).catch(() => {
                })
                
            },

            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query,
                });
            },
            findDutyListFunc() {
                findDutyList()
                    .then((res) => res.data)
                    .then((data) => {
                        if (data.code === 200) {
                            this.dutyList = [];
                            data.data.forEach((item) => {
                                this.dutyList.push({
                                    value: item.id,
                                    label: item.dutyName
                                });
                            });
                            this.dutySel = this.dutyList[0].value;
                        }
                    });
            },
            getTypeListFunc(can) {
                this.listLoading = true;
                findStatisticByItem({
                    itemId: this.typeSel,
                    gradeId: this.gardenSel,
                    pageNo: this.listQuery.pageNo,
                    pageSize: this.listQuery.pageSize,
                    dutyId: this.dutySel,
                })
                    .then((res) => {
                        let data = res.data.data;

                        this.dateList = data.fpi.dataList;
                        this.total = data.fpi.pagination.total;
                        this.itemList = data.itemList;
                        if (this.typeSel === "") {
                            this.typeSel = this.itemList[0].id;
                            this.typeName = this.itemList[0].itemName;
                        }
                        this.dateList.forEach((item) => {
                            if (item.picList !== "" && item.picList.length > 0) {
                                item.picList.forEach((pic) => {
                                    pic.src = `${pic.picUrl}?imageMogr2/auto-orient`;
                                });
                            }
                        });
                        this.gradeList = [];
                        data.gradeList.forEach((item) => {
                            let hash = {};
                            hash.value = item.id;
                            hash.label = item.name;
                            this.gradeList.push(hash);
                        });
                        if (this.gardenSel === "") {
                            this.gardenSel = this.gradeList[0].value;
                        }
                        if (this.itemList.length > 0 && can) {
                            this.tagClickHandler(
                                this.itemList[0].id,
                                this.itemList[0].itemName,
                                0
                            );
                        }

                        /*导出*/
                        this.exportURL =
                            `${global.BasePath}structure/compositeStatistic/exportCompositeStatisticData2?fields=className,score,batchContent,createTime,createUserName&titles=班级,评分,备注,检查时间,检查人` +
                            `&gradeId=${this.gardenSel}&dutyId=${this.dutySel}&itemId=${this.typeSel}&itemName=${this.typeName}&token=${this.$store.getters.token}`;
                        this.listLoading = false;
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            tagClickHandler(id, name, index) {
                this.isActive = index;
                if (this.typeSel !== "") {
                    this.typeSel = id;
                    this.typeName = name;
                    this.getTypeListFunc();
                }
            },
            getList(value) {
                if (this.gardenSel !== "") {
                    this.gardenSel = value;
                    this.getTypeListFunc();
                }
            },
            getDutyList(value) {
                this.dutySel = value;
                this.getTypeListFunc(true);
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getTypeListFunc();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getTypeListFunc();
            },
        },
    };
</script>
<style scoped>
    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }

    .scrollBar {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .scrollBar::-webkit-scrollbar-track-piece {
        background: #d3dce6;
    }

    .scrollBar::-webkit-scrollbar {
        width: 6px;
    }

    .scrollBar::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
    }

    .page {
        padding: 12px;
    }

    .header {
        margin-bottom: 10px;
    }

    .imgBox img {
        display: block;
        height: 70px;
        width: 70px;
        overflow: hidden;
    }

    ul,
    li {
        list-style: none;
    }

    .nav-info {
        float: left;
        margin-bottom: 10px;
    }

    .nav-info ul {
        margin-top: 0;
        max-height: 130px;
        padding-left: 0;
    }

    .nav-info ul:after {
        content: "";
        height: 0;
        clear: both;
        visibility: hidden;
        display: block;
    }

    .nav-info li {
        float: left;
        font-size: 14px;
        padding: 12.5px;
        border: 1px solid #adadad;
        border-radius: 5px;
        line-height: 8px;
        margin-right: 4px;
        margin-bottom: 4px;
        cursor: pointer;
    }

    .nav-info li.active {
        background: #20a0ff;
        border: 1px solid #20a0ff;
        color: #fff;
    }
</style>
<style scoped>
    .image-previewer__content img {
        max-height: 100%;
    }
</style>
