<template>
    <div class="app-container">
        <backtool>
            <el-button type="primary" @click="saveHandler()" size="medium">保存</el-button>
        </backtool>
        <div class="main-wrap">
            <el-table stripe :data="gradeList" border fit highlight-current-row
                      style="width: 800px;margin: 10px auto;"  :height="nobottommaxH - 40">
                <el-table-column align="center" label="负责年级"  prop="gradeName">
                </el-table-column>
                <el-table-column align="center" label="考评负责人">
                    <template slot-scope="scope">
                        <address-book style="width: 300px;" v-model="scope.row.addressData" :config="configUserData"
                                      ref="address"></address-book>
                    </template>

                </el-table-column>
            </el-table>

        </div>
    </div>
</template>
<script>
    import baseMixin from '@/mixins/baseMixin';

    import AddressBook from '@/components/AddressBook/indexExpand';
    import {
        getStuBehActivity,
        addUpdateStuBehManger
    } from '@/api/studentAwarding';

    export default {
        name: 'studentAwardingSchoolReviewrSetting',

        components: {
            AddressBook
        },
        mixins: [baseMixin],
        data() {
            return {
                gradeList: [],
                configUserData: {
                    title: '请选择负责人',
                    depart: {target: 'user', departType: 't', userTypes: '1'}
                },
                id: this.$route.query.id,
            }
        },
        created() {
            getStuBehActivity({
                activityId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    let behMangerJson = [];
                    if(data.data.behMangerJson) {
                        behMangerJson = JSON.parse(data.data.behMangerJson);
                    }
                    const gradeList = JSON.parse(data.data.classJson);
                    gradeList.forEach(gradeItem => {
                        const obj = behMangerJson.find(item => item.gradeId == gradeItem.gradeId);
                        if(obj) {
                            gradeItem.addressData = {
                                userJson: obj.userList
                            };

                        } else {
                            gradeItem.addressData = {};

                        }
                    });
                    this.gradeList = gradeList
                })
        },
        methods: {
            saveHandler() {
                if(this.gradeList.some(item => !item.addressData.userJson || item.addressData.userJson.length === 0)) {
                    this.$message.error('校评委不能为空');
                } else {
                    const args = {
                        behMangerJson: [],
                        id: this.id,
                    };

                    this.gradeList.forEach(gradeItem => {
                        const obj = {
                            activityId: this.id,
                            gradeId: gradeItem.gradeId,
                            gradeName: gradeItem.gradeName,
                            userList: []
                        };
                        if(gradeItem.addressData.userJson) {
                            gradeItem.addressData.userJson.forEach(userItem => {
                                obj.userList.push({
                                    id: userItem.id,
                                    name: userItem.name,
                                    avatar: userItem.avatar
                                });
                            });
                        }
                        args.behMangerJson.push(obj);
                    });

                    addUpdateStuBehManger(args)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('设置成功');
                                window.setTimeout(() => {
                                    this.$router.back();
                                }, 500);
                            } else {
                                this.$message.error(data.msg);
                            }
                        });
                }

            },
        }
    }
</script>
<style lang="scss" scoped>
    .header {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }

    .column-ruleForm {
        width: 810px;
        margin: 0 auto;
        padding-top: 20px;
        box-sizing: border-box;
    }

</style>
<style lang="scss">
    .column-ruleForm .required .el-form-item__label:before {
        content: "*";
        font-size: 17px;
        position: relative;
        top: 2px;
        display: inline-block;
        color: #f00;
        margin-right: 3px;
    }
</style>
