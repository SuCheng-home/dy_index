<template>
   <div class="evaluate-parents-detail">
      <div class="el-row menu-tools">
         <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
         <el-button type="primary" size="medium" @click="printEvent">打印</el-button>
         <el-button type="primary" size="medium" @click="banzhurenEvent">班主任评价</el-button>

      </div>
      <!-- 顶部标题栏 -->
      <div class="printContent" ref="myPrintContent">
         <div class="header">
            <img src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/homeSchool/jiazhangpingjia.png"
               alt="">
         </div>
         <div class="content">
            <!-- 学生信息和综合评价 -->
            <el-row :gutter="20" class="modules">
               <!-- 学生信息 -->
               <el-col :span="12">
                  <el-card class="module-card ">
                     <div slot="header" class="card-header">
                        <span>学生信息</span>
                     </div>
                     <div class="student-info">
                        <el-avatar :size="60" :src="$route.query.avatar" class="student-avatar"></el-avatar>
                        <div class="student-details">
                           <div class="student-name">
                              <h3>{{ $route.query.studentName }}</h3>
                              <p>班级: {{ $route.query.className }}</p>
                              <p>学号: {{ $route.query.studentNo }}</p>
                           </div>
                           <div class="score-info">
                              <div class="score-item" v-for="item in staticList" :key="item.userId">
                                 <span>{{ item.nick }}参与度占比：</span>
                                 <span class="highlight">{{ item.numCount.toFixed(2) }}%</span>
                              </div>

                           </div>
                        </div>
                     </div>
                  </el-card>
               </el-col>

               <!-- 综合评价 -->
               <el-col :span="12">
                  <el-card class="module-card  ">
                     <div slot="header" class="card-header">
                        <span>综合评价</span>
                        <el-rate v-model="behLevelList" :colors="colors" disabled>
                        </el-rate>
                     </div>
                     <div class="radar-chart">
                        <div id="radarChart" style="width: 100%; height: 300px;"></div>
                     </div>
                  </el-card>
               </el-col>
            </el-row>
            <!-- 各个模块 -->
            <div class="modules">
               <!-- 心育之窗 -->
               <el-card class="module-card">
                  <div slot="header" class="card-header">
                     <span>心育之窗</span>
                     <span class="section-score">积分 {{ heartEducationListPoints + heartFeedbackListPoints }} ({{
                        heartEducationListPoints }}+{{ heartFeedbackListPoints
                        }})</span>
                  </div>
                  <table border="1" style="width: 100%; border-collapse: collapse;">
                     <thead>
                        <tr style="background-color: #f5f7fa;">
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">主题</th>
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">时间</th>
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">是否学习</th>
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">学习家长人数</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in heartEducationList" :key="item.id">
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.title }}</td>
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.sendTime }}</td>
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.isRead === 1 ? '否' : '是' }}</td>
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.readCount }}</td>
                        </tr>
                     </tbody>
                  </table>
               </el-card>

               <!-- 心育投稿 -->
               <el-card class="module-card">
                  <div slot="header" class="card-header">
                     <span>心育投稿</span>
                  </div>
                  <table border="1" style="width: 100%; border-collapse: collapse;">
                     <thead>
                        <tr style="background-color: #f5f7fa;">
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">主题</th>
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">时间</th>
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">是否采用</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in heartFeedbackList" :key="item.id">
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.title }}</td>
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.createTime }}</td>
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.state === 1 ? '未采用' : '已采用' }}
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </el-card>

               <!-- 科中育坛 -->
               <el-card class="module-card">
                  <div slot="header" class="card-header">
                     <span>科中育坛</span>
                     <span class="section-score">积分 {{ researchListPoints }}</span>
                  </div>
                  <table border="1" style="width: 100%; border-collapse: collapse;">
                     <thead>
                        <tr style="background-color: #f5f7fa;">
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">主题</th>
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">时间</th>
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">是否参与</th>
                           <th style="padding: 8px; text-align: left; border: 1px solid #ebeef5;">参与家长数</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in researchList" :key="item.id">
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.theme }}</td>
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.sendDate }}</td>
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.signCount > 0 ? '是' : '否' }}
                           </td>
                           <td style="padding: 8px; border: 1px solid #ebeef5;">{{ item.signCount }}</td>
                        </tr>
                     </tbody>
                  </table>
               </el-card>

               <!-- 家长会 -->
               <el-card class="module-card">
                  <div slot="header" class="card-header">
                     <span>家长会</span>
                     <span class="section-score">积分 {{ parentMeetingListPoints }}</span>
                  </div>
                  <table class="native-table" style="width: 100%; border-collapse: collapse;">
                     <thead>
                        <tr>
                           <th style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;">主题</th>
                           <th style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;">时间</th>
                           <th style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;">是否参与</th>
                           <th style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;">参与家长数</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in parentMeetingList" :key="item.id">
                           <td style="border: 1px solid #dcdfe6; padding: 12px;">{{ item.theme }}</td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px;">{{ item.sendDate }}</td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px;">{{ item.signCount > 0 ? '是' : '否' }}
                           </td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px;">{{ item.signCount }}</td>
                        </tr>
                        <tr v-if="parentMeetingList.length === 0">
                           <td colspan="4" style="border: 1px solid #dcdfe6; padding: 12px; color: #909399;">暂无数据</td>
                        </tr>
                     </tbody>
                  </table>
               </el-card>

               <!-- 志愿服务 -->
               <el-card class="module-card">
                  <div slot="header" class="card-header">
                     <span>志愿服务</span>
                     <span class="section-score">积分 {{ (volunteerServiceList.length * 10) +
                        (volunteerGuidanceList.length *
                           10) }}
                        ({{ volunteerServiceList.length * 10 }}+{{
                           volunteerGuidanceList.length * 10 }})</span>
                  </div>
                  <table class="native-table" style="width: 100%; border-collapse: collapse;">
                     <thead>
                        <tr>
                           <th style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;width: 200px;">主题</th>
                           <th style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;width: 180px;">时间</th>
                           <th style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;">内容</th>
                           <th
                              style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa; width: 125px;">
                              图片</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in volunteerServiceList" :key="item.id">
                           <td style="border: 1px solid #dcdfe6; padding: 12px; ">{{ item.title }}</td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px; ">{{ item.createTime }}</td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px; ">{{ item.content }}</td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px; ">
                              <button type="text" v-if="item.fileJson == '[]'" disabled
                                 style="background: none; border: none; color: #c0c4cc; cursor: not-allowed;">点击查看</button>
                              <image-previewer class="image-plate" :images="formatImageList(item.fileJson)" tag="img"
                                 text="点击查看" v-else>
                              </image-previewer>
                           </td>
                        </tr>
                        <tr v-if="volunteerServiceList.length === 0">
                           <td colspan="4"
                              style="border: 1px solid #dcdfe6; padding: 12px; text-align: center; color: #909399;">暂无数据
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </el-card>

               <!-- 志愿推荐 -->
               <el-card class="module-card">
                  <div slot="header" class="card-header">
                     <span>志愿推荐</span>
                  </div>
                  <table class="native-table" style="width: 100%; border-collapse: collapse;">
                     <thead>
                        <tr>
                           <th
                              style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;width: 200px; ">
                              主题</th>
                           <th
                              style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa; width: 180px;">
                              时间</th>
                           <th style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa; ">内容</th>
                           <th
                              style="border: 1px solid #dcdfe6; padding: 12px; background-color: #f5f7fa;  width: 125px;">
                              图片</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="item in volunteerGuidanceList" :key="item.id">
                           <td style="border: 1px solid #dcdfe6; padding: 12px; ">{{ item.title }}</td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px; ">{{ item.createTime }}</td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px; ">{{ item.content }}</td>
                           <td style="border: 1px solid #dcdfe6; padding: 12px; ">
                              <button type="text" v-if="item.fileJson == '[]'" disabled
                                 style="background: none; border: none; color: #c0c4cc; cursor: not-allowed;">点击查看</button>
                              <image-previewer class="image-plate" :images="formatImageList(item.fileJson)" tag="img"
                                 text="点击查看" v-else>
                              </image-previewer>
                           </td>
                        </tr>
                        <tr v-if="volunteerGuidanceList.length === 0">
                           <td colspan="4"
                              style="border: 1px solid #dcdfe6; padding: 12px; text-align: center; color: #909399;">暂无数据
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </el-card>
            </div>
         </div>
      </div>


      <el-dialog title="班主任评价" :visible.sync="dialogVisible" width="25%" :before-close="handleClose">
         <div style="display: flex;justify-content: center">
            <el-rate v-model="behLevel" :colors="colors">
            </el-rate>
         </div>

         <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEvaluate">确 定</el-button>
         </span>
      </el-dialog>

   </div>
