<template>
<div class="ventilatearoomeidt"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>      
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${maxH}px;`">
        <div class="box" >                             
                <div >
                 <div>
                             <div class="nav"><span>打卡项</span> </div>
                             <div class="ul">
                                  <div class="li" v-for="(item,index) in termlist" :key="index">
                                      {{item.typeName}}
                                       <div class="style">
                                           <el-tag  v-if=" item.chooseState" type="success" size="medium">已完成</el-tag>
                                           <el-tag type="danger" v-if="!item.chooseState" size="medium">未完成</el-tag>
                                        </div>
                                  </div>
                              </div>
                         </div>
                         <div v-if="myobj.checkRemark==1&&myobj.content">
                           <div class="nav"><span>备注</span> </div>
                           <div class="ul">
                                    <div class="li" style="padding:10px ">
                                    {{myobj.content}}
                                    </div> 
                                </div> 
                         </div>
                         <div v-if="myobj.checkPhoto==1&&(picJson.length>0)">
                           <div class="nav"><span>图片</span> </div>                             
                                <image-previewer tag="richtext">
                                     <img style="width: 100px!important;height: 100px;margin-left: 20px;"
                                                  v-for="(picItem, index) in picJson" :src="picItem.picUrl"
                                                 :key="index">
                                   
                                </image-previewer>
                         </div>
                     </div>

            </div> 
     </div>
</div> 
</template>
<script>
import {
  recordInfoById
} from "@/api/ventilatearoom";
import mixin from "@/mixins/windowResize";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
export default {
  data() {
    return {
      picJson: [],
      selectDateText: "",
      id: this.$route.query.id,
      name: "",
      termlist: [],
      myobj: {
        checkPhoto: "", //	是否拍照上传，0不上传，1上传	number
        checkRemark: "", //		是否添加备注，0不，1是	number
        checkStrategyJson: [], //		检查项	array<object>
        content: "", //	备注内容	string
        picJson: [] //		照片	array<object>
      }
    };
  },
  mixins: [mixin],
  created() {
    this.recordInfoByIds();
  },
  components: {ImagePreviewer},
  methods: {
    //获取详情
    recordInfoByIds() {
      recordInfoById(this.id)
        .then(res => res.data)
        .then(data => {
          let mydata = JSON.parse(data.data.strategyRecord);
          this.myobj.checkPhoto = mydata.checkPhoto;
          this.myobj.checkRemark = mydata.checkRemark;
          this.myobj.content = mydata.content;
          this.selectDateText = data.data.dateDay;
          this.name = data.data.placeName;
          this.reportState = data.data.reportState;
          if (mydata.picJson) {
            this.picJson = mydata.picJson;
          }
          let list = JSON.parse(mydata.checkStrategyJson);
          for (let i = 0; i < list.length; i++) {
            if (list[i].chooseState == 0 || list[i].chooseState == 1) {
              if (list[i].chooseState == 1) {
                list[i].chooseState = true;
              } else {
                list[i].chooseState = false;
              }
            } else {
              list[i].chooseState = true;
            }
          }
          this.termlist = list;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.ventilatearoomeidt {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    overflow:hide;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .nav{
        height: 20px;
        line-height: 20px;
        margin: 5px 15px;
        padding-left: 8px;
        border-left: 4px solid #409eff;
        color: #333;
    }
    .li{
        width: 600px;
        line-height: 30px;
        font-size: 14px;
        color: #666;
        padding: 0px 80px 0px 10px;
        position: relative;
        margin-bottom: 10px;
        .style{
           position: absolute;
           top:0;
           right:0
        }
    }
    .image_view{
        width: 80px;
        height: 80px;
        display: inline-block;
        margin: 10px;
    }
  }
}
</style>