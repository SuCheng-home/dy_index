<template>
  <div class="classHonorList padding">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button @click="goBack" type="default" size="medium">返回</el-button>
          <el-select size="medium" v-model="currentCertLevel" placeholder="请选择级别" @change="getSchoolHonorClassDetailDate">
            <el-option :key="0" label="全部级别" :value="0"></el-option>
            <el-option v-for="(item, index) in certLevelList" :key="index+1" :label="item.honorTypeName" :value="item.honorTypeId"></el-option>
          </el-select>
          <el-select size="medium" v-model="currentCertType" placeholder="请选择类型" @change="getSchoolHonorClassDetailDate">
            <el-option :key="0" label="全部证书级别" :value="0"></el-option>
            <el-option v-for="(item, index) in certTypeList" :key="index+1" :label="item.certType" :value="item.certTypeId"></el-option>
          </el-select>
          <el-select size="medium" v-model="currentAward" placeholder="请选择类型" @change="getSchoolHonorClassDetailDate">
            <el-option v-for="item in awardList" :key="item.id" :label="item.name"  :value="item.id"></el-option>
          </el-select>
          <a :href="exportURL" download="导出" target="_blank" v-if="honourTable.length">
            <el-button type="primary" icon="upload" size="medium">导出</el-button>
          </a>
        </el-col>
        <el-col :span="5">
          <el-input  size="medium" placeholder="请输入学生姓名" icon="el-icon-search" @change="handleInputChange()"   v-model.trim="searchName">
            <el-button size="medium"  slot="append" icon="el-icon-search" @click="handleInputChange()"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-table
        ref="multipleTable"
        :data="honourTable"
        border
        stripe
        class="honourTable"
        :height="innerBodyH"
        style="width: 100%">
        <el-table-column
          label="学号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.studentNo }}</template>
        </el-table-column>
        <el-table-column
          label="姓名" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.studentName }}</template>
        </el-table-column>
        <el-table-column
          label="证书名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.honorName }}</template>
        </el-table-column>
        <el-table-column
          label="证书等级" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.honorTypeName }}</template>
        </el-table-column>
        <el-table-column
          label="证书类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.certType }}</template>
        </el-table-column>
        <el-table-column
          label="获奖类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.awardTypeName }}</template>
        </el-table-column>
        <el-table-column
          label="获奖等级" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.awardLevelName }}</template>
        </el-table-column>
        <el-table-column
          label="颁发机构" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.issueOrgan }}</template>
        </el-table-column>
        <el-table-column
          label="颁发时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.issueDate }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="previewImage"
          label="证书图片"
          :resizable="false"
        >
          <template slot-scope="scope">
            <image-previewer
              class="image-plate"
              :images="scope.row.schoolHonorStuFileList"
              tag="img"
              text="图片预览"
              v-if="scope.row.schoolHonorStuFileList.length !== 0"
              style="color: #1992FB"
            >
            </image-previewer>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import mixins from '@/mixins/windowResize';
  import _ from 'lodash';
  import {findHonorTypeListHistory, findHonorLevelListHistory, getSchoolHonorClassDetailDate} from '@/api/honour/index';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  export default {
    components: {
      ImagePreviewer
    },
    data(){
      return{
        startDate:this.$route.query.startDate,
        endDate:this.$route.query.endDate,
        currentCertLevel: 0,
        schoolTimeId:this.$route.query.schoolTimeId,
        gradeId:this.$route.query.gradeId,
        classId:this.$route.query.classId,
        honourTable:[],
        listLoading:false,
        searchName:'',
        certLevelList: [],
        currentCertType: 0,
        certTypeList: [],
        currentAward: 0,
        awardList: [
          {
            id: 0,
            name: '全部获奖类型'
          },
          {
            id: 1,
            name: '个人奖'
          },
          {
            id: 2,
            name: '集体奖'
          }
        ],
        exportURL: ''
      }
    },
    created(){
      this.findHonorTypeListHistory();
      this.findHonorLevelListHistory();
      this.getSchoolHonorClassDetailDate();},
    mixins:[mixins],
    methods:{
      goBack(){
        this.$router.back();
      },
      handleInputChange:_.debounce(function(val){
        this.getSchoolHonorClassDetailDate();
      },500),
      findHonorLevelListHistory(){
        findHonorLevelListHistory({schoolTimeId: this.schoolTimeId}).then(res=>res.data).then(data=>{
          if(data.code===200 && data.result && data.data.length){
            this.certLevelList = data.data;
            this.currentCertLevel = Number(this.$route.query.honorTypeId) || 0;
            this.getSchoolHonorClassDetailDate();
          }
        })
      },
      findHonorTypeListHistory(){
        findHonorTypeListHistory({schoolTimeId: this.schoolTimeId}).then(res=>res.data).then(data=>{
          if(data.code===200 && data.result){
            this.certTypeList = data.data;
          }
        })
      },
      getSchoolHonorClassDetailDate(){
        this.exportURL = `${global.BasePath}structure/schoolHonor/exportGetSchoolHonorClassDetailDate?awardTypeCode=${this.currentAward || ''}&certTypeId=${this.currentCertType}&classId=${this.classId}&endDate=${this.endDate}&honorTypeId=${this.currentCertLevel}&schoolTimeId=${this.schoolTimeId}&schoolTimeId=${this.schoolTimeId}&startDate=${this.startDate}&stuName=${this.searchName}&token=${this.$store.getters.token}`;
        getSchoolHonorClassDetailDate({
          awardTypeCode:this.currentAward || '',
          certTypeId:this.currentCertType,
          classId:this.classId,
          endDate:this.endDate,
          honorTypeId:this.currentCertLevel,
          schoolTimeId:this.schoolTimeId,
          startDate:this.startDate,
          stuName:this.searchName
        }).then(res=>res.data).then(data=>{
          if(data.code===200){
            this.honourTable=data.data;
            this.honourTable.forEach((item) => {
              if (item.schoolHonorStuFileList !== "" && item.schoolHonorStuFileList.length > 0) {
                item.schoolHonorStuFileList.forEach((pic) => {
                  pic.src = pic.accessUrl;
                })
              }
            });
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

  .padding{
    padding:12px;
    box-sizing: border-box;
  }
  .classHonorList{
    .header{
      padding-bottom:10px;
      span{
        color: #666;
        margin-left: 6px;
        font-size: 15px;
      }
    }
    .pagination-container{
      margin-top:20px;
    }
  }
  .addOrganFrom{
    width:80%;
  }

</style>
<style scoped>
  .classHonorList  .image-previewer__content img {
    max-height: 100%;
  }
</style>
