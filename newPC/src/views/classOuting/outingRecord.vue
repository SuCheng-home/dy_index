<template>
    <div class="page">
        <div class="page-header">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                @change="searchTitleHandler()"></el-date-picker>
            <a :href="exportUrl" download="导出" target="_blank">
                <el-button type="primary" size="medium" icon="upload">导出</el-button>
            </a>
        </div>
        <el-table stripe :data="dataList" :height="maxH" border fit highlight-current-row style="width: 100%"
            header-align="center">
            <el-table-column label="班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="detailEvent(scope.row)">{{
                        scope.row.className }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createDate" label="外出日期">
            </el-table-column>
            <el-table-column prop="address" label="外出地点" width="300px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="content" label="日程内容" width="300px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="createUserName" label="申请老师" width="120px">
            </el-table-column>
            <el-table-column prop="applyUserName" label="在园就餐情况">
                <template slot-scope="scope">
                    <span>{{
                        scope.row.repastJson ? JSON.parse(scope.row.repastJson).map(item => item.repastName).join('、') :
                            '无'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="applyUserName" label="参与老师" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{
                        scope.row.thList.length > 0 ? scope.row.thList.map(item => item.userName).join('、') :
                            '未安排'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120px">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="addTeacher(scope.row)">安排参与老师</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-pagination class="pagination-container" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page.sync="pagination.pageNo"
                :page-sizes="[10, 20, 30, 50]" :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
            </el-pagination>
        </div>
        <el-dialog title="安排参与老师" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-checkbox-group v-model="listQuery">
                <el-checkbox v-for="item in thList" :label="item.userId" :key="item.userId">{{ item.userName
                    }}</el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddTeacher">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
import { getClassOutList, getClassThList, getClassOut, updateClassOutAll } from '@/api/classOuting';
import { getSchoolTimeAllList } from "@/api/schedule";
import moment from 'moment';


export default {
    name: "outingRecord",
    data() {
        return {
            daterange: ['', ''],
            kind: this.$route.query.kind || 'file',
            status: 0,
            dataList: [],
            pagination: {
                startDate: "",
                endDate: "",
                pageNo: 1, //页数
                pageSize: 10, //条数
            },

            exportUrl: '',
            dialogVisible: false,
            listQuery: [],
            thList: [],
            currentOutingId: null,
            selectedTeachers: [],
            outingData: {}
        }
    },
    mixins: [
        mixin
    ],
    created() {
        this.daterange = [new Date(this.$moment().set('date', 1).valueOf()), new Date()];
        this.findApplyListFunc();

    },
    methods: {
        async addTeacher(row) {
            this.currentOutingId = row.id;
            const { data: teacherData } = await getClassThList({ classId: row.classId });
            this.thList = teacherData.data || [];
            const { data: outingData } = await getClassOut(row.id);
            this.selectedTeachers = (outingData.data.thList || []).map(teacher => teacher.userId);
            this.listQuery = [...this.selectedTeachers];
            this.dialogVisible = true;
            this.outingData = outingData.data || {};
        },
        detailEvent(row) {
            this.$router.push({
                path: '/main/schoolManage/classOuting/outingRecordInfo',
                query: {
                    outId: row.id
                }
            })
        },
        searchTitleHandler() {
            this.pagination.pageNo = 1;
            this.findApplyListFunc();
        },
        handleSizeChange(val) {
            this.pagination.pageNo = 1;
            this.pagination.pageSize = val;
            this.findApplyListFunc();
        },
        handleCurrentChange(val) {
            this.pagination.pageNo = val;
            this.findApplyListFunc();
        },
        findApplyListFunc() {
            this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
            this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
            this.exportUrl = `${global.BasePath}structure/classOut/exportClassOutList?token=${this.$store.getters.token}&startDate=${this.pagination.startDate}&endDate=${this.pagination.endDate}`;
            getClassOutList({
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                startDate: this.pagination.startDate,
                endDate: this.pagination.endDate,
            })
                .then(res => res.data)
                .then(data => {
                    this.dataList = data.data.dataList;
                    this.pagination.total = data.data.pagination.total;
                })
        },
        async confirmAddTeacher() {
            if (!this.currentOutingId) {
                this.$message.error("数据错误，请重新尝试");
                return;
            }
            try {
                const selectedTeachersWithInfo = this.thList.filter(teacher => {
                    return this.listQuery.includes(teacher.userId);
                });
                const updateParams = {
                    ...this.outingData,
                    thList: selectedTeachersWithInfo
                };
                console.log('updateParams', updateParams);

                const { data } = await updateClassOutAll(updateParams);

                if (data.result) {
                    this.$message.success("保存成功");
                    this.dialogVisible = false;
                    this.findApplyListFunc();
                } else {
                    this.$message.error(data.msg || "保存失败");
                }
            } catch (error) {
                this.$message.error("保存失败，请稍后重试");
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding: 12px;
}

.page-header {
    padding-bottom: 10px;
}

::v-deep .el-checkbox-group {
    padding: 10px 0;
}
</style>