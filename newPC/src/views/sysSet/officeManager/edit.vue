<template>
    <div class="app-container">
        <div class="header">
            <el-row>
                <el-col :span="24">
                   <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button class="filter-item" type="primary"  size="medium" @click="save()">保存</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="main-wrap">
            <el-form :model="ruleForm" ref="addServiceForm" label-width="140px"
                     class="column-ruleForm custom—scrollbar">
                <el-form-item label="名称">
                    <span>{{ruleForm.departName}}</span>
                </el-form-item>
                <el-form-item label="主任">
                    <div class="addressWidth">
                        <address-book v-model="ruleForm.managerUser" :config="configUserData"
                                      ref="address"></address-book>
                    </div>
                </el-form-item>
                <el-form-item label="副主任">
                    <div class="addressWidth">
                        <address-book v-model="ruleForm.managerOtherUser" :config="configOtherUserData"
                                      ref="address"></address-book>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {masterUpdate} from '@/api/system';
    import AddressBook from '@/components/AddressBook/indexExpand';

    export default {
        components: {
            AddressBook
        },
        data() {
            return {
                row: this.$route.params.row,
                type: this.$route.params.type,
                ruleForm: {
                    departId: '',
                    departName: '',
                    managerUser: {},
                    managerUserId: '',
                    managerUserList: [],
                    managerOtherUser: {},
                    managerOtherUserIds: '',
                    managerOtherUserList: []
                },
                managerUser: {},
                managerOtherUser: {},
                configUserData: {
                    title: '请选择主任',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    SingleChose: true
                },
                configOtherUserData: {title: '请选择副主任', depart: {target: 'user', departType: 't', userTypes: '1'}},
            }
        },
        created() {
            this.ruleForm.departName = this.row.departName;
            this.ruleForm.departId = this.row.departId;
            this.managerUserList = [];
            this.managerOtherUserList = [];
            if (this.row.userId) {
                let managerUserObj = {};
                managerUserObj.id = this.row.userId;
                managerUserObj.name = this.row.userName;
                managerUserObj.avatar = this.row.userAvatar;
                managerUserObj.dataType = "user";
                this.managerUserList.push(managerUserObj);

                this.ruleForm.managerUser = {
                    departJson: [],
                    userJson: this.managerUserList,
                    groupJson: []
                };
            }
        },
        mounted() {
            if (this.row.otherUserNames) {
                let obj = {};
                for (var i = 0; i < this.row.otherUserNames.split(',').length; i++) {
                    obj['managerOtherUser' + i] = {};
                    let otherUserNames = this.row.otherUserNames.split(",");
                    obj['managerOtherUser' + i].name = otherUserNames[i];
                    let otherUserAvatars = this.row.otherUserAvatars.split(",");
                    obj['managerOtherUser' + i].avatar = otherUserAvatars[i];
                    obj['managerOtherUser' + i].dataType = "user";
                    let otherUserIds = this.row.otherUserIds.split(",");
                    obj['managerOtherUser' + i].id = otherUserIds[i];
                }
                let otherUserIds = this.row.otherUserIds.split(",");
                if (otherUserIds.length !== 0) {
                    for (let i in obj) {
                        this.managerOtherUserList.push(obj[i]);
                    }
                }
                this.ruleForm.managerOtherUser = {
                    departJson: [],
                    userJson: this.managerOtherUserList,
                    groupJson: []
                };
            }

        },
        methods: {
            save() {
                if (this.ruleForm.managerUser) {
                    this.managerUser = this.ruleForm.managerUser.userJson;
                    if (this.managerUser) {
                        this.managerUser.forEach((item) => {
                            this.ruleForm.managerUserId = item.id;
                        })
                    }

                }
                let managerOtherUserIdsData = [];
                if (this.ruleForm.managerOtherUser) {
                    this.managerOtherUser = this.ruleForm.managerOtherUser.userJson;
                    if (this.managerOtherUser) {
                        this.managerOtherUser.forEach((item) => {
                            managerOtherUserIdsData.push(item.id);
                            this.ruleForm.managerOtherUserIds = managerOtherUserIdsData.toString();
                        })
                    }

                }


                masterUpdate({
                    departId: this.ruleForm.departId,
                    managerUserId: this.ruleForm.managerUserId,
                    managerOtherUserIds: this.ruleForm.managerOtherUserIds
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '修改成功！'
                            });
                            this.$router.push({
                                path: 'index',
                                query: {type: this.type}
                            })
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            goback() {
                this.$router.push({
                    path: 'index'
                })
            }
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
