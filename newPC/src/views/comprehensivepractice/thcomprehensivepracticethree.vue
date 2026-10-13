     <template>
  <div class="homeVisitadd">
    <el-tabs type="border-card" v-model="ruleForm.stageId" @tab-click="bigfun()">
      <el-tab-pane v-for="item in activityStageList" :key="item.id" :name="item.id" :label="item.stageName">
        <div class="body" :style="`height: ${maxH-55}px;`">
          <div class="body-box">
            <div v-show="ruleForm.state==0">
              <el-form :model="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="作业">
                  <el-input type="textarea" :rows="6" placeholder="请输入作业内容" v-model.trim="ruleForm.content"
                            :maxlength="500"></el-input>
                </el-form-item>
                <el-form-item label="学习资料">
                  <uploader pathPrefix="zongheshijianpingjia" module="zongheshijianpingjia" moduleCode="20220418" :multiple="true" :extList="allFileTypeList"
                            v-model="ruleForm.filesJson"></uploader>
                </el-form-item>
                <el-form-item label="学习图片">
                 <uploader pathPrefix="zongheshijianpingjia" module="zongheshijianpingjia" moduleCode="20220418" :multiple="true"  :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']"  :showResult="'image'"
                        v-model="ruleForm.photoJson" ></uploader>
                </el-form-item>
                <el-form-item>
                  <div style="float: right;">
                    <el-button type="primary" size="medium" @click="addActivityStageWork(0)">保存</el-button>
                    <el-button type="primary" size="medium" @click="addActivityStageWork(1)">发布</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div v-if="ruleForm.state==1">
              <el-form :model="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="作业">
                  {{ruleForm.content}}
                </el-form-item>
                <el-form-item label="" v-if="ruleForm.filesJson.length">
                  <file-list :fileList="ruleForm.filesJson"></file-list>
                </el-form-item>
                 <image-previewer tag="richtext">
                                <img :src="item.fileUrl" style="width:60px;height: 60px;margin-right: 10px;" alt="" :key="index"
                                    v-for="(item, index) in ruleForm.photoJson">
                              </image-previewer>
              </el-form>
            </div>
          </div>
          <div class="datalist-box" v-show="ruleForm.state==1">
            <div class="top">
              <div class="tab" @click="groupIdfun(item)" :class="item.id==groupId?'color':''"
                   v-for="(item,index) in datalist" :key="index">
                <span> {{item.groupName}} </span><i class="el-icon-star-on" :class="item.isFine==1?'icolor':''"
                                                    @click.stop="finedActivityStageGroups(item.id,item.isFine)"></i>
              </div>
              <el-button type="primary" size="small" icon="upload" style="float: right;height: 34px;" @click="downWork">下载学生作品</el-button>
              <uploader pathPrefix="zongheshijianpingjia" module="zongheshijianpingjia" moduleCode="20220418" :multiple="true" :extList="stuFileTypeList" buttonText="上传小组作品"
                        v-model="fileList" @input="changePic" style="float: right;margin-right: 8px;"></uploader>
            </div>

            <div class="work_list clearfix">
              <div class="work_item" :key="workItem.id" v-for="(workItem,index) in workList">
                 <i class="el-icon-delete" @click="delGroupOpusById(workItem.id,index)"></i>
                <el-image class="pic_box" :src="workItem.opusUrl" :preview-src-list="[workItem.opusUrl]" fit="cover" v-if="workItem.opusType===1"></el-image>
                <video :src="workItem.opusUrl" v-else-if="workItem.opusType===2" controls></video>
              </div>
            </div>
            <el-table ref="table" stripe :data="stulist" border fit highlight-current-row style="width: 100%">
              <el-table-column align="center" label="姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                                          <span v-if="scope.row.state >0" class="link"
                                                @click="popfun(scope.row.stuId,scope.row.id)">
                                              {{scope.row.stuName}}
                                              <i class="el-icon-star-on"
                                                 v-if="scope.row.isFine==2&&scope.row.state==2"></i>
                                          </span>
                  <span v-else>
                                              {{scope.row.stuName}}
                                            </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="班级">
                <template slot-scope="scope">
                  <span>{{scope.row.className}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="等第">
                <template slot-scope="scope">
                  <span>{{scope.row.state==2?scope.row.rankName:"----"}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="点赞">
                <template slot-scope="scope">
                  <span>{{scope.row.thumbCount || 0}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  <el-tag size="mini" type="info" v-if="scope.row.state < 1">未提交</el-tag>
                  <el-tag size="mini" type="warning" v-if="scope.row.state == 1">待审核</el-tag>
                  <el-tag size="mini" type="success" v-if="scope.row.state == 2">通过</el-tag>
                  <el-tag size="mini" type="danger" v-if="scope.row.state == 3">不通过</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="popfun(scope.row.stuId,scope.row.id)"
                             :disabled="scope.row.state != 1">审核
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-dialog title="学生作业" :close-on-press-escape='false' :append-to-body='true' :close-on-click-modal='false'
                   :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
          <el-form ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="学生作业">
              {{workContent}}
            </el-form-item>
            <el-form-item label="学生作业图片" v-if="workPicsJson.length">
              <image-previewer tag="richtext">
                <img :src="item.photoUrl" style="width:60px;height: 60px;margin-right: 10px;" alt="" :key="index"
                     v-for="(item, index) in workPicsJson">
              </image-previewer>
            </el-form-item>
            <el-form-item label="状态" v-if="(mystate==2||mystate==3)">
              {{mystate==2?"通过":"不通过"}}
            </el-form-item>
            <el-form-item label="等第" v-if="(mystate==2)">
              {{rankName}}
            </el-form-item>
            <el-form-item label="是否加精" v-if="(mystate==2)">
              {{isFine==1?"未加精":"已加精"}}
            </el-form-item>
            <el-form-item label="评语" v-if="(mystate==2||mystate==3)&&evalOption">
              {{evalOption}}
            </el-form-item>
            <el-form-item label="等第" v-if="(mystate==1)">
              <el-radio v-model="rank" :label="1">优秀</el-radio>
              <el-radio v-model="rank" :label="2">良好</el-radio>
              <el-radio v-model="rank" :label="3">及格</el-radio>
              <el-radio v-model="rank" :label="4">不及格</el-radio>
            </el-form-item>
            <el-form-item label="是否加精" v-if="(mystate==1)">
              <el-switch v-model="isFine">
              </el-switch>
            </el-form-item>
            <el-form-item label="评语" v-if="(mystate==1)">
              <el-input
                type="textarea"
                placeholder="请输入评语内容"
                v-model.trim="evalOption"
                maxlength="30"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false">关 闭</el-button>
                      <el-button type="primary" v-if="(mystate==1)" @click="examActivityStuWorks(2)">通 过</el-button>
                      <el-button type="primary" v-if="(mystate==1)" @click="examActivityStuWorks(3)">不通过</el-button>
                    </span>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import mixin from "@/mixins/windowResize";
  import RangeList from "@/components/RangeList/RangeList";
  import FileList from '@/components/FileList/FileList.vue';
  import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
  import Uploader from '@/components/Uploader/WebUploader';
  import {
    getPracticeActivityInfoById,
    editActivityStageWork,
    addActivityStageWork,
    getThActivityStageWorkInfoByStageId,
    getActivityGroupWorkStaticsDataListByTh,
    finedActivityStageGroup,
    cancelFinedActivityStageGroup,
    getActivityGroupStuWorkPageList,
    getStuSubmitActivityStageWorkInfo,
    examActivityStuWork,
    exportActivityStageGroupStuWorkDatas,
    addPracticeActivityGroupOpusList,delGroupOpusById
  } from "@/api/comprehensivepractice";

  export default {
    components: {RangeList, FileList, ImagePreviewer, Uploader},
    data() {
      return {
        stuFileTypeList: ['png', 'jpg', 'mp4'],
        fileList: [],
        activityStageList: [],
        ruleForm: {
          activityId: this.$route.query.id,// 活动ID  number
          content: "",//  阶段作业内容  string
          filesJson: [],//  阶段作业附件JSON  string
          id: 0,//  主键ID  number
          stageId: "",//  阶段ID  number
          state: 0,// 阶段作业状态 0草稿 1发布  number
          photoJson:[],
        },
        allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
        datalist: [],
        groupId: "",
        opusType: 1,
        opusUrl: '',
        stulist: [],
        stuid: "",
        workPicsJson: [],
        workContent: "",
        mystate: -1,
        rankName: "",
        evalOption: "",
        rank: 1,
        isFine: false,
        dialogVisible: false,
        isnum: 0,
        photoJson:[]
      };
    },
    mixins: [mixin],
    created() {
      this.getPracticeActivityInfoByIds();
    },
    methods: {
       delGroupOpusById(id,num) {
                this.$confirm('是否删除分组作品', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delGroupOpusById(id)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.workList.splice(num,1);
                                this.$forceUpdate();
                            }
                        })
                });

            },
      bigfun() {
        this.getThActivityStageWorkInfoByStageIds();
      },
      downWork() {
        exportActivityStageGroupStuWorkDatas({
          activityId: this.$route.query.id,
          stageId: this.ruleForm.stageId,
          groupId: this.groupId
        }).then(res => res.data).then(data => {
          if (data.result) {
            const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'http://api.weixiaojia.net/';
            window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.zipName}&key=${data.data.key}&token=${this.$store.getters.token}`, "_blank");
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
          })
      },
      popfun(stuId, id) {
        this.stuid = id;
        this.dialogVisible = true;
        getStuSubmitActivityStageWorkInfo(this.ruleForm.stageId, stuId).then(res => res.data).then(data => {
          let mydata = data.data;
          this.workContent = mydata.workContent;
          this.mystate = mydata.state;
          this.workPicsJson = mydata.workPicsJson ? JSON.parse(mydata.workPicsJson) : [];
          this.photoJson = mydata.photoJson?JSON.parse(mydata.photoJson):[]; 
          this.rankName = mydata.rankName;
          this.evalOption = mydata.evalOption;
          this.isFine = (mydata.state == 2) ? mydata.isFine : false;
        })
      },
      getPracticeActivityInfoByIds() {
        getPracticeActivityInfoById(this.$route.query.id).then(res => res.data).then(data => {
          let mydata = data.data;
          this.activityStageList = mydata.activityStageList;
          this.ruleForm.stageId = this.activityStageList[0].id;
          this.bigfun();
        })
      },
      getThActivityStageWorkInfoByStageIds() {
        getThActivityStageWorkInfoByStageId(this.$route.query.id, this.ruleForm.stageId, 0).then(res => res.data).then(data => {
          let mydata = data.data;
          if (mydata && mydata.id) {
            this.ruleForm.id = mydata.id;
            this.ruleForm.content = mydata.content;
            this.ruleForm.filesJson = mydata.filesJson ? JSON.parse(mydata.filesJson) : [];
             this.ruleForm.photoJson = mydata.photoJson ? JSON.parse(mydata.photoJson) : [];
            this.ruleForm.state = mydata.state;
          } else {
            this.ruleForm.id = 0;
            this.ruleForm.content = "";
            this.ruleForm.filesJson = [];
             this.ruleForm.photoJson = [];
            this.ruleForm.state = 0;
          }
          this.isnum = 0;
        })
        this.getActivityGroupWorkStaticsDataListByTh();
      },
      getActivityGroupWorkStaticsDataListByTh() {
        getActivityGroupWorkStaticsDataListByTh(this.$route.query.id, this.ruleForm.stageId, 0).then(res => res.data).then(data => {
          let mydata = data.data;
          this.datalist = mydata;
          if (mydata.length) {
            this.groupId = this.groupId ? this.groupId : mydata[0].id;
            this.workList = this.workList&&this.workList.length ? this.workList : mydata[0].groupOpusList;
            this.getActivityGroupStuWorkPageLists();
          }
        })
      },
      groupIdfun(info) {
        this.groupId = info.id;
        this.workList = info.groupOpusList;
        this.getActivityGroupStuWorkPageLists()
      },
      getActivityGroupStuWorkPageLists() {
        getActivityGroupStuWorkPageList({
          activityId: this.$route.query.id, stageId: this.ruleForm.stageId, groupId: this.groupId
        }).then(res => res.data).then(data => {
          this.stulist = data.data.dataList;
        })
      },
      changePic(val) {
        if (this.groupId && val && val.length) {
          if (val[0].fileUrl.indexOf('.mp4') > -1) {
            this.opusType = 2;
          } else {
            this.opusType = 1;
          }
          this.opusUrl = val[0].fileUrl;
          let query = {
            groupId: this.groupId,
            activityId: this.$route.query.id,
            opusType: this.opusType,
            opusUrl: this.opusUrl
          };

          this.addPracticeActivityGroupOpusList([query]);
        }
      },
      addPracticeActivityGroupOpusList(query) {
        addPracticeActivityGroupOpusList(query).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.$message({
              message: "添加成功！",
              type: "success"
            });
            this.fileList = [];
            this.workList.unshift(query[0]);
          }
        })
      },
      addActivityStageWork(state) {
        if (!this.ruleForm.content) {
          this.$message({
            message: '请输入作业内容!',
            type: 'warning'
          });
          return;
        }
        this.ruleForm.state = state;
        if (this.isnum == 0) {
          this.isnum = 1
          if (this.ruleForm.id == 0) {
            addActivityStageWork(this.ruleForm).then(res => res.data).then(data => {
              if (data.result) {
                this.$message({
                  message: '新增成功！',
                  type: 'success',
                  duration: 1000
                });
                this.getThActivityStageWorkInfoByStageIds();
              } else {
                this.$message({
                  message: data.msg,
                  type: 'warning'
                });
                this.ruleForm.state = 0;
              }
            }).catch(() => {
            })

          } else {
            editActivityStageWork(this.ruleForm).then(res => res.data).then(data => {
              if (data.result) {
                this.$message({
                  message: '编辑成功！',
                  type: 'success',
                  duration: 1000
                });
                this.getThActivityStageWorkInfoByStageIds();
              } else {
                this.$message({
                  message: data.msg,
                  type: 'warning'
                });
                this.ruleForm.state = 0;
              }
            }).catch(() => {
            })
          }
        }

      },
      finedActivityStageGroups(id, num) {
        if (num == 0) {
          this.$confirm('是否加精', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            finedActivityStageGroup(id, this.ruleForm.stageId, this.$route.query.id)
              .then(res => res.data)
              .then(data => {
                if (data.code == 200) {
                  this.$message({
                    message: "加精成功！",
                    type: "success"
                  });
                  this.getThActivityStageWorkInfoByStageIds();
                }
              });

          }).catch(() => {
          });

        }
        if (num == 1) {
          this.$confirm('是否取消加精', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            cancelFinedActivityStageGroup(id, this.ruleForm.stageId, this.$route.query.id)
              .then(res => res.data)
              .then(data => {
                if (data.code == 200) {
                  this.$message({
                    message: "取消加精成功！",
                    type: "success"
                  });
                  this.getThActivityStageWorkInfoByStageIds();
                }
              });


          }).catch(() => {
          });
        }
      },
      examActivityStuWorks(num) {
        if (!this.evalOption && num == 3) {
          this.$message({
            message: '请输入评语内容!',
            type: 'warning'
          });
          return;
        }
        let obj = {
          isFine: this.isFine + 1,
          state: num,
          id: this.stuid,
          rank: this.rank,
          rankName: this.rank == 1 ? "优秀" : (this.rank == 2 ? "良好" : (this.rank == 3 ? "及格" : "不及格")),
          evalOption: this.evalOption ? this.evalOption : "",
        }
        this.dialogVisible = false;
        examActivityStuWork(obj).then((res) => {
          if (res.data.code === 200) {
            this.$message({message: "审核成功！", type: "success"});
            this.getActivityGroupStuWorkPageLists();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }).catch(() => {
        });

      },
    }
  };
</script>
<style lang="scss" scoped>
  .homeVisitadd {
    padding: 12px;

    .body {
      overflow: auto;
    }

    .body-box {
      width: 810px;
    }

    .link {
      color: #409eff;
      cursor: pointer;

      i {
        color: #E6A23C;
      }
    }

    .datalist-box {
      .top {
        overflow: hidden;
        font-size: 14px;
        padding-bottom: 10px;

        .tab {
          float: left;
          padding: 10px;
          border-bottom: 2px solid #E4E7ED;
          color: #606266;
          margin: 0 5px;
          cursor: pointer;

          i {
            font-size: 20px;
            color: #909399;
          }

          .icolor {
            color: #E6A23C;
          }
        }

        .color {
          border-bottom: 2px solid #409EFF;
          color: #409EFF;
        }
      }

      .work_list{
        padding-top: 10px;
        .work_item{
          float: left;
          width: 160px;
          height: 120px;
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid #efefef;
          position: relative;
          .el-icon-delete{
            position: absolute;
            right: 3px;
            top:3px;
            color: #F56C6C;
            font-size: 18px;
            cursor:pointer;
            z-index: 1000;
          }
          .pic_box{
            width: 100%;
            height: 100%;
          }
          video{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>
