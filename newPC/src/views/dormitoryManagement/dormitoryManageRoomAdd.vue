<template>
    <div class="room_add_wrap">
        <div class="header">
            <el-button @click="goBack"  size="medium">返回</el-button>
            <el-button type="primary" @click="saveNewBuilding"  size="medium">保存</el-button>
        </div>
        <div class="room_add_msg_box">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-row :gutter="50">
                    <el-col :span="12" :offset="4">
                        <el-form-item label="宿舍名称/编号" prop="name">
                            <el-input v-model.trim="ruleForm.name" :maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="床位数" prop="bedNum" v-show="!roomId">
                            <el-input-number v-model.trim="ruleForm.bedNum" :step="1" step-strictly controls-position="right" :min="1" :max="20"></el-input-number>
                        </el-form-item>
                        <el-form-item label="床位数" prop="bedNum" v-show="!!roomId">
                            <div>{{ruleForm.bedNum}}</div>
                        </el-form-item>
                        <el-form-item label="入住班级" prop="roomClassData">
                            <address-book v-model="ruleForm.roomClassData" :config="classConfigData" mode="organization"></address-book>
                        </el-form-item>
                        <el-form-item label="宿舍类型" prop="type">
                            <el-radio-group v-model="ruleForm.type">
                                <el-radio :label="1">男生宿舍</el-radio>
                                <el-radio :label="2">女生宿舍</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="排序" prop="orderNo">
                            <el-input-number v-model.trim="ruleForm.orderNo" :step="1" step-strictly controls-position="right" :min="1" :max="999"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {addDorm, editDorm, getDormInfo} from '@/api/dormitoryManage';

    export default {
        name: "dormitoryManageRoomAdd",
        props: ['currentBuilding'],
        components: {
            AddressBook
        },
        data() {
            return {
                roomId: 0,
                classConfigData: {
                    title: '请选择班级',
                    depart: { target: 'depart', departType: 's', userTypes: '2' },
                    group: false
                },
                ruleForm: {
                    name: '',
                    bedNum: 8,
                    roomClassData: {
                        departJson: []
                    },
                    type: 1,
                    orderNo: 1
                },
                rules: {
                    name: [
                        {required: true, message: '请输入宿舍名称/编号！', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符！', trigger: 'blur'}
                    ],
                    bedNum: [
                        {required: true, message: '请输入床位数！', trigger: 'blur'}
                    ],
                    roomClassData: [
                        {required: true}
                    ],
                    type: [
                        {required: true}
                    ],
                    orderNo: [
                        {required: true, message: '请输入楼层数！', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            if (this.$route.query.id) {
                this.roomId = this.$route.query.id;
                this.getDormInfo();
            }
        },
        methods: {
            goBack() {
                if (this.$route.query.id) {
                    this.$router.replace({path: 'roomInfo', query: {id: this.$route.query.id}});
                } else {
                    this.$router.replace('building');
                }
            },
            saveNewBuilding() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        if (!this.ruleForm.roomClassData.departJson || !this.ruleForm.roomClassData.departJson.length) {
                            this.$message({
                                message: '请选择班级！',
                                type: 'warning'
                            });
                            return;
                        }
                        let onlyClass = false;
                        this.ruleForm.roomClassData.departJson.forEach((item) => {
                            if (item.type !== 4) {
                                onlyClass = true;
                            }
                        });
                        if (onlyClass) {
                            this.$message({
                                message: '只能选择班级！',
                                type: 'warning'
                            });
                            return;
                        }

                        let query = {
                            classJson: JSON.stringify(this.ruleForm.roomClassData.departJson),
                            dormImage: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/dormitoryManage/bedroom.png',
                            name: this.ruleForm.name,
                            orderNo: this.ruleForm.orderNo,
                            type: this.ruleForm.type,
                        };

                        if (this.roomId) { // 编辑
                            let classNames = this.ruleForm.roomClassData.departJson.map(item => item.name).toString();
                            query.id = this.roomId;
                            query.classNames = classNames;
                            this.editDorm(query);
                        } else { // 新增
                            query.bedNum = this.ruleForm.bedNum;
                            query.buildId = this.$route.query.buildId;
                            query.floorNo = this.$route.query.floorNo;
                            this.addDorm(query);
                        }
                    }
                });
            },
            addDorm(query) {
                addDorm(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        // this.$router.replace('building');
                        this.$router.replace({path: 'roomInfo', query: {id: data.data.id}});
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            editDorm(query) {
                editDorm(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.$router.replace({path: 'roomInfo', query: {id: this.$route.query.id}});
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            getDormInfo() {
                getDormInfo(this.roomId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.ruleForm.name = data.name;
                        this.ruleForm.bedNum = data.bedNum;
                        this.ruleForm.roomClassData.departJson = JSON.parse(data.classJson);
                        this.ruleForm.type = data.type;
                        this.ruleForm.orderNo = data.orderNo;
                    }
                }).catch();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .room_add_wrap{
        .header{
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        .room_add_msg_box{
            padding-top: 20px;
        }
    }
</style>
