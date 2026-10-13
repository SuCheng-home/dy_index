<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title"><i class="fas fa-th"></i> 常用入口</div>
    </div>
    <div class="card-body">
      <div class="app-grid">
        <div v-for="entry in apps" :key="entry.entry" class="app-item" @click="linkfun(entry)" v-if="isShowByPermission(entry.permission)||!entry.permission">
          <img class="app-icon" :src="entry.iconPath" alt=""/>
          <div class="app-name">{{entry.text}}</div>
        </div>
      </div>
    </div>

    
    <el-dialog title="提示" :visible.sync="isShowExternalDialog" width="360px">
        <div>
            <div>是否进入【{{ externalModuleItemname }}】</div>
            <div class="comment-btn-container">
                <el-button type="primary" size="small" plain @click="isShowExternalDialog = false">取消</el-button>
                <span @click="isShowExternalDialog = false">
        <a :href="externalUrl" target="_blank">
          <el-button type="primary" size="small">确定</el-button>
        </a>
      </span>
            </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTeacherDevelopSignKey,
  listIntegrateModule,
  gotoIntegrateModule,
  getCovidAbcfyLoginaccess
} from '@/api/homePage/main/normalEntry/index'
import Cookies from 'js-cookie'
import {mapGetters} from 'vuex';
import {possessRole} from '@/api/common/common'
import {isShowByPermission, isShowByPermissionList} from '@/utils'
export default {
  name: 'AppList',
  data() {
    let prefix = global.command === 'production' ? 'https://www.zhxiaoyuan.cn' : 'http://www.weixiaojia.net'  
    let jiaoShiFaZhan = global.command === 'production' ? 'http://teacher.weixiaojia.cn/wxcepTeacher' : 'http://teacher.weixiaojia.net/wxcepTeacher'  
    const schoolInfo = this.$store.getters.schoolInfo
    return {
      // 常用应用
      apps: [           
        {
            text: '请假',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/qing-jia.svg',
            link: `/main/schoolManage/attenAccounting/teacherLeave4/createLeave?token=${Cookies.get('Admin-Token')}`,
            permission: '/thAskLeaveFour/getThAskListByTh',
            type:1
        },
        {
            text: '物品领用',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/wu-pin-ling-yong.svg',
            link: ``,
            permission: '',
            type:1
        },
        {
            text: '资源预约',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/zi-yuan-yu-yue.svg',
            link: `/main/generalLogistics/resourceOrder/resourceOrderAdd?token=${Cookies.get('Admin-Token')}`,
            permission: '/resource/orderResource',
            type:1
        },
        {
            text: '印制申请',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/yin-zhi-shen-qing.svg',
            link: `/main/schoolManage/printApplication/printApplyAddEdit?kind=file&token=${Cookies.get('Admin-Token')}`,
            permission: '/printSeniorApply/toApplyListPage',
            type:1
        },
        {
            text: '工作计划（个人）',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/gong-zuo-ji-hua-ge-ren.svg',
            link: `/main/schoolManage/newWorkPlan/newWorkPlanindexthree?token=${Cookies.get('Admin-Token')}`,
            permission: '/growthWorkPlan/workPlanNotice',
            type:1
        },
        {
            text: '教师发展',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/jiao-shi-fa-zhan.svg',
            link: `${jiaoShiFaZhan}/login/singleSignOn`,
            permission: '/teacherDevelop/wxcepTeacher',
            type:2,
            needSignKey: true
        },
        // {
        //     text: '网盘',
        //     iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/wang-pan.svg',
        //     link: '',
        //     permission: '',
        //     type:1
        // },
        {
            text: '工作计划（部门）',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/gong-zuo-ji-hua-bu-men.svg',
            link: `/main/schoolManage/newWorkPlan/newWorkPlanindextwo?token=${Cookies.get('Admin-Token')}`,
            permission: '/growthWorkPlan/workPlanNotice',
            type:1
        },
        {
            text: '公文流转',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/gong-wen-liu-zhuan.svg',
            link: `/main/schoolManage/documentFlow/index?token=${Cookies.get('Admin-Token')}`,
            permission: '/documentFlow/getDocumentFlowList',
            type:1
        },
        {
            text: '全校总表',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/quan-xiao-zong-biao.svg',
            link: `/main/teachingStudy/classScheduleCard/allclassScheduleCard?token=${Cookies.get('Admin-Token')}`,
            permission: '/classSchedule/allClassSchedule',
            type:1
        },
        {
            text: '宿舍检查',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/su-she-jian-cha.svg',
            link: `/main/generalLogistics/dormitory/statisticByWeekOrMonth?token=${Cookies.get('Admin-Token')}`,
            permission: '/dormManage/dormManageModules',
            type:1
        },
        {
            text: '报修处理',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/bao-xiu-chu-li.svg',
            link: `/main/generalLogistics/repairManage/repairIndex?token=${Cookies.get('Admin-Token')}`,
            permission: '/repair/repairList',
            type:1
        },
        {
            text: '资源审核',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/zi-yuan-shen-he.svg',
            link: `/main/generalLogistics/resourceOrder/resourceExamineIndex?token=${Cookies.get('Admin-Token')}`,
            permission: 'resource/resourceExamineList',
            type:1
        },
        {
            text: '校务日志',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/xiao-wu-ri-zhi.svg',
            link: `/main/schoolManage/schoolLog/schoolLogindex?token=${Cookies.get('Admin-Token')}`,
            permission: '/schoolLog/getSchoolLogList',
            type:1
        },
        {
            text: '文明班级评比',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/wen-ming-ban-ji-ping-bi.svg',
            link: `/main/schoolManage/compositeExam/dateAccountIndex?token=${Cookies.get('Admin-Token')}`,
            permission: '/composite/toCountPage',
            type:1
        },
        {
            text: '校园巡查',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/xiao-yuan-xun-cha.svg',
            link: `/main/schoolManage/compositeExamTwo/compositeExamTwoIndex?token=${Cookies.get('Admin-Token')}`,
            permission: '/complexRecord/goComplexRecordStatisticsPage',
            type:1
        },
        {
            text: '建议箱',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/jian-yi-xiang.svg',
            link: `/main/schoolManage/advice/newlist?token=${Cookies.get('Admin-Token')}`,
            permission: '/advice/getAdviceListBatch',
            type:1
        },
        {
            text: '数据看板',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/shu-ju-kan-ban.svg',
            link: `${prefix}/classcardManagement/#/main/homepage?token=${Cookies.get('Admin-Token')}`,
            permission: '/classcardManage/toIndexPage',
            type:2
        },
        {
            text: '请假审批',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/danyangHome/qing-jia-shen-pi.svg',
            link: '',
            permission: '',
            type:1
        },
      ],
      externalUrl: '',
      isShowExternalDialog: false,
      externalModuleItemname: ''
    }
  },
  computed: {
    ...mapGetters(['permissionNameMapping']),
    //针对 江苏特需平台老师，班主任身份进行的权限判断
    specialPermission() {
        return function (val) {
            if (val) {
                possessRole(val).then(res => {
                    return res.data.data.result
                })
            } else {
                return false
            }
        }
    }
  },
  mounted() {
    this.getTeacherDevelopSignKey()
    this.listIntegrateModule()
  },
  methods: {
    isShowByPermissionList,
    isShowByPermission,
    jumpToPage(path, query = {}) {
        this.$router.push({
            path,
            query
        })
    },
    linkfun(entry) {
      if (entry.type==2) {
        window.open(entry.link)
      } else if (entry.type==1) {
        this.jumpToPage(entry.link)
      } else {
          if (entry.text === '智慧防疫') {
                        getCovidAbcfyLoginaccess().then(({data}) => {
                            if (data.code === 200) {
                                this.externalModuleItemname = entry.text
                                this.externalUrl = data.data.redirect
                                this.isShowExternalDialog = true
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'warning'
                                })
                            }
                        })
                        return
                    }
                    this.externalModuleItemname = entry.text
                    gotoIntegrateModule({id:entry.encryptModuleId, sourceType: 1})
                        .then(res => {
                            let data = res.data
                            // window.open(data.data, '_blank');
                            this.isShowExternalDialog = true
                            this.externalUrl = data.data
                        })
                        .then(data => {
                            return data
                        })
      }
    },
    getTeacherDevelopSignKey() {
        getTeacherDevelopSignKey()
            .then(res => {
                let _res = res.data
                if (_res.code != 200) return Promise.reject(_res.msg)
                else return _res.data
            })
            .then(data => {
                let needSignKey = this.apps.find(item => item.needSignKey)
                needSignKey.link += `?signKey=${data}`
            })
            .catch(msg => {
                this.$message({
                    message: msg,
                    type: 'error'
                })
            })
    },
    listIntegrateModule() {
        listIntegrateModule()
            .then(res => {
                let _res = res.data
                if (_res.code != 200) return Promise.reject(_res.msg)
                else return _res.data
            })
            .then(data => {
                if (Array.isArray(data)) {
                    let temp = data.map(item => this.gotoIntegrateModule(item.encryptModuleId))
                    let p = Promise.all(temp)
                        .then(res => {
                            data.forEach((item, idx) => {
                                this.apps.push({
                                    text: item.moduleOtherName || item.moduleName,
                                    iconPath: item.moduleLogo,
                                    link: false,
                                    encryptModuleId: data[idx].encryptModuleId,
                                    type:3
                                })
                            })
                        })
                        .catch(e => e)
                }
            })
            .catch(msg => {
                this.$message({
                    message: msg,
                    type: 'error'
                })
            })
    },
    gotoIntegrateModule(id) {
        return gotoIntegrateModule({
            id,
            sourceType: 1
        })
            .then(res => {
                let _res = res.data
                if (_res.code != 200) return Promise.reject(_res.msg)
                else return _res.data
            })
            .then(data => {
                return data
            })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding: 10px 0;
  max-height: 350px;
  overflow-y: auto;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  padding: 16px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.app-item:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.app-icon {
  width: 48px;
  height: 48px;
  // border-radius: 12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 24px;
  color: #fff;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.app-name {
  font-size: 13px;
  color: var(--text-sec);
  line-height: 1.2;
}

.comment-btn-container {
    padding-top: 20px;
    text-align: right;
}
</style>
