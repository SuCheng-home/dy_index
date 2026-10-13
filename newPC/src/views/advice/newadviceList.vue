<template>
    <div class="advice_list_wrap">
        <div class="header">
            <el-row>
                <el-col :span="19">
                     <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                            @change="changeAdviceType()"></el-date-picker>
                   
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" placeholder="请输入建议内容" v-model.trim="adviceContent" :maxlength="500"
                              @keyup.enter.native="getStatistics">
                        <el-button size="medium" slot="append" icon="el-icon-search" @click="getStatistics" :loading="searchLoading"></el-button>
                    </el-input>
                </el-col>
            </el-row>
           
        </div>
        <div class="advice_table_wrap">
            <el-table stripe :data="dataList" style="width: 100%" border highlight-current-row  :height="maxH">
                <el-table-column label="建议内容" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span @click="toAdviceInfo(scope.row.id)" class="advice_content">{{scope.row.adviceContent}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="建议类型" prop="typeName" show-overflow-tooltip width="160px"></el-table-column>
                <el-table-column label="姓名" width="160px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="建议时间" width="160px">
                    <template slot-scope="scope">
                        <span>{{(scope.row.createTime) | formatTimeMap}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否回复" width="100px">
                    <template slot-scope="scope">
                        <span>{{(scope.row.status === 1) ? '已回复' : '未回复'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否公开" width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status===0"></span>
                        <span v-else>{{scope.row.isPublic === 1 ? '公开' : '未公开'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="处理人" prop="batchUserName" width="100px"></el-table-column>
                <el-table-column label="处理时间" width="160px">
                    <template slot-scope="scope">
                        <span>{{(scope.row.updateTime) | formatTimeMap}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160px">
                   <template slot-scope="scope">
                         <span v-if="scope.row.status==0||scope.row.status==3">
                            <el-button type="text" size="small"  @click="replayAdviceDialog(scope.row.id)" >回复</el-button>
                            <el-button type="text" size="small"  @click="ignoreAdvice(scope.row.id)" >忽略</el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="40%">
            <el-form :model="ruleForm" class="card-dialog-padding" :rules="rules" ref="ruleDialogForm" label-width="80px">
                <el-form-item label="回复信息" prop="replyContent">
                    <el-input type="textarea" :rows="4" v-model.trim="ruleForm.replyContent" :maxlength="500" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureDialog()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {findAdviceTypeListByRole, findAdviceListByRole,batchAdvice,updateAdviceIsPublic,turnToAdviceMsg,turnToAdvice} from '@/api/advice';
   import AddressBook from '@/components/AddressBook/indexExpand';
    import {getSchoolTimeAllList} from "@/api/schedule";
    export default {
        name: "adviceList",
        data() {
            return {
                searchLoading: false,
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                typeSelect: 0,
                typeList: [],
                adviceContent: '',
                dataList: [],
                dialogVisible:false,
                ruleForm:{
                    replyContent:''
                },
                rules:{
                    replyContent: [
                        {required: true, message: '请填写回复内容！', trigger: 'blur'},
                    ]
                },
                id:'',
                 activityScopeData: {
                    title: "交办",
                    depart: { target: "user", departType: "t", userTypes: "1",notCheckSchool: true},
                    group: false,
                    SingleChose: true,
                },
                addressData:{},
                  daterange: ['', ''],
            }
        },
        filters: {
            formatTimeMap(type) {
                if (type) {
                    return type.substring(0,19);
                }
                return '-';
            }
        },
        mixins: [mixins],
        components: { AddressBook},
         watch:{
    addressData(addressData){
      if(addressData.departList.length !== 0||addressData.userList.length !== 0||addressData.groupList.length !== 0) {
        const addressNextData={
          userJson:[],
          groupJson:[],
          departJson:[]
        };
        turnToAdvice({
          id:this.id,//	周食谱id	number	
          managerUserIds:addressData.userList.map(item => item.id).join(','),
          managerUserNames:addressData.userList.map(item => item.name).join(','),
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
              type: "success",
              message: "交办成功!"
            });
             this.findAdviceTypeListByRole();
          }else{
            this.$message({
              type: "error",
              message: "交办失败!请稍后重试!谢谢!"
            });
          }
          this.addressData={
          userJson:[],
          groupJson:[],
          departJson:[]
        };
        }).catch(()=>{
          this.$message({
              message: `${data.msg}`,
              type: 'error'
          });
        })
      }else {
        this.$message.error("请选择交办人员！");
      }
    },},
        created() {
             getSchoolTimeAllList().then(res => {
                let data = res.data.data;
                for (let item of data) {
                    if (item.isCurrent == 1) {
                        if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.daterange = [new Date(),item.startDate];
                            }else{
                              this.daterange = [item.startDate,new Date()];
                            }
                       this.findAdviceTypeListByRole();
                    }
                }
            }).catch(err => {
            });
            //根据类型Id及建议内容学校id查询建议列表
          
        },
        methods: {
            turnToAdviceMsg(obj){
              turnToAdviceMsg({
          id:obj.id,//	周食谱id	number	
          managerUserIds:obj.managerUserIds,
          managerUserNames:obj.managerUserNames
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
              type: "success",
              message: "催办成功!"
            });
          }else{
            this.$message({
              type: "error",
              message: "催办失败!请稍后重试!谢谢!"
            });
          }
        }).catch(()=>{
          this.$message({
              message: `${data.msg}`,
              type: 'error'
          });
        })
            },
            // 是否公开操作
            checkAdviceIsPublicFunc(isPublic,id){
                const publicText = isPublic ? '公开' : '取消公开';
                this.$confirm(`是否${publicText}此建议？`, '删除', {
                    type: 'warning'
                }).then(() => {
                    this.id=id;
                    updateAdviceIsPublic({
                        id: this.id,
                        isPublic: isPublic
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.code===200) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功！'
                                });
                                this.getStatistics();
                            }
                        });
                }).catch(() => {
                });

            },
            replayAdviceDialog(id){
                //回复
                this.id=id;
                this.dialogVisible=true;
            },
            sureDialog(){
                this.$refs.ruleDialogForm.validate((valid) => {
                    if(valid){
                       this.batchAdviceFunc(1);
                       this.dialogVisible=false;
                    }
                })
            },
            batchAdviceFunc(status){
                //回复

                const dealContent = (status === 2) ? '' : this.ruleForm.replyContent;
                batchAdvice({
                    dealContent: dealContent,
                    id: this.id,
                    status: status
                }).then(res=>res.data)
                .then(data=>{
                    if(data.code===200){
                        this.$message({
                            type: 'success',
                            message: '操作成功！'
                        });
                        this.getStatistics();
                    }else{
                        this.$message({
                            type: 'error',
                            message: data.msg
                        });
                    }
                }).catch(()=>{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    });
                })
            },
            ignoreAdvice(id){
                //忽略
                this.$confirm("是否忽略此建议？", '删除', {
                    type: 'warning'
                }).then(() => {
                    this.id=id;
                    this.batchAdviceFunc(2);
                }).catch(() => {
                });
            },
            toAdviceInfo(id) {
                this.$router.push({path: 'info', query: {id: id,type:1}});
            },
            changeAdviceType() {
                this.adviceContent = '';
                this.getStatistics();
            },
            findAdviceTypeListByRole() {
                let self = this;
                findAdviceTypeListByRole().then(res => {
                    if (JSON.parse(JSON.stringify(res.data)).code === 200) {
                        JSON.parse(JSON.stringify(res.data)).data.forEach((item) => {
                            let query = {};
                            query.label = item.typeName;
                            query.value = item.id.toString();
                            self.typeList.push(query);
                        });
                        // self.typeSelect = self.typeList[0].value || null;
                        self.getStatistics();
                    }
                }).catch();
            },
            getStatistics() {
                let query = {
                    adviceContent: this.adviceContent,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    typeId: this.typeSelect,
                    startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                    endDate:moment(this.daterange[1]).format('YYYY-MM-DD'),
                    userId:this.$store.getters.userInfo.id
                };

                this.findAdviceListByRole(query);
            },
            findAdviceListByRole(query) {
                this.searchLoading = true;
                findAdviceListByRole(query).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dataList = data.dataList;
                        this.pagination.total = data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                    this.searchLoading = false;
                }).catch(() => {
                    this.searchLoading = false;
                });
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getStatistics();
            },
            currentChangeHandler() {
                this.getStatistics();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .advice_list_wrap{
        padding:12px;
        .header{
            padding-bottom: 10px;
            margin-bottom:0 !important;
        }
        .advice_table_wrap{
            margin: 0 auto;
            .advice_content{
                color: #409eff;
                cursor: pointer;
            }
        }
    }
</style>
