<template>
	<div class="merchantstatistics">
		<div class="top">
             <el-input class="search-input" style="width:20%;float: right;"  placeholder="商户名称/编码" icon="search" size="medium" @change="queryAbcagentList()"
                          v-model.trim="pagination.searchVal">
                    <el-button slot="append" icon="el-icon-search" @click="queryAbcagentList()"></el-button>
            </el-input> 
         </div>
		<div>
			<el-table :height="nobottommaxH-30" :data="dataList" style="width: 100%" border>	
				<el-table-column label="二级商户名称" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.subMerName }}
					</template>
				</el-table-column>
				<el-table-column label="二级商户编码" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						<span>
							{{ scope.row.subMerId }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="收款账号" align="center" show-overflow-tooltip prop="otherName">
					<template slot-scope="scope">
						<span>
							{{ scope.row.account }}
						</span>
					</template>
				</el-table-column>
                <el-table-column label="行号" align="center" show-overflow-tooltip prop="otherName">
					<template slot-scope="scope">
						<span>
							{{ scope.row.recBankNo }}
						</span>
					</template>
				</el-table-column>
                 <el-table-column label="监管商户" align="center" show-overflow-tooltip prop="otherName">
					<template slot-scope="scope">
						<span>
							{{ scope.row.merName }}
						</span>
					</template>
				</el-table-column>
                 <el-table-column label="收费总金额(元)" align="center" show-overflow-tooltip prop="otherName">
					<template slot-scope="scope">
						<span>
							{{ scope.row.revenuetotal }}
						</span>
					</template>
				</el-table-column>
                 <el-table-column label="已清分金额(元)" align="center" show-overflow-tooltip prop="otherName">
					<template slot-scope="scope">
						<span>
							{{ scope.row.withdtotal }}
						</span>
					</template>
				</el-table-column>
                 <el-table-column label="待清分金额(元)" align="center" show-overflow-tooltip prop="otherName">
					<template slot-scope="scope">
						<span>
							{{ scope.row.balance }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<!-- <el-button type="text" size="small" @click="deleteAbcagent(scope.row.id)" class="buttontextred">删除</el-button> -->
						<el-button type="text" size="small"  @click="merchantstatisticslist(scope.row.subMerId)">收支明细</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :page-count="pagination.pages" :total="pagination.total"></el-pagination>
			</div>
		</div>
	</div>
</template>
<script>

import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import {querySubmerhListBySchoolId} from '@/api/newcharge'

export default {
	name: 'subjectList',
	data() {
		return {
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0,
                searchVal:"",
			},
			dataList: [],
            balance:0
		}
	},
	created() {
         this.queryAbcagentList()
		
	},
	mixins: [windowResize, baseMixin],
	methods: {	
        
      
		merchantstatisticslist(subMerId){
           this.$router.push({path:'merchantstatisticslist',query:{
			   subMerId:subMerId
		   }});
        },
		sizeChangeHandler() {
			this.queryAbcagentList()
		},
		currentChangeHandler() {
			this.queryAbcagentList()
		},
		queryAbcagentList() {         
		 querySubmerhListBySchoolId(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
		}
	}
}
</script>
<style lang="scss" scoped>
.merchantstatistics {
	padding: 12px;
	.pagination-container {
		margin-top: 10px;
	}
	.top {
		padding-bottom: 10px;
		overflow: hidden;
	}
	a,
	.link {
		color: #409eff;
		cursor: pointer;
	}
	.state-container {
		margin: 15px 0;
	}
}
</style>
