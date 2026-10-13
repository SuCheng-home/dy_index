<template>
  <div class="column-container">
    <div class="banner-container">
      <div class="banner-wrap" v-if="query.id&&query.firstColumn">
        <img v-if="firstlogoUrl" :src="firstlogoUrl" alt="">
        <img v-else :src="initPhoto" alt="">
      </div>
      <div class="banner-wrap" v-else-if="query.parentid&&query.secondColumn">
        <img v-if="firstlogoUrl" :src="firstlogoUrl" alt="">
        <img v-else :src="initPhoto" alt="">
      </div>
      <div class="banner-wrap" v-else-if="query.id && query.messageType&&query.parentsid">
        <img v-if="firstlogoUrl" :src="firstlogoUrl" alt="">
        <img v-else :src="initPhoto" alt="">
      </div>
      <div class="banner-wrap" v-else-if="query.indexid && !query.messageType">
        <img :src="initPhoto" alt="">
      </div>
      <div class="banner-wrap" v-else-if="query.indexid && query.messageType">
        <img :src="initPhoto" alt="">
      </div>
    </div>
    <!--主体内容-->
    <div class="main-container">
      <div class="main-wrapper">
        <div class="sitemenu">
          <span class="fa fa-map-marker icon fl"></span>
          <span class="fl name">位置：</span>
          <div class="list-title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/webOne/main/index' }">首页</el-breadcrumb-item>
              <template v-if="query.id&&query.firstColumn" v-for="(navItem,index) in columnList">
                <el-breadcrumb-item v-if="navItem.id==query.id">{{navItem.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="navItem.id==query.id">{{navItem.name}}</el-breadcrumb-item>
              </template>
              <template v-if="query.id&&query.secondColumn" v-for="(navItem,index) in columnList">
                <el-breadcrumb-item v-if="navItem.id==query.parentid">{{navItem.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="navItem.id==query.parentid">
                  <template v-for="(subnav,index) in navItem.moduleList" v-if="subnav.id==query.id">
                    {{subnav.name}}
                  </template>
                </el-breadcrumb-item>
              </template>
              <!--首页栏目-->
              <template v-if="(query.indexid&&!query.messageType)">
                <el-breadcrumb-item>
                   {{query.columnName}}
                </el-breadcrumb-item>
              </template>
              <!--首页详情-->
              <template v-if="(query.messageType&&query.indexid)">
                <el-breadcrumb-item>
                    {{query.columnName}}
                </el-breadcrumb-item>
              </template>
              <!--二级栏目详情消息-->
              <template v-if="query.id&&query.messageType" v-for="(navItem,index) in columnList">
                <el-breadcrumb-item v-if="navItem.id==query.parentsid">{{navItem.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="navItem.id==query.parentsid">
                  <template v-for="(subnav,index) in navItem.moduleList" v-if="subnav.id==query.parentid">
                    {{subnav.name}}
                  </template>
                </el-breadcrumb-item>
              </template>
              <!-- <el-breadcrumb-item>活动列表</el-breadcrumb-item> -->
            </el-breadcrumb>
          </div>
          
        </div>
        <!--column-box-->
        <div class="column-content">
          <!--左侧栏-->
          <div class="sideBar">
            <!--首页栏目-->
            <ul v-if="(query.indexid&&!query.messageType)">
              <li  @click.stop="nosubjumpTo('/webOne/main/column/newlist',query)">
                <a class="hover" href="javascript:;">{{query.columnName}}</a>
              </li>
            </ul>
            <!--首页详情-->
            <ul v-if="(query.messageType&&query.indexid)">
              <li @click.stop="nosubjumpTo2('/webOne/main/column/newlist',query)">
                <a class="hover" href="javascript:;">{{query.columnName}}</a>
              </li>
            </ul>
            <!--栏目列表页-->
            <template v-for="(navItem,index) in columnList" v-if="(query.id&&query.secondColumn)">
              <div v-if="(navItem.id==query.parentid)">
                <ul class="listmenu">
                  <template v-for="(subNav,index) in navItem.moduleList">
                    <li  v-if="subNav.type===1" @click.stop="subjumpTo('/webOne/main/column/newdetail',navItem,subNav)">
                    <a :class="query.id==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===2" @click.stop="subjumpTo('/webOne/main/column/newlist',navItem,subNav)">
                      <a :class="query.id==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===3" @click.stop="subjumpTo('/webOne/main/column/piclist',navItem,subNav)">
                      <a :class="query.id==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===4">
                      <a  :href="subNav.columnUrl" target="_blank">{{subNav.name}}</a>
                    </li>
                  </template>
                </ul>
              </div>
            </template>
            <!--栏目详情页-->
            <template v-for="(navItem,index) in columnList" v-if="(query.id&&query.messageType)">
              <div v-if="(navItem.id==query.parentsid)">
                <ul class="listmenu">
                  <template v-for="(subNav,index) in navItem.moduleList">
                    <li  v-if="subNav.type===1" @click.stop="subjumpTo('/webOne/main/column/newdetail',navItem,subNav)">
                    <a :class="query.parentid==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===2" @click.stop="subjumpTo('/webOne/main/column/newlist',navItem,subNav)">
                      <a :class="query.parentid==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===3" @click.stop="subjumpTo('/webOne/main/column/piclist',navItem,subNav)">
                      <a :class="query.parentid==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===4">
                      <a  :href="subNav.columnUrl" target="_blank">{{subNav.name}}</a>
                    </li>
                  </template>
                </ul>
              </div>
            </template>
          </div>
          <!--右侧内容-->
          <div class="column-box">
           <keep-alive>
                <router-view v-if="$route.meta.isCached"></router-view>
            </keep-alive>
        <router-view v-if="!$route.meta.isCached"></router-view>
          </div>
        </div>
      </div>
    </div>
    <!---->
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {getSchooWebColumnById,getSchoolWebModuleById} from '@/api/firstPage';
export default {
  data(){
    return{
      query:null
    }
  },
  mounted(){
    
  },
  watch:{
    '$route':{
      handler:function(to,from){
        if(to.query){
          this.query=to.query;
          //一级栏目
          if(this.query.id && this.query.firstColumn){
            this.jumpToSecond(this.query);
          }
          //栏目的消息详情
          if(this.query.id && this.query.messageType){
            //首页栏目消息详情
            if(this.query.indexid){
              //console.log("dd");
            }else{
              this.$store.dispatch('getSchooWebColumnByIdFunc',{
                columnId:this.query.parentsid
              })
            }
          }
          //二级栏目
          if(this.query.id&&this.query.secondColumn){
            //首页栏目
            //console.log("ddsdd",this.query);
            if(this.query.indexid){
              console.log(" ");
            }else{
              this.$store.dispatch('getSchooWebColumnByIdFunc',{
              columnId:this.query.parentid
              })
              if(this.query.type===1&&this.query.type!==4){
                this.$store.dispatch('getSchoolWebModuleByIdFunc',{
                  moduleId:this.query.id
                })
              }
            }
          }
          
        }
      },
      immediate: true
    }
  },
  methods:{
    //nav一级跳二级
    jumpToSecond(query){
      const navArray=this.columnList;
      for(var i=0;i<navArray.length;i++){
        //console.log(query.id,navArray[i].id)
        if(query.id==navArray[i].id){
          let subArray=navArray[i].moduleList[0];
          //console.log("ss",subArray);
          if(subArray&&subArray.type===2){
            this.$router.push({
              path:'/webOne/main/column/newlist',
              query:{
                parentid:query.id,
                id:subArray.id,
                secondColumn:2,
                type:2
              }
            })
          }else if(subArray&&subArray.type===3){
            this.$router.push({
              path:'/webOne/main/column/piclist',
              query:{
                secondColumn:2,
                type:3,
                parentid:query.id,
                id:subArray.id
              }
            })
          }else if(subArray&&subArray.type===1){
            this.$router.push({
              path:'/webOne/main/column/newdetail',
              query:{
                secondColumn:2,
                type:1,
                parentid:query.id,
                id:subArray.id
              }
            })
          }else if(subArray&&subArray.type===4){
            this.$router.push({
              path:'/webOne/main/column/newlist',
              query:{
                parentid:query.id,
                id:subArray.id,
                secondColumn:2,
                type:4
              }
            })
          }
        }
      }
    },
    /*二级栏目跳转*/
    subjumpTo(url,parquery,query){
      /*左侧跳转*/
      this.$router.push({path:url,query:{parentid:parquery.id,id:query.id,secondColumn:query.secondColumn,type:query.type}})
    },
    //首页栏目详情跳转
    nosubjumpTo(url,query){
     //console.log("s",query);
      this.$router.push({path:url,query:{id:query.id,columnName:query.columnName,type:query.type,indexid:query.indexid}});
    },
    // 
    nosubjumpTo2(url,query){
     //console.log("s",query);
      this.$router.push({path:url,query:{id:query.parentid,columnName:query.columnName,type:query.type,indexid:query.indexid}});
    }
  },
  computed:{
    ...mapGetters([
      'columnList',
      'id',
      'firstlogoUrl',
      'initPhoto'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin.scss';
.column-container{
  width:100%;
  min-width:1200px;
}
.banner-container{
  width:100%;
  min-width:1200px;
  background:#fff;
  height:280px;
  overflow:hidden;
  .banner-wrap{
    width:1200px;
    height:280px;
    overflow:hidden;
    margin:0 auto;
    &>img{
      display:block;
      max-width:100%;
      width:100%;
      height:100%;
    }
  }
}
/*主体部分*/
.main-container{
  width:100%;
  min-width:1200px;
  //background:#e5e5e5;
  .main-wrapper{
    width:1200px;
    margin:0 auto;
    .sitemenu{
      width:100%;
      height:35px;
      border-bottom:4px solid $column-bottom;
      &>.fl{
        float:left;
        display:block;
      }
      &>.icon{
        font-size:24px;
        // color:$golbal-color;
        font-weight: bold;
        margin: 4px 6px 0 12px;
      }
      &>.name{
        margin:8px 0 0 0;
      }
      &>.list-title{
        padding:11px 0 0 0;
        width:60%;
      }
    }
  }
}
.column-content{
  width:100%;
  min-height:279px;
  padding-left:220px;
  position: relative;
  color:$column-color;
  .sideBar{
    position: absolute;
    left:0;
    top:0;
    width: 178px;
    height: auto;
    background-color: #DCDCDC;
    .menu-header{
      width: 100%;
      height: 36px;
      text-indent: 26px;
      overflow: hidden;
      line-height: 36px;
      cursor: pointer;
      color: #fff;
      background:#B50900
    };
    ul{
      width:178px;
      a{
        display:block;
        width: 100%;
        height: 36px;
        text-indent: 26px;
        overflow: hidden;
        line-height: 36px;
        cursor: pointer;
        color:$column-color;
      }
      a:hover,a.hover{
        color:#fff;
        // background:$golbal-color;
      }
    }
  }
  .column-box{
    width:100%;
    padding: 0 25px;
    height: auto;
    min-height: 669px;
    background-color: white;
    position: relative;
  }
}
.listmenu {
  max-height: 300px;
  overflow-y: auto;
}
</style>
<style>
.main-container .el-breadcrumb__inner a:hover, .main-container .el-breadcrumb__inner.is-link:hover{
  /* color:#E60012; */
  cursor: pointer;
}
.main-container .el-breadcrumb__inner{
  color:#333;
}
.main-container .el-pager li.active{
  /* color:#B50900; */
}
.main-container .el-pager li:hover{
  /* color:#B50900; */
}
.main-container .el-input.is-active .el-input__inner,.main-container .el-input__inner:focus{
  border-color: #dcdfe6;
}
.main-container .el-pagination__sizes .el-input .el-input__inner:hover{
  border-color: #dcdfe6;
}
.main-container .el-select .el-input.is-focus .el-input__inner{
  border-color: #dcdfe6;
}
</style>
