<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="140px"
    class="demo-ruleForm"
  >
    <el-form-item label="检查组名称" class="is-required">
      <el-input
        v-model.trim="ruleForm.title"
        :maxlength="20"
        placeholder="请输入检查组名称（1-20个字符）"
      ></el-input>
    </el-form-item>
    <el-form-item label="检查范围" class="is-required">
      <!-- <el-select
        size="medium"
        multiple
        v-model="ruleForm.checkScope"
        placeholder="请选择检查范围"
      >
        <el-option
          v-for="item in bedRoomList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select> -->
      
      <el-cascader v-model="ruleForm.checkScope"
        :options="buildingList"
        :show-all-levels="false"
        :props="props"
        placeholder="请选择检查范围">
      </el-cascader>
    </el-form-item>
    <el-form-item label="评价方式" class="is-required">
      <el-radio-group v-model="ruleForm.isStar" :disabled="id">
        <el-radio :label="1">打星</el-radio>
        <el-radio :label="2">打分</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否设置默认分数" class="is-required">
      <el-radio-group v-model="ruleForm.isDefaultScore">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="默认分数"
      v-if="ruleForm.isDefaultScore == 1"
      class="is-required"
    >
      <el-input-number
        v-model.trim="ruleForm.defaultScore"
        step-strictly
        controls-position="right"
        :min="1"
        :max="99999"
        :step="1"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="是否推送报告" class="is-required">
      <el-radio-group v-model="ruleForm.isPushResult">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="推送报告时间"
      v-if="ruleForm.isPushResult == 1"
      class="is-required"
    >
      <el-radio-group v-model="ruleForm.pushResultTime">
        <el-radio label="21:00">21:00</el-radio>
        <el-radio label="21:30">21:30</el-radio>
        <el-radio label="22:00">22:00</el-radio>
        <el-radio label="22:30">22:30</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否推送班主任" class="is-required">
      <el-radio-group v-model="ruleForm.isPushClassHeader">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="低于多少分推送"
      v-if="ruleForm.isPushClassHeader == 1"
      class="is-required"
    >
      <el-input-number
        v-model.trim="ruleForm.minScore"
        step-strictly
        controls-position="right"
        :min="1"
        :max="99999"
        :step="1"
      ></el-input-number>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  getGroup,
  addGroup,
  updateGroup,
  getDormListByClassIdAndBuildId,
} from "@/api/dormitoryInspection";
import {getSchoolDormBuildingList} from '@/api/dormitoryManage';
export default {
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
  },
  data() {
    return {
      ruleForm: {
        title: "",
        checkScope: [],
        defaultScore: 0,
        isDefaultScore: 2,
        isPushClassHeader: 2,
        isPushResult: 2,
        isStar: 1,
        minScore: 60,
        pushResultTime: "21:00",
        title: "",
      },
      bedRoomList: [],
      buildingList: [],
      props: {
        expandTrigger: 'hover',
        emitPath: false,
        multiple: true
      }
    };
  },
  created() {
    if (this.id) {
      this.getGroup();
    }
    getSchoolDormBuildingList().then(res => {
      const data = res.data.data;
      if (res.data.code === 200) {
        const buildingList = data.map(item => ({
          value: item.id,
          label: item.name
        }));
        getDormListByClassIdAndBuildId()
          .then((res) => {
            const data = res.data.data;
            if (res.data.code === 200) {
              this.bedRoomList = data.map(item => ({
                buildId: item.buildId,
                id: item.id,
                name: item.name,
                value: item.id,
                label: item.name,
                leaf: true
              }));
              buildingList.forEach(item => {
                item.children = this.bedRoomList.filter(room => room.buildId == item.value);
              })
              this.buildingList = buildingList;
              console.log(this.buildingList);
            }
          })
          .catch();
      }
    }).catch();
  },
  methods: {
    getGroup() {
      getGroup(this.id).then((res) => {
        let data = res.data;
        if (data.code === 200) {
          let totalArray = data.data;
          totalArray.isStar = totalArray.isStar - 0;
          totalArray.checkScope = JSON.parse(totalArray.checkScope).map(
            (item) => item.dormId
          );
          this.ruleForm = totalArray;
        }
      });
    },
    async handleSave() {
      //保存
      if (this.ruleForm.title === "") {
        this.$alert(
          "请填写检查组名称！",
          "提示",
          {
            type: "error",
          },
          {
            confirmButtonText: "确定",
          }
        );
        return Promise.reject();
      }
      if (!this.ruleForm.checkScope.length) {
        this.$alert(
          "请选择检查范围！",
          "提示",
          {
            type: "error",
          },
          {
            confirmButtonText: "确定",
          }
        );
        return Promise.reject();
      }
      let query = this.ruleForm;
      let checkScope = [];
      for (let i = 0; i < this.ruleForm.checkScope.length; i++) {
        for (let j = 0; j < this.bedRoomList.length; j++) {
          if (this.ruleForm.checkScope[i] == this.bedRoomList[j].id) {
            checkScope.push({
              dormId: this.bedRoomList[j].id,
              dormName: this.bedRoomList[j].name,
            });
          }
        }
      }
      query.checkScope = checkScope;
      try {
        if (this.id) {
          query.id = this.id;
          const res = await updateGroup(query)
          let data = res.data;
          if (data.code === 200) {
            this.$message({
              type: "success",
              message: "编辑成功！",
            });
          } else {
            return Promise.reject(data.msg);
          }
        } else {
          const res = await addGroup(query)
          let data = res.data;
          if (data.code === 200) {
            const id = data.data.id
            this.$emit('update:id', id)
            this.$message({
              type: "success",
              message: "添加成功！",
            });
          } else {
            return Promise.reject(data.msg);
          }
        }
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
</script>
