<template>
  <div class="peanutindex">
    <div class="header">
      <el-row>
        <el-col :span="19">
           <el-select v-model="schoolName" placeholder="请选择学期" size="medium" @change="changeSchool">
            <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                       :value="item.schoolTimeName">
            </el-option>
          </el-select>
          <el-button type="primary"  size="medium" @click="peanutadd">批量发放</el-button>
         
        </el-col>
        <el-col :span="5">
          <el-input size="medium" v-model.trim="userName" placeholder="请输入老师姓名" @keyup.enter.native="getStatistics">
            <el-button slot="append" icon="el-icon-search" size="medium" @click="getStatistics"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="doc_flow_table_box">
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="nobottommaxH">
        <el-table-column align="center" label="老师姓名" show-overflow-tooltip>
          <template slot-scope="scope">
          {{scope.row.userName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收到花生币" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.totalNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="已发出花生币" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.useNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="剩余花生币" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{Math.ceil(scope.row.totalNum-scope.row.useNum)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="popfun(scope.row)">发放</el-button>
            <el-button type="text" size="small" @click="peanutthinfo(scope.row)">使用记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="发放" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
			 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
        <el-form-item label="事由" prop="content">
          <el-input  type="textarea" v-model.trim="ruleForm.content"   :rows="4" resize="none" :maxlength="100" placeholder="请输入事由"></el-input>
        </el-form-item>
          <el-form-item label="发放金额" prop="num">
              <el-input-number v-model="ruleForm.num"  placeholder="请输入金额" :min="1" :max="10000" label="发放金额"></el-input-number>
            </el-form-item>   
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addPanutGrant()">确 定</el-button>
			</span>
		</el-dialog> 
  </div>
</template>

<script>
  import baseMixin from '@/mixins/baseMixin';
  import mixins from '@/mixins/windowResize';
  import {getSchoolTimeList} from '@/api/record';
  import {getPanutGrantThList,addPanutGrant} from '@/api/peanut';
  export default {
    name: "documentFlowIndex",
    data() {
      return {
        userName: '',
        schoolName: '',
        schoolTimeCode: '',
        schoolYearList: [],
        dataList: [],
        dialogVisible:false,
        ruleForm: {
          content: '',
          num:undefined,
          userScope:{userList:[]}
        },
        listLoading:false,
        rules: {
          content: [
            {required: true, message: '请输入事由', trigger: 'blur'}
          ],
          num:[{ required: true, message: "请输入发放金额", trigger: "change" }],
        },
      }
    },
    mixins: [baseMixin, mixins],
    created() {
      this.getSchoolTimeList();
    },
    methods: {
         addPanutGrant() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let query = {
              userScope: this.ruleForm.userScope,
              content: this.ruleForm.content,
              num:this.ruleForm.num,
              status:1
            };
             addPanutGrant(query).then(res => {
              if (res.data.code === 200 && res.data.result) {
                this.$message.success('发放成功');
                this.dialogVisible = false;
                this.getStatistics()
              } else {
                this.$message.warning(res.data.msg);
                this.dialogVisible = false;
                this.getStatistics()
              }
            })
          }
        })
      },
       popfun(obj){
         this.ruleForm={
          content: '',
          num:undefined,
          userScope:{userList:[{id:obj.userId,name:obj.userName}]}
        }
        this.dialogVisible=true
      },
      peanutadd() {
        this.$router.push({path: 'peanutadd'});
      },
      peanutthinfo(obj) {
        this.$router.push({path: 'peanutthinfo',query:{
            schoolTimeId:this.schoolTimeCode,
            batchUserId:obj.userId
        }});
      },
      changeSchool(val) {
        const self = this;
        this.schoolName = val;
        this.schoolYearList.forEach((item) => {
          if (item.schoolTimeName === val) {
            self.schoolTimeCode = item.id;
          }
        });
         this.getStatistics()
      },
      getSchoolTimeList() {
        getSchoolTimeList().then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.schoolYearList = data;
            data.forEach((item) => {
              if (item.isCurrent === 1) {
                this.schoolName = item.schoolTimeName;
                this.schoolTimeCode = item.id;
              }
            });
            if(!this.schoolTimeCode){
                this.schoolTimeCode=this.schoolYearList[0].id
            }
            this.getStatistics()
          }
        }).catch();
      },
      getStatistics() {
       let query = {
          userName: this.userName,
          schoolTimeId: this.schoolTimeCode
        };
        this.getPanutGrantThList(query);
      },
      getPanutGrantThList(query) {
        getPanutGrantThList(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {           
            this.dataList = data.data;
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .peanutindex {
    .header {
      padding: 12px 12px 10px 12px;
    }

    .doc_flow_table_box {
      padding: 0 15px 15px 15px;
      margin: 0 auto;
      .name_title{
        color: #409eff;
        cursor: pointer;
      }
    }
  }
</style>
