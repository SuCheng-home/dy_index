<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item" type="primary" @click="openSettingDialog()" size="medium">新增</el-button>
            <el-button class="filter-item" type="primary" @click="jumpToPage('initSetting')" size="medium">初始化设置</el-button>
            <el-button class="filter-item" type="primary" @click="jumpToPage('typeSetting')" size="medium" v-show="isShowByPermission('/printSeniorType/toTypeListPage')">类型设置</el-button>
        </back-tool>
        <el-table stripe :data="list" border fit highlight-current-row style="width: 100%" :height="maxH">
            <el-table-column label="纸张类型">
                <template slot-scope="scope">
                    {{getTypeName(scope.row.type)}}
                </template>
            </el-table-column>
            <el-table-column label="单面印制费用（元）" prop="singlePrice">
            </el-table-column>
            <el-table-column label="双面印制费用（元）" prop="doublePrice">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="openSettingDialog(scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog width="600px" title="印制费用设置" :visible.sync="isShowSettingDialog" size="tiny" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
            <div>
                <el-form ref="priceForm" :model="priceForm" :rules="priceFormRules" label-width="150px">
                    <el-form-item label="纸张类型" prop="type">
                        <el-select :disabled="settingIsEdit" v-model="priceForm.type" placeholder="请选择">
                            <el-option v-for="item in typeList" :key="item.code" :label="item.value" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="单面印制费用（元）" prop="singlePrice">
                        <el-input v-model="priceForm.singlePrice" :maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="双面印制费用（元）" prop="doublePrice">
                        <el-input v-model="priceForm.doublePrice" :maxlength="10"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowSettingDialog = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="settingConfirmHandler" size="medium">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {isShowByPermission} from '@/utils';

    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getDicByCode} from '@/utils/utils';
    import BackTool from '@/components/BackTool';
    import {
        findPriceList,
        addPrintPrice,
        updatePrintPrice,
        delPrintPrice
    } from '@/api/printApplication';

    export default {
        name: "printSetting",
        components: {
            BackTool
        },
        mixins: [mixin, baseMixin],
        data() {
            const priceValidator = (rule, value, callback) => {
                const validRegExp = /^\d+(\.\d{1,3})?$/;
                if(value.toString().trim() !== '') {
                    if(validRegExp.test(value)) {
                        callback();
                    } else {
                        callback(new Error('请输入正确格式'));
                    }
                } else {
                    callback(new Error('请填写印制费用'));
                }
            };

            return {
                list: [],

                isShowSettingDialog: false,
                settingIsEdit: false,
                editId: '',
                priceForm: {
                    type: '',
                    singlePrice: '',
                    doublePrice: ''
                },
                priceFormRules: {
                    type: [
                        { required: true, message: "请选择纸张类型！", trigger: "blur" }
                    ],
                    singlePrice: [
                        { required: true, validator: priceValidator, trigger: "blur" }
                    ],
                    doublePrice: [
                        { required: true, validator: priceValidator, trigger: "blur" }
                    ]
                },
                typeList: []
            }
        },
        created() {
            getDicByCode('printSeniorApplyPaperSizeType')
                .then(list => {
                    this.typeList = list;
                    if(list.length !== 0) {
                        this.priceForm = {
                            type: list[0].code,
                            singlePrice: '',
                            doublePrice: ''
                        };
                    }
                    this.getPriceList();
                })
        },
        methods: {
            isShowByPermission,
            getPriceList() {
                findPriceList()
                    .then(res => res.data)
                    .then(data => {
                        this.list = data.data;
                    })
            },
            getTypeName(type) {
                const typeObj = this.typeList.find(item => item.code == type);
                return typeObj ? typeObj.value : '';
            },
            openSettingDialog(item) {
                this.settingIsEdit = !!item;
                if(this.settingIsEdit) {
                    this.editId = item.id;
                    this.priceForm = {
                        type: item.type.toString(),
                        singlePrice: item.singlePrice,
                        doublePrice: item.doublePrice
                    };
                } else {
                    this.priceForm = {
                        type: this.typeList.length !== 0 ? this.typeList[0].code : '',
                        singlePrice: '',
                        doublePrice: ''
                    };
                }
                this.isShowSettingDialog = true;
            },
            settingConfirmHandler() {
                this.$refs.priceForm.validate(isValid => {
                    if(isValid) {
                        new Promise((resolve, reject) => {
                            if(this.settingIsEdit) {
                                updatePrintPrice({
                                    id: this.editId,
                                    ...this.priceForm
                                })
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                addPrintPrice(this.priceForm)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then((data) => {
                                if(data.result) {
                                    this.isShowSettingDialog = false;
                                    this.getPriceList();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                            .catch(error => {
                            })

                    }
                })
            },
            deleteHandler(id) {
                this.$confirm('确认删除该条设置吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delPrintPrice({
                        priceIds: id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.getPriceList();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            }
        }
    }
</script>

<style scoped>

</style>
