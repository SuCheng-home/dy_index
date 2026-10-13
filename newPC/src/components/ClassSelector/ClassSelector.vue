<template>
    <div class="selector-container" :style="{display: `${inline ? 'inline-block' : 'block'}`}">
        <span>
             <span v-show="isShowText">班级:</span>
            <el-select v-model="selectClass" placeholder="请选择班级" size="medium" style="width: 150px;"
                       @change="selectClassChange">
                <el-option label="全部" :value="0" v-show="isSchoolManager && isShowAll"></el-option>
                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </span>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    import {queryRoleList} from '@/api/healthCheckStatic';
    import {
        queryDepartListTerm,
    } from '@/api/common/common';
    import {isShowByPermissionList} from "@/utils";

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
            schoolManagerPermissions: {
                default() {
                    return []
                },
                type: Array
            },
            isShowAll: {
                default: true,
                type: Boolean
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        data() {
            return {
                allGradeClassList: [],
                selectGrade: 0,
                classList: [],
                selectClass: 0,
                isSchoolManager: false,
            }
        },
        created() {
            queryRoleList(this.userInfo.id)
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    let isSchoolManager = pageData.some(item => this.schoolManagerRoles.includes(parseInt(item.constantId)));
                    this.isSchoolManager = isSchoolManager || isShowByPermissionList(this.schoolManagerPermissions);

                    queryDepartListTerm({
                        all: this.isSchoolManager,
                        currentTerm: true,
                        manager: !this.isSchoolManager,
                        notlimit: this.isSchoolManager,
                        submanager: false,
                        teacher: false,
                    })
                        .then(res => res.data)
                        .then(data => {
                            const classList = [];
                            data.data.forEach(gradeItem => {
                                if(gradeItem.childList) {
                                    gradeItem.childList.forEach(classItem => {
                                        classList.push(classItem);
                                    });
                                }
                            });
                            if(classList.length !== 0 && !this.isShowAll) {
                                this.selectClass = classList[0].id;
                                this.$emit('change', this.selectClass)
                            }
                            this.classList = classList;
                        })
                })

        },
        methods: {
            selectClassChange() {
                this.$emit('change', this.selectClass)
            },
        }
    }
</script>

<style scoped>

</style>
