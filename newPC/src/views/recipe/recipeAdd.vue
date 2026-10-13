<template>
    <div class="recipeAdd">
        <!--新建-->
        <back-tool v-if="JSON.stringify($route.query) === '{}'">
            <el-button class="filter-item" size="medium" type="primary" :disabled="isButtonDisabled" :loading="isShowBtnLoading"
                       @click="saveFormNew('form')">保存草稿
            </el-button>
            <el-button class="filter-item" size="medium" type="primary" :disabled="isButtonDisabled" :loading="isShowBtnLoading"
                       @click="publishFormNew('form')">发布
            </el-button>
            <el-button class="filter-item" size="medium" type="primary" :disabled="isButtonDisabled" :loading="isShowBtnLoading"
                       @click="saveAndlookFormNew('form')">保存并预览
            </el-button>
        </back-tool>
        <!--编辑-->
        <back-tool v-else>
            <el-button class="filter-item" size="medium" type="primary" :disabled="isButtonDisabled" :loading="isShowBtnLoading"
                       @click="saveFormEdit('form')">保存草稿
            </el-button>
            <el-button class="filter-item" size="medium" type="primary" :disabled="isButtonDisabled" :loading="isShowBtnLoading"
                       @click="publishFormEdit('form')">发布
            </el-button>
            <el-button class="filter-item" size="medium" type="primary" :disabled="isButtonDisabled" :loading="isShowBtnLoading"
                       @click="saveAndlookFormEdit('form')">保存并预览
            </el-button>
        </back-tool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <div class="body" :style="`height: ${nobottommaxH}px;`">
                <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form ref="form" :model="query" label-width="140px" :rules="rules">
                    <el-form-item label="食谱名称" prop="recipeWeek">
                        <el-select v-model="query.recipeWeek" placeholder="请选择食谱名称">
                            <el-option
                                v-for="weekCount in (optionsCount + 1)"
                                :label="`第${23 - optionsCount + weekCount}周食谱`"
                                :value="23 - optionsCount + weekCount"
                                :key="23 - optionsCount + weekCount">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="食谱类型" prop="recipeType">
                        <el-radio-group v-model="query.recipeType">
                            <el-radio :label="1">公共</el-radio>
                            <el-radio :label="2">老师</el-radio>
                            <el-radio :label="3">学生</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否定时" >
                    <el-checkbox v-model.trim="query.timed" :true-label="1" :false-label="0">是</el-checkbox>
                    </el-form-item>                   
                    <el-form-item label="定时时间" v-if="query.timed==1"  prop="timeDate">
                        <el-date-picker v-model="query.timeDate"  :editable="false" :clearable="false" type="datetime"   placeholder="选择日期时间">
                            </el-date-picker>
                    </el-form-item>
                     <el-form-item label="发布到网站" v-if="isOpen">
                    <el-checkbox v-model.trim="query.isSendToWebsite" :true-label="1" :false-label="0">是</el-checkbox>
                    </el-form-item>
                    <el-form-item class="form-item--rich-editor" label="食谱内容" prop="content">
                        <ueditor class="rich-editor new-editor" ref="ueditor" :defaultMes="query.content" @editModel="richTextEditHandler"></ueditor>
                    </el-form-item>
                </el-form>
            </div>

            </div>
        </div>
    </div>
