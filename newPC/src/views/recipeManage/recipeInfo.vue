<template>
  <div class="recipe_manage_add_wrap">
    <div class="top">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="toEditPage" >编辑</el-button>
      <el-button type="primary" size="medium" @click="insertOrPublishDietMenu" v-if="!isShow">发布</el-button>
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
      <div class="body">
        <div class="top_title">{{dietInfo.dietMenuName || ''}}</div>
        <div class="desc_title">展示时间：{{dietInfo.weekMonday || ''}} ~ {{dietInfo.weekSunday || ''}}</div>
        <div class="box" :key="boxIndex" v-for="(boxItem, boxIndex) in weekNumList">
          <div class="nav"><span>{{boxItem}}</span></div>
          <div class="box-box" v-if="weekJson[`weekFood${boxIndex + 1}`].length">
            <div class="ul">
              <div class="li" v-for="(item,index) in weekJson[`weekFood${boxIndex + 1}`]" :key="index">
                <span class="img" :style="`background-image: url(${item.dietLogo})`"></span>
                <span>{{item.dietName}}</span>
                <span>{{item.dietTypeName}}</span>
              </div>
            </div>
          </div>
          <div v-else class="noData">暂无安排！</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {editOrPublishDietMenu, dietMenuDetails} from '@/api/dishesPlatform';
  import mixin from "@/mixins/windowResize";

  export default {
    name: 'recipeInfo',
    data() {
      return {
        recipeId: this.$route.query.recipeId,
        isShow: Number(this.$route.query.isShow),
        weekNumList:['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        weekJson:{
          weekFood1:[],//1
          weekFood2:[],//2
          weekFood3:[],//3
          weekFood4:[],//4
          weekFood5:[],//5
          weekFood6:[],//6
          weekFood7:[]//7
        },
        dietInfo: {}
      };
    },
    mixins: [mixin],
    created() {
      this.dietMenuDetails();
    },
    methods: {
      toEditPage() {
        this.$router.replace({path: 'add', query: {recipeId: this.recipeId,isShow:this.$route.query.isShow}});
      },
      // 详情
      dietMenuDetails() {
        dietMenuDetails({
          dietMenuId: this.recipeId
        }).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.dietInfo = data;
            this.weekJson = {
              weekFood1: data.mondayDiet,
              weekFood2: data.tuesdayDiet,
              weekFood3: data.wednesdayDiet,
              weekFood4: data.thursdayDiet,
              weekFood5: data.fridayDiet,
              weekFood6: data.saturdayDiet,
              weekFood7: data.sundayDiet
            }
          }
        })
      },
      //保存
      insertOrPublishDietMenu(){
        let obj={
          mondayDietIds:this.weekJson.weekFood1.map(item => item.id).toString(),//1
          tuesdayDietIds:this.weekJson.weekFood2.map(item => item.id).toString(),//2
          wednesdayDietIds:this.weekJson.weekFood3.map(item => item.id).toString(),//3
          thursdayDietIds:this.weekJson.weekFood4.map(item => item.id).toString(),//4
          fridayDietIds:this.weekJson.weekFood5.map(item => item.id).toString(),//5
          saturdayDietIds:this.weekJson.weekFood6.map(item => item.id).toString(),//6
          sundayDietIds:this.weekJson.weekFood7.map(item => item.id).toString(),//7
          dietMenuName: this.dietInfo.dietMenuName,
          dietMenuWeek: this.dietInfo.dietMenuWeek,
          dietMenuType: this.dietInfo.dietMenuType,
          id: this.dietInfo.id,
          isShow: 1
        };
        obj.id = this.recipeId;
        editOrPublishDietMenu(obj).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$router.back();
          }
        }).catch();
      },
    }
  };
</script>

<style lang="scss" scoped>
.recipe_manage_add_wrap {
   padding:12px;
    *{
          box-sizing: border-box;
        }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .el-dialog__body{
    padding: 10px;
  }
  .foot-top{
    overflow: hidden;
  }
  .select-box{
    height: 50px;
    margin: 10px 0;
    border-top: 1px #EBEEF5 solid;
    border-bottom: 1px #EBEEF5 solid;
    padding: 5px;
    overflow: auto;
    .name{
      line-height: 38px;
      font-size: 20px;
      color:#C0C4CC;
    }
    .box{
      float: left;
      height: 38px;
      img{
        float: left;
        width: 30px;
        height: 30px;
      }
      line-height: 30px;
      font-size: 14px;
      border:1px  #EBEEF5 solid;
      padding: 3px;
      border-radius: 3px;
      margin-right: 5px;
      i{
        font-size: 18px;
        cursor:pointer;
      }
      i:hover{
        color:#f56c6c;
      }
    }
  }
  .food-box{
      height: 181px;
      overflow: auto;
      border-bottom: 1px #EBEEF5 solid;
    .img{
        width: 45px;
        height: 45px;
        left: 40px;
        position: absolute;
        top: 5px;
    }
    .el-checkbox.is-bordered {
          height: 80px;
          min-width: 130px;
          padding: 56px 10px 10px 10px;
          margin: 5px;
      }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body{
      width: 810px;
      margin: 0 auto;

      .top_title{
        text-align: center;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        font-weight: bold;
        color: #333;
      }
      .desc_title{
        text-align: center;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #999;
      }

      .el-form-item {
                margin-bottom: 0px;
      }
      .box{
        overflow: hidden;
         .noData{
          text-align: center;
          line-height: 80px;
          font-size: 16px;
          color: #303133;
          background: #fff
        }
        .nav{
          height: 20px;
          line-height: 20px;
          margin: 10px;
          padding-left: 8px;
          border-left: 4px solid #409EFF;
          color: #333;
          .el-icon-circle-plus-outline{
                  font-size: 20px;
                  margin-left: 10px;
                  color: #C0C4CC;
                  cursor: pointer;
               }
                .el-icon-circle-plus-outline:hover{
                    color:#409EFF
                  }
        }
        .box-box{
          background: #fff;
          overflow: hidden;
          .ul-top{
            .li{
              position: relative;
              padding:10px 10px 10px 110px;
              .el-select{
                  width: 100%;
                }
              .name{
                position: absolute;
                width: 100px;
                text-align: right;
                top: 10px;
                left: 0;
                line-height: 40px;
                font-size: 14px;
                .red{
                  display: inline;
                  color:#f56c6c;
                }

              }
            }
          }
          .ul{
             border: 1px #EBEEF5 solid;
              border-bottom: none;
              margin: 10px 20px;
            .li{
               overflow: hidden;
               padding:5px 0;
               border-bottom: 1px #EBEEF5 solid;
               span{
                float: left;
                line-height: 40px;
                width: 160px;
                font-size: 14px;
                color: #606266;
                text-align: center;
                .el-input {
                    width: 70px;
                    margin: 0 5px;
                }
               }
               .el-icon-delete{
                  line-height: 40px;
                  font-size: 20px;
                  float: right;
                  margin-right: 10px;
                  color: #606266;
                  cursor:pointer;
               }
                .el-icon-delete:hover{
                    color:#F56C6C
                  }
                .img{
                  height: 40px;
                  width: 40px;
                  background-position: center center;
                  background-size: cover;
                  margin: 0 15px 0 5px;
               }
             }
          }
      }
    }

  }

  }

}
</style>
