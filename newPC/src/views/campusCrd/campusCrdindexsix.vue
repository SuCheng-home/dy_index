<template>
    <div class="campusCrdindexsix">
        <el-tabs type="border-card" v-model="activeName" @tab-click="campusCrdindex()">
            <el-tab-pane label="学生卡" name="one"></el-tab-pane>
            <el-tab-pane label="老师卡" name="two" v-if="isShowByPermission('/campusCard/isManager')"></el-tab-pane>
            <el-tab-pane label="班级卡" name="three" v-if="isShowByPermission('/campusCard/isManager')"></el-tab-pane>
            <el-tab-pane label="班级卡扫码动态" name="four"
                         v-if="isShowByPermission('/elasticSchool/threeCard')"></el-tab-pane>
            <el-tab-pane label="班级卡扫码静态" name="five"
                         v-if="isShowByPermission('/elasticSchool/threeCard')"></el-tab-pane>
            <el-tab-pane label="社团卡扫码" name="six" v-if="isShowByPermission('/elasticSchool/threeCard')">
                <div class="top">
                    <el-button type="primary" size="medium"   @click="dialogVisibleadd=true">新增
                    </el-button>
                    <el-button type="primary" size="medium"   @click="downImg()">批量导出</el-button>
                </div>
                <div class="subject" :style="`height: ${maxH-30}px;`">
                    <div class="box">
                        <div class="nav"><span>卡模板</span></div>
                        <div class="ul">
                            <div class="li" @click="onedialogVisible = true">
                                <img class="head-bg" :src="cardUrl" alt="">
                                <img class="head-logo" :src="schoolInfo.squareLogoUrl" alt="">
                                <img class="head-main"
                                     src="https://wxtestpb-10048617.image.myqcloud.com/20190306142242_117.jpg" alt="">
                                <p class="head-name">社团名称</p>
                            </div>
                            <div class="li" @click="twodialogVisible=true">
                                <img class="head-bg" :src="rearCardUrl" alt="">
                            </div>
                        </div>
                        <div class="nav"><span>放学卡</span></div>
                        <div class="ul">
                            <div class="li" v-for="(item,index) in mycardList" :key="index">
                                <div class="tool">
                                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                        <i class="el-icon-edit" @click="dialogVisibleeidtfun(index)"></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                        <i class="el-icon-delete" @click="deleteClassCardStatics(item.id)"></i>
                                    </el-tooltip>

                                </div>
                                <img class="img" :src="item.cardUrl" alt="">
                            </div>
                            <div class="li">
                                <img class="img" :src="rearCardUrl" alt="">
                            </div>
                        </div>
                        <el-dialog title="选择卡模板正面封面" :close-on-press-escape='false' :close-on-click-modal='false'
                                   :visible.sync="onedialogVisible" width="700px" :lock-scroll="false"
                                   :modal-append-to-body='false'>
                            <div class="img-box">
                                <el-radio-group v-model="radioone">
                                    <el-radio :label="item.remark" v-for="(item,index) in onelist" :key="index"><img
                                        class="radioimg" :src="item.remark" alt=""></el-radio>
                                </el-radio-group>
                            </div>
                            <span slot="footer" class="dialog-footer">
                        <el-button @click="onedialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="onedialogVisiblefun()">确 定</el-button>
                    </span>
                        </el-dialog>
                        <el-dialog title="选择卡模板反面封面" :close-on-press-escape='false' :close-on-click-modal='false'
                                   :visible.sync="twodialogVisible" width="700px" :lock-scroll="false"
                                   :modal-append-to-body='false'>
                            <div class="img-box">
                                <el-radio-group v-model="radiotwo">
                                    <el-radio :label="item.remark" v-for="(item,index) in twolist" :key="index"><img
                                        class="radioimg" :src="item.remark" alt=""></el-radio>
                                </el-radio-group>
                            </div>
                            <span slot="footer" class="dialog-footer">
                        <el-button @click="twodialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="twodialogVisiblefun()">确 定</el-button>
                    </span>
                        </el-dialog>
                        <el-dialog title="新增" :close-on-press-escape='false' :close-on-click-modal='false'
                                   :visible.sync="dialogVisibleadd" width="700px" :lock-scroll="false"
                                   :modal-append-to-body='false'>
                            <el-form :model="ruleFormadd" :rules="rulesadd" ref="ruleFormone" label-width="100px"
                                     class="demo-ruleForm">
                                <el-form-item label="名称" prop="cardName">
                                    <el-input v-model="ruleFormadd.cardName" :maxlength="10"
                                              placeholder="请输入名称"></el-input>
                                </el-form-item>
                                <el-form-item label="卡号" prop="cardNo">
                                    <el-input v-model="ruleFormadd.cardNo" :maxlength="30"
                                              placeholder="请输入卡号"></el-input>
                                </el-form-item>
                                <el-form-item label="等级" prop="cardLevel">
                                    <el-select v-model="ruleFormadd.cardLevel" placeholder="请选择等级">
                                        <el-option :label="item.level" :value="item.level"
                                                   v-for="(item,index) in levellist" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="排序" prop="cardOrder">
                                    <el-input v-model="ruleFormadd.cardOrder" type='number'
                                              placeholder="请输入排序"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisibleadd = false">取 消</el-button>
                        <el-button type="primary" @click="buildClassCardStatics('ruleFormone')">确 定</el-button>
                    </span>
                        </el-dialog>
                        <el-dialog title="编辑" :close-on-press-escape='false' :close-on-click-modal='false'
                                   :visible.sync="dialogVisibleeidt" width="700px" :lock-scroll="false"
                                   :modal-append-to-body='false'>
                            <el-form :model="ruleFormeidt" :rules="ruleseidt" ref="ruleFormtwo" label-width="100px"
                                     class="demo-ruleForm">
                                <el-form-item label="名称" prop="cardName">
                                    <el-input v-model="ruleFormeidt.cardName" :disabled="true" :maxlength="10"
                                              placeholder="请输入名称"></el-input>
                                </el-form-item>
                                <el-form-item label="卡号" prop="cardNo">
                                    <el-input v-model="ruleFormeidt.cardNo" :maxlength="30"
                                              placeholder="请输入卡号"></el-input>
                                </el-form-item>
                                <el-form-item label="等级" prop="cardLevel">
                                    <el-select v-model="ruleFormeidt.cardLevel" placeholder="请选择等级">
                                        <el-option :label="item.level" :value="item.level"
                                                   v-for="(item,index) in levellist" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="排序" prop="cardOrder">
                                    <el-input v-model="ruleFormeidt.cardOrder" type='number'
                                              placeholder="请输入排序"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisibleeidt = false">取 消</el-button>
                        <el-button type="primary" @click="updateClassCardStatics('ruleFormtwo')">确 定</el-button>
                    </span>
                        </el-dialog>
                    </div>
                </div>
            </el-tab-pane>
             <!-- <el-tab-pane label="一卡通对账" name="seven"  v-if="isShowByPermission('/structure/oneCartoon/rechargeThird')"></el-tab-pane> -->
        </el-tabs>

    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import {
        findSchoolDicsByCode,
        classCardStatic,
        deleteClassCardStatic,
        listGradeBySchoolType,
        buildClassCardStatic,
        updateClassCardStatic
    } from '@/api/campusCrd';
    import {isShowByPermission} from '@/utils/utils';
    import JSZip from 'jszip';
    import FileSaver from "file-saver";

    export default {
        data() {
            const cardNoValidator = (rule, value, callback) => {
                const regexp = /^\w+$/gi;
                if(value.trim() === '') {
                    callback(new Error('请输入卡号！'));
                } else if (!regexp.test(value.trim())) {
                    callback(new Error('卡号格式不正确！'));
                } else {
                    callback();
                }
            };
            return {
                activeName: 'six',
                mycardList: [],
                cardUrl: '',//正面
                rearCardUrl: '',//反面
                radioone: '',
                radiotwo: '',
                onelist: [],//正面数组
                twolist: [],//反面数组
                onedialogVisible: false,
                twodialogVisible: false,
                dialogVisibleadd: false,
                dialogVisibleeidt: false,
                ruleFormadd: {
                    cardNo: '',
                    cardName: '',
                    cardOrder: '',
                    cardUrl: '',//正面
                    rearCardUrl: '',//反面
                    cardLevel: '1',
                    type: 1
                },
                ruleFormeidt: {
                    cardUrl: '',
                    cardNo: '',
                    cardName: '',
                    cardOrder: '',
                    cardLevel: '',
                    type: 1,
                    id: ''
                },
                levellist: [],
                rulesadd: {
                    cardName: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    cardLevel: [{required: true, message: '请选择等级', trigger: 'change'}],
                    cardOrder: [{required: true, message: '请输入排序', trigger: 'blur'}, {
                        min: 1,
                        max: 5,
                        message: '长度在 1 到 5 个字符',
                        trigger: 'blur'
                    }],
                    cardNo: [{
                        required: true, trigger: 'blur', validator: cardNoValidator
                    }]
                },
                ruleseidt: {
                    cardName: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    cardLevel: [{required: true, message: '请选择等级', trigger: 'change'}],
                    cardOrder: [{required: true, message: '请输入排序', trigger: 'blur'}, {
                        min: 1,
                        max: 5,
                        message: '长度在 1 到 5 个字符',
                        trigger: 'blur'
                    }],
                    cardNo: [{
                        required: true, trigger: 'blur', validator: cardNoValidator
                    }]
                }
            }
        },
        created() {
            this.classCardStatics();
            this.findSchoolDicsByCodes();
            this.listGradeBySchoolTypes();
        },
        computed: {
            ...mapGetters(['schoolInfo']),
        },
        mixins: [mixin],
        methods: {
            //下载图片
            downImg() {
                let blogTitle = '社团卡';
                let zip = new JSZip();
                let imgs = zip.folder(blogTitle);
                let baseList = [];
                let arr = [];
                for (let i = 0; i < this.mycardList.length; i++) {
                    arr.push(this.mycardList[i].cardUrl);
                }
                // arr.push(this.rearCardUrl);
                for (let i = 0; i < arr.length; i++) {
                    let image = new Image();
                    // 解决跨域 Canvas 污染问题
                    image.setAttribute('crossOrigin', 'anonymous');
                    image.onload = function () {
                        let canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        let context = canvas.getContext('2d');
                        context.drawImage(image, 0, 0, image.width, image.height);
                        let url = canvas.toDataURL(); // 得到图片的base64编码数据
                        canvas.toDataURL('image/png');
                        baseList.push(url.substring(22));// 去掉base64编码前的 data:image/png;base64,
                        if (baseList.length === arr.length && baseList.length > 0) {
                            for (let k = 0; k < baseList.length; k++) {
                                imgs.file('社团卡' + (k + 1) + '.png', baseList[k], {base64: true})
                            }
                            zip.generateAsync({type: 'blob'}).then(function (content) {
                                FileSaver.saveAs(content, blogTitle + '.zip');
                            });
                        }
                    };
                    image.src = arr[i];
                }
            },
            isShowByPermission,
            onedialogVisiblefun() {
                this.cardUrl = this.radioone;
            },
            twodialogVisiblefun() {
                this.rearCardUrl = this.radiotwo;
            },
            //弹出编辑
            dialogVisibleeidtfun(num) {
                this.ruleFormeidt.id = this.mycardList[num].id;
                this.ruleFormeidt.cardName = this.mycardList[num].cardName;
                this.ruleFormeidt.cardOrder = this.mycardList[num].cardOrder + '';
                this.ruleFormeidt.cardLevel = this.mycardList[num].cardLevel;
                this.ruleFormeidt.cardNo = this.mycardList[num].cardNo || '';
                this.ruleFormeidt.cardUrl = this.radioone;
                this.dialogVisibleeidt = true;
            },
            //编辑
            updateClassCardStatics(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisibleeidt = false;
                        updateClassCardStatic(this.ruleFormeidt).then(res => res.data).then(data => {
                            if (data.code === 200) {
                                this.$message.success("编辑成功");
                                this.classCardStatics();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                    }
                });
            },
            //新增
            buildClassCardStatics(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleFormadd.cardUrl = this.cardUrl;
                        this.ruleFormadd.rearCardUrl = this.rearCardUrl;
                        this.dialogVisibleadd = false;
                        buildClassCardStatic(this.ruleFormadd).then(res => res.data).then(data => {
                            if (data.code === 200) {
                                this.$message.success("新增成功");
                                this.classCardStatics();
                                this.ruleFormadd.cardName = '';
                                this.ruleFormadd.cardOrder = '';
                                this.ruleFormadd.cardNo = '';
                                this.ruleFormadd.cardLevel = '1';
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                    }
                });
            },
            //等级
            listGradeBySchoolTypes() {
                listGradeBySchoolType(this.schoolInfo.type).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.levellist = data.data;
                    }
                })
            },
            //获取卡列表
            classCardStatics() {
                classCardStatic(1).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.mycardList = data.data.cardList;
                    }
                })
            },
            //获取正反面字典数组
            findSchoolDicsByCodes() {
                findSchoolDicsByCode('static_class_card_front').then(res => res.data).then(data => {
                    if (data.code === 200) {
                        if (data.data.length > 0) {
                            this.onelist = data.data;
                            this.cardUrl = data.data[0].remark;
                            this.radioone = data.data[0].remark;
                        } else {
                            this.cardUrl = 'https://cdnfile-10043692.file.myqcloud.com/admin/images/schoolCardManage/school_cover.png';
                        }
                    }
                });
                findSchoolDicsByCode('static_class_card_back').then(res => res.data).then(data => {
                    if (data.data.length > 0) {
                        this.rearCardUrl = data.data[0].remark;
                        this.twolist = data.data;
                        this.radiotwo = data.data[0].remark;
                    } else {
                        this.rearCardUrl = 'https://cdnfile-10043692.file.myqcloud.com/admin/images/schoolCardManage/school_bg.png';
                    }
                });
            },
            //删除
            deleteClassCardStatics(id) {
                this.$confirm("确认要删除吗？", "删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    lockScroll: false
                }).then(() => {
                    deleteClassCardStatic(id).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success("删除成功");
                            this.classCardStatics();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                })
                    .catch(() => {
                    });
            },
            //卡
            campusCrdindex() {
                if (this.activeName == 'two') {
                    this.$router.push({
                        path: "campusCrdindextwo"
                    });
                }
                if (this.activeName == 'three') {
                    this.$router.push({
                        path: "campusCrdindexthree"
                    });
                }
                if (this.activeName == 'four') {
                    this.$router.push({
                        path: "campusCrdindexfour"
                    });
                }
                if (this.activeName == 'five') {
                    this.$router.push({
                        path: "campusCrdindexfive"
                    });
                }
                if (this.activeName == 'one') {
                    this.$router.push({
                        path: "campusCrdindexone"
                    });
                }
                 if(this.activeName=="seven"){
                        this.$router.push({
                            path: "campusCrdReconciliation"
                        });
                    }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .campusCrdindexsix {
        padding: 12px;

        .top {
            border-bottom: 1px solid #e7eaec;
            padding: 0 0 10px 0;
        }

        .subject {
            overflow: auto;

            .el-select {
                width: 560px;
            }

            .nav {
                height: 20px;
                line-height: 20px;
                margin: 15px 0px;
                padding-left: 8px;
                border-left: 4px solid #409eff;
                color: #333;
            }

            .radioimg {
                float: left;
                width: 280px;
                margin-bottom: 10px;
            }

            .ul {
                overflow: hidden;

                .li {
                    width: 350px;
                    height: 225px;
                    position: relative;
                    margin-right: 8px;
                    margin-bottom: 10px;
                    float: left;
                    background: #fff;
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;

                    .tool {
                        display: none;
                        position: absolute;
                        z-index: 2;
                        left: 0;
                        top: 0;
                        height: 40px;
                        width: 100%;
                        background: rgba(136, 136, 136, 0.5);
                        text-align: right;

                        i {
                            font-size: 20px;
                            line-height: 40px;
                            margin-right: 15px;
                            color: red;
                        }

                        .el-icon-edit {
                            color: #409eff;
                        }
                    }

                    .img {
                        display: block;
                        max-width: 100%;
                        width: 350px;
                        height: 225px;
                    }

                    .head-bg {
                        display: block;
                        max-width: 100%;
                        width: 350px;
                        height: 225px;
                        cursor: pointer;
                    }

                    .head-logo {
                        position: absolute;
                        left: 18px;
                        top: 23px;
                        width: 164px;
                        height: 42px;
                        z-index: 2;
                        cursor: pointer;
                    }

                    .head-main {
                        position: absolute;
                        right: 36px;
                        top: 61px;
                        width: 112px;
                        height: 112px;
                        z-index: 2;
                        cursor: pointer;
                    }

                    .head-name {
                        width: 112px;
                        font-size: 14px;
                        color: #661b18;
                        text-align: center;
                        padding-top: 4px;
                        position: absolute;
                        right: 36px;
                        top: 173px;
                        cursor: pointer;
                    }
                }

                .li:hover {
                    .tool {
                        display: block;
                    }
                }
            }
        }
    }
</style>
