<template>
    <div class="class-review">
        <!-- 顶部筛选 -->
        <div class="header">
            <el-row>
                <el-col :span="24">
                    <term-grade-class-selector
                        :queryArgs="queryArgs"
                        :isShowDuration="false"
                        :isGradeShowAll="true"
                        v-model="obj"
                        @input="handleSelectorInput"
                        ref="selector">
                    </term-grade-class-selector>
                    <el-date-picker size="medium" v-model="searchDate" type="date" value-format="yyyy-MM-dd"
                        placeholder="选择日期" :clearable="false" @change="onSearch">
                    </el-date-picker>
                </el-col>
            </el-row>
        </div>

        <!-- 主体 -->
        <div class="content scrollStyle">
            <section class="section course-section">
                <!-- <div class="section-head">
                    <div class="head-left">
                        <h2 class="section-title main-title">课程列表</h2>
                        <p class="section-desc">根据筛选条件查看当日已开展的课程，点击课程可进入回顾</p>
                    </div>
                    <div class="head-right">
                        <div class="date-pill">
                            <span class="date-text">{{ today.dateStr }}</span>
                            <span class="dot">·</span>
                            <span class="week-text">{{ today.weekStr }}</span>
                        </div>
                    </div>
                </div> -->

                <div class="course-grid" v-if="courseList && courseList.length">
                    <div class="course-card" v-for="(course, index) in courseList"
                        :key="(course.classId || '') + '_' + (course.curriculumId || '') + '_' + (course.nodeNumber || index)"
                        :class="{ 'is-custom': course.isCustom }" @click="handleCourseClick(course)">
                        <div class="card-bg-decor"></div>
                        <!-- 自定义课程：右上角"自定义"角标 -->
                        <span v-if="course.isCustom" class="custom-tag">自定义</span>
                        <div class="card-header">
                            <div class="subject-icon" :class="['period-' + (course.isMorning || 0)]"
                                style="background-size: contain;"
                                :style="course.curriculumCover ? { backgroundImage: 'url(' + course.curriculumCover + ')' } : null">
                                <span v-if="!course.curriculumCover" class="subject-emoji">{{
                                    getSubjectIcon(course.curriculumName) }}</span>
                            </div>
                            <div class="subject-info">
                                <div class="subject-name">{{ course.curriculumName || '未命名课程' }}</div>
                                <div class="class-name">{{ course.className || '--' }}</div>
                            </div>
                            <i class="el-icon-arrow-right arrow-icon"></i>
                        </div>
                        <div class="card-body">
                            <div class="info-item">
                                <i class="el-icon-time"></i>
                                <span>{{ course.morningName || formatPeriod(course) }}</span>
                            </div>
                            <div class="info-item" v-if="course.groupCount > 0">
                                <i class="el-icon-user"></i>
                                <span>{{ course.groupCount }}个小组</span>
                            </div>
                            <span class="time-badge" :class="['badge-' + (course.isMorning || 0)]">{{
                                formatTimeRange(course) }}</span>
                        </div>
                    </div>
                </div>

                <!-- 空状态 -->
                <div v-else class="rank-empty">
                    <div class="empty-illustration">
                        <div class="empty-circle"><span class="empty-icon">📚</span></div>
                        <div class="empty-dot dot1"></div>
                        <div class="empty-dot dot2"></div>
                        <div class="empty-dot dot3"></div>
                    </div>
                    <div class="empty-title">暂无课程数据</div>
                    <div class="empty-desc">请调整筛选条件后重试</div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import TermGradeClassSelector from '@/components/TermGradeClassSelector';
import {
    getScheduleCurrWeekScheduleTimeByTh2,
    getClassScheduleTimeThList
} from '@/api/hshBehaviorMan';

