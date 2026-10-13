<!--通知的未读及已读列表-->
<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-select @change="onUserTypeChange(true)" v-model="userType" placeholder="请选择用户类型" size="medium" style="width: 150px;">
                    <el-option label="全部用户类型" :value="0"></el-option>
                    <el-option label="老师" :value="1"></el-option>
                    <el-option label="学生" :value="2"></el-option>
                </el-select>
                <el-select v-if="userType == 2" @change="onUserTypeChange()" v-model="deptId" placeholder="请选择班级" size="medium" style="width: 150px;">
                    <el-option label="全部班级" :value="''"></el-option>
                    <el-option :label="departItem.departNames" :value="departItem.departIds" v-for="departItem in stuDepartList"></el-option>
                </el-select>
                <a :href="exportUrl" download="导出" target="_blank" >
                           <el-button class="filter-item" type="primary" size="medium" icon="upload">导出已确认人员</el-button>
                 </a>
                  <a :href="exportUrltwo" download="导出" target="_blank" >
                           <el-button class="filter-item" type="primary" size="medium" icon="upload">导出未确认人员</el-button>
                 </a>
                 <el-button class="filter-item" type="primary" size="medium" v-if="userType==2&&list[0].signPicurl" @click="batchprinting()">批量导出签字文件</el-button>
                 <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入姓名" icon="search" size="medium" @change="onUserTypeChange()"
                          v-model.trim="listQuery.searchTitle">
                    <el-button slot="append" icon="el-icon-search" @click="onUserTypeChange()"></el-button>
            </el-input>
        </backtool>
        <div class="read-box el-table__body-wrapper" :style="{'height':maxH+'px'}">
            <el-table stripe :data="list" border fit highlight-current-row
                      style="width: 100%" :height="nobottommaxH - 55">
                <el-table-column align="center" label="姓名" prop="name">
                </el-table-column>
                <el-table-column align="center" label="人员类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.userType == 2 ? '学生' : '教师'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级/部门" prop="departNames">
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="阅读时间">
                    <template slot-scope="scope">
                        {{scope.row.readDate | trimTime}}
                    </template>
                </el-table-column>
                <el-table-column class-name="status-col" label="签名图片">
                    <template slot-scope="scope">
                        <div style="color: #409eff;"
                             v-if="scope.row && scope.row.signPicurl">
                            <image-previewer is-white-bg :images="getViewPic(scope.row)" tag="img" text="查看图片"></image-previewer>
                        </div>
                    </template>
                </el-table-column>
                 <el-table-column show-overflow-tooltip align="center" label="签名/确认时间">
                    <template slot-scope="scope">
                        {{scope.row.signDate | trimTime}}
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button  size="small" v-if="scope.row && scope.row.signPicurl" type="text" @click.native="putasealon(scope.row)">查看详情
                    </el-button>
                     <el-button  size="small" v-if="scope.row && scope.row.signPicurl" type="text" @click.native="delReadSignPic(scope.row.userId)">删除
                    </el-button>
                </template>
            </el-table-column>
            </el-table>

        </div>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { getReadDepartListByNoticeId, getReadUserNoticeList,delReadSignPic} from '@/api/notice';
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    export default {
        components: {
            Backtool,
            ImagePreviewer
        },
        data() {
            return {
                total: null,
                listLoading: false,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: '',
                    noticeId:this.$route.query.id,
                    isRead: 1,
                    isSign:1,
                },
                exportUrl: '',
                exportUrltwo:"",
                userType: 0,
                deptId: '',
                stuDepartList: [],
            }
        },
        activated(){
            getReadDepartListByNoticeId({
                noticeId: this.listQuery.noticeId,
                userType: 2
            })
                .then(res => res.data)
                .then(data => {
                    this.stuDepartList = data.data;
                })
           
            this.getList();
        },
        created() {
            getReadDepartListByNoticeId({
                noticeId: this.listQuery.noticeId,
                userType: 2
            })
                .then(res => res.data)
                .then(data => {
                    this.stuDepartList = data.data;
                })
           
            this.getList();
        },
        mixins: [mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
            delReadSignPic(userId) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delReadSignPic({
                        userId: userId,
                        noticeId:this.$route.query.id,
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getList();
                            }
                        })
                });

            },
            putasealon(obj){
              sessionStorage.setItem("putasealonobj",JSON.stringify(obj));
              this.$router.push({
                            path: 'putasealon',
                            query: {id: this.$route.query.id}
                        });
            },
            batchprinting(obj){
              this.$router.push({
                            path: 'batchprinting',
                            query: { id:this.$route.query.id,deptId:this.deptId}
                        });
            },
            onUserTypeChange(isClearDpet = false) {
                if(isClearDpet) {
                    this.deptId = '';
                }
                this.listQuery.pageNo = 1;
                this.getList();
            },
            getList() {
                this.listLoading = true;
                this.exportUrltwo = `${global.BasePath}structure/notice/exportNoticeNoSignUsers?token=${this.$store.getters.token}&noticeId=${this.$route.query.id}&userType=${this.userType}`;
                this.exportUrl = `${global.BasePath}structure/notice/exportNoticeReadUsers?token=${this.$store.getters.token}&readType=1&isSign=1&noticeId=${this.$route.query.id}&userType=${this.userType}`
                const args = {
                    ...this.listQuery
                };
                if (this.isClass) {
                    args.userType = 2;
                    args.deptId = this.deptId;
                } else if (this.userType != 0) {
                    args.userType = this.userType;
                    if(this.userType == 2) {
                        args.deptId = this.deptId;
                    }
                }
                  getReadUserNoticeList(args).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                });
               
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            getViewPic(item) {
                if (item.signPicurl) {
                    return [{'src': item.signPicurl}]
                }
                return [];
            }
        }
    }
</script>
<style scoped>
    .menu-tools {
        border-bottom: 1px solid #e7eaec;
    }

    .read-box {
        overflow-y: auto !important;
    }

    .read-box-item {
        width: 80px;
        height: 120px;
        float: left;
        margin: 10px 0 0 20px;
    }

    .read-box-item-header {
        width: 60px;
        height: 60px;
        background-position: center center;
        background-size: cover;
        border-radius: 50%;
        margin: 0 auto;
    }

    .read-box-item-footor {
        text-align: center;
        padding-top: 4px;
    }

    .read-box-item-footor .name {
        font-size: 14px;
        text-align: center;
    }

    .read-box-item-footor .time {
        font-size: 12px;
        color: #6C6C6C;
    }

    .clear {
        clear: both;
    }
</style>
