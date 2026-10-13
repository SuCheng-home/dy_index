<template>
    <div class="campusPatrolSetupTermIndex">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button  type="primary" @click="campusPatrolSetupTermAdd()"  size="medium">新建巡查项</el-button>
        </div>
        <div class="main-wrap">
           <div class="ul">
               <div class="li" v-for="item in dataList" :key="item.id">
                   <i class="el-icon-edit"  @click="campusPatrolSetupTermEidt(item.id)"></i>
                   <i class="el-icon-delete" @click="delComplexCheckItem(item.id)"></i>
                    <img @click="campusPatrolSetupTermInfo(item.id)" :src="item.cover||'https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png'" />                    
                         <el-tooltip class="item" v-if="item.checkItemName.length>10" effect="dark" :content="item.checkItemName" placement="top">
                            <div class="name" @click="campusPatrolSetupTermInfo(item.id)">
                            {{item.checkItemName}}
                            </div>
                        </el-tooltip>                      
                       <div class="name" v-else @click="campusPatrolSetupTermInfo(item.id)">
                          {{item.checkItemName}}
                      </div>
               </div>              
           </div>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {getComplexCheckItemList, delComplexCheckItem} from '@/api/compositeExamSetTwo';

    export default {
        data() {
            return {
                dataList: [],
            }
        },
        created() {
            this.getComplexCheckItemList();
        },
        mixins: [mixin],
        methods: {  
            campusPatrolSetupTermAdd() {
                this.$router.push({
                    path: 'campusPatrolSetupTermAdd',
                })
            },
            campusPatrolSetupTermEidt(id) {
                this.$router.push({
                    path: 'campusPatrolSetupTermEidt',
                    query: {
                        id: id
                    }
                })
            },
            campusPatrolSetupTermInfo(id) {
                this.$router.push({
                    path: 'campusPatrolSetupTermInfo',
                    query: {
                        id: id
                    }
                })
            },
            delComplexCheckItem(id) {
                let _this = this;
                this.$confirm('确认删除该巡查项？', '提示', {
                    type: 'error'
                }).then(() => {
                    delComplexCheckItem(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getComplexCheckItemList();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
            getComplexCheckItemList() {
                this.dataList = [];
                getComplexCheckItemList().then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.dataList = data.data;
                    }
                }).catch(() => {
                })
            }
        }
    }
</script>
<style scoped lang="scss">
.campusPatrolSetupTermIndex{
    padding:12px;
}
.top {
      padding-bottom: 10px;
      border-bottom: 1px solid  #e7eaec;
    }
    .ul{
        overflow:hidden;
        .li{
            float: left;
            width: 150px;
            margin: 10px;
            text-align: center;
            cursor:pointer;
            position: relative;
            img{
                width:80px;
            }
            .name{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 30px;
                font-size: 14px;
                color: #303133;
                font-weight: 600;
            }
            i{
                position: absolute;
                right: 0;
                font-size: 18px;
                color:#F56C6C;
            }
            .el-icon-edit{
                    top: 28px;
                    color:#409EFF;
            }
        }
    }
</style>
