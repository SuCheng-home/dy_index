<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
            <el-input class="search-input search-input--right"
                      size="medium"
                      placeholder="请输入活动名称" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                      v-model.trim="searchTitle">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </backtool>

        <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 25">
            <el-table-column align="center" label="考评标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.activityName}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动时间">
                <template slot-scope="scope">
                    <span>{{scope.row.activityStartTime }}&nbsp;至&nbsp;{{scope.row.activityEndTime}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="活动创建人">
                <template slot-scope="scope">
                    <span>{{scope.row.huodongchuangjianren}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发布时间">
                <template slot-scope="scope">
                    <span>{{scope.row.upClassCount }}/{{scope.row.totalClassCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动状态">
                <template slot-scope="scope">
                    <span>{{scope.row.state}}</span>

                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="jumpToPage('activityDetail', {id: scope.row.id})">查看
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';

    export default {
        name: 'studentAwardingActivityListAll',
        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        data() {
            return {
                searchTitle: '',
                dataList: [{
                    activityName: '2021-2022评优活动',
                    id: 1,
                    activityStartTime: '2021-10-11',
                    activityEndTime: '2021-10-21',
                    awardingStartTime: '2021-10-22',
                    awardingEndTime: '2021-10-30',
                    upClassCount: 12,
                    totalClassCount: 28,
                    state: 1,
                    huodongchuangjianren: 123
                }, {
                    activityName: '2021-2022评优活动',
                    id: 1,
                    activityStartTime: '2021-10-11',
                    activityEndTime: '2021-10-21',
                    awardingStartTime: '2021-10-22',
                    awardingEndTime: '2021-10-30',
                    upClassCount: 12,
                    totalClassCount: 28,
                    state: 1,
                    huodongchuangjianren: 123
                }]
            }
        },
        methods: {
            getList() {

            },
            handleInputChange(isOn = true) {

            }
        }
    }
</script>

<style scoped>

</style>
