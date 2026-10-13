<template>
  <div class="er-tong-yan-jiu-ting-ke-form" v-loading="loading">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="save">保存</el-button>
        <el-button type="primary" size="medium" @click="release"
          >发布</el-button
        >
      </el-col>
    </el-row>

    <div class="main-wrapper" :style="{ height: nobottommaxH - 10 + 'px' }">
      <el-form label-width="150px" ref="form" :model="form" :rules="rules">
        <el-form-item label="听课时间" prop="classTime">
          <el-select
            size="medium"
            placeholder="请选择周次"
            value-key="week"
            v-model="form.weekObj"
          >
            <el-option
              v-for="(item, idx) in weekList"
              :key="idx"
              :label="`第${item.week}周`"
              :value="item"
            ></el-option>
          </el-select>
          <el-select
            size="medium"
            placeholder="请选择星期"
            v-model="form.weekDay"
          >
            <el-option
              v-for="(item, idx) in dayList"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            size="medium"
            placeholder="请选择节次"
            value-key="id"
            v-model="form.seqObj"
          >
            <el-option
              v-for="(item, idx) in seqList"
              :key="idx"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="听课班级" prop="className">
          <el-input
            placeholder="1-20个字符"
            maxlength="20"
            show-word-limit
            v-model.trim="form.className"
          ></el-input>
        </el-form-item>
        <el-form-item label="执教教师" prop="classTeacherJson">
          <address-book
            :config="{
              title: '选择执教教师',
              depart: { target: 'user', departType: 't', userTypes: '1' },
            }"
            v-model="form.classTeacherJson"
          ></address-book>
        </el-form-item>
        <el-form-item label="课题" prop="subjectName">
          <el-input
            placeholder="1-50个字符"
            maxlength="50"
            show-word-limit
            v-model.trim="form.subjectName"
          ></el-input>
        </el-form-item>
        <el-form-item label="听课教师" prop="listenJson">
          <address-book
            :config="{
              title: '选择听课教师',
              depart: { target: 'all', departType: 't', userTypes: '1' },
            }"
            v-model="form.listenJson"
          ></address-book>
        </el-form-item>
        <el-form-item label="评价内容" prop="appraiseJson">
          <el-form
            label-width="100px"
            label-position="left"
            style="width: 100%"
          >
            <el-form-item
              :label="appraise.typeName"
              :key="idx"
              v-for="(appraise, idx) in appraiseList"
            >
              <el-checkbox-group v-model="checkList[idx]">
                <el-checkbox
                  :label="item"
                  :key="itemIdx"
                  v-for="(item, itemIdx) in appraise.itemList"
                  ><span
                    style="
                      display: inline-grid;
                      white-space: pre-line;
                      word-wrap: break-word;
                      overflow: hidden;
                      line-height: 20px;
                    "
                    >{{ item.typeName }}</span
                  ></el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";

/* components */
import AddressBook from "@/components/AddressBook/indexExpand";

/* api */
import {
  getSeveralWeekList,
  classScheduleSet,
  findSchoolDicsByCode,
  insertStudySubject,
  getStudySubjectInfoById,
  editStudySubject,
  getSchoolDicDetailsByTypeCode,
} from "@/api/teachingStudy/erTongYanJiuTingKe";

