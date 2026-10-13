<template>
    <div class="read-way">
        <div class="header">
            <el-button size="medium" @click="$router.back()">返回</el-button>&nbsp;
        </div>
        <div>
            <div>
                <div
                    class="book-item"
                    :key="index"
                    v-for="(item, index) in readWayList"
                >
                    <div :title="item.wayTypeName">
                        {{ item.wayTypeName }}
                    </div>
                    <div class="custom-icon" :style="{backgroundImage: `url(${item.logoUrl})`}"></div>
                    <i class="el-icon-edit" @click="addBook(1,item)"></i>
                    <i
                        class="el-icon-delete"
                        @click.stop="delWay(item.wayTypeId)"
                    ></i>
                </div>
            </div>
            <div
                class="book-item add-book"
                @click="addBook(0)"
            >
                <i class="el-icon-plus"></i>
            </div>
        </div>
        <el-dialog
            title="新增阅读方式"
            :visible.sync="dialogFormVisible"
            width="500px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close='cancel'
        >
            <el-form ref="form" :model="formData" label-width="100px" :rules="rules">
                <el-form-item label="阅读方式：" prop="wayTypeId" v-if="type==0">
                    <el-select size="medium" v-model="formData.wayTypeId"  placeholder="请选择书籍类型">
                        <el-option
                            v-for="item in showedWayList"
                            :key="item.code"
                            :label="item.value"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="阅读方式："  v-if="type==1">
                  {{wayTypeName}}
                </el-form-item>
                <el-form-item label="是否展示">
                    <el-switch v-model="formData.isShow" :active-value="1"
                               :inactive-value="2" on-text="是"
                               off-text="否"></el-switch>
                </el-form-item>
                  <el-form-item label="排序号" prop="orderNum">
                   <el-input-number v-model.trim="formData.orderNum" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
                </el-form-item>
                <el-form-item label="图标" prop="logoUrl">
                    <uploader pathPrefix="zizhuyuedu" module="zizhuyuedu" moduleCode="20210608" useSysBucket :multiple="false" v-model="files"
                              :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image"
                              showResult="image"></uploader>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="medium" @click="cancel">取 消</el-button>
                <el-button
                    size="medium"
                    type="primary"
                    @click="sure"
                >确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Uploader from '@/components/Uploader/WebUploader';
    import {
        addReadIndependWay,
        getReadIndependWayList,
        delReadIndependWay,updateReadIndependWay
    } from '@/api/readBookBeiyou';
    import {findSchoolDicsByCode} from '@/api/common/common';

    export default {
        data() {
            const imageValidator = (rule, value, callback) => {
                if (this.files.length === 0) {
                    callback(new Error('图标不能为空'));
                } else {
                    callback();
                }
            };
            return {
                classId: this.$route.query.classId,

                dialogFormVisible: false,
                formData: {
                    wayTypeId: '',
                    isShow: 2,
                    orderNum:1
                },
                rules: {
                    wayTypeId: [{required: true, message: '请选择阅读方式', trigger: 'blur'}],
                    logoUrl: [{
                        required: true,
                        validator: imageValidator,
                    }],
                     orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' },
                    ]
                },
                readWayList: [],
                files: [],
                wayList: [],
                type:0,
                id:0,
                wayTypeName:""

            }
        },
        computed: {
            showedWayList() {
                return this.wayList.filter(item => this.readWayList.findIndex(wayItem => wayItem.wayTypeId == item.code) === -1);
            }
        },
        created() {
            findSchoolDicsByCode({
                dicCode: 'readIndependWayType'
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.wayList = pageData;

                });
            this.getReadIndependWayListFunc();
        },
        components: {Uploader},
        methods: {
            // 获取列表
            getReadIndependWayListFunc() {
                getReadIndependWayList({
                    classId: this.classId,
                })
                    .then(res => res.data)
                    .then(data => {
                        this.readWayList = data.data;
                    })
            },
            // 点击添加
            addBook(type,obj) {
                this.dialogFormVisible = true;
                this.type=type
                if(type==1){
                    this.formData.wayTypeId=obj.wayTypeId
                    this.formData.isShow=obj.isShow
                    this.formData.orderNum=obj.orderNum
                    this.files = [{fileUrl:obj.logoUrl}]
                    this.id=obj.id
                    this.wayTypeName=obj.wayTypeName
                }else{
                    this.files = [];
                    this.formData.isShow = 2;
                    if (this.showedWayList.length !== 0) {
                        this.formData.wayTypeId = this.showedWayList[0].code;
                    } else {
                        this.formData.wayTypeId = '';
                    }
                }                
            },
            // 确认
            sure() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if(this.type==0){
                             const wayTypeObj = this.wayList.find(item => item.code == this.formData.wayTypeId);
                        addReadIndependWay({
                            classId: this.classId,
                            logoUrl: this.files[0].fileUrl,
                            wayTypeId: this.formData.wayTypeId,
                            wayTypeName: wayTypeObj.value,
                            isShow: this.formData.isShow,
                            orderNum:this.formData.orderNum,
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('新增成功');
                                    this.getReadIndependWayListFunc();
                                    this.cancel()
                                } else {
                                    this.$message.warning(data.msg);
                                }
                            }).catch(() => {
                        })

                        }else{                         
                        updateReadIndependWay({
                            logoUrl: this.files[0].fileUrl,
                            id: this.id,
                            isShow: this.formData.isShow,
                            orderNum:this.formData.orderNum,
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('编辑成功');
                                    this.getReadIndependWayListFunc();
                                    this.cancel()
                                } else {
                                    this.$message.warning(data.msg);
                                }
                            }).catch(() => {
                        })
                        }
                       

                    } else {
                        return false;
                    }
                })
            },
            // 取消
            cancel() {
                this.$refs['form'].resetFields();
                this.dialogFormVisible = false
            },
            // 删除
            delWay(id) {
                this.$confirm('确认删除此阅读方式, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delReadIndependWay({
                        wayTypeId: id,
                        classId: this.classId
                    }).then(res => {
                        if ( res.data.result) {
                            this.$message.success('删除成功');
                            this.getReadIndependWayListFunc()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                });
            }
        },
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/mixin";
    .read-way {
        padding:12px;
    }
    .header {
    border-bottom: 1px solid #e7eaec;
  }

    .header {
        padding-bottom: 10px;
    }

    .book-item.add-book {
        border: 1px solid #f8f8f8;
        background: none;
    }
    .book-item {
        position: relative;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 172px;
        height: 212px;
        text-align: center;
        margin-right: 40px;
        margin-bottom: 30px;
        margin-left: 20px;
        margin-top: 30px;
        cursor: pointer;
        background: no-repeat center center / cover url(https://cdnfile-10043692.file.myqcloud.com/admin/images/read_book/Panel.png);
        .custom-icon {
            width: 60px;
            height: 60px;
            border: 2px solid #fff;
            border-radius: 50%;
            background-color: #fff;
            position: absolute;
            left: 0;
            top: 0;
            transform: translateY(-50%) translateX(-20%);
            @include cover-bg;
        }
        .book_name {
            width: 100%;
            height: 30px;
            line-height: 30px;
            position: absolute;
            bottom: 0;
            left: 0;
            color: #fff;
            background: #bebebe;
            background: rgba(0, 0, 0, 0.3);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .el-icon-delete {
            position: absolute;
            top: 6px;
            right: 6px;
            color: #f56c6c;
            font-weight: bold;
            cursor: pointer;
            display: none;
        }
        .el-icon-edit{
            position: absolute;
            top: 6px;
            right: 32px;
            color: #409EFF;
            font-weight: bold;
            cursor: pointer;
            display: none;
        }


        &:hover {
            .el-icon-delete {
                display: inline-block;
            }
             .el-icon-edit {
                display: inline-block;
            }
        }
    }

    .no_stu_msg {
        text-align: center;
        font-size: 15px;
        color: #999;

        img {
            display: block;
            margin: 30px auto 0;
        }

        div {
            height: 20px;
            line-height: 20px;
            margin-top: -40px;
        }
    }

    .add-book {
        display: flex;

        i {
            font-size: 30px;
            color: #909399;
        }
    }
</style>
