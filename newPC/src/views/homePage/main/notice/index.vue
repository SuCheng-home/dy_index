<template>
    <div class="home-page-main-notice">
        <div class="notice-title-wrapper">
            <div class="title">
                <img
                    class="icon"
                    src="https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/icon-notice.png"
                    alt=""
                />
                <span class="text">通知公告</span>
            </div>
            <a class="more" href="javascript:;" @click="gotoNotieRecive">
                <i class="el-icon-more-outline"></i>&nbsp;更多
            </a>
        </div>

        <el-table
            style="width: 100%"
            stripe
            size="medium"
            :height="239"
            :show-header="false"
            :data="tabList"
        >
            <el-table-column align="left" show-overflow-tooltip>
                <template slot-scope="scope">
          <span class="link-type" @click="gotoNoticeDetail(scope.row)"
          >{{ scope.row.noticeTitle || "--" }}
            <img
                src="https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/icon-new.png"
                alt=""
                v-if="scope.row.readState == 1"
            /> </span
          ></template>
            </el-table-column>
            <el-table-column align="right" width="150" show-overflow-tooltip>
                <template slot-scope="scope">{{
                    scope.row.releaseDate | trimTime
                    }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    /* utils */

    /* components */

    /* api */
    import {getUserReceiveNoticeList} from "@/api/notice";

    export default {
        name: "homePageMainNotice",
        mixins: [],
        components: {},
        computed: {
            ...mapGetters(['userInfo'])
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(".")) : "--";
            },
        },
        data() {
            return {
                // 表格数据
                tabList: [],
            };
        },
        created() {
            this.getUserReceiveNoticeList();
        },
        methods: {
            // 用户接收的通知列表
            getUserReceiveNoticeList() {
                getUserReceiveNoticeList({
                    pageNo: 1,
                    pageSize: 5,
                    searchTitle: "",
                    noticeType: 0,
                    receiveUserId: this.userInfo.id
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        let {dataList, pagination} = data;
                        this.tabList = [...dataList];
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 收通知
            gotoNotieRecive() {
                this.$router.push({
                    path: "/main/homeSchool/notice/notieRecive",
                });
            },
            // 收通知详情
            gotoNoticeDetail(item) {
                this.$router.push({
                    path: "/main/homeSchool/notice/noticeDetail",
                    query: {id: item.id, isReceive: 1, fromIndex: 1},
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .home-page-main-notice {
        padding: 0 56px;
        margin: 45px auto;

        .notice-title-wrapper {
            display: flex;
            margin-bottom: 20px;
            font-size: 0;
            height: 27px;
            line-height: 27px;

            span {
                display: inline-block;
            }

            .title {
                flex: 1;
                margin-right: 10px;
                white-space: nowrap;

                .icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 15px;
                    vertical-align: bottom;
                }

                .text {
                    font-family: MicrosoftYahei-Bold;
                    font-size: 24px;
                    font-weight: bold;
                    color: #606266;
                    vertical-align: bottom;
                }
            }

            .more {
                flex: 0 0 60px;
                width: 60px;
                text-align: right;
                font-size: 16px;
                color: #409eff;
                position: relative;
                top: 6px;
            }
        }
    }
</style>