export default {
  mixins: [mixin],
  components: { AddressBook },
  computed: {
    ...mapGetters(["schoolInfo"]),
  },
  data() {
    // 自定义规则 - 听课时间
    let validateClassTime = (rule, value, callback) => {
      if (!this.form.weekObj.week && !this.form.weekDay && !this.form.seqObj.id)
        callback(new Error("请选择听课时间"));
      else callback();
    };
    // 自定义规则 - 执教老师
    let validateClassTeacherJson = (rule, value, callback) => {
      let userJson = value.userJson;
      if (!userJson || !userJson.length) {
        callback(new Error("请选择执教老师"));
      } else {
        callback();
      }
    };
    // 自定义规则 - 听课老师 || 部门
    let validateListenJson = (rule, value, callback) => {
      let departJson = value.departJson;
      let userJson = value.userJson;
      if (
        (!userJson || !userJson.length) &&
        (!departJson || !departJson.length)
      ) {
        callback(new Error("请选择听课老师"));
      } else {
        callback();
      }
    };
    // 自定义规则 - 评价项
    let validateAppraiseJson = (rule, value, callback) => {
      let emptyList = this.checkList.map((item) => item.length == 0);
      if (emptyList.every((item) => item))
        callback(new Error("请至少选择一个评价内容"));
      else callback();
    };

    return {
      // 数据加载中 { Boolean } true | false
      loading: true,
      // 新增 / 编辑 { String } add | edit
      type: "add",
      // 提示语 { String }
      messsage: "保存成功",
      // 周次列表 { Array }
      weekList: [],
      // 星期列表 { Array }
      dayList: [
        {
          label: "星期一",
          value: 1,
        },
        {
          label: "星期二",
          value: 2,
        },
        {
          label: "星期三",
          value: 3,
        },
        {
          label: "星期四",
          value: 4,
        },
        {
          label: "星期五",
          value: 5,
        },
        {
          label: "星期六",
          value: 6,
        },
        {
          label: "星期日",
          value: 7,
        },
      ],
      // 节次列表 { Array }
      seqList: [],
      // 评价列表 { Array }
      appraiseList: [],
      // 评价列表选中项 { Array }
      checkList: [],
      // 请求表单
      form: {
        // 研究课听课id
        studySubjectId: "",
        // 发布状态 { Number } 0未发布 | 1已发布
        releaseState: 0,
        // 周次 { Object }
        weekObj: {},
        // 星期 { Number } 1 2 3 4 5 6 7
        weekDay: this.$moment().day() == 0 ? 7 : this.$moment().day(),
        // 节次 { Object }
        seqObj: {},
        // 听课班级
        className: "",
        // 执教老师
        classTeacherJson: {},
        // 课题
        subjectName: "",
        // 听课老师 | 部门
        listenJson: {},
        // 评价项
        appraiseJson: "",
      },
      // 校验规则
      rules: {
        classTime: [
          {
            validator: validateClassTime,
            required: true,
            message: "听课时间不能为空",
            trigger: "blur",
          },
        ],
        className: [
          { required: true, message: "听课班级不能为空", trigger: "blur" },
        ],
        classTeacherJson: [
          {
            validator: validateClassTeacherJson,
            required: true,
            trigger: "blur",
          },
        ],
        subjectName: [
          { required: true, message: "课题不能为空", trigger: "blur" },
        ],
        listenJson: [
          {
            validator: validateListenJson,
            required: true,
            trigger: "blur",
          },
        ],
        appraiseJson: [
          {
            validator: validateAppraiseJson,
            required: true,
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    const initData = Promise.all([
      this.getSeveralWeekList(),
      this.classScheduleSet(),
      this.getSchoolDicDetailsByTypeCode(),
    ]);
    initData
      .then(() => {
        let studySubjectId = this.$route.query.studySubjectId;
        if (studySubjectId) {
          this.type = "edit";
          this.form.studySubjectId = studySubjectId;
        } else {
          this.type = "add";
          setTimeout(() => {
            this.loading = false;
          }, 500);
        }
      })
      .catch(() => {
        this.loading = false;
      });
  },
  methods: {
    // 查询周次列表
    getSeveralWeekList() {
      return getSeveralWeekList()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.weekList = [...data];
            let nowWeek = this.weekList.find((item) => item.nowWeek == 1);
            if (nowWeek) this.form.weekObj = nowWeek;
            else this.form.weekObj = this.weekList[0];
          }
        });
    },
    // 获得学校节次列表
    classScheduleSet() {
      return classScheduleSet({
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            let { morning, forenoon, noon, afternoon, night } = data;
            let seqList = [];
            for (let i = 0; i < morning; i++) {
              seqList.push({
                id: seqList.length,
                dayStage: 1,
                seq: i + 1,
                label: `早自习（第${i + 1}节）`,
              });
            }
            for (let i = 0; i < forenoon; i++) {
              seqList.push({
                id: seqList.length,
                dayStage: 2,
                seq: i + 1,
                label: `上午（第${i + 1}节）`,
              });
            }
            for (let i = 0; i < noon; i++) {
              seqList.push({
                id: seqList.length,
                dayStage: 3,
                seq: i + 1,
                label: `午自习（第${i + 1}节）`,
              });
            }
            for (let i = 0; i < afternoon; i++) {
              seqList.push({
                id: seqList.length,
                dayStage: 4,
                seq: i + 1,
                label: `下午（第${i + 1}节）`,
              });
            }
            for (let i = 0; i < night; i++) {
              seqList.push({
                id: seqList.length,
                dayStage: 5,
                seq: i + 1,
                label: `晚自习（第${i + 1}节）`,
              });
            }
            this.seqList = seqList;
            this.form.seqObj = this.seqList[0] || {};
          }
        });
    },

    getSchoolDicDetailsByTypeCode() {
      return getSchoolDicDetailsByTypeCode({
        typeCode: "studySubject",
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.appraiseList = data.map((item) => ({
              typeId: item.id,
              typeName: item.name,
              code: item.code,
              itemList: [],
            }));
            let temp = Promise.all(
              this.appraiseList.map((item) =>
                findSchoolDicsByCode({
                  dicCode: item.code,
                }).then((res) => {
                  let _res = res.data;
                  if (_res.code != 200) return Promise.reject(_res.msg);
                  else return _res.data;
                })
              )
            );
            temp
              .then((res) => {
                this.appraiseList.forEach((item, idx) => {
                  item.itemList = res[idx].map((sub) => ({
                    typeId: sub.id,
                    typeName: sub.remark
                      ? `${sub.value}：${sub.remark}`
                      : sub.value,
                  }));
                  if (this.type == "add")
                    this.checkList.push([...item.itemList]);
                  else {
                    this.checkList.push([]);
                    this.getStudySubjectInfoById();
                  }
                });
              })
              .catch(() => {});
          }
        });
    },

    getStudySubjectInfoById() {
      getStudySubjectInfoById({
        studySubjectId: this.form.studySubjectId,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.form.releaseState = data.releaseState;
            this.form.weekObj = { week: data.week };
            this.form.weekDay = data.weekDay;
            let seqObj = this.seqList.find((item) => {
              if (item.dayStage == data.dayStage && item.seq == data.seq)
                return item;
            });
            if (seqObj) this.form.seqObj = seqObj;
            this.form.className = data.className;
            this.form.classTeacherJson = {
              departJson: [],
              groupJson: [],
              userJson: [...JSON.parse(data.classTeacherJson || "[]")],
            };
            this.form.subjectName = data.subjectName;
            this.form.listenJson = {
              departJson: [...JSON.parse(data.listenDepartJson || "[]")],
              groupJson: [],
              userJson: [...JSON.parse(data.listenTeacherJson || "[]")],
            };
            let appraiseJson = JSON.parse(data.appraiseJson || "[]");
            appraiseJson.forEach((check, idx) => {
              let checkTypeIdList = check.itemList.map((item) => item.typeId);

              let temp = [];
              this.appraiseList[idx].itemList.forEach((item, itemIdx) => {
                if (checkTypeIdList.includes(item.typeId)) {
                  temp.push(item);
                }
              });
              this.checkList[idx] = temp;
            });
            this.loading = false;
          }
        });
    },

    insertStudySubject(form) {
      insertStudySubject(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: this.messsage,
            type: "success",
          });
          this.$router.back();
        });
    },

    // 编辑或发布研究课听课
    editStudySubject(form) {
      editStudySubject(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: this.messsage,
            type: "success",
          });
          this.$router.back();
        });
    },

    // 保存
    save() {
      this.form.releaseState = 0;
      this.messsage = "保存成功";
      this.submitForm();
    },
    // 发布
    release() {
      this.form.releaseState = 1;
      this.messsage = "发布成功";
      this.submitForm();
    },
    // 提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            releaseState: this.form.releaseState,
            week: this.form.weekObj.week,
            schoolTimeId: this.form.weekObj.schoolTimeId,
            weekDay: this.form.weekDay,
            dayStage: this.form.seqObj.dayStage,
            seq: this.form.seqObj.seq,
            className: this.form.className,
            classTeacherJson: this.form.classTeacherJson.userJson,
            subjectName: this.form.subjectName,
            listenTeacherJson: this.form.listenJson.userJson,
            listenDepartJson: this.form.listenJson.departJson,
            appraiseJson: this.appraiseList.map((appraise, idx) => ({
              typeId: appraise.typeId,
              typeName: appraise.typeName,
              itemList: appraise.itemList.filter((sub) => {
                let checkTypeIdList = this.checkList[idx].map(
                  (check) => check.typeId
                );
                if (checkTypeIdList.includes(sub.typeId)) {
                  return sub;
                }
              }),
            })),
          };
          if (this.type == "add") {
            this.insertStudySubject(form);
          } else {
            form.id = this.form.studySubjectId;
            form.schoolId = this.schoolInfo.id;
            this.editStudySubject(form);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.er-tong-yan-jiu-ting-ke-form {
  padding:12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .detail-title {
    width: 810px;
    margin: 22px auto 14px;
    border-left: 4px solid #409eff;
    padding-left: 12px;
    height: 16px;
    line-height: 16px;
    font-size: 15px;
    color: #676a6c;
    .danger {
      color: #f56c6c;
    }
  }
  .main-wrapper {
    overflow-y: auto;

    .el-form {
      width: 810px;
      margin: 0 auto;

      /deep/ .upload-file-item {
        width: 200px !important;

        img {
          width: 100% !important;
          min-height: 110px;
          margin: 0;
          border: 1px dashed #409eff;
          box-sizing: border-box;
          margin: 0 !important;
        }
        .file-name {
          display: none;
        }
      }
    }
  }
}
</style>