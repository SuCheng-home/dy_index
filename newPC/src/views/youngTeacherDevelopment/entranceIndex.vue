<template>
    <div class="entrance_wrap">
        <div class="entrance_list clearfix">
            <div class="entrance_item">
                <a @click="loadNextPage('assessmentItemSet')">
                    <img :src="require('@/assets/images/system_set/check_set_icon.png')">
                    <div>考核项设置</div>
                </a>
            </div>
            <div class="entrance_item">
                <a @click="loadNextPage('evaluateCheckList')">
                    <img :src="require('@/assets/images/system_set/statistics_icon.png')">
                    <div>数据统计</div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "entranceIndex",
        data() {
            return {
            }
        },
        created() {
        },
        methods: {
            loadNextPage(pagePath) {
                this.$router.push({path: pagePath});
            }
        }
    }
</script>

<style scoped>
    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }
</style>
<style lang="scss" scoped>
    .entrance_wrap{
        .entrance_list{
            padding: 20px;
            .entrance_item{
                float: left;
                width: 120px;
                height: 120px;
                a{
                    display: block;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    img{
                        width: 80px;
                        height: 80px;
                        display: block;
                        margin: 10px auto;
                    }
                    div{
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        color: #333;
                    }
                }
            }
        }
    }
</style>
