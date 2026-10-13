<template>
  <div class="ventilatearoomindex" v-loading="loading">
    <div class="el-row menu-tools">
      <el-button  @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium"   @click="ventilatearoomadd()">新增地点</el-button>      	
      <el-button type="primary" size="medium"   @click="dialogVisible=true">班级初始化</el-button>
      <el-button type="primary" size="medium"   @click="policySettingslist()">打卡策略设置</el-button>
      <el-button class="filter-item" type="primary" size="medium" @click="generateRecords();">立即生效</el-button>
      <el-button class="filter-item" type="danger" size="medium" @click="bigdeletePlaces();">删除</el-button>      
      <el-input class="search-input search-input--right" size="medium" placeholder="请输入打卡地点" v-model.trim="query.searchName" @input="inputsearchNametime()">
            <el-button slot="append" icon="el-icon-search" @click="inputsearchNametime()"></el-button>
       </el-input>
    </div>
     <div class="schoolWrap scrollStyle" >
           <el-table  :data="dataList"  border stripe  :height="maxH" @select="selectionChangeHandler" @select-all="selectionChangeHandler" >
             <el-table-column type="selection" align="center" width="65">
			</el-table-column>
                <el-table-column   prop="placeName" label="打卡地点"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column    label="负责人"  align="center" show-overflow-tooltip> 
                       <template slot-scope="scope">{{scope.row.checkUserJson|checkUserJsonfun}}</template>
                </el-table-column>
                <el-table-column   prop="strategyName" label="打卡策略"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   label="操作"  align="center" >
                    <template slot-scope="scope">
						<el-button size="small" type="text" @click="ventilatearoomeidt(scope.row.id)">编辑</el-button>
						<el-button size="small" type="text" @click="deletePlaces(scope.row.id)" class="buttontextred">删除</el-button>
					</template>
                </el-table-column>
            </el-table>   
    </div>
     <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div> 
        <el-dialog title="选择策略" :visible.sync="dialogVisible" width="45%">
			<div class="radiobox">
			    <el-radio-group v-model="strategyId">
            <el-radio :label="item.id" v-for="(item,index) in cllist" :key="index">{{item.strategyName}}</el-radio>
        </el-radio-group>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="initClassPlaces()">确 定</el-button>
			</span>
		</el-dialog>   
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import baseMixin from "@/mixins/baseMixin";
import { queryPlaceBySchoolId, deletePlace,initClassPlace,listStrategyBySchoolId,generateRecord} from "@/api/ventilatearoom";
export default {
  data() {
    return {
      dataList: [],
      cllist:[],
      selected:[],
      total: null,
      strategyId:'',
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        searchName: ""
      },
      dialogVisible:false,
      loading:false
    };
  },
  mixins: [mixins, baseMixin],
  created() {
    this.queryPlaceBySchoolIds();
    this.listStrategyBySchoolIds();
  },
  filters: {
    checkUserJsonfun(list) {
      let mylist = JSON.parse(list);
      let name = "";
      for (let i = 0; i < mylist.length; i++) {
        name += mylist[i].name + "   ";
      }
      return name;
    }
  },
  methods: {
    selectionChangeHandler(selection) {
        this.selected = selection;       
			},
    //获取策略列表
    listStrategyBySchoolIds() {
        listStrategyBySchoolId().then(res => {
              this.cllist = res.data.data;
              if(this.cllist.length>0){
                 this.strategyId=this.cllist[0].id;
              }              
         });
    }, 
    initClassPlaces(){
      if(!this.strategyId){
         this.$message.error('请先设置策略');
          return;
      };
       this.$confirm("确认要初始化吗？", "初始化", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading=true;
          this.dialogVisible=false;
          initClassPlace(this.strategyId).then(res => {
            if (res.data.code === 200) {
              this.$message.success("初始化成功");
              this.loading=false;
              this.inputsearchNametime();             
            } else {
              this.$message.error(res.data.msg);
               this.loading=false;
            }
          });
        })
        .catch(() => {});
    },
    //新增
    ventilatearoomadd() {
      this.$router.push({ path: "ventilatearoomadd" });
    },
    //编辑
    ventilatearoomeidt(id) {
      this.$router.push({
        path: "ventilatearoomeidt",
        query: { id: id }
      });
    },
    //打卡策略设置
    policySettingslist() {
      this.$router.push({ path: "policySettingslist" });
    },
    //获取列表
    queryPlaceBySchoolIds() {
      this.datalist = [];
      queryPlaceBySchoolId(this.query).then(res => {
        let data = res.data.data;
        this.dataList = data.dataList;
        this.total = data.pagination.total;
      });
    },
    //搜索
    inputsearchNametime() {
      this.query.pageSize = 20;
      this.query.pageNo = 1;
      this.queryPlaceBySchoolIds();
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageNo = 1;
      this.queryPlaceBySchoolIds();
    },
    //切换页数
    handleCurrentChange() {
      this.queryPlaceBySchoolIds();
    },
    //删除
    bigdeletePlaces(){
      let ids='';
     if(this.selected.length==0){
       this.$message.warning("请选择要删除的打卡地点！");
       return;
     };
     for(let i=0;i<this.selected.length;i++){
       if(i<this.selected.length-1){
         ids+=this.selected[i].id+',';
       }else{
          ids+=this.selected[i].id;
       }
       
     }
      this.$confirm("删除场所将会删除当天上报记录，确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading=true;
          deletePlace(ids).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.query.pageNo = 1;
               this.loading=false;
              this.queryPlaceBySchoolIds();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    deletePlaces(id) {
      this.$confirm("删除场所将会删除当天上报记录，确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePlace(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
              this.queryPlaceBySchoolIds();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //立即生效
    generateRecords(){
      this.$confirm("确定立即生效新增场所吗？", "立即生效", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          generateRecord().then(res => {
            if (res.data.code === 200) {
              this.$message.success("生效成功！");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.ventilatearoomindex {
  padding:12px;
  box-sizing: border-box;
  .menu-tools {
    padding-bottom: 10px;
  }
  .radiobox{
    .el-radio{
       width: 100%;
       margin: 5px 0px;
    }
  }
}
</style>


