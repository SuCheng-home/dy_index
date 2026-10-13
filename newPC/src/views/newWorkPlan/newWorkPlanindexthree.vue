<template>
    <div class="newWorkPlanindex">
        <div class="top">
            {{query.schoolTimename}}
            <el-select class="selectWidth" size="medium" v-model="query.week" placeholder="请选择周次"
                       @change="getPersonWorkPlanNoticeLists()">
                <el-option v-for="item in weeklist" :key="item.weekNo" :label='"第"+item.weekNo+"周"'
                           :value="item.weekNo"></el-option>
            </el-select>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="big-box">
                <div class="box" :key="indexs" v-for="(items,indexs) in dataList" v-if="indexs<6">
                    <div class="name-top">{{items.dayName}} {{items.dayDate}} <span v-if="indexs==5">{{dataList[6].dayName}} {{dataList[6].dayDate}}</span>
                    </div>
                    <div class="ul">
                        <div class="li" :key="index" @click="popfun(item.department,item.principals,item.content,items)"
                             v-for="(item,index) in items.dayPlanList">{{index+1}}. {{item.content}}
                        </div>
                        <div v-if="indexs==5">
                            <div class="li" :key="index" @click="popfun(item.department,item.principals,item.content,items)"
                                 v-for="(item,index) in dataList[6].dayPlanList">
                                {{dataList[5].dayPlanList.length+index+1}}. {{item.content}}
                            </div>
                        </div>
                        <div class="zanwu" v-if="(indexs<5)&&(items.dayPlanList.length==0)">暂无计划</div>
                        <div class="zanwu"
                             v-if="(indexs==5)&&((items.dayPlanList.length+dataList[6].dayPlanList.length)==0)">暂无计划
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <el-dialog title="计划详情" :close-on-press-escape='false' :close-on-click-modal='false'
                   :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
            <el-form ref="form" label-width="100px">
                <el-form-item label="负责部门">{{department}}</el-form-item>
                <el-form-item label="参与人">{{principals}}</el-form-item>
                 <el-form-item label="时间" v-if="myobj.planType==0&&myobj.timeType&&(myobj.timeType!=-1)">
                                 <span v-if="myobj.timeType==1">全天</span>
                                 <span v-if="myobj.timeType==2">上午</span>
                                 <span v-if="myobj.timeType==3">下午</span>
                                 <span v-if="myobj.timeType==4">{{myobj .startTime}}</span>
                </el-form-item>
                 <el-form-item label="地点" v-if="myobj.planType==0&&myobj.place">
                         {{myobj.place}}
                </el-form-item>
                <el-form-item label="计划内容">{{content}}</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="dialogVisible = false">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>
<script>
    import mixin from "@/mixins/windowResize";
    import {mapGetters} from 'vuex';
    import {getSchoolTimeAllList, getPersonWorkPlanList, getPersonWorkPlanNoticeList} from "@/api/newWorkPlan";

    export default {
        data() {
            return {
                query: {
                    schoolTimeId: "",
                    departId: '',
                    schoolTimename: '',
                    week: ''
                },
                department: '',
                principals: '',
                content: '',
                dataList: [],
                departIdlist: [],
                weeklist: [],
                dialogVisible: false,
                myobj:{}
            };
        },
        mixins: [mixin],
        computed: {
            ...mapGetters(['userInfo'])
        },
        mounted() {
            getSchoolTimeAllList()
                .then(res => {
                    for (let item of res.data.data) {
                        if (item.isCurrent == 1) {
                            this.query.schoolTimeId = item.id;
                            this.query.schoolTimename = item.schoolTimeName;
                            this.getPersonWorkPlanLists();
                        }
                    }
                }).catch(err => {
            });
        },
        methods: {
            popfun(department, principals, content,myobj) {
                this.dialogVisible = true;
                this.department = department;
                this.principals = principals;
                this.content = content;
                this.myobj=myobj
            },
            //获取周次
            getPersonWorkPlanLists() {
                getPersonWorkPlanList(this.query.schoolTimeId).then(res => {
                    let data = res.data.data;
                    this.weeklist = data;
                    for (let i = 0; i < this.weeklist.length; i++) {
                        if (this.weeklist[i].isCurrent == 1) {
                            this.query.week = this.weeklist[i].weekNo;
                        }
                    }
                    if (!this.query.week) {
                        this.query.week = this.weeklist[0].weekNo;
                    }
                    this.getPersonWorkPlanNoticeLists();
                }).catch(err => {
                });
            },
            getPersonWorkPlanNoticeLists() {
                getPersonWorkPlanNoticeList(this.query.schoolTimeId, this.query.week).then(res => {
                    let data = res.data.data;
                    this.dataList = data;
                }).catch(err => {
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .newWorkPlanindex {
        padding: 12px;

        .top {
            padding-bottom: 10px;
        }

        * {
            box-sizing: border-box;
            word-break: break-all;
            word-wrap: break-word;
        }

        .el-form-item {
            margin: 0;
        }

        .body {
            overflow: auto;

            .big-box {
                overflow: hidden;
                border-top: 1px solid #e7eaec;
                border-left: 1px solid #e7eaec;

                .box {
                    float: left;
                    width: 33.33333%;
                    border-right: 1px solid #e7eaec;
                    border-bottom: 1px solid #e7eaec;
                    padding: 10px;

                    .zanwu {
                        line-height: 200px;
                        text-align: center;
                        font-size: 18px;
                        color: #909399;
                    }

                    .name-top {
                        color: #909399;
                        font-size: 17px;
                        line-height: 36px;
                        font-weight: 600;
                    }

                    .ul {
                        font-size: 14px;
                        line-height: 30px;
                        height: 200px;
                        overflow: auto;

                        .li {
                            color: #409EFF;
                            cursor: pointer;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }

            }
        }
    }
</style>
