<template>
    <div class="app-container calendar-list-container">
        <back-tool></back-tool>
        <div class="body" :style="{height:`${nobottommaxH}px`}">
            <div style="padding-top:20px; width:810px;    margin: auto;">
                    <el-form :model="ruleForm" ref="ruleForm" :label-position="labelPosition" label-width="150px"
                            style="width:100%">
                        <el-form-item label="姓名：">
                            {{userName}}
                        </el-form-item>
                        <el-form-item label="所教班级/所教课程：">
                            <el-row  class="teachCourseDetail">
                                <el-col :key="index" v-for="(item,index) in ruleForm.allResult" :span="13">
                                    <div class="grid-content bg-purple-dark">
                                        <span>{{item.className}}</span>
                                        <span class="course">{{item.courseName}}</span>
                                    </div>
                                </el-col>
                            </el-row>

                        </el-form-item>
                    </el-form>
                </div>

        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {TeachingEdit} from '@/api/teachingClass';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            BackTool
        },
        data() {
            return {
                ruleForm: {
                    allResult: [],//课程和班级组合显示成最终结果,
                },
                labelPosition: 'right',
                userName: '',
                cutH: 300,
            }
        },
        mixins: [mixin],
        created() {
            let _this = this;
            let userId = _this.$route.query.userId;
            let queryInfo = {userId: ''};
            queryInfo.userId = userId;
            TeachingEdit(queryInfo).then(res => {
                let data = res.data;
                if (data.code === 200) {
                    _this.userName = data.data.name;
                    data.data.clsCourse.forEach(({ classId, className, courseId, courseName }) => {
                        this.ruleForm.allResult.push({
                            classId,
                            className,
                            courseId,
                            courseName
                        });
                    })
                }
            })
        }
    }

</script>
<style scoped="scoped">
    .course, .delete {
        margin-left: 15px;
    }

    .teachCourseDetail {
        overflow: auto;
    }

    ::-webkit-scrollbar {
        width: 6px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #999;
    }

    ::-webkit-scrollbar-track {
        background-color: #F5F5F5;
    }
</style>