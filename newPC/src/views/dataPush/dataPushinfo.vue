<template>
    <div class="dataPushinfo">
        <div class="top"> 
            <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>   
            <a :href="templateHref" target="_blank"  v-if="state==1"
                               download="模板">
                                <el-button  type="primary" size="medium">下载模板</el-button>
                            </a>
             <el-upload v-if="state==1"  class="upload-import" :action="uploadPath"  :data="uploadData" name="rosterFile" :show-file-list='false' accept=".csv,.xls" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                <el-button type="primary"   size="medium">导入</el-button>
            </el-upload>
              <el-button @click="pushDateSendBatch()" type="primary" size="medium" v-if="state==1" >发布</el-button>
                <el-button @click="remindNotReadeDateSendBatch()" type="primary" size="medium"  v-if="state==2">提醒未读用户</el-button>      
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入关键词" icon="search" size="medium" @change="getBatchDataSendInfoRosterPageList()"
                          v-model.trim="pagination.rosterKey">
                    <el-button slot="append" icon="el-icon-search" @click="getBatchDataSendInfoRosterPageList()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
               
                <el-table-column align="center" :label="dataList[0]?dataList[0].rosterKeyName:'身份证'" width="200px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.rosterKey}}</span>
                    </template>
                </el-table-column> 
                <el-table-column show-overflow-tooltip
                    v-for="(title, index) in rosterValues"
                    :label="title.fieldName" align="center">
                    <template slot-scope="scope">
                        <span>{{JSON.parse(scope.row.rosterValues)[index].fieldValue}}</span>
                    </template>
                </el-table-column>              
                <el-table-column align="center" label="状态" width="100" v-if="state==2">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger" v-if="scope.row.isRead==1">未读</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.isRead!=1">已读</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="170px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="deleteDataSendBatchRosterById(scope.row.id)" class="buttontextred">删除</el-button>
                   </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getBatchDataSendInfoRosterPageList" @current-change="getBatchDataSendInfoRosterPageList"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {getBatchDataSendInfoRosterPageList,pushDateSendBatch,deleteDataSendBatchRosterById,remindNotReadeDateSendBatch} from "@/api/dataPush";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        batchId:this.$route.query.id,
        total: null,
        rosterKey: ""
      },
      state:this.$route.query.state,
      rosterValues:[],
      templateHref:'',
      uploadPath: global.BasePath + "structure/dataSend/importInfoRosterDataByTemplate",
      uploadData: {
        batchId: this.$route.query.id,
        token: this.$store.getters.token
      },
    };
  },
  mixins: [baseMixin, mixin],
  created() {
        this.templateHref = global.BasePath + `structure/dataSend/downloadImportRosterTemplateByBatchId?token=${this.$store.getters.token}&batchId=${this.$route.query.id}`;
    this.getBatchDataSendInfoRosterPageList();
  },
  methods: {
      beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix != "csv" && suffix != "xls") {
                    this.$message.error("请上传模版文件!");
                }
            },
            handleAvatarSuccess(res, file) {
                if (res.result) {
                    this.$alert('导入'+res.data.totalCount+'条，成功'+res.data.successCount+'条', '提示', {
                        confirmButtonText: '确定'
                    });
                } else {
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
                this.getBatchDataSendInfoRosterPageList();
            },
      remindNotReadeDateSendBatch(){
         this.$confirm('提醒未读用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    remindNotReadeDateSendBatch({
                        batchName:this.$route.query.batchName,
                        id:this.pagination.batchId,
                         groupName:this.$route.query.groupName,
                        state:2
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '发布成功!'
                        });
                        this.getBatchDataSendInfoRosterPageList();
                    }).catch();

                }).catch(() => {
                });
    },
      pushDateSendBatch(){
         this.$confirm('此操作将发布此批次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    pushDateSendBatch({
                        batchName:this.$route.query.batchName,
                        id:this.pagination.batchId,
                        groupName:this.$route.query.groupName,
                        state:2
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '发布成功!'
                        });
                        this.state=2;
                    }).catch();

                }).catch(() => {
                });
    },
   //删除
    deleteDataSendBatchRosterById(id){
         this.$confirm('此操作将永久删除推送的用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDataSendBatchRosterById(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getBatchDataSendInfoRosterPageList();
                    }).catch();

                }).catch(() => {
                });
    },
    getBatchDataSendInfoRosterPageList() {
      getBatchDataSendInfoRosterPageList(this.pagination)
        .then(res => res.data)
        .then(data => {
            if(data.data.dataList.length){
                this.rosterValues=JSON.parse(data.data.dataList[0].rosterValues)
            }
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    dataPushadd() {
      this.$router.push({
        path: "dataPushadd"
      });
    },
    dataPusheidt(id){
        this.$router.push({
        path: "dataPusheidt",
         query: {id:id}
      });
    },
    
  }
};
</script>

<style lang="scss" scoped>
.dataPushinfo {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .upload-import {
  display: inline-block;
}
}
</style>
