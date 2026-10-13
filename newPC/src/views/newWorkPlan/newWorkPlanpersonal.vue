<template>
    <div class="newWorkPlanpersonal">
        <div class="top">
            <el-select class="filter-item" size="medium" v-model="query.schoolTimeId" placeholder="请选择学期"
                       @change="changeschoolTimeId()">
                <el-option v-for="item in SchoolTimeAllList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="ul">
                <div class="li" :key="index" v-for="(item,index) in dataList"
                     @click="newWorkPlanpersonaladd(item.weekNo,item.id,item.startDate,item.endDate)">
                    <span class="blue" v-if="item.weekType==1">预</span>
                    <span class="bluetwo" v-if="item.weekType==0">学</span>
                    <span class="green" v-if="item.weekType==2">加</span>
                    <i class="el-icon-s-flag"
                       v-if="(item.isCurrent==1)&&(query.schoolTimeId==myschoolTimeId)"></i>
                    <img v-if="item.isHavePlan==0"
                         src="https://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/zanwusix.png"
                         alt="">
                    <img v-else
                         src="https://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/newWorkPlan.png"
                         alt="">
                    <div class="name"><span>第{{item.weekNo}}周 </span> {{item.startDate}} ~ {{item.endDate}}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import mixin from "@/mixins/windowResize";
    import {getSchoolTimeAllList, getPersonWorkPlanList} from "@/api/newWorkPlan";

    export default {
        data() {
            return {
                query: {
                    schoolTimeId: ""
                },
                myschoolTimeId: '',
                dataList: [],
                SchoolTimeAllList: []
            };
        },
        mixins: [mixin],
        mounted() {
            getSchoolTimeAllList()
                .then(res => {
                    this.SchoolTimeAllList = res.data.data;
                    for (let item of this.SchoolTimeAllList) {
                        if (item.isCurrent == 1) {
                            this.query.schoolTimeId = item.id;
                            this.myschoolTimeId = item.id;
                            this.getPersonWorkPlanLists();
                        }
                    }
                })
                .catch(err => {
                });
        },
        methods: {
            changeschoolTimeId() {
                this.getPersonWorkPlanLists();
            },
            getPersonWorkPlanLists() {
                getPersonWorkPlanList(this.query.schoolTimeId)
                    .then(res => {
                        let data = res.data.data;
                        this.dataList = data;
                    })
                    .catch(err => {
                    });
            },
            newWorkPlanpersonaladd(week, id, startDate, endDate) {
                let name = ''
                for (let item of this.SchoolTimeAllList) {
                    if (this.query.schoolTimeId == item.id) {
                        name = item.schoolTimeName + ' 第' + week + '周' + ' （' + startDate + '~' + endDate + '）';
                    }
                }
                this.$router.push({
                    path: "newWorkPlanpersonaladd",
                    query: {week: week, schoolTimeId: this.query.schoolTimeId, id: id, name: name}
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .newWorkPlanpersonal {
        padding: 12px;

        .top {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }

        .subject {
            padding-top: 10px;
            overflow: auto;

            .ul {
                overflow: hidden;

                .li {
                    position: relative;
                    float: left;
                    margin: 5px 8px;
                    border-radius: 5px;
                    overflow: hidden;
                    border: 1px solid #e7eaec;
                    cursor: pointer;

                    .blue {
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 30px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 16px;
                        color: #fff;
                        background: #409eff;
                    }

                    .green {
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 30px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 16px;
                        color: #fff;
                        background: #67c23a;
                    }

                    .bluetwo {
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 30px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 16px;
                        color: #fff;
                        background: #409EFF;
                    }

                    img {
                        width: 240px;
                        border-radius: 5px;
                    }

                    i {
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        color: #F56C6C;
                        font-size: 30px;
                    }

                    .name {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        height: 40px;
                        width: 100%;
                        background-color: rgba(0, 0, 0, 0.3);
                        color: #fff;
                        line-height: 40px;
                        font-size: 15px;
                        text-align: center;

                        span {
                            font-size: 18px;
                        }
                    }
                }
            }
        }
    }
</style>
