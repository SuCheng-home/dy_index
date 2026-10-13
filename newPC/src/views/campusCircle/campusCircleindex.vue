<template>
<div class="campusCircleindex"  >
     <div class="top"> 
         <el-button type="primary" size="medium"   @click="campusCircleadd()">新增圈子</el-button>  
          <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="圈子名称" icon="search" size="medium" 
                          v-model.trim="name">
                    <el-button slot="append" icon="el-icon-search" ></el-button>
            </el-input>   
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
          <div class="ul">
              <div class="li" v-show="hidefun(item.title)" v-for="(item,index) in datalist" :key="index" @click="campusCircledetails(item.id,item.state)">
                  <i class="el-icon-edit" v-if="item.state==1" @click.stop="campusCircleeidt(item.id)"></i> 
                  <i class="el-icon-delete"  v-if="item.state==1" @click.stop="deleteCircleTopics(item.id)"></i>
                  <img :src="item.logoUrl" alt="">                  
                   <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                    <span class="name" v-html="strToHtml(item.title)"></span>
                    </el-tooltip>
                </div>
          </div>
          <default-page Mes="暂无圈子" v-if="!mynum"></default-page>
     </div>
</div> 
</template>
<script>
import {
  getSchoolCircleTopicPageList,
  deleteCircleTopic
} from "@/api/campusCircle";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
import {strToHtml} from '@/utils/utils';
export default {
  data() {
    return {
      datalist: [],
      mynum: 1,
      name:""
    };
  },
  mixins: [mixin],
  created() {
    this.getSchoolCircleTopicPageLists();
  },
  components: { DefaultPage },
  methods: {
    strToHtml,
    getSchoolCircleTopicPageLists() {
      getSchoolCircleTopicPageList()
        .then(res => res.data)
        .then(data => {
          this.datalist = data.data;
          this.mynum = this.datalist.length;
        });
    },
    hidefun(title){
         return title.indexOf(this.name)!=-1
    },
    deleteCircleTopics(sid) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          deleteCircleTopic(sid).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功");
              this.getSchoolCircleTopicPageLists();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    campusCircledetails(id,state) {
      if(state==1){
        this.$router.push({
        path: "campusCircledetails",
        query: { id: id }
      });
      }else{
        this.$router.push({
        path: "campusCircle",
        query: { id: id }
      });
      }
      
    },
    campusCircleeidt(id) {
      this.$router.push({
        path: "campusCircleeidt",
        query: { id: id }
      });
    },
    campusCircleadd() {
      this.$router.push({
        path: "campusCircleadd"
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.campusCircleindex {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    .ul {
      overflow: hidden;
      .li {
        float: left;
        margin: 15px;
        width: 150px;
        cursor: pointer;
        position: relative;
        img {
          width: 150px;
              height: 150px;
          border-radius: 50%;
        }
        .el-icon-delete {
          position: absolute;
          top: 0px;
          right: 0px;
          font-size: 18px;
          color: #f56c6c;
        }
        .el-icon-edit {
          position: absolute;
          top: 0px;
          right: 30px;
          font-size: 18px;
          color: #409eff;
        }
        .name {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
      .li:hover {
        .name {
          color: #409eff;
        }
        img {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>