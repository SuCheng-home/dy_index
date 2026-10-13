<template>
    <div class="app-container calendar-list-container myorgclass" :style="{ height: (maxH+115) + 'px' }">
        <div class="org-tree el-table__body-wrapper" :style="{  height: (maxH+105) + 'px' }">
            <div style="padding: 10px;">
                <el-input
                    placeholder="查找部门"
                    v-model="filterText" size="medium" icon="el-icon-search">
                </el-input>
            </div>
            <el-tree class="filter-tree"
                     :data="orgData"
                     :props="defaultProps"
                     :filter-node-method="filterNode"
                     ref="tree2"
                     node-key="id"
                     :expand-on-click-node='false' @node-click="orgNodeClick"
                     :default-expanded-keys="defaultExpandedArray">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span :title="strToHtml(data.title)">{{ strToHtml(node.label) }}</span>
                </span>
            </el-tree>
        </div>
        <div class="org-panel" :style="{  width: maxW + 40 + 'px',height: (maxH+105) + 'px' }">
            <div class="panel-box">
                <div class="panel-item school-box"
                     v-if="currentDepartType==5||currentDepartType==1||currentDepartType==7||currentDepartType==20||currentDepartType==21">
                    <div class="table-tools">
                        <el-row :gutter="10">
                            <el-col>
                                <div class="depart-title">{{strToHtml(currentDepartName)}}<span class="depart-code"
                                                                                                v-if="currentCode">&nbsp;编码：{{currentCode}}</span>
                                     <span class="depart-code" v-if="learnYear">&nbsp;入学年份：{{learnYear}}</span>
                                    <el-button v-if="isSyncFail" type="primary" size="small"
                                               @click="jumpToPage('syncFailList')">
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <template v-if="currentDepartType==5">
                            <el-row :gutter="10">
                                <el-col>
                                    <div class="tools-btn first-row">
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="editRootDepart">修改部门
                                        </el-button>
                                        <el-tooltip
                                            :content="schoolData.listQuery.isIncludeChild?'显示包含子部门用户':'只显示当前部门用户'"
                                            placement="top">
                                            <el-switch v-model="schoolData.listQuery.isIncludeChild" on-text=""
                                                       off-text="" @change="handleisIncludeChild"></el-switch>
                                        </el-tooltip>
                                        <el-input class="search-input search-input--right"
                                                  v-model="schoolData.listQuery.searchVal"
                                                  placeholder="用户姓名/手机号" size="mini"
                                                  @change="handleInputChange">
                                            <el-button slot="append" icon="el-icon-search"
                                                       @click="handleInputChange"></el-button>
                                        </el-input>
                                    </div>
                                    <hr class="class-hr"/>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" v-if="isShowByPermission('/userDepart/manage')">
                                <el-col>
                                    <div class="tools-btn">
                                        <syn-user :departName="currentDepartName"
                                                  :departType="currentDepartType"
                                                  :departId="defaultExpandedArray[0]"></syn-user>
                                        <el-button type="primary" size="mini" @click="moveTeacher">移动到</el-button>
                                        <el-button :plain="true" type="info" size="mini" @click="deleteTeacher">删除用户
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                        <template v-if="currentDepartType==1||currentDepartType==7">
                            <el-row :gutter="10">
                                <el-col>
                                    <div class="tools-btn first-row">
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="addDeaprt">新建部门
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="editDepart">修改部门
                                        </el-button>
                                        <template v-if="currentDepartType==7">
                                            <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                       size="mini" @click="deleteDepart">删除部门
                                            </el-button>
                                            <el-button @click="exportUserQrcodeHandler" type="primary" size="mini">
                                                导出用户二维码
                                            </el-button>
                                            <el-button @click="addToCurrentDept" type="primary" size="mini">
                                                添加至此部门
                                            </el-button>
                                        </template>
                                        <template v-if="currentDepartType==1">
                                            <a :href="exportTeacherYesUrl" target="_blank" download="已关注教职工">
                                                <el-button type="primary" size="mini">导出已关注教职工</el-button>
                                            </a>
                                            <a :href="exportTeacherNoUrl" target="_blank" download="已关注教职工">
                                                <el-button type="primary" size="mini">导出未关注教职工</el-button>
                                            </a>
                                            <a :href="exportTeacherAllUrl" target="_blank" download="全部教职工">
                                                <el-button type="primary" size="mini">导出全部教职工</el-button>
                                            </a>
                                        </template>
                                        <a v-if="currentDepartType==7" :href="exportDepartTeacherAllUrl" target="_blank"
                                           download="全部教职工">
                                            <el-button type="primary" size="mini">导出</el-button>
                                        </a>
                                        <el-tooltip
                                            :content="schoolData.listQuery.isIncludeChild?'显示包含子部门用户':'只显示当前部门用户'"
                                            placement="top">
                                            <el-switch v-model="schoolData.listQuery.isIncludeChild" on-text=""
                                                       off-text="" @change="handleisIncludeChild"></el-switch>
                                        </el-tooltip>
                                        <el-input class="search-input" v-model="schoolData.listQuery.searchVal"
                                                  placeholder="用户姓名/手机号" size="mini"
                                                  @change="handleInputChange">
                                            <el-button slot="append" icon="el-icon-search"
                                                       @click="handleInputChange"></el-button>
                                        </el-input>
                                    </div>
                                    <hr class="class-hr"/>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" v-if="isShowByPermission('/userDepart/manage')">
                                <el-col>
                                    <div class="tools-btn">
                                        <syn-user :departName="currentDepartName" :departId="defaultExpandedArray[0]"
                                                  :departType="currentDepartType"></syn-user>
                                        <import-teacher @loadPageFormChild="loadPageFormChild"
                                                        :departName="currentDepartName"
                                                        :departId="defaultExpandedArray[0]"></import-teacher>

                                        <!--                -->
                                         <import-teachernew v-if="schoolInfo.clientType == 2 " @loadPageFormChild="loadPageFormChild"
                                                        :departName="currentDepartName"
                                                        :departId="defaultExpandedArray[0]"></import-teachernew>
                                        <el-button type="primary" size="mini" @click="addOrUpdateTeacher('teacher')">
                                            新增人员
                                        </el-button>
                                        <el-button type="primary" size="mini" @click="addOrUpdateTeacher('import')">
                                            新增流入用户
                                        </el-button>
                                        <el-button type="primary" size="mini" @click="outflowTeacher">流出</el-button>
                                        <el-button type="primary" size="mini" @click="moveTeacher">移动到</el-button>
                                        <el-button :plain="true" type="info" size="mini" @click="removeTeacherDepart">
                                            移出该部门
                                        </el-button>
                                        <el-button :plain="true" type="info" size="mini" @click="deleteTeacher"
                                                   class="buttontextred">删除用户
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                        <template v-if="currentDepartType==20||currentDepartType==21">
                            <el-row :gutter="10">
                                <el-col>
                                    <div class="tools-btn first-row">
                                        <el-button type="primary" v-if="isShowByPermission('/userDepart/manage')"
                                                   size="mini" @click="addSimpleDeaprt">新建部门
                                        </el-button>
                                        <el-button type="primary" v-if="isShowByPermission('/userDepart/manage')"
                                                   size="mini" @click="updateSimpleDeaprt">修改部门
                                        </el-button>
                                        <el-button type="primary" v-if="isShowByPermission('/userDepart/manage')"
                                                   size="mini" @click="deleteDepart">删除部门
                                        </el-button>
                                        <el-input class="search-input" v-model="schoolData.listQuery.searchVal"
                                                  placeholder="用户姓名/手机号" size="mini"
                                                  @change="handleInputChange">
                                            <el-button slot="append" icon="el-icon-search"
                                                       @click="handleInputChange"></el-button>
                                        </el-input>
                                    </div>
                                    <hr class="class-hr"/>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" v-if="isShowByPermission('/userDepart/manage')">
                                <el-col>
                                    <div class="tools-btn">
                                        <el-button type="primary" size="mini" @click="addOrUpdateTeacher('outside')">
                                            新增人员
                                        </el-button>
                                        <el-button type="primary" size="mini" @click="moveOutTeacher">移动到</el-button>
                                        <el-button type="primary" size="mini" @click="outflowTeacherEnd">转为教职工用户
                                        </el-button>
                                        <el-button :plain="true" type="info" size="mini" @click="deleteTeacher">删除用户
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                        <template>
                            <address-book ref="address" v-model="teacherAddressData" :config="teacherAddressConfigData"
                                          :hasTolls='false'></address-book>
                            <address-book ref="outflowTeacherAddress" v-model="outflowTeacherAddressData"
                                          :config="outflowTeacherAddressConfigData" :hasTolls='false'></address-book>
                            <address-book ref="outflowMoveAddress" v-model="outflowMoveAddressData"
                                          :config="outflowMoveAddressConfigData" :hasTolls='false'></address-book>
                            <address-book ref="outflowTeacherEndAddress" v-model="outflowTeacherEndAddressData"
                                          :config="outflowTeacherEndAddressConfigData" :hasTolls='false'></address-book>
                        </template>
                    </div>
                    <div class="class-table">
                        <el-table key="schoolTable" :data="schoolData.list" v-loading.body="listLoading" border
                                  highlight-current-row style="width: 100%" :height="maxH-105"
                                  @selection-change="handleSelectionChange">
                            <el-table-column :key="Math.random()" v-if="isShowByPermission('/userDepart/manage')"
                                             type="selection" width="45"></el-table-column>
                            <el-table-column :key="Math.random()" align="center" label="头像" width="70">
                                <template slot-scope="scope">
                                    <img :src="scope.row.avatar" class="org-avatar"/>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="姓名" min-width="150" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span class="link-type"
                                          @click="loadTeacherDetail(scope.row)">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>                            
                            <el-table-column :key="Math.random()" label="部门" min-width="150" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{scope.row.deptNames}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="用户名" min-width="100" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{scope.row.loginname}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" align="center" label="性别" min-width="80">
                                <template slot-scope="scope">
                                    <span class="gender masculinity" v-if="scope.row.gender==1"><i class="fa fa-mars"
                                                                                                   aria-hidden="true"></i></span>
                                    <span class="gender femininity" v-if="scope.row.gender==2"><i class="fa fa-venus"
                                                                                                  aria-hidden="true"></i></span>
                                    <span v-if="scope.row.gender==0">--</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" align="center" label="手机号码" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.mobile}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="schoolInfo.clientType == 1 || schoolInfo.clientType == 12" :key="Math.random()" prop="tag" align="center" label="状态" min-width="120"
                                             :filtered-value="schoolfilteredValue" :filter-multiple='false'
                                             :filters="[{ text: '已关注', value:'1' }, { text: '未关注', value: '4'}, { text: '禁用', value: '2' }, { text: '退出', value: '5' }]">
                                <template slot-scope="scope">
                                    <el-tag size="mini" v-if="scope.row.status==1" type="success">已关注</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==2" type="gray">禁用</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==4" type="danger">未关注</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==5" type="gray">退出</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column v-else :key="Math.random()" prop="tag" align="center" label="状态" min-width="120"
                                             :filtered-value="schoolfilteredValue" :filter-multiple='false'
                                             :filters="[{ text: '已激活', value:'1' }, { text: '未激活', value: '4'}, { text: '禁用', value: '2' }, { text: '退出', value: '5' }]">
                                <template slot-scope="scope">
                                    <el-tag size="mini" v-if="scope.row.status==1" type="success">已激活</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==2" type="gray">禁用</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==4" type="danger">未激活</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==5" type="gray">退出</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" fixed="right" align="center" label="操作"
                                             v-if="isShowByPermission('/userDepart/manage')" width="220">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text" @click="updateTeacher(scope.row)">编辑</el-button>

                                    <el-button size="small" type="text" v-if="scope.row.status!=2"
                                               @click="enableUser(scope.row,'no')">禁用
                                    </el-button>
                                    <el-button size="small" type="text" v-if="scope.row.status==2"
                                               @click="enableUser(scope.row,'yes')">启用
                                    </el-button>
                                    <el-button size="small" type="text" @click="delSingleTeacher(scope.row)"
                                               class="buttontextred">删除
                                    </el-button>
                                    <el-button size="small" type="text" @click="removeSingleTeacherDepart(scope.row)">
                                        移出该部门
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-show="!listLoading" class="pagination-container">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="schoolData.listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                                           :page-size="schoolData.listQuery.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="schoolData.total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div class="panel-item stu-box" v-if="currentDepartType==2||currentDepartType==3||currentDepartType==4">
                    <div class="table-tools">
                        <el-row :gutter="10">
                            <el-col>
                                <div class="depart-title">{{strToHtml(currentDepartName)}}
                                    <span class="depart-code" v-if="currentCode">&nbsp;编码：{{currentCode}}</span>
                                     <span class="depart-code" v-if="learnYear">&nbsp;入学年份：{{learnYear}}</span>
                                    <el-button v-if="isSyncFail" type="primary" size="small"
                                               @click="jumpToPage('syncFailList')">用户下发异常列表
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <template v-if="currentDepartType==2">
                            <el-row :gutter="10">
                                <el-col>
                                    <div class="tools-btn first-row">
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="editRootDepart">修改部门
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/opearationGrade')" type="primary"
                                                   size="mini" @click="initGradeClasss">初始化年级班级
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/opearationGrade')" type="primary"
                                                   size="mini" @click="addGrade">新建年级
                                        </el-button>
                                        <import-student v-if="isShowByPermission('/userDepart/manage')"
                                                        @loadPageFormChild="loadPageFormChild"
                                                        :departName="currentDepartName"
                                                        :departId="defaultExpandedArray[0]"></import-student>
                                        <modify-import-student v-if="isShowByPermission('/userDepart/manage')"
                                                               class="first-import-btn"
                                                               @loadPageFormChild="loadPageFormChild"
                                                               :departId="defaultExpandedArray[0]"></modify-import-student>
                                        <a target="_blank" :href="exportStudentAllUrl" download="导出全校学生">
                                            <el-button type="primary" size="mini">导出全校学生</el-button>
                                        </a>
                                        <a target="_blank" :href="exportStudentNoUrl" download="导出全校未关注学生">
                                            <el-button type="primary" size="mini">导出全校未关注学生</el-button>
                                        </a>
                                        <a target="_blank" :href="exportStudentQRCode" download="导出全校班级二维码">
                                            <el-button type="primary" size="mini">导出全校班级二维码</el-button>
                                        </a>
                                        <el-button type="primary" size="mini"
                                                   @click="exportNewStuQRCode(1)">学生登记二维码
                                        </el-button>
                                         <el-button type="primary" size="mini"
                                                   @click="exportNewStuQRCode(2)">家长登记二维码
                                        </el-button>
                                        <el-input class="search-input" v-model="schoolData.listQuery.searchVal"
                                                  size="mini"
                                                  placeholder="学生姓名/学号/手机号"
                                                  @change="handleInputChange">
                                            <el-button slot="append" icon="el-icon-search"
                                                       @click="handleInputChange"></el-button>
                                        </el-input>
                                    </div>
                                    <hr class="class-hr"/>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" v-if="isShowByPermission('/userDepart/manage')">
                                <el-col>
                                    <div class="tools-btn">
                                        <syn-user :departName="currentDepartName"
                                                  :departId="defaultExpandedArray[0]"
                                                  :departType="currentDepartType"
                                        ></syn-user>

                                        <el-button type="primary" size="mini" @click="moveStudent">移动到</el-button>
                                        <el-button :plain="true" type="info" size="mini" @click="deleteStudent">删除学生
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                        <template v-if="currentDepartType==3">
                            <el-row :gutter="10">
                                <el-col>
                                    <div class="tools-btn first-row">
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="addClassDeaprt">新建班级
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="gradeDepartEdit">修改年级
                                        </el-button>
                                        <el-button type="primary" v-if="isShowByPermission('/opearationGrade')"
                                                   size="mini" @click="deleteDepart">删除年级
                                        </el-button>
                                        <a :href="exportStudentAllUrl" target="_blank" download="导出年级下学生">
                                            <el-button type="primary" size="mini">导出年级下学生</el-button>
                                        </a>
                                        <a :href="exportStudentNoUrl" target="_blank" download="导出年级下未关注学生">
                                            <el-button type="primary" size="mini">导出年级下未关注学生</el-button>
                                        </a>
                                        <el-button type="primary" size="mini"
                                                   v-if="isShowByPermission('/userDepart/manage')"
                                                   @click="toClassBatchAdd">批量创建班级
                                        </el-button>
                                        <el-input class="search-input" v-model="schoolData.listQuery.searchVal"
                                                  placeholder="学生姓名/学号/手机号" size="mini"
                                                  @change="handleInputChange">
                                            <el-button slot="append" icon="el-icon-search"
                                                       @click="handleInputChange"></el-button>
                                        </el-input>
                                    </div>
                                    <hr class="class-hr"/>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" v-if="isShowByPermission('/userDepart/manage')">
                                <el-col>
                                    <div class="tools-btn">
                                        <syn-user :departName="currentDepartName" :departId="defaultExpandedArray[0]"
                                                  :departType="currentDepartType"></syn-user>
                                        <el-button type="primary" size="mini" @click="moveStudent">移动到</el-button>
                                        <el-button :plain="true" type="info" size="mini" @click="deleteStudent">删除学生
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                        <template v-if="currentDepartType==4">
                            <el-row :gutter="10">
                                <el-col>
                                    <div class="tools-btn first-row">
                                        <el-button type="primary" v-if="isShowByPermission('/userDepart/manage')"
                                                   size="mini" @click="editClassDepart">修改班级
                                        </el-button>
                                        <el-button type="primary" v-if="isShowByPermission('/userDepart/manage')"
                                                   size="mini" @click="deleteDepart">删除班级
                                        </el-button>
                                        <a :href="exportStudentAllUrl" target="_blank" download="导出本班学生">
                                            <el-button type="primary" size="mini">导出本班学生</el-button>
                                        </a>
                                        <a :href="exportStudentNoUrl" target="_blank" download="导出本班未关注学生">
                                            <el-button type="primary" size="mini">导出本班未关注学生</el-button>
                                        </a>
                                        <el-button type="primary" v-if="isShowByPermission('/userDepart/manage')"
                                                   size="mini" @click="moveClassDepart">移动班级
                                        </el-button>
                                        <el-button @click="exportUserQrcodeHandler" type="primary" size="mini">
                                            导出用户二维码
                                        </el-button>

                                        <el-input class="search-input" v-model="schoolData.listQuery.searchVal"
                                                  size="mini"
                                                  placeholder="用户姓名/手机号/家长手机号"
                                                  @change="handleInputChange">
                                            <el-button slot="append" icon="el-icon-search"
                                                       @click="handleInputChange"></el-button>
                                        </el-input>
                                    </div>
                                    <hr class="class-hr"/>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" v-if="isShowByPermission('/userDepart/manage')">
                                <el-col>
                                    <div class="tools-btn">
                                        <syn-user :departName="currentDepartName" :departId="defaultExpandedArray[0]"
                                                  :departType="currentDepartType"></syn-user>
                                        <!--                    <import-student @loadPageFormChild="loadPageFormChild"-->
                                        <!--                                    :departName="currentDepartName"-->
                                        <!--                                    :departId="defaultExpandedArray[0]"></import-student>-->
                                        <el-button type="primary" size="mini" @click="addOrUpdateStu">新增学生</el-button>
                                        <el-button type="primary" size="mini" @click="moveStudent">移动到</el-button>
                                        <el-button :plain="true" type="info" size="mini" @click="deleteStudent">删除学生
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                        <template>
                            <address-book ref="stuAddress" v-model="stuAddressData" :config="stuAddressConfigData"
                                          :hasTolls='false'></address-book>
                            <address-book ref="outflowTeacherAddress" v-model="outflowTeacherAddressData"
                                          :config="outflowTeacherAddressConfigData" :hasTolls='false'></address-book>
                        </template>
                    </div>
                    <div class="class-table">
                        <el-table key="stuTable" :data="schoolData.list" v-loading.body="listLoading" border fit
                                  highlight-current-row style="width: 100%" :height="maxH-105"
                                  @selection-change="handleSelectionChange">
                            <el-table-column :key="Math.random()" v-if="isShowByPermission('/userDepart/manage')"
                                             type="selection" width="45"></el-table-column>
                            <el-table-column :key="Math.random()" align="center" label="头像" width="70">
                                <template slot-scope="scope">
                                    <img :src="scope.row.avatar" class="org-avatar"/>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="姓名" min-width="150" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span class="link-type"
                                          @click="loadStudentDetail(scope.row)">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="班级" min-width="150" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{scope.row.deptNames}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="用户名" min-width="100" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{scope.row.loginname}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="学号" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.learnNum}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" align="center" label="性别" width="150">
                                <template slot-scope="scope">
                                   <span class="gender masculinity" v-if="scope.row.gender==1"><i class="fa fa-mars"
                                                                                                  aria-hidden="true"></i></span>
                                    <span class="gender femininity" v-if="scope.row.gender==2"><i class="fa fa-venus"
                                                                                                  aria-hidden="true"></i></span>
                                    <span v-if="scope.row.gender==0">--</span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="schoolInfo.clientType == 1 || schoolInfo.clientType == 12" :key="Math.random()" prop="tag" align="center" label="状态" min-width="120"
                                             :filtered-value="schoolfilteredValue" :filter-multiple='false'
                                             :filters="[{ text: '已关注', value:'1' }, { text: '未关注', value: '4'}, { text: '禁用', value: '2' }, { text: '退出', value: '5' }]">
                                <template slot-scope="scope">
                                    <el-tag size="mini" v-if="scope.row.status==1" type="success">已关注</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==2" type="gray">禁用</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==4" type="danger">未关注</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==5" type="gray">退出</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column v-else :key="Math.random()" prop="tag" align="center" label="状态" min-width="120"
                                             :filtered-value="schoolfilteredValue" :filter-multiple='false'
                                             :filters="[{ text: '已激活', value:'1' }, { text: '未激活', value: '4'}, { text: '禁用', value: '2' }, { text: '退出', value: '5' }]">
                                <template slot-scope="scope">
                                    <el-tag size="mini" v-if="scope.row.status==1" type="success">已激活</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==2" type="gray">禁用</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==4" type="danger">未激活</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==5" type="gray">退出</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" align="center" label="操作" width="220" fixed="right">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text" @click="addParent(scope.row)">家长信息</el-button>
                                    <el-button size="small" type="text" v-if="isShowByPermission('/userDepart/manage')"
                                               @click="updateStu(scope.row)">编辑
                                    </el-button>
                                    <el-button size="small" type="text" v-if="isShowByPermission('/userDepart/manage')"
                                               @click="delSingleStu(scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-show="!listLoading" class="pagination-container">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="schoolData.listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                                           :page-size="schoolData.listQuery.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="schoolData.total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div class="panel-item stu-box"
                     v-if="currentDepartType==10||currentDepartType==11||currentDepartType==12">
                    <div class="table-tools">
                        <el-row :gutter="10">
                            <el-col>
                                <div class="depart-title">{{strToHtml(currentDepartName)}}<span class="depart-code"
                                                                                                v-if="currentCode">&nbsp;编码：{{currentCode}}</span>
                                    <span class="depart-code" v-if="learnYear">&nbsp;入学年份：{{learnYear}}</span>
                                    <el-button v-if="isSyncFail" type="primary" size="small"
                                               @click="jumpToPage('syncFailList')">用户下发异常列表
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row :gutter="10">
                            <el-col>
                                <div class="tools-btn first-row">
                                    <template v-if="currentDepartType==10">
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="addSimpleDeaprt">新建年级
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="updateSimpleDeaprt">修改部门
                                        </el-button>
                                    </template>
                                    <template v-if="currentDepartType==11">
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="addSimpleDeaprt">新建班级
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="updateSimpleDeaprt">修改年级
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="deleteDepart">删除年级
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="deleteWxGrade">删除企微年级
                                        </el-button>
                                    </template>
                                    <template v-if="currentDepartType==12">
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="updateSimpleDeaprt">修改班级
                                        </el-button>
                                        <el-button v-if="isShowByPermission('/userDepart/manage')" type="primary"
                                                   size="mini" @click="deleteDepart">删除班级
                                        </el-button>
                                    </template>
                                    <el-input class="search-input" v-model="schoolData.listQuery.searchVal"
                                              placeholder="姓名/用户名" size="mini"
                                              @change="handleInputChange">
                                        <el-button slot="append" icon="el-icon-search"
                                                   @click="handleInputChange"></el-button>
                                    </el-input>
                                </div>
                                <hr class="class-hr"/>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" v-if="isShowByPermission('/userDepart/manage')">
                            <el-col>
                                <div class="tools-btn">
                                    <el-button type="primary" size="mini" @click="moveSchoolFllow">移动到</el-button>                                    
                                    <template v-if="currentDepartType==12||currentDepartType==10||currentDepartType==11">
                                        <el-button :plain="true" type="info" size="mini" @click="deleteSchoolfellow">
                                            删除校友
                                        </el-button>
                                    </template>
                                </div>
                            </el-col>
                        </el-row>

                        <template>
                            <address-book ref="schoolFllowAddress" v-model="schoolFllowAddressData"
                                          :config="schoolFllowAddressConfigData" :hasTolls='false'></address-book>
                        </template>
                    </div>
                    <div class="class-table">
                        <el-table key="stuTable" :data="schoolData.list" v-loading.body="listLoading" border fit
                                  highlight-current-row style="width: 100%" :height="maxH-105"
                                  @selection-change="handleSelectionChange">
                            <el-table-column :key="Math.random()" v-if="isShowByPermission('/userDepart/manage')"
                                             type="selection" width="45"></el-table-column>
                            <el-table-column :key="Math.random()" align="center" label="头像" width="70">
                                <template slot-scope="scope">
                                    <img :src="scope.row.avatar" class="org-avatar"/>
                                </template>
                            </el-table-column>                            
                            <el-table-column :key="Math.random()" label="姓名" min-width="150" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="部门" min-width="150" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{scope.row.deptNames}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="用户名" min-width="150" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{scope.row.loginname}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" align="center" label="性别" width="150">
                                <template slot-scope="scope">
                                    <span class="gender masculinity" v-if="scope.row.gender==1"><i class="fa fa-mars"
                                                                                                   aria-hidden="true"></i></span>
                                    <span class="gender femininity" v-if="scope.row.gender==2"><i class="fa fa-venus"
                                                                                                  aria-hidden="true"></i></span>
                                    <span v-if="scope.row.gender==0">--</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="入学年月" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.enterSchoolDate || '--'}}</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column :key="Math.random()" label="毕业班级" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.graduationClassName || '--'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :key="Math.random()" label="所在部门" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.departName || '--'}}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column v-if="schoolInfo.clientType == 1 || schoolInfo.clientType == 12" :key="Math.random()" prop="tag" align="center" label="状态" min-width="120"
                                             :filtered-value="schoolfilteredValue" :filter-multiple='false'
                                             :filters="[{ text: '已关注', value:'1' }, { text: '未关注', value: '4'}, { text: '禁用', value: '2' }, { text: '退出', value: '5' }]">
                                <template slot-scope="scope">
                                    <el-tag size="mini" v-if="scope.row.status==1" type="success">已关注</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==2" type="gray">禁用</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==4" type="danger">未关注</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==5" type="gray">退出</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column v-else :key="Math.random()" prop="tag" align="center" label="状态" min-width="120"
                                             :filtered-value="schoolfilteredValue" :filter-multiple='false'
                                             :filters="[{ text: '已激活', value:'1' }, { text: '未激活', value: '4'}, { text: '禁用', value: '2' }, { text: '退出', value: '5' }]">
                                <template slot-scope="scope">
                                    <el-tag size="mini" v-if="scope.row.status==1" type="success">已激活</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==2" type="gray">禁用</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==4" type="danger">未激活</el-tag>
                                    <el-tag size="mini" v-if="scope.row.status==5" type="gray">退出</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-show="!listLoading" class="pagination-container">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="schoolData.listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                                           :page-size="schoolData.listQuery.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="schoolData.total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="erroDailog" size="tiny">
            <span v-html="erroErroInfo"></span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="erroDailog = false">取 消</el-button>
            <el-button type="primary" @click="erroDailog = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="请选择移动到的年级" :visible.sync="showGradeDialog" size="tiny" width="800px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form>
                <el-form-item label="选择年级" label-width="200px">
                    <el-select v-model="targetGradeId" placeholder="请选择年级">
                        <el-option :label="item.name" :value="item.id" :key="index"
                                   v-for="(item, index) in showGradeList"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :disabled="disabled" @click="showGradeDialog = false">取 消</el-button>
                <el-button :disabled="disabled" type="primary" @click="confirmGrade">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加至此部门" :visible.sync="isShowAddToCurrentDeptDialog" size="tiny" width="800px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form :model="addToCurrentDeptForm" :rules="addToCurrentDeptFormRules" ref="addToCurrentDeptForm">
                <el-form-item prop="names">
                    <el-input type="textarea" v-model="addToCurrentDeptForm.names" :rows="8"
                              placeholder="请认真核对教师姓名，每换行一次相当于输入一名教师"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :disabled="disabled" @click="isShowAddToCurrentDeptDialog = false">取 消</el-button>
                <el-button :disabled="disabled" type="primary" @click="addToCurrentDeptConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="mytype==1?'学生登记二维码':'家长登记二维码'" :visible.sync="isShowQrcode" size="tiny" width="400px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div class="qrcode-content">
                <img :src="qrcodeImgUrl" class="qrcode"/>
                <div class="qrcode-schoolname">{{schoolName}}</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowQrcode = false">关 闭</el-button>
            </div>
        </el-dialog>
        <el-dialog title="初始化年级班级" :visible.sync="isShowInitGradeClass" size="tiny" width="400px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form :model="initGradeClassForm" :rules="initGradeClassFormRules" ref="initGradeClassForm" label-width="100px">
                <el-form-item label="学段" prop="learningStages">
                    <el-select size="medium" v-model="initGradeClassForm.learningStages" placeholder="请选择">
                        <el-option v-for="[value, label] in schoolTypeConstants" :key="value" :label="label"
                                   :value="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年级数" prop="gradeCount">
                    <el-input-number v-model="initGradeClassForm.gradeCount" :min="1" :max="learningStageGradeMax"
                                     size="medium"></el-input-number>
                </el-form-item>
                <el-form-item label="班级数" prop="classCount">
                    <el-input-number v-model="initGradeClassForm.classCount" :min="1" :max="50"
                                     size="medium"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :disabled="disabled" @click="isShowInitGradeClass = false">取 消</el-button>
                <el-button :disabled="disabled" type="primary" @click="confirmInitGradeClass">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {isShowByPermission} from '@/utils';

    import {
        queryDeparts,
        getUserList,
        deleteTeacher,
        moveTeacher,
        removeTeacherDepart,
        outflowTeacher,
        enableUser,
        moveStudent,
        deleteStudent,
        deleteDepart,
        getPidByid,
        outflowTeacherEnd,
        deleteSchoolfellow,
        moveSchoolfellow,
        querySchoolGrade,
        moveClassToGrade,
        getQrCodeUrl,
        exportUserQrcode,
        addUsersByDepart,
        isExistSyncFailData,
        updateInitGradeClass,
        deleteWxGrade
    } from '@/api/systemSet/org.js';
    import SynUser from '@/views/sysSet/org/user/synUser';//同步组件teacher
    import ImportTeacher from '@/views/sysSet/org/user/importTeacher';//导入用户组件
    import ImportTeachernew from '@/views/sysSet/org/user/importTeachernew';//导入用户组件
    import mixin from '@/mixins/windowResize';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import ModifyImportStudent from '@/views/sysSet/org/user/modifyImportStudent';//批量修改用户
    import ImportStudent from '@/views/sysSet/org/user/importStudent';//批量导入学生
    import {strToHtml} from '@/utils';

    import {mapGetters} from 'vuex';

    import _ from 'lodash';

    const schoolTypeConstants = new Map([
        ['1', '幼儿园'],
        ['2', '小学'],
        ['3', '初中'],
        ['4', '高中'],
        ['6', '六年制'],
        ['9', '九年制'],
        ['12', '十二年制'],
    ]);

    export default {
        components: {
            SynUser,
            AddressBook,
            ImportTeacher,
            ModifyImportStudent,
            ImportStudent,
            ImportTeachernew
        },
        mixins: [mixin],
        computed: {
            exportDepartTeacherAllUrl() {
                return global.BaseNewPath + 'sys/user/export/teacher?departId=' + this.schoolData.listQuery.id + '&status=0&token=' + this.$store.getters.token;
            },
            learningStageGradeMax() {
                let num = 1;
                if (this.initGradeClassForm.learningStages == 1) {
                    num = 4;
                } else if (this.initGradeClassForm.learningStages == 2) {
                    num = 6;
                } else if (this.initGradeClassForm.learningStages == 3) {
                    num = 3;
                } else if (this.initGradeClassForm.learningStages == 4) {
                    num = 4;
                } else if (this.initGradeClassForm.learningStages == 6) {
                    num = 6;
                } else if (this.initGradeClassForm.learningStages == 9) {
                    num = 9;
                } else if (this.initGradeClassForm.learningStages == 12) {
                    num = 12
                }
                return num;
            },
            ...mapGetters(['schoolInfo'])
        },
        data() {
            return {
                isShowAddToCurrentDeptDialog: false,
                addToCurrentDeptForm: {
                    names: ''
                },
                addToCurrentDeptFormRules: {
                    names: [
                        {required: true, message: '请输入要添加人员姓名', trigger: 'blur'},
                    ]
                },
                mytype:1,
                targetGrade: {},
                targetGradeId: '',
                showGradeList: [],
                disabled: false,
                showGradeDialog: false,
                stuClassPid: 0,
                allGradeList: [],
                cutH: 340,
                cutW: 520,
                filterText: '',
                sourceData: [],
                orgData: [],
                schoolfilteredValue: [],//过滤标签
                defaultExpandedArray: [],//默认展开的部门id,同时用来记录当前的选中的部门id
                currentDepartWxId: 0,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                currentDepartType: '',//当前部门的类型
                currentDepartName: '',//当前部门的名称
                currentCode: '',//当前部门的code
                learnYear:"",
                listLoading: false,
                schoolData: {
                    list: null,
                    total: null,
                    listQuery: {
                        id: '',
                        pageNo: 1,
                        pageSize: 20,
                        searchVal: '',
                        filterStatus: '',
                        isIncludeChild: true,
                        type: ''
                    }
                },
                teacherAddressConfigData: {
                    title: '请选择移动到的部门',
                    depart: {target: 'depart', departType: 't', userTypes: '1'}
                },
                teacherAddressData: {},
                outflowTeacherAddressConfigData: {
                    title: '请选择部门',
                    depart: {target: 'depart', departType: 'outside', userTypes: '1'}
                },
                outflowTeacherAddressData: {},
                outflowMoveAddressData: {},
                outflowMoveAddressConfigData: {
                    title: '请选择移入的部门',
                    depart: {target: 'depart', departType: 'outside', userTypes: '1'}
                },
                outflowTeacherEndAddressData: {},
                outflowTeacherEndAddressConfigData: {
                    title: '请选择部门',
                    depart: {target: 'depart', departType: 't', userTypes: '1'},
                    SingleChose: true
                },
                stuAddressData: {},
                stuAddressConfigData: {
                    title: '请选择移入的部门',
                    depart: {target: 'depart', departType: 's', userTypes: '3'},
                    SingleChose: true
                },
                schoolFllowAddressData: {},
                schoolFllowAddressConfigData: {
                    title: '请选择移入的部门',
                    depart: {target: 'depart', departType: 'sf', userTypes: '5'},
                    SingleChose: true
                },
                showAddressDialog: false,//用于控制【移动到】按钮点击显示地址簿
                multipleSelection: [],
                exportTeacherAllUrl: '',//导出全部用户url
                exportTeacherNoUrl: '',//导出未关注用户url
                exportTeacherYesUrl: '',//导出已关注用户url
                exportStudentAllUrl: '',//导出所有学生用户url
                exportStudentNoUrl: '',//导出未关注用户url
                showNewStuExportBtn: false,//导出全校班级二维码
                exportStudentQRCode: '',//导出全校班级二维码
                erroDailog: false,//用于标识显示转为教职工错误的提示
                erroErroInfo: '',////用于标识显示转为教职工错误的提示
                qrcodeImgUrl: '',
                isShowQrcode: false,
                schoolName: '',
                isSyncFail: false,

                schoolTypeConstants,
                isShowInitGradeClass: false,
                initGradeClassForm: {
                    classCount: 1,
                    gradeCount: 1,
                    learningStages: '',
                    pid: ''
                },
                initGradeClassFormRules: {
                    learningStages: [
                        {required: true, message: '请选择学段', trigger: 'blur'},
                    ],
                    classCount: [
                        {required: true, message: '请填写班级数', trigger: 'blur'},
                    ],
                    gradeCount: [
                        {required: true, message: '请填写年级数', trigger: 'blur'},
                    ],
                },
            };
        },
        created() {
            this.$router.push({path: 'index'});
            this.exportTeacherAllUrl = global.BaseNewPath + 'sys/user/export/teacher?status=0&token=' + this.$store.getters.token;
            this.exportTeacherNoUrl = global.BaseNewPath + 'sys/user/export/teacher?status=4&token=' + this.$store.getters.token;
            this.exportTeacherYesUrl = global.BaseNewPath + 'sys/user/export/teacher?status=1&token=' + this.$store.getters.token;

            isExistSyncFailData({
                schoolId: this.schoolInfo.id,
                eventType: 'USER,DEPART'
            })
                .then(res => res.data)
                .then(data => {
                    this.isSyncFail = data.data;
                })

            queryDeparts().then(res => {
                let packageArray = new Array();
                let data = res.data.data;
                this.sourceData = data;
                this.orgData = this.packageOrg(0, packageArray);
                const schoolObj = data.find(item => item.dataType == 5);
                if (schoolObj) {
                    this.schoolName = schoolObj.name;
                }
                let orgFilterParams = this.$store.getters.orgFilterParams;
                if (orgFilterParams == null) {//如果是null，则是第一次进入或者刷新页面
                    this.defaultExpandedArray = [this.orgData[0].id];
                    this.currentDepartType = this.orgData[0].type;
                    this.$store.dispatch('SetOrgFilterParams', this.getFilterData(this.orgData[0].type));
                    this.schoolData.listQuery.id = this.orgData[0].id;
                    this.schoolData.listQuery.type = this.orgData[0].type;
                    this.currentDepartName = this.orgData[0].label;
                    this.currentDepartWxId = this.orgData[0].currentDepartWxId;
                    this.currentCode = this.orgData[0].code;
                    this.learnYear = this.orgData[0].learnYear;
                    this.loadschoolData(this.schoolData.listQuery);
                } else {
                    console.log(orgFilterParams)
                    this.defaultExpandedArray = orgFilterParams.orgDefaultExpandedArray;
                    this.currentDepartType = orgFilterParams.type;
                    this.currentDepartName = orgFilterParams.departName;
                    this.currentDepartWxId = orgFilterParams.wxId;
                    this.currentCode = orgFilterParams.departCode;
                    this.learnYear= orgFilterParams.learnYear;
                    this.schoolData.listQuery = orgFilterParams.listQuery;
                    this.loadschoolData(orgFilterParams.listQuery);
                }
                this.querySchoolGrade();
            }).catch();
        },
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            },
            schoolfilteredValue: function (val) {//幼儿园组织架构中筛选
                this.schoolData.listQuery.pageNo = 1;

                if (val.length == 0) {//如果是全部
                    this.schoolData.listQuery.filterStatus = '';
                } else {
                    this.schoolData.listQuery.filterStatus = val[0];

                }
                this.loadschoolData(this.schoolData.listQuery);
            },
            teacherAddressData: function (val, oldVal) {//移动到功能，用于监听地址簿的数据是否变化，及点击地址簿确定按钮
                if (JSON.stringify(val) == '{}') {
                    return;
                }
                if (val.departJson.length > 0) {
                    moveTeacher(this.multipleSelection, val.departJson).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            let _this = this;
                            this.$message({
                                message: '操作成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                    _this.teacherAddressData = {};
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }
                    }).catch();
                } else {
                    this.$message({
                        message: '请选择部门！',
                        type: 'warning'
                    });
                }

            },
            outflowTeacherAddressData: function (val, oldVal) {//移出功能，用于监听地址簿的数据是否变化，及点击地址簿确定按钮
                if (JSON.stringify(val) == '{}') {
                    return;
                }
                if (val.departJson.length > 0) {
                    outflowTeacher(this.multipleSelection, val.departJson[0].id).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            let _this = this;
                            this.$message({
                                message: '操作成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                    _this.outflowTeacherAddressData = {};
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }

                    }).catch();
                } else {
                    this.$message({
                        message: '请选择部门！',
                        type: 'warning'
                    });
                }
            },
            outflowMoveAddressData: function (val, oldVal) {//校外部门移出功能，用于监听地址簿的数据是否变化，及点击地址簿确定按钮
                if (JSON.stringify(val) == '{}') {
                    return;
                }
                if (val.departJson.length > 0) {
                    moveTeacher(this.multipleSelection, val.departJson).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            let _this = this;
                            this.$message({
                                message: '操作成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                    _this.outflowMoveAddressData = {};
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }

                    }).catch();
                } else {
                    this.$message({
                        message: '请选择部门！',
                        type: 'warning'
                    });
                }
            },
            schoolFllowAddressData: function (val, oldVal) {
                if (JSON.stringify(val) == '{}') {
                    return;
                }
                if (val.departJson.length > 0) {
                    moveSchoolfellow(this.multipleSelection, val.departJson).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            let _this = this;
                            this.$message({
                                message: '操作成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                    _this.schoolFllowAddressData = {};
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }

                    }).catch();
                } else {
                    this.$message({
                        message: '请选择部门！',
                        type: 'warning'
                    });
                }
            },
            outflowTeacherEndAddressData: function (val, oldVal) {//转为教职工用户，用于监听地址簿的数据是否变化，及点击地址簿确定按钮
                if (JSON.stringify(val) == '{}') {
                    return;
                }
                if (val.departJson.length > 0) {
                    outflowTeacherEnd(this.multipleSelection, val.departJson[0].id).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            let _this = this;
                            this.$message({
                                message: '操作成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.outflowTeacherEndAddressData = {};
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }
                    }).catch();
                } else {
                    this.$message({
                        message: '请选择部门！',
                        type: 'warning'
                    });
                }
            },
            stuAddressData: function (val, oldVal) {//移动到功能，用于监听地址簿的数据是否变化，及点击地址簿确定按钮
                if (JSON.stringify(val) == '{}') {
                    return;
                }
                if (val.departJson.length > 0) {
                    moveStudent(this.multipleSelection, val.departJson).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            let _this = this;
                            this.$message({
                                message: '操作成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                    _this.stuAddressData = {};
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }

                    }).catch();
                } else {
                    this.$message({
                        message: '请选择班级！',
                        type: 'warning'
                    });
                }

            }
        },
        methods: {
            strToHtml,
            isShowByPermission,
            confirmInitGradeClass() {
                // this.loadschoolData(this.schoolData.listQuery);

                this.$refs.initGradeClassForm.validate(isValid => {
                    if(isValid) {
                        updateInitGradeClass(this.initGradeClassForm)
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.isShowInitGradeClass = false;
                                    queryDeparts().then(res => {
                                        let packageArray = new Array();
                                        let data = res.data.data;
                                        this.sourceData = data;
                                        this.orgData = this.packageOrg(0, packageArray);
                                    }).catch();
                                    this.disabled = false;
                                    this.showGradeDialog = false;
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },
            addToCurrentDept() {
                this.addToCurrentDeptForm.names = '';
                this.isShowAddToCurrentDeptDialog = true;
            },
            addToCurrentDeptConfirm() {
                this.addToCurrentDeptForm.names = this.addToCurrentDeptForm.names.trim();
                this.$refs.addToCurrentDeptForm.validate(isValid => {
                    if (isValid) {
                        const names = [];
                        this.addToCurrentDeptForm.names.split('\n')
                            .forEach(name => {
                                const trimedName = name.trim();
                                if (trimedName !== '') {
                                    names.push(trimedName);
                                }
                            });
                        if (names.length !== 0) {
                            addUsersByDepart({
                                departId: this.schoolData.listQuery.id,
                                userNames: names.join(',')
                            })
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                        this.$message.success('添加成功');
                                        this.isShowAddToCurrentDeptDialog = false;
                                    } else {
                                        this.erroErroInfo = data.msg;
                                        this.erroDailog = true;
                                    }
                                    this.loadschoolData(this.schoolData.listQuery);
                                })
                        }
                    }
                })
            },
            exportUserQrcodeHandler() {
                exportUserQrcode({
                    departId: this.schoolData.listQuery.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'https://api.weixiaojia.net/';
                        window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.fileName}&key=${data.data.redisKey}&token=${this.$store.getters.token}`, "_blank");
                    })
            },
            exportNewStuQRCode(type) {
                this.mytype=type
                getQrCodeUrl({type:type}).then((res) => {
                    if (res.data.code === 200) {
                        this.qrcodeImgUrl = res.data.data;
                        this.isShowQrcode = true;
                    }
                }).catch(() => {
                });
            },
            filterNode(value, data) {
                if (!value) {
                    return true;
                }
                return data.label.indexOf(value.trim()) !== -1;
            },
            orgNodeClick(data) {
                this.reloadAndTable(data);
            },
            reloadAndTable(data) {
                this.showNewStuExportBtn = !!(data.label === '新生年级');
                this.defaultExpandedArray = [data.id];
                this.currentDepartType = data.type;
                this.schoolData.listQuery.type = data.type;
                this.schoolData.listQuery.id = data.id;
                this.currentDepartName = data.label;
                this.currentDepartWxId = data.wxId;
                this.currentCode = data.code;
                this.learnYear=data.learnYear
                this.resetQueryParams();
                this.$store.dispatch('SetOrgFilterParams', this.getFilterData(data.type));
                this.loadschoolData(this.schoolData.listQuery);
            },
            handleisIncludeChild() {//显示子部门switch控件事件
                this.loadschoolData(this.schoolData.listQuery);
            },
            loadschoolData(listQuery) {
                this.listLoading = true;
                getUserList(listQuery).then(res => {
                    let data = res.data.data;
                    this.schoolData.list = data.dataList;
                    this.schoolData.total = data.pagination.total;
                    this.listLoading = false;
                }).catch(err => {
                    this.listLoading = false;
                });
            },
            packageOrg(pId, packageArray) {//组装数据
                let filterArray = this.sourceData.filter(function (item) {
                    return item.pId == pId;
                });
                filterArray.forEach(item => {
                    if (item.hasChild == 0) {
                        let childArray = new Array();
                        packageArray.push({
                            id: item.id,
                            label: item.name,
                            title: item.title,
                            wxId: item.wxId,
                            type: item.dataType,
                            code: item.code,
                            learnYear: item.learnYear,
                            children: this.packageOrg(item.id, childArray)
                        });
                    } else {
                        packageArray.push({
                            id: item.id,
                            label: item.name,
                            title: item.title,
                            wxId: item.wxId,
                            code: item.code,
                             learnYear: item.learnYear,
                            type: item.dataType
                        });
                    }

                })
                return packageArray;
            },
            getFilterData(type) {
                return {
                    orgDefaultExpandedArray: this.defaultExpandedArray,
                    departName: this.currentDepartName,
                    departCode: this.currentCode,
                    learnYear: this.learnYear,
                    wxId: this.currentDepartWxId,
                    type: type,
                    listQuery: this.schoolData.listQuery
                };
            },
            getOrgType(type) {
                if (type == 1 || type == 7) {
                    return this.teacherData.listQuery;
                }
                if (type == 5) {
                    return this.schoolData.listQuery;
                }
                if (type == 2 || type == 3 || type == 4) {
                    return this.studentData.listQuery;
                }
                if (type == 10 || type == 11 || type == 12) {
                    return this.schoolFellowData.listQuery;
                }
                if (type == 20 || type == 21) {
                    return this.OutsideData.listQuery;
                }
            },
            handleInputChange: _.debounce(function (val) {
                    this.loadschoolData(this.schoolData.listQuery);
                },
                500
            ),
            handleSizeChange(val) {
                this.schoolData.listQuery.pageSize = val;
                this.loadschoolData(this.schoolData.listQuery);
            },
            handleCurrentChange(val) {
                this.schoolData.listQuery.pageNo = val;
                this.loadschoolData(this.schoolData.listQuery);
            },
            addDeaprt() {//新增部门
                this.$router.push({
                    path: 'departAdd',
                    query: {pid: this.defaultExpandedArray[0], type: this.currentDepartType}
                });
            },
            editDepart() {//修改部门
                this.$router.push({
                    path: 'departEdit',
                    query: {id: this.defaultExpandedArray[0], type: this.currentDepartType}
                });
            },
            addClassDeaprt() {//新增班级部门
                this.$router.push({
                    path: 'classDepartAdd',
                    query: {pid: this.defaultExpandedArray[0], type: this.currentDepartType}
                });
            },
            editClassDepart() {//修改班级部门
                this.$router.push({
                    path: 'classDepartEdit',
                    query: {id: this.defaultExpandedArray[0], type: this.currentDepartType}
                });
            },
            moveClassDepart() {//修改班级部门
                if (!this.defaultExpandedArray[0]) {
                    return;
                }
                this.stuClassPid = getPidByid(this.sourceData, this.defaultExpandedArray[0]).id;
                let newGradeArray = new Array();
                this.allGradeList.forEach((item) => {
                    if (item.id !== this.stuClassPid) {
                        newGradeArray.push(item);
                    }
                });
                this.showGradeList = newGradeArray;
                this.targetGrade = this.showGradeList.length ? this.showGradeList[0] : '';
                this.targetGradeId = this.showGradeList.length ? this.showGradeList[0].id : '';
                this.showGradeDialog = true;
            },
            confirmGrade() {
                // 移动班级
                let query = {
                    departId: this.defaultExpandedArray[0],
                    otherDepartId: this.targetGradeId,
                };

                this.disabled = true;
                let self = this;
                moveClassToGrade(query).then((res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '移动班级成功！',
                            type: 'success',
                            onClose: function () {
                                queryDeparts().then(res => {
                                    let packageArray = new Array();
                                    let data = res.data.data;
                                    self.sourceData = data;
                                    self.orgData = self.packageOrg(0, packageArray);
                                }).catch();
                                self.disabled = false;
                                self.showGradeDialog = false;
                            }
                        });
                    } else {
                        this.disabled = false;
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.disabled = false;
                });
            },
            querySchoolGrade() {
                let isShowNew = false;
                querySchoolGrade(isShowNew).then((res) => {
                    if (res.data.code === 200) {
                        this.allGradeList = res.data.data;
                    }
                }).catch(() => {
                });
            },
            editRootDepart() {//修改根部门
                this.$router.push({path: 'rootDepartEdit', query: {pid: this.defaultExpandedArray[0]}});
            },
            gradeDepartEdit() {//修改部门
                this.$router.push({
                    path: 'gradeDepartEdit',
                    query: {id: this.defaultExpandedArray[0], type: this.currentDepartType}
                });
            },
            addGrade() {//修改部门
                this.$router.push({
                    path: 'gradeDepartAdd',
                    query: {pid: this.defaultExpandedArray[0], type: this.currentDepartType}
                });
            },
            initGradeClasss() {//修改部门
                this.isShowInitGradeClass = true;
                this.initGradeClassForm = {
                    classCount: 1,
                    gradeCount: 1,
                    learningStages: '',
                    pid: this.defaultExpandedArray[0]
                };
            },
            toClassBatchAdd() {
                this.$router.push({
                    path: 'classBatchAdd',
                    query: {pid: this.defaultExpandedArray[0]}
                });
            },
            moveTeacher() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要移动的人员！',
                        type: 'warning'
                    });
                } else {
                    this.$refs.address.showAddress();
                }

            },
            moveSchoolFllow() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要移动的人员！',
                        type: 'warning'
                    });
                } else {
                    this.$refs.schoolFllowAddress.showAddress();
                }
            },
            moveOutTeacher() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要移动的人员！',
                        type: 'warning'
                    });
                } else {
                    this.$refs.outflowMoveAddress.showAddress();
                }

            },
            outflowTeacherEnd() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择人员！',
                        type: 'warning'
                    });
                } else {
                    this.$refs.outflowTeacherEndAddress.showAddress();
                }

            },
            moveStudent() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要移动的学生！',
                        type: 'warning'
                    });
                } else {
                    this.$refs.stuAddress.showAddress();
                }

            },
            handleSelectionChange(val) {//多选操作
                this.multipleSelection = val;
            },
            deleteTeacher() {//删除老师或校友
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要删除的人员！',
                        type: 'warning'
                    });
                } else {
                    let _this = this;
                    this.$confirm('确认要删除么?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteTeacher(_this.multipleSelection).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                this.$message({
                                    message: '删除成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.loadschoolData(_this.schoolData.listQuery);
                                    }
                                });
                            } else {
                                this.erroErroInfo = data.msg;
                                this.erroDailog = true;
                                this.loadschoolData(this.schoolData.listQuery);
                            }


                        }).catch();

                    }).catch(() => {
                    });
                }
            },
            deleteSchoolfellow() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要删除的人员！',
                        type: 'warning'
                    });
                } else {
                    let _this = this;
                    this.$confirm('确认要删除么?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteSchoolfellow(_this.multipleSelection).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                this.$message({
                                    message: '删除成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.loadschoolData(_this.schoolData.listQuery);
                                    }
                                });
                            } else {
                                this.erroErroInfo = data.msg;
                                this.erroDailog = true;
                                this.loadschoolData(this.schoolData.listQuery);
                            }


                        }).catch();

                    }).catch(() => {
                    });
                }
            },
            delSingleTeacher(row) {
                let _this = this;
                this.$confirm('确认要删除么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteTeacher([row]).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }
                    }).catch();

                }).catch(() => {
                });

            },
            deleteStudent() {//批量删除学生
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要删除的人员！',
                        type: 'warning'
                    });
                } else {
                    let _this = this;
                    this.$confirm('确认要删除么?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteStudent(_this.multipleSelection).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                this.$message({
                                    message: '删除成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.loadschoolData(_this.schoolData.listQuery);
                                    }
                                });
                            } else {
                                this.erroErroInfo = data.msg;
                                this.erroDailog = true;
                                this.loadschoolData(this.schoolData.listQuery);
                            }

                        }).catch();

                    }).catch(() => {
                    });
                }
            },
            delSingleStu(row) {
                let _this = this;
                this.$confirm('确认要删除么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteStudent([row]).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }
                    }).catch();

                }).catch(() => {
                });

            },
            addOrUpdateTeacher(source) {
                this.$router.push({
                    path: 'teacherAddEdit',
                    query: {source: source, departId: this.defaultExpandedArray[0]}
                });
            },
            addOrUpdateStu() {
                this.$router.push({
                    path: 'studentAddEdit',
                    query: {
                        departId: this.defaultExpandedArray[0],
                        departName: this.currentDepartName,
                        wxDepartId: this.currentDepartWxId
                    }
                });
            },
            outflowTeacher() {//流出老师/校外
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要移出的人员！',
                        type: 'warning'
                    });
                } else {
                    this.$refs.outflowTeacherAddress.showAddress();
                }
            },
            removeTeacherDepart() {//批量移出部门
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要移出的人员！',
                        type: 'warning'
                    });
                } else {
                    let _this = this;
                    this.$confirm('确认要移出么?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        removeTeacherDepart(_this.multipleSelection, this.defaultExpandedArray[0]).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                this.$message({
                                    message: '移出成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.loadschoolData(_this.schoolData.listQuery);
                                    }
                                });
                            } else {
                                this.erroErroInfo = data.msg;
                                this.erroDailog = true;
                                this.loadschoolData(this.schoolData.listQuery);
                            }

                        }).catch();

                    }).catch(() => {
                    });
                }
            },
            enableUser(row, way) {//启用禁用用户
                let loginname = row.loginname;
                let userId = row.id;
                let _this = this;
                let info = way == 'yes' ? '确认启用【' + row.name + '】么？' : '确认禁用【' + row.name + '】么？';
                this.$confirm(info, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    enableUser(loginname, userId, way).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            _this.loadschoolData(_this.schoolData.listQuery);
                        } else {
                            _this.$message({
                                message: data.msg,
                                type: 'error'

                            });
                        }

                    }).catch();
                }).catch();
            },
            removeSingleTeacherDepart(row) {//移出该部门单个用户
                let _this = this;
                this.$confirm('确认要移出么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeTeacherDepart([row], this.defaultExpandedArray[0]).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.$message({
                                message: '移出成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.loadschoolData(_this.schoolData.listQuery);
                                }
                            });
                        } else {
                            this.erroErroInfo = data.msg;
                            this.erroDailog = true;
                            this.loadschoolData(this.schoolData.listQuery);
                        }

                    }).catch();

                }).catch(() => {
                });
            },
            loadTeacherDetail(row) {//加载老师详情
                if (this.currentDepartType == 20 || this.currentDepartType == 21) {
                    this.$router.push({
                        path: 'teacherDetail',
                        query: {id: row.id, userType: row.type, source: 'outside'}
                    });
                } else {
                    this.$router.push({path: 'teacherDetail', query: {id: row.id, userType: row.type}});
                }

            },
            loadStudentDetail(row) {//加载学生
                this.$router.push({path: 'studentDetail', query: {id: row.id, userType: row.type}});
            },
            loadPageFormChild() {//为子组件提供刷新方法
                this.loadschoolData(this.schoolData.listQuery);
            },
            updateTeacher(row) {
                if (this.currentDepartType == 20 || this.currentDepartType == 21) {
                    this.$router.push({
                        path: 'teacherAddEdit',
                        query: {id: row.id, userType: row.type, source: 'outside'}
                    });
                } else {
                    this.$router.push({path: 'teacherAddEdit', query: {id: row.id, userType: row.type}});
                }

            },
            updateStu(row) {
                this.$router.push({
                    path: 'studentAddEdit',
                    query: {id: row.id, userType: row.type, departName: this.currentDepartName}
                });
            },
            resetQueryParams() {//重设请求参数，用于点击左边树形菜单时，重置必要数据
                this.schoolData.listQuery.pageNo = 1;
                this.schoolData.listQuery.searchVal = '';
                this.schoolData.listQuery.filterStatus = '';
                this.schoolData.listQuery.isIncludeChild = true;
                if (this.currentDepartType == 2 || this.currentDepartType == 3 || this.currentDepartType == 4) {
                    if (this.currentDepartType == 2) {
                        this.exportStudentAllUrl = global.BaseNewPath + 'sys/user/export/student?status=0&token=' + this.$store.getters.token;
                        this.exportStudentNoUrl = global.BaseNewPath + 'sys/user/export/student?status=4&token=' + this.$store.getters.token;
                        this.exportStudentQRCode = global.BaseNewPath + 'sys/user/export/exportClassQrcodeUrl?token=' + this.$store.getters.token;
                    } else {
                        this.exportStudentAllUrl = global.BaseNewPath + 'sys/user/export/student?status=0&departId=' + this.defaultExpandedArray[0] + '&departName=' + this.currentDepartName + '&token=' + this.$store.getters.token;
                        this.exportStudentNoUrl = global.BaseNewPath + 'sys/user/export/student?status=4&departId=' + this.defaultExpandedArray[0] + '&departName=' + this.currentDepartName + '&token=' + this.$store.getters.token;
                        this.exportStudentQRCode = global.BaseNewPath + 'sys/user/export/exportUserQrcode?departId=' + this.defaultExpandedArray[0] + '&token=' + this.$store.getters.token;
                    }
                }
            },
            deleteWxGrade() {//删除部门
                this.$confirm('确认要删除企微年级么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let parentDepart = getPidByid(this.sourceData, this.defaultExpandedArray[0]);
                    deleteWxGrade(this.defaultExpandedArray[0]).then(res => {
                        //处理完成之后的数据展示
                        let data = res.data;
                        if (data.code == 200) {
                            let _this = this;
                            this.$message({
                                message: '删除成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    let laodDeparData = {
                                        id: parentDepart.id,
                                        label: parentDepart.name,
                                        wxId: parentDepart.wxId,
                                        type: parentDepart.dataType,
                                        code: parentDepart.code,
                                        learnYear: parentDepart.learnYear
                                    };
                                    _this.reloadAndTable(laodDeparData);
                                    queryDeparts().then(res => {
                                        let packageArray = new Array();
                                        let data = res.data.data;
                                        _this.sourceData = data;
                                        _this.orgData = _this.packageOrg(0, packageArray);
                                    }).catch();
                                }
                            });
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'error'
                            });
                        }
                    }).catch();
                });
            },
            deleteDepart() {//删除部门
                this.$confirm('确认要删除么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let parentDepart = getPidByid(this.sourceData, this.defaultExpandedArray[0]);
                    let query = {departId: this.defaultExpandedArray[0], wxDepartId: this.currentDepartWxId};
                    deleteDepart(query).then(res => {
                        //处理完成之后的数据展示
                        let data = res.data;
                        if (data.code == 200) {
                            let _this = this;
                            this.$message({
                                message: '删除成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    let laodDeparData = {
                                        id: parentDepart.id,
                                        label: parentDepart.name,
                                        wxId: parentDepart.wxId,
                                        type: parentDepart.dataType,
                                        code: parentDepart.code,
                                        learnYear: parentDepart.learnYear
                                    };
                                    _this.reloadAndTable(laodDeparData);
                                    queryDeparts().then(res => {
                                        let packageArray = new Array();
                                        let data = res.data.data;
                                        _this.sourceData = data;
                                        _this.orgData = _this.packageOrg(0, packageArray);
                                    }).catch();
                                }
                            });
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'error'
                            });
                        }
                    }).catch();
                });
            },
            addParent(row) {
                this.$router.push({path: 'parents', query: {studentId: row.id, studentName: row.name}});
            },
            addSimpleDeaprt() {
                this.$router.push({
                    path: 'simpleDepartAddOrUpdate',
                    query: {addType: 'add', pid: this.defaultExpandedArray[0], type: this.currentDepartType}
                });
            },
            updateSimpleDeaprt() {
                this.$router.push({
                    path: 'simpleDepartAddOrUpdate',
                    query: {addType: 'edit', pid: this.defaultExpandedArray[0], type: this.currentDepartType}
                });
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../../styles/mixin.scss";

    .app-container {
        position: relative;
        box-sizing: border-box;
    }

    .org-tree {
        width: 204px;
        /* float:left; */
        overflow-y: auto;
        position: absolute;
    }

    .org-panel {
        /* float:left; */
        position: absolute;
        left: 220px;
    }

    .panel-box {
        border: 1px solid #d1dbe5;
        height: 100%;
        width: 100%;
    }

    .depart-title {
        color: #9D9D9D;
        font-size: 24px;
        margin: 9px 0;
        line-height: 50px;
        height: 30px;
    }

    .tools-btn {
        height: 40px;
        line-height: 40px;
    }

    .first-row .el-button:not(.el-input-group__append .el-button) {
        position: relative;
        /*top: 20px;*/
    }

    .tools-btn .el-button:not(.el-input-group__append .el-button) {
        margin-left: 0 !important;
    }

    .org-avatar {
        width: 25px;
        height: 25px;
        position: relative;
        top: 4px;

    }

    .gender {
        font-weight: bolder;
        font-size: 16px;

    }

    .masculinity {
        color: #20a0ff;
    }

    .femininity {
        color: #ff7575;
    }

    .class-hr {
        border: 0px;
        border-top: 1px solid #eee;
    }

    .table-tools {
        padding-left: 20px;
    }

    .class-table {
        padding: 0px 10px;
    }

    .search-input {
        width: 200px;
        float: right;
        margin-right: 10px;
        margin-top: 7px;
    }

    .first-import-btn {
        display: inline-block;
        position: relative;
        top: 0;
    }
</style>
<style scoped>
    .is-current > .el-tree-node__content:nth-child(1) {
        background-color: #EEF1F6;
    }

    .org-tree input {
        border: 0px solid #fff;
        border-bottom: 1px solid #d1dbe5;
        border-radius: 4px 0px 0px 0px;
    }

    .org-tree .el-tree {
        border: 0px solid #fff;
    }

    .org-tree {
        border: 1px solid #d1dbe5;
        border-right: 0px solid #fff;
    }

    .depart-code {
        font-size: 14px;
    }

    .org-panel .el-table__body-wrapper {
        overflow-x: auto !important; /*会将横行滚动条去掉，但如果有固定列的需求，请在代码里放开*/
    }

    .org-panel .address-list-bars {
        position: relative;
        top: 10px;
    }

    .myorgclass .el-button--mini {
        padding: 7px 6px !important;
    }

    .qrcode-schoolname {
        text-align: center;
    }

    .qrcode-content {
        text-align: center;

    }
</style>