export default {
    name: 'classReview',
    mixins: [mixins],
    components: { TermGradeClassSelector },
    data() {
        return {
            today: {
                dateStr: '',
                weekStr: ''
            },
            obj: {
                termId: '',
                duration: ['', ''],
                gradeId: '',
                classId: ''
            },
            queryArgs: {
                all: true,
                manager: false,
                notlimit: true,
                submanager: false,
                teacher: false
            },
            searchDate: '',
            // 常规课程列表
            normalCourseList: [],
            // 自定义课程列表
            customCourseList: [],
            // 学科本地图标映射（接口无 icon 字段时按学科名匹配）
            subjectOptions: [
                { value: '语文', icon: '📖' },
                { value: '数学', icon: '🧮' },
                { value: '英语', icon: '🔤' },
                { value: '德法', icon: '⚖️' },
                { value: '科学', icon: '🔬' },
                { value: '音乐', icon: '🎵' },
                { value: '美术', icon: '🎨' },
                { value: '体育', icon: '⚽' }
            ]
        };
    },
    computed: {
        // 课程列表 = 常规课程 + 自定义课程（自定义在末尾）
        courseList() {
            const normal = this.normalCourseList || [];
            const custom = (this.customCourseList || []).map(item => ({
                ...item,
                isCustom: true
            }));
            return normal.concat(custom);
        }
    },
    created() {
        this.searchDate = this.getTodayDate();
        this.computeToday(this.searchDate);
    },
    methods: {
        handleSelectorInput(val) {
            if (!val.termId && this.$refs.selector && this.$refs.selector.termList && this.$refs.selector.termList.length > 0) {
                this.obj = Object.assign({}, val, { termId: this.$refs.selector.termList[0].id });
                return;
            }
            this.onSearch();
        },
        // 查询课程列表（常规 + 自定义）
        onSearch() {
            this.computeToday(this.searchDate);
            const params = {
                searchDate: this.searchDate,
                teacherId: 0,
                gradeId: this.obj.gradeId,
                classId: this.obj.classId || 0
            };
            getScheduleCurrWeekScheduleTimeByTh2(params).then(res => {
                const data = res.data;
                if (data && (data.code === 200 || data.code === '200' || data.success === true)) {
                    let list = data.data || [];
                    if (this.obj.classId && this.obj.classId !== 0) {
                        list = list.filter(item => Number(item.classId) === Number(this.obj.classId));
                    }
                    this.normalCourseList = list;
                } else {
                    this.normalCourseList = [];
                }
            }).catch(() => {
                this.normalCourseList = [];
            });
            this.loadCustomCourseList();
        },
        // 查询自定义课程列表
        loadCustomCourseList() {
            getClassScheduleTimeThList({
                classId: this.obj.classId || 0,
                gradeId: this.obj.gradeId,
                teacherId: 0,
                watchDate: this.searchDate
            }).then(res => {
                const data = res.data;
                let list = (data && data.data) || [];
                if (this.obj.classId && this.obj.classId !== 0) {
                    list = list.filter(item => Number(item.classId) === Number(this.obj.classId));
                }
                this.customCourseList = list;
            }).catch(() => {
                this.customCourseList = [];
            });
        },
        // 跳转课程回顾详情
        handleCourseClick(course) {
            if (!course) return;
            this.$router.push({
                path: '/main/stuEvaluate/hshBehaviorMan/classReviewDetail',
                query: {
                    behDate: this.searchDate,
                    classId: course.classId,
                    className: course.className || '',
                    curriculumId: course.curriculumId || '',
                    curriculumName: course.curriculumName || '',
                    nodeNumber: course.nodeNumber || '',
                    sectionNo: course.sectionNo || '',
                    isMorning: course.isMorning || '',
                    morningName: course.morningName || '',
                    startTime: course.startTime || '',
                    endTime: course.endTime || '',
                    isCustom: course.isCustom ? 1 : 0
                }
            });
        },
        // 今天日期，格式为：YYYY-MM-DD
        getTodayDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // 根据所选日期更新右侧日期胶囊
        computeToday(dateStr) {
            const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const d = dateStr ? new Date(dateStr.replace(/-/g, '/')) : new Date();
            this.today.dateStr = (d.getMonth() + 1) + '月' + d.getDate() + '日';
            this.today.weekStr = weekMap[d.getDay()];
        },
        // 学科图标匹配
        getSubjectIcon(name) {
            if (!name) return '📘';
            const matched = this.subjectOptions.find(item => name.indexOf(item.value) !== -1);
            return matched ? matched.icon : '📘';
        },
        // morningName 缺失时回退展示
        formatPeriod(course) {
            const periodMap = { 1: '早自习', 2: '上午', 3: '午自习', 4: '下午', 5: '晚上' };
            const prefix = periodMap[course.isMorning] || '';
            const sec = course.sectionNo
                ? '第' + course.sectionNo + '节'
                : (course.nodeNumber ? '第' + course.nodeNumber + '节' : '');
            return (prefix + ' ' + sec).trim() || '--';
        },
        // 拼接 startTime - endTime 区间
        formatTimeRange(course) {
            if (course.startTime && course.endTime) {
                return course.startTime + ' - ' + course.endTime;
            }
            return course.timeRange || '待定';
        }
    }
};
</script>

