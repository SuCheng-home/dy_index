<template>
    <div class="honourGradeList padding">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="证书级别" v-if="isShowByRole(33) || isShowByRole(2)" name="first"></el-tab-pane>
            <!-- <el-tab-pane label="证书类型" v-if="isShowByRole(33) || isShowByRole(2)" name="second"></el-tab-pane> -->
            <el-tab-pane label="获奖等级" v-if="isShowByRole(33) || isShowByRole(2)" name="third"></el-tab-pane>
            <el-tab-pane label="证书名称" name="fourth">
                <div>
                    <div class="header">
                        <el-row>
                            <el-col :span="24">
                                <el-select class="header-buttom" v-model="schoolTimeId" size="medium" placeholder="请选择学期"
                                           @change="getSchoolHonorTitleListFunc">
                                    <el-option
                                        v-for="item in termList"
                                        :key="item.id"
                                        :label="item.schoolTimeName"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                                <el-select style="width: 140px;" class="header-buttom" @change="getSchoolHonorTitleListFunc" v-model="gradeLevel"
                                           size="medium"
                                           placeholder="请选择年级">
                                    <el-option
                                        :key="0"
                                        label="全部年级"
                                        :value="''"
                                    >
                                    </el-option>
                                    <el-option
                                        v-for="item in allGradeList"
                                        :key="item.level"
                                        :label="item.name"
                                        :value="item.level"
                                    >
                                    </el-option>
                                </el-select>
                                <el-input size="medium"
                                          style="display: inline-block;width: 217px;"
                                          placeholder="请输入证书名称" icon="el-icon-search"
                                          @keyup.enter.native="getSchoolHonorTitleListFunc"
                                          @change="getSchoolHonorTitleListFunc"
                                          v-model="honorName">
                                </el-input>
                                <el-select v-model="certTypeCode" @change="getSchoolHonorTitleListFunc">
                                    <el-option
                                        :key="0"
                                        label="全部证书分类"
                                        :value="''"
                                    >
                                    </el-option>
                                    <el-option v-for="certItem in certTypeList" :value="certItem.typeCode1"
                                               :label="certItem.typeName"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 10px;">
                            <el-col :span="24">
                                <el-select v-model="honorTypeId" @change="getSchoolHonorTitleListFunc">
                                    <el-option
                                        :key="0"
                                        label="全部证书级别"
                                        :value="''"
                                    >
                                    </el-option>
                                    <el-option v-for="honorItem in allHonorList" :value="honorItem.honorTypeCode"
                                               :label="honorItem.honorTypeName"></el-option>
                                </el-select>
                                <el-input size="medium"
                                          style="display: inline-block;width: 217px;"
                                          placeholder="请输入证书创建人" icon="el-icon-search"
                                          @keyup.enter.native="getSchoolHonorTitleListFunc"
                                          @change="getSchoolHonorTitleListFunc"
                                          v-model="createUserName">
                                </el-input>
                                <el-button type="primary" size="medium" @click="jumpToPage('honourNameAddEdit')">添加</el-button>
                                <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `统计数据.xlsx`)" v-if="isShowByRole(33) || isShowByRole(2)">导出</el-button>
                                <el-button type="primary" size="medium" @click="copySchoolHonorTitleFunc()" v-if="isShowByRole(33) || isShowByRole(2)">复用上学期荣誉数据</el-button>
                                 <a :href="exportURL" download="模板" target="_blank" >
                                    <el-button size="medium" class="filter-item" type="primary">模板</el-button>
                                </a>
                                <el-upload class="upload-import" style="display: inline;" name='file' accept=".xls" :action="uploadPath"
                                        :data="uploadData" :show-file-list='false' :before-upload="beforeAvatarUpload"
                                        :on-success="handleAvatarSuccess">
                                    <el-button type="primary" size="medium">导入</el-button>
                                </el-upload>
                                <el-button type="danger" size="medium" @click="batchDelete()">批量删除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div>
                        <el-table
                            ref="multipleTable"
                            :data="honourTable"
                            border
                            stripe
                            class="honourTable"
                            :height="maxH - 60"
                            @select="selectionChangeHandler"
                            @select-all="selectionChangeHandler"
                            style="width: 100%"
                        >
                            <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
                            <el-table-column label="证书名称" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span class="link" @click="jumpToPage('honourNameDetail', {id: scope.row.id})">{{ scope.row.honorName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="排序"  width="60" align="center" prop="orderNum" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="分类" align="center" prop="certType" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="适用年级" align="center" prop="gradeLeaveName" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="级别" align="center" prop="honorTypeName" show-overflow-tooltip>
                            </el-table-column>
                            <!-- awardLevelJson -->
                            <el-table-column label="创建人" align="center" prop="createUserName" show-overflow-tooltip>
                            </el-table-column>
                             <el-table-column label="奖项及分值" align="center" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span   v-for="(item,index) in JSON.parse(scope.row.awardLevelJson)"
                                        :key="index">{{item.levelName}}:{{item.score}}分;</span>
                                     </template>
                            </el-table-column>
                            <el-table-column prop="address" align="center" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text"
                                               :disabled="!isShowByRole(33) && !isShowByRole(2) && scope.row.createUserId != userInfo.id"
                                               @click="jumpToPage('honourNameAddEdit', {id: scope.row.id})">编辑
                                    </el-button>
                                    <el-button size="small" :disabled="!isShowByRole(33) && !isShowByRole(2) && scope.row.createUserId != userInfo.id" type="text" @click="deleteHandler(scope.row.id)" class="buttontextred">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div style="display: none;">
            <el-table
                id="outTable"
                :data="honourTable"
                border
                stripe
                class="honourTable"
                :height="maxH - 50"
                style="width: 100%"
            >
                <el-table-column label="证书名称" align="center" prop="honorName">
                </el-table-column>
                <el-table-column label="排序" align="center" prop="orderNum">
                </el-table-column>
                <el-table-column label="分类" align="center" prop="certType">
                </el-table-column>
                <el-table-column label="适用年级" align="center" prop="gradeLeaveName">
                </el-table-column>
                <el-table-column label="级别" align="center" prop="honorTypeName">
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createUserName">
                </el-table-column>
                 <el-table-column label="奖项及分值" align="center" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span   v-for="(item,index) in JSON.parse(scope.row.awardLevelJson)"
                                        :key="index">{{item.levelName}}：{{item.score}}分；</span>
                                     </template>
                            </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {
        getSchoolHonorTitleList,
        delSchoolHonorTitle,
        listGradeLevel,
        findSchoolHonorTypeCertList,
        findSchoolHonorTypeList,
        copySchoolHonorTitle,
        delSchoolHonorTitleList
    } from '@/api/honour/honourGradeSet';
    import {
        termlist
    } from '@/api/readBookSet';
    import {isShowByRole} from '@/utils';
    import { mapGetters} from 'vuex';

    export default {
        data() {
            return {
                exportURL: "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/newrongyumobanone.xls",
                uploadPath: global.BasePath + "structure/schoolHonor/uploadSchoolHonorTitleExcel",
                uploadData: {
                    token: this.$store.getters.token
                },
                activeName: 'fourth',
                honourTable: [],
                schoolTimeId: '',
                gradeLevel: '',
                termList: [],
                allGradeList: [],
                honorName: '',
                certTypeList: [],
                certTypeCode: '',
                allHonorList: [],
                honorTypeId: '',
                createUserName: '',
                selected: []
            }
        },
        created() {
            // document.title="荣誉类型列表";
            Promise.all([
                termlist()
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.termList = pageData;
                        const currentTerm = pageData.find(item => item.isCurrent == 1);
                        if (currentTerm) {
                            this.schoolTimeId = currentTerm.id
                        }
                    }),
                listGradeLevel()
                    .then(res => res.data)
                    .then(data => {
                        this.allGradeList = data.data;
                        // if (data.data && data.data.length !== 0) {
                        //     this.gradeLevel = data.data[0].level;
                        // }
                    }),
                findSchoolHonorTypeCertList()
                    .then(res => res.data)
                    .then(data => {
                        this.certTypeList = data.data;
                        // if (data.data && data.data.length !== 0) {
                        //     this.certTypeCode = data.data[0].typeCode1;
                        // }
                    }),
                findSchoolHonorTypeList()
                    .then(res => res.data)
                    .then(data => {
                        this.allHonorList = data.data;
                        // if (data.data && data.data.length !== 0) {
                        //     this.honorTypeCode = data.data[0].honorTypeCode;
                        // }
                    })
            ])
                .then(() => {
                    this.getSchoolHonorTitleListFunc();

                });
        },
        mixins: [mixins, BaseMixin],
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            //导入
            handleAvatarSuccess(res) {
                if (!res.data) {
                    this.$message({
                        message: "导入成功！",
                        type: "success"
                    });
                     this.getSchoolHonorTitleListFunc();
                } else {
                     this.$alert(res.data, '提示', {
                        confirmButtonText: '确定'
                    });
                    this.getSchoolHonorTitleListFunc();
                }
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix !== 'xls') {
                    this.$message.error("请上传后缀为.xls的模版文件!");
                    return false;
                }
            },
            isShowByRole,
            selectable(row) {
                return isShowByRole(33) || isShowByRole(2) || row.createUserId == this.userInfo.id;
            },
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            batchDelete() {
                if(this.selected.length === 0) {
                    this.$message.error('请选择要删除的证书');
                } else {
                    this.$confirm('确认要删除么?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delSchoolHonorTitleList(this.selected.map(item => item.id))
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('删除成功');
                                    this.getSchoolHonorTitleListFunc();
                                }
                            })
                    });
                }
            },
            copySchoolHonorTitleFunc(value) {
                copySchoolHonorTitle()
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('复用成功');
                            this.getSchoolHonorTitleListFunc();
                        }
                    })
            },
            getSchoolHonorTitleListFunc() {
                this.honorName = this.honorName.trim();
                this.createUserName = this.createUserName.trim();

                getSchoolHonorTitleList({
                    certTypeCode: this.certTypeCode,
                    createUserName: this.createUserName,
                    gradeLeave: this.gradeLevel,
                    honorName: this.honorName,
                    honorTypeId: this.honorTypeId,
                    schoolTimeId: this.schoolTimeId,
                })
                    .then(res => res.data)
                    .then(data => {
                        this.honourTable = data.data;
                    })
            },
            handleClick(val) {
                if (val.name === 'first') {
                    this.$router.replace({path: 'honourGradeList'});
                } else if (val.name === 'second') {
                    this.$router.replace({path: 'honourTypeList'});
                } else if (val.name === 'third') {
                    this.$router.replace({path: 'honourLevelList'});
                }
            },
            deleteHandler(id) {
                this.$confirm('确认要删除么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delSchoolHonorTitle({
                        titleId: id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('删除成功');
                                this.getSchoolHonorTitleListFunc();
                            }
                        })
                });
            }
        }
    }
</script>
<style lang="scss" scoped>

    .padding {
        padding:12px;
        box-sizing: border-box;
    }

    .honourGradeList {
        .header {
            padding-bottom: 10px;
        }
    }

    .addOrganFrom {
        width: 80%;
    }
    .link {
        color: #409eff;
        cursor: pointer;
    }
</style>
<style lang="scss">
    @import "../../styles/mixin";
</style>

