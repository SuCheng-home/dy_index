<template>
    <div class="readingplatformmapeidt">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button type="primary" size="medium" @click="addfun(1)">添加闯关书籍</el-button>
                </el-col>
            </el-row>
        </div>
           <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="leftimg">
                <div class="leftimgtop">{{ruleForm.mapName}}地图</div>
                <div class="img" :style="'background-image: url('+ruleForm.mapLogo+')'" @click="dialogVisible=true">
                <div class="img-box" :style="'height:'+widthfun()">
                      <div class="box"  v-for="(item,index) in mapBookList" :key="index" :style="boxfun(index)">
                          <img class="one" v-if="index%2==0" style="right:0;bottom:0" :src="item.coverUrl" alt="">
                          <div class="name" v-if="index%2==0" style="right:40px;bottom:0">{{item.bookName}}</div>
                          <img class="one" v-if="index%2!=0" style="left:0;bottom:-15px;" :src="item.coverUrl" alt="">
                          <div class="name" v-if="index%2!=0" style="left:40px;bottom:-15px;">{{item.bookName}}</div>
                          <img class="two" v-if="index%2==0&&(index<mapBookList.length-1)" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/read/bone.png" alt="">
                          <img class="two" v-if="index%2!=0&&(index<mapBookList.length-1)" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/read/btwo.png" alt="">
                      </div>
                </div>
                </div>
            </div>
              <el-dialog title="更换图片" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
                <div class="img-box">
                      <el-radio-group v-model="url">
                        <el-radio :label="item" v-for="(item,index) in imglist" :key="index" border>
                            <img :src="item" alt="">
                        </el-radio>
                      </el-radio-group>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="imgfun()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog :title="num==1?'新增':'编辑'+'书籍'" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="addpop" width="700px" :lock-scroll="false" :modal-append-to-body='false'>

                     <el-form :model="query" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="书籍" prop="bookId">
                    <el-select v-model="query.bookId" placeholder="请选择书籍" size="medium">
                    <el-option  :value="item.id"  :label="item.boolName" v-for="item in levelist" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                    <el-form-item label="序号" prop="passOrder">
                        <el-input-number size="medium" v-model="query.passOrder" :precision="0" :step="1" :min="1" :max="100" placeholder="请输入积分"></el-input-number>
                    </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addpop = false">取 消</el-button>
                    <el-button type="primary" @click="levefun('ruleForm')">确 定</el-button>
                </span>
            </el-dialog>
            <el-table
                ref="multipleTable"
                :data="mapBookList"
                :height="maxH"
                border
                style="width: 100%">
                <el-table-column  align="center" label="序号" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.passOrder }}</template>
                </el-table-column>
                <el-table-column align="center" label="书籍封面" >
                    <template slot-scope="scope"> <image-previewer tag="richtext">
                                 <img class="coverUrl" :src="scope.row.coverUrl" alt="">
                          </image-previewer></template>
                </el-table-column>
                <el-table-column align="center" label="书籍名称" >
                    <template slot-scope="scope">{{ scope.row.bookName }}</template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" type="text" @click="addfun(2,scope.row)"
                                      >
                                编辑
                            </el-button>
                            <el-button size="small" type="text" @click="deleteMapBooks(scope.row.id)">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
           </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {readPlatMapDetails,updateReadPlatMap,deleteMapBook,getNotInMapBookList,insertMapBook,updateMapBook} from '@/api/readingplatform';
    export default {
         components: {
            ImagePreviewer
        },
        data() {
            return {
                 rules: {
                    bookId: [
                    { required: true, message: "请选择书籍", trigger: "change" }
                    ],
                     passOrder: [
                    { required: true, message: "请输入序号", trigger: "blur" },
                    ]
                },
                mapBookList: [],
                id:this.$route.query.id,
                ruleForm: {
                    levelOrder: "",
                    mapLogo: "",
                    mapName: "",
                    id:this.$route.query.id,
                    status:2
                },
               url:"https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg1.png",
                imglist:[
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg1.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg2.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg3.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg4.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg5.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg6.png"
                ],
                dialogVisible:false,
                addpop:false,
                levelist:[],
                query:{
                    bookId:"",//	书籍ID	number
                    mapId:this.$route.query.id,//		地图ID	number
                    passOrder:1,//		关卡等级序号	number
                    id:0
                },
                num:1
            }
        },
        created() {
             this.readPlatMapDetailss();
        },
        mixins: [mixin],
        methods: {
            levefun(formName){
                    this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let $this=this;
                        if(this.num==1){
                            insertMapBook(this.query)
                        .then(res => {
                            if (res.data.code === 200) {
                            $this.$message({
                                type: "success",
                                message: "新增成功!"
                            });
                           this.addpop=false;
                            this.readPlatMapDetailss();
                            }else{
                            this.$message({type: 'error', message:res.data.msg});

                            }
                        }).catch();
                        }else{
                            updateMapBook(this.query)
                        .then(res => {
                            if (res.data.code === 200) {
                            $this.$message({
                                type: "success",
                                message: "编辑成功!"
                            });
                           this.addpop=false;
                            this.readPlatMapDetailss();
                            }else{
                            this.$message({type: 'error', message:res.data.msg});

                            }
                        }).catch();
                        }
                    }
                    });
                },
            addfun(num,obj){
               this.num=num;
               getNotInMapBookList(this.ruleForm.levelOrder).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.levelist=data.data;
                        if(!this.levelist.length&&num==1){
                           this.$message({type: 'error', message:'暂无可添加书籍，请先添加年级书籍'});
                           return;
                        }
                        if(num==2){
                             this.query.bookId=obj.bookId;
                             this.query.passOrder=obj.passOrder;
                             this.query.id=obj.id;
                             this.levelist.unshift({
                                 id:obj.bookId,
                                 boolName:obj.bookName
                             })
                        }else{
                            this.query.passOrder=1;
                            this.query.bookId=this.levelist[0].id
                        }

                        this.addpop=true;
                    }
                }).catch(() => {
                });
            },
              deleteMapBooks(id) {
                this.$confirm('是否删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMapBook(id).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.readPlatMapDetailss();
                    }
                }).catch(() => {
                });
                }).catch(() => {

                });
            },
              imgfun(){
                this.ruleForm.mapLogo=this.url;
                this.dialogVisible=false;
                 updateReadPlatMap(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  $this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });
                  $this.$router.back();
                }else{
                  this.$message({type: 'error', message:res.data.msg});

                }
              }).catch();
            },
           readPlatMapDetailss(){
               readPlatMapDetails(this.$route.query.id).then(res=>res.data).then(data=>{
                let mydata=data.data;
                this.ruleForm.levelOrder=mydata.levelOrder;
                this.ruleForm.mapLogo=mydata.mapLogo;
                this.ruleForm.mapName=mydata.mapName;
                this.mapBookList=mydata.mapBookList;
              })
           },
           widthfun(){
               let num=Math.ceil(this.mapBookList.length/2);
               if(num>2){
                   return (num*230+50)+"px";
               }else{
                   return '500px';
               }
           },
           boxfun(index){
              let onenum=index%2;
              let teonum=Math.floor(index/2);

              return 'bottom:'+(230*teonum+25+onenum*94)+'px';
           }
        }
    }
