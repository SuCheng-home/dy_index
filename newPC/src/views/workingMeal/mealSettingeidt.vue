<template>
<div class="mealSettingeidt"  >
    <div class="top"> 
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
        <el-button type="primary" size="medium"  @click="updateSarahPlaces()">保存</el-button>       
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <el-form :model="form" ref="form" label-width="140px" class="demo-ruleForm">
                <el-form-item  label="地点名称" prop="placeName" :rules="[ { required: true, message: '地点名称不能为空'}]">
                    <el-input type="text" :maxlength="50" placeholder="请输入地点名称" v-model.trim="form.placeName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>        
        </div>        
    </div>    
</div> 
</template>
<script>
import {updateSarahPlace,getSarahPlaceByPlaceId} from "@/api/workingMeal";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
        form:{
            placeName:'',
            id:this.$route.query.id
        }
    };
  },
  mixins: [mixin],
  created() {
      this.getSarahPlaceByPlaceIds();
  },
  methods: {
    getSarahPlaceByPlaceIds(){
       getSarahPlaceByPlaceId(this.form.id)
        .then(res => {
         this.form.placeName=res.data.data.placeName;
        })
        .catch(err => {});
    },
    updateSarahPlaces() {
     this.$refs.form.validate((valid) => {
          if (valid) {
           updateSarahPlace(this.form)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "编辑成功！",
              type: "success",
              duration: 1000
            });
            this.$router.back();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {});
          } 
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.mealSettingeidt {
  padding:12px;
  * {
    word-break: break-all;
    word-wrap: break-word;
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      padding-top: 20px;
    }
  }
}
</style>