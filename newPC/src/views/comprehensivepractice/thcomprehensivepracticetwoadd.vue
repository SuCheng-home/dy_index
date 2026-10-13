<template>
    <div class="homeVisitadd">
       <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="addActivityGroups()">保存</el-button>   
      </div>
        <div class="main-wrap" :style="`height: ${maxH-100}px;`">
            <div class="article-container">
                <el-form  :model="formData"  :rules="rules"   label-width="140px"  ref="form" >
                    <el-form-item label="分组名称" prop="groupName">
                        <el-input v-model="formData.groupName" :maxlength="15" placeholder="请输入分组名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="分组学生" prop="addressData">
                        <address-book v-model="formData.addressData" :config="configData" :isSchoolManager="true"></address-book>
                    </el-form-item>
                    <el-form-item label="排序" prop="orderNo">
                         <el-input-number v-model.trim="formData.orderNo" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixin from '@/mixins/windowResize';
    import {getSimpleRule} from '@/utils/validate';
    import {addActivityGroup} from '@/api/comprehensivepractice';
    export default {
        components: {
            AddressBook
        },
        data() {
            const addressDataValidator = (rule, value, callback) => {
                if((!this.formData.addressData.userJson || this.formData.addressData.userJson.length === 0)&&(!this.formData.addressData.departJson || this.formData.addressData.departJson.length === 0)) {
                    callback(new Error('分组学生不能为空'));
                } else {
                    callback();
                }
            };
            return {
                configData: {
                    title: '分组学生',
                    depart: {target: 'all', departType: 's', userTypes: '2'},
                    group: false
                },
                formData: {
                    groupName: '',
                    addressData: {departJson: [], groupJson: [], userJson: []},
                    orderNo: ''
                },
                rules: {
                    groupName: getSimpleRule('分组名称', false),
                    orderNo: getSimpleRule('排序', false, 'unsignedInteger'),
                    addressData: [{
                        required: true, validator: addressDataValidator
                    }]
                }
            }
        },
        mounted() {
           
        },
        mixins:[mixin],

        methods: {
            addActivityGroups() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        const args = {
                            groupName: this.formData.groupName,
                            orderNo: this.formData.orderNo,
                            activityId: this.$route.query.activityId,
                            studentsJson: this.formData.addressData,
                            operateType:0
                        };
                        addActivityGroup(args).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '操作成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.back();
                                    }else{
                                         this.$message({
                                            message: data.msg,
                                            type: 'warning'
                                        });
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