</template>
<script>
    import {strToHtml} from '@/utils';
    import {
        updateOrPublishRecipe,
        insertOrPublishRecipe,
        updatePreviewRecipe,
        insertPreviewRecipe,
        getCurrentWeek,
        recipeDetails,isOpenModule
    } from '@/api/recipe';
    import BackTool from '@/components/BackTool';
    import Ueditor from '@/components/Ueditor';
    import {mapGetters} from 'vuex';
    import mixin from "@/mixins/windowResize";
    import moment from 'moment';
    export default {
        name: "recipeAdd",
        data: function () {
            return {
                optionsCount: 0,
                rules: {
                    recipeWeek: [{
                        type: 'number',
                        required: true,
                        message: '请选择食谱名称',
                        trigger: 'change'
                    }],
                    recipeType: [{
                        type: 'number',
                        required: true,
                        message: '请选择食谱类型',
                        trigger: 'change'
                    }],
                    content: [{
                        required: true,
                        message: '请输入内容',
                        trigger: 'change'
                    }],
                    timeDate:[{
                        required: true,
                        message: '请选择时间',
                        trigger: 'blur'
                    }]
                },

                query: {
                    attachList: [],
                    content: '',
                    id: 0,
                    isPc: 1,
                    isShow: 0,
                    recipeType: 1,
                    recipeWeek: 0,
                    title: '',
                    timed:'0',
                    timeDate:'',
                    isSendToWebsite:0
                },
                isButtonDisabled: false,
                isShowBtnLoading: false,
                isOpen:false
            }
        },
        mixins: [mixin],
        components: {
            Ueditor,
            BackTool
        },
        created() {
             isOpenModule(2056)
                .then(res => res.data)
                .then(newmydata => {
                    this.isOpen=newmydata.data.isOpen                     
                })
             localStorage.setItem("shipuimgnum", 1);//清除成长册缓存
            if (this.$route.query.recipeId !== undefined) {
                recipeDetails({
                    recipeId: this.$route.query.recipeId,
                    submitRead: 0
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.query.title = data.data.title;
                            this.query.id = data.data.id;
                            this.query.isSendToWebsite = data.data.isSendToWebsite||0;                            
                            if(data.data.timed==1){
                               this.query.timed = data.data.timed;
                               this.query.timeDate = data.data.timeDate.split('.')[0];
                            };                            
                            this.query.recipeWeek = data.data.recipeWeek;
                            this.optionsCount = 24 -  this.query.recipeWeek;
                            this.query.recipeType = data.data.recipeType;
                            this.query.content = strToHtml(data.data.content);
                            this.$refs.ueditor.setContent(strToHtml(data.data.content));
                            getCurrentWeek()
                                .then(res => {
                                    this.optionsCount = 24 -  res.data.data;
                                });
                        }
                    })
                    .catch(function (error) {
                    });
            } else {
                getCurrentWeek()
                    .then(res => {
                        this.query.recipeWeek = res.data.data;
                        this.optionsCount = 24 -  this.query.recipeWeek;
                    });
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        methods: {
            saveFormNew(formName) {
                this.query.title = '第'+this.query.recipeWeek+'周食谱';
                if(this.query.timed==1&&(this.query.timeDate)){
                   this.query.timeDate = moment(this.query.timeDate).format('YYYY-MM-DD HH:mm:ss');
                    if(!(new Date().getTime()<new Date(this.query.timeDate).getTime())){
                        this.$message({type: 'warning',message: '发送时间要大于当前时间！'});
                        return
                    }
                };                
                this.query.content = this.$refs.ueditor.getContent();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const that = this;
                        this.isShowBtnLoading = true;
                        this.isButtonDisabled = true;
                        insertOrPublishRecipe(this.query).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!'
                                });
                                this.$router.back();
                            }
                            that.isShowBtnLoading = false;
                            that.isButtonDisabled = false;
                        }).catch(function () {
                            that.isShowBtnLoading = false;
                            that.isButtonDisabled = false;
                        })
                    } else {

                        return false;
                    }
                });
            },
            publishFormNew(formName) {
                this.query.title = '第'+this.query.recipeWeek+'周食谱';
                if(this.query.timed==1){
                   this.query.timeDate = moment(this.query.timeDate).format('YYYY-MM-DD HH:mm:ss');
                    if(!(new Date().getTime()<new Date(this.query.timeDate).getTime())){
                        this.$message({type: 'warning',message: '发送时间要大于当前时间！'});
                        return
                    }
                }; 
                this.query.content = this.$refs.ueditor.getContent();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.query.isShow = 1;
                        const that = this;
                        this.isShowBtnLoading = true;
                        this.isButtonDisabled = true;
                        insertOrPublishRecipe(this.query).then(res => {
                            that.isShowBtnLoading = false;
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '发布成功!'
                                });
                                this.$router.back();
                            }
                        }).catch(function () {
                            that.isShowBtnLoading = false;
                            that.isButtonDisabled = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            saveAndlookFormNew(formName) {
                this.query.title = '第'+this.query.recipeWeek+'周食谱';
                if(this.query.timed==1){
                   this.query.timeDate = moment(this.query.timeDate).format('YYYY-MM-DD HH:mm:ss');
                    if(!(new Date().getTime()<new Date(this.query.timeDate).getTime())){
                        this.$message({type: 'warning',message: '发送时间要大于当前时间！'});
                        return
                    }
                }; 
                this.query.content = this.$refs.ueditor.getContent();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const that = this;
                        this.isShowBtnLoading = true;
                        this.isButtonDisabled = true;
                        insertPreviewRecipe(this.query).then(res => {
                            that.isShowBtnLoading = false;
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '保存并预览成功!'
                                });
                                this.$router.back();
                            }
                        }).catch(function () {
                            that.isShowBtnLoading = false;
                            that.isButtonDisabled = false;
                        })
                    } else {

                        return false;
                    }
                });
            },
            saveFormEdit(formName) {
                this.query.title = '第'+this.query.recipeWeek+'周食谱';
                if(this.query.timed==1){
                   this.query.timeDate = moment(this.query.timeDate).format('YYYY-MM-DD HH:mm:ss');
                    if(!(new Date().getTime()<new Date(this.query.timeDate).getTime())){
                        this.$message({type: 'warning',message: '发送时间要大于当前时间！'});
                        return
                    }
                }; 
                this.query.content = this.$refs.ueditor.getContent();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const that = this;
                        this.isShowBtnLoading = true;
                        this.isButtonDisabled = true;
                        updateOrPublishRecipe(this.query).then(res => {
                            that.isShowBtnLoading = false;
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!'
                                });
                                this.$router.back();
                            }
                        }).catch(function () {
                            that.isShowBtnLoading = false;
                            that.isButtonDisabled = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            publishFormEdit(formName) {
                this.query.title = '第'+this.query.recipeWeek+'周食谱';
                if(this.query.timed==1){
                   this.query.timeDate = moment(this.query.timeDate).format('YYYY-MM-DD HH:mm:ss');
                    if(!(new Date().getTime()<new Date(this.query.timeDate).getTime())){
                        this.$message({type: 'warning',message: '发送时间要大于当前时间！'});
                        return
                    }
                }; 
                this.query.content = this.$refs.ueditor.getContent();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.query.isShow = 1;
                        const that = this;
                        this.isShowBtnLoading = true;
                        this.isButtonDisabled = true;
                        updateOrPublishRecipe(this.query).then(res => {
                            that.isShowBtnLoading = false;
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '发布成功!'
                                });
                                this.$router.back();
                            }
                        }).catch(function () {
                            that.isShowBtnLoading = false;
                            that.isButtonDisabled = false;
                        })
                    } else {

                        return false;
                    }
                });
            },
            saveAndlookFormEdit(formName) {
                this.query.title = '第'+this.query.recipeWeek+'周食谱';
                if(this.query.timed==1){
                   this.query.timeDate = moment(this.query.timeDate).format('YYYY-MM-DD HH:mm:ss');
                    if(!(new Date().getTime()<new Date(this.query.timeDate).getTime())){
                        this.$message({type: 'warning',message: '发送时间要大于当前时间！'});
                        return
                    }
                }; 
                this.query.content = this.$refs.ueditor.getContent();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const that = this;
                        this.isShowBtnLoading = true;
                        this.isButtonDisabled = true;
                        updatePreviewRecipe(this.query).then(res => {
                            that.isShowBtnLoading = false;
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '保存并预览成功!'
                                });
                                this.$router.back();
                            }
                        }).catch(function () {
                            that.isShowBtnLoading = false;
                            that.isButtonDisabled = false;
                        })
                    } else {

                        return false;
                    }
                });
            },
            richTextEditHandler(content) {
                this.query.content = content;
                this.$refs.form.validateField('content');
            }
        }
    }
</script>
<style lang="scss">
    @import '../../styles/mixin';
    @include globalstyle();
    .form-item--rich-editor .el-form-item__content {
        line-height: inherit !important;
    }
    .body{
        overflow: auto;
    }
    .recipeAdd{
        padding:12px;
       .el-date-editor.el-input,.el-select {
            width: 100%;
        }
        
    }
</style>
