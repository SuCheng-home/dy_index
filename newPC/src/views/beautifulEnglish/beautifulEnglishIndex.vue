<template>
  <div class="book_reaction_wrap">
    <div class="book_reaction_out_box">
      <div class="left_tree_box">
        <div class="tree_wrap">
          <el-tree :data="defaultTreeDom" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无目录"
                   :default-expanded-keys="defaultExpandedArray" node-key="id" :expand-on-click-node="false"></el-tree>
        </div>
      </div>
      <div class="right_content_box">
        <div class="header_title">
          <span>{{currentTitle}}</span>
          <i class="el-icon-edit" @click="showEditBox" v-show="topDomId !== currentDomId && isShowByPermission('/beautifulEnglish/initTree')"></i>
          <i class="el-icon-delete" @click="deleteTreeDom" v-show="topDomId !== currentDomId && isShowByPermission('/beautifulEnglish/initTree')"></i>
        </div>
        <div class="header">
          <el-row>
            <el-col :span="18">
              <el-button size="small" type="primary" @click="showAddBox" v-show="isShowByPermission('/beautifulEnglish/initTree') && (currentLevel === 1 || currentLevel === 2)">新增目录</el-button>
              <el-button size="small" type="primary" @click="addCatalogArticle" v-show="isShowByPermission('/beautifulEnglish/initTree') && currentLevel === 3">上传美文</el-button>
              <div>&nbsp;</div>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="请输入内容" v-model.trim="searchName" size="medium"
                        @keyup.enter.native="searchNameHandler">
                <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <div class="book_reaction_box">
          <div v-if="bookReactionList.length">
            <div class="reaction_list" :style="`height: ${maxH-45}px;`">
              <div class="reaction_item" :key="item.id" v-for="item in bookReactionList">
                <div class="reaction_title">
                  <span>{{item.className}}</span>
                  <span>{{item.stuName}}</span>
                  <span>{{item.createDate}}</span>
                  <span class="edit_text" @click="addReaction(item.id)" v-show="isShowByPermission('/beautifulEnglish/initTree')">编辑</span>
                  <span class="delete_text" @click="delCurrentInfo(item.id)" v-show="isShowByPermission('/beautifulEnglish/initTree')">删除</span>
                </div>
                <div class="reaction_remark" @click="toArticleInfo(item.id)">
                  <div v-html="item.content"></div>
                </div>
                <div v-show="item.fileList.length">
                  <file-list :fileList="item.fileList"></file-list>
                </div>
              </div>
            </div>
            <div class="pagination-container" style="margin-top: 15px;">
              <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                             :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                             :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                             :total="pagination.total">
              </el-pagination>
            </div>
          </div>
          <div class="no_stu_msg" v-else>
            <img src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
                 alt="">
            <div>暂无美文</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="目录维护" :visible.sync="isShowDialog" width="600px" :close-on-click-modal="false">
      <el-form ref="form" :model="catalogQuery" :rules="catalogRule" label-width="80px">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model.trim="catalogQuery.name" placeholder="请输入名称" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortNo">
          <el-input-number v-model.trim="catalogQuery.sortNo" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="medium" @click="isShowDialog = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addCatalog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {isShowByPermission} from "@/utils";
  import FileList from '@/components/FileList/FileList.vue';
  import {
    initTree,
    treeDomInsert,
    treeDomUpdateByModel,
    deleteTreeDomById,
    listBySchoolIdAndContent,
    listByTreeNodeId,
    deleteArticleById
  } from '@/api/beautifulEnglish';

  export default {
    name: "beautifulEnglishIndex",
    components: {
      FileList
    },
    data() {
      return {
        currentLevel: 1,
        isInitTime: true,
        isShowDialog: false,
        isEditTreeName: false,
        btnLoading: false,
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        defaultExpandedArray: [],
        defaultTreeDom: [],
        topDomId: 0,
        currentInfo: {},
        currentDomId: 0,
        currentFolderCode: '',
        currentTitle: '',
        searchName: '',
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: null
        },
        bookReactionList: [],
        AllBookReactionList: [],
        allTotal: null,
        catalogQuery: {
          name: '',
          sortNo: 1
        },
        catalogRule: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
          ],
          sortNo: [
            {required: true, message: '请填写排序号', trigger: 'blur'}
          ]
        }
      }
    },
    mixins: [mixins],
    created() {
      this.initTree();
    },
    methods: {
      isShowByPermission,
      addCatalogArticle() {
        this.$router.push({
          path: 'add',
          query: {treeNodeId: this.currentDomId, currentFolderCode: this.currentFolderCode}
        })
      },
      toArticleInfo(articleId) {
        this.$router.push({
          path: 'info',
          query: {articleId: articleId}
        })
      },
      // 树形结构内容操作
      showAddBox() {
        this.catalogQuery.name = '';
        this.catalogQuery.sortNo = 1;
        this.isEditTreeName = false;
        this.isShowDialog = true;
      },
      showEditBox() {
        this.catalogQuery.name = this.currentTitle;
        this.catalogQuery.sortNo = this.currentInfo.sortNo;
        this.isEditTreeName = true;
        this.isShowDialog = true;
      },
      deleteTreeDom() {
        let treeDelText = '是否删除当前目录？';
        if (this.AllBookReactionList.length) {
          treeDelText = '当前目录下有美文数据，是否确定删除？';
        }
        this.$confirm(treeDelText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteTreeDomById();
        }).catch(() => {
        });
      },
      deleteTreeDomById() {
        deleteTreeDomById({id: this.currentDomId}).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('删除成功');
            this.isInitTime = true;
            this.initTree();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
      handleNodeClick(data) {
        this.currentLevel = data.folderCode.split(',').length;
        if (this.currentDomId !== data.id) {
          this.searchName = '';
          this.pagination.pageNo = 1;
          this.pagination.pageSize = 20;
          this.currentInfo = data;
          this.currentDomId = data.id;
          this.currentFolderCode = data.folderCode;
          this.currentTitle = data.name;
          this.listByTreeNodeId();
          this.defaultExpandedArray = [data.id];
        }
      },
      searchNameHandler() {
        if (this.searchName) {
          let newIndexArray = [];
          this.AllBookReactionList.forEach((item) => {
            if (item.content.indexOf(this.searchName) > -1) {
              newIndexArray.push(item);
            }
          });
          this.bookReactionList = newIndexArray;
          this.pagination.total = this.bookReactionList.length;
        } else {
          this.bookReactionList = this.AllBookReactionList;
          this.pagination.total = this.allTotal;
        }
      },
      initTree() {
        initTree().then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && data && data.length) {
            this.defaultTreeDom = data;
            this.searchName = '';
            this.listBySchoolIdAndContent();
            // 初始化的时候取第一个的数据
            if (this.isInitTime) {
              this.isInitTime = false;
              this.currentInfo = data[0];
              this.topDomId = data[0].id;
              this.currentDomId = data[0].id;
              this.currentFolderCode = data[0].folderCode;
              this.currentTitle = data[0].name;
              this.defaultExpandedArray = [data[0].id];
            }
          }
        });
      },
      addCatalog() {
        this.$refs.form.validate((isValid) => {
          if (isValid) {
            let query = {
              name: this.catalogQuery.name,
              sortNo: this.catalogQuery.sortNo
            };

            if (this.isEditTreeName) {
              query.id = this.currentDomId;
              this.treeDomUpdateByModel(query);
            } else {
              query.folderCode = this.currentFolderCode;
              query.parentId = this.currentDomId;
              this.treeDomInsert(query);
            }
          }
        })
      },
      treeDomInsert(query) {
        if (this.btnLoading) {
          return;
        }
        this.btnLoading = true;
        treeDomInsert(query).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('添加成功');
            this.isShowDialog = false;
            this.isInitTime = true;
            this.initTree();
            this.btnLoading = false;
          } else {
            this.$message.warning(res.data.msg);
            this.btnLoading = false;
          }
        });
      },
      treeDomUpdateByModel(query) {
        if (this.btnLoading) {
          return;
        }
        this.btnLoading = true;
        treeDomUpdateByModel(query).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('编辑成功');
            this.isShowDialog = false;
            this.isInitTime = true;
            this.initTree();
            this.btnLoading = false;
          } else {
            this.$message.warning(res.data.msg);
            this.btnLoading = false;
          }
        });
      },
      // 美文操作
      listBySchoolIdAndContent() {
        listBySchoolIdAndContent({
          pageNo: 1,
          pageSize: 20
        }).then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.bookReactionList = data.dataList;
            this.AllBookReactionList = data.dataList;
            this.pagination.total = data.pagination.total;
            this.allTotal = data.pagination.total;
          }
        });
      },
      listByTreeNodeId() {
        listByTreeNodeId({
          treeNodeId: this.currentDomId,
          folderCode: this.currentFolderCode,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }).then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.bookReactionList = data.dataList;
            this.AllBookReactionList = data.dataList;
            this.pagination.total = data.pagination.total;
            this.allTotal = data.pagination.total;
          }
        });
      },
      addReaction(articleId) {
        this.$router.push({
          path: 'add',
          query: {articleId: articleId}
        })
      },
      delCurrentInfo(articleId) {
        this.$confirm('是否删除当前美文？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteArticleById(articleId);
        }).catch(() => {
        });
      },
      deleteArticleById(articleId) {
        deleteArticleById({id: articleId}).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('删除成功');
            this.listByTreeNodeId();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
      sizeChangeHandler() {
        this.pagination.pageNo = 1;
        this.listByTreeNodeId();
      },
      currentChangeHandler() {
        this.listByTreeNodeId();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .book_reaction_wrap {
    overflow: hidden;
    .book_reaction_out_box{
      display: flex;
      margin: 6px 10px;
      border: 1px solid #f8f8f8;
      overflow: hidden;

      .left_tree_box {
        width: 220px;
        padding: 10px;
        border-right: 1px solid #eee;
        .tree_wrap{
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
        }
      }

      .right_content_box {
        flex: 1;

        .header_title {
          height: 30px;
          line-height: 30px;
          margin: 12px 20px;
          font-size: 18px;
          font-weight: bold;
          color: #333;

          span {
            margin-right: 8px;
          }

          i {
            cursor: pointer;
          }

          .el-icon-edit {
            color: #409eff;
          }

          .el-icon-delete {
            color: #F56C6C;
          }
        }

        .header {
          height: 50px;
          padding: 0 15px;
          border-bottom: 1px solid #eee;
        }

        .book_reaction_box {
          .reaction_list {
            overflow-x: hidden;
            overflow-y: auto;
            width: 97%;
            margin: 10px auto 0;

            .reaction_item {
              padding: 10px 0;

              .reaction_title {
                height: 30px;
                line-height: 30px;
                margin-bottom: 10px;
                color: #333;

                span {
                  margin-right: 8px;
                }

                .edit_text {
                  color: #409eff;
                  cursor: pointer;
                }

                .delete_text {
                  color: #F56C6C;
                  cursor: pointer;
                }
              }

              .reaction_remark {
                max-height: 180px;
                overflow: hidden;
                margin-bottom: 10px;
                color: #666;
                cursor: pointer;
                word-break: break-all;
              }

              & + .reaction_item {
                border-top: 1px solid #eee;
              }
            }
          }

          .no_stu_msg {
            text-align: center;
            font-size: 15px;
            color: #999;
            overflow: hidden;

            img {
              display: block;
              margin: 30px auto 0;
            }

            div {
              height: 20px;
              line-height: 20px;
              margin-top: -40px;
            }
          }
        }
      }
    }
  }
</style>
