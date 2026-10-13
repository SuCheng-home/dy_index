<template>
    <div  class="homeVisitindextwoinfo">
        <div class="filter-container">
            <el-button size="medium" type="default" @click="$router.back()">返回</el-button>
             <el-button type="primary" size="medium"  @click="homeVisitindextwoeidt()">编辑</el-button> 
            <el-button type="primary" size="medium"  @click="print()">打印</el-button> 
            
        </div>
        <div class="section"  :style="`height: ${nobottommaxH}px;`">
            <div class="table">
                 <table cellpadding="0"  ref="print" id="print" cellspacing="0">
				<tbody>  
                    <tr>						
						<td class="td" colspan="2">
                            {{ruleForm.className}}  {{ruleForm.stuName}}
                            家访记录表</td>	
					</tr>	               
                    <tr  v-if="isShowFiled('1001')">						
						<td class="td">家访教师</td>	
                        <td>{{ ruleForm.visitTeacher }}</td>
					</tr>	
                     <tr  v-if="isShowFiled('1002')">						
						<td class="td">家访时间</td>	
                        <td>{{ ruleForm.visitTime }}</td>
					</tr>	
                     <tr  v-if="isShowFiled('1003')">						
						<td class="td">家访地点</td>	
                        <td>{{ ruleForm.visitSite }}</td>
					</tr>	
                     <tr  v-if="isShowFiled('1004')">						
						<td class="td">家访内容</td>	
                        <td>
                            <span  v-for="item in ruleForm.visitContent" :key="item.id">
                                {{item.value}}；
                            </span>
                        </td>
					</tr>	
                     <tr  v-if="isShowFiled('1005')">						
						<td class="td">家访效果</td>	
                        <td>{{ ruleForm.visitEffect }}</td>
					</tr>	
                     <tr  v-if="isShowFiled('1007')">						
						<td class="td">家长意见</td>	
                        <td>{{ ruleForm.parentOpinion }}</td>
					</tr>	
                     <tr  v-if="isShowFiled('1006')">						
						<td class="td">家访图片</td>	
                        <td>
                             <image-previewer tag="richtext">
                                 <img  v-for="item in ruleForm.visitPics" :src="item.fileUrl" :key="item.id" />
                        </image-previewer>
                       </td>
					</tr>	
                     <tr  v-if="isShowFiled('1008')">						
						<td class="td">家访表图片</td>	
                        <td>
                             <image-previewer tag="richtext">
                                 <img  v-for="item in ruleForm.visitTablePics" :src="item.fileUrl" :key="item.id" />
                            </image-previewer>
                        </td>
					</tr>	
			</tbody>
        </table>

            </div>
           

        </div>
    </div>
</template>

<script>
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {mapGetters} from 'vuex';
    import windowResize from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getHomeVisitRecord,getHomeVisitInit} from "@/api/homeVisit";
    export default {
        components: {
            ImagePreviewer
        },
        mixins: [
            windowResize,
            baseMixin
        ],
        data() {         
            return {
                id: this.$route.query.id,
                ruleForm: {},
                visitFields:'',
            }
        },
        created() {
             getHomeVisitInit().then(res => res.data).then(data => {
            if(data.result&&data.data) {
                this.visitFields=data.data.visitFields
            }
            }).catch(() => {})
             getHomeVisitRecord(this.$route.query.id)
                .then(res => res.data)
                .then(data => {
                let mydata = data.data;
                mydata.visitContent=JSON.parse(mydata.visitContent)
                mydata.visitTablePics=JSON.parse(mydata.visitTablePics)
                mydata.visitPics=JSON.parse(mydata.visitPics)
                this.ruleForm = mydata;
                });
        },
        methods: {
            homeVisitindextwoeidt(){
      this.$router.push({path: "homeVisitindextwoadd",query: {id: this.id}});     
    },  
              isShowFiled(num) {
        return this.visitFields.indexOf(num) > -1;
    },
            print() {
                this.$print(this.$refs.print);
                },
        }
    }
</script>

<style lang="scss" scoped>
.section{
    overflow:auto;
}
.filter-container{
    padding-bottom:10px;
    border-bottom: 1px solid #eee;
}
.table{
    width:810px;
    margin:10px auto;
}
table {
  border-collapse: collapse;
  border: 1px solid #ccc;
  margin: 0 auto;
  min-width: 100%;
}
th {
    border: 1px solid #ccc;
    text-align: center;
    font-size: 13px;
    line-height: 20px;
    overflow: hidden;
    background: #ecf5ff;
    color:#409EFF;
    padding: 5px;
}
td {
  border: 1px solid #ccc;  
  font-size: 14px;
  line-height: 16px;
  background: #fff;
  padding:12px 5px;
  min-width:100px;
}
td img{
  width:60px;
      height:60px;
      margin: 5px ;
       object-fit: cover; 
}
.td{
     background: #efefef;
     width:150px;
     text-align: center;
}
    .homeVisitindextwoinfo {
        padding:12px;
    }
</style>
