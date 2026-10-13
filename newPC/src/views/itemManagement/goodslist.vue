<template>
    <div class="goodslist">
        <div v-if="name||(pId==0&&pagination.goodTypeId==0)">
          <div class="top">
            <div class="nmme">{{name}}</div>
            <el-button class="filter-item" type="primary" size="mini" @click="goodstypeadd()">新增分类</el-button>
            <el-button class="filter-item" type="primary" size="mini" v-if="pagination.goodTypeId!=0"
                       @click="goodstypeeidt()">修改分类
            </el-button>
            <el-button class="filter-item" type="primary" size="mini" v-if="pagination.goodTypeId!=0"
                       @click="deleteGoodTypes()">删除分类
            </el-button>
            <el-button class="filter-item" type="primary" size="mini" v-if="pagination.goodTypeId!=0"
                       @click="goodsWarehousinglist()">入库记录
            </el-button>
            <el-button class="filter-item" type="primary" size="mini" v-if="pId!=0" @click="goodsadd()">新增物品</el-button>
            <el-button class="filter-item" type="primary" size="mini" v-if="pId!=0" @click="deleteGoods()">删除物品
            </el-button>           
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="mini">导出</el-button>
            </a>            
            <!-- <import-teacher @loadPageFormChild="loadPageFormChild" departName="currentDepartName"
                                       :departId="defaultExpandedArray[0]"></import-teacher> -->
            <import-student @loadPageFormChild="loadPageFormChild" :goodTypeId="pagination.goodTypeId"
                            @handSuccess="handSuccess" v-if="pId!=0"></import-student>
            <el-button class="filter-item" type="primary" size="mini" v-if="pId!=0" @click="goodsCollectlistall()">全部领用记录</el-button>
            <el-input class="search-input" style="width:20%;float: right;"
                      placeholder="物品名称" icon="search" size="mini" @change="queryGoodByTypeIdfun()"
                      v-model.trim="pagination.searchName">
                <el-button slot="append" icon="el-icon-search" @click="queryGoodByTypeIdfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row :height="maxH-20"
                  @select="handleSelectionChange" @select-all="handleSelectionChange" class="mytable">
            <el-table-column type="selection" align="center" width="40px" :resizable="false"></el-table-column>
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
            <el-table-column align="center" label="价格" width="70px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.goodPrice?scope.row.goodPrice:''}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="库存" width="70px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.repertory}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="易耗物品" show-overflow-tooltip width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.easyConsumeGood==1?'是':'否'}}</span>
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
            <el-table-column align="center" label="是否审批" show-overflow-tooltip width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.isExamine==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="审批人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="item in scope.row.userList" :key="item.id">{{item.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="165px" show-overflow-tooltip  fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="goodsCollectlist(scope.row.id)">领用记录</el-button>
                    <el-button type="text" size="small" @click="goodseidt(scope.row.id)">编辑</el-button>
                    <el-button type="text" size="small" v-if="scope.row.virtualGood==0"
                               @click="dialogVisiblefun(scope.row)">入库
                    </el-button>
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
        <el-dialog title="入库" :visible.sync="dialogVisible" width="50%">
            <el-form :model="ruleForm" class="card-dialog-padding" :rules="rules" ref="ruleDialogForm"
                     label-width="80px">
                <el-form-item label="数量" prop="goodCount">
                    <el-input-number v-model.trim="ruleForm.goodCount" :precision="0" @change="handleChange"
                                     :min="-99999" :max="99999" label="请输入数量"></el-input-number>
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
    import {queryGoodByTypeId, goodStorage, deleteGoodType, deleteGood, getGoodTypeById} from "@/api/itemManagement";
    import baseMixin from "@/mixins/baseMixin";
    import mixin from "@/mixins/windowResize";
    import DefaultPage from '@/components/DefaultPage';
    export default {
        data() {
            return {
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
                    goodCount: undefined
                },
                rules: {
                    goodCount: [
                        {required: true, message: "请输入数量！", trigger: "blur"}
                    ]
                },
                exportUrl: null
            };
        },
        components: {
            importStudent,DefaultPage
        },
        mixins: [baseMixin, mixin],
        created() {
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
            handSuccess() {
                this.queryGoodByTypeIdfun()
                this.getGoodTypeByIds()
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
            //删除分类
            deleteGoods() {
                if (this.selected.length == 0) {
                    this.$message({type: 'error', message: '请选择需要删除的物品!'});
                    return;
                }
                this.$confirm('此操作将永久删除所选物品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteGood(this.idS).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryGoodByTypeIdfun();
                    }).catch();

                }).catch(() => {
                });

            },
            //删除分类
            deleteGoodTypes() {
                this.$confirm('此操作将永久删除此分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteGoodType(this.pagination.goodTypeId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.$root.$emit('next')
                        this.$router.back();
                    }).catch();

                }).catch(() => {
                });
            },
            queryGoodByTypeIdfun() {
                this.exportUrl = `${global.BasePath}structure/good/downGoodByTypeId?goodTypeId=${this.pagination.goodTypeId}&searchName=${this.pagination.searchName}&token=${this.$store.getters.token}`;
                queryGoodByTypeId(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    });
            },
            //获取选中
            handleSelectionChange(val) {
                this.selected = val;
                this.idS = "";
                for (let i = 0; i < this.selected.length; i++) {
                    if (i < this.selected.length - 1) {
                        this.idS += this.selected[i].id + ",";
                    } else {
                        this.idS += this.selected[i].id;
                    }
                }
            },
            goodStorages(num) {
                if (num == 1) {
                    this.$refs.ruleDialogForm.validate(valid => {
                        if (valid) {
                            goodStorage(this.myobj, this.ruleForm.goodCount)
                                .then(res => res.data)
                                .then(data => {
                                    if (data.code === 200) {
                                        this.$message({
                                            type: "success",
                                            message: "操作成功！"
                                        });
                                        this.dialogVisible = false;
                                        this.ruleForm.goodCount = undefined;
                                        this.queryGoodByTypeIdfun();
                                    }
                                });
                        }
                    });

                } else {
                    this.dialogVisible = false;
                    this.ruleForm.goodCount = undefined;
                }

            },
            dialogVisiblefun(obj) {
                this.myobj = obj;
                this.dialogVisible = true;
            },
            goodsCollectlist(id) {
                this.savePageInfo();
                this.$router.push({
                    path: 'goodsCollectlist',
                    query: {
                        id: id
                    }
                });
            },
            goodsCollectlistall(id) {
                this.$router.push({
                    path: 'goodsCollectlistall',
                    query: {
                        id: this.$route.query.id
                    }
                });
            },
            goodstypeadd() {
                this.savePageInfo();
                this.$router.push({
                    path: 'goodstypeadd',
                    query: {
                        id: this.pagination.goodTypeId,
                        pId: this.pId
                    }
                });
            },
            goodsadd() {
                this.savePageInfo();

                this.$router.push({
                    path: 'goodsadd',
                    query: {
                        id: this.pagination.goodTypeId,
                        pId: this.pId
                    }
                });
            },
            savePageInfo() {
                sessionStorage.setItem('goodslistPage', JSON.stringify(this.pagination));
            },
            goodseidt(myid) {
                this.savePageInfo();
                this.$router.push({
                    path: 'goodseidt',
                    query: {
                        id: this.pagination.goodTypeId,
                        pId: this.pId,
                        myid: myid
                    }
                });
            },
            goodstypeeidt() {
                this.savePageInfo();

                this.$router.push({
                    path: 'goodstypeeidt',
                    query: {
                        id: this.pagination.goodTypeId,
                        pId: this.pId
                    }
                });
            },
            goodsWarehousinglist() {
                this.savePageInfo();

                this.$router.push({
                    path: 'goodsWarehousinglist'
                });
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
            width: 20px;
            height: 20px;
        }
    }
</style>
