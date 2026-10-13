<template>
  <div class="column-container">
    <!--主体内容-->
    <div class="main-container">
      <div class="main-wrapper">
        <div class="sitemenu">
          <span class="fa fa-map-marker icon fl"></span>
          <span class="fl name">位置：</span>
          <div class="list-title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/webTwo/main/index' }">首页</el-breadcrumb-item>
              <template v-if="query.id&&query.firstColumn" v-for="(navItem,index) in columnList">
                <el-breadcrumb-item v-if="navItem.id==query.id">{{navItem.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="navItem.id==query.id">{{navItem.name}}</el-breadcrumb-item>
              </template>
              <!--nav下列表位置-->
              <template v-if="query.id&&query.secondColumn" v-for="(navItem,index) in columnList">
                <el-breadcrumb-item v-if="navItem.id==query.parentid">{{navItem.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="navItem.id==query.parentid">
                  <template v-for="(subnav,index) in navItem.moduleList" v-if="subnav.id==query.id">
                    {{subnav.name}}
                  </template>
                </el-breadcrumb-item>
              </template>
            <!--首页栏目列表型-->
              <!--刚进来的左侧-->
              <template v-if="(query.type==2&&query.secondColumn&&query.indexid&&!query.moduleOnly||query.type==3&&query.secondColumn&&query.indexid&&!query.moduleOnly)">
                <el-breadcrumb-item>
                  <span>{{query.columnName}}</span>
                </el-breadcrumb-item>
              </template>
            <!--详情页的左侧-->
              <template v-if="(query.type==2&&query.secondColumn&&query.indexid&&query.moduleOnly)">
                <el-breadcrumb-item>
                  <a class="hover" href="javascript:;" @click.stop="nosubjumpTo('/webTwo/main/column/newlist',query)">{{query.columnName}}</a>
                </el-breadcrumb-item>
              </template>
              <!--首页栏目图片型-->
             <!--详情页的左侧-->
              <template v-if="(query.type==3&&query.secondColumn&&query.indexid&&query.moduleOnly)">
                <el-breadcrumb-item>
                  <a class="hover" href="javascript:;" @click.stop="nosubjumpTo2('/webTwo/main/column/piclist',query)">{{query.columnName}}</a>
                </el-breadcrumb-item>
              </template>
              <!-- <template v-if="(query.secondColumn&&query.indexid)">
                <el-breadcrumb-item>
                   1{{query.columnName}}
                </el-breadcrumb-item>
              </template> -->
              <!--首页栏目下面的消息跳转做特殊处理-->
              <!--首页栏目下面的消息跳转做特殊处理-->
              <template v-if="(query.messageId&&query.messageType&&query.id&&query.moduleType==2)">
                <el-breadcrumb-item>
                  <a class="hover" href="javascript:;" @click.stop="firstMesTo('/webTwo/main/column/newlist',query)">{{query.columnName}}</a>
                </el-breadcrumb-item>
              </template>
              <!--首页栏目下面的消息跳转做特殊处理-->
              <template v-if="(query.messageId&&query.messageType&&query.id&&query.moduleType==3)">
                <el-breadcrumb-item>
                  <a class="hover" href="javascript:;" @click.stop="firstMesTo2('/webTwo/main/column/piclist',query)">{{query.columnName}}</a>
                </el-breadcrumb-item>
              </template>
              
              <!--二级栏目详情消息-->
              <!--栏目详情页-->
            <!-- <template v-for="(navItem,index) in columnList" v-if="(query.parentsid&&query.id&&query.messageType)">
              
            </template> -->
            <!--首页nav下详情-->
              <template v-if="query.id&&query.messageType" v-for="(navItem,index) in columnList">
                <el-breadcrumb-item v-if="navItem.id==query.parentsid">{{navItem.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="navItem.id==query.parentsid">
                  <template v-for="subnav in navItem.moduleList" v-if="subnav.id==query.parentid">
                    <a v-if="subnav.type===1" @click.stop="subjumpTo('/webTwo/main/column/newdetail',navItem,subnav)" :class="query.parentid==subnav.id?'hover':''" href="javascript:;"   :key="subnav.id">{{subnav.name}}</a>
                    <a v-if="subnav.type===2" @click.stop="subjumpTo('/webTwo/main/column/newlist',navItem,subnav)" :class="query.parentid==subnav.id?'hover':''" href="javascript:;" :key="subnav.id" >{{subnav.name}}</a>
                    <a :class="query.parentid==subnav.id?'hover':''" href="javascript:;" v-if="subnav.type===3" @click.stop="subjumpTo('/webTwo/main/column/piclist',navItem,subnav)" :key="subnav.id">{{subnav.name}}</a>
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
            <template v-for="(navItem,index) in columnList" v-if="(query.id&&query.firstColumn)">
              <div v-if="(navItem.id==query.id )">
                <ul class="listmenu">
                  <template v-for="(subNav,index) in navItem.moduleList">
                    <li  v-if="subNav.type===1" @click.stop="subjumpTo('/webTwo/main/column/newdetail',navItem,subNav)">
                    <a :class="query.id==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===2" @click.stop="subjumpTo('/webTwo/main/column/newlist',navItem,subNav)">
                      <a :class="query.id==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===3" @click.stop="subjumpTo('/webTwo/main/column/piclist',navItem,subNav)">
                      <a :class="query.id==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===4">
                      <a  :href="subNav.columnUrl" target="_blank">{{subNav.name}}</a>
                    </li>
                  </template>
                </ul>
              </div>
            </template>
            <!--首页栏目列表型-->
            <!--刚进来的左侧-->
            <ul v-if="(query.type==2&&query.secondColumn&&query.indexid&&!query.moduleOnly||query.type==3&&query.secondColumn&&query.indexid&&!query.moduleOnly)">
              <li >
                <a class="hover" href="javascript:;">{{query.columnName}}</a>
              </li>
            </ul>
            <!--首页栏目-->
            <!--详情页的左侧-->
            <ul v-if="(query.type==2&&query.secondColumn&&query.indexid&&query.moduleOnly)">
              <li  @click.stop="nosubjumpTo('/webTwo/main/column/newlist',query)">
                <a class="hover" href="javascript:;">{{query.columnName}}</a>
              </li>
            </ul>
            <!--首页栏目图片型-->
            <!--详情页的左侧-->
            <ul v-if="(query.type==3&&query.secondColumn&&query.indexid&&query.moduleOnly)">
              <li  @click.stop="nosubjumpTo2('/webTwo/main/column/piclist',query)">
                <a class="hover" href="javascript:;">{{query.columnName}}</a>
              </li>
            </ul>
            
            <!--首页栏目下面的消息跳转做特殊处理-->
            <ul v-if="(query.messageId&&query.messageType&&query.id&&query.moduleType==2)">
              <li  @click.stop="firstMesTo('/webTwo/main/column/newlist',query)">
                <a class="hover" href="javascript:;">{{query.columnName}}</a>
              </li>
            </ul>
             <!--首页栏目下面的消息跳转做特殊处理-->
            <ul v-if="(query.messageId&&query.messageType&&query.id&&query.moduleType==3)">
              <li  @click.stop="firstMesTo2('/webTwo/main/column/piclist',query)">
                <a class="hover" href="javascript:;">{{query.columnName}}</a>
              </li>
            </ul>
            <!-- 首页右侧栏目模块图片列表跳转特殊处理
            <ul v-if="(query.type==3&&query.secondColumn&&query.indexid)">
              <li >
                <a class="hover" href="javascript:;">{{query.columnName}}</a>
              </li>
            </ul> -->
            
            <!--栏目列表页-->
            <template v-for="(navItem,index) in columnList" v-if="(query.id&&query.secondColumn&&!query.indexid)">
              <div v-if="(navItem.id==query.parentid)">
                <ul class="listmenu">
                  <template v-for="(subNav,subindex) in navItem.moduleList">
                    <li  v-if="subNav.type===1" @click.stop="subjumpTo('/webTwo/main/column/newdetail',navItem,subNav)">
                    <a :class="query.id==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===2" @click.stop="subjumpTo('/webTwo/main/column/newlist',navItem,subNav)">
                      <a :class="query.id==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===3" @click.stop="subjumpTo('/webTwo/main/column/piclist',navItem,subNav)">
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
            <!-- <template v-for="(navItem,index) in columnList" v-if="(query.parentsid&&query.id&&query.messageType)">
              <div v-if="(navItem.id==query.parentsid)">
                <ul class="listmenu">
                  <template v-for="(subNav,index) in navItem.moduleList">
                    <li  v-if="subNav.type===1" @click.stop="subjumpTo('/webTwo/main/column/newdetail',navItem,subNav)">
                    <a :class="query.parentid==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===2" @click.stop="subjumpTo('/webTwo/main/column/newlist',navItem,subNav)">
                      <a :class="query.parentid==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===3" @click.stop="subjumpTo('/webTwo/main/column/piclist',navItem,subNav)">
                      <a :class="query.parentid==subNav.id?'hover':''" href="javascript:;">{{subNav.name}}</a>
                    </li>
                    <li v-if="subNav.type===4">
                      <a  :href="subNav.columnUrl" target="_blank">{{subNav.name}}</a>
                    </li>
                  </template>
                </ul>
              </div>
            </template> -->
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
        if(to.path.indexOf('newdetail')!==-1){
          setTimeout(()=>{
            if(document.querySelector('.sideBar')!==null&&to.query.messageType){
              document.querySelector('.sideBar').style.display="none";
              document.querySelector(".column-content").style.paddingLeft=0;
            }else{
              document.querySelector('.sideBar').style.display="block";
              document.querySelector(".column-content").style.paddingLeft=220+'px';
            }
          },10);
        }else{
          if(document.querySelector('.sideBar')!==null){
            document.querySelector('.sideBar').style.display="block";
            document.querySelector(".column-content").style.paddingLeft=220+'px';
          }
        }
        if(to.query){
          this.query=to.query;
          //一级栏目
          if(this.query.id && this.query.firstColumn){
            this.jumpToSecond(this.query);
          }
          //栏目的消息详情
          if(this.query.id && this.query.messageType&&!this.query.messageId){
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
          /*首页栏目下面的消息跳转做特殊处理*/
          if(this.query.messageId&&this.query.messageType&&this.query.id&&this.query.moduleType==2||this.query.messageId&&this.query.messageType&&this.query.id&&this.query.moduleType==3){
            console.log(" ");
          }
          
        }
      },
      immediate: true
    }
  },
  methods:{
    //一级跳二级
    jumpToSecond(query){
      const navArray=this.columnList;
      for(var i=0;i<navArray.length;i++){
        //console.log(query.id,navArray[i].id)
        if(query.id==navArray[i].id){
          let subArray=navArray[i].moduleList[0];
          //console.log("ss",subArray);
          if(subArray&&subArray.type===2){
            this.$router.push({
              path:'/webTwo/main/column/newlist',
              query:{
                parentid:query.id,
                id:subArray.id,
                secondColumn:2,
                type:2
              }
            })
          }else if(subArray&&subArray.type===3){
            this.$router.push({
              path:'/webTwo/main/column/piclist',
              query:{
                secondColumn:2,
                type:3,
                parentid:query.id,
                id:subArray.id
              }
            })
          }else if(subArray&&subArray.type===1){
            this.$router.push({
              path:'/webTwo/main/column/newdetail',
              query:{
                secondColumn:2,
                type:1,
                parentid:query.id,
                id:subArray.id
              }
            })
          }else if(subArray&&subArray.type===4){
            this.$router.push({
              path:'/webTwo/main/column/newlist',
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
      this.$router.push({path:url,query:{parentid:parquery.id,id:query.id,secondColumn:query.secondColumn,type:query.type}})
    },
    //首页栏目详情跳转
    nosubjumpTo(url,query){
     //console.log("s",query);
     this.$router.push({path:url,query:{id:query.moduleOnly,columnName:query.columnName,secondColumn:query.secondColumn,type:query.type,indexid:query.indexid}});
      // this.$router.push({path:url,query:{id:query.id,columnName:query.columnName,secondColumn:query.secondColumn,type:query.type,indexid:query.indexid}});
    },
    nosubjumpTo2(url,query){
      this.$router.push({path:url,query:{id:query.moduleOnly,columnName:query.columnName,secondColumn:query.secondColumn,type:query.type,indexid:query.indexid}});
    },
    firstMesTo(url,query){
      this.$router.push({path:url,query:{id:query.id,columnName:query.columnName,moduleType:2,messageId:query.messageId,messageType:query.messageType}});
    },
    firstMesTo2(url,query){
      this.$router.push({path:url,query:{id:query.id,columnName:query.columnName,moduleType:3,messageId:query.messageId,messageType:query.messageType}});
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
  background:#e5e5e5;
  .main-wrapper{
    width:1200px;
    margin:0 auto;
    padding-top:10px;
    .sitemenu{
      width:100%;
      height:45px;
      //border-bottom:4px solid $column-bottom;
      &>.fl{
        float:left;
        display:block;
      }
      &>.icon{
        font-size:24px;
        // color:#006442;
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
      a.hover{
        color:#fff;
        // background:#006442;
      }
      a:hover{
        color:#fff;
        // background:#038f60;
      }
    }
  }
  .column-box{
    width:100%;
    height: auto;
    min-height: 619px;
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
  /* color:#4AAB26; */
  cursor: pointer;
}
.main-container .el-breadcrumb__inner{
  color:#333;
}
.main-container .el-pager li.active{
  /* color:#006442; */
}
.main-container .el-pager li:hover{
  /* color:#006442; */
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
.column-container .el-breadcrumb__inner a.hover{
  cursor: pointer !important;
}
.column-container .el-breadcrumb__inner a:hover{
  cursor: pointer !important;
}
</style>
