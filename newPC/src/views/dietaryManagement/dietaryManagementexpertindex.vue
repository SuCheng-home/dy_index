<template>
<div class="dietaryManagementexpertindex"  >
    <div class="top"> 
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button>      
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
      <div class="ul">
        <div class="li" @click="dietaryManagementexpertdetails(item.id)" v-for="item in datalist" :label="item.id"  :key="item.id">
          <div class="name">{{item.name}}</div>
        </div>
      </div>
        
    </div>    
</div> 
</template>
<script>
import {publicMenuList} from "@/api/dietaryManagement";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      datalist:[]
    };
  },
  mixins: [mixin],
  created() {
    
       publicMenuList().then(res => res.data).then(data => {
          if(data.code==200&&data.data){
            this.datalist=data.data;
          }     
       })
  },
  methods:{
    //详情   
            dietaryManagementexpertdetails(id){
                this.$router.push({
                    path: "dietaryManagementexpertdetails",
                    query: {id: id}
                });
            },
  }
};
</script>
<style lang="scss" scoped>
.dietaryManagementexpertindex {
   padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .ul{
      overflow: auto;
      .li{
        position: relative;
        float: left;
        width: 245px;
        height: 140px;
        font-size: 17px;
        box-shadow: 0 1px 2px #c5c5c5;
        margin: 15px 5px;
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        overflow: hidden;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/shanshi/zhuanjiafengmian.jpg);
        cursor:pointer ;
        .name{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0px;
          height: 40px;
          line-height: 40px;
          color: #fff;
          background: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
   
}
</style>