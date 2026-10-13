<template>
  <div class="recipe_manage_add_wrap">
    <div class="top">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary" v-if="isShow!=1" size="medium" @click="insertOrPublishDietMenu(0)">保存</el-button>
      <el-button type="primary"  v-if="isShow!=1" size="medium" @click="insertOrPublishDietMenu(1)">发布</el-button>
       <el-button type="primary" v-if="isShow==1" size="medium" @click="insertOrPublishDietMenu(1)">保存</el-button>
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
      <div class="body">
        <div class="box">
          <div class="nav"><span>名称周次</span></div>
          <div class="box-box" >
            <div class="ul-top">
              <div class="li">
                <div class="name"><div class="red">*</div>食谱名称</div>
                <el-input v-model.trim="name" :maxlength="30" placeholder="请输入食谱名称"></el-input>
              </div>
              <div class="li">
                <div class="name"><div class="red">*</div>食谱周数</div>
                <el-select v-model="dietMenuWeek" placeholder="请选择食谱周数">
                  <el-option v-for="item in dietMenuWeekList" :key="item.week"  :label="'第'+item.week+'周'" :value="item.week"></el-option>
                </el-select>
              </div>
              <div class="li">
                <div class="name"><div class="red">*</div>食谱类型</div>
                <el-select v-model="recipeTypeId" placeholder="请选择食谱类型">
                  <el-option v-for="item in recipeTypeList" :key="item.id"  :label="item.value" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

        <div class="box" :key="boxIndex" v-for="(boxItem, boxIndex) in weekNumList">
          <div class="nav"><span>{{boxItem}}</span> <i class="el-icon-circle-plus-outline" @click="showPopBox(boxIndex + 1)"></i></div>
          <div class="box-box" v-if="weekJson[`weekFood${boxIndex + 1}`].length">
            <div class="ul">
              <div class="li" v-for="(item,index) in weekJson[`weekFood${boxIndex + 1}`]" :key="index">
                <span class="img" :style="`background-image: url(${item.dietLogo})`"></span>
                <span>{{item.dietName}}</span>
                <span>{{item.dietTypeName}}</span>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-delete" @click="deleteFoodLine(boxIndex + 1, index)"></i>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div v-else class="noData">暂无安排！</div>
        </div>
      </div>
    </div>

    <el-dialog title="选择菜品" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		 <div class="foot-top">
        <el-col :span="18">
          <el-select v-model="typeId" placeholder="请选择菜品类型">
            <el-option v-for="item in foodTypeList" :key="item.id"  :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input size="medium" placeholder="请输入菜品名称" v-model.trim="searchName">
            <el-button size="medium" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
     </div>
     <div class="select-box">
       <div class="name" v-if="!xuanZhongList.length">菜品选中区</div>
       <div class="box"  v-for="(item,index) in xuanZhongList" :key="index">
         <img :src="item.dietLogo" alt="">{{item.dietName}}<i class="el-icon-close" @click="removeCheckFood(item.id)"></i>
      </div>
     </div>
     <div class="food-box">
        <el-checkbox-group v-model="foodCheckList" @change="foodChange()">
          <el-checkbox  border v-for="item in foodList" :key="item.id" :label="item.id" v-show="(!typeId || (typeId === item.dietType)) && indexOfFunc(item.dietName)">
            <img class="img" :src="item.dietLogo" alt="">
            {{item.dietName}}
          </el-checkbox>
        </el-checkbox-group>
     </div>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="dialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="dialogVisibleFunc">确 定</el-button>
			</span>
		</el-dialog>
  </div>