</template>

<script>
import echarts from 'echarts'
import {
   addHeartBeh, updateHeartBeh,
   getHeartBeh, getHeartBehNickList, getHeartBehStatic, getHearEduNoticeListByStuId, getHearJzhListByStuId, getHearEduNoticeDarkListByStuId, getHeartVolunteerListByStuId, getHeartVolunteerDarkListByStuId, getHearKzListByStuId
} from "@/api/homeSchool/mentalEducation/volunteer/index";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';

export default {
   name: "evaluateParentsDetail",
   components: {
      ImagePreviewer
   },
   data() {
      return {
         jiazhangList: [],
         // 心育之窗数据
         heartEducationList: [
         ],
         // 心育反馈数据
         heartFeedbackList: [
         ],
         // 科研印记数据
         researchList: [
         ],
         // 家长会数据
         parentMeetingList: [
         ],
         // 志愿服务数据
         volunteerServiceList: [
         ],
         // 志愿辅导数据
         volunteerGuidanceList: [
         ],
         staticList: [],
         chartList: [],
         dialogVisible: false,
         behLevel: 0,
         colors: ['#F56C6C', '#E6A23C', '#FFCE54', '#90EE90', '#67C23A'],
         behLevelAddFlag: true
      }
   },
   mounted() {
      this.initializeEvent()

   },
   methods: {
      formatImageList(fileJson) {
         console.log('原始数据:', fileJson)
         try {
            let imageList = []
            // 如果是字符串，先解析为JSON
            if (typeof fileJson === 'string') {
               imageList = JSON.parse(fileJson)
            } else if (Array.isArray(fileJson)) {
               imageList = fileJson
            }
            // 转换为组件需要的格式
            return imageList.map(item => ({
               src: item.photoUrl,
               name: item.fileName
            }))
         } catch (error) {
            console.error('图片格式解析错误:', error)
            return []
         }
      },
      // 打印
      printEvent() {
         this.$print(this.$refs.myPrintContent);
      },
      // 班主任评价事件
      banzhurenEvent() {
         this.dialogVisible = true
         this.behLevel = this.behLevelList
      },
      addEvaluate() {
         // 根据学生id查询评价
         getHeartBeh({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            this.behLevel = res.data.data ? res.data.data.behLevel : 0
            this.behLevelList = res.data.data ? res.data.data.behLevel : 0
            this.behLevelAddFlag = res.data.data ? false : true

            console.log('评价', res.data.data)
         })

      },
      // 提交评价
      submitEvaluate() {
         if (this.behLevel == 0) {
            this.$message({
               message: '请先评价',
               type: 'warning'
            })
            return
         }
         if (this.behLevelAddFlag) {
            addHeartBeh({
               behContent: '',
               studentId: this.$route.query.studentId,
               schoolTimeId: this.$route.query.schoolTimeId,
               behLevel: this.behLevel
            }).then(res => {
               this.$message({
                  message: '评价成功',
                  type: 'success'
               })
               this.dialogVisible = false
               this.behLevelAddFlag = false
               this.addEvaluate()
            })
         } else {
            updateHeartBeh({
               behContent: '',
               studentId: this.$route.query.studentId,
               schoolTimeId: this.$route.query.schoolTimeId,
               behLevel: this.behLevel
            }).then(res => {
               this.$message({
                  message: '评价成功',
                  type: 'success'
               })
               this.dialogVisible = false
               this.addEvaluate()
            })
         }

      },
      zyDetail(row) {
         this.$router.push({
            path: '/main/homeSchool/mentalEducation/volunteer/volunteerListDetail',
            query: {
               volunteerId: row.id
            }
         })
      },

      async initializeEvent() {
         // 根据学生id查询评价
         await getHeartBeh({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            this.behLevel = res.data.data ? res.data.data.behLevel : 0
            this.behLevelList = res.data.data ? res.data.data.behLevel : 0
            this.behLevelAddFlag = res.data.data ? false : true
            console.log('评价', res.data.data)
         })
         await getHeartBehNickList({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            let numCount = res.data.data.reduce((pre, cur) => pre + cur.totalCount, 0)
            this.staticList = res.data.data.map(item => ({
               ...item,
               numCount: numCount > 0 ? (item.totalCount / numCount * 100) : 0
            }))
         })

         // 根据学生id查询心育科谱
         await getHearEduNoticeListByStuId({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            this.heartEducationList = res.data.data
            this.heartEducationListPoints = this.getScorePoints(this.heartEducationList, 25, 100)
            console.log('心育科谱', this.heartEducationList, this.heartEducationListPoints)
         })
         // 根据学生id查询家长会
         await getHearJzhListByStuId({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            this.parentMeetingList = res.data.data
            this.parentMeetingListPoints = this.kzytjzhPoints(this.parentMeetingList)
            console.log('家长会', this.parentMeetingList)
         })
         // 根根据学生id查询心育科谱投稿
         await getHearEduNoticeDarkListByStuId({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            this.heartFeedbackList = res.data.data
            this.heartFeedbackListPoints = this.getScorePointsTwo(this.heartFeedbackList, 10, 20)
            console.log('心育科谱投稿', this.heartFeedbackList, this.heartFeedbackListPoints)
         })
         // 根据学生id查询志愿服务
         await getHeartVolunteerListByStuId({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            this.volunteerServiceList = res.data.data
            console.log('志愿服务', this.volunteerServiceList)
         })
         // 根据学生id查询志愿服务推荐
         await getHeartVolunteerDarkListByStuId({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            this.volunteerGuidanceList = res.data.data
            console.log('志愿服务推荐', this.volunteerGuidanceList)
         })
         // 根据学生id查询科中育坛
         await getHearKzListByStuId({
            schoolTimeId: this.$route.query.schoolTimeId,
            studentId: this.$route.query.studentId
         }).then(res => {
            this.researchList = res.data.data
            this.researchListPoints = this.kzytjzhPoints(this.researchList)
            console.log('科中育坛', this.researchList, this.researchListPoints)
         })
         this.chartList = [this.heartEducationListPoints, this.researchListPoints, this.parentMeetingListPoints, this.volunteerServiceList.length * 10, this.heartFeedbackListPoints + this.volunteerGuidanceList.length *
            10],
            this.initRadarChart()

      },
      kzytjzhPoints(arr) {
         let totalCount = arr.length
         if (totalCount === 0) {
            return 0
         }
         let signCount = arr.filter(item => item.signCount > 0).length
         return Math.floor(signCount / totalCount * 100)
      },
      initRadarChart() {
         const chart = echarts.init(document.getElementById('radarChart'))

         // 雷达图各个维度的最大值
         const maxValues = [100, 100, 100, 100, 50]

         // 限制数值不超过最大值
         const limitedChartList = this.chartList.map((value, index) => {
            return Math.min(value, maxValues[index])
         })
         const option = {
            backgroundColor: 'transparent',
            tooltip: {
               trigger: 'item',
               formatter: function (params) {
                  // 获取各个维度的名称和对应的值
                  const indicators = [
                     { name: '心育之窗', value: limitedChartList[0], max: 100 },
                     { name: '科中育坛', value: limitedChartList[1], max: 100 },
                     { name: '家长会', value: limitedChartList[2], max: 100 },
                     { name: '志愿服务', value: limitedChartList[3], max: 100 },
                     { name: '特别贡献', value: limitedChartList[4], max: 50 }
                  ]

                  let result = '<div style="padding: 8px; font-size: 12px;">'
                  result += '<div style="margin-bottom: 8px; font-weight: bold; color: #409EFF;">综合评价详情</div>'

                  indicators.forEach(item => {
                     const percentage = ((item.value / item.max) * 100).toFixed(1)
                     result += `<div style="margin: 4px 0;">
                        <span style="display: inline-block; width: 70px; color: #666;">${item.name}:</span>
                        <span style="color: #333; font-weight: bold;">${item.value}分</span>
                        <span style="color: #409EFF; margin-left: 8px;">(${percentage}%)</span>
                     </div>`
                  })

                  result += '</div>'
                  return result
               },
               backgroundColor: '#fff',
               borderColor: '#e6e6e6',
               borderWidth: 1,
               textStyle: {
                  color: '#333'
               }
            },
            radar: {
               indicator: [
                  { name: '心育之窗', max: 100 },
                  { name: '科中育坛', max: 100 },
                  { name: '家长会', max: 100 },
                  { name: '志愿服务', max: 100 },
                  { name: '特别贡献', max: 50 },
               ],
               shape: 'polygon',
               splitNumber: 4,
               radius: '70%',
               center: ['50%', '50%'],
               axisName: {
                  color: '#333',
                  fontSize: 13,
                  fontWeight: 'normal',
                  padding: [1, 2, 1, 3]
               },
               splitLine: {
                  lineStyle: {
                     color: '#e6e6e6',
                     width: 1
                  }
               },
               splitArea: {
                  show: true,
                  areaStyle: {
                     color: ['rgba(255, 255, 255, 0.5)', 'rgba(245, 247, 250, 0.8)']
                  }
               },
               axisLine: {
                  lineStyle: {
                     color: '#ccc',
                     width: 1
                  }
               }
            },
            series: [{
               name: '综合评价',
               type: 'radar',
               data: [{
                  value: limitedChartList,
                  name: '得分',
                  areaStyle: {
                     color: 'rgba(64, 158, 255, 0.2)'
                  },
                  lineStyle: {
                     color: '#409EFF',
                     width: 2,
                     type: 'solid'
                  },
                  itemStyle: {
                     color: '#409EFF',
                     borderWidth: 0,
                     borderColor: 'transparent'
                  },
                  symbolSize: 6,
                  symbol: 'circle'
               }]
            }]
         }
         console.log("option", option);

         chart.setOption(option)
         // 监听窗口大小变化，调整图表
         window.addEventListener('resize', () => {
            chart.resize()
         })
      },

      getScorePoints(arr, num, max) {
         if (!arr || arr.length == 0) {
            return 0
         }
         let points = 0
         arr.forEach(item => {
            if (item.isRead == 2) {
               points += num
            }
         })
         return points > max ? max : points
      },
      getScorePointsTwo(arr, num, max) {
         if (!arr || arr.length == 0) {
            return 0
         }
         let points = 0
         arr.forEach(item => {
            if (item.state == 2) {
               points += num
            }
         })
         return points > max ? max : points
      }
   }
}
</script>

