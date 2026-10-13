<template>
  <div class="search-container">
    <div class="search-wrap">
      <div class="search-content">
        <div class="search-box">
          <input class="search-input" v-model.trim="listQuery.title" type="text" placeholder="请输入关键字" @keyup.enter="getSchoolWebSearchFunc">
          <span class="search-icon" @click="getSchoolWebSearchFunc()"><i class="fa fa-search" aria-hidden="true"></i></span>
        </div>
        <div class="search-main">
          <ul class="newList-ul" v-loading.body="listLoading" v-if="searchList&&searchList.length!==0">
            <li v-for="(listItem,index) in searchList" :key="index">
              <span class="list-head"></span>  
              <!--首页栏目列表-->
              <template>
              <a href="javascript:;" v-if="listItem.messageType===1" @click="nosubjumpTo('searchDetail',listItem)" v-html="listItem.title"></a> 
              </template>
              <a :href="listItem.messageUrl" target="_blank" v-if="listItem.messageType===2">{{listItem.title}}</a> 
              <span class="time">{{listItem.createTime|filterTime}}</span>
            </li>
          </ul>
          <div class="pagination-container" v-show="!listLoading&&total!==0">
              <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="listQuery.pageNo"
              :page-sizes="[15, 20, 30, 50]"
              :page-size="listQuery.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination> 
          </div>
          <ul class="no-data" v-if="searchList&&searchList.length==0">
            <img src="http://cdn.weixiaojia.cn/mobile/images/nodata.png" alt="">
            <p>暂无数据</p>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import {getSchoolWebSearch} from '@/api/firstPage';
export default{
  data(){
    return{
      listQuery:{
        pageNo:1,
        pageSize:15,
        title:''
      },
      searchList:[],
      listLoading:false,
      total:null
    }
  },
  created(){
    
  },
  computed:{
    ...mapGetters([
      'schoolId'
    ])
	},
  mounted(){
    if(this.$route.query){
      this.listQuery.title=this.$route.query.searchTitle;
    }
    var This=this;

      This.getSchoolWebSearchFunc();

  },
  filters:{
    filterTime(data){
      return data?data.slice(0,19):''
    }
  },
  methods:{
    nosubjumpTo(url,item){
      let routeData=this.$router.resolve({path:url,query:{id:item.id,onlyDetail:1}});
      window.open(routeData.href, '_blank');
    },
    getSchoolWebSearchFunc(){
      this.listLoading=true;
      getSchoolWebSearch({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        title:this.listQuery.title,
        schoolId:this.schoolId,
        moduleId:0
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.searchList=data.data.dataList;
          this.total=data.data.pagination.total;
          this.listLoading = false;
        }
      })
    },
    handleSizeChange(val) {
			this.listQuery.pageSize = val;
			this.getSchoolWebSearchFunc();
		},
		handleCurrentChange(val) {
			this.listQuery.pageNo = val;
			this.getSchoolWebSearchFunc();
		}
  }
}
</script>
<style lang="scss">
.search-container{
  width: 100%;
  min-width: 1200px;
  min-height: 313px;
  padding: 16px 0 18px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #ececec;
  .search-wrap{
    width: 1200px;
    min-height: 313px;
    height: auto;
    margin: 0 auto;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    .search-content{
      width: 100%;
      padding: 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
.search-box{
  width:80%;
  margin:0 auto;
  border:1px solid #529D9D;
  height:36px;
  box-sizing: border-box;
  border-radius:4px;
  overflow: hidden;
  background:#fff;
  .search-input{
    float:left;
    width:88%;
    background:none;
    border: 0;
    padding:0 15px;
    height:34px;
    box-sizing: border-box;
    outline: none;
    color:#148d7f;
  }
  .search-input::-webkit-input-placeholder{
    color:#148d7f;
  }
  .search-icon{
    float:right;
    width:95px;
    height:34px;
    line-height:34px;
    text-align: center;
    background:#529D9D;
    cursor: pointer;
    i{
      font-size:20px;
      color:#fff;
    }
  }
}
.search-main{
  width: 100%;
  padding:20px 20px 0;
  height: auto;
  min-height: 669px;
  padding-bottom: 66px;
  position: relative;
  box-sizing: border-box;
  .newList-ul{
    width: 100%;
    height: 602px;
    margin: 0 auto;
    overflow: auto;
    li{
      width: 100%;
      height: 37px;
      line-height: 36px;
      border-bottom: 1px solid #EEE;
      overflow: hidden;
      padding-right:6px;
      box-sizing: border-box;
      .list-head{
        display: block;
        float: left;
        width:3px;
        height:3px;
        margin-top:18px;
        background:#006442;
        color: #006442;
        margin-right: 10px;
      }
      a{
        float: left;
        display: block;
        width: 76%;
        height: 36px;
        line-height: 36px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #5c5c5c;
      }
      a:hover{
        text-decoration: none;
        color: #007a6c;
      }
      .time{
        width: 18%;
        color: #5c5c5c;
        display: block;
        float: right;
        text-align: right;
        height: 36px;
        font-size: 14px;
        line-height: 36px;
      }
    }
  }
  .pagination-container{
    position: absolute;
    left: 20px;
    bottom: 20px;
    width: 100%;
    margin: 0 auto;
  }
  .pagination-container .el-pager li.active, .pagination-container .el-pager li:hover {
    color: #006442;
  }
}
.no-data{
  text-align: center;
  padding:80px 0 20px 0;
  &>img{
    width:auto;
    display:block;
    max-width:100%;
    margin:0 auto;
  }
  &>p{
    font-size:14px;
    color:#000;
  }
}
</style>