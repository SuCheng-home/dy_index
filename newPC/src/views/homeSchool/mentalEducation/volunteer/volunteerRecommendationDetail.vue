<template>
    <div class="mental-education-consulting-detail-index">
        <el-row>
            <el-col :span="24">
                <el-button @click="$router.back()" size="medium">返回</el-button>
                <el-button type="primary" size="medium" v-if="isShowHandleBtn" @click="gotoReply">回复</el-button>
                <address-book :isbutton="true" :config="configData" v-if="isShowTransferBtn"
                    v-model="form.addressData">转办</address-book>
            </el-col>
        </el-row>
        <div class="detail-wrapper" :style="{ height: nobottommaxH - 10 + 'px' }">
            <div class="detail-title">志愿推荐详情</div>
            <el-form label-width="140px">
                <el-form-item label="主题">{{ title }}</el-form-item>
                <el-form-item label="推荐时间">{{ createTime }}</el-form-item>
                <el-form-item label="推荐人">{{ createUserName }}</el-form-item>
                <el-form-item label="活动内容">{{
                    content
                    }}</el-form-item>

                <el-form-item label="图片">
                    <!-- <el-image v-for="(item, index) in fileJson" :key="index" :src="item.photoUrl" fit="fill"
                        :preview-src-list="fileJsonPhotoUrl" style="width: 100px;height: 100px;margin-right: 10px;" /> -->

                    <image-previewer class="image-plate" tag="img" v-if="getViewPic(fileJson).length"
                        :images="getViewPic(fileJson)"></image-previewer>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import { getHeartVolunteerDark } from "@/api/homeSchool/mentalEducation/volunteer";
export default {
    name: "volunteerRecommendationDetail",
    components: { ImagePreviewer },
    data() {
        return {
            title: '',
            createTime: '',
            createUserName: '',
            content: '',
            fileJson: [],
            fileJsonPhotoUrl: []
        }
    },
    mounted() {
        this.getHeartVolunteerDarkEvent()
    },
    methods: {
        getViewPic(photoList) {
         

            if (photoList) {
                return photoList.map((item) => ({ src: item.photoUrl }));
            }
            return [];
        },

        // 获取志愿服务推荐详情
        async getHeartVolunteerDarkEvent() {
            const { data } = await getHeartVolunteerDark({
                darkId: this.$route.query.darkId
            })
            if (data.code == 200) {
                this.title = data.data.title
                this.createTime = data.data.createTime
                this.createUserName = data.data.createUserName
                this.content = data.data.content
                this.fileJson = JSON.parse(data.data.fileJson)
                this.fileJsonPhotoUrl = this.fileJson.map(item => item.photoUrl)
            }
        }
    },
}
</script>


<style lang="scss" scoped>
.mental-education-consulting-detail-index {
    padding: 12px;

    .el-col {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .el-form {
        width: 810px;
        margin: 0 auto;
        overflow: auto;

        .el-form-item {
            margin-bottom: 0;
        }

        /deep/ .el-form-item__label {
            color: #909399;
        }

        /deep/ .el-form-item__content {
            padding-left: 18px;
        }
    }

}

.detail-wrapper {
    overflow: auto;
    padding-bottom: 50px;
}

.detail-title {
    width: 810px;
    margin: 22px auto 14px;
    border-left: 4px solid #409eff;
    padding-left: 12px;
    height: 16px;
    line-height: 16px;
    font-size: 15px;
    color: #676a6c;
    font-weight: bold;

    .danger {
        color: #f56c6c;
    }
}

/deep/ .images {
    width: 80px;
    height: 80px;
    margin: 20px 20px 20px 0;
}
</style>