<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" size="medium" :loading="loading" @click.native="onsubmit(1)">保存
            </el-button>
            <el-button type="primary" size="medium" :loading="loading" @click.native="onsubmit(ruleForm.approveType==5?4:2)">提交
            </el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item :label="`${kind === 'file' ? '资料' : '申请'}名称`" prop="name">
                        <el-input maxlength="20" v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="使用时间" prop="useDate">
                        <el-date-picker
                            v-model="ruleForm.useDate"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                        <el-select v-model="ruleForm.morningOrAfternoon" placeholder="请选择">
                            <el-option label="上午" :value="1"></el-option>
                            <el-option label="下午" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用途类型" prop="useType">
                        {{ruleForm.useTypeName}}
                        <el-button type="primary" size="medium" @click="isShowTypeDialog = true">选择用途类型</el-button>
                    </el-form-item>
                    <el-form-item label="所在部门" prop="approveOptionDepart">
                        <el-select @change="$forceUpdate()" v-model="ruleForm.approveOptionDepart" placeholder="请选择">
                            <el-option v-for="(item,indexa) in departList" :key="indexa" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.approveType && ruleForm.approveType != 4 &&ruleForm.approveType != 5 && ruleForm.approveType != 2" :label="['', '年级', '部门', '教研组'][ruleForm.approveType]" prop="approveOptionValue">
                        <el-select @change="$forceUpdate()" v-model="ruleForm.approveOptionValue" placeholder="请选择">
                            <el-option v-for="(item,indexb) in approveOptionList" :key="indexb" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="`${kind === 'file' ? '印制份数' : '申请数量'}`" prop="copies">
                        <el-input-number v-model="ruleForm.copies" :min="1" :max="9999" :step="1" step-strictly :label="`请输入${kind === 'file' ? '印制份数' : '申请数量'}`"></el-input-number>
                    </el-form-item>
                    <el-form-item v-if="kind === 'file'" label="纸张大小" prop="paperSizeType">
                        <el-select v-model="ruleForm.paperSizeType" placeholder="请选择">
                            <el-option v-for="item in typeList" :key="item.code" :label="item.value" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="kind === 'file'" label="单双页" prop="side">
                        <el-radio-group v-model="ruleForm.side">
                            <el-radio :label="1">单面</el-radio>
                            <el-radio :label="2">双面</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注" prop="applyRemark">
                        <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入备注"
                            v-model="ruleForm.applyRemark">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="图片"  v-if="JSON.parse(ruleForm.photoJson||'[]').length">
                           <image-previewer tag="richtext">
                                  <img class="image_view" style="width: 80px;height: 80px;margin-right: 10px;" v-for="item in JSON.parse(ruleForm.photoJson||'[]')" :key="item" :src="item" />
                                </image-previewer>
                    </el-form-item>
                    <el-form-item v-if="kind === 'file'" label="附件" prop="files">
                        <uploader pathPrefix="yinzhishenqing" module="yinzhishenqing" moduleCode="2028" :extList="allFileTypeList" v-model="files"
                                  :multiple="true"></uploader>
                        <div style="color:red">提示:为确保打印结果与您的文档一致，推荐上传pdf格式的文件</div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-dialog
            title="用途类型"
            :visible.sync="isShowTypeDialog"
            width="30%"
        >
            <el-form label-width="80px" ref="form">
                <el-form-item label="一级分类">
                    <el-select @change="setLevelObj('level1', 1)" v-model="level1Type">
                        <el-option v-for="(level1Item,indexc) in applyTypeList.children" :key="indexc" :label="level1Item.name"
                                   :value="level1Item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类"
                              v-if="level1Type && levelObj.level1 && levelObj.level1.children.length !== 0">
                    <el-select @change="setLevelObj('level2', 2)" v-model="level2Type">
                        <el-option v-for="(level2Item,indexd) in levelObj.level1.children" :key="indexd" :label="level2Item.name"
                                   :value="level2Item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="三级分类"
                              v-if="level2Type && levelObj.level2 && levelObj.level2.children.length !== 0">
                    <el-select @change="setLevelObj('level3', 3)" v-model="level3Type">
                        <el-option v-for="(level3Item,indexe) in levelObj.level2.children" :key="indexe" :label="level3Item.name"
                                   :value="level3Item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="onDialogCancel">取 消</el-button>
                <el-button type="primary" @click="onDialogConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import moment from "moment";
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import Backtool from '@/components/BackTool';
    import Uploader from '@/components/Uploader/WebUploader';
    import mixin from '@/mixins/windowResize';
    import {getDicByCode} from '@/utils/utils';
    import {
        selectUseType,
        getTypeTree,
        addOrSubmit,
        updateOrSubmit,
        getApplyEditInfo,
        findPriceList,getPrintSeniorOfficeUser
    } from '@/api/printApplication';
    import {queryDepartByUserId} from '@/api/system';

    import {mapGetters} from 'vuex';

    export default {
        components: {
             ImagePreviewer,
            Backtool,
            Uploader
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        data() {
            const filesValidator = (rule, value, callback) => {
                if (this.files.length === 0) {
                    return callback(new Error("请上传附件！"));
                } else {
                    callback();
                }
            };
            const approveOptionValueValidator = (rule, value, callback) => {
                if (this.ruleForm.approveType != 4 &&this.ruleForm.approveType != 5 && !this.ruleForm.approveOptionValue) {
                    return callback(new Error(`请选择${['', '年级', '部门', '教研组'][this.ruleForm.approveType]}`));
                } else {
                    callback();
                }
            };
            const approveOptionDepartValidator = (rule, value, callback) => {
                if (!this.ruleForm.approveOptionDepart) {
                    return callback(new Error(`请选择部门`));
                } else {
                    callback();
                }
            };
            return {
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,

                type: 'add',
                kind: this.$route.query.kind,

                isShowTypeDialog: false,
                applyTypeList: [],
                level1Type: '',
                level2Type: '',
                level3Type: '',
                levelObj: {
                    level0: null,
                    level1: null,
                    level2: null,
                    level3: null
                },

                approveOptionList: [],
                departList: [],

                ruleForm: {
                    name: '',
                    useDate: '',
                    morningOrAfternoon: 1,
                    copies: 1,
                    paperSizeType: 1,
                    side: 1,
                    applyRemark: '',
                    approveType: '',
                    useType: '',
                    useTypeName: '',
                    approveOptionValue: '',
                    approveOptionDepart: '',
                    officeId:'',
                    officeName:''
                },
                rules: {
                    name: [
                        {required: true, message: `请填写${this.kind === 'file' ? '资料名称' : '申请名称'}`, trigger: 'blur'}
                    ],
                    useDate: [
                        {required: true, message: '请选择使用时间', trigger: 'blur'}
                    ],
                    useType: [
                        {required: true, message: '请选择用途类型', trigger: 'blur'}
                    ],
                    copies: [
                        {required: true, message: `请填写${this.kind === 'file' ? '印制份数' : '申请数量'}`, trigger: 'blur'}
                    ],
                    paperSizeType: [
                        {required: true, message: '请选择纸张大小', trigger: 'blur'}
                    ],
                    side: [
                        {required: true, message: '请选择单双页', trigger: 'blur'}
                    ],
                    files: [
                        {required: true, validator: filesValidator, trigger: 'blur'}
                    ],
                    approveOptionValue: [
                        {required: true, validator: approveOptionValueValidator, message: '请选择'}
                    ],
                    approveOptionDepart: [
                        {required: true, validator: approveOptionDepartValidator, message: '请选择'}
                    ],
                },
                typeList: [],
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar'],
                files: [],
                isLimit:0
            };
        },
        mixins: [mixin],
        created() {
            getDicByCode('printSeniorApplyPaperSizeType')
                .then(list => {
                    findPriceList()
                        .then(res => res.data)
                        .then(data => {
                            const types = data.data.map(({type}) => `${type}`);
                            this.typeList = list.filter(({code}) => types.indexOf(`${code}`) != -1);
                            if (this.typeList.length !== 0 && !this.isEdit) {
                                this.ruleForm.paperSizeType = this.typeList[0].code;
                            }
                        })
                });
            this.getTypeTreeData();

            if(this.isEdit) {
                getApplyEditInfo({
                    printApplyId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data.print;
                        pageData.paperSizeType = pageData.paperSizeType.toString();
                        this.ruleForm = pageData;
                        this.ruleForm.approveOptionValue =  pageData.applyGradeId || pageData.applyGroupId;
                        this.ruleForm.approveOptionDepart = pageData.applyDepartId;
                        this.ruleForm.officeId=pageData.officeId
                        this.ruleForm.officeName=pageData.officeName
                        if(pageData.fileJson) {
                            this.files = JSON.parse(pageData.fileJson);
                        } else if(pageData.fileList) {
                            this.files = pageData.fileList;
                        }
                        if(this.ruleForm.approveType != 4) {
                            this.getSelectUserType(pageData.useType, true);
                        }
                        this.queryDepartByUserIdFunc(pageData.applyUserId);
                        this.onDialogConfirm()

                    })
            } else {
                this.queryDepartByUserIdFunc();
            }
        },
        methods: {
            setLevelObj(obj, level) {
                this.isLimit=0
                this.$set(this.levelObj, obj, this.levelObj[`level${level - 1}`].children.find(item => item.id == this[`level${level}Type`]));
                if(level == 1) {
                    this.level2Type = '';
                } else if(level == 2) {
                    this.level3Type = '';
                }
            },
            getTypeTreeData() {
                return Promise.all([
                    getTypeTree({
                        kind: 1
                    })
                        .then(res => res.data.data),
                    getTypeTree({
                        kind: 2
                    })
                        .then(res => res.data.data)
                ])
                    .then(([type1Data, type2Data]) => {
                        if(this.kind === 'file' && (!type1Data || type1Data.length == 0 || type1Data[0].children.length == 0)) {
                            this.$message.error('请设置印制申请用途类型')
                        } else if(this.kind !== 'file' && (!type2Data || type2Data.length == 0 || type2Data[0].children.length == 0)) {
                            this.$message.error('请设置耗材申请用途类型')
                        } else {
                            this.applyTypeList = this.kind === 'file' ? type1Data[0] : type2Data[0];
                            this.$set(this.levelObj, 'level0', this.kind === 'file' ? type1Data[0] : type2Data[0]);
                        }

                    })
            },
            clearDialog() {
                this.level1Type = '';
                this.level2Type = '';
                this.level3Type = '';
                this.$set(this.levelObj, 'level1', null);
                this.$set(this.levelObj, 'level2', null);
                this.$set(this.levelObj, 'level3', null);

                this.isShowTypeDialog = false;

            },
            onDialogCancel() {
                this.clearDialog();
            },
            getSelectUserType(useTypeId, isInit = false) {
                return selectUseType({
                    useTypeId
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data.dataList;
                        this.approveOptionList = pageData.map(item => {
                            return {
                                label: this.ruleForm.approveType == 3 ? item.tmgName : item.name,
                                value: item.id
                            }
                        });
                        if(pageData.length !== 0 && !isInit) {
                            this.ruleForm.approveOptionValue = pageData[0].id;
                        }
                    })
            },
            queryDepartByUserIdFunc(userId = null) {
                queryDepartByUserId(userId ? userId : this.userInfo.id, 7)
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.departList = pageData.map(item => {
                            return {
                                label: item.name,
                                value: item.id
                            }
                        });
                        if(pageData.length !== 0 && !this.isEdit) {
                            this.ruleForm.approveOptionDepart = pageData[0].id;
                        }
                    })
            },
            onDialogConfirm() {
                const selectedObj = this.levelObj.level3 || this.levelObj.level2 || this.levelObj.level1;
                let useTypeName=""
                if(this.levelObj.level1){
                    if(this.levelObj.level2){
                        useTypeName+=(this.levelObj.level1.name+'_')
                    }else{
                        useTypeName+=this.levelObj.level1.name
                    }                    
                }
                if(this.levelObj.level2){
                    if(this.levelObj.level3){
                       useTypeName+=(this.levelObj.level2.name+'_')
                    }else{
                        useTypeName+=this.levelObj.level2.name
                    }                    
                }
                if(this.levelObj.level3){
                    useTypeName+=this.levelObj.level3.name
                }
                this.ruleForm.useType = selectedObj.id;
                 this.isLimit=selectedObj.isLimit;
                this.ruleForm.useTypeName = useTypeName;
                this.ruleForm.approveType = selectedObj.approveType;
                this.ruleForm.approveOptionValue = '';
                if(this.ruleForm.approveType != 4) {
                    this.getSelectUserType(selectedObj.id);
                }

                this.clearDialog();
            },
            onsubmit(status) {
                this.$refs.ruleForm.validate(isValid => {
                    if(isValid) {
                        let args = {
                            applyRemark: this.ruleForm.applyRemark,
                            approveType: this.ruleForm.approveType,
                            copies: this.ruleForm.copies,
                            kind: this.kind === 'file' ? 1 : 2,
                            morningOrAfternoon: this.ruleForm.morningOrAfternoon,
                            name: this.ruleForm.name,
                            status,
                            useDate: moment(this.ruleForm.useDate).format('YYYY-MM-DD'),
                            useType: this.ruleForm.useType,
                            useTypeName: this.ruleForm.useTypeName
                        };
                        if(this.kind === 'file') {
                            args = {
                                ...args,
                                paperSizeType: this.ruleForm.paperSizeType,
                                side: this.ruleForm.side,
                                fileJson: this.files,
                            };
                            const pageSizeObj = this.typeList.find(item => item.code == this.ruleForm.paperSizeType);
                            args.paperSizeName = pageSizeObj.value;
                        }


                        const approveOptionObj =  this.approveOptionList.find(item => item.value == this.ruleForm.approveOptionValue);
                        switch(this.ruleForm.approveType) {
                            case 1 || '1':
                                args.applyGradeId = approveOptionObj.value;
                                args.applyGradeName = approveOptionObj.label;
                                break;
                            case 3 || '3':
                                args.applyGroupId = approveOptionObj.value;
                                args.applyGroupName = approveOptionObj.label;
                                break;
                        }
                        const approveOptionDepartObj = this.departList.find(item => item.value == this.ruleForm.approveOptionDepart);
                        args.applyDepartId = approveOptionDepartObj.value;
                        args.applyDepartName = approveOptionDepartObj.label;
                        if(this.isEdit) {
                            args.id = this.id;
                        }

                        new Promise(resolve => {
                             if(this.isLimit==4||(this.isEdit&&this.ruleForm.officeName&&this.isLimit==0)){
                        getPrintSeniorOfficeUser(this.userInfo.id)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                if(data.data){
                                    args.officeId=data.data.officeId
                                    args.officeName=data.data.officeName
                                    if(this.isEdit) {
                                           updateOrSubmit(args).then(resolve)
                                        } else {
                                            addOrSubmit(args).then(resolve)
                                        }
                                }else{
                                 this.$message.error('仅办公室成员可申请，您当前不属于任何办公室，请联系管理员');
                                }
                               
                            } else {
                                 this.$message.error(data.msg);
                            }
                        })
                    }else{                        
                        if(this.isEdit) {
                           updateOrSubmit(args).then(resolve)
                        } else {
                            addOrSubmit(args).then(resolve)
                        }
                    }
                          
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success(`${this.isEdit ? '保存' : '新增'}成功`);
                                    this.$router.back();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            });

                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    #noticeAdd .form-item--richtext {
        .el-form-item__content {
            transform: translateX(1px);
        }
    }
</style>
