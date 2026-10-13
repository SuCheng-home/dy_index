<template>
    <div class="detail-allCon"  style="    padding: 12px;">
        <el-button class="detail-backBtn" size="medium" @click="LinkToBack()">返回</el-button>
        <div class="cutLineDetail"></div>
        <div class="detail-con">
            <div class="detail-titleCon">
                <div class="detail-titleConLeft"></div>
                <div class="detail-titleConText">学生信息</div>
            </div>
            <div class="detail-list">
                <div class="detail-listCon">
                    <div class="detail-listConLeft">姓名：</div>
                    <div>{{detailData.stuName}}</div>
                </div>
                <div class="detail-listCon">
                    <div class="detail-listConLeft">性别：</div>
                    <div>{{detailData.stuSex}}</div>
                </div>
                <div class="detail-listCon">
                    <div class="detail-listConLeft">年龄：</div>
                    <div>{{detailData.stuAge}}岁</div>
                </div>
                <div class="detail-listCon">
                    <div class="detail-listConLeft">班级：</div>
                    <div>{{detailData.className}}</div>
                </div>
                <!-- <div class="detail-listCon">
                    <div class="detail-listConLeft">所在学校：</div>
                    <div>{{detailData.schoolName}}</div>
                </div> -->
            </div>
            <div class="detail-titleCon">
                <div class="detail-titleConLeft"></div>
                <div class="detail-titleConText">预约人信息</div>
            </div>
            <div class="detail-list">
                <div class="detail-listCon">
                    <div class="detail-listConLeft">与学生关系：</div>
                    <div>{{detailData.stuRelation}}</div>
                </div>
                <div class="detail-listCon">
                    <div class="detail-listConLeft">手机号码：</div>
                    <div>{{detailData.mobile}}</div>
                </div>
            </div>
            <div class="detail-titleCon">
                <div class="detail-titleConLeft"></div>
                <div class="detail-titleConText">预约面询心理问题</div>
            </div>
            <div class="detail-leftText">{{detailData.illnessType}}</div>
            <div class="detail-titleCon">
                <div class="detail-titleConLeft"></div>
                <div class="detail-titleConText">预约面询心理问题程度</div>
            </div>
            <div class="detail-leftText">{{detailData.illnessLevel}}</div>
            <div class="detail-leftText" v-if="detailData.illnessLevelRemark">{{detailData.illnessLevelRemark}}</div>
            <div class="detail-titleCon">
                <div class="detail-titleConLeft"></div>
                <div class="detail-titleConText">面询流程</div>
            </div>
            <div class="detail-stepsCon">
                <div class="detail-stepsTop">
                    <div class="detail-stepsFirst">面询申请 <span style="margin-left: 95px">{{detailData.createName}}</span></div>
                    <div class="detail-stepsDate">{{detailData.createDate?detailData.createDate.substr(0,19):''}}</div>
                </div>
             
                <div class="detail-stepsBottom">预约时间：{{detailData.meetDate}}&nbsp;&nbsp;&nbsp;&nbsp;{{detailData.meetDateRange}}</div>
            </div>
            <!-- <div class="detail-stepsCon" v-if="detailData.meetTeacherName">
                <div class="detail-stepsTop">
                    <div class="detail-stepsFirst">面询分配</div>
                </div>
                <div class="detail-stepsBottom">面询老师:&nbsp;&nbsp;{{detailData.meetTeacherName}}</div>
            </div> -->
            <div class="detail-stepsCon" v-for="(item,index) in detailData.operationList" :key="index">
                <div class="detail-stepsTop" v-if="item.operateType == 1">
                    <div class="detail-stepsFirst">面询分配<span style="margin-left: 95px">{{item.createName}}</span></div>
                     <div class="detail-stepsDate">{{item.renderCreateDate}}</div>
                    <!-- <div class="detail-stepsDate">{{detailData.createDate?detailData.createDate.substr(0,19):''}}</div> -->
                </div>
                <div class="detail-stepsBottom"  v-if="item.operateType == 1">面询老师:&nbsp;&nbsp;{{detailData.meetTeacherName}}</div>
                <div class="detail-stepsTop" v-if="item.operateType !== 1">
                    <div class="detail-stepsFirst">{{item.renderState}} <span style="margin-left: 122px">{{item.createName}}</span></div>
                    <div class="detail-stepsDate">{{item.renderCreateDate}}</div>
                </div>
                <!-- <div class="detail-stepsBottom"  v-if="item.operateType !== 1">{{item.meetTeacherName}}</div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import { queryDetail } from "@/api/psychological";
    import _ from 'lodash';
    export default {
        data() {
            return {
                id:this.$route.query.id,//预约ID
                detailData:{gradeName:123},//详情数据源
            };
        },
        created(){
            this.GetDetail()
        },
        methods: {
            //返回
            LinkToBack(){
               this.$router.back();
            },
            //获取详情
            GetDetail(){
                queryDetail(this.id)
                    .then(res => res.data)
                    .then(data => {
                        this.detailData=data.data;
                        this.detailData.renderTimes=this.SetRenderTimes(this.detailData.saturdayOrder,this.sundayOrder);
                        this.detailData.operationList.map(v=>{
                            v.renderCreateDate=v.createDate.substr(0,19);
                            v.renderState=this.SetRenderState(v.operateType);
                        })
                    });
            },
            //设置渲染状态
            SetRenderState(e){
                return  e==1?'预约分配':e==2?'评价':e==3?'结案':e==4?'流失':e==5?'转介':'评价'
            },
            //设置渲染时间段
            SetRenderTimes(e,v){
                let tempRenderArr=[];
                e==1?tempRenderArr.push('周六-上午'):e==2?tempRenderArr.push('周六-下午'):e==3?tempRenderArr.push('周六-上午 周六-下午'):null;
                v==1?tempRenderArr.push('周日-上午'):v==2?tempRenderArr.push('周日-下午'):v==3?tempRenderArr.push('周日-上午 周日-下午'):null;
                return tempRenderArr.join(' ')
            }
        }
    };
