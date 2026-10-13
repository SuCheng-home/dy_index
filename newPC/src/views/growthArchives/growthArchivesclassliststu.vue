<template>
<div class="growthArchivesclassliststu"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>  
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="box" v-for="(items,indexs) in datalist" :key="indexs">
              <div class="top-name" v-if="items.stuList.length">
                <i class="el-icon-s-custom"></i> {{items.className}}
            </div>
            <div class="stu-box">
                <span  v-for="(item,index) in items.stuList" :key="index">
                    <el-tag size="medium" v-if="item.fileCount!=0">{{item.stuName}}&nbsp;&nbsp;{{item.fileCount}}</el-tag>  
                   <el-tag size="medium" v-else type="danger">{{item.stuName}}&nbsp;&nbsp;{{item.fileCount}}</el-tag>
                </span>
            </div>
         </div>
     </div>   
</div> 
</template>
<script>
import {getActivityStuStaticsDataList} from "@/api/growthArchives";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      datalist: [],
      id: this.$route.query.id,
    };
  },
  mixins: [mixin],
  created() {
    this.getActivityStuStaticsDataLists();
  },
  methods: {
    getActivityStuStaticsDataLists() {
      getActivityStuStaticsDataList(this.id)
        .then(res => res.data)
        .then(data => {
            this.datalist=data.data;
        });
    },
    
  }
};
</script> 
<style lang="scss" scoped>
.growthArchivesclassliststu {
  padding: 15px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    padding: 10px 0;
    width: 810px;
    margin: 0 auto;
    .box{
         .top-name {
            color: #606266;
            background-color: #d9ecff;
            padding: 8px 5px;
            font-size: 15px;
            line-height: 20px;
            margin: 10px 0;
            i {
                color: #409EFF;
                font-size: 20px;
                float: left;
                margin-right: 5px;
            }
            }
            .el-tag--medium {
                height: 28px;
                line-height: 26px;
                min-width: 85px;
                margin: 0 3px 5px 0;
                text-align: center;
            }
    }
  }
}
</style>