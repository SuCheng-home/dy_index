<template>
    <div class="morninginspectionrobotindex">
        <div class="top">          
             <el-date-picker v-model="pagination.checkDate" :clearable="false" :editable="false"   @change="getScancodeFaceRecordLists()" type="date"  size="medium" placeholder="选择日期"></el-date-picker>
              <el-select class="filter-item" size="medium" v-model="pagination.classId" placeholder="请选择" @change="getScancodeFaceRecordLists()">
                <el-option v-for="item in classlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-select v-model="pagination.searchType" placeholder="请选择"  size="medium"   @change="getScancodeFaceRecordLists()">
                   <el-option label="全部状态" :value="0"></el-option>
                   <el-option label="正常" :value="1"></el-option>
                   <el-option label="异常" :value="2"></el-option>
                   <el-option label="未识别" :value="3"></el-option>
            </el-select>
            <a :href="exportUrl" target="_blank" download="导出结果" v-if="dataList.length">
                                <el-button type="primary" size="medium">导出</el-button>
                            </a>
             <el-input class="search-input" style="width:20%;float: right;" v-model.trim="pagination.studentName" size="medium" placeholder="请输入学生姓名" >
                <el-button slot="append" icon="el-icon-search" @click="getScancodeFaceRecordLists()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">           			
                <el-table-column align="center" label="学生姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.studentName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.gender==1?"男":"女"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级">
                    <template slot-scope="scope">
                        {{scope.row.className}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="晨检时间">
                    <template slot-scope="scope">
                          <span>{{scope.row.checkDate?scope.row.checkDate.slice(0,19):''}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="体温">
                    <template slot-scope="scope">
                          {{scope.row.temperature}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="眼睛状态" width="120">
                    <template slot-scope="scope">                           
                           <span class="link-color" v-if="scope.row.eyeState==1"><image-previewer :images="[{src:scope.row.eyeImage}]"    tag="img"   text="正常"></image-previewer></span>
                           <span class="link-red" v-if="scope.row.eyeState==2"><image-previewer :images="[{src:scope.row.eyeImage}]"    tag="img"   text="异常"></image-previewer></span>
                           <span class="link-yellow" v-if="scope.row.eyeState==3"><image-previewer :images="[{src:scope.row.eyeImage}]"    tag="img"   text="未识别"></image-previewer></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手部状态"  width="120">
                    <template slot-scope="scope">
                           <span class="link-color" v-if="scope.row.handState==1"><image-previewer :images="[{src:scope.row.handsImage}]"    tag="img"   text="正常"></image-previewer></span>
                           <span class="link-red" v-if="scope.row.handState==2"><image-previewer :images="[{src:scope.row.handsImage}]"    tag="img"   text="异常"></image-previewer></span>
                           <span class="link-yellow" v-if="scope.row.handState==3"><image-previewer :images="[{src:scope.row.handsImage}]"    tag="img"   text="未识别"></image-previewer></span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="嘴巴状态"  width="120">
                    <template slot-scope="scope">
                        <span class="link-color" v-if="scope.row.mouthState==1"><image-previewer :images="[{src:scope.row.mouthImage}]"    tag="img"   text="正常"></image-previewer></span>
                           <span class="link-red" v-if="scope.row.mouthState==2"><image-previewer :images="[{src:scope.row.mouthImage}]"    tag="img"   text="异常"></image-previewer></span>
                           <span class="link-yellow" v-if="scope.row.mouthState==3"><image-previewer :images="[{src:scope.row.mouthImage}]"    tag="img"   text="未识别"></image-previewer></span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getScancodeFaceRecordLists" @current-change="getScancodeFaceRecordLists"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {
  getManageAndOtherDepart,
  querySchoolClass,possessRole,getScancodeFaceRecordList
} from "@/api/morninginspectionrobot";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "morninginspectionrobotindex",
  data() {
    return {
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        studentName: "",
        checkDate:new Date(),
        searchType:0,
        classId:0
      },
      classlist:[],
      exportUrl:""
    };
  },
  components: {ImagePreviewer},
  mixins: [baseMixin, mixin],
  created() {
			possessRole().then(res=>{				
                if(res.data.data.result){
                    querySchoolClass().then(res=>res.data)
                    .then(data=>{
                      data.data.unshift({id:0,name:'全部班级'}) ;
                        this.classlist=data.data;
                        if(data.data.length>0){                          
                        this.pagination.classId=data.data[0].id;
                        this.getScancodeFaceRecordLists();
                        }
                    })
                }else{
                     getManageAndOtherDepart().then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.classlist = data.data;
                        if (this.classlist.length > 0) {
                            this.pagination.classId = this.classlist[0].id;
                            this.getScancodeFaceRecordLists();
                        }
                    }
                }).catch(() => {
                })

                }
			});
  },
  methods: {
    getScancodeFaceRecordLists() {
      this.pagination.checkDate=this.$moment(this.pagination.checkDate).format('YYYY-MM-DD');
      this.exportUrl= `${global.BasePath}structure/scancodeEquipment/exportScancodeFaceRecordList?createDate=${this.pagination.checkDate}&classId=${this.pagination.classId}&searchType=${this.pagination.searchType}&userId=0&token=${this.$store.getters.token}`
      getScancodeFaceRecordList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;          
        });
    },
     morninginspectionrobotdetails(id) {
      this.$router.push({
        path: "morninginspectionrobotdetails",
        query: { id: id }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.morninginspectionrobotindex {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .link-color{
   color: #20a0ff;
  }
  .link-red{
  color:#F56C6C;
  }
  .link-yellow{
    color:#E6A23C;
  }
}
</style>
