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
            <div class="detail-title">志愿服务详情</div>
            <el-form label-width="140px">
                <el-form-item label="服务内容">{{ myData.title }}</el-form-item>
                <el-form-item label="班级" v-if="configuration.isClassName == 1">{{ myData.className }}</el-form-item>
                <el-form-item label="活动日期">{{ myData.acvitityTime.split(' ')[0] }}</el-form-item>
                <el-form-item label="参与人员">{{ myData.participant }}</el-form-item>
                <el-form-item label="地点" v-if="configuration.isAdress == 1">{{ myData.adress }}</el-form-item>
                <el-form-item label="时长" v-if="configuration.isTimeLength == 1">{{ myData.timeLength }}</el-form-item>
                <el-form-item label="部门分组" v-if="configuration.isDepartGroup == 1">{{ myData.departGroupName
                    }}</el-form-item>
                <el-form-item label="活动内容">{{
                    myData.content
                }}</el-form-item>

                <el-form-item label="图片">
                    <image-previewer class="image-plate" tag="img" v-if="getViewPic(myData.fileJson).length"
                        :images="getViewPic(myData.fileJson)"></image-previewer>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import { getHeartVolunteer, getHeartVolunteerInit } from "@/api/homeSchool/mentalEducation/volunteer";
export default {
    name: "volunteerListDetail",
    components: { ImagePreviewer },
    data() {
        return {
            myData: {},
            configuration: {}
        }
    },
    mounted() {

        this.getHeartVolunteerDarkEvent()
    },
    methods: {
        getViewPic(photoList) {
             console.log('photoList', photoList);
            if (photoList) {
                return photoList.map((item) => ({ src: item.photoUrl }));
            }
            return [];
        },
        // 获取志愿服务推荐详情
        async getHeartVolunteerDarkEvent() {
            const { data } = await getHeartVolunteerInit({})
            this.configuration = data.data
            const { data: res } = await getHeartVolunteer({
                volunteerId: this.$route.query.volunteerId
            })
            if (res.code == 200) {
                this.myData = res.data
                if (this.configuration.isAddCreateType == 2) {
                    this.myData.participant = this.myData.heartVolunteerStList.map(item => item.studentName).join('、')
                }
                if (this.configuration.isAddCreateType == 3) {
                    this.myData.participant = this.myData.heartVolunteerUserList.map(item => item.userName + (item.nick ? item.nick : '')).join('、')

                }
                this.myData.fileJson = JSON.parse(this.myData.fileJson)
                this.myData.fileJsonPhotoUrl = this.myData.fileJson.map(item => item.photoUrl)
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