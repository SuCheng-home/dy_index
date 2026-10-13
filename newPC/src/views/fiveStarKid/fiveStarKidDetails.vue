<template>
    <div class="fiveStarKidDetails">
        <!-- 顶部标题栏 -->
        <div class="header">
            <div class="title">
                <div class="title-content">
                    <div>
                        <h1>
                            <i class="el-icon-user"
                                style="color: #2A5CFA;font-weight: bold;margin-right: 0px;font-size: 26px;"></i>
                            彩虹堂娃娃成长平台
                        </h1>
                        <p>全面展示学生的综合素质和发展状况</p>
                    </div>
                </div>
            </div>
            <div class="header-buttons">
                <el-button type="primary" class="print-btn" icon="el-icon-printer" @click="print()">打印报告</el-button>
                <el-button icon="el-icon-top-left" style="font-size: 14px;padding: 8px 16px;"
                    @click="goBack()">返回</el-button>
            </div>
        </div>
        <!-- 主要内容区域 -->
        <div class="content" ref="print" id="print">
            <!-- 左侧区域 -->
            <div class="left-section">
                <!-- 学生基础信息卡片 -->
                <div class="card student-info-card">
                    <div class="card-header blue-header">
                        <i class="el-icon-user"></i>
                        <h3>学生基础信息</h3>
                    </div>
                    <div class="card-body">
                        <div class="student-info" style="display: block;">
                            <div class="top-section">
                                <div class="avatar">
                                    <img :src="studentInfo.avatar" alt="学生头像">
                                </div>
                                <div class="info">
                                    <h2 style="margin-bottom: 15px;">{{ studentInfo.name }}</h2>
                                    <p class="gender-class">
                                        性别: {{ studentInfo.gender == 1 ? '男' : '女' }}
                                        <i class="el-icon-s-home" style="margin-left: 5px;color: #2B5CFB;"></i>{{
                                            studentInfo.className
                                        }}
                                    </p>
                                    <p class="gender-class" style="margin-top: 10px;">
                                        娃娃成长档案：
                                        <span v-if="showArchive">{{ displayArchiveTitle }}</span>
                                        <span v-else>{{ displayMaskedArchiveTitle }}</span>
                                        <img class="eye-icon"
                                            :src="showArchive ? 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/iconLb/biyan.png' : 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/iconLb/zhengyan.png'"
                                            alt="" @click="toggleArchive">
                                    </p>
                                </div>
                                <div class="star-count">
                                    <p>本学期已得星数</p>
                                    <p class="count"><span style="color: #ED4700;font-size: 30px;">{{
                                        schoolConductStarBabyStatic.behStarCount || 0 }}</span> / <span
                                            style="font-weight: 400;font-size: 22px;color: #353C47;">{{
                                                schoolConductStarBabyStatic.starCount || 0 }}</span> ⭐</p>
                                </div>

                            </div>
                            <div class="divider"></div>
                            <div class="contact-section">
                                <p class="contact">
                                    <i class="el-icon-phone" style="color: #2B5CFB;"></i> 家长联系方式：
                                    <span v-if="showPhone">{{ displayPhones }}</span>
                                    <span v-else>{{ displayMaskedPhones }}</span>
                                    <img class="eye-icon"
                                        :src="showPhone ? 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/iconLb/biyan.png' : 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/iconLb/zhengyan.png'"
                                        alt="" @click="togglePhone">
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 五育发展雷达图 -->
                <div class="card radar-card">
                    <div class="card-header purple-header">
                        <i style="color: rgb(42, 92, 250);" class="el-icon-s-data"></i>
                        <h3 style="color: black;">五育发展雷达图</h3>
                    </div>
                    <div class="card-body">
                        <div id="radarChart" class="radar-chart"></div>
                    </div>
                </div>

                <!-- 五育指标达标情况 -->
                <div class="card indicators-card">
                    <div class="card-header zhibiao-header">
                        <i class="el-icon-bangzhu" style="color: #0FA743;font-weight: bold;"></i>
                        <h3 style="color: black;">五育指标达标情况</h3>
                    </div>
                    <div class="card-body">
                        <div v-for="(indicator, index) in indicators" :key="index" class="indicator-section"
                            :style="{ background: getSectionBgColor(index), border: '2px solid ' + getSectionBorderColor(index) }">
                            <div class="section-header">
                                <div class="section-title">
                                    <div class="mybi-icon" :style="{ background: getScoreBgColor(index) }">
                                        <img src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/iconLb/xuesheng.png"
                                            alt="">
                                    </div>
                                    <h4>{{ indicator.typeTitle || '' }}</h4>
                                </div>
                                <span class="section-score"
                                    :style="{ background: getScoreBgColor(index), color: '#fff' }">{{
                                        indicator.behStarCount || 0 }}/{{
                                        indicator.starCount || 0
                                    }}颗星</span>
                            </div>
                            <div v-for="(item, itemIndex) in indicator.dimensioList" :key="itemIndex"
                                class="indicator-item">
                                <div class="item-content">
                                    <div class="item-header">
                                        <span class="item-dot"></span>
                                        <span class="indicator-name">{{ item.dimensionName }}</span>
                                        <span class="indicator-value">{{ item.behStarCount || 0 }}/{{ item.starCount ||
                                            0
                                            }}星</span>
                                    </div>
                                    <el-progress :percentage="(item.behStarCount / item.starCount) * 100"
                                        :format="() => ''" :stroke-width="6"
                                        :status="(item.behStarCount / item.starCount) * 100 >= 100 ? 'success' : ''"
                                        :stroke-linecap="'round'" />
                                    <span class="indicator-tip">{{ item.starCount - item.behStarCount
                                        <= 0 ? '非常棒，已经满分啦' : `距离满分还差 ${item.starCount - item.behStarCount}
                                            星，继续加油！`}}</span>
                                </div>
                            </div>
                            <div class="teacher-comment">
                                <div class="comment-header">
                                    <i class="el-icon-message" style="color: #3b82f6;"></i>
                                    <span>教师评语</span>
                                    <div v-if="!indicator._editingComment">
                                        <button class="edit-btn" @click="startEdit('comment', indicator, index)"><i
                                                class="el-icon-edit"></i> 编辑</button>
                                    </div>
                                    <div v-else style="display: flex;">
                                        <button class="save-btn" @click="saveEdit('comment', indicator, index)"><i
                                                class="el-icon-check"></i> 保存</button>
                                        <button class="cancel-btn" @click="cancelEdit('comment', indicator, index)"><i
                                                class="el-icon-close"></i> 取消</button>
                                    </div>
                                </div>
                                <div v-if="!indicator._editingComment">
                                    <p class="comment-text" v-html="indicator.starBabyBeh && indicator.starBabyBeh.behContent
                                        || '暂无评语'"></p>
                                </div>
                                <div v-else>
                                    <el-input v-model="indicator.starBabyBeh.behContent" type="textarea"
                                        :autosize="{ minRows: 3, maxRows: 6 }" placeholder="请输入教师评语"></el-input>
                                </div>
                            </div>
                            <div class="teacher-suggestion">
                                <div class="suggestion-header">
                                    <i class="el-icon-magic-stick" style="color: #f59e0b;"></i>
                                    <span>教师建议</span>
                                    <div v-if="!indicator._editingSuggestion" style="display: flex;">
                                        <button class="edit-btn" @click="startEdit('suggestion', indicator, index)"><i
                                                class="el-icon-edit"></i> 编辑</button>
                                        <button class="ai-btn" @click="generateAiSuggestion(indicator, index)"
                                            :disabled="indicator._generatingAi">
                                            <i :class="indicator._generatingAi ? 'el-icon-loading' : 'el-icon-cpu'"></i>
                                            {{ indicator._generatingAi ? '生成中...' : 'AI生成' }}
                                        </button>
                                    </div>
                                    <div v-else style="display: flex;">
                                        <button class="save-btn" @click="saveEdit('suggestion', indicator, index)"><i
                                                class="el-icon-check"></i> 保存</button>
                                        <button class="cancel-btn"
                                            @click="cancelEdit('suggestion', indicator, index)"><i
                                                class="el-icon-close"></i> 取消</button>
                                    </div>
                                </div>
                                <div v-if="!indicator._editingSuggestion">
                                    <p class="suggestion-text" v-html="indicator.starBabyBeh &&
                                        indicator.starBabyBeh.adviceContent || '暂无建议'"></p>
                                </div>
                                <div v-else>
                                    <el-input v-model="indicator.starBabyBeh.adviceContent" type="textarea"
                                        :autosize="{ minRows: 3, maxRows: 6 }" placeholder="请输入教师建议"></el-input>
                                </div>
                            </div>
                            <div class="growth-footprints">
                                <div class="footprints-header">
                                    <i class="el-icon-camera" style="color: #8b5cf6;"></i>
                                    <span>成长足迹</span>
                                </div>
                                <div class="footprint-images">
                                    <div class="footprint-scroll">
                                        <image-previewer tag="richtext">
                                            <div v-for="(footprint, index) in indicator.growthFootprints || []"
                                                :key="index" class="footprint-img">
                                                <img :src="footprint.src" :alt="footprint.alt">
                                            </div>
                                        </image-previewer>

                                    </div>
                                    <div v-if="!indicator.growthFootprints || indicator.growthFootprints.length === 0"
                                        class="no-footprints">
                                        <span>暂无成长足迹</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧区域 -->
            <div class="right-section">
                <!-- 得星概览卡片 -->
                <div class="card details-card">
                    <div class="card-header red-header">
                        <i class="el-icon-star-on"></i>
                        <h3>得星概览</h3>
                    </div>
                    <div class="card-body">
                        <div class="star-overview">
                            <div class="overview-item purple-item">
                                <div class="item-icon purple-item">
                                    <img src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/iconLb/xingxing.png"
                                        alt="">
                                </div>
                                <div class="item-info">
                                    <p class="label">评价指标总星数</p>
                                    <p class="value">{{ schoolConductStarBabyStatic.starCount || 0 }} <span
                                            class="star-icon">⭐</span></p>
                                </div>
                                <span class="tag target">目标</span>
                            </div>
                            <div class="overview-item blue-item">
                                <div class="item-icon blue-item">
                                    <img src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/iconLb/zhexian.png"
                                        alt="">
                                </div>
                                <div class="item-info">
                                    <p class="label">上学期得星数</p>
                                    <p class="value">{{ schoolConductStarBabyStatic.behStarCountLastSchTime || 0 }}
                                        <span class="star-icon">⭐</span>
                                    </p>
                                </div>
                                <span class="tag achieved"
                                    v-if="!schoolConductStarBabyStatic.schoolConductStarBabyLastSchTime || schoolConductStarBabyStatic.behStarCountLastSchTime >= schoolConductStarBabyStatic.schoolConductStarBabyLastSchTime.goalNum">已达标</span>
                                <span class="tag in-orange" v-else>未达标</span>
                            </div>
                            <div class="overview-item green-item">
                                <div class="item-icon green-item">
                                    <i class="el-icon-date"></i>
                                </div>
                                <div class="item-info">
                                    <p class="label">本学期已得星数</p>
                                    <p class="value">{{ schoolConductStarBabyStatic.behStarCount || 0 }} <span
                                            class="star-icon">⭐</span></p>
                                </div>
                                <span class="tag achieved"
                                    v-if="schoolConductStarBabyStatic.behStarCount >= $route.query.goalNum">已达标</span>
                                <span class="tag in-progress" v-else>进行中</span>

                            </div>
                        </div>
                    </div>
                </div>
                <!-- 五育得星明细 -->
                <div class="card details-card">
                    <div class="card-header green-header">
                        <i class="el-icon-data-line" style="color: rgb(42, 92, 250);"></i>
                        <h3 style="color: black;">五育得星明细</h3>
                    </div>
                    <div class="card-body" style="padding: 10px;">
                        <div id="barChart" class="bar-chart"></div>
                    </div>
                </div>

                <!-- 星星银行 -->
                <div class="card bank-card">
                    <div class="card-header orange-header">
                        <i class="el-icon-s-flag"></i>
                        <h3>星星银行</h3>
                    </div>
                    <div class="card-body">
                        <div class="bank-total">
                            <p class="total-label">小学阶段累计星</p>
                            <p class="total-value">{{ totalStars }}⭐</p>
                        </div>
                        <div class="bank-yearly">
                            <p class="yearly-label">各年级得星统计</p>
                            <div class="yearly-grid">
                                <div v-for="grade in ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']" :key="grade"
                                    class="year-item"
                                    :class="{ active: grade === '四年级' && studentInfo.className && studentInfo.className.includes('四') }">
                                    <span class="year">{{ grade }}</span>
                                    <span class="year-stars">{{ yearlyStars[grade] || '--' }}{{ yearlyStars[grade] ? '⭐'
                                        : '' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bank-semester">
                            <p class="semester-label">各学期得星统计</p>
                            <div class="semester-list">
                                <div v-for="semester in orderedSemesters" :key="semester" class="semester-item">
                                    <span class="semester">{{ semester }}</span>
                                    <span class="semester-stars">{{ semesterStars[semester] }}⭐</span>
                                </div>
                                <div v-if="Object.keys(semesterStars).length === 0" class="semester-item">
                                    <span class="semester">暂无数据</span>
                                    <span class="semester-stars">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 星星愿望 -->
                <div class="card wish-card">
                    <div class="card-header pink-header">
                        <img src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/iconLb/jiangzhang2.png"
                            alt="" srcset="" style="width: 20px;height: auto;margin-right: 10px;">
                        <h3 style="color: black;">星星愿望</h3>
                    </div>
                    <div class="card-body">
                        <div class="wish-goal">
                            <p class="goal-title">得星目标规划</p>
                            <p class="wish-value">本学年目标: {{ schoolYearGoalNum }}⭐</p>
                        </div>
                        <div class="wish-progress">
                            <div class="progress-item" v-for="(item, index) in schoolYearStars" :key="index">
                                <span class="progress-dot"></span>
                                <span class="progress-label">{{ item.schoolTimeName }}</span>
                                <span class="progress-value">{{ item.conductCount || 0
                                }}⭐</span>
                            </div>

                        </div>
                        <div class="wish-achieved" style="  background: #FCF2F8;">
                            <div class="achieved-labelbox">
                                <div class="achieved-label">已完成</div> <span class="achieved-value">{{
                                    (schoolYearStars || []).reduce((acc, cur) => acc + (cur.conductCount || 0), 0) || 0
                                }}⭐</span>
                            </div>

                            <el-progress
                                :percentage="Math.min(100, ((schoolYearStars || []).reduce((acc, cur) => acc + (cur.conductCount || 0), 0) / (schoolYearGoalNum || 1) * 100))"
                                :color="'#DE0073'" :text-inside="true" :stroke-width="22" :show-text="true"
                                :format="() => `进度:${Math.min(100, ((schoolYearStars || []).reduce((acc, cur) => acc + (cur.conductCount || 0), 0) / (schoolYearGoalNum || 1) * 100)).toFixed(2)}%`"></el-progress>
                        </div>
                    </div>
                </div>

                <!-- 综合达标率 -->
                <div class="card rate-card">
                    <div class="card-header yellow-header">
                        <i class="el-icon-finished" style="color: #9500F9;"></i>
                        <h3 style="color: black;">综合达标率</h3>
                    </div>
                    <div class="card-body">
                        <div class="rate-row">
                            <span class="rate-label">总体达标率</span>
                            <span class="rate-value">{{ ((schoolConductStarBabyStatic.behStarCount || 0) /
                                (schoolConductStarBabyStatic.starCount || 1)
                                *
                                100).toFixed(2) }}%</span>
                        </div>
                        <el-progress
                            :percentage="Math.min(100, ((schoolConductStarBabyStatic.behStarCount || 0) / (schoolConductStarBabyStatic.starCount || 1) * 100))"
                            :text-inside="true" :stroke-width="22" :color="'#67c23a'" :show-text="true"
                            :format="() => `${Math.min(100, ((schoolConductStarBabyStatic.behStarCount || 0) / (schoolConductStarBabyStatic.starCount || 1) * 100)).toFixed(2)}%`"></el-progress>
                        <!-- <p class="rate-tip">需要努力，提升空间大</p> -->
                    </div>
                </div>

                <!-- 最近评价 -->
                <div class="card recent-card">
                    <div class="card-header pingjia-header">
                        <i class="el-icon-collection" style="color: #ED4700;"></i>
                        <h3 style="color: black;">最近评价</h3>
                    </div>
                    <div class="card-body">
                        <div v-for="(item, index) in recentEvaluations" :key="index" class="recent-item">
                            <div class="recent-icon">{{ item.type == 0 ? '+' : '' }}{{ item.stepScore }}</div>
                            <div class="recent-info">
                                <div class="recent-content">{{ item.behTypeName }}</div>
                                <div class="recent-meta">{{ item.behDate }} · {{ item.createUserName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-backtop></el-backtop>
    </div>
</template>

<script>
import echarts from 'echarts'
import html2canvas from 'html2canvas'
import { queryStudent } from '@/api/common/common'
import {
    getStuConductDetailList
} from '@/api/deyu';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
import {
    queryParent,
} from "@/api/homeSchool/mentalEducation/consulting/addressBook";

import {
    getSchoolConductStarBabyStatic, getSchoolConductTypeListByTypeCode, getLevelByGradeId, getSchoolTimeAllList,
    getStuZuJiClassCirclePicPageList, addSchoolConductStarBabyBeh, updateSchoolConductStarBabyBeh, getSchoolYearGalNum, getAiBehContent
} from '@/api/fiveStarKid'
export default {
    components: {
        ImagePreviewer
    },
    data() {
        return {
            xueqilist: [],
            showPhone: false,
            showArchive: false,
            recentEvaluations: [],
            indicators: [],
            studentInfo: {},
            parentList: [],
            schoolConductStarBabyStatic: {},
            yearlyStars: {}, // 各年级得星数
            semesterStars: {}, // 各学期得星数
            totalStars: 0, // 小学阶段累计星数
            editStatus: {}, // 编辑状态管理
            schoolYearGoalNum: 0, // 学年目标星数
            schoolYearStars: [], // 按 schoolYear 筛选的 schoolTimeName 得星数数组
            radarChart: null, // 雷达图实例
            barChart: null // 柱状图实例

        }
    },
    created() {
    },
    async mounted() {
        await this.queryStudent(this.$route.query.studentId);
        await this.getSchoolConductStarBabyStatic();
        await this.getStuConductDetailList();
        await this.fetchSchoolYearGoalNum();
        await this.initRadarChart();
        await this.initBarChart();
    },
    computed: {
        // 按顺序排列的学期列表，只显示有数据的学期
        orderedSemesters() {
            const semesters = [];
            const year = ['零', '一', '二', '三', '四', '五', '六']
            for (let grade = 1; grade <= 6; grade++) {
                const gradeName = `${year[grade]}年级`;
                const firstSemester = `${gradeName}上学期`;
                const secondSemester = `${gradeName}下学期`;
                if (this.semesterStars[firstSemester]) {
                    semesters.push(firstSemester);
                }
                if (this.semesterStars[secondSemester]) {
                    semesters.push(secondSemester);
                }
            }
            return semesters;
        },
        // 显示所有家长手机号（明文）
        displayPhones() {
            if (!this.parentList || this.parentList.length === 0) return '';
            return this.parentList.map(parent => parent.mobile).filter(Boolean).join('，');
        },
        // 显示所有家长手机号（加密中间四位）
        displayMaskedPhones() {
            if (!this.parentList || this.parentList.length === 0) return '';
            return this.parentList.map(parent => {
                if (!parent.mobile) return '';
                return parent.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            }).filter(Boolean).join('，');
        },
        displayArchiveTitle() {
            const schoolConductStarBaby = this.schoolConductStarBabyStatic && this.schoolConductStarBabyStatic.schoolConductStarBaby;
            return (schoolConductStarBaby && schoolConductStarBaby.sbanTypeTitle) || '';
        },
        displayMaskedArchiveTitle() {
            const archiveTitle = this.displayArchiveTitle;
            if (!archiveTitle) return '';
            if (archiveTitle.length > 10) {
                return '*'.repeat(10) + '...';
            }
            return '*'.repeat(archiveTitle.length);
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        async getStuConductDetailList() {
            const { data } = await getStuConductDetailList({
                dimensionId: 0,
                pageNo: 1,
                pageSize: 10,
                studentId: this.$route.query.studentId,
                schoolTimeId: this.$route.query.schoolTimeId,
                type: -1
            })
            if (data && data.data && data.data.dataList) {
                this.recentEvaluations = data.data.dataList;
            }
        },
        async queryStudent(id) {
            const { data } = await queryStudent({ idsStr: id })
            const { data: data2 } = await queryParent({ childId: id })
            this.studentInfo = data.data[0] || {};
            this.parentList = data2.data || [];
        },
        async imgArr(optionName) {
            const { data } = await getStuZuJiClassCirclePicPageList({
                pageNo: 1,
                pageSize: 10,
                studentId: this.$route.query.studentId,
                schoolTimeId: this.$route.query.schoolTimeId,
                optionName: optionName
            })
            if (data && data.data && data.data.dataList) {
                return data.data.dataList.map(item => ({
                    src: item.picUrl || '',
                    alt: item.picName || '成长足迹'
                }));
            }
            return [];
        },
        print() {
            // 确保图表实例存在
            if (!this.radarChart) {
                this.initRadarChart();
            }
            if (!this.barChart) {
                this.initBarChart();
            }

            // 等待图表渲染完成
            setTimeout(() => {
                const printElement = this.$refs.print;
                const that = this;

                // 使用 html2canvas 捕获整个打印区域
                html2canvas(printElement, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                }).then(canvas => {
                    // 创建临时图片
                    const img = new Image();
                    img.src = canvas.toDataURL('image/png');
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';

                    // 创建一个临时窗口用于打印
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write('<!DOCTYPE html><html><head><title>打印</title><style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}</style></head><body>');
                    printWindow.document.write('<img src="' + img.src + '" style="max-width:100%;">');
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();

                    // 等待图片加载完成后打印
                    printWindow.onload = function () {
                        printWindow.print();
                        // 打印完成后关闭窗口
                        setTimeout(() => {
                            printWindow.close();
                        }, 500);
                    };
                }).catch(error => {
                    console.error('html2canvas 捕获失败:', error);
                    that.$message.error('打印失败，请重试');
                });
            }, 500);
        },
        async fetchSchoolYearGoalNum() {
            try {
                const { data } = await getSchoolYearGalNum({
                    studentId: this.$route.query.studentId,
                    schoolYearName: this.$route.query.schoolYear,
                });
                this.schoolYearGoalNum = data.data || 0;
            } catch (error) {
                console.error('获取学年目标失败:', error);
            }
        },
        async getSchoolConductStarBabyStatic() {
            const { data } = await getSchoolConductStarBabyStatic({
                schoolTimeId: this.$route.query.schoolTimeId,
                studentId: this.$route.query.studentId
            })
            this.schoolConductStarBabyStatic = data.data || {};
            this.indicators = this.schoolConductStarBabyStatic.typeCodeList || [];
            // 为每个指标获取成长足迹图片并初始化 starBabyBeh 对象
            for (let i = 0; i < this.indicators.length; i++) {
                const indicator = this.indicators[i];
                if (indicator.typeTitle) {
                    indicator.growthFootprints = await this.imgArr(indicator.typeTitle);
                } else {
                    indicator.growthFootprints = [];
                }
                // 初始化 starBabyBeh 对象，确保它存在且是响应式的
                if (!indicator.starBabyBeh) {
                    this.$set(indicator, 'starBabyBeh', {
                        behContent: '',
                        adviceContent: '',
                        isAdd: true
                    });
                } else {
                    // 确保 starBabyBeh 的属性也是响应式的
                    if (indicator.starBabyBeh.behContent === undefined) {
                        this.$set(indicator.starBabyBeh, 'behContent', '');
                    }
                    if (indicator.starBabyBeh.adviceContent === undefined) {
                        this.$set(indicator.starBabyBeh, 'adviceContent', '');
                    }
                }
                // 初始化编辑状态
                this.$set(indicator, '_editingComment', false);
                this.$set(indicator, '_editingSuggestion', false);
                this.$set(indicator, '_generatingAi', false);
                // 保存原始数据用于取消编辑
                this.$set(indicator, '_originalData', {
                    behContent: indicator.starBabyBeh.behContent,
                    adviceContent: indicator.starBabyBeh.adviceContent
                });
            }
            if (this.schoolConductStarBabyStatic.stuSchTimeList.length > 0) {
                this.calculateStars(this.schoolConductStarBabyStatic.stuSchTimeList[0].gradeId || '');
            }


        },
        // 计算各年级和各学期的得星数
        async calculateStars(gradeId) {
            // 学校总年级数
            let totalGradeSemesters = 0

            let schoolTimeList = []
            const gradeTextList = ['一年级上学期', '一年级下学期', '二年级上学期', '二年级下学期', '三年级上学期', '三年级下学期', '四年级上学期', '四年级下学期', '五年级上学期', '五年级下学期', '六年级上学期', '六年级下学期']

            const { data: levelData } = await getLevelByGradeId({ gradeId });
            const { data: allSchoolTimeData } = await getSchoolTimeAllList();

            // 获取年级
            const level = levelData.data.level
            // 获取全部的学期列表并反转
            const reversedSchoolTimes = allSchoolTimeData.data.reverse()

            // 查找当前学期并计算总年级数
            for (let i = 0; i < reversedSchoolTimes.length; i++) {
                if (reversedSchoolTimes[i].isCurrent == 1) {
                    totalGradeSemesters = reversedSchoolTimes[i].term == 1 ? 2 * level - 1 : 2 * level
                    schoolTimeList = reversedSchoolTimes.slice(0, i + 1).reverse()
                    break
                }
            }

            this.level = totalGradeSemesters

            // 清空并重新构建学期列表
            this.xueqilist = []

            // 填充已有的学期
            for (let i = 0; i < gradeTextList.length; i++) {
                if (totalGradeSemesters > i) {
                    this.xueqilist.push({
                        name: gradeTextList[i],
                        level: i + 1,
                        xueqi: {},
                        yes: false
                    })
                }
            }

            // 反转后填充学期信息
            this.xueqilist.reverse()
            for (let i = 0; i < this.xueqilist.length; i++) {
                if (schoolTimeList.length > i) {
                    this.xueqilist[i].xueqi = schoolTimeList[i]
                    this.xueqilist[i].yes = true
                }
            }

            // 再次反转恢复原始顺序
            this.xueqilist.reverse()

            // 确保包含所有12个学期
            for (let i = 0; i < gradeTextList.length; i++) {
                if (this.xueqilist.length < i + 1) {
                    this.xueqilist.push({
                        name: gradeTextList[i],
                        level: i + 1,
                        xueqi: {},
                        yes: false
                    })
                }
            }
            console.log(679, this.xueqilist);

            // 获取全部的学期列表
            const { stuSchTimeList = [] } = this.schoolConductStarBabyStatic;

            // 将 conductCount 添加到对应的 xueqi 字段中
            this.xueqilist.forEach(item => {
                if (item.yes && item.xueqi && item.xueqi.id) {
                    const stuSchTimeItem = stuSchTimeList.find(stuItem => stuItem.schoolTimeId === item.xueqi.id);
                    if (stuSchTimeItem) {
                        item.xueqi.conductCount = stuSchTimeItem.conductCount || 0;
                    } else {
                        item.xueqi.conductCount = 0;
                    }
                }
            });

            // 下方
            const yearlyStars = {};
            const semesterStars = {};
            let totalStars = 0;
            // 按 schoolYear 筛选的 schoolTimeName 得星数数组
            const schoolYearStars = [];
            // 获取当前学校年份
            const currentSchoolYear = this.$route.query.schoolYear;

            // 按 schoolTimeName 分组计算得星数
            const schoolTimeNameStars = {};

            // 按 xueqilist 处理数据，确保顺序正确
            this.xueqilist.forEach(xueqiItem => {
                if (xueqiItem.yes && xueqiItem.xueqi && xueqiItem.xueqi.id) {
                    const stuSchTimeItem = stuSchTimeList.find(stuItem => stuItem.schoolTimeId === xueqiItem.xueqi.id);
                    const conductCount = stuSchTimeItem ? stuSchTimeItem.conductCount || 0 : 0;

                    totalStars += conductCount;

                    // 提取年级名称（如"一年级"）
                    const chineseGradeName = xueqiItem.name.substring(0, 3);

                    if (chineseGradeName) {
                        yearlyStars[chineseGradeName] = (yearlyStars[chineseGradeName] || 0) + conductCount;
                    }

                    if (xueqiItem.name) {
                        semesterStars[xueqiItem.name] = conductCount;
                    }

                    // 按 schoolTimeName 分组计算得星数
                    if (xueqiItem.xueqi.schoolTimeName) {
                        schoolTimeNameStars[xueqiItem.xueqi.schoolTimeName] = conductCount;
                    }
                }
            });

            // 筛选出与当前 schoolYear 相同的 schoolTimeName
            if (currentSchoolYear) {
                // 检查是否有上学期和下学期的数据
                const hasFirstSemester = Object.keys(schoolTimeNameStars).some(name => name.includes(currentSchoolYear) && name.includes('第1学期'));
                const hasSecondSemester = Object.keys(schoolTimeNameStars).some(name => name.includes(currentSchoolYear) && name.includes('第2学期'));

                // 遍历现有数据
                Object.entries(schoolTimeNameStars).forEach(([schoolTimeName, count]) => {
                    if (schoolTimeName.includes(currentSchoolYear)) {
                        schoolYearStars.push({
                            schoolTimeName: schoolTimeName,
                            conductCount: count
                        });
                    }
                });

                // 生成学期名称，保持与现有数据格式一致
                const schoolYearPattern = currentSchoolYear.includes('-') ? currentSchoolYear : `${currentSchoolYear}-${parseInt(currentSchoolYear) + 1}`;

                // 如果没有上学期数据，添加一个0星的记录
                if (!hasFirstSemester) {
                    schoolYearStars.push({
                        schoolTimeName: `${schoolYearPattern}学年第1学期`,
                        conductCount: 0
                    });
                }

                // 如果没有下学期数据，添加一个0星的记录
                if (!hasSecondSemester) {
                    schoolYearStars.push({
                        schoolTimeName: `${schoolYearPattern}学年第2学期`,
                        conductCount: 0
                    });
                }

                // 按学期顺序排序（第1学期在前，第2学期在后）
                schoolYearStars.sort((a, b) => {
                    if (a.schoolTimeName.includes('第1学期') && b.schoolTimeName.includes('第2学期')) {
                        return -1;
                    } else if (a.schoolTimeName.includes('第2学期') && b.schoolTimeName.includes('第1学期')) {
                        return 1;
                    }
                    return 0;
                });
            }

            this.yearlyStars = yearlyStars;
            this.semesterStars = semesterStars;
            this.totalStars = totalStars;
            this.schoolYearStars = schoolYearStars;
        },
        // 将数字年级转换为中文年级名称
        getChineseGradeName(gradeName) {
            if (!gradeName) return '';

            // 尝试将 gradeName 转换为数字
            const gradeNum = parseInt(gradeName);
            if (isNaN(gradeNum)) return gradeName;

            // 转换为中文年级名称
            const chineseNums = ['', '一', '二', '三', '四', '五', '六'];
            if (gradeNum >= 1 && gradeNum <= 6) {
                return chineseNums[gradeNum] + '年级';
            }

            return gradeName;
        },
        togglePhone() {
            this.showPhone = !this.showPhone;
        },
        toggleArchive() {
            this.showArchive = !this.showArchive;
        },
        // AI生成建议
        async generateAiSuggestion(indicator, index) {
            try {
                this.$set(indicator, '_generatingAi', true);

                const params = {
                    schoolTimeId: Number(this.$route.query.schoolTimeId),
                    studentId: Number(this.$route.query.studentId),
                    studentName: this.studentInfo.name,
                    typeCode: indicator.typeCode,
                    typeTitle: indicator.typeTitle
                };

                const { data } = await getAiBehContent(params);

                if (data.code === 200) {
                    // 进入编辑模式
                    this.startEdit('suggestion', indicator, index);
                    // 赋值给输入框
                    indicator.starBabyBeh.adviceContent = data.data || '';
                    this.$message.success('AI生成成功');
                } else {
                    this.$message.error(data.msg || 'AI生成失败');
                }
            } catch (error) {
                console.error('AI生成失败:', error);
                this.$message.error('AI生成失败，请重试');
            } finally {
                this.$set(indicator, '_generatingAi', false);
            }
        },
        // 开始编辑
        startEdit(type, indicator, index) {
            if (type === 'comment') {
                indicator._editingComment = true;
            } else if (type === 'suggestion') {
                indicator._editingSuggestion = true;
            }
        },
        // 保存编辑
        async saveEdit(type, indicator, index) {
            try {
                if (indicator.starBabyBeh.isAdd) {
                    let params = {
                        adviceContent: indicator.starBabyBeh.adviceContent,//	建议	string	
                        behContent: indicator.starBabyBeh.behContent,//	评语	string	
                        studentId: this.$route.query.studentId,//	学生id	number	
                        typeCode: indicator.typeCode,//	类型code	string	
                        typeTitle: indicator.typeTitle,//	类型名称	string
                        schoolTimeId: this.$route.query.schoolTimeId
                    };
                    // 新增
                    const { data } = await addSchoolConductStarBabyBeh(params);
                    if (data.code === 200) {
                        this.$message.success('保存成功');
                        indicator.starBabyBeh.isAdd = false;

                    } else {
                        this.$message.error(data.msg || '保存失败');
                    }
                } else {
                    let params = {
                        adviceContent: indicator.starBabyBeh.adviceContent,//	建议	string	
                        behContent: indicator.starBabyBeh.behContent,//	评语	string	
                        studentId: this.$route.query.studentId,//	学生id	number	
                        typeCode: indicator.typeCode,//	类型code	string	
                        schoolTimeId: this.$route.query.schoolTimeId
                    };
                    // 修改
                    await updateSchoolConductStarBabyBeh(params);
                    this.$message.success('保存成功');
                }

                // 更新原始数据
                indicator._originalData.behContent = indicator.starBabyBeh.behContent;
                indicator._originalData.adviceContent = indicator.starBabyBeh.adviceContent;
            } catch (error) {
                this.$message.error('保存失败，请重试');
                console.error('保存失败:', error);
            }
            if (type === 'comment') {
                indicator._editingComment = false;
            } else if (type === 'suggestion') {
                indicator._editingSuggestion = false;
            }
        },
        // 取消编辑
        cancelEdit(type, indicator, index) {
            if (type === 'comment') {
                indicator.starBabyBeh.behContent = indicator._originalData.behContent;
                indicator._editingComment = false;
            } else if (type === 'suggestion') {
                indicator.starBabyBeh.adviceContent = indicator._originalData.adviceContent;
                indicator._editingSuggestion = false;
            }
        },
        getSectionBgColor(index) {
            const bgColors = ['#F0F6FF', '#F1FDF4', '#FEF7ED', '#FAF5FF', '#FCF2F8'];
            return bgColors[index % bgColors.length];
        },
        getSectionBorderColor(index) {
            const borderColors = ['#C1DBFF', '#BEF8D0', '#FCD6A7', '#E8D4FF', '#F9CEE7'];
            return borderColors[index % borderColors.length];
        },
        getScoreBgColor(index) {
            const scoreBgColors = ['#3D7EFF', '#1CCA56', '#FC6700', '#A942FF', '#EE2C97'];
            return scoreBgColors[index % scoreBgColors.length];
        },
        initRadarChart() {
            this.radarChart = echarts.init(document.getElementById('radarChart'));
            const chart = this.radarChart;
            const typeCodeList = this.schoolConductStarBabyStatic.typeCodeList;
            const categories = typeCodeList.map(item => ({ name: item.typeTitle || '', max: item.starCount, nameTextStyle: { color: '#000', fontWeight: 'bold', fontSize: 12 } }));
            const seriesData = typeCodeList.map(item => item.behStarCount || 0);
            const option = {
                radar: {
                    indicator: categories,
                    splitNumber: 4,
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(240, 240, 240, 0.1)', 'rgba(240, 240, 240, 0.2)']
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#e0e0e0'
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#e0e0e0'
                        }
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: '#e0e0e0'
                        }
                    },
                    axisLabel: {
                        show: true,
                        fontSize: 10,
                        color: '#999'
                    }
                },
                series: [{
                    type: 'radar',
                    data: [{
                        value: seriesData,
                        name: '五育发展',
                        areaStyle: {
                            color: 'rgba(42, 92, 250, 0.2)'
                        },
                        lineStyle: {
                            color: '#2A5CFA',
                            width: 2
                        },
                        itemStyle: {
                            color: '#2A5CFA'
                        }
                    }]
                }]
            };

            chart.setOption(option);

            window.addEventListener('resize', function () {
                chart.resize();
            });
        },
        // 初始化柱状图
        initBarChart() {
            // 创建ECharts实例
            this.barChart = echarts.init(document.getElementById('barChart'));
            const chart = this.barChart;
            const typeCodeList = this.schoolConductStarBabyStatic.typeCodeList;
            const categories = typeCodeList.map(item => item.typeTitle || '');
            const seriesData = typeCodeList.map(item => item.behStarCount || 0);

            // 反转数据顺序，确保从上到下与原数据顺序一致
            categories.reverse();
            seriesData.reverse();

            // 配置柱状图选项
            const option = {
                grid: {
                    left: '12%',
                    right: '15%',
                    top: '10%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0'
                        }
                    },
                    axisLabel: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    data: categories,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#333',
                        fontSize: 12
                    }
                },
                series: [{
                    data: seriesData,
                    type: 'bar',
                    barWidth: '60%',
                    itemStyle: {
                        color: function (params) {
                            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
                            return colors[params.dataIndex];
                        }
                    },
                    label: {
                        show: true,
                        position: 'right',
                        color: '#333',
                        fontSize: 14,
                        fontWeight: 'bold',
                        formatter: '{c}颗⭐'
                    }
                }]
            };

            // 设置图表选项
            chart.setOption(option);

            // 监听窗口大小变化，调整图表大小
            window.addEventListener('resize', function () {
                chart.resize();
            });
        },
    },

}
</script>

