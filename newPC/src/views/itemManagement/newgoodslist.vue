<template>
    <div class="goodslist">
        <div v-if="name||(pId==0&&pagination.goodTypeId==0)">
          <div class="top">
            <div class="nmme">{{name}}
                 <el-input class="search-input" style="width:20%;float: right;"
                      placeholder="物品名称" icon="search" size="mini" @change="queryGoodByTypeIdfun()"
                      v-model.trim="pagination.searchName">
                <el-button slot="append" icon="el-icon-search" @click="queryGoodByTypeIdfun()"></el-button>
            </el-input>
                </div>           
           
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row :height="nobottommaxH-10" class="mytable">
            <el-table-column align="center" label="图示" width="40px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <img :src="scope.row.goodUrl" class="img" alt="">
                </template>
            </el-table-column>
            <el-table-column align="center" label="名称" width="300px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.goodName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="品牌" width="80px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.goodBrand}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="规格型号" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.goodSpec}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="单位" width="70px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.unitName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="库存" width="70px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.repertory}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="虚拟物品" show-overflow-tooltip width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.virtualGood==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否归还" show-overflow-tooltip width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.needGiveBack==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="165px" show-overflow-tooltip  fixed="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.repertory">
                       <el-button type="text" size="small" v-if="scope.row.virtualGood==0&&scope.row.needGiveBack==1" @click="dialogVisiblefun(scope.row)">借用</el-button>
                       <el-button type="text" size="small" v-else @click="dialogVisiblefun(scope.row)">领用</el-button>
                    </span>
                   
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="queryGoodByTypeIdfun" @current-change="queryGoodByTypeIdfun"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                           :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
        <el-dialog title="物品领用" :visible.sync="dialogVisible" width="50%">
            <el-form :model="ruleForm" class="card-dialog-padding" :rules="rules" ref="ruleDialogForm" label-width="80px">
                <el-form-item label="图示" >
                    <img :src="myobj.goodUrl" class="img" style="height:40px" alt="">
                </el-form-item>
                <el-form-item label="名称">
                   <span>{{myobj.goodName}}<el-tag  size="mini"  v-if="myobj.needGiveBack==1">需归还</el-tag></span>
                </el-form-item>
                 <el-form-item label="品牌">
                   <span>{{myobj.goodBrand||'----'}}</span>
                </el-form-item>
                <el-form-item label="数量" prop="orderCount" v-if="myobj.virtualGood==0">
                    <el-input-number v-model.trim="ruleForm.orderCount" :precision="0" :min="1" :max="myobj.repertory" label="请输入数量"></el-input-number>
                </el-form-item>
                <el-form-item label="部门" prop="departId">
                    <el-select v-model="ruleForm.departId">
                <el-option
                  v-for="item in departmentList"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="归还时间" v-if="myobj.needGiveBack==1">
                        <el-date-picker format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd" v-model="ruleForm.returnTime"></el-date-picker>
                    </el-form-item>
                <el-form-item label="申请原因" prop="content" >
                    <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入申请原因"
                    v-model.trim="ruleForm.content">
                    </el-input>
                 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="goodStorages(0)">取 消</el-button>
                <el-button type="primary" @click="goodStorages(1)">确 定</el-button>
            </span>
        </el-dialog>
        </div>
       <default-page Mes="请选择物品类型" v-else ></default-page>
    </div>
