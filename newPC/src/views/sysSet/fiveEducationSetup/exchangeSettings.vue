<template>
    <div class="honourGradeList padding">
                <div>
                    <div class="header">
                        <el-row>
                            <el-col :span="24">
                                <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
                                <el-button type="primary" size="medium" @click="exchangeSettingsadd()">新建兑换规则</el-button>
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
                                label="模块" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.moduleType==1?"德育评价":""}}</template>
                            </el-table-column>
                            <el-table-column label="分类" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.dimensionName }}</template>
                            </el-table-column>
                             <el-table-column label="五育指标" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.indicatorName }}</template>
                            </el-table-column>
                             <el-table-column label="兑换比例" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.scale }} ：1</template>
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
                                               @click="delPeanutScale(scope.row.id)">删除
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
    import {getPeanutScaleList,delPeanutScale} from '@/api/fiveEducationSetup';

    export default {
        data() {
            return {
                type:this.$route.query.type,
                title:"",
                dataList: [],
                moduleType:1
            }
        },
        created() {
            this.getPeanutScaleList()
        },
        mixins: [mixins],
        methods: {
            exchangeSettingsadd(){
              this.$router.push({path: 'exchangeSettingsadd'});
            },
            indicatoreidt(id){
                this.$router.push({path: 'exchangeSettingsadd',query: { id: id}});
            },
            delPeanutScale(id) {
                this.$confirm('是否删除兑换规则?', '提示', {
                    type: 'error'
                }).then(() => {
                    delPeanutScale(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除兑换规则成功!'
                            });
                            this.getPeanutScaleList();
                        }
                    })
                }).catch(() => {
                });
            },
            getPeanutScaleList() {
                getPeanutScaleList({
                    moduleType: this.moduleType,
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

