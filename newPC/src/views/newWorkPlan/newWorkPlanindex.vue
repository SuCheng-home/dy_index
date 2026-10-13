<template>
    <div class="newWorkPlanindex">
        <div class="top">
            {{query.schoolTimename}}
            <el-select class="selectWidth" size="medium" v-model="query.week" placeholder="请选择周次"
                       @change="getSchoolWorkPlanNoticeLists()">
                <el-option v-for="item in weeklist" :key="item.weekNo" :label='"第"+item.weekNo+"周"'
                           :value="item.weekNo"></el-option>
            </el-select>
            <el-button type="primary" size="medium" @click="newWorkPlanindexPrinting()">打印预览</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="big-box">
                <div class="box" :key="indexs" v-for="(items,indexs) in dataList">
                    <div class="name-top">{{items.dayName}} {{items.dayDate}}</div>
                    <div class="ul">
                        <div class="li" :key="index" @click="popfun(item)"
                             v-for="(item,index) in items.dayPlanList">{{index+1}}. {{item.content}}
                        </div>
                        <div class="zanwu" v-if="(items.dayPlanList.length==0)">暂无计划</div>
                    </div>
                </div>
            </div>
            <div class="remarks" v-if="remarks">
                <div class="remarksname">备注</div>
                <span v-html="remarks"></span>
            </div>
        </div>
        <el-dialog title="计划详情" :close-on-press-escape='false' :close-on-click-modal='false'
                   :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
            <el-form ref="form" label-width="100px">
                <el-form-item label="负责部门">{{myobj.department}}</el-form-item>
                <el-form-item label="参与人" v-if="myobj.planType==0">{{myobj.principals}}</el-form-item>
                <el-form-item label="时间" v-if="myobj.planType==0&&myobj.timeType&&(myobj.timeType!=-1)">
                                 <span v-if="myobj.timeType==1">全天</span>
                                 <span v-if="myobj.timeType==2">上午</span>
                                 <span v-if="myobj.timeType==3">下午</span>
                                 <span v-if="myobj.timeType==4">{{myobj.startTime}}</span>
                </el-form-item>
                 <el-form-item label="地点" v-if="myobj.planType==0&&myobj.place">
                         {{myobj.place}}
                </el-form-item>
                <el-form-item label="外出人员" v-if="myobj.planType==1">{{myobj.principals}}</el-form-item>
                <el-form-item label="计划内容" v-if="myobj.planType==0">{{myobj.content}}</el-form-item>
                <!-- <el-form-item label="负责部门"  v-if="myobj.planType==-1">{{myobj.department}}</el-form-item> -->
                <el-form-item label="计划内容" v-if="myobj.planType==-1">{{myobj.content}}</el-form-item>
                <el-form-item label="外出主题" v-if="myobj.planType==1">{{myobj.title}}</el-form-item>
                <el-form-item label="外出地点" v-if="myobj.planType==1">{{myobj.outPlace}}</el-form-item>
                <el-form-item label="外出时间" v-if="myobj.planType==1">{{myobj.outStartDate}}~{{myobj.outEndDate}}
                </el-form-item>
                <el-form-item label="外出内容" v-if="myobj.planType==1">{{myobj.content}}</el-form-item>
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
    import {getSchoolTimeAllList, getPersonWorkPlanList, getSchoolWorkPlanNoticeList} from "@/api/newWorkPlan";

    export default {
        data() {
            return {
                query: {
                    schoolTimeId: "",
                    departId: '',
                    schoolTimename: '',
                    week: ''
                },
                myobj: {
                    department: '',
                    principals: '',
                    content: '',
                    planType: 0,
                    outEndDate: '',
                    title: '',
                    outPlace: '',
                    outStartDate: '',
                },
                dataList: [],
                departIdlist: [],
                weeklist: [],
                dialogVisible: false,
                remarks: '',
                mainWorks: ''
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
            newWorkPlanindexPrinting() {
                this.$router.push({
                    path: "newWorkPlanindexPrinting",
                    query: {schoolTimeId: this.query.schoolTimeId, week: this.query.week,schoolTimename:this.query.schoolTimename}
                });
            },
            popfun(myobj) {
                this.dialogVisible = true;
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
                    this.getSchoolWorkPlanNoticeLists();
                }).catch(err => {
                });
            },
            getSchoolWorkPlanNoticeLists() {
                getSchoolWorkPlanNoticeList(this.query.schoolTimeId, this.query.week).then(res => {
                    let data = res.data.data;
                    this.dataList = data;
                    if (data[0].content) {
                        this.remarks = data[0].content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
                    } else {
                        this.remarks = '';
                    }
                    // if(data[0].mainWorks) {
                    //   this.mainWorks=data[0].mainWorks.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
                    // }else{
                    //   this.mainWorks='';
                    // }
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

            .remarks {
                position: relative;
                padding: 10px 0 10px 100px;
                line-height: 20px;
                color: #909399;
                font-size: 14px;
                line-height: 20px;

                .remarksname {
                    position: absolute;
                    top: 10px;
                    width: 90px;
                    text-align: right;
                    line-height: 20px;
                    height: 20px;
                    left: 0;
                    font-size: 15px;
                    font-weight: 600;
                    color: #606266;
                }
            }

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
