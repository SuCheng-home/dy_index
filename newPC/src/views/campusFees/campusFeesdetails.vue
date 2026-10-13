<template>
  <div class="campusFeesdetails">
    <backtool>
      <el-select
        style="width:120px;"
        class="filter-item btnLeftLine"
        v-model="query.classId"
        placeholder="请选择班级"
        @change="changeclass()"
        size="medium"
      >
        <el-option
          v-for="item in classlist"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
          </el-option>
          </el-select> 
      <el-button v-if="num==1||num==3||num==5"  type="primary"  size="medium" @click="sendToCheck()">提交审核</el-button>
       
      <template v-if="num==4">              
          <el-button  type="primary"  size="medium"  @click="newrefundlist(1)"  v-if="!allend&&isExhibition&&(!isSorting)" >退款</el-button>
          <el-button  type="primary"  size="medium"  @click="updateChargenoticeWithd()"  v-if="timefun(dataname.deadlineTime)&&isExhibition&&(isSorting)" >清分</el-button>
          <el-button  type="primary"  size="medium"  @click="newReissueadd(1)" v-if="!timefun(dataname.deadlineTime)">补发</el-button>
          <!-- <address-book
            v-model="addressData"
            :config="configData" v-if="payUserType==0"
            :isbutton="true"
          >补发</address-book> -->
           
                <!-- <a
                  :href="mydownLoadHref"
                  target="_blank"
                  download="examName"
                  v-if="!allend&&isExhibition"
                >
                  <el-button
                    type="primary"
                    size="medium"
                  >退款模版</el-button>
                    </a>
                    <el-upload
                      class="upload-import"
                      :action="uploadPath"
                      v-if="!allend&&isExhibition"
                      :data="uploadData"
                      :show-file-list='false'
                      accept=".xls"
                      :before-upload="beforeAvatarUpload"
                      :on-success="handleAvatarSuccess"
                    >
                      <el-button
                        type="primary"
                        size="medium"
                      >导入退款</el-button>
                        </el-upload> -->
                        <el-button v-if="!timefun(dataname.deadlineTime)"
                          type="primary"
                          @click="updateRemindUnPayeds()"
                          size="medium"
                        >提醒未缴费家长</el-button>
                          <el-button
                            type="primary"
                            @click="campusFeesclasslist()"
                            v-if="isShowByPermission('/chargeNotice/queryChargeStaticGroupByClass')"
                            size="medium"
                          >按班级统计</el-button>
                            <el-button
                              type="primary"
                              @click="refunddetails()"
                              v-if="isShowByPermission('/chargeNotice/queryRefundList')"
                              size="medium"
                            >退费明细</el-button>
                              <el-button type="primary" @click="refreshOrderbatch()" size="medium">批量刷新</el-button>
                               <el-button  type="primary"  size="medium"  @click="printReceipts()"  v-if="!allend&&isExhibition&&(!isSorting)" >打印收据</el-button>
                            </template>
                             <a
              :href="downLoadHref"
              target="_blank"
              download="examName"  v-if="dateList.length"
            >
              <el-button
                type="primary"
                size="medium"
              >导出名单</el-button>
                </a>
              
                              <div class="el-input-box">
                                <el-input
                                  placeholder="姓名/学号/订单号"
                                  v-model.trim="query.searchVal"
                                  @change="handleInputChange"
                                  size="medium"
                                >
                                  <el-button
                                    slot="append"
                                    icon="el-icon-search"
                                    @click="handleInputChange"
                                  ></el-button>
                                    </el-input>
                              </div>
    </backtool>
    <div
      class="time-table"
      v-loading.body="listLoading"
    >
      <div class="box-top">
        <!-- <div class="top">交费总览</div> -->
        <h1>{{dataname.chargeName}}
          <i
            class="el-icon-menu"
            @click="dialogVisible = true"
          ></i>
            <span class="p"> 落款部门：
              <span class="red">{{dataname.inscription}}</span>
              <span
                class="red"
                v-if="!dataname.inscription"
              >暂无</span>
            截止时间：
            <span class="red">{{dataname.deadlineTime}}
              <i
                class="el-icon-edit"
                v-if="dataname.deadlineTime&&userInfo.id==createUserId"
                @click="mydialogVisibletime=true"
              ></i>
                <span
                  class="red"
                  v-if="!dataname.deadlineTime"
                >无限制</span>
            </span>
            </span>
        </h1>
      </div>
      <el-table
        stripe
        :data="dateList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :height="maxH-46"
      >
        <el-table-column
          label="学号"
          show-overflow-tooltip
          width='100'
        >
          <template slot-scope="scope">
            <span>{{scope.row.learnNum}}</span>
          </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="姓名"
            width='100'
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.studentName}}</span>
            </template>
            </el-table-column>
            <el-table-column
              label="班级"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{scope.row.className}}</span>
              </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="应缴金额"
                width='90'
              >
                <template slot-scope="scope">
                  <span>{{scope.row.payMoney}}</span>
                </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="已缴金额"
                  width='90'
                >
                  <template slot-scope="scope">
                    <span v-if="(scope.row.status!=0)&&(scope.row.status!=3)">{{scope.row.payMoney}}</span>
                    <span v-else>0</span>
                  </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="缴费状态"
                    width='120'
                    :filtered-value="schoolfilteredValue"
                    :filter-multiple='false'
                    :filters="[{ text: '线上缴费', value: '1'},{ text: '线下缴费', value: '2'}, { text: '未缴费', value: '0' }, { text: '免缴', value: '3' },{ text: '退款', value: '4' }]"
                  >
                    <template slot-scope="scope">
                      <el-tag  size="mini"
                        type="danger"
                        v-if="scope.row.status==0"
                      >未缴费</el-tag>
                        <el-tag  size="mini"
                          type="success"
                          v-if="scope.row.status==1"
                        >
                          线上支付
                          </el-tag>
                          <el-tag  size="mini"
                            type="success"
                            v-if="scope.row.status==2"
                          >线下补缴</el-tag>
                            <el-tag  size="mini"
                              type="warning"
                              v-if="scope.row.status==3"
                            >免缴</el-tag>
                              <el-tag  size="mini"
                                v-if="scope.row.status==4"
                              >已退款</el-tag>
                    </template>
                    </el-table-column>
                    <el-table-column
                      label="订单号"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span>{{scope.row.orderId}}</span>
                      </template>
                      </el-table-column>
                      <el-table-column
                        label="缴费时间"
                        width="160"
                      >
                        <template slot-scope="scope">
                          <span>{{scope.row.payTime}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column label="退款">
                          <template slot-scope="scope">
                            <span v-if="scope.row.refundMoney!='0.00'">{{scope.row.refundMoney}}</span>
                          </template>
                        </el-table-column>
                         <el-table-column label="结余金额">
                          <template slot-scope="scope">
                            <span>{{scope.row.balance}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          label="操作"
                          width="260"
                        >
                          <template slot-scope="scope">
                            <el-button  v-if="(dataname.status==1)||(!scope.row.orderId&&scope.row.status==0)" @click.native.prevent="newmydialogVisibleonefun(scope.row)"  type="text" size="small">编辑金额</el-button>
                         
                          <span v-if="dataname.status!=1">
                             <el-button   v-if="(!allend&&isExhibition&&(!isSorting))&&(scope.row.status==1||scope.row.status==4)"  @click.native.prevent="dialogVisibles(scope.row.id,scope.row.payMoney)"  type="text" size="small">退款</el-button>
                                                                        
                         <el-button v-if="scope.row.status==0" @click.native.prevent="chargeNoticeOffLinePays(scope.row.studentId,3,'免缴')"  type="text" size="small">免缴</el-button>
                        
                         <el-button v-if="scope.row.status==0" @click.native.prevent="chargeNoticeOffLinePays(scope.row.studentId,2,'线下补缴')"  type="text" size="small">线下补缴</el-button>
                         
                         <el-button v-if="(scope.row.status==0)&&(scope.row.orderId)"  @click.native.prevent="queryOrderTradeByOrderNo(scope.row.orderId)" type="text" size="small" >刷新</el-button>
                       <el-button v-if="(scope.row.status==0)&&(scope.row.orderId)"  @click.native.prevent="clearOrderNo(scope.row.id)" type="text" size="small" >清除</el-button>
                         <el-button v-if="(scope.row.status==2||scope.row.status==3)"  @click.native.prevent="updateCancelStatus(scope.row.id)" type="text" size="small" >重置</el-button>
                         </span>
                          <el-button v-if="(scope.row.status==0)&&(!scope.row.orderId)" @click.native.prevent="deleteChargeNoticeUsers(scope.row.id)"  type="text" size="small"  class="buttontextred">删除</el-button>
                        </template>
                          </el-table-column>
                          </el-table>
  </div>
  <el-dialog title="修改金额"   :visible.sync="newmydialogVisibleone" width="40%">
            <el-form :model="ruleFormtwo" :rules="rulestwo" ref="ruleFormtwo" label-width="100px" class="demo-ruleForm">              
                <el-form-item label="姓名" >
                   {{ruleFormtwo.name}}
                </el-form-item>
                 <el-form-item label="修改金额"  prop="fee" >
                      <el-input v-model.trim="ruleFormtwo.fee" :min="0" type="number" :maxlength='4'  placeholder='请输入修改金额'  ></el-input>
                     </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newmydialogVisibleone = false">取 消</el-button>
                <el-button type="primary" @click="updateChargeNoticeUserFee('ruleFormtwo')">确 定</el-button>
            </span>
        </el-dialog>
  <el-dialog
    title="收费内容"
    :visible.sync="dialogVisible"
  >
    <div
      class="content-box"
      v-html="content"
    ></div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
          </span>
          </el-dialog>
          <el-dialog
            title="退款"
            :visible.sync="mydialogVisibles"
          >
            <div
              class="content-box"
              v-html="mydataname"
            ></div>
              <span
                slot="footer"
                class="dialog-footer"
              >
                <el-button
                  type="primary"
                  @click="mydialogVisibles = false"
                >确 定</el-button>
                  </span>
                  </el-dialog>
                  <el-dialog
                    title="退款"
                    :visible.sync="mydialogVisibleone"
                    width="40%"
                  >
                    <el-form
                      :model="ruleForm"
                      :rules="rules"
                      ref="ruleForm"
                      label-width="100px"
                      class="demo-ruleForm"
                    >
                      <el-form-item
                        label="退款金额"
                        prop="refundMoney"
                      >
                        <el-input
                          v-model.trim="ruleForm.refundMoney"
                          :min="0"
                          type="number"
                          :maxlength='4'
                          placeholder='请输入退款金额'
                        ></el-input>
                          </el-form-item>
                          <el-form-item
                            label="退款说明"
                            prop="refundRemark"
                          >
                            <el-input
                              type="textarea"
                              v-model.trim="ruleForm.refundRemark"
                              :maxlength="100"
                            ></el-input>
                              </el-form-item>
                              </el-form>
                              <span
                                slot="footer"
                                class="dialog-footer"
                              >
                                <el-button @click="mydialogVisibleone = false">取 消</el-button>
                                <el-button
                                  type="primary"
                                  @click="submitForm('ruleForm')"
                                >确 定</el-button>
                                  </span>
                                  </el-dialog>
                                  <el-dialog
                                    title="修改截止时间"
                                    :visible.sync="mydialogVisibletime"
                                    width="40%"
                                  >
                                    <el-form
                                      label-width="100px"
                                      class="demo-ruleForm"
                                    >
                                      <el-form-item label="截止时间">
                                        <el-date-picker
                                          v-model.trim="deadlineTime"
                                          :clearable="false"
                                          :editable="false"
                                          type="date"
                                          placeholder="选择截止时间"
                                        ></el-date-picker>
                                      </el-form-item>
                                      </el-form>
                                      <span
                                        slot="footer"
                                        class="dialog-footer"
                                      >
                                        <el-button @click="mydialogVisibletime = false">取 消</el-button>
                                        <el-button
                                          type="primary"
                                          @click="updateDeadlineTimeByIds()"
                                        >确 定</el-button>
                                          </span>
                                          </el-dialog>
                                          <div class="pagination-container">
                                            <el-pagination
                                              @size-change="handleSizeChange"
                                              @current-change="handleCurrentChange"
                                              :current-page.sync="query.pageNo"
                                              :page-sizes="[10,20,30, 50]"
                                              :page-size="query.pageSize"
                                              layout="total, sizes, prev, pager, next, jumper"
                                              :total="total"
                                            >
                                              </el-pagination>
                                          </div>
                                          </div>
</template>
<script>
import {
  queryDeadlineTimeChargeNotice,sendToCheck,
  updateDeadlineTimeById,
  queryChargeNoticeStatic,
  queryChargeNoticeDetailList,
  chargeNoticeOffLinePay,
  queryChargeNoticeDetail,
  updateRefund,
  updateRemindUnPayed,
  deleteChargeNoticeUser,queryOrderTradeByOrderNo,refreshOrderbatch,clearOrderNo,
  updateChargeNoticeReissue,queryAbcMerchNonNonAbcAccout,queryAbcsubmerh,updateChargenoticeWithd,updateChargeNoticeUserFee,updateCancelStatus
} from "@/api/campusFees";
import AddressBook from "@/components/AddressBook/indexExpand";
import Backtool from "@/components/BackTool";
import _ from "lodash";
import mixin from "@/mixins/windowResize";
import { isShowByPermission } from "@/utils";
import { mapGetters } from "vuex";
export default {
  name: "campusFeesdetails",
  data: function() {
    return {
      num:this.$route.query.num,
      schoolfilteredValue: [], //过滤标签
      uploadPath: global.BasePath + "chargeNotice/updateBatchRefund",
      uploadData: {
        testExamId: this.$route.query.id,
        token: this.$store.getters.token,
        chargeType: 1
      },
      dateList: [], //表格主题数据
      classlist: [{ name: "全部班级", id: "0" }], //班级
      total: null,
      dataname: {}, //总览数据
      dialogVisible: false,
      mydialogVisibleone: false,
      mydialogVisibles: false,
      mydataname: "",
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        searchVal: "",
        chargeId: this.$route.query.id,
        classId: "0",
        status: "",
        mystatus: 9
      },
      content: "",
      downLoadHref:"",
      mydownLoadHref:
        global.BasePath +
        "chargeNotice/refundtTemplateDownload?chargeId=" +
        this.$route.query.id +
        "&token=" +
        this.$store.getters.token,
      listLoading: false,
      ruleForm: {
        refundMoney: "",
        refundRemark: ""
      },
      rules: {
        refundMoney: [
          {
            required: true,
            message: "请填写大于零的退款金额且不能大于缴费金额",
            trigger: "blur"
          }
        ],
        refundRemark: [
          { required: true, message: "请填写退款说明", trigger: "blur" }
        ]
      },
      myid: "",
      payMoney: "",
      mydialogVisibletime: false,
      deadlineTime: "",
      createUserId: "",
      allend: false,
      addressData: {},
      configData: {
        title: "选择补发人群",
        depart: {
          target: "all",
          departType: "s",
          userTypes: "2",
          group: "show", notCheckSchool: true
        },
        group: false
      },
      payUserType:1,
      isExhibition:true,
      isSorting:false,
      istime:false,
      newmydialogVisibleone:false,
      ruleFormtwo: {
        fee: "",
        uid: "",
        name:"",
        cid:this.$route.query.id
      },
      rulestwo: {
        fee: [
          {
            required: true,
            message: "请填写修改的金额",
            trigger: "blur"
          }
        ],
      },
    };
  },
  components: {
    Backtool,
    AddressBook
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    schoolfilteredValue: function(val) {
      //幼儿园组织架构中筛选
      this.query.pageNo = 1;
      if (val.length == 0) {
        //如果是全部
        this.query.mystatus = 9;
      } else {
        this.query.mystatus = val[0];
      }

      this.changeclass();
    },
    addressData(addressData) {
      if (
        addressData.departJson.length !== 0 ||
        addressData.userJson.length !== 0 ||
        addressData.groupJson.length !== 0
      ) {
        let deptids="";
        let uids="";
        for(let i=0;i<addressData.departJson.length;i++){
          if(i<addressData.departJson.length-1){
            deptids=deptids+addressData.departJson[i].id+",";
          }else{
            deptids=deptids+addressData.departJson[i].id;
          }
        }
        for(let i=0;i<addressData.userJson.length;i++){
          if(i<addressData.userJson.length-1){
            uids=uids+addressData.userJson[i].id+",";
          }else{
            uids=uids+addressData.userJson[i].id;
          }
        }
        updateChargeNoticeReissue({
          deptids: deptids,
          noticeId: this.$route.query.id,
          uids: uids
        })
          .then(res => res.data)
          .then(data => {
            if (data.code === 200) {
              this.$message({
                type: "success",
                message: "补发成功!"
              });
              this.createdfun();
            } else {
              this.$message({
                type: "error",
                message:data.msg
              });
            }
          })
          .catch(() => {
            this.$message({
              message: `${data.msg}`,
              type: "error"
            });
          });
      } else {
        this.$message.error("请选择补发人员！");
      }
    }
  },
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    this.createdfun();   
  },
  methods: {
     timefun(time){
                    let currentTime = new Date(); // 获取当前时间
                    let inputTime = new Date(time+' 23:59:59'); // 将传入的时间转换为Date对象                
                    if (currentTime > inputTime) {
                      return true;
                    } else if (currentTime < inputTime) {
                       return false;
                    } else {
                       return false;
                    }
            },
      refreshOrderbatch() {
      this.$confirm("是否进行批量刷新操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          refreshOrderbatch(this.query.chargeId)
            .then(res => {
              this.$message({
                type: "success",
                message: "批量刷新成功！"
              });
              //获取校园收费总览
              queryChargeNoticeStatic(this.query.chargeId).then(res => {
                this.dataname = res.data.data;
                this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
              });
              this.queryChargeNoticeDetailLists();
            })
            .catch();
        })
        .catch(() => {});
    },
     sendToCheck(){
      this.$confirm("是否提交审核?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          sendToCheck(this.query.chargeId)
            .then(res => {
              this.$message({
                type: "success",
                message: "提交审核成功！"
              });
              this.num=2;
               //获取校园收费总览
              queryChargeNoticeStatic(this.query.chargeId).then(res => {
                this.dataname = res.data.data;
                this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
              });
              this.queryChargeNoticeDetailLists();
              
            })
            .catch();
        })
        .catch(() => {});
    },
    clearOrderNo(id) {
      this.$confirm("是否进行清除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          clearOrderNo(id)
            .then(res => {
              if(res.data.result){
                 this.$message({
                type: "success",
                message: res.data.msg
              });
              }else{
                 this.$message.error(res.data.msg);
              }
             
              //获取校园收费总览
              queryChargeNoticeStatic(this.query.chargeId).then(res => {
                this.dataname = res.data.data;
                this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
              });
              this.queryChargeNoticeDetailLists();
            })
            .catch();
        })
        .catch(() => {});
    },
     updateCancelStatus(id) {
      this.$confirm("是否进行重置操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          updateCancelStatus(id)
            .then(res => {
              this.$message({
                type: "success",
                message: "重置成功！"
              });
              //获取校园收费总览
              queryChargeNoticeStatic(this.query.chargeId).then(res => {
                this.dataname = res.data.data;
                this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
              });
              this.queryChargeNoticeDetailLists();
            })
            .catch();
        })
        .catch(() => {});
    },
     newmydialogVisibleonefun(obj){
         this.newmydialogVisibleone=true;
         this.ruleFormtwo.name=obj.studentName;
         this.ruleFormtwo.fee=obj.payMoney-0;
         this.ruleFormtwo.uid=obj.studentId;
    },
    updateChargeNoticeUserFee(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.newmydialogVisibleone = false;
          updateChargeNoticeUserFee(this.ruleFormtwo)
            .then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "编辑金额成功！"
                });
                  //获取校园收费总览
                  queryChargeNoticeStatic(this.query.chargeId).then(res => {
                    this.dataname = res.data.data;
                    this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
                  });
                this.queryChargeNoticeDetailLists();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch();
        }
      });
    },
    createdfun(){
        this.queryDeadlineTimeChargeNotices();
    //获取校园收费总览
    queryChargeNoticeStatic(this.query.chargeId).then(res => {
      this.dataname = res.data.data;
      this.deadlineTime = res.data.data.deadlineTime;
      this.createUserId = res.data.data.createUserId;
      this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
    });
    //校园收费通知详情
    queryChargeNoticeDetail(this.query.chargeId).then(res => {
       this.content = res.data.data.charge.content;
       this.payUserType = res.data.data.charge.payUserType;
    });
      queryAbcsubmerh(this.query.chargeId).then(res => {
        if(res.data.data){
           this.isSorting=res.data.data;
        }
     
    });
    // queryAbcMerchNonNonAbcAccout(this.query.chargeId).then(res => {
    //   this.isExhibition=!res.data.data;
    // });
    this.queryChargeNoticeDetailLists();
    //获取班级
    queryChargeNoticeDetailList(this.query).then(res => {
      let data = res.data.data;
      for (let i = 0; i < data.classModelList.length; i++) {
        this.classlist.push(data.classModelList[i]);
      }
    });
    },
    //修改时间
    updateDeadlineTimeByIds() {
      this.deadlineTime = this.$moment(this.deadlineTime).format("YYYY-MM-DD"); //时间
      updateDeadlineTimeById(this.deadlineTime, this.query.chargeId).then(
        res => {
          let data = res.data;
          if (data.code === 200) {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.mydialogVisibletime = false;
            this.dataname.deadlineTime = this.deadlineTime;
            this.queryDeadlineTimeChargeNotices();
            this.istime=((new Date()).getTime())>((new Date(this.deadlineTime+" 23:59:59")).getTime())
          }
        }
      );
    },
    queryDeadlineTimeChargeNotices() {
      queryDeadlineTimeChargeNotice().then(res => {
        let data = res.data.data;
        this.allend = !data;
      });
    },
    queryOrderTradeByOrderNo(id) {
      this.$confirm("是否进行刷新操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          queryOrderTradeByOrderNo(id)
            .then(res => {
              this.$message({
                type: "success",
                message: "刷新成功！"
              });
              //获取校园收费总览
              queryChargeNoticeStatic(this.query.chargeId).then(res => {
                this.dataname = res.data.data;
                this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
              });
              this.queryChargeNoticeDetailLists();
            })
            .catch();
        })
        .catch(() => {});
    },
    //删除校园收费
    deleteChargeNoticeUsers(id) {
      this.$confirm("是否进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          deleteChargeNoticeUser(this.query.chargeId, id)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              //获取校园收费总览
              queryChargeNoticeStatic(this.query.chargeId).then(res => {
                this.dataname = res.data.data;
                this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
              });
              this.queryChargeNoticeDetailLists();
            })
            .catch();
        })
        .catch(() => {});
    },
     //1清分
    updateChargenoticeWithd() {   
      this.$router.push({
        path: "campusFeesqingfenlist",
        query: { id: this.query.chargeId }
      });
      // this.$confirm("是否进行清分操作?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "info"
      // })
      //   .then(() => {
      //     updateChargenoticeWithd(this.query.chargeId)
      //       .then(res => {
      //         this.$message({
      //           type: "success",
      //           message: "清分成功！"
      //         });
      //         //获取校园收费总览
      //         queryChargeNoticeStatic(this.query.chargeId).then(res => {
      //           this.dataname = res.data.data;
      //          this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
      //         });
      //         this.queryChargeNoticeDetailLists();
      //       })
      //       .catch();
      //   })
      //   .catch(() => {});
    },
    isShowByPermission,
    handleInputChange() {
      this.queryChargeNoticeDetailLists();
    },
    queryChargeNoticeDetailLists() {
      if (this.query.mystatus == 9) {
        this.query.status = "";
      } else {
        this.query.status = this.query.mystatus;
      }
      this.downLoadHref=
        global.BasePath +
        "chargeNotice/getChargeNoticeDetailListExport?chargeId=" +
        this.$route.query.id +
         "&status=" +
        this.query.status+
        "&classId=" +
        this.query.classId+
         "&searchVal=" +
        this.query.searchVal+
        "&token=" +
        this.$store.getters.token;//导出全部名单
      queryChargeNoticeDetailList(this.query).then(res => {
        let data = res.data.data;
        this.dateList = data.dataList;
        this.total = data.pagination.total;
      });
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.queryChargeNoticeDetailLists();
    },
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.queryChargeNoticeDetailLists();
    },
    //弹框
    dialogVisibles(id, payMoney) {
      this.mydialogVisibleone = true;
      this.myid = id;
      this.payMoney = payMoney;
    },
    //退款
    submitForm(formName) {
      if (this.ruleForm.refundMoney / 1 < 0) {
        this.ruleForm.refundMoney = "";
      }
      if (this.payMoney < this.ruleForm.refundMoney / 1) {
        this.ruleForm.refundMoney = "";
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.mydialogVisibleone = false;
          updateRefund(
            this.query.chargeId,
            this.ruleForm.refundMoney,
            this.ruleForm.refundRemark,
            this.myid
          )
            .then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "退款申请成功！"
                });
                (this.ruleForm.refundMoney = ""),
                  (this.ruleForm.refundRemark = ""),
                  //获取校园收费总览
                  queryChargeNoticeStatic(this.query.chargeId).then(res => {
                    this.dataname = res.data.data;
                    this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
                  });
                this.queryChargeNoticeDetailLists();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch();
        }
      });
    },
    //补缴
    chargeNoticeOffLinePays(id, num, name) {
      this.$confirm("是否进行" + name + "操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          chargeNoticeOffLinePay(this.query.chargeId, id, num)
            .then(res => {
              this.$message({
                type: "success",
                message: name + "成功！"
              });
              //获取校园收费总览
              queryChargeNoticeStatic(this.query.chargeId).then(res => {
                this.dataname = res.data.data;
               this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
              });
              this.queryChargeNoticeDetailLists();
            })
            .catch();
        })
        .catch(() => {});
    },
    updateRemindUnPayeds() {
      this.$confirm("是否提醒未缴费家长?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          updateRemindUnPayed(this.query.chargeId).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "提醒成功！"
              });
            }
          });
        })
        .catch(() => {});
    },
    //切换班级 类型
    changeclass() {
      this.queryChargeNoticeDetailLists();
      //获取校园收费总览
      queryChargeNoticeStatic(this.query.chargeId).then(res => {
        this.dataname = res.data.data;
        this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
      });
    },
    //导入
    handleAvatarSuccess(res) {
      if (res.code == 200) {
        this.$message({
          message: "导入成功，共导入"+res.data.total+"条！",
          type: "success"
        });
        this.listLoading = false;
        //获取校园收费总览
        queryChargeNoticeStatic(this.query.chargeId).then(res => {
          this.dataname = res.data.data;
          this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
        });
        this.queryChargeNoticeDetailLists();
      } else {
        this.mydialogVisibles = true;
        this.mydataname = res.msg;
        this.listLoading = false;
        queryChargeNoticeStatic(this.query.chargeId).then(res => {
          this.dataname = res.data.data;
          this.istime=((new Date()).getTime())>((new Date(res.data.data.deadlineTime+" 23:59:59")).getTime())
        });
        this.queryChargeNoticeDetailLists();
      }
    },
    beforeAvatarUpload(file) {
      let suffix = file.name.split(".")[file.name.split(".").length - 1];
      if (suffix !== "xls") {
        this.$message.error("请上传后缀为.xls的模版文件!");
        return false;
      } else {
        this.listLoading = true;
      }
    },
    //班级统计
    campusFeesclasslist() {
      this.$router.push({
        path: "campusFeesclasslist",
        query: { id: this.query.chargeId }
      });
    },
    newReissueadd(num) {
      this.$router.push({
        path: "newReissueadd",
        query: { id: this.query.chargeId,num:num}
      });
    },
    newrefundlist(num) {
      this.$router.push({
        path: "newrefundlist",
        query: { id: this.query.chargeId,num:num}
      });
    },
    printReceipts() {
      this.$router.push({
        path: "printReceipts",
        query: { id: this.query.chargeId,chargeName:this.dataname.chargeName,createUserName:this.dataname.createUserName}
      });
    },
    //退费明细
    refunddetails() {
      this.$router.push({
        path: "refunddetails",
        query: { id: this.query.chargeId, is: 2 }
      });
    }
  }
};
</script>
<style scoped >
.campusFeesdetails .box-top .p {
  font-size: 14px;
}
.campusFeesdetails .box-top .p .red {
  color: red;
  margin-right: 15px;
}
.campusFeesdetails .box-top .p .red .el-icon-edit {
  color: #409eff;
  opacity: 0;
  cursor: pointer;
}
.campusFeesdetails .box-top .p .red:hover .el-icon-edit {
  opacity: 1;
}
.campusFeesdetails {
  padding:12px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.campusFeesdetails .el-table th {
  padding: 10px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.campusFeesdetails .el-table td {
  padding: 5px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.pagination-container {
  margin-top: 10px;
}
.campusFeesdetails .el-input-box {
  float: right;
  width: 240px;
}
.campusFeesdetails .box-top {
  height: 40px;
}
.upload-import {
  display: inline-block;
}
.campusFeesdetails .top {
  line-height: 30px;
  font-size: 20px;
  color: #666;
  font-weight: 600;
  margin: 10px 10px;
  padding-left: 10px;
  border-left: 8px solid #409eff;
}
.campusFeesdetails .box-top h1 {
  font-size: 20px;
  margin: 0;
  margin-top: 10px;
}
.campusFeesdetails .box-top h1 i {
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}
.campusFeesdetails .box-top p {
  text-align: right;
  padding: 0 15%;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin: 0;
}
.campusFeesdetails .box-top p .red {
  color: red;
  margin-right: 15px;
}
</style>
