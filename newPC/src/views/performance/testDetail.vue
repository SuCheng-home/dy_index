<template>
	<div class="test_detail_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="goBack">返回</el-button>
					<el-select v-model="depart" placeholder="选择部门" @change="selectChange()" size="medium">
						<el-option label="全部部门" :value="0"></el-option>
						<el-option v-for="(item, index) in departData" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-button type="primary" size="medium" @click="getPerformanceUserByTaskId()" :disabled="isDisabled == 2">发布绩效</el-button>
					<el-button type="primary" size="medium" @click="goEditRecord()">修改记录</el-button>
					<a :href="downloadModalHref" target="_blank" download="studentName" v-if="tableData.length">
						<el-button type="primary" size="medium">导出</el-button>
					</a>
					<el-button size="medium" type="primary" @click="printHandler">打印</el-button>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输教师姓名" v-model="search" size="medium">
						<el-button slot="append" icon="el-icon-search" @click="searchIt()"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>

		<div class="detailTable">
			<el-table class="tableList" :data="tableData" border lazy :height="maxH - 1" style="width: 100%" v-if="showTable">
				<el-table-column prop="userName" label="教师姓名"></el-table-column>
				<el-table-column prop="departNames" label="部门" show-overflow-tooltip></el-table-column>
				<template v-for="(item, index) in titleList">
					<el-table-column :label="item.itemName" :width="item.pointType === 2 ? 220 : 180">
						<template slot="header" slot-scope="scope">
							<span>{{ item.itemName }}</span>
							<el-popover v-if="item.pointType === 2" placement="top" width="200" trigger="hover" :content="'现金分值：' + item.cashScore + '元/分'">
								<i slot="reference" class="el-icon-question"></i>
							</el-popover>
						</template>
						<template slot-scope="scope">
							<span v-if="item.pointType === 1">{{ scope.row.pointList[index].point ? scope.row.pointList[index].point : '0' }}元</span>
							<span v-else>{{ scope.row.pointList[index].score }}*{{ item.cashScore }}={{ (scope.row.pointList[index].score * item.cashScore).toFixed(2) }}元</span>
						</template>
					</el-table-column>
					<el-table-column :label="item.itemName + '备注'" v-if="item.haveRemark" width="200">
						<template slot-scope="scope">
							<span>{{ scope.row.pointList[index].remark ? scope.row.pointList[index].remark : '--' }}</span>
						</template>
					</el-table-column>
				</template>

				<el-table-column label="合计">
					<template slot-scope="scope">
						<span>{{ scope.row.totalPoint ? scope.row.totalPoint + '元' : '0.00元' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="备注" show-overflow-tooltip>
					<template slot-scope="scope">
						<span>{{ scope.row.remark ? scope.row.remark : '--' }}</span>
					</template>
				</el-table-column>
				 <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="success"  v-if="scope.row.pushState==2">已发送</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.pushState!=2">未发送</el-tag>
                    </template>
                </el-table-column>
				<el-table-column label="操作" width="160" align="center">
					<template slot-scope="scope">
						<el-button size="small" @click="deleteTest(scope.row.userId)" type="text" class="buttontextred">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="display: none;">
				<el-table class="tableList" :data="tableData" border style="width: 100%;" ref="print">
					<el-table-column prop="userName" label="教师姓名" width="80"></el-table-column>
					<el-table-column prop="departNames" label="部门" width="150"></el-table-column>
					<template v-for="(item, index) in titleList">
						<el-table-column :label="item.itemName" width="200">
							<template slot="header" slot-scope="scope">
								<span>{{ item.itemName }}</span>
								<el-popover v-if="item.pointType === 2" placement="top" width="200" trigger="hover" :content="'现金分值：' + item.cashScore + '元/分'">
									<i slot="reference" class="el-icon-question"></i>
								</el-popover>
							</template>
							<template slot-scope="scope">
								<span v-if="item.pointType === 1">{{ scope.row.pointList[index].point ? scope.row.pointList[index].point : '0.00' }}元</span>
								<span v-else>{{ scope.row.pointList[index].score }}*{{ item.cashScore }}={{ scope.row.pointList[index].score * item.cashScore }}元</span>
							</template>
						</el-table-column>
						<el-table-column :label="item.itemName + '备注'" v-if="item.haveRemark">
							<template slot-scope="scope">
								<span>{{ scope.row.pointList[index].remark ? scope.row.pointList[index].remark : '' }}</span>
							</template>
						</el-table-column>
					</template>
					<el-table-column label="合计">
						<template slot-scope="scope">
							<span>{{ scope.row.totalPoint ? scope.row.totalPoint + '元' : '0.00元' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="备注" width="100">
						<template slot-scope="scope">
							<span>{{ scope.row.remark ? scope.row.remark : '--' }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="success"  v-if="scope.row.pushState==2">已发送</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.pushState!=2">未发送</el-tag>
                    </template>
                </el-table-column>
				</el-table>
			</div>
		</div>
		<div style="margin-top:10px;margin-left: 20px;">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>

		   <el-dialog title="绩效发布（选择需要发送的人员）" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="pop" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				<div style="margin: 15px 0;"></div>
				<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
					<el-checkbox v-for="city in mylist" :label="city.id" :key="city.id">
						<div class="checkboxmy">{{city.name.slice(0, 5)}}</div>
					</el-checkbox>
				</el-checkbox-group>
		    	<span slot="footer" class="dialog-footer">
				<el-button  @click="pop=false">取 消</el-button>
				<el-button type="primary" @click="publishPerformanceAssessToUserList()">发 布</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getDepart, getAllPerformance, publishPerformance, deleteRelativeUserItemByTaskId,getPerformanceUserByTaskId,publishPerformanceAssessToUserList} from '@/api/performance.js'
import mixin from '@/mixins/windowResize'

export default {
	data() {
		return {
			showTable: false,
			total: '',
			pageSize: 10,
			pageNo: 1,
			downloadModalHref: '',
			depart: 0,
			search: '',
			departData: '',
			tableData: [],
			titleList: '',
			taskId: '',
			dataList: '',
			isDisabled: '',
			mylist:[],
			pop:false,
			checkedCities:[],
			checkAll:false,
			isIndeterminate: true,
		}
	},
	mixins: [mixin],
	created() {
		this.taskId = this.$route.query.id;
		this.isDisabled = this.$route.query.publishState;
		this.getDepart();
	},
	methods: {
	  handleCheckAllChange(val) {
		  this.checkedCities=[];
		  if(val){
			  for(let i=0;i<this.mylist.length;i++){
                 this.checkedCities.push(this.mylist[i].id)
			  }            
		  }
         this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.mylist.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.mylist.length;
      },
		goEditRecord() {
			this.$router.push({
				path: 'editRecord',
				query: {
					taskId: this.taskId,
					id: this.$route.query.id 
				}
			})
		},
		goBack() {
			this.$router.back()
		},
		deleteTest(userId) {
			this.$confirm('确认删除这个考核数据吗？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteRelativeUserItemByTaskId({
					taskId: this.taskId,
					userIds: userId
				}).then(res => res.data).then(data => {
					if(data.result) {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAllPerformance();
					} else {
						this.$message.error(data.msg);
					}
				})
			});
		},
		printHandler() {
			this.$print(this.$refs.print)
		},
		searchIt() {
			this.pageNo = 1;
			this.getAllPerformance()
		},
		//获取部门
		getDepart() {
			getDepart().then(res => {
				this.departData = res.data.data;
				this.getAllPerformance();
				this.downloadModalHref = global.BasePath + 'structure/performance/downTaskUser?departId=' + this.depart + '&searchName=' + this.search + '&taskId=' + this.taskId + '&token=' + this.$store.getters.token
			})
		},
		selectChange() {
			this.getAllPerformance();
			this.downloadModalHref = global.BasePath + 'structure/performance/downTaskUser?departId=' + this.depart + '&searchName=' + this.search + '&taskId=' + this.taskId + '&token=' + this.$store.getters.token
		},
		getAllPerformance() {
			getAllPerformance({
				pageSize: this.pageSize,
				pageNo: this.pageNo,
				departId: this.depart,
				searchName: this.search,
				taskId: this.taskId
			}).then(res => {
				this.tableData = res.data.data.dataList;
				this.titleList = res.data.data.titleList;
				this.total = res.data.data.pagination.total;
				this.showTable = false;
				this.$nextTick(() => {
					this.showTable = true;
				})
			})
		},
		getPerformanceUserByTaskId(){
          getPerformanceUserByTaskId( this.taskId).then(res => {
			  this.mylist=res.data.data;
			  this.pop=true;
			})
		},
		//发布绩效
		publishPerformanceAssessToUserList() {
			// mylist:[],
			// pop:false,
			// checkedCities:[],
			if(this.checkedCities.length==0){
				this.$message.error('请选择人员');
              return;
			}
			let userList=[];
			for(let i=0;i<this.checkedCities.length;i++){
				for(let j=0;j<this.mylist.length;j++){
					if(this.checkedCities[i]==this.mylist[j].id){
						userList.push(this.mylist[j])
					}
				}
			}
			this.$confirm('发布绩效后,教师可查看自己的绩效考核', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$message({
						type: 'success',
						message: '发布绩效成功!'
					});
					publishPerformanceAssessToUserList({
						id: this.taskId,
						taskName: this.$route.query.taskName,
						userList:userList
					}).then(res => {
						this.isDisabled = 2;
						this.pop=false;
						this.getAllPerformance()
					})
				}).catch(() => {
				})
		},
		//分页操作
		handleSizeChange(val) {
			this.pageSize = val;
			this.getAllPerformance()
		},
		handleCurrentChange(val) {
			this.pageNo = val;
			this.getAllPerformance()
		}
	}
}
</script>

<style lang="scss" scoped>
.test_detail_wrap {
	padding: 12px;
	.header {
		padding-bottom: 10px;
	}
}
.checkboxmy{
	width: 50px;
}
.el-checkbox{
	    margin: 0 15px 10px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 80px;
}
</style>
