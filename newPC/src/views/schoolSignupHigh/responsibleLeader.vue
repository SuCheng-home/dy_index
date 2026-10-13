<template>
  <div class="responsibleLeader">
    <div class="header">
       <el-col :span="19">
          <template>
          <el-select size="medium" v-model="pagination.noticeId" placeholder="请选择报名批次" @change="getNoticeInchargePageList()">
                        <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                   :value="item.id"></el-option>
                    </el-select>
           <el-button type="primary" size="medium" @click="jumpToPage('responsibleLeaderadd',{noticeId:pagination.noticeId,title:title})">添加分管领导</el-button>
          </template>
          </el-col>
            <el-col :span="5">
              <el-input  size="medium" placeholder="请输入学校名称" v-model.trim="pagination.searchSchoolName" @input="getNoticeInchargePageList">
            <el-button slot="append" icon="el-icon-search" @click="getNoticeInchargePageList"></el-button>
       </el-input>
            </el-col>
    </div>
    <div class="main-wrap" id="outTable">
      <el-table
        border
        stripe
        style="width: 100%;"
        :height="maxH"
        :data="dataList"
      >     
        <el-table-column align="center" label="分管领导">
          <template slot-scope="scope">{{ scope.row.inchargeUserName}}</template>
        </el-table-column>
        <el-table-column align="center" label="负责范围">
          <template slot-scope="scope">{{ scope.row.inchargeSchoolNames}}</template>
        </el-table-column>
       <el-table-column align="center" label="操作">
            <template slot-scope="scope">
               <el-button size="small" type="text"
                               @click="jumpToPage('responsibleLeaderadd', {id: scope.row.id,noticeId:pagination.noticeId,title:title})">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="deleteNoticeInchargeById(scope.row.id)" class="buttontextred">删除
                    </el-button>
           </template>
         </el-table-column>
      </el-table>
        <el-pagination
            style="margin-top: 20px"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import baseMixin from '@/mixins/baseMixin';
import {getSchoolPublishEnrollNoticeList,getNoticeInchargePageList,deleteNoticeInchargeById} from "@/api/schoolSignupHigh";
export default {
  data() {
    return { 
      dataList: [],
      pagination:{
        pageNo: 1,
        pageSize: 20,
        total: 0,
        noticeId:"",
        inchargeUserName:'',
        searchSchoolName:"",
        noticeId:""
      },
      noticeList:[],
      title:''
    };
  },
  created() {
         getSchoolPublishEnrollNoticeList()
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                    if(data.data.length !== 0) {
                        this.pagination.noticeId = data.data[0].id;
                    }
                    this.getNoticeInchargePageList()
                });
    
  },
  mixins: [mixin,baseMixin],
  methods: {  
    deleteNoticeInchargeById(id) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteNoticeInchargeById({id:id})
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getNoticeInchargePageList();
                            }
                        })
                });

            },
       // 分页 - pageSize 改变
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.getNoticeInchargePageList();
            },
            // 分页 - currentPage 改变
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getNoticeInchargePageList();
            },
    getNoticeInchargePageList() {
       for(let i=0;i<this.noticeList.length;i++){
         if(this.noticeList[i].id==this.pagination.noticeId){
           this.title=this.noticeList[i].title
         }                       
       }
       getNoticeInchargePageList({
        pageSize: this.pagination.pageSize,
        searchSchoolName: this.pagination.searchSchoolName,
        noticeId: this.pagination.noticeId,
        pageNo: this.pagination.pageNo,
        inchargeUserName:this.pagination.inchargeUserName
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200 && data.data) {
               this.dataList=data.data.dataList
                this.pagination.total = data.data.pagination.total;
          }
        })
        .catch(() => {});
    }
  },
};
</script>
<style lang="scss" scoped>
.responsibleLeader {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 0;
        overflow: hidden;
  }
 
}
</style>
 