<style lang="scss" scoped>
.evaluate-parents-detail {
   padding: 12px;

   .header {
      img {
         width: 100%;
         height: 280px;
      }
   }
}

.student-info {
   display: flex;
   align-items: flex-start;
   padding: 0px;
   min-height: 320px;
   .student-avatar {
      margin-right: 10px;
   }

   .student-details {
      flex: 1;

      .student-name {
         display: flex;
         align-items: flex-end;
         color: #165478;

         h3 {
            font-size: 20px;
            margin-bottom: 0;
            display: inline-block;
            margin-right: 15px;
            vertical-align: middle;
         }

         p {
            display: inline-block;
            margin-bottom: 0;
            font-size: 14px;
            margin-right: 10px;
            vertical-align: middle;
         }
      }



      .score-info {
         margin-top: 15px;

         .score-item {
            margin-bottom: 10px;

            .highlight {
               color: #67c23a;
               font-weight: bold;
            }
         }
      }
   }
}

/* 雷达图容器样式 */
.radar-chart {
   padding: 10px;
   text-align: center;
   display: flex;
   justify-content: center;
   align-items: center;
   min-height: 300px;

   #radarChart {
      width: 100% !important;
      max-width: 450px;
      height: 300px !important;
      margin: 0 auto;
   }
}

