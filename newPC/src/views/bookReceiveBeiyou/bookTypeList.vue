<template>
    <div class="stack-room-wrap">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button
                        class="header-buttom"
                        size="medium"
                        type="default"
                        @click="$router.back()"
                    >返回
                    </el-button>
                    <el-button
                        class="header-buttom"
                        size="medium"
                        type="primary"
                        @click="jumpToPage('bookTypeAddEdit')"
                    >添加
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <el-table border stripe :data="dataList" borderNo :height="notbmaxH - 124" style="width: 100%" id="outTable">
            <el-table-column align="center" prop="typeName" label="类型名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="ownerNames" label="负责人" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="orderNo" label="排序" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="jumpToPage('bookTypeAddEdit', {id: scope.row.id})">编辑
                    </el-button>
                    <el-button size="small" type="text danger" @click="deleteHandler(scope.row.id)"  class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import moment from 'moment';
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {
        getBookTypeBySchoolId,
        deleteBookTypeById
    } from '@/api/bookReceiveBeiyou';
    export default {
        name: "bookReceiveList",
        mixins: [mixins, baseMixin],
        components: {ImagePreviewer},
        data() {
            return {
                activeName: 'bookReceiveList',
                duration: [moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                typeId: '0',
                searchName: '',

                dataList: []
            }
        },
        created() {
            this.getBookTypeBySchoolIdFunc();
        },
        methods: {
            // 点击tab
            clickTab() {
                this.$router.replace({path: this.activeName})
            },
            getBookTypeBySchoolIdFunc() {
                getBookTypeBySchoolId()
                    .then(res => res.data)
                    .then(data => {
                        data.data.forEach(item => {
                            let ownerNames = '';
                            if(item.userJson) {
                                ownerNames = JSON.parse(item.userJson).map(user => user.name).join(' , ');
                            }
                            item.ownerNames = ownerNames;
                        });
                        this.dataList = data.data;
                    })
            },
            deleteHandler(id) {
                this.$confirm('是否确定要删除该类型', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        deleteBookTypeById({
                            id
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('删除成功');
                                    this.getBookTypeBySchoolIdFunc();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    });
            }
        }
    }
</script>

<style scoped>
    .stack-room-wrap {
        padding:12px;
    }


    .header {
        padding-bottom: 10px;
    }
</style>
