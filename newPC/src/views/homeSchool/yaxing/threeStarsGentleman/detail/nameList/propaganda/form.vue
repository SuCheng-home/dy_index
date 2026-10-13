<template>
    <div class="propaganda">
        <div class="filter-wrapper">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="submitForm"
            >保存
            </el-button
            >
        </div>

        <el-form label-width="150px" ref="form" :model="form" :rules="rules">
            <el-form-item label="学生姓名">{{ studentName || "--" }}</el-form-item>
            <el-form-item label="所在班级">{{ className || "--" }}</el-form-item>
            <el-form-item label="宣传照" prop="fileJson">
                <uploader
                    showMode="image"
                    showResult="image"
                    :multiple="false"
                    :value="form.fileJson"
                    :extList="['png', 'jpg', 'jpeg', 'bmp']"
                ></uploader>
            </el-form-item>
            <el-form-item label="宣传信息" prop="noticeContent">
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
        getThreeStarStuThree,
        updateThreeStarStuThree,
    } from "@/api/homeSchool/yaxing/threeStarsGentleman/detail/nameList/propaganda/form";

    export default {
        name: "propaganda",
        mixins: [mixin],
        components: {
            Uploader,
            Ueditor,
        },
        data() {
            return {
                // 新增 / 编辑
                type: "add",
                // 学生姓名
                studentName: "",
                // 班级名称
                className: "",
                // 请求表单
                form: {
                    // 批次id
                    batchId: "",
                    // 三星小雅士id
                    id: "",
                    // 学生id
                    studentId: "",
                    // 图片list
                    fileJson: [],
                    // 富文本编辑器内容
                    noticeContent: "",
                    // 状态 1(有效) 2(无效)
                    status: 1,
                },
                rules: {
                    fileJson: [
                        {required: true, message: "请上传宣传照", trigger: "change"},
                    ],
                    noticeContent: [
                        {required: true, message: "宣传信息不能为空", trigger: "change"},
                    ],
                },
            };
        },
        created() {
            let id = this.$route.query.id;
            let batchId = this.$route.query.batchId;
            let studentId = this.$route.query.studentId;
            if (id) {
                this.type = "edit";
                this.form.id = id;
                this.form.batchId = batchId;
                this.form.studentId = studentId;
                this.getThreeStarStuThree();
            } else {
                this.type = "add";
            }
        },
        methods: {
            richTextEditHandler(content) {
                this.form.noticeContent = content;
            },
            // 根据学生id,批次查询三星小雅士
            getThreeStarStuThree() {
                getThreeStarStuThree({
                    batchId: this.form.batchId,
                    studentId: this.form.studentId,
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        if (data) {
                            this.studentName = data.studentName;
                            this.className = data.className;
                            this.form.fileJson = JSON.parse(data.fileJson || "[]");
                            this.form.noticeContent = data.content || "";
                            this.$refs.ueditor.setContent(data.content || "");
                        }
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 修改三星小雅士
            updateThreeStarStuThree(form) {
                updateThreeStarStuThree(form)
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
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 提交
            submitForm() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let form = {
                            id: this.form.id,
                            studentId: this.form.studentId,
                            status: this.form.status,
                            fileJson: JSON.stringify(this.form.fileJson),
                            content: this.$refs.ueditor.getContent(),
                        };
                        if (this.type == "add") {
                        } else {
                            this.updateThreeStarStuThree(form);
                        }
                    } else {
                        return false;
                    }
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .propaganda {
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

            .info-wrapper {
                span {
                    margin-left: 80px;
                    color: #606266;
                }
            }
        }
    }
</style>
