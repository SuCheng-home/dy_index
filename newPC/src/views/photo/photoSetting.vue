<template>
    <div class="app-container calendar-list-container" id="printApplyDetail">
        <back-tool>
            <el-button class="filter-item" type="primary" size="medium" @click="saveHandler()">保存</el-button>
        </back-tool>
        <div class="content-container">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form ref="ruleForm" label-width="140px" class="ruleForm">
                    <el-checkbox v-model="isHaveVideo" :true-label="2" :false-label="1">允许上传视频</el-checkbox>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {addAlbumInit, getAlbumInit} from '@/api/photo';
    import BackTool from "@/components/BackTool";

    export default {
        name: "photoSetting",
        components: {BackTool},
        data() {
            return {
                isHaveVideo: 1,
            }
        },
        created() {
            getAlbumInit()
                .then(res => res.data)
                .then(data => {
                    if(data && data.data) {
                        this.isHaveVideo = data.data.isHaveVideo;
                    }
                })
        },
        methods: {
            saveHandler() {
                addAlbumInit({
                    isHaveVideo: this.isHaveVideo
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('设置成功');
                            setTimeout(() => {
                                this.$router.back();
                            }, 1000);
                        }
                    })
            }
        }
    }
</script>

<style scoped>
    .content-container {
        margin-top: 20px;
    }
</style>
