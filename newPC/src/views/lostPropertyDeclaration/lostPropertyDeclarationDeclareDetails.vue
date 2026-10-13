<template>
    <div class="lostPropertyDeclarationDetails">
        <back-tool>
            <el-button size="medium" v-if="status=='1' && isShowByPermission('/searchfound/createSearch')" type="primary"
                       @click="generate()">生成寻物启事
            </el-button>
           
        </back-tool>
        <div class="mainRepairContent" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
                 <div class="title">申报详情</div>
                <el-form ref="ruleForm" label-width="140px">
                <el-form-item v-show="declareUserName!=''" label="失主姓名：">
                    <div>{{declareUserName}}</div>
                </el-form-item>
                <el-form-item v-show="declareUserPhone!=''" label="失主手机：">
                    <div>{{declareUserPhone}}</div>
                </el-form-item>
                <el-form-item label="申报时间：">
                    <div>{{createDate|formatTimeFilter}}</div>
                </el-form-item>
                <el-form-item v-show="inscribeDeptName!=''" label="落款部门：">
                    <div>{{inscribeDeptName}}</div>
                </el-form-item>
                <el-form-item label="内容：">
                    <div>{{content}}</div>
                </el-form-item>
                <el-form-item v-if="lostSearchPicList.length>0" label="失物图片：">
                    <div class="repairimgs imgfack" v-if="lostSearchPicList.length>0">
                        <image-previewer tag="richtext" v-show="photoUrlArr.length">
                    <span class="img" :key="index" v-for="(item, index) in photoUrlArr">
                        <img :src="item.src">
                    </span>
                </image-previewer>
                    </div>
                </el-form-item>
            </el-form>
            </div>
            
        </div>
    </div>
</template>

<script>
    import {isShowByPermission} from "@/utils";
    //返回组件
    import BackTool from '@/components/BackTool';
    //获取详情的方法
    import {lostDeclareDetails} from '@/api/lostPropertyDeclaration';
    //图片预览
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import mixin from '@/mixins/windowResize';

    export default {
        name: 'lostPropertyDeclarationDetails',
        components: {
            ImagePreviewer,
            BackTool,
        },
        data() {
            return {
                getQuery: {
                    lostDeclareId: this.$route.query.id
                },
                status: this.$route.query.status?this.$route.query.status:'',
                inscribeDeptName: '',
                content: '',
                createDate: '',
                lostSearchPicList: [],
                declareUserName: '',
                declareUserPhone: '',
                photoUrlArr: []
            }
        },
        mixins: [mixin],
        created() {
            lostDeclareDetails(this.getQuery).then(res => {
                let data = res.data.data;
                this.inscribeDeptName = data.inscribeDeptName;
                this.content = data.content;
                this.createDate = data.createDate;
                this.lostSearchPicList = data.lostSearchPicList;
                this.declareUserName = data.declareUserName;
                this.declareUserPhone = data.declareUserPhone;
                this.readCount = data.readCount;
                this.id = data.id;
                this.photoUrlArr = data.lostSearchPicList.map((entry) => ({
                    src: entry.picUrl
                }));
                this.status=data.status;
            })
        },
        filters: {
            formatTimeFilter(date) {
                return date?date.split(".")[0]:'';
            }
        },
        methods: {
            isShowByPermission,
            //生成启示跳转
            generate() {
                this.$router.push({
                    path: 'lostPropertyDeclarationAdd',
                    query: {
                        id: this.getQuery.lostDeclareId
                    }
                })
            },
        }

    }
</script>

<style scoped>
    .mainRepairContent {
        padding-top: 20px;
        overflow: auto;
    }
      .body{
        width: 810px;
        margin: 0 auto;
    }
   .img img {
        width: 80px;
        height: 80px;
        margin: 10px;
    }
    .dealcontent {
        border: 1px solid #9EA7B3;
        border-radius: 5px;
    }

    .dealcontent > p {
        padding: 0 15px;
        margin: 0;
    }

    .repairimgs .images {
        width: 100px;
        height: 100px;
        margin: 5px;
        display: inline-block;
    }

    .imgfack.repairimgs {
        min-height: 110px;
    }

    .lostPropertyDeclarationDetails {
        padding:12px;
    }
</style>
<style lang="scss" scoped>
.menu-tools{
    position: relative;
}
.lostPropertyDeclarationDetails .title{
    height: 20px;
    line-height: 20px;
    margin: 10px;
    padding-left: 8px;
    border-left: 4px solid #409EFF;
    color: #333;
}
</style>