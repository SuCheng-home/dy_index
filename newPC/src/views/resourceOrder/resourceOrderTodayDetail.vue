<template>
    <div class="page">
        <back-tool>
        </back-tool>
        <el-table
                ref="multipleTable"
                :data="dataList"
                border
                style="width: 100%"
                :height="nobottommaxH"
                fit
        >
            <el-table-column
                    label="资源名称"
                    show-overflow-tooltip
                    min-width="200px"
                    prop="resourceName"
                    :resizable="false"
            >
            </el-table-column>
            <el-table-column
                    label="	预约人"
                    width="250px"
                    prop="orderName"
                    :resizable="false"
            >
            </el-table-column>
            <el-table-column
                    label="预约时间"
                    width="300px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                    {{ scope.row.beginTime | trimSeconds }} 到 {{ scope.row.endTime | trimSeconds }}
                </template>
            </el-table-column>
            <el-table-column
                    label="使用内容(预约理由)"
                    min-width="200px"
                    prop="orderResion"
                    :resizable="false"
                    show-overflow-tooltip
            >
            </el-table-column>
        </el-table>
    </div>

</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {toOrderResourceDetail} from '@/api/resourceOrder';

    export default {
        data: function () {
            return {
                time: this.$route.query.time,
                dataList: []
            }
        },
        components: {
            BackTool
        },
        methods: {
            loadDataHandler(time) {
                toOrderResourceDetail({
                    time
                }).then(res => {
                    const dataList = [];
                    res.data.data.forEach(dataEntry => {
                        if (dataEntry.status === 5 || dataEntry.status === 3) {
                            dataList.push(dataEntry);
                        }
                    });
                    this.dataList = dataList;
                })
            },
        },
        mixins: [windowResizeMixin],
        created() {
            this.loadDataHandler(this.time);
        },
        filters: {
            trimSeconds(value) {
                return value.slice(0, value.lastIndexOf(':'));
            }
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }
</style>
