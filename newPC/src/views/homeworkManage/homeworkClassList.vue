<template>
    <div class="homeworkClassList">
        <back-tool>
        </back-tool>
        <div class="main-wrapper">
            <div class="row" >  
                <ul class="mainUl clearfix" :style="`height: ${nobottommaxH-30}px;`">
                    <li class="mainLi" v-for="(sendItem,sendIndex) in sendClass" :key="sendIndex" @click="jumpTo('homeworkManageFinishList',{homeworkId:homeworkId,type:type,departId:sendItem.id,statis:statis})">
                        <img src="../../assets/images/homePage_pic1.png" alt="">
                        <span>{{sendItem.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import BackTool from '@/components/BackTool';
import {getHomeworkById} from '@/api/homework';
export default{
    components: {
        BackTool
    },
    data(){
        return{
            homeworkId:this.$route.query.homeworkId,
            type:this.$route.query.type,
            homework: {},
            sendClass: [],
            statis:this.$route.query.statis?this.$route.query.statis:0
        }
    },
    mixins: [mixin],
    created(){
        getHomeworkById({
                homeworkId: this.homeworkId
            },sessionStorage.getItem("homeworkschoolTimeId"))
                .then(res => res.data)
                .then(data => {
                    this.homework = data.data;
                    this.sendClass = data.data.departs;
                })

    },
    mounted(){

    },
    methods:{
        jumpTo(path,query={}){
            this.$router.push({
                path,
                query
            })
        }
    }
}
</script>
<style lang="scss" scoped>
ul,li{
    list-style: none;
}
.homeworkClassList{
    padding:12px;
    background-color: #fff;
    box-sizing: border-box;
    .row{
    .g-main-title{
      font-size:16px;
      line-height: 30px;
      color:#488cfe;
      .block{
        width: 15px;
        height: 15px;
        background: #ACD6FF;
        float: left;
        border-radius:4px;
        margin: 8px 10px 0 0;
        overflow:hidden;
      }
    }
    .mainUl{
      width:100%;
      overflow:auto;
      .mainLi{
        float:left;
        width:130px;
        height:100px;
        text-align: center;
        cursor: pointer;
        img{
          display: block;
          width:71px;
          height: 62px;
          margin:0 auto ;
        }
        span{
          display: block;
          width:100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size:14px;
          line-height:30px;
        }
      }
      .mainLi:hover{
        color:#488cfe;
      }
    }
  }
}
</style>

