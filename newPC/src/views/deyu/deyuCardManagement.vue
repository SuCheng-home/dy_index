<template>
    <div class="page deyuCardManagement">
        <div class="page-header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary"   @click="addScoreItem(1)" size="medium">新增奖章</el-button>
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"  :height="nobottommaxH">
                <el-table-column prop="orderNum" label="序号"></el-table-column>
                <el-table-column prop="title" label="奖章名称"></el-table-column>               
                <el-table-column label="奖章分类">
                    <template slot-scope="scope">
                         {{scope.row.type == 1 ? '养正卡':'嘉奖令'}}
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="奖章图片" width="100">
                <template slot-scope="scope">
                     <image-previewer  tag="richtext">
             <img class="imgsize" :src="scope.row.cover" alt="">
            </image-previewer>
                   
                </template>
            </el-table-column>
             <el-table-column prop="score" label="展示所需分值"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="addScoreItem(2,scope.row)" >编辑</el-button>
                        <el-button type="text" @click="delSchoolConductCard(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="type==1?'新增奖章':'编辑奖章'" :visible.sync="isShowDialog" width="600px">
            <el-form ref="form" :model="formQuery" :rules="formRule" label-width="140px">
               
                <el-form-item label="奖章名称" prop="title">
                    <el-input  v-model.trim="formQuery.title" :maxlength="20" placeholder="请输入奖章名称"></el-input>
                </el-form-item>
                <el-form-item label="奖章排序号" prop="orderNum">
                   <el-input-number v-model.trim="formQuery.orderNum" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
                </el-form-item>
                <el-form-item label="展示所需分值" prop="score">
                   <el-input-number v-model.trim="formQuery.score" step-strictly controls-position="right" :min="0" :max="99999" :step="1"></el-input-number>
                </el-form-item>
                <el-form-item label="奖章分类" class="is-required">
                    <el-radio v-model="formQuery.type" :disabled="type==2" :label="1">养正卡</el-radio>
                    <el-radio v-model="formQuery.type" :disabled="type==2" :label="2">嘉奖令</el-radio>
                </el-form-item>
                 <el-form-item label="奖章图片" class="is-required">
                    <uploader  useSysBucket
                              :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" openDelete
                              showMode="button" v-model="logoUrl"></uploader>
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
    import {updateSchoolConductCard,delSchoolConductCard,addSchoolConductCard,getSchoolConductCardLList} from '@/api/deyu';
    import Uploader from '@/components/Uploader/WebUploader';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
    import mixins from '@/mixins/windowResize';
    export default {
        name: "ketangAssessment",
        data() {
            return {
                dataList:[],
                isShowDialog: false,
                formQuery: {
                    title: '',
                    cover:'',
                    type:1,
                    score:0,
                    orderNum:1
                },
                logoUrl:[],
                formRule: {
                    title: [
                        { required: true, message: '请输入奖章名称', trigger: 'blur' },
                    ],
                    score: [
                        { required: true, message: '请输入奖章所需积分', trigger: 'blur' },
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' },
                    ]
                }
            }
        },
        mixins:[mixins],
         components: {Uploader,ImagePreviewer},
        mounted() {
            this.getSchoolConductCardLList()
        },
        methods: {
            //获取考核项
            getSchoolConductCardLList(){
                   getSchoolConductCardLList(0)
                                    .then(res => res.data)
                                    .then(data => {
                                    this.dataList=data.data;
                                    });
            },
            delSchoolConductCard(id) {
                this.$confirm('确认删除吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  delSchoolConductCard(id).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message:'删除成功！'
                                });
                                this.getSchoolConductCardLList()
                            }
                          }).catch(function () {})
                    
                });
            },
            addScoreItem(type,obj) {
                this.type=type
                this.isShowDialog = true;                     
                if(type==2){
                    this.formQuery={
                        title: obj.title,
                        cover:'',
                        score:obj.score,
                        type:obj.type,
                        id:obj.id,
                        orderNum:obj.orderNum
                    }  
                    if(obj.cover){
                      this.logoUrl=[{fileUrl:obj.cover}]
                    }   
                             
                }else{
                  this.formQuery={
                    title: '',
                    cover:'',
                    type:1,
                    score:0,
                    orderNum:1
                   }
                   this.logoUrl=[]
                }
                
            },
            addScoreItemSubmit() {
                this.$refs.form.validate((isValid) => {
                    if(isValid) {
                        if(this.logoUrl.length==0){
                             this.$message.error('请上传奖章图片');
                            return
                        }
                        this.formQuery.cover=this.logoUrl[0].fileUrl                        
                                //新增
                                if(this.type==1){
                                    addSchoolConductCard(this.formQuery).then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message:'新增成功！'
                                        });
                                        this.isShowDialog=false;
                                        this.getSchoolConductCardLList()
                                    }
                                   }).catch(function () {})
                                }else{
                                    updateSchoolConductCard(this.formQuery).then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message:'编辑成功！'
                                        });
                                        this.isShowDialog=false;
                                        this.getSchoolConductCardLList()
                                    }
                                   }).catch(function () {})
                                }
                                
                    }
                })
            }
        }
    }
</script>
<style>
.deyuCardManagement .upload-block-container .upload-file-item img {
    height: auto;
}</style>
<style lang="scss" scoped>
.imgsize {
        height: 25px;
    }
    .page {
        padding:12px;
    }
    .page-main {
        overflow-y: auto;
    }
    .page-header{
        border-bottom: 1px #eee solid;
        padding-bottom: 10px;
    }
    .section__header {
        line-height: 20px;
        border-left: 3px #409eff solid;
        padding-left: 10px;
        font-size: 15px;
        color: #666;
        font-weight: 600;
        margin-top: 20px;
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
        color: #fff !important;
        cursor: pointer;
         .fa{
            color: #fff !important;
        }
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
