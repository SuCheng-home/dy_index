<template>
    <div class="readingplatformadministrationindex">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button type="primary" size="medium" @click="jumpTo('readingplatformgradeadd')">添加</el-button>
                </el-col>
            </el-row>
        </div>
            <el-table
                ref="multipleTable"
                :data="dataList"
                :height="maxH"
                border 
                style="width: 100%"
                >           			
                <el-table-column align="center"  label="级别" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.index }}级</template>
                </el-table-column>
                <el-table-column align="center" label="积分" >
                    <template slot-scope="scope">{{ scope.row.medalPoint }}分</template>
                </el-table-column>
                <el-table-column align="center"  label="等级名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                     {{ scope.row.medalName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="图片" >
                    <template slot-scope="scope">
                           <image-previewer tag="richtext">
                                 <img :src="scope.row.medalLogo" alt="">
                          </image-previewer>
                      </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" type="text" @click="jumpTo('readingplatformgradeeidt',{id:scope.row.id})"
                                      >
                                编辑
                            </el-button>
                            <el-button size="small" type="text" @click="deleteHandler(scope.row.id)">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {getSchoolReadPlatSetInfo, deleteSchoolMedalByMedalId} from '@/api/readingplatform';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    export default {
         components: {
            ImagePreviewer
        },
        data() {
            return {
                dataList: []
            }
        },
        created() {
            this.getSchoolActivityPageListFunc();
        },
        mixins: [
            mixin
        ],
        methods: {
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
    .readingplatformadministrationindex {
        padding:12px;
        box-sizing: border-box;

        .header {
            margin-bottom: 10px;
        }
       img{
           height: 30px;
       }
    }
</style>
