<template>
  <div class="thermometerGun" v-loading="loading">  
     <div class="top">
          <el-button  @click="$router.back()" size="medium">返回</el-button> 
          <el-select style="width:100px;" size="medium" v-model="query.gradeId" placeholder="请选择年级" @change="changeGrade()">
                  <el-option v-for="item in gradelist" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
              </el-select>
        <el-select style="width:100px;" size="medium" v-model="query.classId" placeholder="请选择班级" @change="changeClass()">
                  <el-option v-for="item in classlist" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
        </el-select>
        <el-select style="width:100px;" size="medium" v-model="query.twqStatus"  @change="inputsearchNametime()">
                  <el-option v-for="item in typelist" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="whetherBindAllTwqs()">全部绑定</el-button>
        <el-button type="primary" size="medium" @click="bindOrunBindBatchTwqones()">绑定已勾选</el-button>
        <el-button type="primary" size="medium" @click="bindOrunBindBatchTwqtwos()">解绑已勾选</el-button>
        <el-input class="search-input search-input--right" size="medium" placeholder="请输入学生姓名" v-model.trim="query.studentNameOrNo" @input="inputsearchNametime()">
            <el-button slot="append" icon="el-icon-search" @click="inputsearchNametime()"></el-button>
       </el-input>
    </div>           
    <el-table  stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="`${maxH}px`" @select="selectionChangeHandler" @select-all="selectionChangeHandler">
        <el-table-column type="selection" align="center" width="65">
			</el-table-column>
         <el-table-column  label="用户名" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
             {{scope.row.loginname}}
            </template>
        </el-table-column>
         <el-table-column  label="姓名" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
             {{scope.row.userName}}
            </template>
        </el-table-column>
         <el-table-column  label="所在班级" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
             {{scope.row.classDepartName}}
            </template>
        </el-table-column>
         <el-table-column  label="卡号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
             {{scope.row.sid}}
            </template>
        </el-table-column>
        <el-table-column  label="绑定状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
             <el-tag  size="mini" type="success" v-if="scope.row.twqStatus==1">已绑定</el-tag>
             <el-tag  size="mini" type="danger"  v-if="scope.row.twqStatus==2">未绑定</el-tag>
            </template>
        </el-table-column>
         <el-table-column   label="操作"  align="center" width="120">
                    <template slot-scope="scope">
						<el-button size="small" type="text" :disabled='scope.row.twqStatus==1' @click="bindOrunBindBatchTwqone(scope.row.id,scope.row.sid)">绑定</el-button>
                        <el-button size="small" type="text" :disabled='scope.row.twqStatus==2'  @click="bindOrunBindBatchTwqtwo(scope.row.id,scope.row.sid)">解绑</el-button>
					</template>
        </el-table-column>
    </el-table>
     <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div> 
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {findGradeListByRole2,findClassListByRole2,findCampusCardListTwq,bindOrunBindBatchTwq,whetherBindAllTwq} from '@/api/campusCrd';
export default {
  data(){
    return{     
      dataList:[],
      classlist:[],
      gradelist:[],
      selected:[],
      typelist:[{name:'全部绑定状态',id:0},{name:'已绑定',id:1},{name:'未绑定',id:2}],
      studentId:'',     
      studentName:'', 
      total: null,  
      loading:false,  
      query: {
        classId: '', 
        gradeId: '',
        pageNo: 1, //页数
        pageSize: 20, //条数
        studentNameOrNo: "",
        twqStatus:0
      },
    }
  },
  created(){
    this.findGradeListByRole2s();
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  mixins: [mixin],
  methods:{ 
      selectionChangeHandler(selection) {
        this.selected = selection;      
	},
    //获取年级 
    findGradeListByRole2s(){
       findGradeListByRole2().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
            this.gradelist=data.data;
            if(data.data.length>0){
               this.query.gradeId=data.data[0].id;
              this.findClassListByRole2s(data.data[0].id)
            }
         }
      })
    },
    //获取班级
    findClassListByRole2s(){
       findClassListByRole2( this.query.gradeId).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
            if(data.data.length>0){
                 this.query.classId=data.data[0].id;
                 this.classlist=data.data;
                 this.findCampusCardListTwqs();
            };
         }
      })
    },
    //切换年级
    changeGrade(){
       this.findClassListByRole2s(); 
    },
    //切换班级
    changeClass(){
        this.findCampusCardListTwqs();
    },
   
    //搜索
    inputsearchNametime() {
        this.query.pageSize = 20;
        this.query.pageNo = 1;
        this.findCampusCardListTwqs();
    },
     //切换条数
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageNo = 1;
      this.findCampusCardListTwqs();
    },
    //切换页数
    handleCurrentChange() {
      this.findCampusCardListTwqs();
    },
    //获取列表
    findCampusCardListTwqs(){
        if((!this.query.classId)||(!this.query.gradeId)){
             return;
        };
      findCampusCardListTwq(this.query).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
            this.dataList = data.data.fpi.dataList;
            this.total = data.data.fpi.pagination.total;
         }
      })
    }, 
    //全绑 
    whetherBindAllTwqs(){     
       this.$confirm("确认要全部绑定吗？", "全部绑定", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          this.loading=true;
           whetherBindAllTwq(this.query.classId,this.query.gradeId).then(res => {
            if (res.data.code === 200) {
              this.$message.success("全部绑定成功");
              this.loading=false;
              this.findCampusCardListTwqs();             
            } else {
              this.$message.error(res.data.msg);
               this.loading=false;
            }
          });
        })
        .catch(() => {});
    },
    //勾选绑卡
    bindOrunBindBatchTwqones(){
      let ids='';
      let sids='';
     if(this.selected.length==0){
         this.$message.error('请先勾选学生');
         return;
     };
     for(let  i=0;i<this.selected.length;i++){
          if(i<this.selected.length-1){
                ids+=this.selected[i].id+',';
                sids+=this.selected[i].sid+',';
            }else{
                ids+=this.selected[i].id;
                sids+=this.selected[i].sid;
            }
     };
     this.$confirm("确认要绑定吗？", "绑定", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          this.loading=true;
           bindOrunBindBatchTwq(ids,sids,1).then(res => {
            if (res.data.code === 200) {
              this.$message.success("绑定成功");
              this.loading=false;
              this.findCampusCardListTwqs();             
            } else {
              this.$message.error(res.data.msg);
               this.loading=false;
            }
          });
        })
        .catch(() => {});
    },
    //勾选解绑
    bindOrunBindBatchTwqtwos(){
      let ids='';
      let sids='';
     if(this.selected.length==0){
         this.$message.error('请先勾选学生');
         return;
     };
     for(let  i=0;i<this.selected.length;i++){
          if(i<this.selected.length-1){
                ids+=this.selected[i].id+',';
                sids+=this.selected[i].sid+',';
            }else{
                ids+=this.selected[i].id;
                sids+=this.selected[i].sid;
            }
     };
     this.$confirm("确认要解绑吗？", "解绑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          this.loading=true;
           bindOrunBindBatchTwq(ids,sids,2).then(res => {
            if (res.data.code === 200) {
              this.$message.success("解绑成功");
              this.loading=false;
              this.findCampusCardListTwqs();             
            } else {
              this.$message.error(res.data.msg);
               this.loading=false;
            }
          });
        })
        .catch(() => {});
    },
    //绑卡 
    bindOrunBindBatchTwqone(ids,sids){     
       this.$confirm("确认要绑定吗？", "绑定", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          this.loading=true;
           bindOrunBindBatchTwq(ids,sids,1).then(res => {
            if (res.data.code === 200) {
              this.$message.success("绑定成功");
              this.loading=false;
              this.findCampusCardListTwqs();             
            } else {
              this.$message.error(res.data.msg);
               this.loading=false;
            }
          });
        })
        .catch(() => {});
    },
    //解绑 
    bindOrunBindBatchTwqtwo(ids,sids){     
       this.$confirm("确认要解绑吗？", "解绑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          this.loading=true;
           bindOrunBindBatchTwq(ids,sids,2).then(res => {
            if (res.data.code === 200) {
              this.$message.success("解绑成功");
              this.loading=false;
              this.findCampusCardListTwqs();             
            } else {
              this.$message.error(res.data.msg);
               this.loading=false;
            }
          });
        })
        .catch(() => {});
    },
  }
}
</script>

<style lang="scss" scoped>
.thermometerGun{
  padding:12px;
  box-sizing: border-box;
  .top{
    padding-bottom: 10px;
    overflow: hidden;
    .search-input--right {
    width: 200px!important;
    float: right;
}
  }
  .link{
      color:#409eff;
       cursor:pointer;
  }
  .input-box{
      overflow: hidden;
      line-height: 36px;
      margin:10px 0;
      .name{
         width: 100px;
        text-align: right;
        font-size: 14px;
        padding-right: 10px;
        float: left;        
          span{
              color:red
          }
      }
      .input{
          float: left;
          width: 500px;
      }
  }
}
</style>
