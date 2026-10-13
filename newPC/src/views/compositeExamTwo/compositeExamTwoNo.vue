<template>
    <div class="compositeExamTwoNo">
        <div class="header">
             <el-button size="medium" @click="$router.back()">返回</el-button>
           
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <template v-for="item in notReaderUserList">
                <div class="read-box-item">
                    <div class="read-box-item-header" :style="{backgroundImage:'url('+item.avatar+')'}"></div>
                    <div class="read-box-item-footor">
                        <div class="name">{{item.name}}</div>
                    </div>
                </div>
            </template>
          </div>  
    </div>
</template>

<script>
    import {getComplexCheckStatistics} from '@/api/compositeExamSetTwo';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                notReaderUserList: [],
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            getComplexCheckStatistics(this.$route.query)
                    .then(res => res.data)
                    .then(data => {                       
                        this.notReaderUserList = data.data.notReaderUserList;
                    })
        },
    }
</script>

<style lang="scss" scoped>
    .compositeExamTwoNo {
        padding:12px;
         .header {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
       }
       .body{
           overflow:auto;
            .read-box-item {
            width: 80px;
    height: 90px;
    float: left;
    margin: 10px 0 0 20px;
    text-align: center;
    line-height: 30px;
    }

    .read-box-item-header {
        width: 60px;
        height: 60px;
        background-position: center center;
        background-size: cover;
        border-radius: 50%;
        margin: 0 auto;
    }
       }
    }
   
</style>
