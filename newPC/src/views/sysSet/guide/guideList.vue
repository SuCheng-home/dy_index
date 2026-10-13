<template>
  <div class="guide_group_list_wrap">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button size="medium" @click.native="goBack">返回</el-button>
          <el-button type="primary" size="medium" @click.native="addNewGroup">新建</el-button>
          <a :href="guideExportUrl" target="_blank" download="guideExportName">
            <el-button type="primary" size="medium">护导二维码下载</el-button>
          </a>
          <el-button type="primary" size="medium" @click.native="guideManagerSet">岗位负责人设置</el-button>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="按岗位搜索" v-model.trim="searchName" size="medium" class="search-input"
                    @keyup.enter.native="searchNameHandler">
            <el-button  slot="append" icon="el-icon-search" @click="searchNameHandler"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div class="guide_post_box" :style="`height: ${maxH - 30}px;`">
      <div class="guide_post_list clearfix">
        <div class="guide_post_item" :key="index" v-for="(item, index) in guideList">
          <div class="guide_name" :title="item.place">{{item.place}}</div>
          <image-previewer tag="richtext">
            <img :src="item.qRCodeUrl" alt="" class="guide_code">
          </image-previewer>
          <div class="guide_btn_box">
            <i class="el-icon-edit" @click="editGuide(item.id, item.place, item.remarkInfo)"></i>
            <i class="el-icon-delete" @click="deleteGuidePost(item.id)"></i>
          </div>
        </div>
      </div>
      <div class="no_guide_post" v-if="!guideList.length">暂无岗位</div>
    </div>
    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                     :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <el-dialog title="护导岗" :visible.sync="isShowGuideAddPage" width="600px" :close-on-press-escape='false'
               :close-on-click-modal='false' :modal-append-to-body='false'>
      <el-form :model="guideForm" :rules="rules" ref="guideRuleForm" label-width="60px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="guideForm.name" autocomplete="off" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarkInfo">
          <el-input v-model="guideForm.remarkInfo" type="textarea" autocomplete="off" maxlength="500" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowGuideAddPage = false">取 消</el-button>
        <el-button type="primary" @click="addNewGuidePost" :loading="loadConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import { getGroupGuidePageList, addGuide, updateGuide, deleteGuide } from '@/api/systemSet/guide';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';

  export default {
    name: "guideList",
    data() {
      return {
        guideExportUrl: '',
        editGuideId: 0,
        isShowGuideAddPage: false,
        loadConfirm: false,
        guideForm: {
          name: '',
          remarkInfo: ''
        },
        rules: {
          name: [
            { required: true, message: "请输入名称！", trigger: "blur" },
            { min: 1, max: 20, message: "长度在 1 到 20 个字符！", trigger: "blur" }
          ]
        },
        searchName: '',
        pageNo: 1,
        pageSize: 20,
        total: null,
        guideList: []
      }
    },
    components: {ImagePreviewer},
    mixins: [mixins],
    created() {
      this.guideExportUrl = global.BasePath + "structure/guide/downloadGuideQrcode?groupId=" + this.$route.query.guideGroupId + "&token=" + this.$store.getters.token;
      this.getGroupGuidePageList();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      //
      guideManagerSet() {
        this.$router.push({path: 'guideManagerSet', query: {guideGroupId: this.$route.query.guideGroupId}});
      },
      // 列表
      searchNameHandler() {
        this.getGroupGuidePageList();
      },
      getGroupGuidePageList() {
        getGroupGuidePageList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          groupId: this.$route.query.guideGroupId,
          searchName: this.searchName
        }).then(res => {
          const data = res.data;
          if (data.code === 200) {
            this.guideList = data.data.dataList;
            this.total = data.data.pagination.total;
          }
        }).catch(() => {
        });
      },
      // 新增编辑
      addNewGroup() {
        this.editGuideId = 0;
        this.guideForm.name = '';
        this.guideForm.remarkInfo = '';
        this.isShowGuideAddPage = true;
      },
      editGuide(id, place, remarkInfo) {
        this.editGuideId = id;
        this.guideForm.name = place;
        this.guideForm.remarkInfo = remarkInfo;
        this.isShowGuideAddPage = true;
      },
      addNewGuidePost() {
        this.$refs.guideRuleForm.validate((valid) => {
          if (valid) {
            if (this.loadConfirm) {
              return;
            }
            this.loadConfirm = true;

            if (this.editGuideId) { // 编辑
              const query = {
                id: this.editGuideId,
                place: this.guideForm.name,
                remarkInfo: this.guideForm.remarkInfo
              };
              this.updateGuide(query);
            } else {
              const query = {
                groupId: this.$route.query.guideGroupId,
                place: this.guideForm.name,
                remarkInfo: this.guideForm.remarkInfo
              };
              this.addGuide(query);
            }
          }
        });
      },
      addGuide(query) {
        addGuide(query).then(res => {
          const data = res.data;
          if (data.code === 200 && data.result) {
            this.$message.success('保存成功');
            this.isShowGuideAddPage = false;
            this.searchName = '';
            this.pageNo = 1;
            this.getGroupGuidePageList();
          } else {
            this.$message.error(data.msg);
          }
          this.loadConfirm = false;
        }).catch(() => {
        });
      },
      updateGuide(query) {
        updateGuide(query).then(res => {
          const data = res.data;
          if (data.code === 200 && data.result) {
            this.$message.success('修改成功');
            this.isShowGuideAddPage = false;
            this.searchName = '';
            this.pageNo = 1;
            this.getGroupGuidePageList();
          } else {
            this.$message.error(data.msg);
          }
          this.loadConfirm = false;
        }).catch(() => {
        });
      },
      // 删除护导岗
      deleteGuidePost(guideId) {
        this.$confirm('是否删除该护导岗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteGuide(guideId);
        }).catch(() => {
        });
      },
      deleteGuide(guideId) {
        deleteGuide(guideId).then(res => {
          const data = res.data;
          if (data.code === 200) {
            this.$message.success('删除成功');
            this.searchName = '';
            this.pageNo = 1;
            this.getGroupGuidePageList();
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      },
      handleSizeChange(val) {
        this.pageNo = 1;
        this.pageSize = val;
        this.getGroupGuidePageList();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getGroupGuidePageList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/style";

  .guide_group_list_wrap {
    padding:12px;

    .header{
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .guide_post_box{
      width: 820px;
      margin: 20px auto;
      overflow-x: hidden;
      overflow-y: auto;
      .guide_post_list{
        padding-bottom: 20px;
        .guide_post_item{
          float: left;
          position: relative;
          width: 140px;
          height: 160px;
          margin-top: 20px;
          margin-left: 20px;
          border: 1px solid #eee;
          background: #fcfcfc;
          overflow: hidden;
          .guide_name{
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .guide_code{
            display: block;
            width: 80px;
            height: 80px;
            margin: 0 auto;
          }
          .guide_btn_box{
            height: 40px;
            line-height: 40px;
            text-align: right;
            margin-right: 10px;
            i{
              cursor: pointer;
              display: none;
            }
            .el-icon-edit{
              margin-right: 5px;
              color: #409eff;
            }
            .el-icon-delete{
              color: #F56C6C;
            }
          }
          &:hover{
            .guide_btn_box{
              i{
                display: initial;
              }
            }
          }
        }
      }
      .no_guide_post{
        text-align: center;
        color: #999;
      }
    }
  }
</style>
