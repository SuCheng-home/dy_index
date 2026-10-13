<template>
    <div class="three-stars-gentleman-form">
        <div class="filter-wrapper">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="save">保存</el-button>
            <el-button
                type="primary"
                size="medium"
                v-if="showRelease"
                @click="release"
            >发布
            </el-button
            >
        </div>

        <el-form label-width="140px" ref="form" :model="form" :rules="rules">
            <el-form-item label="主题" prop="title">
                <el-input
                    placeholder="1-30个字符"
                    maxlength="30"
                    show-word-limit
                    v-model.trim="form.title"
                ></el-input>
            </el-form-item>
            <el-form-item label="评比日期范围" prop="daterange">
                <el-date-picker
                    style="width: 250px"
                    size="medium"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    v-model="form.daterange"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="评比星" prop="star">
                <el-select style="width: 250px" value-key="id" v-model="form.star">
                    <el-option
                        :key="idx"
                        v-for="(star, idx) in starList"
                        :label="star.name"
                        :value="star"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="附件">
                <uploader
                    pathPrefix="threeStarsGentleman"
                    :multiple="false"
                    :extList="allFileTypeList"
                    v-model="form.fileList"
                ></uploader>
            </el-form-item>
            <el-form-item label="评比说明" prop="noticeContent">
                <br />
                <ueditor
                    class="rich-editor"
                    ref="ueditor"
                    style="width: 740px;position: relative;right: 70px;"
                    :defaultMes="form.noticeContent"
                    @editModel="richTextEditHandler"
                ></ueditor>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import mixin from "@/mixins/windowResize";
    import Uploader from "@/components/Uploader/WebUploader";
    import Ueditor from "@/components/Ueditor";
    import {
        getThreeStarGroupListAll,
        getThreeStarBatch,
        addThreeStarBatch,
        updateThreeStarBatch,
    } from "@/api/homeSchool/yaxing/threeStarsGentleman/form";

    export default {
        name: "threeStarsGentlemanForm",
        mixins: [mixin],
        components: {
            Uploader,
            Ueditor,
        },
        data() {
            return {
                // 新增 / 编辑
                type: "add",
                // 发布按钮是否显示
                showRelease: false,
                // 评比星列表
                starList: [],
                // 附件可上传类型
                allFileTypeList: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"],
                // 请求表单
                form: {
                    // 状态 1(草稿) | 2(发布) | 3(公示)
                    state: 1,
                    // 批次id
                    batchId: "",
                    title: "",
                    // 日期范围
                    daterange: "",
                    // 评比星
                    star: "",
                    fileList: [],
                    /* 上传文件列表
                        {
                            fileName: '',
                            fileUrl: '',
                            id: ''
                        }
                    */
                    // 富文本编辑器内容
                    noticeContent: "",
                },
                rules: {
                    title: [{required: true, message: "主题不能为空", trigger: "blur"}],
                    daterange: [
                        {
                            type: "array",
                            required: true,
                            message: "请选择评比日期范围",
                            trigger: "change",
                        },
                    ],
                    star: [{required: true, message: "请选择评比星", trigger: "change"}],
                    noticeContent: [
                        {required: true, message: "评比说明不能为空", trigger: "change"},
                    ],
                },
            };
        },
        created() {
            this.getThreeStarGroupListAll();
        },
        methods: {
            richTextEditHandler(content) {
                this.form.noticeContent = content;
            },
            // 根据学校id查询所有二级分组
            getThreeStarGroupListAll() {
                getThreeStarGroupListAll()
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        this.starList = [...data];
                        let id = this.$route.query.id;
                        if (id) {
                            this.type = "edit";
                            this.form.batchId = id;
                            this.getThreeStarBatch();
                        } else {
                            this.type = "add";
                            this.showRelease = true;
                        }
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 根据批次id查询批次详情
            getThreeStarBatch() {
                getThreeStarBatch({
                    batchId: this.form.batchId,
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        this.form.state = data.state;
                        this.form.title = data.title;
                        this.form.daterange = [data.startDate, data.endDate];
                        this.form.star = this.starList.find((star) => star.id == data.starId);
                        this.form.fileList = JSON.parse(data.fileJson);
                        this.form.noticeContent = data.content;
                        this.$refs.ueditor.setContent(data.content);
                        if (this.form.state == 1) this.showRelease = true;
                        else this.showRelease = false;
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 保存
            save() {
                this.submitForm();
            },
            // 发布
            release() {
                this.form.state = 2;
                this.submitForm();
            },
            // 提交
            submitForm() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let form = {
                            state: this.form.state,
                            title: this.form.title,
                            startDate: this.form.daterange[0],
                            endDate: this.form.daterange[1],
                            groupId: this.form.star.pid,
                            groupName: this.form.star.pname,
                            starId: this.form.star.id,
                            starName: this.form.star.name,
                            fileJson: JSON.stringify(this.form.fileList),
                            content: this.$refs.ueditor.getContent(),
                        };
                        if (this.type == "add") {
                            this.addThreeStarBatch(form);
                        } else {
                            form.id = this.form.batchId;
                            this.updateThreeStarBatch(form);
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 新增批次
            addThreeStarBatch(form) {
                addThreeStarBatch(form)
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        this.$message({
                            message: "添加成功",
                            type: "success",
                        });
                        this.$router.back();
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 修改批次
            updateThreeStarBatch(form) {
                updateThreeStarBatch(form)
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        this.$message({
                            message: "修改成功",
                            type: "success",
                        });
                        this.$router.back();
                        /*
                        this.$router.replace({
                          path: "detail/index",
                          query: {
                            id: this.form.batchId,
                          },
                        });*/
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .three-stars-gentleman-form {
        padding:12px;
        overflow: auto;

        .filter-wrapper {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }

        .el-form {
            width: 810px;
            margin: 0 auto;
        }
    }
</style>
