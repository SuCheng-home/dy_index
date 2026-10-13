<template>
<div class="campusCircleteacher"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="campusCircleteacheradd()">新建分组</el-button>  
          <el-button type="primary" size="medium"   @click="numpop=true">初始化分组</el-button>   
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
          <div class="ul">
              <div class="li" v-for="(item,index) in datalist" :key="index" @click="campusCircleteacherdetails(item.id)"> 
                   <div class="top-name"> {{item.groupName}}                      
                      <i class="el-icon-delete"   @click.stop="deleteTopicGroups(item.id)"></i>  
                      <i class="el-icon-edit"   @click.stop="campusCircleteachereidt(item.id)"></i>
                    </div>
                    <el-tooltip class="item" effect="dark" :content="item.teacherNames" placement="top">
                    <div class="name">指导老师：{{item.teacherNames}}</div>
                    </el-tooltip>
                    <div class="name">组员：{{item.stuCount}}</div>
                  
                 
              </div>
          </div>         
          <default-page Mes="暂无分组" v-if="!mynum"></default-page>
     </div>
     <el-dialog title="初始化分组" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="numpop" width="500px" :lock-scroll="false" :modal-append-to-body='false'>
		   分组数 &nbsp; &nbsp;<el-input-number v-model="groupNum" :min="1" :max="100" label="分组数"></el-input-number>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="numpop=false">取 消</el-button>
				<el-button type="primary" @click="initTopicGroups()">确 定</el-button>
			</span>
		</el-dialog> 
</div> 
</template>
<script>
import {
  getCircleTopicGroupListByTopicId,
  deleteTopicGroup,initTopicGroup
} from "@/api/campusCircle";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
export default {
  data() {
    return {
      datalist: [],
      mynum: 1,
      id: this.$route.query.id,
      groupNum:1,
      numpop:false
    };
  },
  mixins: [mixin],
  created() {
    this.getCircleTopicGroupListByTopicIds();
  },
  components: { DefaultPage },
  methods: {
    initTopicGroups(){
      if(!this.groupNum){
        this.groupNum=1
      }
       initTopicGroup(this.id,this.groupNum).then(res => {
            if (res.data.code === 200) {
              this.$message.success("初始成功");
              this.numpop=false;
              this.getCircleTopicGroupListByTopicIds();
            } else {
              this.$message.error(res.data.msg);
            }
          });
    },
    getCircleTopicGroupListByTopicIds() {
      getCircleTopicGroupListByTopicId(this.id)
        .then(res => res.data)
        .then(data => {
          this.datalist = data.data;
          this.mynum = this.datalist.length;
        });
    },
    deleteTopicGroups(sid) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          deleteTopicGroup(sid).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功");
              this.getCircleTopicGroupListByTopicIds();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
     campusCircleteachereidt(id) {
      this.$router.push({
        path: "campusCircleteachereidt",
        query: { id:id,topicId:this.id }
      });
    },
    campusCircleteacherdetails(id) {
      this.$router.push({
        path: "campusCircleteacherdetails",
        query: { topicId: this.id,id:id}
      });
    },
    campusCircleteacheradd() {
      this.$router.push({
        path: "campusCircleteacheradd",
        query: { topicId: this.id }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.campusCircleteacher {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    .ul {
      overflow: hidden;
      padding-top: 10px;
      .li {
        float: left;
        width: 350px;
        margin:5px;
        background-color: #ecf5ff;
        color: #409eff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        padding: 15px 5px;
        font-size: 14px;
        cursor: pointer;
        .top-name {
          font-size: 17px;
          padding: 5px 0 20px 0;
          .el-icon-delete {
            font-size: 18px;
            color: #f56c6c;
            float: right;
            margin: 0 5px;
          }
          .el-icon-edit {
            font-size: 18px;
            float: right;
            color: #67C23A;
          }
        }
        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 5px;
        }
      }
    }
  }
}
</style>