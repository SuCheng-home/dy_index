<template>
    <div class="page">
        <div class="page-header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary"   @click="addScoreItem(1)" size="medium">新增内容</el-button>
        </div>
        <div class="page-main">	
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"  :height="nobottommaxH">
                <el-table-column
      type="index" label="序号"
      width="50">
    </el-table-column>
                <el-table-column prop="name" label="功能" width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="title" label="称号" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="demand" label="要求"></el-table-column>
                <el-table-column prop="scale" label="比例" width="80" show-overflow-tooltip>
                     <template slot-scope="scope">
                   {{scope.row.scale}}%
                </template>
                </el-table-column>
                <el-table-column prop="content" label="文案"></el-table-column>
                <el-table-column align="center"  label="状态" width="80"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag  size="mini"  type="info" v-if="scope.row.state==1">未启用</el-tag>
                    <el-tag  size="mini"  type="success" v-if="scope.row.state==2">启用</el-tag>
                    <el-tag  size="mini"  type="danger" v-if="scope.row.state==3">禁用</el-tag>
                </template>
            </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text"  v-if="scope.row.state==1||scope.row.state==3" @click="updateSchoolConductBehTitle(2,scope.row.id)" >启用</el-button>
                        <el-button type="text" v-if="scope.row.state==2" @click="updateSchoolConductBehTitle(3,scope.row.id)" >禁用</el-button>
                        <el-button type="text" @click="addScoreItem(2,scope.row)" >编辑</el-button>
                        <el-button type="text" @click="delSchoolConductBehTitle(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="type==1?'新增内容':'编辑内容'" :visible.sync="isShowDialog" width="40%">
            <el-form ref="form" :model="formQuery" :rules="formRule" label-width="100px">
                <el-form-item label="称号名称" prop="typeCode">
                  <el-select v-model="formQuery.typeCode" placeholder="请选择" :disabled="type==2">
                      <el-option :label="item.name" :value="item.value"   v-for="(item,index) in typelist" :key="value"></el-option>
                  </el-select>
                 </el-form-item>
                <el-form-item label="称号" prop="title">
                    <el-input  v-model.trim="formQuery.title" :maxlength="20" placeholder="请输入称号"></el-input>
                </el-form-item>
                <!-- <el-form-item label="排序号" prop="orderNum">
                  <el-input-number v-model.trim="formQuery.orderNum" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
                </el-form-item> -->
                <el-form-item label="表扬比例" prop="scale">
                  <el-input-number v-model.trim="formQuery.scale" step-strictly controls-position="right" :min="0" :max="100" :step="1"></el-input-number>%
                </el-form-item>
                <el-form-item label="表扬要求" prop="demand">
                    <el-input  v-model.trim="formQuery.demand"   type="textarea" :maxlength="200" placeholder="请输入表扬要求"></el-input>
                </el-form-item>
                <el-form-item label="文案内容" prop="content">
                    <el-input  v-model.trim="formQuery.content"   type="textarea" :maxlength="200" placeholder="请输入文案内容(空处用{n}表示)"></el-input>
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
    import {addSchoolConductBehTitle,getSchoolConductBehTitleList,delSchoolConductBehTitle,updateSchoolConductBehTitle} from '@/api/ketang';
    import mixins from '@/mixins/windowResize';
    export default {
        name: "ketangAssessment",
        data() {
            return {
                dataList:[],
                isShowDialog: false,
                formQuery: {
                    content:"",//	文案内容	string	
                    demand:"",//	要求	string	
                    moduleType:this.$route.query.moduleType,//	1德育评价2 课堂评价	number	
                    name:"",//	称号名称	string	
                    orderNum:"",//	排序号	number	
                    scale:0,//	比例	number	
                    state:1,//	状态 1未启用 2 启用，3禁用	number	
                    title:"",//	称号	string	
                    typeCode:"",//	类型编码	string	
                },
                type:1,
                formRule: {
                    content: [
                        { required: true, message: '请输入内容', trigger: 'blur' },
                    ],
                    demand: [
                        { required: true, message: '请输入要求', trigger: 'blur' },
                    ],
                    typeCode: [
                        { required: true, message: '请选择称号名称', trigger: 'change' },
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' },
                    ],
                    scale: [
                        { required: true, message: '请输入比例', trigger: 'blur' },
                    ],
                    title: [
                        { required: true, message: '请输入称号', trigger: 'blur' },
                    ],
                },
                typelist:this.$route.query.moduleType==2?[
                    {value:10001,name:"总分优秀"},{value:10002,name:"学科优秀"},{value:10003,name:"进步奖励"},{value:10004,name:"被提醒"},{value:10005,name:"退步提醒"}
                ]:[{value:10001,name:"总分优秀"},{value:10003,name:"进步奖励"},{value:10004,name:"被提醒"},{value:10005,name:"退步提醒"}]
            }
        },
        mixins:[mixins],
        mounted() {
            this.getSchoolConductBehTitleList()
        },
        methods: {
            updateSchoolConductBehTitle(state,id) {
                this.$confirm('是否'+(state==2?'启用':'禁用'), state==2?'启用':'禁用', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateSchoolConductBehTitle({
                        id:id,
                        state:state
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: (state==2?'启用':'禁用')+'成功!'
                                });
                                this.getSchoolConductBehTitleList();
                            }
                        })
                });

            },
            //获取考核项
            getSchoolConductBehTitleList(){
                   getSchoolConductBehTitleList(this.$route.query.moduleType)
                                    .then(res => res.data)
                                    .then(data => {
                                    this.dataList=data.data;
                                    });
            },
            delSchoolConductBehTitle(id) {
                this.$confirm('确认删除这个内容吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  delSchoolConductBehTitle(id).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message:'删除成功！'
                                });
                                this.getSchoolConductBehTitleList()
                            }
                          }).catch(function () {})
                    
                });
            },
            addScoreItem(type,obj) {
                this.type=type
                this.isShowDialog = true;                     
                if(type==2){
                    this.formQuery={
                        content:obj.content,//	文案内容	string	
                        demand:obj.demand,//	要求	string	
                        moduleType:obj.moduleType,//	1德育评价2 课堂评价	number	
                        name:obj.name,//	称号名称	string	
                        orderNum:obj.orderNum,//	排序号	number	
                        scale:obj.scale,//	比例	number	
                        state:obj.state,//	状态 1未启用 2 启用，3禁用	number	
                        title:obj.title,//	称号	string	
                        typeCode:obj.typeCode-0,//	类型编码	string	
                        id:obj.id
                    }
                             
                }else{
                  this.formQuery={
                    content:"",//	文案内容	string	
                    demand:"",//	要求	string	
                    moduleType:this.$route.query.moduleType,//	1德育评价2 课堂评价	number	
                    name:"",//	称号名称	string	
                    orderNum:"",//	排序号	number	
                    scale:0,//	比例	number	
                    state:1,//	状态 1未启用 2 启用，3禁用	number	
                    title:"",//	称号	string	
                    typeCode:"",//	类型编码	string	
                   }
                }
                
            },
            addScoreItemSubmit() {
                this.$refs.form.validate((isValid) => {
                    if(isValid) {
                                //新增
                                this.formQuery.orderNum=this.formQuery.typeCode-10000
                                if(this.$route.query.moduleType==2){
                                    this.formQuery.name=this.typelist[this.formQuery.typeCode-10001].name
                                }else{
                                      this.formQuery.name=this.typelist[this.formQuery.typeCode==10001?this.formQuery.typeCode-10001:this.formQuery.typeCode-10002].name
                                }
                                                                    
                              
                                if(this.type==1){
                                    addSchoolConductBehTitle(this.formQuery).then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message:'新增成功！'
                                        });
                                        this.isShowDialog=false;
                                        this.getSchoolConductBehTitleList()
                                    }else{
                                         this.$message.error(res.data.msg);
                                        // this.isShowDialog=false;
                                    }
                                   }).catch(function () {})
                                }else{
                                    updateSchoolConductBehTitle(this.formQuery).then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message:'编辑成功！'
                                        });
                                        this.isShowDialog=false;
                                        this.getSchoolConductBehTitleList()
                                    }else{
                                         this.$message.error(res.data.msg);
                                        // this.isShowDialog=false;
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
.imgsize {
        width: 25px;
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
