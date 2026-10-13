<template>
    <div class="stopDietForStu">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
             <el-button class="filter-item" type="primary" @click="submit()" size="medium">保存</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="flow_add_box">  
                  <el-form label-width="100px" class="demo-ruleForm">
                    <el-form-item label="停伙学生">
                        <address-book v-model="addressData" :config="configData" ></address-book>
                    </el-form-item>
                    <el-form-item label="停伙餐次">
                         <el-checkbox v-model="stuBreakfast" v-if="dietSettingData.stuBreakfast === 1">早餐停伙</el-checkbox>
                         <el-checkbox v-model="breakMeal" v-if="dietSettingData.breakMeal === 1">课间餐停伙</el-checkbox>
                         <el-checkbox v-model="lunch" v-if="dietSettingData.lunch === 1">午餐停伙</el-checkbox>
                         <el-checkbox v-model="stuSupper" v-if="dietSettingData.stuSupper === 1">晚餐停伙</el-checkbox>
                    </el-form-item>
                     <el-form-item label="">
                        <el-checkbox v-model="type" >本学期全停</el-checkbox>
                        <span class="red" v-if="type">若勾选本学期全停，将会从选择日期一直停到学期末</span>
                      </el-form-item>
                    <el-form-item label="停伙日期" v-if="!type">
                        <el-date-picker  type="dates" ref="elPicker"   @focus="addEvent" :picker-options="pickerOptions"  v-model="dateStr" placeholder="选择一个或多个日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="停伙开始日期" v-if="type">
                          <el-date-picker
                  v-model="fireDate"
                  type="date"
                  placeholder="选择日期"
                  >
              </el-date-picker>
                     </el-form-item>
                    <el-form-item label="停伙备注">
                             <el-input :maxlength="100"   type="textarea" :autosize="{ minRows: 2, maxRows: 10}"  v-model="remark"   size="medium" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
         <el-dialog title="停伙信息"   width="600px" :visible.sync="newpop" :show-close="false">
            <div v-html="newdata" style="max-height: 300px;overflow: auto;"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="goBack">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {oneKeyFire,getFireSet,getMonthDate,insertFire} from "@/api/fire";
    import AddressBook from '@/components/AddressBook/indexExpand';
    export default {
        name: "documentFlowAdd",
        components: { AddressBook},
        data() {
            return {
               dietSettingData:{
                        stuBreakfast:0,
                        breakMeal:0,
                        lunch:0,
                        stuSupper:0
                    },
                    breakMeal: false,
                    lunch: false,
                    stuSupper: false,
                    stuBreakfast: false,
                    settingDateStr:[],
                    configData: {
                            title: '请选择停伙学生',
                            depart: { target: 'all', departType: 's', userTypes: '2' },
				group: false
                            // depart: {target: 'depart', departType: 's', userTypes: '2', notCheckSchool: true},
                            // SingleChose: true
                        },
                    addressData: {
                            userJson: [],
                            departJson: []
                        },
                        remark:"",
                        dateStr:[],
                         pickerOptions: {
                            disabledDate(time) {
                                const date = moment(time.getTime()).format('YYYY-MM-DD');
                                let is=true
                                for(let i=0;i<this.settingDateStr.length;i++){
                                    if(time==this.settingDateStr[i]){
                                       is=false;
                                    }

                                }
                                return is;
                            }
                        },
                        setClick:false,
                        type:false,
                        fireDate:"",
                        newpop:false,
                        newdata:""
            }
        },
        mixins: [mixins],
        created() {
            getFireSet().then(res => res.data).then(data => {
				this.dietSettingData = data.data;
			})
            this.getMonthDate(this.$moment(new Date()).format('YYYY-MM-DD'))
        },
        methods: {
            // 停伙提交
		submit() {
            console.log('this.addressData',this.addressData);
                const studentIds = this.addressData.userJson.map(item => item.id).join(',');
                const stuDepartIds = this.addressData.departJson.map(item => item.id).join(',')
                if(this.addressData.userJson.length == 0&&this.addressData.departJson.length == 0) {
                     this.$message.error('请选择学生或班级');
                    return
                } 
                 if(!this.breakMeal && !this.lunch&& !this.stuBreakfast&& !this.stuSupper) {
                     this.$message.error('请选择停伙餐次');
                    return
                }  
                if(this.dateStr.length === 0&&!this.type) {      
                     this.$message.error('请选择停伙日期');
                    return
                } 
                if(!this.fireDate&&this.type) {  
                    this.$message.error('请选择开始日期');
                    return
                } 
                let dateStr=[];
                for(let i=0;i<this.dateStr.length;i++){
                    dateStr.push(this.$moment(this.dateStr[i]).format('YYYY-MM-DD'))
                }
               
                if(!this.type) {
				insertFire({
					breakMeal: this.dietSettingData.breakMeal === 1 ? (this.breakMeal ? 1 : 0) : 0,
					dateStr: dateStr.join(","),
					fireType: 2,
					lunch: this.lunch ? 1 : 0,
					remark: this.remark,
					studentIds: studentIds,
					breakfask: this.dietSettingData.stuBreakfast === 1 ? (this.stuBreakfast ? 1 : 0) : 0,
					supper: this.dietSettingData.stuSupper === 1 ? (this.stuSupper ? 1 : 0) : 0,
					operateType:1,
                    stuDepartIds:stuDepartIds
				})
					.then(res => res.data)
					.then(data => {
						if (data.result) {
                            if(data.data){
                               this.newpop=true
                               this.newdata= data.data.replace(/\n/g, '<br>')
                            }else{
                                this.$message({
                                            message: '新增停伙成功',
                                            type: 'success',
                                            duration: 1000
                                        });
                                this.$router.back();
                            }
                            
							
						} else {
							this.$message.error(data.msg);
						}
					})
			}else{
				 oneKeyFire({
                        breakMeal: this.dietSettingData.breakMeal === 1 ? (this.breakMeal ? 1 : 0) : 0,
                        fireDate: this.$moment(this.fireDate).format('YYYY-MM-DD'),
                        fireType: 2,
                        lunch: this.lunch ? 1 : 0,
                        remark: this.remark,
                        studentIds: studentIds,
                         breakfask:this.dietSettingData.stuBreakfast === 1 ? (this.stuBreakfast ? 1 : 0) : 0,
                        supper:this.dietSettingData.stuSupper === 1 ? (this.stuSupper ? 1 : 0) : 0,
						operateType:1,
                        stuDepartIds:stuDepartIds
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                               if(data.data){
                                    this.newpop=true
                                    this.newdata= data.data.replace(/\n/g, '<br>')
                                }else{
                                    this.$message({
                                                message: '新增停伙成功',
                                                type: 'success',
                                                duration: 1000
                                            });
                                    this.$router.back();
                                }
                            } else {
                                this.$message.error(data.msg);
                            }
                        });
			}},
             addEvent() {  
                 setTimeout(() => {
                     this.$nextTick()
                    if (this.setClick) return
                    document.querySelector('.el-month-table').addEventListener('click', () => {
                        this.monthChange()
                    })
                    document.querySelectorAll("[aria-label='下个月'],[aria-label='上个月'],[aria-label='后一年'],[aria-label='前一年']").forEach(item => item.addEventListener('click', () => {
                        this.monthChange()
                    }))
                    this.setClick = true

            }, 1000)               
                   
                },
                monthChange() {
                    this.getMonthDate(this.$moment(this.$refs['elPicker'].picker.date).format('YYYY-MM-DD'))
                },
            goBack() {
                this.$router.back();
            },
            // 获得每月停伙设置
		   getMonthDate(selectedDate) {
			getMonthDate({
				date:  selectedDate.split('-')[0]+'-'+selectedDate.split('-')[1]+'-01',
				fireType: 2,
				isManage: true,
			})
				.then(res => res.data)
				.then(data => {
					this.settingDateStr = data.data;
                    this.pickerOptions = {
                    disabledDate: (time) => {
                        const date = moment(time.getTime()).format('YYYY-MM-DD');
                        let is=true
                        for(let i=0;i<this.settingDateStr.length;i++){
                            if(date==this.settingDateStr[i]){
                              is=false;
                            }

                        }
                      
                        return is;
                    }
                }
				})
		},
        }
    }
</script>

<style lang="scss" scoped>
    .stopDietForStu {
        padding: 12px;
        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .body {
            overflow: auto;
            padding-top: 20px;
        }
        .flow_add_box {
            width: 810px;
            margin: 0 auto;
            overflow:hidden;
        }
        .el-date-editor.el-input{
            width: 100%;
        }
        .red {
  color: red;
  margin-right: 15px;
}
    }
    
</style>
<style>
    .el-date-table td.disabled div span{
            background: url(https://cdnfile-10043692.file.myqcloud.com/mobile/images/stopDIet/disable-date.png) no-repeat 50%/cover;
    }
    .el-date-table td.disabled div{
        background: #fff
    }
</style>

