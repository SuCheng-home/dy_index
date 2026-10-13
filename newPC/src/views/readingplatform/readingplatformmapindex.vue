<template>
    <div class="readingplatformmapindex">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button type="primary" size="medium" @click="jumpTo('readingplatformmapadd')">新增地图</el-button>
                </el-col>
            </el-row>
        </div>
           <div class="body" :style="`height: ${nobottommaxH}px;`">
               <div class="li" v-for="(item,index) in dataList" :key="index"  @click="jumpTo('readingplatformmapeidt',{id:item.id})">
                   <img :src="item.mapLogo" alt="">
                   <div class="name">{{item.mapName}}地图</div>
                   <i class="el-icon-delete" @click.stop="deleteReadPlatMaps(item.id)"></i>
                </div>
                <default-page Mes="暂无分组" v-if="mynum!=0"></default-page>
           </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {readPlatMapList,deleteReadPlatMap} from '@/api/readingplatform';
    export default {
        data() {
            return {
                dataList: [],
                mynum:-1
            }
        },
        created() {
           this.readPlatMapLists();
        },
        mixins: [mixin],
        methods: {
            readPlatMapLists(){
               readPlatMapList().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                           this.dataList=data.data;
                           this.mynum=data.data.length;
                        }
                    }).catch(() => {
                })
            },
             deleteReadPlatMaps(id) {
                //单个删除
                this.$confirm('是否删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteReadPlatMap(id).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.readPlatMapLists();
                    }
                }).catch(() => {
                });
                }).catch(() => {

                });
            },
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            
            deleteHandler(id) {
                //单个删除
                this.$confirm('是否删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delMettingFunc(id);
                }).catch(() => {

                });
            },
            delMettingFunc(id) {
                deleteSchoolMedalByMedalId(id).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSchoolActivityPageListFunc();
                    }
                }).catch(() => {
                });
            },
            getSchoolActivityPageListFunc() {
                getSchoolReadPlatSetInfo().then(res => res.data).then(data => {
                    if (data.code === 200) {
                        for(let i=0;i<data.data.schoolMedals.length;i++){
                            data.data.schoolMedals[i].index=i;
                        }
                        this.dataList=data.data.schoolMedals; 
                    } 
                }).catch(() => {
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .readingplatformmapindex {
        padding:12px;
        box-sizing: border-box;
        .header {
           border-bottom: 1px solid #e7eaec;
           padding-bottom: 10px;
        }
        .body{
            overflow: auto;
            .li{
                float: left;
                margin: 10px;
                position: relative;
                cursor:pointer ;
                img{
                    width: 180px;
                    display: block;
                }
                .name{
                    position: absolute;
                    bottom:0;
                    left: 0;
                    width: 100%;
                    height: 36px;
                    background: rgba($color: #000, $alpha: 0.5);
                    color: #fff;
                    line-height: 36px;
                    text-align: center;
                }
                .el-icon-delete{
                    position: absolute;
                    top:5px;
                    right: 5px;
                    font-size: 18px;
                    color:#F56C6C;
                }
            }
        }
    }
</style>
