<template>
    <div class="benifitsReceiveAccounting">
         <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="物品消耗统计" name="one">         
        <div class="header-line">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" v-if="dataList.length" @click.native="exportHandler">导出</el-button>
        </div>
        <div class="hide-area">
            <table id="table">
                <thead>
                <tr>
                    <td>物品名称</td>
                    <td>消耗数量</td>
                    <td>领取人员</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="goodItem in dataList">
                    <td>{{goodItem.goodsTile}}</td>
                    <td>{{goodItem.goodsCount}}</td>
                    <td>{{goodItem.userNames}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <el-table id="table" stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="`${nobottommaxH-60}px`">
            <el-table-column width="200px" label="物品名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.goodsTile}}
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="消耗数量" prop="goodsCount">
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="领取人员">
                <template slot-scope="scope">
                    <span>{{scope.row.userNames}}</span>
                </template>
            </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="教师领取情况统计" name="two"></el-tab-pane>
    </el-tabs>
       

    </div>
</template>

<script>
    import baseMixin from '@/mixins/baseMixin';
    import windowResize from '@/mixins/windowResize';
    import {export_table_to_excel} from '@/vendor/Export2Excel';

    import Backtool from '@/components/BackTool';
    import {getThWelfareGoodsStatics} from '@/api/benifits';

    export default {
        name: "benifitsReceiveAccounting",
        data() {
            return {
                exportUrl:``,
                id: this.$route.query.id,
                dataList: [],
                activeName:'one'
            }
        },
        mixins: [baseMixin, windowResize],
        created() {
            this.getThWelfareGoodsStaticsFunc();
        },
        components: {
            Backtool
        },
        methods: {
            exportHandler() {
                export_table_to_excel('table');
            },
            tabsfun(){
                if(this.activeName=='two'){
                      this.$router.replace({
                        path: "benifitsReadOrNotAccounting",
                        query: { id: this.id }
                    });
                }
            },
            getThWelfareGoodsStaticsFunc() {
                getThWelfareGoodsStatics({
                    welfareId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    });
            }
        }
    }
</script>

<style scoped>
    .benifitsReceiveAccounting{
        padding:12px;
    }
    .header-line {
      padding-bottom:10px;
    }
    .hide-area {
        display: none;
    }
</style>
