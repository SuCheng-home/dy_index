<template>
  <div class="code_manage_list"  style="    padding: 12px;">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-select v-model="searchState" placeholder="请选择" size="medium" @change="changeCodeStatus">
            <el-option v-for="item in searchStateList" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>

          <a :href="exportTableUrl" download="导出" target="_blank" v-if="codeList.length">
            <el-button type="primary" size="medium">导出</el-button>
          </a>

          <div class="top_msg_box">
            <span class="color_block"></span><span class="not_font">未使用</span>
            <span class="color_block color_wait"></span><span class="wait_font">已分配</span>
            <span class="color_block color_used"></span><span>已预约</span>
          </div>
        </el-col>
        <el-col :span="5">
          <el-input size="medium" v-model.trim="searchName" placeholder="请输入验证码" @keyup.enter.native="searchCode">
            <el-button size="medium" slot="append" icon="el-icon-search" @click="searchCode"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div :style="`height: ${boxH - 220}px;`" class="code_list_box">
      <div class="code_list clearfix" v-if="codeList.length">
        <div :class="`code_item ${item.status === 1 ? 'code_not' : ''} ${item.status === 2 ? 'code_wait' : ''} ${item.status === 3 ? 'code_used' : ''}`" :key="index" v-for="(item, index) in codeList">
          {{item.authCode}}
          <div class="code_btn_box" @click="toUseCode(item.authCode)">分配</div>
        </div>
      </div>
      <div class="no_msg_box" v-else>
        <img src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png" alt="">
        <div>暂无验证码</div>
      </div>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page.sync="listQuery.pageNo" :page-sizes="[100,200,300,400,500]"
                   :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" class="list-pagination">
    </el-pagination>
  </div>
</template>

<script>
  import {queryTeacherTaoCode, updateCodeStatus} from '@/api/psychological';
  import baseMixin from '@/mixins/baseMixin';
  import windowResizeMixin from '@/mixins/windowResize';

  export default {
    name: 'codeManageList',
    mixins: [windowResizeMixin, baseMixin],
    data() {
      return {
        searchStateList: [
          {
            value: 0,
            label: '全部状态'
          },
          {
            value: 1,
            label: '未使用'
          },
          {
            value: 2,
            label: '已分配'
          },
          {
            value: 3,
            label: '已预约'
          },
        ],
        searchState: 0,
        searchName: '',
        codeList: [],
        exportTableUrl: '',
        listQuery: {
          pageNo: 1,
          pageSize: 200
        },
        total: null
      };
    },
    created() {
      this.queryTeacherTaoCode();
    },
    methods: {
      //获取列表
      queryTeacherTaoCode() {
        this.exportTableUrl = `${global.BasePath}structure/teacherTao/downTeacherTaoCode?searchName=${this.searchName}&status=${this.searchState}&token=${this.$store.getters.token}`;
        queryTeacherTaoCode({
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          searchName: this.searchName,
          status: this.searchState,
        }).then(res => res.data).then(data => {
          this.codeList = data.data.dataList;
          this.total = data.data.pagination.total;
        });
      },
      //每页条数更改
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.queryTeacherTaoCode();
      },
      //当前页码更改
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.queryTeacherTaoCode();
      },
      //点击搜索
      searchCode() {
        this.listQuery.pageNo = 1;
        this.queryTeacherTaoCode();
      },
      //点击搜索
      changeCodeStatus() {
        this.searchName = '';
        this.listQuery.pageNo = 1;
        this.queryTeacherTaoCode();
      },
      toUseCode(authCode) {
        this.$confirm(`是否分配当前验证码？`, '分配验证码', {
          type: 'success'
        }).then(() => {
          updateCodeStatus({
            authCode: authCode,
            status: 2
          }).then(res => res.data).then(data => {
            if (data.code===200 && data.result) {
              this.$message({
                type: 'success',
                message: '操作成功！'
              });
              this.queryTeacherTaoCode();
            } else {
              this.$message({
                type: 'warning',
                message: data.msg
              });
            }
          });
        }).catch(() => {
        });
      }
    }
  };
</script>

<style scoped>
  .clearfix:after {
    content: "";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .clearfix {
    zoom: 1;
  }
</style>
<style lang="scss" scoped>
  .code_manage_list {
    .header {
       padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      .top_msg_box{
        display: inline-block;
        height: 18px;
        font-size: 14px;
        color: #909399;
        .color_block{
          display: inline-block;
          width: 50px;
          height: 100%;
          margin: 0 8px;
          margin-bottom: -4px;
          background-color: #ECF5FF;
        }
        .color_wait{
          background-color: #F0F9EB;
        }
        .color_used{
          background-color: #F4F4F5;
        }
        .not_font{
          color: #409EFF;
        }
        .wait_font{
          color: #67C23A;
        }
      }
    }

    .code_list_box {
      width: 98%;
      margin: 0 auto;
      overflow-x: hidden;
      overflow-y: auto;
      .code_list{
        .code_item{
          position: relative;
          float: left;
          width: 98px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          margin-right: 10px;
          margin-bottom: 10px;
          font-size: 14px;
          color: #409EFF;
          background: #ECF5FF;
          border: 1px solid #B3D8FF;
          border-radius: 5px;
          overflow: hidden;
        }
        .code_not{
          cursor: pointer;
          .code_btn_box{
            position: absolute;
            top: 28px;
            left: 0;
            width: 100%;
            height: 100%;
            color: #fff;
            background: #409EFF;
          }
          &:hover{
            border-color: #409EFF;
            .code_btn_box{
              top: 0;
              transition: .3s;
            }
          }
        }
        .code_wait{
          color: #67C23A;
          background: #F0F9EB;
          border: 1px solid #C2E7B0;
        }
        .code_used{
          color: #909399;
          background: #F4F4F5;
          border: 1px solid #D3D4D6;
        }
      }

      .no_msg_box {
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

    .list-pagination {
      margin-top: 10px;
      margin-left: 20px;
    }
  }
</style>