.modules {
   .module-card {
      margin-bottom: 20px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      overflow: hidden;


      .card-header {
         background-color: #f5f7fa;
         border-left: 4px solid #409eff;
         padding: 12px 15px;
         display: flex;
         justify-content: space-between;
         align-items: center;
         font-weight: bold;
         font-size: 16px;

         .section-score {
            font-weight: bold;
            color: #e6a23c;
            font-size: 18px;
         }
      }



      .el-card__body {
         padding: 0;
      }
   }
}

.content {
   padding: 20px;
}

.menu-tools {
   border-bottom: 1px solid #e7eaec;
   padding-bottom: 10px;
   position: relative;

   .HTitle {
      display: block;
      position: absolute;
      left: 50%;
      width: 100px;
      height: 24px;
      font-weight: bold;
      font-size: 18px;
      margin-left: -25px;
      margin-top: -12px;
      top: 50%;
   }
}

:deep(.el-rate__icon) {
   font-size: 28px !important;
}

/* 原生表格样式 */
.native-table {
   width: 100%;
   border-collapse: collapse;
   margin-bottom: 0;

   th {
      font-weight: bold;
      color: #303133;
      border: 1px solid #dcdfe6;
      padding: 12px;
      background-color: #f5f7fa;

   }

   td {
      vertical-align: top;
      color: #606266;
      border: 1px solid #dcdfe6;
      padding: 12px;

   }

   tbody tr:hover {
      background-color: #f5f7fa;
   }
}

