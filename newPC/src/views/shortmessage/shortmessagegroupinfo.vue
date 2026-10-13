<template>
    <div class="shortmessageMassadd">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="shortmessagegroupadd()">编辑</el-button>
        </div>
        <div class="body" :style="`height: ${maxH}px;`">
            <div class="from-box">
                <el-form :model="singleData" label-width="180px" :rules="singleRules" ref="single">
                    <el-form-item label="组名称" prop="groupName">
                     {{singleData.groupName}}
                   </el-form-item>
                    <el-form-item label="手机号" prop="mobiles">
                        <div v-html="singleData.mobiles"></div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import {getSmsMobileGroupInfoById} from "@/api/shortmessage";
    import baseMixin from "@/mixins/baseMixin";
    import mixin from "@/mixins/windowResize";
    export default {
        name: "statisticsIndex",
        data() {
            return {
                singleData: {
                    mobiles: '',
                    groupName:""
                },
            };
        },
        mixins: [baseMixin, mixin],
        created() {
            getSmsMobileGroupInfoById(this.$route.query.id)
                    .then(res => res.data)
                    .then(data => {
                        this.singleData.groupName= data.data.groupName;
                        this.singleData.mobiles= JSON.parse(data.data.mobiles).join('\n');
                    })
        },
        methods: {           
            shortmessagegroupadd(){
         this.$router.push({path: 'shortmessagegroupadd',query:{id:this.$route.query.id}});
    }
        }
    };
</script>

<style lang="scss" scoped>
    .shortmessageMassadd {
        padding: 12px;

        .top {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .body {
            overflow: auto;

            .from-box {
                padding-top: 20px;
                width: 810px;
                margin: 0 auto;
            }
        }
    }
</style>
