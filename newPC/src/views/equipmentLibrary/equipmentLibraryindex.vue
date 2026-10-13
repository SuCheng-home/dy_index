<template>
    <div class="app-container ">
        <div class="filter-container">
            <el-col :span="19">
               <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
                <el-select  size="medium" v-model="listQuery.equipType" placeholder="请选择设备类型" @change="handleFilter">
                        <el-option v-for="item in typeList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                </el-select>
                <el-select  size="medium" v-model="listQuery.status" placeholder="请选择设备类型" @change="handleFilter">
                        <el-option  label="全部设备状态" value="0"></el-option>
                        <el-option  label="离线" value="1"></el-option>
                        <el-option  label="在线" value="2"></el-option>
                </el-select>
            </el-col>
            <el-col :span="5">
                <el-input size="medium"  placeholder="请输入设备号" v-model.trim="listQuery.scanEquipId" @change="handleFilter">
                  <el-button size="medium" slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                </el-input>
            </el-col>
        </div>
        <el-table stripe :data="dataList"  :height="`${maxH}px`" border style="width: 100%">
              <el-table-column  label="设备号" show-overflow-tooltip>
                <template slot-scope="scope">
                   {{scope.row.equipmentId}}
                </template>
            </el-table-column>  
            <el-table-column label="所属学校" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.schoolName}}
                </template>
            </el-table-column>   
            <el-table-column label="设备类型" align="center"  show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.equipTypeName}}
                </template>
            </el-table-column>       
            <el-table-column label="设备状态" align="center">
                <template slot-scope="scope">
                        <el-tag  size="mini" v-if="(scope.row.status==2) && (listQuery.equipType=='10001')" type="success" >在线</el-tag>
                        <el-tag  size="mini" v-if="(scope.row.status==1) && (listQuery.equipType=='10001')" type="danger" >离线</el-tag>
                        <span v-if="listQuery.equipType!='10001'">----</span>
                </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" >
                <template slot-scope="scope">                       
                    <span v-if="scope.row.updateTime"> {{scope.row.updateTime.substring(0,19)}}</span>
                    <span v-else>{{scope.row.createTime.substring(0,19)}}</span>
                </template>
            </el-table-column> 
        </el-table>
        <el-pagination
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNo"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import {findDicsByCode,getAllScancodeEquipmentListByState} from '@/api/equipmentLibrary';
    import mixin from '@/mixins/windowResize';
    export default {
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    scanEquipId: '',
                    equipType:'',
                    status:'0'
                },
                dataList: [],
                total:null,
                typeList:[]
                
            }
        },
        created() {
            this.findDicsByCodes();
        },
        mixins: [mixin],       
        methods: {           
            //获取类型
            findDicsByCodes() {
                findDicsByCode().then(res => {
                    let data = res.data.data;
                    this.typeList = data;
                    this.listQuery.equipType = data[0].code;
                    this.getAllScancodeEquipmentListByStates();
                });
            },
            //获取列表          
            getAllScancodeEquipmentListByStates() {
                getAllScancodeEquipmentListByState(this.listQuery)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    }).catch(err => {
                })
            },
            //搜索
            handleFilter (){
                this.listQuery.pageNo=1;
                this.getAllScancodeEquipmentListByStates();
            }, 
            //切换码数          
            handleSizeChange(val) {
                this.listQuery.pageNo=1;
                this.listQuery.pageSize = val;
                this.getAllScancodeEquipmentListByStates();
            },
            //切换页数
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getAllScancodeEquipmentListByStates();
            },
            
            
        }
    }
</script>
<style lang="scss" scoped>
    .pagination-container {
        margin-top: 10px;
    }
    .filter-container{
        padding-bottom: 10px;
        overflow: hidden;
    }
</style>