<style scoped lang="scss">
$primary: #f2762c;
$text-main: #0a0a0a;
$text-muted: #6b7280;
$text-muted-soft: rgba(107, 114, 128, 0.5);
$border: rgba(229, 231, 235, 0.6);
$card-bg: #ffffff;

.class-review {
    padding: 12px;
    box-sizing: border-box;
    font-size: 14px;

    .header {
        padding-bottom: 10px;

        ::v-deep .el-select,
        ::v-deep .el-date-editor {
            width: 200px;
            margin-right: 10px;
        }
    }

    .content {
        padding: 20px 70px;
        overflow: auto;
    }
}

.section-title {
    margin: 0;
    color: $text-main;
    font-weight: 700;
}

.main-title {
    font-size: 22px;
    line-height: 1.2;
    letter-spacing: 0.5px;
}

.section-desc {
    margin: 8px 0 0;
    font-size: 13px;
    color: $text-muted;
}

.section-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.head-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.date-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 16px;
    border-radius: 12px;
    background: rgba(244, 244, 245, 0.7);
    border: 1px solid $border;
    font-size: 13px;
    color: $text-main;

    .date-text {
        font-weight: 500;
    }

    .dot {
        color: $text-muted;
    }

    .week-text {
        color: $text-muted;
    }
}

/* 课程卡片网格 */
.course-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 30px;
}

.course-card {
    position: relative;
    padding: 25px;
    background: $card-bg;
    border: 1px solid $border;
    border-radius: 25px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.35s ease;

    &:hover {
        border-color: rgba(59, 130, 246, 0.3);
        box-shadow: 0 18px 36px -15px rgba(59, 130, 246, 0.18);
        transform: translateY(-2px);

        .arrow-icon {
            color: #3b82f6;
            transform: translateX(4px);
        }

        .subject-icon {
            transform: scale(1.08);
        }
    }
}

.card-bg-decor {
    position: absolute;
    top: 0;
    right: 0;
    width: 128px;
    height: 128px;
    border-radius: 24px;
    background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0));
    pointer-events: none;
}

/* 自定义课程 - 右上角角标 */
.custom-tag {
    position: absolute;
    top: 8px;
    right: 12px;
    z-index: 2;
    padding: 4px 12px;
    border-radius: 9999px;
    background: linear-gradient(135deg, #f2762c 0%, #f59e0b 100%);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 10px -3px rgba(242, 118, 44, 0.45);
    pointer-events: none;
}

.course-card.is-custom {
    border-color: rgba(242, 118, 44, 0.35);
    background: linear-gradient(180deg, rgba(255, 247, 237, 0.85) 0%, #ffffff 60%);

    .card-bg-decor {
        background: linear-gradient(to bottom right, rgba(242, 118, 44, 0.18), rgba(242, 118, 44, 0));
    }

    &:hover {
        border-color: rgba(242, 118, 44, 0.55);
        box-shadow: 0 18px 36px -15px rgba(242, 118, 44, 0.25);

        .arrow-icon {
            color: #f2762c;
        }
    }
}

.card-header {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 22px;
}

.subject-icon {
    flex: 0 0 auto;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05));
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transition: transform 0.35s ease;
    overflow: hidden;


    .subject-emoji {
        line-height: 1;
    }

    &.period-1 {
        background: linear-gradient(to bottom right, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.05));
    }

    &.period-2 {
        background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05));
    }

    &.period-3 {
        background: linear-gradient(to bottom right, rgba(16, 185, 129, 0.22), rgba(16, 185, 129, 0.05));
    }

    &.period-4 {
        background: linear-gradient(to bottom right, rgba(242, 118, 44, 0.22), rgba(242, 118, 44, 0.05));
    }

    &.period-5 {
        background: linear-gradient(to bottom right, rgba(99, 102, 241, 0.22), rgba(99, 102, 241, 0.05));
    }
}

