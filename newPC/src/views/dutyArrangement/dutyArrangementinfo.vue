<template>
  <div class="dutyArrangementinfo">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click.native="dutyArrangementadd">编辑</el-button>
      <el-button type="primary" size="medium" @click.native="arrangelist">值班安排</el-button>
    </div>

    <div class="body" :style="`height: ${maxH}px;`">
        <div class="bodybox">
             <div class="title">值班组信息</div>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
                <el-form-item label="值班组名称" >
                    {{ruleForm.title}}
                </el-form-item>
                <el-form-item label="提醒人员设置" v-if="ruleForm.isRemindElse==2||ruleForm.isRemindWacthTh==2">
                      <span v-if="ruleForm.isRemindWacthTh==2" >提醒值班人员&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span v-if="ruleForm.isRemindElse==2">提醒其它人员</span>
                </el-form-item>
                <el-form-item label="提醒时间" v-if="ruleForm.isRemindElse==2||ruleForm.isRemindWacthTh==2">
                   {{ruleForm.remindTime}}
                </el-form-item>
                <el-form-item label="其他提醒人员" v-if="ruleForm.isRemindElse==2">
                    <span v-for="item in JSON.parse(ruleForm.elseJson)" :key="item.id">
                        {{item.name}}&nbsp;&nbsp;
                    </span>
                </el-form-item>
                <el-form-item label="提醒内容"  v-if="ruleForm.isRemindWacthTh==2">
                   {{ruleForm.remindWatchThText}}
                </el-form-item>
                <el-form-item label="其他人员提醒内容"  v-if="ruleForm.isRemindElse==2">
                   {{ruleForm.remindElseText}}
                </el-form-item>                
                <el-form-item label="值班方式"  >
                    {{ruleForm.watchType==1?'按照周次':'按照日期'}}
                </el-form-item>
                <el-form-item label="值班时段"  v-if="ruleForm.watchType==1">
                    {{dateRange[0]}} ~ {{dateRange[1]}}
                 </el-form-item>  
                <el-form-item label="是否签到" >
                    {{ruleForm.isSign==1?'否':'是'}}
                </el-form-item>   
                <el-form-item label="签到方式" v-if="ruleForm.isSign==2">
                    {{ruleForm.signType==1?'扫码签到':'选择签到单'}}
                </el-form-item>  
                <el-form-item label="签到单" v-if="ruleForm.signType==2">
                 {{ruleForm.signSheetName}}
            </el-form-item>      
            </el-form>
            <div class="title">值班岗位
              <div class="addbox" @click="addfun()">
                添加岗位
              </div>
            </div>
            <div class="imgbox">
              <div class="img" v-for="(item,index) in gangweiList" :key="index">
                <i class="el-icon-edit" @click="eidtfun(item)"></i>
                <i class="el-icon-delete" @click="delWatchGroupStation(item.id)"></i>
                <img :src="item.url">
                {{item.title}}
              </div>
            </div>
             <default-page Mes="暂无值班岗位" v-if="gangweiList.length==0"></default-page>
        </div>
    </div>
      <el-dialog :title="type==1?'新增值班岗位':'编辑值班岗位'"   :visible.sync="pop">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="值班岗位" prop="newtitle" >
                    <el-input v-model.trim="ruleForm.newtitle" placeholder="请输入值班岗位名称" :maxlength="20" ></el-input>
                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pop = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import QRCode from 'qrcode'
  import {mapGetters} from 'vuex';
  import DefaultPage from "@/components/DefaultPage";
  import {getWatchGroup,uddateWatchGroupStation,delWatchGroupStation,addWatchGroupStation,getWatchGroupStationList} from '@/api/dutyArrangement';
  export default {
    data() {
      return {
        groupId: this.$route.query.groupId,
        ruleForm: {
          title:'',//	名称	string  
          isRemindElse:1,//	提醒其它人员 1 不提醒 2 提醒	number	
          isRemindWacthTh:1,//	提醒值班人员 1不提醒 2 提醒	number	          
          elseJson:[],//	其它人员json	string	
          remindTime:'06:00',//	提醒时间	string	
          remindElseText:'',//	其它人员提醒内容	string
          remindWatchThText:'',//	值班人员提醒内容	string
          watchType:2,//	值班方式 1 按周 2 按日期	number
          endDate:'',//	结束日期	string
          startDate:'',//	开始日期	string	
          isSign:1,//	是否签到 1 否 2 签到	number	          	
          signSheetCode:'',//	签到单code	string	
          signSheetName:'',//	签到单名称	string	
          signType:1,//	1 扫码 2 签到单	number     
          newtitle:''     
        },
        dateRange: ['', ''],
        pop:false,
        type:1,
        rules: {
            newtitle: [
              {
                required: true,
                message: "请输入值班岗位名称",
                trigger: "blur"
              }
            ],
          },
        stationId:'',
        gangweiList:[],
        mynum:0
      }     
    },
    components: { DefaultPage },
    mixins: [mixins],
     computed: {
            ...mapGetters([
                'userInfo',
                'schoolInfo'
            ])
        },
    created() {
        this.getWatchGroup();
        this.getWatchGroupStationList()
    },
    methods: {
    getWatchGroupStationList(){
          getWatchGroupStationList(this.groupId)
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                           for(let i=0;i<data.data.length;i++){
                             data.data[i].url=""
                           }
                           this.gangweiList = data.data
                           let  baseHref = window.location.href.indexOf('www.weixiaojia.net') !== -1 || window.location.href.indexOf('localhost') !== -1 ? 'http://www.weixiaojia.net/' : 'http://www.weixiaojia.cn/';
                           for(let i=0;i<this.gangweiList.length;i++){
                                QRCode.toDataURL(`${baseHref}wxcepClient/wxapp/sso?state=WATCHSIGN-NEW_${this.gangweiList[i].id}&schoolId=${this.schoolInfo.id}`)
                                .then(url => {
                                    this.gangweiList[i].url = url;
                                })
                                .catch(() => {
                                });
                            }
                             
                           
                        }
                    })
    },
    addfun(){
      this.ruleForm.newtitle=''
      this.pop=true
      this.type=1
    },
    eidtfun(obj){
      this.ruleForm.newtitle=obj.title
      this.pop=true
      this.type=2
      this.stationId=obj.id
    },
     delWatchGroupStation(id) {
                let _this = this;
                this.$confirm('确认删除岗位？', '提示', {
                    type: 'error'
                }).then(() => {
                    delWatchGroupStation(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getWatchGroupStationList();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
       //编辑新增
    submitForm(formName) {
      let $this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {        
          if ($this.type == 1) {
            addWatchGroupStation({
              title:this.ruleForm.newtitle,
              groupId:this.groupId
            })
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "新增成功!"
                  });
                   this.pop=false
                  this.getWatchGroupStationList();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {});
          } else {
            uddateWatchGroupStation({
              title:this.ruleForm.newtitle,
              groupId:this.groupId,
              id:this.stationId
            })
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });
                  this.pop=false
                  this.getWatchGroupStationList();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {});
          }
          $this.mydialogVisibleone = false;
        }
      });
    },
      goBack() {
        this.$router.back();
      },
      arrangelist(){
        if(this.ruleForm.watchType==1){
          this.$router.push({
                    path: 'arrangelistweek',
                    query:{
                         groupId: this.$route.query.groupId,
                         watchType:this.ruleForm.watchType
                    }
                });

        }else{
          this.$router.push({
                    path: 'arrangelist',
                    query:{
                         groupId: this.$route.query.groupId,
                         watchType:this.ruleForm.watchType
                    }
                });

        }
         
      },
      dutyArrangementadd(){
         this.$router.push({
                    path: 'dutyArrangementadd',
                    query:{
                         groupId: this.$route.query.groupId
                    }
                });
      },
      getWatchGroup() {
        getWatchGroup(this.groupId).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.ruleForm.title = data.title;
            this.ruleForm.isRemindElse = data.isRemindElse;
            this.ruleForm.isRemindWacthTh = data.isRemindWacthTh;
            this.ruleForm.elseJson =data.elseJson;
            if(data.remindTime){
              this.ruleForm.remindTime=data.remindTime
            }
            this.ruleForm.remindElseText = data.remindElseText;
            this.ruleForm.remindWatchThText = data.remindWatchThText;
            this.ruleForm.watchType = data.watchType;
            this.ruleForm.isSign = data.isSign;
            this.ruleForm.signSheetName = data.signSheetName;
            this.ruleForm.signType = data.signType;
            if(data.startDate){
              this.dateRange=[data.startDate,data.endDate]
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped="scoped">
  .dutyArrangementinfo {
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .imgbox{
      overflow: hidden;
      .img{
        float: left;
        width: 180px;
        padding: 9px;
        padding-top: 30px;
        margin: 10px;
        border-radius: 5px;
        border: 1px solid #409eff;  
        text-align: center;   
        color: rgb(64, 158, 255);
      background: rgb(236, 245, 255);
      border-color: rgb(179, 216, 255);   
      position: relative;
        img{
          width: 160px;
          display: block;
          margin-bottom: 10px;
        }
        .el-icon-edit{
          position: absolute;
          right:35px;
          top:5px;
          color:#409eff;
        }
        .el-icon-delete{
          position: absolute;
          right:5px;
          top:5px;
          color: red;
        }
      }
    }
    .body{
        overflow: auto;
        .bodybox {
            width: 810px;
            margin: 20px auto;
             .title{
                line-height: 20px;
                font-size: 18px;
                border-left: 3px solid #409eff;
                padding-left: 10px;
                margin: 15px 0;
                color:#111;
                .addbox{
                  float: right;
                  color:#409eff;
                  font-size: 14px;
                  cursor:pointer;
                }
              }
        }
        .el-form-item{
              margin-bottom: 0px;
        }
    }
   
  }
</style>