/* 打印样式优化 */
@media print {

   /* 雷达图打印优化 */
   .radar-chart {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      min-height: 300px !important;
      page-break-inside: avoid;

      #radarChart {
         width: 100% !important;
         max-width: 480px !important;
         height: 310px !important;
         margin: 0 auto !important;
         display: block !important;
      }

      canvas,
      img {
         max-width: 100% !important;
         height: auto !important;
         margin: 0 auto !important;
         display: block !important;
      }
   }

   /* 隐藏所有表格中的图片列（第4列） */
   table.native-table th:nth-child(4),
   table.native-table td:nth-child(4) {
      display: none !important;
   }

   /* 调整空数据行的colspan */
   table.native-table tbody tr td[colspan="4"] {
      colspan: 3 !important;
   }

   /* 原生表格打印优化 */
   .native-table {
      th {
         background-color: #f5f7fa !important;
         -webkit-print-color-adjust: exact;
         color-adjust: exact;
      }

      td {
         border: 1px solid #dcdfe6 !important;
      }

      tbody tr:hover {
         background-color: transparent !important;
      }
   }
}

.image-plate {
   color: rgb(64, 158, 255) !important;
   padding: 4px;

   :deep(.previewer-text) {
      display: inline;
   }
}

.printContent {
   width: 1000px;
   margin: 0 auto;
}
</style>