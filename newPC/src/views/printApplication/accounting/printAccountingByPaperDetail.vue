<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <a class="export-btn" :href="exportUrl" download="用户统计" target="_blank" v-if="dataList.length">
                <el-button size="medium" class="filter-item" type="primary" icon="upload">导出</el-button>
            </a>
            <el-input placeholder="申请名称/申请人" size="medium" v-model="searchTitle"
                      class="search-input search-input--right"
                      @keyup.enter.native="userPaperSizeDeatilStatisticsFunc">
                <el-button slot="append" icon="el-icon-search" @click="userPaperSizeDeatilStatisticsFunc"></el-button>
            </el-input>
        </backtool>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column label="用户" prop="teacherName">
            </el-table-column>
            <el-table-column label="单面" prop="totalPaperSingle">
            </el-table-column>
            <el-table-column label="双面" prop="totalPaperDouble">
            </el-table-column>
            <el-table-column label="总张数" prop="paperNum">
            </el-table-column>
            <el-table-column label="总金额" prop="totalCost">
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    import {
        userPaperSizeDeatilStatistics
    } from '@/api/printApplication';

    import {mapGetters} from 'vuex';

    export default {
        components: {
            Backtool
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo']),
            exportUrl() {
                return `${global.BasePath}structure/printSeniorApply/exportUserPaperSizeDeatilStatistics?startDate=${this.startDate}&useType=${this.useType}&endDate=${this.endDate}&paperSizeType=${this.paperSizeType}&token=${this.$store.getters.token}`;
            }
        },
        data() {
            return {
                searchTitle: '',
                startDate: this.$route.query.startDate,
                paperSizeType: this.$route.query.pageSizeType,
                endDate: this.$route.query.endDate,
                useType: this.$route.query.useType,
                dataList: []
            };
        },
        mixins: [mixin, baseMixin],
        created() {
            this.userPaperSizeDeatilStatisticsFunc();
        },
        methods: {
            userPaperSizeDeatilStatisticsFunc() {
                userPaperSizeDeatilStatistics({
                    startDate: this.startDate,
                    endDate: this.endDate,
                    paperSizeType: this.paperSizeType,
                    searchTitle: this.searchTitle,
                    useType:this.useType
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    })
            }
        }
    }
</script>
<style scoped lang="scss">
    .search-input {
        width: 200px;
        float: right;
    }
</style>