</template>
<script>
    import moment from "moment";
    import importStudent from './importStudent.vue'
    import {queryGoodByTypeId, goodStorage, getGoodTypeById,submitOrder,queryDepartByUserId} from "@/api/itemManagement";
    import baseMixin from "@/mixins/baseMixin";
    import mixin from "@/mixins/windowResize";
    import DefaultPage from '@/components/DefaultPage';
    export default {
        data() {
            return {
                departmentList:[],
                dataList: [],
                pId: this.$route.query.pId,
                name: "",
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null,
                    searchName: "",
                    goodTypeId:  this.$route.query.id
                },
                myobj: {},
                selected: [],
                idS: "",
                dialogVisible: false,
                ruleForm: {
                    content: "",
                    departName: "",
                    departId: "",
                    orderCount:"",
                    returnTime:""
                },
                rules: {
                    orderCount: [
                        {required: true, message: "请输入数量！", trigger: "blur"}
                    ],
                    content: [
                        {required: true, message: "请输入申请原因！", trigger: "blur"}
                    ],
                    departId: [
                        {required: true, message: "请输选择部门！", trigger: "change"}
                    ],
                },
                exportUrl: null
            };
        },
        components: {
            importStudent,DefaultPage
        },
        mixins: [baseMixin, mixin],
        created() {
             let userid = this.$store.getters.userInfo.id;
    queryDepartByUserId(userid, "")
      .then((res) => {
        //获取落款部门
        if (res.data.code === 200) {
          this.departmentList = res.data.data;
        } else {
          this.$message({
            type: "warning",
            message: "未获取到落款部门!",
          });
        }
      })
      .catch((err) => {});
            setTimeout(() => {
                this.init();
            }, 100)
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                console.log(from);
                const urlList = [
                    'goodsCollectlist',
                    'goodseidt',
                    'goodsadd',
                    'goodsWarehousinglist',
                    'goodstypeeidt',
                    'goodstypeadd'
                ];
                if(urlList.some(url => from.path.includes(url))) {
                    if(sessionStorage.getItem('goodslistPage')) {
                        vm.pagination = JSON.parse(sessionStorage.getItem('goodslistPage'));
                        // sessionStorage.removeItem('goodslistPage');
                    }
                }
                vm.init();

            })
        },
        methods: {
            init() {
                this.pId = this.$route.query.pId;
                this.pagination.goodTypeId = this.$route.query.id;
                if (this.$route.query.id) {
                    this.queryGoodByTypeIdfun();
                    this.getGoodTypeByIds();
                }
            },
            getGoodTypeByIds() {
                if (this.$route.query.id != 0) {
                    getGoodTypeById(this.$route.query.id)
                        .then(res => res.data)
                        .then(data => {
                            this.name = data.data.typeName;
                        })
                }

            },
           
            queryGoodByTypeIdfun() {
                queryGoodByTypeId(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    });
            },
           
            goodStorages(num) {
                if (num == 1) {
                    this.$refs.ruleDialogForm.validate(valid => {
                        if (valid) {
                             for (let i = 0; i < this.departmentList.length; i++) {
                                if (this.ruleForm.departId == this.departmentList[i].id) {
                                    this.ruleForm.departName = this.departmentList[i].name;
                                }
                            }
                            submitOrder({
                                content: this.ruleForm.content,
                                departName: this.ruleForm.departName,
                                departId: this.ruleForm.departId,
                                orderDetailsJson: JSON.stringify([
                                     {
                                        content: this.ruleForm.content,
                                        goodId: this.myobj.id,
                                        goodName: this.myobj.goodName,
                                        orderCount: this.ruleForm.orderCount,
                                        returnTime: this.ruleForm.returnTime,
                                    }
                                ])
                            })
                                .then(res => res.data)
                                .then(data => {
                                    if (data.code === 200) {
                                        this.$message({
                                            type: "success",
                                            message: "操作成功！"
                                        });
                                        this.dialogVisible = false;
                                        this.queryGoodByTypeIdfun();
                                    }
                                });
                        }
                    });

                } else {
                    this.dialogVisible = false;
                }

            },
            dialogVisiblefun(obj) {
                this.myobj = obj;
                this.dialogVisible = true;
                this.ruleForm={
                    content: "",
                    departName: "",
                    departId:this.departmentList[0].id||'',
                    orderCount:1,
                    returnTime:""
                }
            },
           
        }
    };
</script>
<style scoped>
    .goodslist .el-table .cell {
        padding: 0 !important;
    }

    .goodslist .el-table .cell.el-tooltip {
        white-space: nowrap;
        min-width: 30px;
    }
    .goodslist .el-button--mini, .goodslist .el-button--mini.is-round{
         padding: 7px 6px;
    }
</style>

<style lang="scss" scoped>
    .goodslist {
        padding: 12px;

        .top {
            padding-bottom: 10px;

            .nmme {
                line-height: 32px;
                font-size: 18px;
                color: #606266;
            }
        }

        .img {
            height: 20px;
        }
    }
</style>
