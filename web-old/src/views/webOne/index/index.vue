<template>
	<div class="index-container">
		<div class="lunbo-container" >
			<!--v-loading.body="listLoading"-->
			<div class="lunbo-box" v-if="photoJson.length>0" >
				<el-carousel :interval="shufflingTime*1000" arrow="never" trigger="click" height="360px">
					<el-carousel-item  v-for="(item,index) in photoJson" :key="index">
						<div class="photo-item" :style="{backgroundImage:`url(${item})`}">
							<div class="title">{{webName}}</div>
						</div>
					</el-carousel-item>
				</el-carousel>
			</div>
		</div>
		<!--主体内容-->
		<div class="index-main-container">
			<div class="main-wrapper" >
				<template v-for="(newItem,index) in currentModuleList" v-if="currentModuleList.length>0">
					<template v-for="(subNewItem,subIndex) in newItem.moduleListJson" v-if="newItem.moduleListJson&&newItem.moduleListJson.length==1">
						<div class="column" v-if="subNewItem.name!==''" :key="newItem.orderNum">
							<div class="title">
								<span class="fa fa-window-restore line-decoration"></span>
								<span class="add-title">{{subNewItem.name}}</span>
								<a href="javascript:;" @click="noJump('/webOne/main/column/newlist',subNewItem)">更多</a>
							</div>
							<div class="content-box" v-if="index==0">
								<el-carousel :interval="shufflingTime*1000" indicator-position="none" arrow="never" trigger="click" height="248px">
									<el-carousel-item  v-for="(item,index) in subNewItem.messageList" :key="item.id">
										<div class="photo-item">
											<a class="photo-item-a" @click.stop="jumpTo('/webOne/main/detail',subNewItem,item.id)" v-if="item.messageType==1">
												<img :src="item.logoUrl" v-if="item.logoUrl" alt="">
												<img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg" v-if="!item.logoUrl" alt="">
												<div class="title" v-html="item.title"></div>
											</a>
											<a class="photo-item-a" :href="item.messageUrl" v-else-if="item.messageType==2">
												<img :src="item.logoUrl" v-if="item.logoUrl" alt="">
												<img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg" v-if="!item.logoUrl" alt="">
												<div class="title" v-html="item.title"></div>
											</a>
										</div>
									</el-carousel-item>
								</el-carousel>
							</div>
							<ul class="newList" v-if="subNewItem.name!==''&&index!==0">
									<li v-for="(item,index) in subNewItem.messageList" :key="index">
										<span class="fa fa-caret-right list-head"></span>
										<a href="javascript:;" v-if="item.messageType==1" @click.stop="jumpTo('/webOne/main/detail',subNewItem,item.id)" v-html="item.title"></a>
										<a :href="item.messageUrl" v-else-if="item.messageType==2" target="_blank">{{item.title}}</a>
										<span class="time">{{item.createTime | trimTime}}</span>
									</li>
							</ul>
						</div>
					</template>
					<template v-if="newItem.moduleListJson&&newItem.moduleListJson.length>1" >
						<div class="column" :key="newItem.orderNum">
							<div class="title">
								<div class="sTitle"  v-for="(subNewItem,subIndex) in newItem.moduleListJson" @click="anySwitch(subNewItem,index,subIndex)" :class="{active:subNewItem.activeIndex==subIndex}">
									<span class="add-title" :title="subNewItem.name">
										<span  class="fa fa-window-restore line-decoration"></span>
										{{subNewItem.name}}
									</span>
								</div>
								<template v-for="(anysubNewItem,anysubIndex) in newItem.moduleListJson" v-if="anysubIndex==0&&newItem.hideDef">
									<a href="javascript:;" v-if="anysubNewItem.messageList" @click="anynoJump('/webOne/main/column/newlist',anysubNewItem)" :key="anysubIndex">更多</a>
								</template>
								<a href="javascript:;" v-if="!newItem.hideDef" @click="anynoJump('/webOne/main/column/newlist',anyMore)">更多</a>
							</div>
							<template v-for="(subNewItem,subIndex) in newItem.moduleListJson" v-if="newItem.hideDef">
								<ul class="newList" >
										<li v-for="(item,index) in subNewItem.messageList" :key="index">
											<span class="fa fa-caret-right list-head"></span>
											<a href="javascript:;" v-if="item.messageType==1" @click.stop="jumpTo('/webOne/main/detail',subNewItem,item.id)" v-html="item.title"></a>
											<a :href="item.messageUrl" v-else-if="item.messageType==2" target="_blank">{{item.title}}</a>
											<span class="time">{{item.createTime | trimTime}}</span>
										</li>
								</ul>
							</template>
							<ul class="newList" v-if="!newItem.hideDef">
									<li v-for="(item,index) in newItem.anyMainDatas" :key="index">
										<span class="fa fa-caret-right list-head"></span>
										<a href="javascript:;" v-if="item.messageType==1" @click.stop="jumpTo('/webOne/main/detail',anyMore,item.id)" v-html="item.title"></a>
										<a :href="item.messageUrl" v-else-if="item.messageType==2" target="_blank">{{item.title}}</a>
										<span class="time">{{item.createTime | trimTime}}</span>
									</li>
							</ul>
						</div>
					</template>
				</template>
			</div>
		</div>
		<!--link-->
		<div class="link-container">
			<div class="link-wrap">
					<div class="fa fa-chevron-left link-left-btn" @click="leftSlider()"></div>
					<div class="fa fa-chevron-right link-right-btn" @click="rightSlider()"></div>
					<div class="link-mask-box">
					<div class="link-abox-wrap" v-if="urlModuleType==1">
						<div class="link-abox" v-for="(linkItem,index) in urlModuleJson" :key="index">
							<a :href="linkItem.columnUrl" target="_blank">
								<div class="img-box">
									<img v-if="linkItem.logoUrl" :src="linkItem.logoUrl" alt="">
									<img v-else src="https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/test.png" alt="">
								</div>
								<span class="linkName" :title="linkItem.name">{{linkItem.name}}</span>
							</a>
						</div>
					</div>
					<div class="link-abox-wrap" v-if="urlModuleType==2">
						<div class="link-abox" v-for="(linkItem,index) in urlModule2Array" :key="index" style="margin: 30px;color:#fff">
							{{linkItem.name}}：
							<el-select v-model="linkItem.id" placeholder="请选择">
								<a :href="item.messageUrl" target="_blank" v-for="item in linkItem.messageList" v-if="item.messageType==2">
									<el-option :key="item.id" :label="item.title"  size="small"	:value="item.id"></el-option>								
						     	</a>								
							</el-select>
						</div>
					</div>
					</div>
			</div>
		</div>
		<template v-for="(allItem,allindex) in allData">
			<float-view v-if="allData&&allData.length!==0" @floatView="floatView" @closeView="closeView" :json="allItem" :key="allindex"></float-view>
		</template>
	</div>
