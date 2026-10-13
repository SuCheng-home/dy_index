<template>
    <div class="readingplatformindex">
        <div class="entrance_list ">
            <div class="entrance_item" @click="loadNextPage('readingplatformbookmanagementindex')">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/read/one.png">
                    <div>书 籍 管 理</div>
            </div>
            <div class="entrance_item" @click="loadNextPage('readingplatformstateimg')">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/read/two.png">
                    <div>任务状态封面设置</div>
            </div>
            <div class="entrance_item" @click="loadNextPage('readingplatformbasicsettings')">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/read/three.png">
                    <div>阅读平台基础设置</div>
            </div>
            <div class="entrance_item" @click="loadNextPage('readingplatformgradeindex')">
                    <img src="http://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/rewardsPunishments.png">
                    <div>积分等级设置</div>
            </div>
            <div class="entrance_item" @click="loadNextPage('readingplatformmapindex')"   v-if="mapState==1">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/read/four.png">
                    <div>地 图 管 理</div>
            </div>
            <div class="entrance_item" @click="loadNextPage('readingplatformadministrationindex')">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/read/five.png">
                    <div>阅读圈管理员</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getReadPlatSysSet} from '@/api/readingplatform';
    export default {
        name: "readingplatformindex",
        data() {
            return {
                bookState:0,
                mapState:0
            }
        },
        created() {
             getReadPlatSysSet().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let detailObject = data.data;
                             this.bookState = detailObject.bookState;
                             this.mapState = detailObject.mapState;
                        }
                    }).catch(() => {
                })
        },
        methods: {
            loadNextPage(pagePath) {
                this.$router.push({path: pagePath});
            }
        }
    }
</script>
<style lang="scss" scoped>
    .readingplatformindex{
        .entrance_list{
            padding:12px;
            .entrance_item{
                float: left;
                width: 170px;
                height: 170px;
                cursor:pointer;
                  img{
                        width: 90px;
                        height: 90px;
                        display: block;
                        margin: 10px auto;
                    }
                    div{
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        color: #409EFF;
                        font-size: 15px;
                    }
            }
        }
    }
</style>
