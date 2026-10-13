<!--通知的未读及已读列表-->
<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button size="medium" type="primary" v-if="noticeState === 2 && listQuery.isRead === 0 && isOwnCreate&&!mynew"
                       @click="notifyAll">提醒未读用户
            </el-button>
            <template v-if="isRead && !isClass">
                <el-select @change="onUserTypeChange(true)" v-model="userType" placeholder="请选择用户类型" size="medium"
                           style="width: 150px;">
                    <el-option label="全部用户类型" :value="0"></el-option>
                    <el-option label="老师" :value="1"></el-option>
                    <el-option label="学生" :value="2"></el-option>
                </el-select>
                <el-select v-if="userType == 2" @change="onUserTypeChange()" v-model="deptId" placeholder="请选择" size="medium" style="width: 150px;">
                    <el-option label="全部班级" :value="''"></el-option>
                    <el-option :label="departItem.departNames" :value="departItem.departIds" v-for="departItem in stuDepartList"></el-option>
                </el-select>
            </template>


                       <a :href="exportUrl" download="导出" target="_blank" v-if="(noticeState === 2) &&newmynum">
                           <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
                       </a>
        </backtool>
        <div v-if="isRead" class="read-box el-table__body-wrapper" :style="{'height':maxH+'px'}">
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
                <el-table-column show-overflow-tooltip align="center" label="已读时间">
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
                 <el-table-column align="center" label="签字文件" width="120">
                <template slot-scope="scope">
                    <el-button  size="small" v-if="scope.row && scope.row.signPicurl" type="text" @click.native="putasealon(scope.row)">查看详情
                    </el-button>
                </template>
            </el-table-column>
            </el-table>

        </div>
        <div v-else class="read-box el-table__body-wrapper" :style="{'height':maxH+'px'}">
            <template v-for="item in list">
                <div class="read-box-item">
                    <div class="read-box-item-header" :style="{backgroundImage:'url('+item.avatar+')'}"></div>
                    <div class="read-box-item-footor">
                        <div class="name">{{item.name}}</div>
                        <template v-if="listQuery.isRead===1">
                            <div class="time">{{item.readDate|trimTime}}</div>
                        </template>

                    </div>
                </div>
            </template>

        </div>
        <div class="clear"></div>
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
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {remindNotReadUsers, getReadDepartListByNoticeId, getReadUserNoticeList,getReadUserNoticeListnew,getReadDepartListByNoticeIdnew} from '@/api/notice';
    import Backtool from '@/components/BackTool';
    import {mapGetters} from 'vuex';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Backtool,
            ImagePreviewer
        },
        data() {
            return {
                newmynum: this.$route.query.newmynum,
                noticeState: this.$route.query.noticeState,
                list: null,
                total: null,
                listLoading: false,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: '',
                    noticeId: '',
                    isRead: ''
                },
                isOwnCreate: this.$route.query.isOwnCreate == 1,
                exportUrl: '',
                userType: 0,
                deptId: '',
                isRead: this.$route.query.isRead == 1,

                isClass: this.$route.query.isClass == 1,
                classId: this.$route.query.classId,

                stuDepartList: [],
                mynew:this.$route.query.mynew||0
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.isStandalone ? this.listQuery.pageSize = 10 : this.listQuery.pageSize = 20;
            this.listQuery.noticeId = this.$route.query.id;
            this.listQuery.isRead = this.$route.query.isRead;
           if(this.mynew){
                getReadDepartListByNoticeIdnew({
                noticeId: this.listQuery.noticeId,
                userType: 2
            })
                .then(res => res.data)
                .then(data => {
                    this.stuDepartList = data.data;
                })

               }else{
                 getReadDepartListByNoticeId({
                noticeId: this.listQuery.noticeId,
                userType: 2
            })
                .then(res => res.data)
                .then(data => {
                    this.stuDepartList = data.data;
                })
               }
           
            this.getList();
        },
        mixins: [mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
            putasealon(obj){
              sessionStorage.setItem("putasealonobj",JSON.stringify(obj));
              this.$router.push({
                            path: 'putasealon',
                            query: {id: this.$route.query.id}
                        });
            },
            onUserTypeChange(isClearDpet = false) {
                if(isClearDpet) {
                    this.deptId = '';
                }
                this.listQuery.pageNo = 1;
                this.getList();
            },
            onSearch() {
                this.listQuery.pageNo = 1;
                this.getList();
            },
            getList() {
                this.listLoading = true;
                this.exportUrl = `${global.BasePath}structure/notice/exportNoticeReadUsers?token=${this.$store.getters.token}&readType=${this.$route.query.isRead}&noticeId=${this.$route.query.id}`
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

               if(this.mynew){
                getReadUserNoticeListnew(args).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                });

               }else{
                  getReadUserNoticeList(args).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                });
               }
               
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            goback() {
                this.$router.back();
            },
            notifyAll() {
                remindNotReadUsers({
                    noticeId: this.listQuery.noticeId
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message({
                                message: '已提醒未读人员！',
                                type: 'success'
                            })
                        }
                    })
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
