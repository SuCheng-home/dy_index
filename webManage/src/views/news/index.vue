<template>
  <div class="mesManages">
    <div class="mesManage" :style="`height:${columnMax}px`">
      <div class="org-tree">
        <ul class="mess-tree clearfix">
          <li>
            <router-link class="navLi" tag="a" to="/main/news/newsList" active-class="active" v-if="permission.indexOf('/schoolWebTwo/schoolWebTwoMessageTwo')!==-1">
            <img src="../../assets/index/new_left_pic1.png" alt="">
            <span class="nav-title">消息中心</span>
            </router-link>
          </li>
          <li>
            <router-link class="navLi" tag="a" to="/main/news/myNewsList" active-class="active" v-if="permission.indexOf('/schoolWebTwo/getSchoolWebCreateUserMessageList')!==-1">
            <img src="../../assets/index/new_left_file.png" alt="">
            <span class="nav-title">我的文章</span>
            </router-link>
          </li>
          <li>
            <router-link  v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1" class="navLi" tag="a" to="/main/news/newsSet" active-class="active">
            <img src="../../assets/index/new_left_pic2.png" alt="">
            <span class="nav-title">消息设置</span>
            </router-link>
          </li>
          <li>
            <router-link v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1" class="navLi" tag="a" to="/main/news/floatNewsList" active-class="active">
            <img src="../../assets/index/new_left_pic3.png" alt="">
            <span class="nav-title">浮动窗口</span>
            </router-link>
          </li>
          <li>
            <router-link v-if="permission.indexOf('/schoolWebTwo/schoolWebTwoschoolMail')!==-1" class="navLi"  tag="a" to="/main/news/headmasterNewsList" active-class="active">
            <img src="../../assets/index/new_left_mail.png" alt="">
            <span class="nav-title">校长信箱</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="org-panel">
       <keep-alive>
                <router-view v-if="$route.meta.isCached"></router-view>
            </keep-alive>
        <router-view v-if="!$route.meta.isCached"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {getSchooWebColumnListByWebId,getSchoolWebModuleListByColumnId} from '@/api/webManage';
// import {getSchoolWebSettingBySchoolId} from '@/api/webService';
import {mapGetters} from 'vuex';
export default{
  data(){
    return{
      firstColumn:[],//树一级栏目
      secondColumn:[],//树二级栏目
      rootVisible:true,
      active: false
    }
  },
  created(){
  },
  mounted(){
    if(this.webId){
      localStorage.setItem('webId',this.webId);
      this.getSchooWebColumnListByWebIdFunc();
    }
  },
  computed:{
    ...mapGetters([
        'webId',
        'webName',
        'permission'
    ])
  },
  mixins:[mixins],
  watch:{
    $route(to,from){
      if(to){
        if(to.query.leftSide){
          this.getSchooWebColumnListByWebIdFunc();
        }else{
          
        }
      }
    }
  },
  methods:{
    delUpdateSides(val){
      this.getSchooWebColumnListByWebIdFunc();
    },
    rootShow(){
      if(this.rootVisible==true){
        this.rootVisible=false;
      }else{
        this.rootVisible=true;
      }
    },
    getSchooWebColumnListByWebIdFunc(){
      this.firstColumn=[];
      getSchooWebColumnListByWebId({
        webId:localStorage.getItem("webId"),
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          data.data.forEach((item)=>{
            if(item.type!==1&&item.type!==4){
              item.firstVisible=false;
            }
          })
          this.firstColumn=data.data;
        }
      })
    },
    
    subjumpTo(firstItem,id){
      if(firstItem.type==1 ||firstItem.type==4){
        this.$router.push({
          path:'/main/webManage/columnDetail',
          query:{
            id:firstItem.id
          }
        })
      }else if(firstItem.type==2||firstItem.type==3){
        this.secondColumn=[];
        getSchoolWebModuleListByColumnId({
          columnId:id
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.secondColumn=data.data;
            firstItem.moduleList=this.secondColumn;
            if(firstItem.moduleList&&firstItem.moduleList.length!==0){
              firstItem.firstVisible=!firstItem.firstVisible;
            }
            this.$router.push({
              path:'/main/webManage/moduleList',
              query:{
                id:firstItem.id
              }
            })
          }
        })
        
      }
    },
    modulejumpTo(firstItem,columnId,secondItem,id){
      if(secondItem.type==1 ||secondItem.type==4){
        this.$router.push({
          path:'/main/webManage/moduleDetail',
          query:{
            moduleId:secondItem.id,
            id:columnId
          }
        })
      }else if(secondItem.type==2||secondItem.type==3){
        this.$router.push({
          path:'/main/webManage/messageList',
          query:{
            moduleId:secondItem.id,
            id:columnId
          }
        })
        
      }
    },
    jumpTo(url){
      this.$router.push({
        path:url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mesManages{
  background:#fff;
  border-radius: 3px;
  margin:0 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.08);
}
.mesManage{
  width:100%;
  padding-left:220px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  .org-tree{
    position:absolute;
    left:0;
    top:0;
    width:220px;
    height:100%;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid #d1dbe5;
    border-right: 0 solid #fff;
    box-sizing: border-box;
    transition: all .3s;
    padding:20px 20px;
    .mess-tree{
      li{
        line-height:36px;
        margin-bottom:20px;
        list-style-type: none;
        .navLi{
          display:block;
          text-decoration: none;
          color:#333;
          img{
            display:block;
            float:left;
            width:26px;
            height:26px;
            margin-right:10px;
            padding-top:3px;
          }
          .nav-title{
            font-size:16px;
          }
        }
        .navLi:hover .nav-title{
          text-decoration: underline;
        }
        .navLi.active{
          color:#1893FB;
        }
      }
      
    }
  }
  .org-panel{
    width:100%;
    height:100%;
    padding:0 15px;
    border: 1px solid #d1dbe5;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    box-sizing: border-box;
    position: relative;
  }
  .org-main{
    width:100%;
  }
}
</style>
