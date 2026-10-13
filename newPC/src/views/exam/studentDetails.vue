<template>
    <div class="app-container">
        <backtool></backtool>
        <el-table stripe :data="list" border style="width: 100%"  :height="nobottommaxH-120">
            <el-table-column align="left" label="学科">
                <template slot-scope="scope">
                    {{scope.row.currName}}
                </template>
            </el-table-column>
            <el-table-column align="left" label="平时">
                <template slot-scope="scope">
                    {{scope.row.usuallyAvg}}
                </template>
            </el-table-column>
            <el-table-column align="left" label="期中">
                <template slot-scope="scope">
                    {{scope.row.midScore}}
                </template>
            </el-table-column>
            <el-table-column align="left" label="期末">
                <template slot-scope="scope">
                    {{scope.row.lastScore}}
                </template>
            </el-table-column>
        </el-table>
        <div class="foot">
            <div class="span">
                班主任评语：
            </div>
            <div class="text" v-if="teacherComment.comment">
                {{teacherComment.comment}}
            </div>
            <div class="text" v-if="!teacherComment.comment">
                暂无评语
            </div>
        </div>
    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    import {stuScoreAnanlysisBySchoolTimeIdData} from '@/api/systemSet/exam';
    import mixin from '@/mixins/windowResize';
    export default {
        components: {
            Backtool
        },
        data() {
            return {
                list: [],
                teacherComment: []
            }
        },
        mixins: [mixin],
        created() {
            let stuId = this.$route.query.stuId;
            let schoolTimeId = this.$route.query.schoolTimeId;
            stuScoreAnanlysisBySchoolTimeIdData(schoolTimeId, stuId).then(res => {
                let data = res.data.data;
                this.list = data.objectList;
                this.teacherComment = data.teacherComment;

            }).catch();
        }
    }
</script>
<style scoped>
    #chart {
        width: 100%;
        height: 600px;
        margin-top: 20px;
    }

    .foot {
        padding: 40px 10px;
        height: 120px;
    }

    .foot .span {
        display: inline-block;
        color: #666;
        font-size: 18px;
        font-weight: 600;
    }

    .foot .text {
        display: inline-block;
        font-size: 14px;
    }
</style>
