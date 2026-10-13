<template>
  <div class="supply_class_check_wrap">
    <div class="header">
      <el-button @click="goBack" size="medium">返回</el-button>
      <el-button type="primary" @click="checkSupply(2)" size="medium">同意</el-button>
      <el-button type="danger" @click="checkSupply(-1)" size="medium">不同意</el-button>
    </div>
    <div class="check_box" :style="`height: ${nobottommaxH}px;`">
      <el-form label-width="140px" class="demo-ruleForm">
        <el-form-item label="代课老师">
          <address-book v-model="addressData" :config="configData"></address-book>
        </el-form-item>
        <div v-if="type===3">
          <el-form-item label="日期">{{supplyClassMsg.supplyDate}}</el-form-item>
          <el-form-item label="节次/天数">{{supplyClassMsg.supplyClassNoName || supplyClassMsg.substituteDayNum}}</el-form-item>
          <el-form-item label="原因" v-if="supplyClassMsg.reasonType">{{supplyClassMsg.reasonType || '--'}}</el-form-item>
          <el-form-item label="理由">{{supplyClassMsg.reason || '--'}}</el-form-item>
        </div>
        <div v-else>
          <el-form-item label="日期">{{supplyClassMsg.adjustDate}}</el-form-item>
          <el-form-item label="班级">{{supplyClassMsg.adjustClassName}}</el-form-item>
          <el-form-item label="节次">{{supplyClassMsg.adjustClassNoName}}</el-form-item>
          <el-form-item label="课程">{{supplyClassMsg.adjustSubjectName}}</el-form-item>
          <el-form-item label="被代课老师">{{supplyClassMsg.adjustTeacherName}}</el-form-item>
          <el-form-item label="原因" v-if="supplyClassMsg.reasonType">{{supplyClassMsg.reasonType || '--'}}</el-form-item>
          <el-form-item label="理由">{{supplyClassMsg.reason || '--'}}</el-form-item>
        </div>
        <el-form-item label="审批意见" prop="examineRemark">
          <el-input type="textarea" v-model.trim="examineRemark" :maxlength="200"></el-input>
        </el-form-item>
         <el-form-item label="图片" v-if="adjustPics.length">
                  <image-previewer tag="richtext" >
                      <span class="img" :key="index" v-for="(item, index) in adjustPics">
                        <img :src="item.picUrl">
                      </span>
                  </image-previewer>
              </el-form-item> 
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {getSupplyAdjustClassInfo, examineSupplyAdjustClass} from '@/api/supplyClass';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  export default {
    name: "supplyClassCheck",
    components: {
      AddressBook,ImagePreviewer
    },
    data() {
      return {
        addressData: {},
        configData: {
          title: '选择老师',
          depart: {target: 'user', departType: 't', userTypes: '1'},
          SingleChose: true,
          group: false
        },
        supplyClassMsg: {},
        examineRemark: '',
        type: this.$route.query.type,
        adjustPics:[]
      }
    },
    mixins: [mixins],
    created() {
      this.getSupplyAdjustClassInfo();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getSupplyAdjustClassInfo() {
        getSupplyAdjustClassInfo(parseInt(this.$route.query.id)).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.supplyClassMsg = data.data;
            this.addressData = {
              userJson: data.data.supplyTeacherList
            };
            this.adjustPics= data.adjustPics?JSON.parse(data.adjustPics):[];
          }
        }).catch();
      },
      checkSupply(state) {
        if (state ===2&&(!this.addressData || !this.addressData.userJson.length)) {
          this.$message({
            message: '请选择代课老师！',
            type: 'warning'
          });
          return;
        }
        if (!this.examineRemark && state === -1) {
          this.$message({
            message: '请填写审批意见！',
            type: 'warning'
          });
          return;
        }
        const query = {
          examineRemark: this.examineRemark,
          id: parseInt(this.$route.query.id),
          state: state,
          supplyTeacherJson: JSON.stringify(this.addressData.userJson)
        };
        this.examineSupplyAdjustClass(query);
      },
      examineSupplyAdjustClass(query) {
        examineSupplyAdjustClass(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
            this.$router.back();
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supply_class_check_wrap {
    padding:12px;
     .img img {
        width: 80px;
        height: 80px;
        margin: 10px;
    }
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .check_box {
      padding: 20px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .demo-ruleForm {
      width: 810px;
      margin: 0 auto;
    }
  }
</style>
