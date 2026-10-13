<template>
    <div id="DeyuSettingDetail" class="page">
     <div class="page-header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary"   @click="addScoreItem(1)" size="medium">新增评价项</el-button>
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"  :height="nobottommaxH">
                 <el-table-column align="center" label="评价项图标" width="100">
                <template slot-scope="scope">
                    <img class="imgsize" v-if="scope.row.cover" :src="scope.row.cover" alt="">
                </template>
            </el-table-column>
                <el-table-column prop="title" label="评价项名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" label="评价项描述" show-overflow-tooltip></el-table-column>
                <el-table-column label="评价项类型">
                    <template slot-scope="scope">
                         {{scope.row.type == 0 ? '加分项':'减分项'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="addScoreItem(2,scope.row)" >编辑</el-button>
                        <el-button type="text" @click="deleteScoreItem(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="type==1?'新增评价项':'编辑评价项'" :visible.sync="isShowDialog" width="40%">
            <el-form ref="form" :model="formQuery" :rules="formRule" label-width="100px">
               
                <el-form-item label="评价项名称" prop="title">
                    <el-input  v-model.trim="formQuery.title" :maxlength="8" placeholder="请输入评价项"></el-input>
                </el-form-item>
                 <el-form-item label="评价项图标" class="is-required">
                    <uploader  ref="coverUploader" pathPrefix="kechengshezhi" module="" moduleCode="" useSysBucket
                              :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" openDelete
                              showMode="button" v-model="logoUrl"></uploader>
                </el-form-item>
                <el-form-item label="评价项类型" class="is-required">
                    <el-radio v-model="formQuery.type" :disabled="type==2" :label="0" @change="imgfun()">加分项</el-radio>
                    <el-radio v-model="formQuery.type" :disabled="type==2" :label="1" @change="imgfun()">减分项</el-radio>
                </el-form-item>
                <el-form-item label="评价项描述" prop="remark">
                    <el-input  v-model="formQuery.remark"   type="textarea" :maxlength="200" placeholder="请输入评价项描述"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addScoreItemSubmit">确 定</el-button>
              </span>
        </el-dialog>   
           
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import Uploader from '@/components/Uploader/WebUploader';
    import {
        getDimensionConductTypeList,
        deleteDimensionConductType,
        addDimensionConductType,
        updateSchoolConductType
    } from '@/api/deyu';
    export default {
        name: "DeyuDetail",
        data() {
            return {
                id: this.$route.query.id,
                dataList:[],
                isShowDialog: false,
                isAddBuff: true,
                formQuery: {
                    title: '',
                    cover:'',
                    remark:'',
                    type:0,
                    dimensionId: this.$route.query.id,
                },
                formRule: {
                    title: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ]
                },
                 logoUrl:[{fileUrl:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ketang/ketangadd.png'}],
                buffList: [],
                penaltyList: [],
                type:1
            }
        },
        mounted() {
            this.getDimensionConductTypeListFunc();
        },
        components: {Uploader},
        mixins: [mixins, BaseMixin],
        methods: {
            imgfun(){
              if(this.formQuery.type==0){
                  this.logoUrl=[{fileUrl:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ketang/ketangadd.png'}]
              }else{
                 this.logoUrl=[{fileUrl:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ketang/ketangjian.png'}] 
              }
            },
            getDimensionConductTypeListFunc() {
                getDimensionConductTypeList({
                    dimensionId: this.id,
                    type: 2
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    });
            },
            deleteScoreItem(id) {
                this.$confirm('确认删除这个考核项吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDimensionConductType({
                        behTypeIds: id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getDimensionConductTypeListFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
             addScoreItem(type,obj) {
                this.type=type
                this.isShowDialog = true;                     
                if(type==2){
                    this.formQuery={
                        title: obj.title,
                        cover:'',
                        remark:obj.remark,
                        type:obj.type,
                        id:obj.id,
                        dimensionId: this.$route.query.id,
                    }
                    if(this.formQuery.type==0){
                        this.logoUrl=[{fileUrl:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ketang/ketangadd.png'}]
                    }else{
                        this.logoUrl=[{fileUrl:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ketang/ketangjian.png'}] 
                    }   
                    if(obj.cover){
                      this.logoUrl=[{fileUrl:obj.cover}]
                    }   
                             
                }else{
                  this.formQuery={
                    title: '',
                    cover:'',
                    remark:'',
                    type:0,
                    dimensionId: this.$route.query.id,
                   }
                    if(this.formQuery.type==0){
                        this.logoUrl=[{fileUrl:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ketang/ketangadd.png'}]
                    }else{
                        this.logoUrl=[{fileUrl:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ketang/ketangjian.png'}] 
                    }   
                }
                
            },
            addScoreItemSubmit() {
                this.$refs.form.validate((isValid) => {
                    if(isValid) {
                         if(this.logoUrl.length==0){
                             this.$message.error('请上传评价项图标');
                            return
                        }
                         this.formQuery.cover=this.logoUrl[0].fileUrl
                          if(this.type==1){
                                    addDimensionConductType(this.formQuery).then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message:'新增成功！'
                                        });
                                        this.isShowDialog=false;
                                        this.getDimensionConductTypeListFunc()
                                    }
                                   }).catch(function () {})
                                }else{
                                    updateSchoolConductType(this.formQuery).then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message:'编辑成功！'
                                        });
                                        this.isShowDialog=false;
                                        this.getDimensionConductTypeListFunc()
                                    }
                                   }).catch(function () {})
                                }
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page {
        padding:12px;
    }
    .imgsize {
        width: 25px;
        height: 25px;
    }
    .page-header{
        padding-bottom: 10px;
    }
    .page-main {
        overflow-y: auto;
        
    }
    .section__header {
        line-height: 36px;
        border-left: 7px #409eff solid;
        padding-left: 10px;
        font-size: 20px;
        color: #666;
        font-weight: 600;
    }
    .section__main {
        margin: 20px 10px;
        overflow: hidden;
    }
    .fa-trash {
        display: none;
    }
    .score-item {
        width: 170px;
        height: 60px;
        border-radius: 15px;
        line-height: 60px;
        float: left;
        margin: 5px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        &:hover {
            opacity: 0.7;
            .fa-trash {
                display: inline-block;
            }
        }
    }
    .section--buff {
        .score-item {
            border: 1px solid #409eff;
            background-color: #409eff;
        }
    }
    .section--penalty {
        .score-item {
            border: 1px solid #f56c6c;
            background-color: #f56c6c;
        }
    }
    .score-item-add {
        border: 1px solid #ccc;
        width: 170px;
        height: 60px;
        border-radius: 15px;
        line-height: 60px;
        float: left;
        margin: 5px;
        text-align: center;
        cursor: pointer;
        font-weight: bold;
        font-size: 30px;
        color: #ccc;
        &:hover {
            box-shadow: 0 0 5px #999;
        }
    }
</style>
<style scoped>
    #DeyuSettingDetail .el-dialog {
        min-width: 560px;
    }
</style>
