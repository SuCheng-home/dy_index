<!--通知的详情-->
<template>
    <div class="app-container calendar-list-container putasealon">
        <div class="menu-tools" style="padding-bottom: 10px;border-bottom: 1px solid #e7eaec;">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium"   @click="print()">打印</el-button>          
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="box"  style="width: 810px;margin: 20px auto;">
                <div  ref="print" id="print">
                     <div class="title" style="    text-align: center; color: #303133; font-size: 18px;">{{noticeTitle}}</div>
                <div class="sub-title" style="text-align: center; font-size: 14px;  color: #b0b0b0;  margin: 12px 0 12px 0;">
                    {{releaseDate|trimTime}} <span v-if="!inscribe">{{releaseUserName}}</span>
                    <span class="departName" v-if="inscribe">{{departName}}</span>
                </div>
                <hr style="border-color: #EBF0FA;  border-top: 0;">
                <div class="content" style="min-height: 300px;">
                        <image-previewer tag="richtext">
                            <div class="notice-content"  v-html="noticeContent"></div>
                        </image-previewer>
                </div>
                <hr style="border-color: #EBF0FA;  border-top: 0;">
                <div class="title" style="    text-align: center; color: #303133; font-size: 18px;">回执</div>
                <div class="ul" style="    overflow: hidden;">
                    <div class="li" style="width: 30%;float: left; margin: 10px 10%;font-size: 14px;color: #303133;position: relative;  line-height: 40px;  position: relative;">
                        阅  读  人：{{putasealonobj.name}}
                    </div>
                     <div class="li" style="width: 30%;float: left; margin: 10px 10%;font-size: 14px;color: #303133;position: relative;line-height: 40px;    position: relative;">
                        班级/部门：{{putasealonobj.departNames}}
                    </div>
                    <div class="li" style="width: 30%;float: left; margin: 10px 10%;font-size: 14px;color: #303133;position: relative;  line-height: 40px;  position: relative;">
                        签字图片：<img style="height:40px;position: absolute;" :src="putasealonobj.signPicurl" alt="" srcset="">
                    </div>
                    <div class="li" style="width: 30%;float: left; margin: 10px 10%;font-size: 14px;color: #303133;position: relative;  line-height: 40px;  position: relative;">
                        阅读时间：{{putasealonobj.readDate | trimTime}}
                    </div>
                </div>
                </div>
               
            </div>
        </div>
    </div>
</template>
<script>
    import {getNoticeInfo} from '@/api/notice';
    import {strToHtml} from '@/utils/utils';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import mixin from '@/mixins/windowResize';
    export default {
        components: {
            ImagePreviewer
        },
        data() {
            return {
                noticeId: this.$route.query.id,
                noticeTitle: '',
                inscribe:"",
                releaseDate:"",
                releaseUserName:"",
                departName:"",
                noticeContent:"",
                putasealonobj:{
                    name:"",
                    departNames:"",
                    signPicurl:"",
                    readDate:""
                }
            }
        },
      
        mixins: [mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
            this.putasealonobj= JSON.parse(sessionStorage.getItem('putasealonobj'));
             getNoticeInfo(this.noticeId,1).then(res => {
                    let data = res.data.data;
                    this.noticeTitle = data.noticeTitle;
                    this.inscribe = data.inscribe;
                    this.noticeContent = strToHtml(data.noticeContent);
                    this.releaseUserName = data.releaseUserName;
                    this.releaseDate = data.releaseDate;
                    this.departName = data.departName;
                });
        },
        methods: {
            print() {
              this.$print(this.$refs.print);
            }
        }
    }
</script>
<style>
#print img{
    max-width: 100%
}
#print th,#print .td{
      text-align: center;
      line-height: 20px;
      padding: 8px 0px;
    }    
#print   td{
       line-height: 20px;
      padding: 8px 10px;
      color:#606266; 
    }
#print   table,#print table  td,#print th{
        border: 1px solid #E4E7ED;
        font-size: 14px;

    }
   #print th{
        border-top: none;
    }
   #print  table {
            border-top: none;
        border-left: 1px solid #E4E7ED;
        border-spacing: 0;/*去掉单元格间隙*/
        width: 100%;
    }
</style>

<style lang="scss">
.body{
    overflow: auto;
}
  
</style>