</script>
<style scoped>
.readingplatformgradeadd .el-radio__input{
                position: absolute;
                left: 120px;
                top: 4px;
        }
</style>
<style lang="scss" scoped>
    .readingplatformmapeidt {
        padding:12px;
        box-sizing: border-box;
        .header {         
           padding-bottom: 10px;
        }
         .img-box{
        img{
            width: 100px;
        }
        .el-radio{
            margin: 10px;
            height: 180px;
        }
    }
        .body{
            overflow: auto;
            position: relative;
            padding-left: 330px;
            .coverUrl{
                height: 30px;
            }
            .leftimg{
             position: absolute;
             left: 0px;
             top:0px;
             width: 330px;
             padding-right: 10px;
               border-top: 1px solid #e7eaec;
             .leftimgtop{
                    font-size: 20px;
                    line-height: 60px;
                    text-align: center;
                    color: #606266;
             }
             .img{
                  width: 100%;
                  height: 500px;
                  overflow: auto;
                  cursor:pointer;
                  background-position: center center;
                  background-size: cover;
                  .img-box{
                      position: relative;
                      .box{
                          position:absolute ;
                          left: 40px;
                          bottom:0;
                          min-height: 94px;
                          width: 240px;
                          .one{
                              width: 30px;
                              height: 30px;
                              border-radius: 50%;
                              position:absolute ;
                          }
                          .two{
                              width: 240px;
                          }
                          .name{
                              font-size: 12px;
                              line-height: 30px;
                              color:#303133;
                              position:absolute ;
                          }
                      }
                  }
             }

            }
        }
    }
</style>
