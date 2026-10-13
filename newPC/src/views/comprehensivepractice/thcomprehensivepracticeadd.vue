<template>
    <div class="homeVisitadd">
       <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="saveAssistTeacherLists()">保存</el-button>   
      </div>
        <div class="main-wrap" :style="`height: ${nobottommaxH}px;`">
            <div class="article-container">
                <el-form  :model="formData"  :rules="rules"   label-width="140px"  ref="form" >
                    <el-form-item label="协助教师" prop="addressData">
                        <address-book v-model="formData.addressData" :config="configData"></address-book>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixin from '@/mixins/windowResize';
    import {saveAssistTeacherList,getPracticeActivityInfoByIdForTeacher} from '@/api/comprehensivepractice';
    export default {
        components: {
            AddressBook
        },
        data() {
            const addressDataValidator = (rule, value, callback) => {
                if(!this.formData.addressData.userJson || this.formData.addressData.userJson.length === 0) {
                    callback(new Error('协助教师不能为空'));
                } else {
                    callback();
                }
            };
            return {
                configData: {
                    title: '协助教师',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: false
                },
                formData: {
                    addressData: {departJson: [], groupJson: [], userJson: []},
                },
                rules: {
                    addressData: [{
                        required: true, validator: addressDataValidator
                    }]
                }
            }
        },
        mounted() {
                getPracticeActivityInfoByIdForTeacher(this.$route.query.id).then(res => res.data).then(data => {
                        let mydata=data.data;
                        this.$set( this.formData.addressData, "userJson",JSON.parse(mydata.assistThJson))
                    })
        },
        mixins:[mixin],

        methods: {
            saveAssistTeacherLists() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        const args = {
                            id: this.$route.query.id,
                            assistThJson:JSON.stringify(this.formData.addressData.userJson)  ,
                             };
                        saveAssistTeacherList(args).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '操作成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.back();
                                    }
                                }).catch(() => {})
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.homeVisitadd {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .article-container{
      width:810px;
      margin: 20px auto;
  }
}
</style>
