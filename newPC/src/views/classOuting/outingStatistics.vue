<template>
    <div class="page">
        <div class="page-header">
            <el-select class="filter-item" size="medium" v-model="schoolTimeId" placeholder="请选择学期"
                @change="changeschoolTimeId()">
                <el-option v-for="item in SchoolTimeAllList" :key="item.id" :label="item.schoolTimeName"
                    :value="item.id"></el-option>
            </el-select>
            <a :href="exportUrl" download="导出" target="_blank">
                <el-button type="primary" size="medium" icon="upload">导出</el-button>
            </a>

        </div>
        <el-table stripe :data="formattedData" border fit highlight-current-row style="width: 100%">
            <el-table-column label="日期" show-overflow-tooltip prop="date" width="150px" v-if="classList.length > 0">
            </el-table-column>
            <el-table-column v-for="(classItem, index) in classList" :key="index" :label="classItem"
                show-overflow-tooltip :prop="`class_${index}`" width="150px">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
import { getClassOutSatticBySchTimeId } from '@/api/classOuting';
import { getSchoolTimeAllList } from "@/api/newWorkPlan";
export default {
    name: "outingStatistics",
    data() {
        return {
            dataList: [],
            schoolTimeId: '',
            exportUrl: '',
            classList: []
        }
    },
    computed: {
        formattedData() {
            if (!this.dataList || this.dataList.length === 0) return [];

            return this.dataList.map(row => {
                const formattedRow = { date: row[0] };
                this.classList.forEach((classItem, index) => {
                    formattedRow[`class_${index}`] = row[index + 1];
                });
                return formattedRow;
            });
        }
    },

    created() {
        getSchoolTimeAllList()
            .then(res => {
                this.SchoolTimeAllList = res.data.data;
                for (let item of this.SchoolTimeAllList) {
                    if (item.isCurrent == 1) {
                        this.schoolTimeId = item.id;
                        this.findApplyListFunc();
                    }
                }
            })
    },
    methods: {
        changeschoolTimeId() {
            this.findApplyListFunc();
        },

        findApplyListFunc() {
            this.exportUrl = `${global.BasePath}structure/classOut/exportClassOutSatticBySchTimeId?token=${this.$store.getters.token}&schoolTimeId=${this.schoolTimeId}`;
            getClassOutSatticBySchTimeId({
                schoolTimeId: this.schoolTimeId
            })
                .then(res => {
                    this.classList = res.data.data.classList;
                    this.dataList = res.data.data.dataList;
                })
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
</style>