</script>

<style scoped>
    .detail-backBtn{
        margin-bottom: 10px !important;
    }
    .cutLineDetail{
        width: 100%;
        height: 1px;
        background: #dcdfe6;
    }
    .detail-con{
        margin: 20px auto;
        width: 800px;
    }
    .detail-titleCon{
        display: flex;
        margin-top: 20px;
    }
    .detail-titleConLeft{
        width: 3px;
        height: 20px;
        background: #409EFF;
    }
    .detail-titleConText{
        margin-left: 10px;
        margin-bottom: 10px;
        line-height: 20px;
        font-size: 16px;
        font-weight: 600;
    }
    .detail-list{
        width: 300px;
        margin: 10px 0;
    }
    .detail-listCon{
        display: flex;
        margin-top: 10px;
        color: #666;
        font-size: 14px;
    }
    .detail-listConLeft{
        width: 100px;
        font-weight: bold;
        text-align: right;
        margin-right: 15px;
    }
    .detail-leftText{
        color: #666;
        margin: 10px 0 20px 10px;
    }
    .detail-stepsCon{
        background: #f2f6fa;
        margin-top: 20px;
        padding-bottom: 10px;
    }
    .detail-stepsTop{
        display: flex;
        justify-content: space-between;
    }
    .detail-stepsTop div{
        color: #666;
        margin: 10px;
    }
    .detail-stepsBottom{
        color: #666;
        margin: 0 0 10px 10px;
    }
    .detail-allCon{
        background: #fff;
        height: auto;
        padding-bottom: 20px;
    }
    .detail-stepsFirst{
        width: 350px;
    }
    .detail-stepsCon .detail-stepsDate{
        color: #909399;
    }


</style>