</template>
<script>
  import {getSeveralWeekList} from "@/api/dietaryManagement";
  import {chooseDietByType, insertOrPublishDietMenu, editOrPublishDietMenu, dietMenuDetails} from '@/api/dishesPlatform';
  import mixin from "@/mixins/windowResize";

  export default {
    name: 'recipeAdd',
    data() {
      return {
        isShow: this.$route.query.isShow,
        recipeId: this.$route.query.recipeId,
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
        name:'',
        dietMenuWeek:'',
        showMenu:'',
        myNum:'',
        searchName:'',
        dialogVisible:false,
        dietMenuWeekList:[],
        foodList:[],
        foodCheckList:[],
        xuanZhongList:[],
        typeId: 0,
        foodTypeList: [
          {
            id: 0,
            value: '全部菜品类型'
          },
          {
            id: 1,
            value: '大荤'
          },
          {
            id: 2,
            value: '小荤'
          },
          {
            id: 3,
            value: '素菜'
          },
          {
            id: 4,
            value: '汤'
          },
          {
            id: 5,
            value: '水果'
          },
          {
            id: 6,
            value: '酸奶'
          },
          {
            id: 7,
            value: '杂粮'
          },
          {
            id: 8,
            value: '粥'
          },
          {
            id: 9,
            value: '主食'
          },
        ],
        recipeTypeId: 1,
        recipeTypeList:[
          {
            id: 1,
            value: '公共食谱'
          },
          {
            id: 2,
            value: '教师食谱'
          },
          {
            id: 3,
            value: '学生食谱'
          },
        ]
      };
    },
    mixins: [mixin],
    created() {
      if (this.recipeId) {
        this.dietMenuDetails();
      }
      getSeveralWeekList().then(res=>{
        let data=res.data.data;
        if(data){
          let num=0;
          for(let i=0;i<data.length;i++){
            if(data[i].nowWeek===1){
              num=1;
              if (!this.recipeId) {
                this.dietMenuWeek = data[i].week;
              }
            }
            if(num===1){
              this.dietMenuWeekList.push(data[i])
            }
          }
          if(this.dietMenuWeekList.length===0){
            this.dietMenuWeekList = data;
            if (!this.recipeId) {
              this.dietMenuWeek = 1
            }
          }
        }
      }).catch();
      this.chooseDietByType();
    },
    methods: {
      //保存
      insertOrPublishDietMenu(showMenu){
        if(!this.name){
          this.$message({type: 'error', message:'请输入食谱名称!'});
          return;
        }
        if(!this.dietMenuWeek){
          this.$message({type: 'error', message:'请选择食谱周数!'});
          return;
        }
        if(!this.recipeTypeId){
          this.$message({type: 'error', message:'请选择食谱类型!'});
          return;
        }

        if(!this.weekJson.weekFood1.length && !this.weekJson.weekFood2.length && !this.weekJson.weekFood3.length && !this.weekJson.weekFood4.length && !this.weekJson.weekFood5.length && !this.weekJson.weekFood6.length && !this.weekJson.weekFood7.length){
          this.$message({type: 'error', message:'菜谱不能为空!'});
          return;
        }

        let obj={
          mondayDietIds:this.weekJson.weekFood1.map(item => item.id).toString(),//1
          tuesdayDietIds:this.weekJson.weekFood2.map(item => item.id).toString(),//2
          wednesdayDietIds:this.weekJson.weekFood3.map(item => item.id).toString(),//3
          thursdayDietIds:this.weekJson.weekFood4.map(item => item.id).toString(),//4
          fridayDietIds:this.weekJson.weekFood5.map(item => item.id).toString(),//5
          saturdayDietIds:this.weekJson.weekFood6.map(item => item.id).toString(),//6
          sundayDietIds:this.weekJson.weekFood7.map(item => item.id).toString(),//7
          dietMenuName:this.name,
          dietMenuWeek:this.dietMenuWeek,
          dietMenuType:this.recipeTypeId,
          isShow:showMenu
        };

        if (this.recipeId) {
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
        } else {
          insertOrPublishDietMenu(obj).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.$router.back();
            }
          }).catch();
        }
      },
      // 详情
      dietMenuDetails() {
        dietMenuDetails({
          dietMenuId: this.recipeId
        }).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.name = data.dietMenuName;
            this.dietMenuWeek = data.dietMenuWeek;
            this.recipeTypeId = data.dietMenuType;
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
      //删除
      deleteFoodLine(num, index){
        this.weekJson[`weekFood${num}`].splice(index,1)
      },
      //弹框
      showPopBox(num){
        this.myNum = num;
        this.typeId = 0;
        this.dialogVisible=true;
        this.foodCheckList=[];
        this.xuanZhongList=[];
      },
      //弹框勾选
      foodChange(){
        this.xuanZhongList=[];
        this.foodCheckList.forEach((typeItem) => {
          this.foodList.forEach((item) => {
            if(typeItem === item.id){
              this.xuanZhongList.push(item)
            }
          });
        });
      },
      // 删除选中的菜品
      removeCheckFood(id){
        this.foodCheckList.forEach((item, index) => {
          if(item === id){
            this.foodCheckList.splice(index,1)
          }
        });
        this.foodChange();
      },
      //搜索
      indexOfFunc(name){
        if(!this.searchName){
          return true;
        }else{
          return name.indexOf(this.searchName) !== -1;
        }
      },
      //确定取消
      dialogVisibleFunc(){
        this.dialogVisible=false;
        if(!this.xuanZhongList.length){
          this.$message({type: 'error', message:'请选择菜品!'});
        } else {
          this.weekJson[`weekFood${this.myNum}`] = [...this.weekJson[`weekFood${this.myNum}`], ...this.xuanZhongList];
        }
      },
      //获取菜品
      chooseDietByType() {
        chooseDietByType({
          dietType: 0,
          searchName: ''
        }).then(res => {
          if (res.data.code === 200) {
            this.foodList = res.data.data;
          }
        })
      }
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
