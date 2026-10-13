<template>
    <div id="noticeIndex" class="calendar-list-container">
        <!-- <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="操作日志" name="one"></el-tab-pane>
      <el-tab-pane label="档案日志" name="two"> -->
           <div class="filter-container">
            <el-select @change="logListFunc" v-model="listQuery.userType" size="medium">
                <el-option :value="0" label="全部用户类型"></el-option>
                <el-option :value="1" label="老师"></el-option>
                <el-option :value="2" label="学生"></el-option>
            </el-select>
            <el-input class="search-input search-input--right"
                      size="medium"
                      placeholder="姓名" icon="el-icon-search" @keyup.enter.native="logListFunc"
                      v-model.trim="listQuery.userName">
                <el-button size="medium" slot="append" icon="el-icon-search" @click="logListFunc"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="姓名" prop="userName">
            </el-table-column>
            <el-table-column align="center" label="用户类型" prop="userType">
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span>{{scope.row.type | typeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作员" prop="operationName">
            </el-table-column>
            <el-table-column align="center" label="操作时间">
                <template slot-scope="scope">
                    <span>{{scope.row.operationDate | timeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作描述" prop="description">
            </el-table-column>
        </el-table>
        <div  class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

      <!-- </el-tab-pane>
</el-tabs> -->
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';

    import {logList} from '@/api/systemSet/org';
    import {parseToConstants} from '@/utils/utils';

    export default {
        name: "logList",
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    userName: '',
                    userType: 0
                },
                dataList: [],
                total: 0,
                activeName:'two'
            }
        },
        mixins: [mixin],
        filters: {
            timeFilter(value) {
                return value.split('.')[0];
            },
            typeFilter(value) {
                return parseToConstants(value, 'studentOperationTypeConstants')
            }
        },
        created() {
            this.logListFunc();
        },
        methods: {
             tabsfun(){
               if(this.activeName=='one'){
                   this.$router.push({ path:'/main/sysManage/operation/index'})
               }
            },
            logListFunc() {
                logList(this.listQuery)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    })
            },
            handleSizeChange(pageSize) {
                this.listQuery.pageSize = pageSize;
                this.logListFunc();
            },
            handleCurrentChange(pageNo) {
                this.listQuery.pageNo = pageNo;
                this.logListFunc();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../styles/mixin";

    .filter-container{
        padding-bottom: 10px;
        overflow: hidden;
    }
    .calendar-list-container{
        padding: 12px;
    }
</style>
