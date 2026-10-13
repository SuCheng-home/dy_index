<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
           <el-button type="primary" size="medium"  @click.native="imgpopfun()">回复</el-button>
        </backtool>
        <el-dialog title="回复" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="imgpop" width="600px" :lock-scroll="false" :modal-append-to-body='false'>
		    <el-input v-show="isReplyText==1"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="replyContent">
            </el-input>
                 <uploader v-show="isReplyFile==1" pathPrefix="fabuyingyong" module="fabuyingyong" :moduleCode="moduleCode" multiple v-model="fileJson"
                          :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image"
                          showResult="image"></uploader>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="imgpop=false">取 消</el-button>
				<el-button type="primary" @click="addMsgUserReply()">确 定</el-button>
			</span>
		</el-dialog>
        <div :style="{'height':maxH+'px'}" style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <div class="stu"  v-for="(items,indexs) in dataList" :key="indexs">                   
                   <div class="stubox">
                       <img :src="items.avatar" />
                       {{items.userName}}&nbsp;&nbsp;{{items.replyTime}}
                    </div>
                       <div class="stutxt">
                            {{items.replyContent}}
                          <image-previewer tag="richtext"  viewclass="pic-item">
                                <div class="pic-container" >
                                    <img  class="imgcontainer" v-for="(item,index) in JSON.parse(items.fileJson)" :key="index" :src="item.fileUrl"/>
                                </div>
                            </image-previewer>
                       </div>
                </div>
                
            </div>
        </div>
         <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pagination.pageNo"
                :page-sizes="[10 , 20, 30, 50]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import Uploader from '@/components/Uploader/WebUploader';
    import {addMsgUserReply, getMsgUserReplyListPage,getMsgInit} from '@/api/releaseTemplate';
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {mapGetters} from 'vuex';
    export default {
        components: {
            Backtool,
            Uploader,
            ImagePreviewer
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        data() {         
            return {
                dataList: [],
                moduleCode:this.$route.query.newmoduleCode,
                pagination:{
                    pageNo:1,
                    pageSize:20,
                    total:0,
                    msgId:this.$route.query.id,
                },
                imgpop:false,
                fileJson:[],
                replyContent:'',
                isReplyFile:2,
                isReplyText:2
            };
        },
        mixins: [mixin],
        created() {
           this.getMsgUserReplyListPage()
           getMsgInit(this.$route.query.newmoduleCode)
                    .then(data => {
                        this.isReplyFile=data.data.data.isReplyFile
                        this.isReplyText=data.data.data.isReplyText
                    })
        },
        methods: {
             addMsgUserReply(status) {
                 if(this.fileJson.length==0&&!this.replyContent){
                     this.$message.error('回复信息不能为空');
                     return
                 }
                 const query = {
                            avatar:this.userInfo.avatar,//	头像	string	
                            fileJson:this.fileJson,//	回复附件son	string	
                            msgId:this.pagination.msgId,//	消息id	number	
                            replyContent:this.replyContent,//	回复内容	string	
                            userId:this.userInfo.id,//	用户id	number	
                            userName:this.userInfo.name,//	用户姓名	string	
                            userType:1,//	用户类型 1老师 2学生	number	
                        };                       
                       addMsgUserReply(query).then(res => {
                                        this.$message({
                                            message: '回复成功！',
                                            type: 'success',
                                            duration: 1000,
                                            onClose: () => {
                                                this.pagination.pageNo = 1;
                                                this.imgpop=false;
                                                this.getMsgUserReplyListPage();
                                            }
                                        });

                                    }).catch(err => {
                                    });
            },
            imgpopfun(){
                this.imgpop=true
                this.fileJson=[]
                this.replyContent=""
            },
             getMsgUserReplyListPage() {
                getMsgUserReplyListPage(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
             sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.pagination.pageNo = 1;
                this.getMsgUserReplyListPage();
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getMsgUserReplyListPage();            
            }
        }
    }
</script>
<style scoped>
    .el-message-box__message{
        max-height: 720px;
        overflow: hidden auto;
    }
</style>
<style lang="scss" scoped>
.stu{
 border-bottom:2px solid #eee;
 padding:10px;
}
.stubox{
    line-height: 40px;
    font-size: 16px;
    color: #333;
   
    img{
        float: left;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }
   
}
 .stutxt{
        padding-left:50px;
        color:#666;
        font-size:14px;
    }
.imgcontainer{
        float:left;
        width:80px;
        height:80px;
        margin:5px;
    }
 .pic-container {
     overflow:auto;       
    }
 .pic-item {
            width:100px;
            height:100px;
            float: left;
            margin: 0 10px 10px 0;
        }
    .img-item {
        width: 160px;
        height: 200px;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
        background-position: center center;
        background-size: cover;
        position: relative;
        border: 1px solid #d0d0d0;
    }


    .img-box-item-close {
        width: 36px;
        height: 36px;
        display: block;
        float: right;
        background-size: cover;
        background-position: center center;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/wxcep_phone_close.png);
        cursor: pointer;
    }
</style>
