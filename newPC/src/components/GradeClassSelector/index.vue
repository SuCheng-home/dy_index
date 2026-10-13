<template>
    <div class="selector-container" :style="{display: `${inline ? 'inline-block' : 'block'}`}">
        <template v-if="isSchoolManager || isGradeManager">
            <span v-show="isShowText">年级:</span>
            <el-select @change="selectGradeChange" v-model="selectGrade" placeholder="请选择年级" size="medium"
                       style="width: 150px;">
                <el-option label="全部" :value="0" v-show="isSchoolManager"></el-option>
                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </template>
        <span v-show="selectGrade != 0 || !isSchoolManager">
             <span v-show="isShowText">班级:</span>
            <el-select v-model="selectClass" placeholder="请选择班级" size="medium" style="width: 150px;"
                       @change="selectClassChange">
                <el-option label="全部" :value="0" v-show="isSchoolManager || isGradeManager"></el-option>
                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </span>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getManageAndOtherDepart} from '@/api/homework';
    import {isShowByPermissionList} from "@/utils";

    import {queryRoleList} from '@/api/healthCheckStatic';
    import {getSchoolGradeClass} from '@/api/common/common';

    export default {
        props: {
            inline: {
                default: true,
                type: Boolean
            },
            isShowText: {
                default: false,
                type: Boolean
            },
            schoolManagerRoles: {
                default() {
                    return [2]
                },
                type: Array
            },
            gradeManagerRoles: {
                default() {
                    return [9, 10]
                },
                type: Array
            },
            schoolManagerPermissions: {
                default() {
                    return []
                },
                type: Array
            },
            gradeManagerPermissions: {
                default() {
                    return []
                },
                type: Array
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        data() {
            return {
                allGradeClassList: [],
                gradeList: [],
                selectGrade: 0,
                classList: [],
                selectClass: 0,
                isSchoolManager: false,
                isGradeManager: false
            }
        },
        created() {
            queryRoleList(this.userInfo.id)
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    let isSchoolManager = false, isGradeManager = false;
                    isSchoolManager = pageData.some(item => this.schoolManagerRoles.includes(parseInt(item.constantId)));
                    isGradeManager = pageData.some(item => this.gradeManagerRoles.includes(parseInt(item.constantId)));
                    this.isSchoolManager = isSchoolManager || isShowByPermissionList(this.schoolManagerPermissions);
                    this.isGradeManager = isGradeManager || isShowByPermissionList(this.gradeManagerPermissions);

                    if (this.isSchoolManager) {
                        return this.getSchoolGradeClassFunc()
                            .then((data) => {
                                this.gradeList = JSON.parse(JSON.stringify(data));
                                this.selectGrade = 0;
                                this.selectGradeChange(0);
                            });
                    } else if(this.isGradeManager) {
                        return this.getSchoolGradeClassFunc()
                            .then(() => {
                                this.getManageAndOtherDepartFunc()
                                    .then(() => {
                                        if(this.gradeList.length !== 0) {
                                            this.selectGrade = this.gradeList[0].id;
                                            this.selectGradeChange(this.gradeList[0].id);
                                        }
                                    })
                            });
                    } else {
                        return this.getManageAndOtherDepartFunc()
                    }
                })

        },
        methods: {
            selectGradeChange(gradeVal) {
                if(gradeVal != 0) {
                    let gradeObj = this.allGradeClassList.find(item => item.id == gradeVal);
                    if (gradeObj) {
                        this.classList = JSON.parse(JSON.stringify(gradeObj.classList));
                        if (this.isSchoolManager || this.isGradeManager) {
                            this.selectClass = 0;
                        } else {
                            this.selectClass = this.classList[0].id;
                        }
                    }
                } else {
                    this.selectClass = 0;
                }

                this.$emit('grade-change', this.selectGrade);
                this.$emit('change', {
                    gradeId: this.selectGrade,
                    classId: this.selectClass
                });
            },
            selectClassChange() {
                this.$emit('class-change', this.selectClass);
                this.$emit('change', {
                    gradeId: this.selectGrade,
                    classId: this.selectClass
                })
            },
            // 学校年级班级
            getSchoolGradeClassFunc() {
                return getSchoolGradeClass({isFilterNewGrade: false})
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            const pageData = JSON.parse(JSON.stringify(data.data));
                            this.allGradeClassList = pageData;
                            return pageData;

                        }
                    })
            },
            // 班主任所负责班级
            getManageAndOtherDepartFunc() {
                return getManageAndOtherDepart({
                    type: this.isGradeManager ? 3 : 4
                    // type: 3
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            const pageData = JSON.parse(JSON.stringify(data.data));
                            if(this.isGradeManager) {
                                this.gradeList = pageData;
                            } else {
                                this.classList = pageData;
                                if(pageData && pageData.length !== 0) {
                                    this.selectClass = pageData[0].id;
                                    this.selectClassChange();
                                }
                            }

                        }
                    }).catch();
            },
        }
    }
</script>

<style scoped>

</style>
