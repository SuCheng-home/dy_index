<template>
    <div class="stopDietForStu">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
             <el-button class="filter-item" type="primary" @click="submit()" size="medium">保存</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="flow_add_box">  
                  <el-form label-width="100px" class="demo-ruleForm">
                    <el-form-item label="停伙老师">
                        <address-book v-model="addressData" :config="configData" ></address-book>
                    </el-form-item>
                    <el-form-item label="停伙餐次">
                         <el-checkbox v-model="breakfast" v-if="dietSettingData.breakfast === 1">早餐停伙</el-checkbox>
                         <el-checkbox v-model="lunch" v-if="dietSettingData.teacherLunch === 1">午餐停伙</el-checkbox>
                         <el-checkbox v-model="supper" v-if="dietSettingData.supper === 1">晚餐停伙</el-checkbox>
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
                        breakfast:0,
                        breakMeal:0,
                        lunch:0,
                        supper:0
                    },
                    breakMeal: false,
                    lunch: false,
                    supper: false,
                    breakfast: false,
                    settingDateStr:[],
                    configData: {
                            title: '请选择停伙老师',
                            depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true},
                            // SingleChose: true
                        },
                    addressData: {
                            userJson: []
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
                        fireDate:""
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
			 let  studentIds =""
                for(let i=0;i<this.addressData.userJson.length;i++){
                     if(i<this.addressData.userJson.length-1){
                         studentIds+=this.addressData.userJson[i].id+",";
                     }else{
                         studentIds+=this.addressData.userJson[i].id;
                     }
                }
                if(this.addressData.userJson.length == 0) {
                     this.$message.error('请选择老师');
                    return
                } 
                 if(!this.lunch&& !this.breakfast&& !this.supper) {
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
					breakMeal:  0,
					dateStr: dateStr.join(","),
					fireType: 1,
					lunch: this.lunch ? 1 : 0,
					remark: this.remark,
					teacherIds: studentIds,
					breakfask: this.dietSettingData.breakfast === 1 ? (this.breakfast ? 1 : 0) : 0,
					supper: this.dietSettingData.supper === 1 ? (this.supper ? 1 : 0) : 0,
					operateType:1
				})
					.then(res => res.data)
					.then(data => {
						if (data.result) {
                             this.$message({
                                            message: '新增停伙成功',
                                            type: 'success',
                                            duration: 1000
                                        });
                             this.$router.back();
							
						} else {
							this.$message.error(data.msg);
						}
					})
			}else{
				 oneKeyFire({
                        breakMeal:  0,
                        fireDate: this.$moment(this.fireDate).format('YYYY-MM-DD'),
                        fireType: 1,
                        lunch: this.lunch ? 1 : 0,
                        remark: this.remark,
                        teacherIds: studentIds,
                        breakfask:this.dietSettingData.breakfast === 1 ? (this.breakfast ? 1 : 0) : 0,
                        supper:this.dietSettingData.supper === 1 ? (this.supper ? 1 : 0) : 0,
						operateType:1
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                               this.$message({
                                            message: '新增停伙成功',
                                            type: 'success',
                                            duration: 1000
                                        });
                                 this.$router.back();
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
				fireType: 1,
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

