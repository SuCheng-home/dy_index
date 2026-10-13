<!--通知的详情-->
<template>
    <div class="three-stars-gentleman-detail">
        <div class="filter-wrapper">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="gotoForm">编辑</el-button>
            <el-button
                type="primary"
                size="medium"
                v-if="state == 1"
                @click="handleRelease"
            >发布
            </el-button
            >
            <el-button
                type="primary"
                size="medium"
                v-if="state == 2 || state == 3"
                @click="gotoNameList"
            >查看三星小雅士
            </el-button
            >
            <el-button
                type="primary"
                size="medium"
                v-if="state == 2"
                @click="handlePublicity"
            >公示
            </el-button
            >
        </div>

        <div class="article-container" :style="{ height: `${nobottommaxH}px` }">
            <div class="title">{{ title || "--" }}</div>
            <div class="sub-title">
                <span class="star-name">{{ starName || "--" }}</span>
                <span class="start-date">{{ startDate || "--" }}</span> ~
                <span class="end-date">{{ endDate || "--" }}</span>
            </div>
            <hr>
            <div class="content">
                <image-previewer tag="richtext">
                    <div class="task-content" v-html="content"></div>
                </image-previewer>
            </div>
            <hr>
            <div class="row" v-if="fileJson && fileJson.length">
                <div class="row-box">
                    <file-list :fileList="fileJson" :isShowTitle="false"></file-list>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from "@/mixins/windowResize";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {mapGetters} from "vuex";
    import FileList from "@/components/FileList/FileList.vue";
    import {
        getThreeStarBatch,
        updateThreeStarBatch,
    } from "@/api/homeSchool/yaxing/threeStarsGentleman/detail/index";

    export default {
        mixins: [mixin],
        components: {
            ImagePreviewer,
            FileList,
        },
        computed: {
            ...mapGetters(["userInfo"]),
        },
        data() {
            return {
                // 批次id
                id: this.$route.query.id,
                // 状态
                state: 0,
                // 主题
                title: "",
                // 评比星名称
                starName: "",
                // 开始日期
                startDate: "",
                // 结束日期
                endDate: "",
                // 内容
                content: "",
                // 附件
                fileJson: [],
            };
        },
        created() {
            this.getThreeStarBatch();
        },
        methods: {
            // 根据批次id查询批次详情
            getThreeStarBatch() {
                getThreeStarBatch({
                    batchId: this.id,
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        this.state = data.state;
                        this.title = data.title;
                        this.starName = data.starName;
                        this.startDate = data.startDate;
                        this.endDate = data.endDate;
                        this.content = data.content;
                        this.fileJson = JSON.parse(data.fileJson || "[]");
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 修改批次
            updateThreeStarBatch(state, message = "修改成功") {
                updateThreeStarBatch({
                    id: this.id,
                    state,
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        this.$message({
                            message,
                            type: "success",
                        });
                        this.getThreeStarBatch();
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 点击*发布*
            handleRelease() {
                this.$confirm("确认要发布吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    lockScroll: false,
                })
                    .then(() => {
                        this.updateThreeStarBatch(2, "发布成功");
                    })
                    .catch(() => {
                    });
            },
            // 点击*公示*
            handlePublicity(item) {
                this.$confirm("确认要公示吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    lockScroll: false,
                })
                    .then(() => {
                        this.updateThreeStarBatch(3, "公示成功");
                    })
                    .catch(() => {
                    });
            },
            // 编辑
            gotoForm() {
                this.$router.push({
                    path: "../form",
                    query: {
                        id: this.id,
                    },
                });
            },
            // 查看三星小雅士
            gotoNameList() {
                this.$router.push({
                    path: "nameList/index",
                    query: {
                        id: this.id,
                    },
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    @import "../../../../../../src/styles/mixin.scss";

    @include articleDetailPageStyles;

    .three-stars-gentleman-detail {
        padding: 12px;
        overflow: auto;

        .filter-wrapper {
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
    }
</style>
