<template>
  <div class="webManageIndexs">
    <div class="webManageIndex " :style="`height:${columnMax}px`">
      <div class="org-tree">
        <ul class="tree-first">
          <li>
            <span class="jiantou fa fa-caret-down" :class="rootVisible?'fa-caret-down':'fa-caret-right'" @click="rootShow"></span>
            <a class="file-box" href="javascript:;" @click="jumpTo('/main/webManage/columnList')">
              <span class="file-jia fa fa-folder"></span>
              <span class="title">{{webName}}</span>
            </a>
            <ul class="tree-second" v-if="rootVisible">
              <li v-for="(firstItem,firstIndex) in firstColumn" :key="firstIndex" v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1||firstItem.managerUserJson&&firstItem.managerUserJson.indexOf(name)!==-1">
                <span v-if="firstItem.type==2||firstItem.type==3" class="jiantou fa" :class="firstItem.firstVisible?'fa-caret-down':'fa-caret-right'" style="cursor:pointer" @click.stop="subjumpTo(firstItem,firstItem.id)"></span>
                <a class="file-box" href="javascript:;" @click.stop="subjumpTo(firstItem,firstItem.id,firstIndex)">
                  <span class="file-jia fa fa-folder"></span>
                  <span class="title">{{firstItem.name}}</span>
                </a>
                <ul class="three-second" v-if="firstItem.firstVisible">
                  <li v-for="(secondItem,index) in firstItem.moduleList" :key="index">
                    <a class="file-box" href="javascript:;" @click.stop="modulejumpTo(firstItem,firstItem.id,secondItem,secondItem.id)">
                      <span class="file-jia fa fa-folder"></span>
                      <span class="title">{{secondItem.name}}</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="org-panel">
        <router-view v-on:delUpdateSide="delUpdateSides"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import Cookies from 'js-cookie';
import {getSchooWebColumnListByWebId,getSchoolWebModuleListByColumnId} from '@/api/webManage';
import {mapGetters} from 'vuex';
export default{
  data(){
    return{
      firstColumn:[],//树一级栏目
      secondColumn:[],//树二级栏目
      rootVisible:true
    }
  },
  created(){
    
  },
  mounted(){
    if(!this.webId&&Cookies.get("webId")){
      var This=this;
      setTimeout(function(){
        This.getSchooWebColumnListByWebIdFunc();
         localStorage.setItem('webId',This.webId);
      },300)
    }else if(this.webId&&this.webId!==null||this.webId&&this.webId!==''){
      this.getSchooWebColumnListByWebIdFunc();
      localStorage.setItem('webId',this.webId);
    }
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
  computed:{
    ...mapGetters([
        'webId',
        'webName',
        'userName',
        'permission',
        'name'
    ])
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
        webId:this.webId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          data.data.forEach((item)=>{
            if(item.type!==1&&item.type!==4){
              item.firstVisible=false;
            }
          })
          this.firstColumn=data.data;
          this.firstColumn.forEach((manaItem,manaIndex)=>{
            let manageNames=[];
            if(manaItem.managerUserJson){
              JSON.parse(manaItem.managerUserJson).forEach((subManaItem,subManaIndex)=>{
                if(subManaItem){
                    manageNames.push(subManaItem.name)
                }else{
                  manageNames.push(null)
                }
              })
            }
            manaItem.managerUserJson=manageNames.toString()
          });
          this.$router.push({
            path:'/main/webManage/columnList'
          })
        }
      })
    },
    
    subjumpTo(firstItem,id,firstIndex){
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
                id:firstItem.id,
                firstIndex:firstIndex
              }
            })
          }
        }).catch(res=>{})
        
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
.webManageIndexs{
  background:#fff;
  border-radius: 3px;
  margin:0 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.08);
}
.webManageIndex{
  width:100%;
  padding-left:250px;
  box-sizing: border-box;
  background:#fff;
  overflow: hidden;
  position: relative;
  .org-tree{
    position:absolute;
    left:0;
    top:0;
    width:250px;
    padding:10px;
    height:100%;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid #d1dbe5;
    border-right: 0 solid #fff;
    box-sizing: border-box;
    transition: all .3s;
    .tree-first{
      li{
        padding:0 0 0 15px;
        list-style-type: none;
        position: relative;
      }
    }
    .jiantou{
      position: absolute;
      left:0;
      top:0;
      font-size:18px;
      color:#9B9B9B;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
    }
    .file-box{
      display: inline-block;
      vertical-align: top;
      padding-left:2px;
      color:#333;
      text-decoration: none;
      cursor: pointer;
      .file-jia{
        display: inline-block;
        vertical-align: middle;
        width:16px;
        height: 16px;
        color:#9DBDDF;
      }
      .title{
        margin-left: 6px;
        display: inline-block;
        font-size:14px;
      }
    }
    .file-box:hover{
      .title{
        text-decoration: underline;
      }
    }
    .tree-second{
      padding:0 0 0 4px;
      li{
        margin-top:8px;
        list-style-type: none;
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
    
  }
  .org-main{
    width:100%;
  }
  .router-link-active{
    color:#1893FB;
  }
}
</style>