<style scoped lang="scss">
.mybi-icon {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;

    img {
        width: 20px;
        height: 20px;
    }
}

.fiveStarKidDetails {
    min-height: 100vh;
    background: #f5f7fa;
    font-family: 'Microsoft YaHei', Arial, sans-serif;

    .header {
        background: white;
        padding: 20px 30px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            .title-content {
                display: flex;
                align-items: center;

                i {
                    font-size: 24px;
                    color: #409eff;
                    margin-right: 12px;
                }

                div {
                    h1 {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin: 0 0 10px 0;
                    }

                    p {
                        font-size: 14px;
                        color: #999;
                        margin: 0;
                    }
                }
            }
        }

        .header-buttons {
            .print-btn {
                background: #409eff;
                border-color: #409eff;
                font-size: 14px;
                padding: 8px 16px;
            }
        }
    }



}

.content {
    display: flex;
    justify-content: space-between;
    padding: 20px 60px;

    .left-section {
        width: 62%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .right-section {
        width: 36%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid #DCEAFE;

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-header {
            padding: 20px;
            color: white;
            display: flex;
            align-items: center;

            i {
                font-size: 20px;
                margin-right: 8px;
            }

            h3 {
                font-size: 20px;
                font-weight: bold;
                margin: 0;
            }
        }

        .card-body {
            padding: 30px;
        }

        .purple-header {
            background: linear-gradient(90deg, #EFF5FE 0%, #FAF5FF 100%);
        }

        .red-header {
            background: linear-gradient(90deg, #EE6A69 0%, #ED1922 100%);
        }

        .blue-header {
            background: linear-gradient(90deg, #2B5CFB 0%, #9500F9 100%);
        }

        .green-header {
            background: linear-gradient(90deg, #EFF6FF 0%, #EEFEFF 100%);
        }

        .zhibiao-header {
            background: linear-gradient(90deg, #F1FDF4 0%, #F2FEFB 100%);
        }

        .orange-header {
            background: linear-gradient(90deg, #655DFF 0%, #A942FF 100%);
        }

        .pink-header {
            background: linear-gradient(90deg, #FCF2F7 0%, #FEF1F2 100%);
        }

        .yellow-header {
            background: linear-gradient(90deg, #F9F5FE 0%, #FCF2F8 100%);
        }

        .pingjia-header {
            background: linear-gradient(90deg, #FEF7ED 0%, #FDFCE8 100%);
        }

        &.student-info-card {
            .student-info {
                .top-section {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    padding: 15px;

                    .avatar {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        overflow: hidden;
                        background: #f0f0f0;
                        border: 3px solid #e0e0e0;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .info {
                        flex: 1;

                        h2 {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                            margin: 0 0 10px 0;
                        }

                        .gender-class {
                            font-size: 14px;
                            color: #666;
                            margin: 0;

                            i {
                                margin-right: 5px;
                                color: #999;
                            }
                        }
                    }

                    .star-count {
                        text-align: center;
                        min-width: 200px;
                        border-left: 1px solid #e0e0e0;

                        p {
                            font-size: 14px;
                            color: #999;
                            margin: 0 0 5px 0;
                        }

                        .count {
                            font-size: 20px;
                            margin: 0;
                        }
                    }
                }

                .divider {
                    height: 1px;
                    background: #e0e0e0;
                    margin: 15px 0;
                }

                .contact-section {
                    .contact {
                        font-size: 14px;
                        color: #666;
                        margin: 0;
                        display: flex;
                        align-items: center;

                        i {
                            margin-right: 5px;
                            color: #999;
                        }

                        .eye-icon {
                            width: 20px;
                            height: 20px;
                            margin-left: 10px;
                            cursor: pointer;
                            font-size: 16px;
                            color: #999;
                        }
                    }
                }
            }
        }

        &.radar-card {
            .radar-chart {
                height: 300px;
                width: 100%;
            }
        }

        &.indicators-card {
            .indicator-section {
                margin-bottom: 30px;
                padding: 20px;
                border-radius: 8px;

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #e5e7eb;

                    .section-title {
                        display: flex;
                        align-items: center;
                        gap: 8px;

                        h4 {
                            font-size: 16px;
                            font-weight: bold;
                            color: #333;
                            margin: 0;
                        }
                    }

                    .section-score {
                        font-size: 14px;
                        font-weight: bold;
                        padding: 7px 15px;
                        border-radius: 20px;
                    }
                }

                .indicator-item {
                    padding: 15px;
                    background: #FCFDFF;
                    margin-bottom: 15px;
                    border-radius: 10px;

                    .item-content {
                        .item-header {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            margin-bottom: 8px;

                            .item-dot {
                                width: 8px;
                                height: 8px;
                                background: #f59e0b;
                                border-radius: 50%;
                                flex-shrink: 0;
                            }

                            .indicator-name {
                                flex: 1;
                                font-size: 14px;
                                color: #333;
                                font-weight: 500;
                            }

                            .indicator-value {
                                font-size: 14px;
                                font-weight: bold;
                                color: #f59e0b;
                            }
                        }



                        .indicator-tip {
                            font-size: 12px;
                            color: #6b7280;
                        }
                    }
                }

                .teacher-comment {
                    padding: 20px;
                    background: #FCFDFF;
                    margin-bottom: 15px;
                    border-radius: 10px;
                    border-left: 3px solid #3D7EFF;

                    .comment-header {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 10px;

                        span {
                            flex: 1;
                            font-size: 14px;
                            font-weight: bold;
                            color: #333;
                        }

                        .edit-btn {
                            display: flex;
                            align-items: center;
                            gap: 4px;
                            padding: 4px 12px;
                            font-size: 12px;
                            background: transparent;
                            color: #3b82f6;
                            border: 1px solid #d1e5ff;
                            border-radius: 16px;
                            cursor: pointer;

                            &:hover {
                                background: #e6f0ff;
                            }

                            i {
                                font-size: 12px;
                            }
                        }
                    }

                    .comment-text {
                        font-size: 13px;
                        color: #666;
                        line-height: 1.5;
                        margin: 0;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }

                    .comment-text h3 {
                        margin-top: 10px;
                        margin-bottom: 5px;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .comment-text p {
                        margin: 5px 0;
                    }
                }

                .teacher-suggestion {
                    padding: 20px;
                    background: #FEFAE9;
                    border-radius: 10px;
                    border-left: 3px solid #EBB100;

                    .suggestion-header {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 10px;

                        span {
                            flex: 1;
                            font-size: 14px;
                            font-weight: bold;
                            color: #333;
                        }

                        .edit-btn {
                            display: flex;
                            align-items: center;
                            gap: 4px;
                            padding: 4px 12px;
                            font-size: 12px;
                            background: transparent;
                            color: #3b82f6;
                            border-radius: 16px;
                            cursor: pointer;
                            border: 1px solid #3b82f6;

                            &:hover {
                                background: #e6f0ff;
                            }

                            i {
                                font-size: 12px;
                            }
                        }



                        .ai-btn {
                            display: flex;
                            align-items: center;
                            gap: 4px;
                            padding: 4px 12px;
                            font-size: 12px;
                            background: transparent;
                            color: #9500F9;
                            border-radius: 16px;
                            cursor: pointer;
                            border: 1px solid #9500F9;
                            margin-left: 5px;

                            &:hover {
                                background: #FAF5FF;
                            }

                            i {
                                font-size: 12px;
                            }
                        }
                    }

                    .suggestion-text {
                        font-size: 13px;
                        color: #666;
                        line-height: 1.5;
                        margin: 0;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }

                    .suggestion-text h3 {
                        margin-top: 10px;
                        margin-bottom: 5px;
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .suggestion-text p {
                        margin: 5px 0;
                    }
                }

                .growth-footprints {
                    margin-top: 20px;

                    .footprints-header {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                    }

                    .footprint-images {
                        margin-top: 10px;
                        width: 100%;
                        overflow: hidden;
                    }

                    .footprint-scroll {
                        display: flex;
                        overflow-x: auto;
                        padding-bottom: 10px;
                        scrollbar-width: thin;
                        scrollbar-color: #ccc #f0f0f0;
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .footprint-scroll::-webkit-scrollbar {
                        height: 6px;
                    }

                    .footprint-scroll::-webkit-scrollbar-track {
                        background: #f0f0f0;
                        border-radius: 3px;
                    }

                    .footprint-scroll::-webkit-scrollbar-thumb {
                        background: #ccc;
                        border-radius: 3px;
                    }

                    .footprint-scroll::-webkit-scrollbar-thumb:hover {
                        background: #999;
                    }



                    .no-footprints {
                        text-align: center;
                        color: #999;
                        padding: 20px 0;
                    }
                }
            }
        }

        &.details-card {
            .bar-chart {
                height: 250px;
                width: 100%;
            }
        }

        &.bank-card {
            .bank-total {
                text-align: center;
                margin-bottom: 20px;
                padding: 20px;
                background: #f3f4ff;
                border-radius: 8px;

                .total-label {
                    font-size: 14px;
                    color: #666;
                    margin: 0 0 10px 0;
                }

                .total-value {
                    font-size: 32px;
                    font-weight: bold;
                    color: #5236F5;
                    margin: 0;
                }
            }

            .bank-yearly {
                margin-bottom: 20px;

                .yearly-label {
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                    margin: 0 0 12px 0;
                }

                .yearly-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;

                    .year-item {
                        padding: 14px;
                        background: #f9f9f9;
                        border-radius: 8px;
                        text-align: center;
                        transition: all 0.3s ease;

                        &.active {
                            background: #e0e7ff;
                            border: 2px solid #c7d2fe;
                        }

                        .year {
                            font-size: 13px;
                            color: #666;
                            display: block;
                            margin-bottom: 6px;
                        }

                        .year-stars {
                            font-size: 16px;
                            font-weight: bold;
                            color: #333;
                        }
                    }
                }
            }

            .bank-semester {
                .semester-label {
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                    margin: 0 0 12px 0;
                }

                .semester-list {
                    .semester-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px 0;
                        border-bottom: 1px solid #f0f0f0;

                        &:last-child {
                            border-bottom: none;
                        }

                        &.active {
                            background: #e0e7ff;
                            padding: 10px 12px;
                            border-radius: 8px;
                            margin: 0 -12px;
                        }

                        .semester {
                            font-size: 13px;
                            color: #666;
                        }

                        .semester-stars {
                            font-size: 14px;
                            font-weight: bold;
                            color: #333;
                        }
                    }
                }
            }
        }

        &.wish-card {
            .wish-goal {
                text-align: center;
                margin-bottom: 20px;

                .goal-title {
                    font-size: 14px;
                    color: #666;
                    margin: 0 0 10px 0;
                }

                .wish-value {
                    font-size: 20px;
                    font-weight: bold;
                    color: #DE0073;
                    margin: 0;
                }
            }

            .wish-progress {
                margin-bottom: 20px;

                .progress-item {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    background: #FCF2F8;
                    border-radius: 8px;
                    margin-bottom: 8px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .progress-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #DE0073;
                        margin-right: 10px;
                    }

                    .progress-label {
                        flex: 1;
                        font-size: 13px;
                        color: #666;
                    }

                    .progress-value {
                        font-size: 14px;
                        font-weight: bold;
                        color: #DE0073;
                    }
                }
            }

            .wish-achieved {
                padding: 15px;
                background: #f9f9f9;
                border-radius: 8px;

                .achieved-labelbox {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    margin-bottom: 12px;
                    gap: 10px;

                    .achieved-label {
                        font-size: 13px;
                        color: #666;
                        margin: 0;
                    }

                    .achieved-value {
                        font-size: 16px;
                        font-weight: bold;
                        color: #DE0073;
                    }
                }



                .achieved-info {
                    text-align: right;

                    .achieved-percent {
                        font-size: 13px;
                        color: #666;
                    }
                }
            }
        }

        &.rate-card {
            .rate-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;

                .rate-label {
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                    margin: 0;
                }

                .rate-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #DE0073;
                    background: #f0f0f0;
                    padding: 4px 12px;
                    border-radius: 16px;
                }
            }



            .rate-tip {
                font-size: 12px;
                color: #999;
                margin: 5px 0 0 0;
            }
        }

        &.recent-card {
            .recent-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                margin-bottom: 10px;
                background: #FEFBF5;
                border-radius: 8px;
                transition: background-color 0.3s ease;

                &:last-child {
                    margin-bottom: 0;
                }

                &:hover {
                    background: #f0f0f0;
                }

                .recent-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #ff7a45;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .recent-info {
                    flex: 1;

                    .recent-content {
                        font-size: 14px;
                        font-weight: 500;
                        color: #333;
                        margin-bottom: 4px;
                    }

                    .recent-meta {
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
        }
    }
}

.student-card,
.star-overview-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;

    .card-header {
        padding: 20px;
        color: white;
        display: flex;
        align-items: center;

        i {
            font-size: 20px;
            margin-right: 5px;
        }

        h3 {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
        }
    }

    .card-body {
        padding: 30px;
    }
}

.student-info {
    display: flex;
    align-items: center;
    gap: 20px;

    .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        background: #f0f0f0;
        border: 2px solid #f0f0f0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .info {
        flex: 1;

        h2 {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 0 0 8px 0;
        }

        .gender-class,
        .contact {
            font-size: 12px;
            color: #666;
            margin: 0 0 4px 0;

            i {
                margin-right: 4px;
                color: #999;
            }

            .eye-icon {
                width: 20px;
                            height: 20px;
                            margin-left: 10px;
                            cursor: pointer;
                            font-size: 16px;
                            color: #999;
            }
        }
    }

    .star-count {
        text-align: right;
        min-width: 120px;

        p {
            font-size: 11px;
            color: #999;
            margin: 0 0 2px 0;
        }

        .count {
            font-size: 20px;
            font-weight: bold;
            color: #f7ba2a;
            margin: 0;
        }
    }
}

.overview-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;

    &:last-child {
        margin-bottom: 0;
    }

    &.purple-item {
        background: #f9f5ff;
    }

    &.blue-item {
        background: #f0f9ff;
    }

    &.green-item {
        background: #f0fdf4;
    }

    .item-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;

        &.purple-item {
            background: linear-gradient(90deg, #CB6DEA 0%, #E548AF 100%);
            color: #9333ea;
        }

        &.blue-item {
            background: linear-gradient(90deg, #4FA9F9 0%, #2BB3E4 100%);
            color: #3b82f6;
        }

        &.green-item {
            background: linear-gradient(90deg, #37D884 0%, #1EC59E 100%);
            color: #fff;
        }

        img {
            width: 24px;
            height: 24px;
        }
    }

    .item-info {
        flex: 1;

        .label {
            font-size: 14px;
            color: #666;
            margin: 0 0 4px 0;
        }

        .value {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin: 0;

            .star-icon {
                color: #f7ba2a;
                margin-left: 4px;
            }
        }
    }

    .tag {
        font-size: 14px;
        padding: 8px 15px;
        border-radius: 15px;
        font-weight: 500;

        &.target {
            background: #9333ea;
            color: white;
        }

        &.achieved {
            background: #3b82f6;
            color: white;
        }

        &.in-progress {
            background: #10b981;
            color: white;
        }

        &.in-orange {
            background: #f7ba2a;
            color: white;
        }
    }
}

@media (max-width: 1200px) {
    .fiveStarKidDetails {
        .content {
            flex-direction: column;

            .right-section {
                width: 100%;
            }
        }
    }
}

.footprint-scroll {
    display: flex;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: #ccc #f0f0f0;
    width: 100%;
    box-sizing: border-box;
}

.footprint-img {
    flex: 0 0 calc(33.333% - 10px);
    max-width: calc(33.333% - 10px);
    height: 230px;
    margin-right: 10px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

/deep/ .slot-container {
    display: flex;
}

/deep/ .previewer {
    width: 100%;
}

.save-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    font-size: 12px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    margin-right: 8px;

    &:hover {
        background: #2563eb;
    }

    i {
        font-size: 12px;
    }
}

.cancel-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    font-size: 12px;
    background: transparent;
    color: #666;
    border: none;
    border-radius: 16px;
    cursor: pointer;

    &:hover {
        background: #f0f0f0;
    }

    i {
        font-size: 12px;
    }
}
</style>
