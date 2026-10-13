<template>
    <div class="honourGradeList padding">
                <div>
                    <div class="header">
                        <el-row>
                            <el-col :span="24">
                                <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
                                <el-button type="primary" size="medium" @click="indicatoradd()">创建指标</el-button>
                                <el-button type="primary" v-if="type==1" size="medium" @click="exchangeSettings()">兑换设置</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div>
                        <el-table
                            ref="multipleTable"
                            :data="dataList"
                            border
                            stripe
                            class="dataList"
                            :height="nobottommaxH"
                            style="width: 100%">
                            <el-table-column v-if="type==1"
                                label="指标分类" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.typeName}}</template>
                            </el-table-column>
                            <el-table-column label="指标名称" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.title }}</template>
                            </el-table-column>
                            <el-table-column label="上报权限" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.operatTh==1"> 老师 </span>
                                    <span v-if="scope.row.operatClassHeader==1"> 班主任 </span>
                                    <span v-if="scope.row.operatPh==1"> 家长 </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="上报字段" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isTitle==1"> 主题（名称） </span>
                                    <span v-if="scope.row.isBehContext==1"> 内容/评价/感受 </span>
                                    <span v-if="scope.row.isTime==1"> 时间 </span>
                                    <span v-if="scope.row.isAdress==1"> 地点 </span>
                                    <span v-if="scope.row.isTimeLength==1"> 时长 </span>
                                    <span v-if="scope.row.isSport==1"> 体健技能 </span>
                                    <span v-if="scope.row.isArt==1"> 艺术技能 </span>
                                    <span v-if="scope.row.isLabor==1"> 劳动技能 </span>
                                    <span v-if="scope.row.isFile==1"> 附件/材料 </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="审核权限" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.batchClassHeader==1"> 班主任 </span>
                                    <span v-if="scope.row.batchChineseTh==1"> 语文老师 </span>
                                    <span v-if="scope.row.batchTh==1"> 任课老师 </span>
                                    <span v-if="scope.row.batchMan==1"> 管理员 </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                align="center"
                                label="操作" width="220">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text"
                                               @click="indicatoreidt(scope.row.id)">编辑
                                    </el-button>
                                    <el-button size="small" type="text"
                                               @click="delPeanutIndicator(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import {getPeanutIndicatorList,delPeanutIndicator} from '@/api/fiveEducationSetup';

    export default {
        data() {
            return {
                type:this.$route.query.type,
                title:"",
                dataList: [],
            }
        },
        created() {
            this.getPeanutIndicatorList()
        },
        mixins: [mixins],
        methods: {
            indicatoradd(){
              this.$router.push({path: 'indicatoradd',query: {type:this.type}});
            },
            exchangeSettings(){
              this.$router.push({path: 'exchangeSettings',query: {type:this.type}});
            },
            indicatoreidt(id){
                this.$router.push({path: 'indicatoradd',query: { id: id,type:this.type}});
            },
            delPeanutIndicator(id) {
                this.$confirm('是否删除指标?', '提示', {
                    type: 'error'
                }).then(() => {
                    delPeanutIndicator(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getPeanutIndicatorList();
                        }
                    })
                }).catch(() => {
                });
            },
            getPeanutIndicatorList() {
                getPeanutIndicatorList({
                    title: this.title,
                    type: this.type
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.dataList = data.data;
                        }
                    }).catch(() => {
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .padding {
        padding:12px;
        box-sizing: border-box;
    }

    .honourGradeList {
        .header {
            padding-bottom: 10px;
        }
    }

    .addOrganFrom {
        width: 80%;
    }

</style>