</template>

<script>
import {mapGetters} from 'vuex';
import floatView from '@/components/floatView/index';
import {getSchoolWebModuleMessageList,getSchoolWebSuspendMessageListByTime} from '@/api/firstPage';
export default{
	components:{
    floatView 
  },
	data(){
		return{
			dataList:[],
			listLoading: true,
			secondColumn:2,
			type:2,
			indexid:1,
			clickIndex:0,
			anyMainData:[],
			anyMore:[],
			currentModuleList:[],
			floatData:[],
			allData:[]
		}
	},
	computed:{
    ...mapGetters([
		'id',//网站id
		'shufflingTime',//
		'webName',//网站名称
		'photoJson',//轮播图
		'urlModuleJson',//url列表
		'moduleList',
		'urlModule2Array',
		'urlModuleType'
    ])
	},
	created(){
		
	},
	mounted(){
		this.currentModuleList=this.moduleList;
		this.getSchoolWebSuspendMessageListByTimeFunc();
		var This=this;
		this.anyMore=[];
		this.currentModuleList.forEach(item=>{
			this.$set(item,"hideDef",true);
			item.moduleListJson.forEach((childItem,childIndex)=>{
				if(childIndex==0){
					this.$set(childItem,"activeIndex",0);
				}else{
					this.$set(childItem,"activeIndex",null);
				}
			})
		})
		setTimeout(function(){
			var maxNum=This.urlModuleJson.length;
			var menuBar=document.querySelector(".link-abox-wrap");
					var menuLi=menuBar.querySelectorAll(".link-abox");
			var maxWidth=menuLi[0].offsetWidth*maxNum;
			var boxWidth=menuBar.offsetWidth;
			if(maxWidth-boxWidth>0){
				document.querySelector(".link-right-btn").style.display='block';
			}
		},300);
	},
	filters:{
		trimTime(datetime){
			return datetime?datetime.slice(0,10):'';
		}
	},
	methods:{
		floatView(json){
			//console.log("ss",json);
			if(json.messageType==2){
				window.open(json.messageUrl);
			}else if(json.messageType==1){
				let messageJson=JSON.parse(json.messageJson);
			//	console.log("ss",messageJson);
				const {href}=this.$router.resolve({path:'/webOne/main/detail',query:{parentsid:json.id, columnName:messageJson.title,id:messageJson.id}})
				window.open(href, '_blank')
			//	this.$router.push({path:'/webOne/main/detail',query:{parentsid:json.id, columnName:messageJson.title,id:messageJson.id}})
			}
		},
		closeView(json){
		//	console.log("json",json);
			this.allData.forEach((item,index)=>{
				if(item.id==json.id){
					this.allData.splice(index,1);
				}
			})
		},	
		getSchoolWebSuspendMessageListByTimeFunc(){
			getSchoolWebSuspendMessageListByTime({
				webId:this.id,
				searchTime:this.$moment(new Date()).format('YYYY-MM-DD')
			}).then(res=>res.data)
			.then(data=>{
				if(data.code===200){
				//	console.log("data",data.data);
					this.floatData=data.data;
					this.allData=[];
					this.floatData.forEach((res,index)=>{
						this.allData.push({
							fileJson:res.fileJson,
							messageType:res.messageType,
							id:res.id,
							messageUrl:res.messageUrl,
							messageJson:res.messageJson,
							title:res.title,
							left:Math.floor(Math.random()*10*index*100+1),
							top:Math.floor(Math.random()*10*index*100+1),
						})
					})
					//console.log("alldasdasdads",this.allData);
				}
			})
		},
		anySwitch(subNewItem,itemIndex,subIndex){
			this.currentModuleList.forEach((item,index)=>{
				if(index==itemIndex){
					this.$set(item,"hideDef",false);
					//item.hideDef=false;
					item.moduleListJson.forEach((childItem)=>{
						//childItem.activeIndex=null;
						this.$set(childItem,"activeIndex",null);
					})
					this.$set(subNewItem,"activeIndex",subIndex);
					//subNewItem.activeIndex=subIndex;
					this.anyMore=subNewItem;
					this.anyMainData=[];
					getSchoolWebModuleMessageList({
						pageNo:1,
						pageSize:8,
						moduleId:subNewItem.id
					}).then(res=>res.data)
					.then(data=>{
						this.anyMainData=data.data.dataList;
						this.$set(item,"anyMainDatas",this.anyMainData);
					})
				}
			})
		},
		leftSlider(){
      let maxNum=this.urlModuleJson.length;
      let oneWidth=document.querySelector(".link-abox-wrap").querySelectorAll(".link-abox")[0].offsetWidth;
      document.querySelector(".link-right-btn").style.display='block';
      if(this.clickIndex<=1){
        this.clickIndex=1;
        document.querySelector(".link-left-btn").style.display='none';
      }
      this.clickIndex--;
      document.querySelector(".link-abox-wrap").style.marginLeft=-this.clickIndex*oneWidth+'px';
    },
    rightSlider(){
      let maxNum=this.urlModuleJson.length;
      let oneWidth=document.querySelector(".link-abox-wrap").querySelectorAll(".link-abox")[0].offsetWidth;
      this.clickIndex++;
      document.querySelector(".link-left-btn").style.display='block';
      if(this.clickIndex>=(maxNum-11)){
        this.clickIndex=maxNum-11;
        document.querySelector(".link-right-btn").style.display='none';
      }
      document.querySelector(".link-abox-wrap").style.marginLeft=-this.clickIndex*oneWidth+'px';
    },
		noJump(url,query){
			console.log(query);
			this.$router.push({path:url,query:{id:query.id,columnName:query.name,type:this.type,indexid:this.indexid}});
		},
		anynoJump(url,query){
			this.$router.push({path:url,query:{id:query.id,columnName:query.name,type:this.type,indexid:this.indexid}});
		},
		//跳转
		jumpTo(url,parquery,query){
      this.$router.push({path:url,query:{parentsid:parquery.id, columnName:parquery.name,id:query}})
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin.scss';
.index-container{
	position:relative;
	width:100%;
	min-width:1200px;
}
.lunbo-container{
	width:100%;
	min-width:1200px;
	height:360px;
	overflow:hidden;
}
.lunbo-box{
	width:1200px;
	height:360px;
	margin:0 auto;
	position: relative;
	.photo-item{
		width:100%;
		height:360px;
		overflow: hidden;
		position: relative;
		background:no-repeat center center;
		background-size:100% 100%;
		&>img{
		max-width: 100%;
		width:100%;
		height:100%;
		display:block;
		}
		.title{
			position:absolute;
			left:0;
			bottom:0;
			width:100%;
			height:36px;
			line-height:36px;
			text-indent:1em;
			color:#fff;
			background:url("../../../assets/images/index/bar_bg.png");
		}
	}
}
/*主体内容*/
.index-main-container{
	width: 100%;
	min-width: 1200px;
	min-height: 313px;
	// background-color: #E5E5E5;
}
.main-wrapper{
	@include clearfix;
	width:1200px;
	min-height: 313px;
	height:auto;
	margin:0 auto;
}
.column{
	float: left;
	width:410px;
	height: 300px;
	padding-right:30px;
	position: relative;
	& >.title{
		width: 100%;
		height: 43px;
		line-height: 43px;
		// border-bottom:4px solid $golbal-hover;
		position: relative;
		&>.line-decoration{
			position: absolute;
			display: block;
			left: 1px;
			top: 11px;
			width: 4px;
			height: 18px;
			margin: 0;
		}
		&>span{
			margin: 17px 0 0 22px;
			line-height: 20px;
			font-size: 14px;
			font-weight: bold;
		}
		&>a{
			position: absolute;
			right:6px;
			top:0;
			color:#000;
		}
		&>a:hover{
			// color:$golbal-hover;
		}
	}
	.sTitle{
		float:left;
		max-width:110px;
		position: relative;
		margin-right:10px;
		cursor: pointer;
		overflow: hidden;
		.line-decoration{
			position: absolute;
			display: block;
			left: 1px;
			top:14px;
			width: 18px;
			height: 18px;
			margin: 0;
		}
		&>span{
			display: block;
			position: relative;
			max-width:106px;
			height: 31px;
			box-sizing: border-box;
			padding: 11px 0 0 22px;
			line-height: 20px;
			font-size: 14px;
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.content-box{
		padding-top:10px;
		.photo-item{
			width:100%;
			height:238px;
			position: relative;
			.photo-item-a{
				display: block;
				width:100%;
				height:238px;
				position: relative;
				cursor: pointer;
				&>img{
					width:100%;
					display:block;
					max-width:100%;
					height:238px;
				}
				&>.title{
					@include nowrap;
					position:absolute;
					left:0;
					bottom:0;
					width:100%;
					height:36px;
					line-height:36px;
					text-indent:1em;
					color:#fff;
					padding:0 4px;
					z-index:2;
					cursor: pointer;
					background:url("../../../assets/images/index/bar_bg.png");
				}
			}
		}
	}
	.newList{
		width:100%;
		height:248px;
		overflow:hidden;
		padding-top:4px;
		&>li{
			list-style: none;
			padding: 3px;
			height:31px;
			line-height:31px;
			font-size: 14px;
			@include clearfix;
			.list-head{
				display:block;
				float:left;
				font-size:14px;
				padding-top:5px;
				// color: $golbal-hover;
				margin-right:4px;
			}
			&>a{
				float:left;
				display:block;
				width:66%;
				height:25px;
				line-height: 25px;
				@include nowrap;
				color:#5C5C5C;
			}
			&>a:hover{
				text-decoration: underline;
			}
			.time{
				width:27%;
				color: #5C5C5C;
				display:block;
				float: right;
				text-align: right;
				height:25px;
				font-size:14px;
				line-height: 25px;
			}
		}
	}
}
.column:nth-child(3n){
	padding-right:0;
	width:380px;
}
/*links*/
.link-container{
	width:100%;
	min-width:1200px;
	height:100px;
	overflow:hidden;
	// background:$golbal-color;
}
.link-wrap{
	width:1200px;
	height:100px;
	margin:0 auto;
	position: relative;
	.link-mask-box{
		width:1200px;
		height: 100px;
		overflow: hidden;
		@include clearfix;
	}
	.link-abox-wrap{
		width:auto;
	}
	.link-abox{
		float:left;
		padding: 0px 14px;
	}
	& a{
		display:block;
    width: 80px;
		height: 80px;
		padding-top:9px;
    // border: 1px solid $golbal-color;
    margin: 10px 0 0 0px;
    text-align: center;
		color: white;
		&>span{
			margin-top:10px;
			display:block;
			font-size: 12px;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	& a:hover{
		border: 1px solid #535353;
		border-radius: 12px;
	}
	& a:nth-child(1){
		margin-left:0;
	}
	.img-box{
		width:36px;
		height:36px;
		overflow:hidden;
		margin:0 auto;
		-webkit-border-radius:8px;
		-moz-border-radius:8px;
		border-radius:8px;
		&>img{
			display: block;
			max-width:100%;
			width:100%;
			height:100%;
		}
	}
}
.link-left-btn{
	position: absolute;
	left: -40px;
	top: 32px;
	z-index: 3;
	color:#fff;
	display: none;
	font-size:17px;
	margin-left:16px;
	cursor: pointer;
}
.link-right-btn{
	position: absolute;
	right: -40px;
	top: 32px;
	z-index: 3;
	color:#fff;
	display: none;
	font-size:17px;
	margin-left:16px;
	cursor: pointer;
}
</style>
<style>
.lunbo-container .el-carousel__indicators{
	  position: absolute;
    list-style: none;
    bottom: 0;
    right: 0;
    margin: 0;
    width: 100%;
    text-align: right;
    padding-right: 24px;
		z-index: 4;
		box-sizing: border-box;
}
.lunbo-container .el-carousel__button{
		display: block;
    opacity:1;
    width: 14px;
    height: 14px;
    background-color: #fff;
    border: none;
    outline: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-transition: .3s;
		transition: .3s;
		border-radius:50%;
}
.lunbo-container .el-carousel__indicator.is-active button{
	/* background-color:#700005; */
}
.title .el-input.is-active .el-input__inner,.index-main-container .el-input__inner:focus{
  border-color: #dcdfe6;
}
</style>