.subject-info {
    flex: 1;
    min-width: 0;
    padding-top: 4px;
}

.subject-name {
    font-size: 18px;
    font-weight: 600;
    color: $text-main;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.class-name {
    margin-top: 6px;
    font-size: 13px;
    color: $text-muted;
}

.arrow-icon {
    font-size: 18px;
    color: $text-muted-soft;
    transition: all 0.35s ease;
    flex: 0 0 auto;
    margin-top: 4px;
}

.card-body {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 13px;
    color: $text-muted;
}

.info-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.time-badge {
    margin-left: auto;
    padding: 4px 10px;
    border-radius: 9999px;
    background: #f4f4f5;
    color: #3f3f46;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.3px;
    white-space: nowrap;

    &.badge-1 {
        background: rgba(245, 158, 11, 0.12);
        color: #b45309;
    }

    &.badge-2 {
        background: rgba(59, 130, 246, 0.12);
        color: #1d4ed8;
    }

    &.badge-3 {
        background: rgba(16, 185, 129, 0.12);
        color: #047857;
    }

    &.badge-4 {
        background: rgba(242, 118, 44, 0.12);
        color: #c2410c;
    }

    &.badge-5 {
        background: rgba(99, 102, 241, 0.12);
        color: #4338ca;
    }
}

/* 空状态：复用 groupPortrait 风格 */
.rank-empty {
    text-align: center;
    padding: 60px 0 80px;

    .empty-illustration {
        position: relative;
        width: 140px;
        height: 140px;
        margin: 0 auto 24px;

        .empty-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 110px;
            height: 110px;
            border-radius: 50%;
            background: linear-gradient(135deg, #fff7ed 0%, #fce7f3 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(242, 118, 44, 0.12);
            animation: emptyFloat 3s ease-in-out infinite;

            .empty-icon {
                font-size: 52px;
                filter: drop-shadow(0 4px 8px rgba(242, 118, 44, 0.2));
            }
        }

        .empty-dot {
            position: absolute;
            border-radius: 50%;
            opacity: 0.6;

            &.dot1 {
                width: 14px;
                height: 14px;
                top: 12px;
                right: 16px;
                background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
                animation: emptyPulse 2s ease-in-out infinite;
            }

            &.dot2 {
                width: 10px;
                height: 10px;
                bottom: 18px;
                left: 10px;
                background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                animation: emptyPulse 2s ease-in-out infinite 0.4s;
            }

            &.dot3 {
                width: 8px;
                height: 8px;
                top: 28px;
                left: 18px;
                background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
                animation: emptyPulse 2s ease-in-out infinite 0.8s;
            }
        }
    }

    .empty-title {
        font-size: 16px;
        font-weight: 600;
        color: #4b5563;
        margin-bottom: 8px;
    }

    .empty-desc {
        font-size: 13px;
        color: #9ca3af;
    }
}

@keyframes emptyFloat {

    0%,
    100% {
        transform: translate(-50%, -50%);
    }

    50% {
        transform: translate(-50%, -58%);
    }
}

@keyframes emptyPulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.6;
    }

    50% {
        transform: scale(1.3);
        opacity: 1;
    }
}

/* 响应式 */
@media (max-width: 1280px) {
    .course-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .course-grid {
        grid-template-columns: 1fr;
    }
}
</style>
