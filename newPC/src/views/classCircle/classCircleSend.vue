<template>
    <div class=" calendar-list-container classCircleSend" >
        <div class="top">
             <div class="button-box">
                 <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
                 <el-button size="medium" type="primary" @click="addClassCircleContent()">发布</el-button>
                 <span v-if="isRelatedStus == 1">
                     关联学生:<el-radio-group v-model="relateStu">
                         <el-radio :label="1" style="color: #fff;">否</el-radio>
                         <el-radio :label="2" style="color: #fff;">是</el-radio>
                     </el-radio-group>
                     <address-book v-if="relateStu == 2" v-model="addressData" :config="configData" style="width: 300px;display: inline-block;vertical-align: middle;background-color: #fff;color:#000"></address-book>
                 </span>
             </div>
        </div>
         <div class="Box">
        <div class="classCircleDetailss">
            <!-- 白色盒子 -->
            <div class="middle_content"  >
                <!-- 主体 -->
                <div class="inner_content" >
            <!--内容展示框-->
            <div class="contentDetails">
                <div class="ul">
					<span  :class="{'color' : item.is}"  class="button" :key="index" v-for="(item,index) in datalist" @click="buttonclidk(item.id,index,item.optionName)">{{item.optionName}}</span>
			  </div>
                <el-form :model="listQuery" :rules="rules" ref="ruleForm">
                    <el-form-item prop="descriptions">
                        <ueditor class="rich-editor new-editor" ref="ueditor" :defaultMes="listQuery.description"
                                 @editModel="richTextEditHandler"></ueditor>
                    </el-form-item>
                    <el-form-item prop="content">
                        <el-input class="description" @change="addDescription()" type="textarea" resize="none"
                                  placeholder="请输入摘要" :rows="4" :maxlength="500"
                                  v-model.trim="descriptionContent"></el-input>
                    </el-form-item>
                </el-form>
            </div>
               </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Vue from "vue";
    import Ueditor from '@/components/Ueditor';
    import BackTool from '@/components/BackTool';
    import {
        getClassCircleSetInfo,
        addClassCircle,
        getClassCircleOptionList
    } from '@/api/classCircle';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            BackTool,
            Ueditor,
            AddressBook
        },
        data() {
            const descriptionValidata = (rule, value, callback) => {
                if ( this.listQuery.description == "") {
                    callback(new Error('请输入内容'));
                } else {
                    callback();
                }
            };
            return {
                listQuery: {
                    classId: null,
                    content: "",
                    createType: 1,
                    description: "",
                    picsJson: null,
                    studentId: 0,
                    type: 2,
                    videosJson: null,
                    optionName:'',
					optionId:0,
                },
                datalist:[],
                rules: {
                    descriptions: [
                        {required: true, trigger: 'blur,change', validator: descriptionValidata}
                    ],
                    content: [
                        {required: true, message: '请输入摘要', trigger: 'blur'}
                    ],
                },
                descriptionContent: "",
                relateStu: 1,
                configData: {
                    title: '发布范围',
                    depart: {target: 'user', departType: 's', userTypes: '2'},
                },
                addressData: {},
                isRelatedStus: 0
            }
        },
        watch: {
            listQuery: {
                description: function (val) {
                },
            },
        },
        created() {
            this.listQuery.classId = this.$route.query.classId;
            getClassCircleSetInfo()
                .then(res => {
                    this.isRelatedStus = res.data.data.postSetInfo.isRelatedStus;
                })
                .catch(function () {
                });
            getClassCircleOptionList().then(res => {
                    let data = res.data.data;
					this.datalist=data;
					for(let item of this.datalist) {
					item.is=false
				};

                })
        },

        mixins: [mixin],
        methods: {
            //类型
			buttonclidk(id,index,name){
				if(this.datalist[index].is){
					this.listQuery.optionName='';
					this.listQuery.optionId=0;
					for( var i=0;i<this.datalist.length;i++){
						this.datalist[i].is=false;
						 Vue.set(this.datalist,i,this.datalist[i])
					};
				}else{
					this.listQuery.optionName=name;
					this.listQuery.optionId=id;
					for( var i=0;i<this.datalist.length;i++){
						this.datalist[i].is=false;
						if(i==index){
                              this.datalist[i].is=true;
						}
						 Vue.set(this.datalist,i,this.datalist[i])
					};
				}


			},
            richTextEditHandler(content) {
                this.isexit();
                let test = /<[^>]*>|<\/[^>]*>/gm;
                this.listQuery.description = content;
                this.descriptionContent = content.replace(test, "").replace(/&nbsp;/ig, "").substring(0, 500);
                this.listQuery.content = this.descriptionContent;
            },
            addDescription() {
                this.listQuery.content = this.descriptionContent;
            },

            isexit() {//验证富文本是否为空
                let _this = this;
                _this.$watch("listQuery.description", function (data) {
                    _this.listQuery.descriptions = data;
                    _this.$refs.ruleForm.validateField('descriptions');
                })
            },
            addClassCircleContent() {
			    if(this.relateStu == 2 && (!this.addressData.userJson || this.addressData.userJson.length === 0)) {
			        this.$message.error('请选择要关联的学生');
                } else {
                    this.listQuery.description=this.$refs.ueditor.getContent();
                    this.$refs.ruleForm.validate((valid) => {
                        if (valid) {
                            addClassCircle({
                                ...this.listQuery,
                                relatedStuJson: this.relateStu == 2 ? JSON.stringify(this.addressData.userJson) : ''
                            }).then(res => {
                                let data = res.data;
                                if (data.code === 200) {
                                    this.$message({
                                        message: '发布成功',
                                        type: 'success'
                                    });
                                    this.$router.back();
                                } else {
                                    this.$message({
                                        message: data.msg,
                                        type: 'error'
                                    });
                                }

                            })
                        }
                    })
                }

            },
        },
    }
</script>

<style scoped>
.top{
    width: 100%;
    height: 54px;
    position: fixed;
    top: 0px;
    left: 0;
    color: #fff;
    background: #303030;
}
.button-box{
    width: 865px;
    margin: 0 auto;
    padding-top: 8px
}
	.ul{
			overflow: auto;
			padding: 5px;
		}
		.button{
		font-size: 12px;
        display: block;
        border: 1px #3cc51f solid;
        box-sizing: border-box;
        line-height: 34px;
        height: 36px;
        background: #fff;
        color: #3cc51f;
        float: left;
        padding: 0 10px;
        border-radius: 5px;
        margin: 5px 5px 5px 0;
        cursor:pointer;
		}
       .color{
			 background: #3cc51f;
		     color: #fff;
		}
    .classCircleSend{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      height: 100%;
      width: 100%;
      background: #fff;
    }
    .rich-editor {
        line-height: 1em;
    }
     .classCircleSend .menu-tools{
         padding-left: 100px;
     }
    .classCircleDetailss {
        width: 865px;
        padding-top: 15px;
        margin: 0 auto;

    }
     .Box {
        width: 100%;
        margin: 54px auto 0;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/class/class_ring.jpg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow-x: hidden;
        overflow-y: auto;
        height: 95%;
    }
    .middle_content{
    width: 865px;
    min-height: 646px;
    margin: 0 auto;
    background: rgba(255,255,255,0.35);
    overflow: hidden;
    border-radius: 10px;
}
.inner_content{
    width: 833px;
    margin: 20px auto 44px;
    padding: 10px 10px 100px 10px;
    border: 1px solid rgba(0,0,0,0.4);
    background: #fff;
    border-radius: 10px;
}

</style>
