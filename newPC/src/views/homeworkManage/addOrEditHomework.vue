<template>
  <div class="addOrEditHomework app-container">
    <el-row style="padding-bottom:20px">
      <!--编辑-->
      <el-col v-if="$route.query.isCopy === false">
        <backtool>
          <el-button size="medium" class="filter-item" type="primary" :disabled="isButtonDisabled"
                     :loading="isShowBtnLoading"
                     @click="saveFormEdit('form','1')">保存草稿
          </el-button>
          <el-button size="medium" class="filter-item" type="primary" :disabled="isButtonDisabled"
                     :loading="isShowBtnLoading"
                     @click="saveFormEdit('form','2')">发 布
          </el-button>
          <el-button size="medium" class="filter-item" type="primary" :disabled="isButtonDisabled"
                     :loading="isShowBtnLoading"
                     @click="editAndPreviewHomework('form')">保存并预览
          </el-button>
        </backtool>
      </el-col>
      <!--新建和复制-->
      <el-col v-else>
        <backtool>
          <el-button size="medium" class="filter-item" type="primary" :disabled="isButtonDisabled"
                     :loading="isShowBtnLoading"
                     @click="saveFormNew('form','1')">保存草稿
          </el-button>
          <el-button size="medium" class="filter-item" type="primary" :disabled="isButtonDisabled"
                     :loading="isShowBtnLoading"
                     @click="saveFormNew('form','2')">发 布
          </el-button>
          <el-button size="medium" class="filter-item" type="primary" :disabled="isButtonDisabled"
                     :loading="isShowBtnLoading"
                     @click="addAndPreviewHomework('form')">保存并预览
          </el-button>
        </backtool>
      </el-col>
    </el-row>
    <div :style="'height:'+maxH+'px;overflow: auto;'">
      <div style="width:810px;padding-top:20px;    margin: 0 auto;">
        <el-form ref="form" :model="query" label-width="140px" :rules="rules">
          <el-form-item label="学科名称" prop="curriculumId">
            <el-select @change="selectChange" v-model="query.curriculumId" placeholder="请选择学科名称">
              <el-option v-for="item in items" :label="item.name" :value="item.id"
                         :key="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布类型" prop="publishType" style="line-height:36px">
            <el-radio-group v-model="query.publishType">
              <el-radio label="0">按班级</el-radio>
              <el-radio label="1">按学生</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择班级" prop="departIds" v-if="query.publishType ==='0'">
            <el-select multiple :disabled="query.curriculumId === null" @change="classSelectChange"
                       v-model="query.departIdss" placeholder="请选择班级">
              <el-option v-for="item in classTypeItems" :label="item.name" :value="item.id"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择学生" prop="workStuJson" v-if="query.publishType ==='1'">
            <address-book v-model="query.workStuJson" :groupDisabled="true" :config="configData" :isSchoolManager="true"></address-book>
          </el-form-item>
          <el-form-item label="需要家长在线提交">
            <el-tooltip :content="query.isTurn === 1 ? '需要' : '不需要'" placement="top">
              <el-switch v-model="query.isTurn" :active-value="1" :inactive-value="0" on-text="是"
                         off-text="否"></el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="向家长推送消息">
            <el-tooltip :content="query.notNotice === 0 ? '发送' : '不发送'" placement="top">
              <el-switch v-model="query.notNotice" :active-value="0" :inactive-value="1" on-text="是"
                         off-text="否"></el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="作业完成预计时长">
            <el-input-number v-model="query.preFinishDur" controls-position="right" :min="0"
                             :max="400"></el-input-number>&nbsp;&nbsp;分钟
          </el-form-item>
          <el-form-item class="new-editor" prop="content" label="作业内容">
            <br/>
            <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor" ref="richText"
                     :defaultMes="query.content" @editModel="richTextEditHandler"></ueditor>
          </el-form-item>
          <el-form-item label="图片"
                        v-if="this.$route.query.id !== undefined&&query.pics !==null && query.pics.length !== 0">
            <ul class="pic-container"
                style="margin-top:20px">
              <li class="pic" v-for="(picItem, index) in query.pics"
                  :style="`background-image: url(${picItem.maxPic})`" :key="picItem.id">
                <span class="img-box-item-close" @click="delPicHandler(index)"></span>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="视频">
                <uploader pathPrefix="zuoye" module="zuoye" moduleCode="202" :extList="['mp4','flv']" v-model="videoJson" :multiple="true"></uploader>
          </el-form-item>
          <el-form-item label="附件">
            <uploader pathPrefix="zuoye" module="zuoye" moduleCode="202" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']"
                      v-model="files" :multiple="true"></uploader>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    getCourseList,
    getClassListByCourseId,
    addAndPreviewHomework,
    addDraftOrPubHomework,
    editAndPreviewHomework,
    editDraftOrPubHomework,
    getHomeworkById
  } from '@/api/homework';
  import Ueditor from '@/components/Ueditor';
  import mixin from '@/mixins/windowResize';
  import Uploader from '@/components/Uploader/WebUploader';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';

  export default {
    name: "addOrEditHomework",
    data: function () {
      const departIdsValidator = (rule, value, callback) => {
        if (this.query.publishType === '0' &&
          this.query.departIdss.length === 0
        ) {
          callback(new Error('请选择班级'));
        } else {
          callback();
        }
      };
      const workStuJsonValidator = (rule, value, callback) => {
        if (
          this.query.publishType === '1' &&
          (
            JSON.stringify(this.query.workStuJson) === '{}' ||
            this.query.workStuJson.userJson.length === 0
          ) && (this.query.workStuJson.groupJson.length === 0)
        ) {
          callback(new Error('请选择学生'));
        } else {
          callback();
        }
      };
      return {
        rules: {
          curriculumId: [{
            required: true,
            message: '请选择学科名称',
            trigger: 'change',
            type: 'number'
          }],
          departIds: [{
            required: true,
            validator: departIdsValidator
          }],
          content: [{
            required: true,
            message: '请输入内容',
            trigger: 'change'
          }],
          workStuJson: [{
            required: true,
            validator: workStuJsonValidator
          }]
        },
        items: [],
        classTypeItems: [],
        files: [],
        videoJson: [],
        query: {
          id: null,
          content: '',
          curriculumId: null,
          departIdss: [],
          departIds: [],
          walkClassIds: [],
          pics: [],
          fileJson: '',
          homeworkState: 0,
          homeworkType: 0,
          picJson: '',
          title: '',
          publishType: '0',
          workStuJson: {},
          isTurn: 1,
          notNotice: 0,
          videoJson: '',
          preFinishDur: 0,
        },
        workStuJson: {},
        configData: {
          title: '选择用户',
          depart: {target: 'user', departType: 's', userTypes: '2', notCheckSchool: true},
          // group: {
          //   groupTarget: false, groupScope: [2]
          // }
           group: true
        },
        isButtonDisabled: false,
        isShowBtnLoading: false,
        iskm: true,
      }
    },
    components: {
      Ueditor,
      AddressBook,
      ImagePreviewer,
      Uploader
    },
    mixins: [mixin],
    mounted() {
      //通过$route.query判断是编辑还是新建
      if (this.$route.query.id !== undefined) {
        getHomeworkById({homeworkId: this.$route.query.id}, sessionStorage.getItem("homeworkschoolTimeId"))
          .then(res => res.data)
          .then(data => {
            data.data.content = data.data.content.replace(/url\(['"](.*?)['"]\)/g, 'url(&quot;$1&quot;)');
            const pageData = data.data;
            this.query.content = pageData.content;
            this.$refs.richText.setContent(this.query.content);
            this.query.curriculumId = pageData.curriculumId;
            this.query.id = pageData.id;
            this.query.departIdss = pageData.departs.concat(pageData.walkClassList).map(res => {
              return res.id + 0;
            });
            this.query.isTurn = pageData.isTurn;
            this.query.title = pageData.title;
            this.query.picJson = pageData.picJson;
            this.query.notNotice = pageData.notNotice;
            this.query.preFinishDur = pageData.preFinishDur;
            getCourseList(sessionStorage.getItem("homeworkschoolTimeId"))
              .then(res => res.data)
              .then(data => {
                this.items = data.data;
                getClassListByCourseId(pageData.curriculumId, sessionStorage.getItem("homeworkschoolTimeId"))
                  .then(res => {
                    this.classTypeItems = res.data.data;
                  });
              });
            this.files = pageData.files;
            this.videoJson = pageData.videoJson ? JSON.parse(pageData.videoJson) : [];
            this.query.publishType = pageData.publishType.toString();
            if (this.query.publishType === '1') {//只有发布范围是学生时
              this.$nextTick(function () {
                this.query.workStuJson = {userJson: JSON.parse(pageData.workStuJson),groupJson: JSON.parse(pageData.stuGroupsJson)};
             console.log( this.query.workStuJson,'123')
             });
            }

            if (pageData.pics !== null &&
              pageData.pics.length !== 0) {
              this.query.pics = pageData.pics;
            } else {
              this.query.pics =
                pageData.picJson === 'null' ||
                pageData.picJson === '' ||
                pageData.picJson === null ?
                  [] : JSON.parse(pageData.picJson);
            }

          });

      } else {
        getCourseList(sessionStorage.getItem("homeworkschoolTimeId"))
          .then(res => res.data)
          .then(data => {
            this.items = data.data;
            this.query.curriculumId = this.items[0].id;
            getClassListByCourseId(this.items[0].id, sessionStorage.getItem("homeworkschoolTimeId"))
              .then(res => {
                this.classTypeItems = res.data.data;
              });
          });
      }
    },
    methods: {
      delPicHandler(index) {
        this.query.pics.splice(index, 1);
      },
      selectChange(val) {
        const that = this;
        this.items.map(function (item) {
          if (item["id"] === val) {
            that.query.title = item["name"]
          }
        });
        this.query.curriculumId = val;
        this.query.departIdss = [];
        this.iskm = false;

        getClassListByCourseId(this.query.curriculumId, sessionStorage.getItem("homeworkschoolTimeId"))
          .then(res => {
            this.classTypeItems = res.data.data;

          });
      },
      classSelectChange(val) {
        this.query.departIdss = val
      },
      saveFormNew(formName, key) {//新增草稿或提交发布
        this.query.content = this.$refs.richText.getContent();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].id == this.query.curriculumId) {
                this.query.title = this.items[i].name;
              }
            }
            this.query.isTurn = this.query.isTurn ? 1 : 0;
            if (this.query.departIdss.length != 0) {
              let list = this.query.departIdss;
              this.query.departIds = [];
              this.query.walkClassIds = [];
              for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < this.classTypeItems.length; j++) {
                  if (this.classTypeItems[j].id == list[i]) {
                    if (this.classTypeItems[j].type == 0) {
                      this.query.walkClassIds.push(list[i])
                    } else {
                      this.query.departIds.push(list[i])
                    }
                  }
                }
              }
            }
            const that = this;
            this.isShowBtnLoading = true;
            this.isButtonDisabled = true;
            this.query.homeworkState = key;
            this.query.fileJson = JSON.stringify(this.files);
            this.query.videoJson = this.videoJson.length ? JSON.stringify(this.videoJson) : '';
            addDraftOrPubHomework(this.query, sessionStorage.getItem("homeworkschoolTimeId")).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: key === '1' ? '保存成功！' : '发布成功！'
                });
                this.$router.push({path: 'homeworkIndex'})
              }
              that.isShowBtnLoading = false;
              that.isButtonDisabled = false;
            }).catch(function () {
              that.isShowBtnLoading = false;
              that.isButtonDisabled = false;
            })
          } else {
            return false;
          }
        });
      },
      saveFormEdit(formName, key) {//编辑草稿或提交发布
        this.query.content = this.$refs.richText.getContent();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.query.departIdss.length != 0) {
              let list = this.query.departIdss;
              this.query.departIds = [];
              this.query.walkClassIds = [];
              for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < this.classTypeItems.length; j++) {
                  if (this.classTypeItems[j].id == list[i]) {
                    if (this.classTypeItems[j].type == 0) {
                      this.query.walkClassIds.push(list[i])
                    } else {
                      this.query.departIds.push(list[i])
                    }
                  }
                }
              }
            }
            const that = this;
            this.isShowBtnLoading = true;
            this.isButtonDisabled = true;
            this.query.homeworkState = key;
            this.query.picJson = JSON.stringify(this.query.pics);
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].id == this.query.curriculumId) {
                this.query.title = this.items[i].name;
              }
            }
            this.query.isTurn = this.query.isTurn ? 1 : 0;
            this.query.fileJson = JSON.stringify(this.files);
            this.query.videoJson = this.videoJson.length ? JSON.stringify(this.videoJson) : '';
            editDraftOrPubHomework(this.query, sessionStorage.getItem("homeworkschoolTimeId")).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: key === '1' ? '保存成功！' : '发布成功！'
                });
                this.$router.back();
              }
              that.isShowBtnLoading = false;
              that.isButtonDisabled = false;
            }).catch(function () {
              that.isButtonDisabled = false;
              that.isShowBtnLoading = false;
            })
          } else {
            return false;
          }
        });
      },
      addAndPreviewHomework(formName) {//新增保存预览
      console.log(this.query.workStuJson);
        this.query.content = this.$refs.richText.getContent();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.query.isTurn = this.query.isTurn ? 1 : 0;

            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].id == this.query.curriculumId) {
                this.query.title = this.items[i].name;
              }
            }
            if (this.query.departIdss.length != 0) {
              let list = this.query.departIdss;
              this.query.departIds = [];
              this.query.walkClassIds = [];
              for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < this.classTypeItems.length; j++) {
                  if (this.classTypeItems[j].id == list[i]) {
                    if (this.classTypeItems[j].type == 0) {
                      this.query.walkClassIds.push(list[i])
                    } else {
                      this.query.departIds.push(list[i])
                    }
                  }
                }
              }
            }
            const that = this;
            this.isShowBtnLoading = true;
            this.isButtonDisabled = true;
            this.query.homeworkState = 1;
            this.query.fileJson = JSON.stringify(this.files);
            this.query.videoJson = this.videoJson.length ? JSON.stringify(this.videoJson) : '';

            addAndPreviewHomework(this.query, sessionStorage.getItem("homeworkschoolTimeId")).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功!请在手机上预览'
                });
                this.$router.back();
              }
              that.isShowBtnLoading = false;
              that.isButtonDisabled = false;
            }).catch(function () {
              that.isShowBtnLoading = false;
              that.isButtonDisabled = false;
            })
          } else {
            return false;
          }
        });
      },
      editAndPreviewHomework(formName) {//编辑保存预览
        this.query.content = this.$refs.richText.getContent();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.query.isTurn = this.query.isTurn ? 1 : 0;
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].id == this.query.curriculumId) {
                this.query.title = this.items[i].name;
              }
            }
            if (this.query.departIdss.length != 0) {
              let list = this.query.departIdss;
              this.query.departIds = [];
              this.query.walkClassIds = [];
              for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < this.classTypeItems.length; j++) {
                  if (this.classTypeItems[j].id == list[i]) {
                    if (this.classTypeItems[j].type == 0) {
                      this.query.walkClassIds.push(list[i])
                    } else {
                      this.query.departIds.push(list[i])
                    }
                  }
                }
              }
            }
            const that = this;
            this.isShowBtnLoading = true;
            this.isButtonDisabled = true;
            this.query.homeworkState = 1;
            this.query.fileJson = JSON.stringify(this.files);
            this.query.videoJson = this.videoJson.length ? JSON.stringify(this.videoJson) : '';
            editAndPreviewHomework(this.query, sessionStorage.getItem("homeworkschoolTimeId")).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功!请在手机上预览'
                });
                this.$router.back();
              }
              that.isShowBtnLoading = false;
              that.isButtonDisabled = false;
            }).catch(function () {
              that.isShowBtnLoading = false;
              that.isButtonDisabled = false;
            })
          } else {
            return false;
          }
        });
      },
      richTextEditHandler(content) {
        this.query.content = content;
        this.$refs.form.validateField('content');
      },
    },
    watch: {
      'query.publishType': function (publishType) {
        if (publishType === '0') {
          this.$refs.form.validateField('workStuJson');
          this.query.workStuJson = {};
        } else {
          this.$refs.form.validateField('departIds');
        }
      },
      'query.workStuJson': function () {
        this.$refs.form.validateField('workStuJson')
      }
    }
  }
</script>
<style lang="scss">
  .addOrEditHomework {
    ul {
      list-style-type: none;
      margin: 0;
    }

    .el-select {
      width: 100%;
    }
  }

  .form-item--richtext .el-form-item__content {
    line-height: inherit !important;
  }

  .moblie-content {
    padding: 20px 15px;
    font-size: 15px;
  }

  .pic-container li {
    width: 80px;
    height: 80px;
    background: no-repeat center center / cover;
    float: left;
    margin: 0 10px 10px 0;
  }

  .img-box-item-close {
    width: 24px;
    height: 24px;
    display: block;
    float: right;
    background-size: cover;
    background-position: center center;
    background-image: url(../../assets/images/pic_del_icon.png);
  }

</style>
