<template>
    <div class="campustelephoneone">
        <div class="top">
            <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入姓名" icon="search" size="medium" @change="getVisitorListdun()"
                          v-model.trim="pagination.nameKeywords">
                    <el-button slot="append" icon="el-icon-search" @click="getVisitorListfun()"></el-button>
            </el-input>
           <el-input class="search-input" style="width:20%;float: right;margin: 0 10px;"  placeholder="请输入卡号" icon="search" size="medium" @change="getVisitorListdun()"
                          v-model.trim="pagination.sidKeywords">
                           <el-button slot="append" icon="el-icon-search" @click="getVisitorListfun()"></el-button>
            </el-input>
           
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">    
            <el-table-column align="center" label="人脸照片" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <image-previewer tag="richtext"  >
                              <img class="img" v-if="scope.row.faceUrl" :src="scope.row.faceUrl"> 
                        </image-previewer>
                    </template>
                </el-table-column>          
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="登录名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.loginName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="卡号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.sid}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="人员类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.userType==1?"老师":"学生"}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="班级/部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.classDepartName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="剩余通话时长（分钟）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.surplusCallLen}}</span>
                    </template>
                </el-table-column>
               <el-table-column align="center" label="最后更新时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime?scope.row.createTime.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column>                 
                 <el-table-column align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="getTelephoneUserFamilyNumberList(scope.row.userId)">查看亲情号码</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getVisitorListfun" @current-change="getVisitorListfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
             <el-dialog
            title="亲情号码"
            :visible.sync="dialogVisible"
            width="40%">
            <el-form class="card-dialog-padding" :rules="rules" ref="ruleDialogForm" label-width="100px">
                <el-form-item :label="item.salutation" v-for="(item, index) in list" :key="index">
                   {{item.phoneNumber}}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import moment from "moment";
import { getTelephoneUserForPage,getTelephoneUserFamilyNumberList} from "@/api/campustelephone";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
export default {
  data() {
    return {
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        nameKeywords: "",
        sidKeywords: "",
      },
      orderDetailsList: [],
      dialogVisible: false,
      content: "",
      list:[]
    };
  },
  mixins: [baseMixin, mixin],
   components: {ImagePreviewer},
  created() {
    this.getVisitorListfun();
  },
  methods: {
    getVisitorListfun() {     
      getTelephoneUserForPage(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    getTelephoneUserFamilyNumberList(userId){
         this.list=[];
        getTelephoneUserFamilyNumberList(userId)
                    .then(res => res.data)
                    .then(data => {
                    if (data.code == 200) {
                       this.list=data.data;
                       if(this.list.length){
                         this.dialogVisible=true;
                       }else{
                             this.$message({
                            type: "warning",
                            message: "暂无亲情号码！"
                          });
                          return;
                       }
                    } else {
                        this.$message({
                            type: "warning",
                            message: data.msg
                          });              
                    }
                    });
    }
  }
};
</script>

<style lang="scss" scoped>
.campustelephoneone {
  padding:12px;
  .top {
    padding-bottom: 10px;
    overflow: hidden;
  }
  .img{
      height: 20px;
  }
}
</style>
