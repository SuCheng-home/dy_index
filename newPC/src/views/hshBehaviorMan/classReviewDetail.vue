<template>
    <div class="class-review-detail">
        <!-- 顶部返回 -->
        <div class="page-top">
            <div class="back-link" @click="handleBack">
                <i class="el-icon-arrow-left"></i> 返回课程列表
            </div>
        </div>
        <!-- 课程信息 -->
        <div class="detail-header">
            <div class="header-left">
                <div class="course-info">
                    <div class="title-row">
                        <span class="course-title">{{ courseQuery.curriculumName || '未命名课程' }}</span>
                        <span v-if="Number(courseQuery.isCustom) === 1" class="custom-tag">自定义</span>
                    </div>
                    <div class="sub-row">
                        <span class="sub-item"><i class="el-icon-school"></i>{{ courseQuery.className || '--' }}</span>
                        <span class="sub-item"><i class="el-icon-date"></i>{{ courseQuery.behDate || '--' }}</span>
                        <span class="sub-item"><i class="el-icon-time"></i>{{ courseQuery.morningName || '--' }}</span>
                        <span class="sub-item" v-if="courseQuery.startTime && courseQuery.endTime">
                            {{ courseQuery.startTime }} - {{ courseQuery.endTime }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 主体 -->
        <div class="detail-content scrollStyle">
            <!-- 维度统计卡：行为类型 + 总计 -->
            <div class="metric-row" v-if="apiMetrics.length">
                <div v-for="m in apiMetrics" :key="m.key" class="metric-card" :style="metricCardStyle(m.color)">
                    <div class="metric-top">
                        <div class="metric-icon" :style="{ background: hex2rgba(m.color, 0.2), color: m.color }">
                            <img v-if="m.cover" :src="m.cover" class="metric-cover" />
                            <span v-else v-html="m.icon || '📊'"></span>
                        </div>
                        <div class="metric-label" :style="{ color: m.color }">{{ m.label }}</div>
                    </div>
                    <div class="metric-value" :style="{ color: m.color }">
                        <span class="num">{{ m.value }}</span><span class="unit">分</span>
                    </div>
                    <div class="metric-foot">
                        <span>{{ m.people }} 人参与</span>
                        <span>{{ m.rate }}% 参与率</span>
                    </div>
                </div>
            </div>

            <!-- 小组活跃度 -->
            <div class="panel">
                <div class="panel-title">小组活跃度</div>
                <div class="panel-sub">
                    共 {{ apiGroups.length }} 个分组 · {{ apiStuCount }} 名学生 · {{ apiBehStuCount }} 人参与
                </div>
                <div class="group-grid">
                    <div v-for="(g, idx) in apiSortedGroups" :key="g.id" class="group-card"
                        :class="{ active: apiSelectedGroupId === g.id }" @click="selectGroup(g.id)"
                        :style="apiSelectedGroupId === g.id ? groupActiveStyle(g.color) : { color: g.color }">
                        <span v-if="apiSelectedGroupId === g.id" class="selected-corner">
                            <i class="el-icon-check"></i>
                        </span>
                        <span v-if="idx < 3 && g.totalScore > 0" class="rank-badge" :class="'rank-' + (idx + 1)">{{ idx
                            + 1 }}</span>
                        <div class="group-head">
                            <span class="dot" :style="{ background: g.color }"></span>
                            <span class="gname">{{ g.name }}</span>
                            <span class="gpeople">{{ g.students.length }}人</span>
                            <span class="gscore">+{{ g.totalScore }}</span>
                        </div>
                        <div class="tag-row">
                            <span v-for="b in topBehOfGroup(g)" :key="b.behTypeId" class="tag"
                                :style="{ background: hex2rgba(getBehColor(b.behTypeId), 0.12), color: getBehColor(b.behTypeId) }">
                                {{ b.behTypeName }} ×{{ b.totalScoreNum }}
                            </span>
                            <span v-if="!topBehOfGroup(g).length" class="tag tag-empty">暂无评价</span>
                        </div>
                    </div>
                    <div v-if="!apiGroups.length" class="empty-inline">
                        <div class="ei-icon">📊</div>
                        <div class="ei-title">暂无分组数据</div>
                        <div class="ei-sub">尚未产生分组评价数据</div>
                    </div>
                </div>
                <!-- 选中组学生互动情况 -->
                <template v-if="apiCurrentGroup">
                    <div class="sub-divider"></div>
                    <div class="sub-title">{{ apiCurrentGroup.name }} - 学生互动情况</div>
                    <div class="student-grid">
                        <div v-for="s in apiCurrentGroup.students" :key="s.id" class="student-card">
                            <div class="stu-head">
                                <img v-if="s.avatar" :src="s.avatar" class="avatar avatar-img" />
                                <div v-else class="avatar">{{ (s.name || '').charAt(0) }}</div>
                                <div class="stu-meta">
                                    <div class="stu-name">{{ s.name }}</div>
                                    <div class="stu-sub">学号 {{ s.studentNo || '--' }}</div>
                                </div>
                                <div class="stu-score">+{{ getStudentTotalScore(s) }}</div>
                            </div>
                            <div v-if="getStudentBehTypes(s).length" class="dim-row">
                                <div v-for="bt in getStudentBehTypes(s)" :key="bt.behTypeId" class="dim-box"
                                    :style="{ background: hex2rgba(bt.color, 0.12), color: bt.color }">
                                    <div class="dv">{{ bt.count }}</div>
                                    <div class="dl">{{ bt.behTypeName }}</div>
                                </div>
                            </div>
                            <div v-else class="dim-row">
                                <div class="dim-box dim-empty">
                                    <div class="dv">--</div>
                                    <div class="dl">暂无互动数据</div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!apiCurrentGroup.students.length" class="empty-inline">
                            <div class="ei-icon">🧑‍🎓</div>
                            <div class="ei-title">该小组暂无学生</div>
                            <div class="ei-sub">请到分组管理中为该小组添加成员</div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- 互动热力图 + 行为类型分布 -->
            <div class="chart-row">
                <div class="panel">
                    <div class="panel-title">互动热力图</div>
                    <div class="panel-sub">各小组活跃度对比</div>
                    <div v-if="apiGroups.length" ref="barChart" class="echart-bar"></div>
                    <div v-else class="empty-inline echart-empty">
                        <div class="ei-icon">📈</div>
                        <div class="ei-title">暂无数据</div>
                        <div class="ei-sub">尚未产生互动数据</div>
                    </div>
                </div>
            
                <div class="panel">
                    <div class="panel-title">行为类型分布</div>
                    <div class="panel-sub">课堂互动类型占比</div>
                    <div v-if="apiBehTypes.length" ref="donutChart" class="echart-donut"></div>
                    <div v-else class="empty-inline echart-empty">
                        <div class="ei-icon">📊</div>
                        <div class="ei-title">暂无行为类型</div>
                        <div class="ei-sub">尚未产生互动数据</div>
                    </div>
                </div>
            </div>

            <!-- 最有价值的问题 -->
            <div class="panel">
                <div class="panel-head">
                    <div class="head-left">
                        <div class="star-icon">★</div>
                        <div>
                            <div class="panel-title inline">最有价值的问题</div>
                            <div class="panel-sub">老师精选的小组提问</div>
                        </div>
                    </div>
                    <span class="star-tag">{{ featuredList.length }} 条精选</span>
                </div>
                <div v-if="!featuredList.length" class="empty-box">
                    <div class="empty-icon">☆</div>
                    <div class="empty-title">暂无精选问题</div>
                    <div class="empty-sub">点击资源库中的星星标记有价值的提问</div>
                </div>
                <div v-else class="featured-list">
                    <div v-for="item in featuredList" :key="item.id" class="featured-item">
                        <div class="featured-head">
                            <span class="featured-star">★</span>
                            <span class="featured-name">{{ item.groupName || item.createUserName }}</span>
                            <span class="featured-tag">小组提问</span>
                            <span class="featured-time">{{ formatSupplementTime(item.createTime) }}</span>
                        </div>
                        <div class="featured-content">
                            <!-- 文字 -->
                            <p v-if="getItemText(item)">{{ getItemText(item) }}</p>
                            <!-- 图片（支持多张，点击放大） -->
                            <div v-if="getItemImages(item).length" class="featured-images">
                                <div v-for="(imgUrl, imgIdx) in getItemImages(item)" :key="'img'+imgIdx"
                                    class="featured-image" @click="previewImage(item, imgUrl)">
                                    <img :src="imgUrl" alt="学生上传的图片" />
                                    <span v-if="getItemImages(item).length > 1" class="image-index">{{ imgIdx + 1 }}</span>
                                </div>
                            </div>
                            <!-- 语音（支持多条） -->
                            <div v-for="(voiceUrl, vIdx) in getItemVoices(item)" :key="'voice'+vIdx"
                                class="featured-audio audio-player"
                                :class="{ playing: playingAudioId === (item.id + '_v' + vIdx) }"
                                @click="playVoiceByUrl(voiceUrl, item.id + '_v' + vIdx)">
                                <span class="audio-play-icon">
                                    <svg v-if="playingAudioId === (item.id + '_v' + vIdx)" xmlns="http://www.w3.org/2000/svg" width="14"
                                        height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="5" width="4" height="14" rx="1"></rect>
                                        <rect x="14" y="5" width="4" height="14" rx="1"></rect>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                        viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="6 4 20 12 6 20 6 4"></polygon>
                                    </svg>
                                </span>
                                <span class="audio-wave" v-if="playingAudioId === (item.id + '_v' + vIdx)">
                                    <i></i><i></i><i></i><i></i>
                                </span>
                                <span class="audio-text">
                                    {{ playingAudioId === (item.id + '_v' + vIdx) ? '播放中…' : '点击播放语音' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

             <!-- 图片预览弹层 -->
        <div v-if="imagePreviewVisible" class="img-preview-mask" @click.self="closeImagePreview">
            <button type="button" class="img-preview-close" @click="closeImagePreview" aria-label="关闭预览">
                <i class="el-icon-close"></i>
            </button>
            <button v-if="imagePreviewList.length > 1" type="button" class="img-preview-arrow prev"
                @click.stop="prevImage" aria-label="上一张">
                <i class="el-icon-arrow-left"></i>
            </button>
            <img :src="imagePreviewList[imagePreviewIndex]" class="img-preview-img" alt="预览图片" @click.stop />
            <button v-if="imagePreviewList.length > 1" type="button" class="img-preview-arrow next"
                @click.stop="nextImage" aria-label="下一张">
                <i class="el-icon-arrow-right"></i>
            </button>
            <div v-if="imagePreviewList.length > 1" class="img-preview-counter">
                {{ imagePreviewIndex + 1 }} / {{ imagePreviewList.length }}
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import {
    getTeacherCommonGroupBehByTh,
    getGroupStuBehByGroupId,
    getSchoolBehaviorBehcontentList
} from '@/api/hshBehaviorMan';

export default {
    name: 'classReviewDetail',
    data() {
        return {
            courseQuery: {},
            apiData: null,
            apiSelectedGroupId: '',
            // 学生互动详情数据（来自 getGroupStuBehByGroupId）
            detailStuMap: {},
            detailBehTypes: [],
            // 分组调色板
            GROUP_PALETTE: ['#EF4444', '#3388FF', '#F59E0B', '#22CC88', '#9966FF', '#EC4899', '#06B6D4', '#F2762C'],
            // 行为类型调色板
            BEH_PALETTE: ['#3388FF', '#22CC88', '#9966FF', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#F2762C', '#14B8A6'],
            // 精选问题列表
            featuredList: [],
            // 语音播放
            playingAudioId: '',
            // 图片预览
            imagePreviewVisible: false,
            imagePreviewList: [],
            imagePreviewIndex: 0,
            // ECharts 实例
            barChartIns: null,
            donutChartIns: null,
            __chartResizeHandler: null
        };
    },
    computed: {
        apiStuCount() {
            return (this.apiData && Number(this.apiData.stuCount)) || 0;
        },
        apiBehStuCount() {
            return (this.apiData && Number(this.apiData.behStuCount)) || 0;
        },
        apiTotalScore() {
            return (this.apiData && Number(this.apiData.totalScore)) || 0;
        },
        apiBehTypes() {
            const list = (this.apiData && this.apiData.behaviorTypeList) || [];
            return list.map((b, i) => ({
                behTypeId: b.behTypeId,
                behTypeName: b.behTypeName,
                cover: b.cover,
                color: this.BEH_PALETTE[i % this.BEH_PALETTE.length],
                totalScoreNum: Number(b.totalScore || 0),
                behStuCountNum: Number(b.behStuCount || 0)
            }));
        },
        apiMetrics() {
            const sorted = [...this.apiBehTypes];
            const items = sorted.map(b => ({
                key: 'bt_' + b.behTypeId,
                label: b.behTypeName,
                color: b.color,
                cover: b.cover,
                value: b.totalScoreNum,
                people: b.behStuCountNum,
                rate: this.apiStuCount ? Math.round(b.behStuCountNum / this.apiStuCount * 100) : 0
            }));
            // 末尾追加总计卡
            if (items.length) {
                items.push({
                    key: 'total',
                    label: '总计',
                    color: '#F2762C',
                    icon: '📊',
                    value: this.apiTotalScore,
                    people: this.apiBehStuCount,
                    rate: this.apiStuCount ? Math.round(this.apiBehStuCount / this.apiStuCount * 100) : 0
                });
            }
            return items;
        },
        apiGroups() {
            const list = (this.apiData && this.apiData.classroomGroupTeacherList) || [];
            return list.map((g, i) => {
                const students = (g.groupTeahcerStuList || []).map(s => ({
                    id: s.id,
                    studentId: s.studentId,
                    name: s.studentName,
                    studentNo: s.studentNo,
                    avatar: s.avatar,
                    addScore: Number(s.addScore || 0),
                    lessScore: Number(s.lessScore || 0),
                    totalScore: Number(s.totalScore || 0),
                    behaviorTypeJSONArray: s.behaviorTypeJSONArray || []
                }));
                const behTypes = (g.behaviorTypeJSONArray || []).map(b => ({
                    behTypeId: b.behTypeId,
                    behTypeName: b.behTypeName,
                    cover: b.cover,
                    totalScoreNum: Number(b.totalScore || 0),
                    behStuCountNum: Number(b.behStuCount || 0)
                }));
                return {
                    id: g.id,
                    name: g.title,
                    color: (g.colourInfo && String(g.colourInfo).trim())
                        ? g.colourInfo
                        : this.GROUP_PALETTE[i % this.GROUP_PALETTE.length],
                    totalScore: Number(g.totalScore || 0),
                    addScore: Number(g.addScore || 0),
                    lessScore: Number(g.lessScore || 0),
                    students,
                    behTypes
                };
            });
        },
        apiSortedGroups() {
            return [...this.apiGroups].sort((a, b) => b.totalScore - a.totalScore);
        },
        apiCurrentGroup() {
            if (!this.apiGroups.length) return null;
            return this.apiGroups.find(g => g.id === this.apiSelectedGroupId) || this.apiGroups[0];
        },
        apiBarMax() {
            let max = 1;
            this.apiGroups.forEach(g => {
                (g.behTypes || []).forEach(b => {
                    if (b.totalScoreNum > max) max = b.totalScoreNum;
                });
            });
            return max;
        },
        apiDonutBg() {
            const t = this.apiTotalScore || 0;
            if (!t) return '#F3F4F6';
            let deg = 0;
            const segs = [];
            this.apiBehTypes.forEach(b => {
                const d = (b.totalScoreNum / t) * 360;
                if (d > 0) {
                    segs.push(`${b.color} ${deg}deg ${deg + d}deg`);
                    deg += d;
                }
            });
            if (!segs.length) return '#F3F4F6';
            if (deg < 360) segs.push(`#F3F4F6 ${deg}deg 360deg`);
            return `conic-gradient(${segs.join(', ')})`;
        }
    },
    created() {
        const q = (this.$route && this.$route.query) || {};
        this.courseQuery = q;
        this.loadCommonGroupBeh();
        this.fetchFeaturedList();
    },
    mounted() {
        this.__chartResizeHandler = () => {
            this.barChartIns && this.barChartIns.resize();
            this.donutChartIns && this.donutChartIns.resize();
        };
        window.addEventListener('resize', this.__chartResizeHandler);
        window.addEventListener('keydown', this.handlePreviewKeydown);
    },
    beforeDestroy() {
        if (this.__chartResizeHandler) {
            window.removeEventListener('resize', this.__chartResizeHandler);
            this.__chartResizeHandler = null;
        }
        window.removeEventListener('keydown', this.handlePreviewKeydown);
        this.disposeBarChart();
        this.disposeDonutChart();
    },
    watch: {
        apiSelectedGroupId(newId) {
            if (newId) this.fetchGroupDetail(newId);
        },
        apiGroups: {
            handler() {
                this.$nextTick(() => this.renderBarChart());
            },
            deep: true
        },
        apiBehTypes: {
            handler() {
                this.$nextTick(() => {
                    this.renderBarChart();
                    this.renderDonutChart();
                });
            },
            deep: true
        }
    },
    methods: {
        // 返回上一页
        handleBack() {
            this.$router.go(-1);
        },
        // 加载主接口数据
        loadCommonGroupBeh() {
            const q = this.courseQuery || {};
            getTeacherCommonGroupBehByTh({
                behDate: q.behDate,
                classId: q.classId,
                isMorning: q.isMorning,
                nodeNumber: q.nodeNumber,
                sectionNo: q.sectionNo
            }).then(res => {
                if (res && res.data && res.data.data) {
                    this.applyApiData(res.data.data);
                } else {
                    this.apiData = null;
                }
            }).catch(err => {
                console.error('[classReviewDetail] loadCommonGroupBeh error:', err);
                this.apiData = null;
            });
        },
        // 应用主接口数据，并默认选中得分最高的小组
        applyApiData(data) {
            if (!data) return;
            this.apiData = data;
            const sorted = [...(data.classroomGroupTeacherList || [])]
                .sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0));
            const firstGroup = sorted[0];
            if (firstGroup && !this.apiSelectedGroupId) {
                this.apiSelectedGroupId = firstGroup.id;
            }
            this.$nextTick(() => {
                this.renderBarChart();
                this.renderDonutChart();
            });
        },
        // 加载选中小组的学生互动详情
        fetchGroupDetail(groupId) {
            if (!groupId) return;
            const q = this.courseQuery || {};
            getGroupStuBehByGroupId({
                behDate: q.behDate,
                classId: q.classId,
                groupId: groupId,
                isMorning: q.isMorning,
                nodeNumber: q.nodeNumber,
                sectionNo: q.sectionNo
            }).then(res => {
                const data = (res && res.data && res.data.data) || {};
                const stuList = data.stuList || [];
                const first = stuList[0];
                const behArr = (first && first.behaviorTypeJSONArray) || [];
                this.detailBehTypes = behArr.map((b, idx) => ({
                    behTypeId: b.behTypeId,
                    behTypeName: b.behTypeName,
                    cover: b.cover,
                    color: this.BEH_PALETTE[idx % this.BEH_PALETTE.length]
                }));
                const map = {};
                stuList.forEach(stu => {
                    map[String(stu.studentId)] = stu;
                });
                this.detailStuMap = map;
            }).catch(err => {
                console.error('[classReviewDetail] fetchGroupDetail error:', err);
                this.detailStuMap = {};
                this.detailBehTypes = [];
            });
        },
        // 行为类型对应颜色
        selectGroup(groupId) {
            if (!groupId || this.apiSelectedGroupId === groupId) return;
            this.apiSelectedGroupId = groupId;
        },
        groupActiveStyle(color) {
            return {
                borderColor: color,
                background: `linear-gradient(135deg, ${this.hex2rgba(color, 0.12)} 0%, ${this.hex2rgba(color, 0.04)} 100%)`,
                boxShadow: `0 14px 30px -16px ${this.hex2rgba(color, 0.65)}, inset 0 0 0 1px ${this.hex2rgba(color, 0.18)}`,
                color
            };
        },
        // 学生总分（详情接口优先，主接口降级）
        getStudentTotalScore(student) {
            if (!student) return 0;
            const detailStu = this.detailStuMap[String(student.studentId)];
            if (detailStu) {
                // 优先从 behaviorTypeJSONArray 逐项汇总（更准确，不受后端 totalScore 为0影响）
                const arr = detailStu.behaviorTypeJSONArray || [];
                if (arr.length) {
                    return arr.reduce((sum, b) => sum + (Number(b.totalScore || b.totalScoreNum || 0)), 0);
                }
                // 降级取 totalScore 字段
                if (detailStu.totalScore !== undefined && detailStu.totalScore !== null) {
                    return Number(detailStu.totalScore) || 0;
                }
            }
            return student.totalScore || 0;
        },
        getBehColor(behTypeId) {
            const hit = this.apiBehTypes.find(b => b.behTypeId === behTypeId);
            return hit ? hit.color : '#9CA3AF';
        },
        // 学生在所有行为类型上的互动详情（详情接口优先，主接口降级）
        getStudentBehTypes(student) {
            if (!student) return [];
            const detailStu = this.detailStuMap[String(student.studentId)];
            if (detailStu && this.detailBehTypes.length) {
                const stuBts = detailStu.behaviorTypeJSONArray || [];
                return this.detailBehTypes.map(t => {
                    const hit = stuBts.find(b => String(b.behTypeId) === String(t.behTypeId));
                    return {
                        behTypeId: t.behTypeId,
                        behTypeName: t.behTypeName,
                        color: t.color,
                        count: hit ? Number(hit.totalScore || 0) : 0
                    };
                });
            }
            const allTypes = this.apiBehTypes || [];
            const stuBts = student.behaviorTypeJSONArray || [];
            return allTypes.map(t => {
                const hit = stuBts.find(b => String(b.behTypeId) === String(t.behTypeId));
                return {
                    behTypeId: t.behTypeId,
                    behTypeName: t.behTypeName,
                    color: t.color,
                    count: hit ? Number(hit.totalScore || hit.totalScoreNum || 0) : 0
                };
            });
        },
        // 取小组 Top3 有分数的行为类型
        topBehOfGroup(g) {
            return (g.behTypes || [])
                .filter(b => b.totalScoreNum > 0)
                .sort((a, b) => b.totalScoreNum - a.totalScoreNum)
                .slice(0, 3);
        },
        // 柱状图高度
        apiBarH(v) {
            const max = this.apiBarMax || 1;
            return Math.max(4, (v / max) * 100) + '%';
        },
        // 环形图占比
        apiPercent(b) {
            const t = this.apiTotalScore || 1;
            return Math.round((b.totalScoreNum || 0) / t * 100);
        },
        // 维度卡片样式
        metricCardStyle(color) {
            return {
                background: `linear-gradient(135deg, ${this.hex2rgba(color, 0.12)} 0%, ${this.hex2rgba(color, 0.05)} 100%)`,
                borderColor: this.hex2rgba(color, 0.2)
            };
        },
        // hex 转 rgba
        hex2rgba(hex, a) {
            const h = (hex || '#9CA3AF').replace('#', '');
            const r = parseInt(h.substring(0, 2), 16);
            const g = parseInt(h.substring(2, 4), 16);
            const b = parseInt(h.substring(4, 6), 16);
            return `rgba(${r},${g},${b},${a})`;
        },
        // 拉取加精（最有价值的问题）列表
        fetchFeaturedList() {
            const q = this.courseQuery || {};
            const allParams = {
                behDate: q.behDate,
                classId: q.classId,
                isMorning: q.isMorning,
                nodeNumber: q.nodeNumber,
                sectionNo: q.sectionNo,
                curriculumId: q.curriculumId,
                digest: 2
            };
            const params = {};
            Object.keys(allParams).forEach(k => {
                const v = allParams[k];
                if (v !== undefined && v !== null && v !== '') {
                    params[k] = v;
                }
            });
            getSchoolBehaviorBehcontentList(params).then(res => {
                const data = (res && res.data) || {};
                let list = [];
                if (Array.isArray(data.data)) {
                    list = data.data;
                } else if (data.data && Array.isArray(data.data.list)) {
                    list = data.data.list;
                } else if (data.data && Array.isArray(data.data.records)) {
                    list = data.data.records;
                } else if (Array.isArray(data.list)) {
                    list = data.list;
                }
                if (data.code === 200 || data.result) {
                    this.featuredList = list.map(item => ({
                        id: item.id,
                        content: item.content || '',
                        type: item.type, // 1文字 2语音 3图片（旧格式）
                        videoJson: item.videoJson || '', // 图片JSON数组（新格式）
                        voiceJson: item.voiceJson || '', // 语音JSON数组（新格式）
                        createUserName: item.createUserName || '',
                        createTime: item.createTime || '',
                        groupName: item.groupName || '',
                        digest: item.digest
                    }));
                } else {
                    this.featuredList = [];
                }
            }).catch(err => {
                console.error('[classReviewDetail] fetchFeaturedList error:', err);
                this.featuredList = [];
            });
        },
        // 格式化补充时间：取 HH:mm
        formatSupplementTime(timeStr) {
            if (!timeStr) return '';
            const parts = timeStr.split(' ');
            const timePart = parts[1] || parts[0] || '';
            return timePart.substring(0, 5);
        },
        // ===== 新旧格式兼容辅助方法 =====
        // 安全解析 JSON 字符串为数组
        parseJsonArray(str) {
            if (!str) return [];
            try {
                const arr = JSON.parse(str);
                return Array.isArray(arr) ? arr : [];
            } catch (e) {
                return [];
            }
        },
        // 获取文字内容（兼容新旧格式）
        getItemText(item) {
            if (!item) return '';
            // 新格式：有 videoJson/voiceJson 字段，content 就是纯文字
            if (item.videoJson || item.voiceJson) return item.content || '';
            // 旧格式：type===1 时 content 是文字
            if (item.type === 1) return item.content || '';
            return '';
        },
        // 获取图片 URL 列表（兼容新旧格式）
        getItemImages(item) {
            if (!item) return [];
            // 新格式：从 videoJson 解析
            if (item.videoJson) {
                return this.parseJsonArray(item.videoJson).map(i => i.fileUrl).filter(Boolean);
            }
            // 旧格式：type===3，content 是图片 URL
            if (item.type === 3 && item.content) return [item.content];
            return [];
        },
        // 获取语音 URL 列表（兼容新旧格式）
        getItemVoices(item) {
            if (!item) return [];
            // 新格式：从 voiceJson 解析
            if (item.voiceJson) {
                return this.parseJsonArray(item.voiceJson).map(i => i.fileUrl).filter(Boolean);
            }
            // 旧格式：type===2，content 是语音 URL
            if (item.type === 2 && item.content) return [item.content];
            return [];
        },
        // 播放/暂停语音
        playVoiceByUrl(voiceUrl, playId) {
            if (!voiceUrl) return;
            if (this.playingAudioId === playId) {
                if (this.__audioEl) {
                    this.__audioEl.pause();
                }
                this.playingAudioId = '';
                return;
            }
            if (this.__audioEl) {
                this.__audioEl.pause();
            }
            const audio = new Audio(voiceUrl);
            audio.addEventListener('ended', () => {
                this.playingAudioId = '';
            });
            audio.addEventListener('error', () => {
                this.playingAudioId = '';
            });
            audio.play().catch(() => {
                this.playingAudioId = '';
            });
            this.__audioEl = audio;
            this.playingAudioId = playId;
        },
        // ===== 图片预览 =====
        // 预览精选图片（收集该 item 下所有图片 URL）
        previewImage(item, clickedUrl) {
            const allUrls = this.getItemImages(item);
            if (!allUrls.length) return;
            this.imagePreviewList = allUrls;
            this.imagePreviewIndex = allUrls.indexOf(clickedUrl);
            if (this.imagePreviewIndex < 0) this.imagePreviewIndex = 0;
            this.imagePreviewVisible = true;
            document.body.style.overflow = 'hidden';
        },
        closeImagePreview() {
            this.imagePreviewVisible = false;
            this.imagePreviewList = [];
            this.imagePreviewIndex = 0;
            document.body.style.overflow = '';
        },
        prevImage() {
            if (!this.imagePreviewList.length) return;
            this.imagePreviewIndex = (this.imagePreviewIndex - 1 + this.imagePreviewList.length) % this.imagePreviewList.length;
        },
        nextImage() {
            if (!this.imagePreviewList.length) return;
            this.imagePreviewIndex = (this.imagePreviewIndex + 1) % this.imagePreviewList.length;
        },
        handlePreviewKeydown(e) {
            if (!this.imagePreviewVisible) return;
            if (e.key === 'Escape') {
                this.closeImagePreview();
            } else if (e.key === 'ArrowLeft') {
                this.prevImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        },
        // 销毁柱状图实例
        disposeBarChart() {
            if (this.barChartIns) {
                this.barChartIns.dispose();
                this.barChartIns = null;
            }
        },
        // 销毁环形图实例
        disposeDonutChart() {
            if (this.donutChartIns) {
                this.donutChartIns.dispose();
                this.donutChartIns = null;
            }
        },
        // 渲染互动热力柱状图（分组×行为类型）
        renderBarChart() {
            const dom = this.$refs.barChart;
            if (!dom) {
                this.disposeBarChart();
                return;
            }
            if (!this.apiGroups.length || !this.apiBehTypes.length) {
                this.disposeBarChart();
                return;
            }
            if (!this.barChartIns) {
                this.barChartIns = echarts.init(dom);
            }
            const groups = this.apiGroups;
            const behTypes = this.apiBehTypes;
            const xData = groups.map(g => g.name);
            const series = behTypes.map(bt => ({
                name: bt.behTypeName,
                type: 'bar',
                barMaxWidth: 18,
                itemStyle: {
                    color: bt.color,
                    borderRadius: [4, 4, 0, 0]
                },
                emphasis: {
                    itemStyle: { opacity: 0.85 }
                },
                data: groups.map(g => {
                    const hit = (g.behTypes || []).find(b => String(b.behTypeId) === String(bt.behTypeId));
                    return hit ? Number(hit.totalScoreNum || 0) : 0;
                })
            }));
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    backgroundColor: 'rgba(31, 41, 55, 0.92)',
                    borderColor: 'transparent',
                    textStyle: { color: '#fff', fontSize: 12 },
                    formatter: (params) => {
                        if (!params || !params.length) return '';
                        const groupName = params[0].name;
                        let total = 0;
                        params.forEach(p => { total += Number(p.value || 0); });
                        const lines = params
                            .filter(p => Number(p.value || 0) > 0)
                            .map(p => `<div style="display:flex;align-items:center;gap:6px;margin-top:4px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};"></span><span style="flex:1;">${p.seriesName}</span><span style="font-weight:600;margin-left:12px;">${p.value} 分</span></div>`)
                            .join('');
                        return `<div style="font-weight:600;margin-bottom:2px;">${groupName}</div><div style="font-size:11px;opacity:0.8;">总计 ${total} 分</div>${lines || '<div style="opacity:0.7;margin-top:4px;">暂无互动</div>'}`;
                    }
                },
                legend: {
                    data: behTypes.map(b => b.behTypeName),
                    top: 0,
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: { color: '#6B7280', fontSize: 12 }
                },
                grid: { top: 50, right: 16, bottom: 28, left: 40, containLabel: true },
                xAxis: {
                    type: 'category',
                    data: xData,
                    axisLine: { lineStyle: { color: '#E5E7EB' } },
                    axisTick: { show: false },
                    axisLabel: { color: '#6B7280', fontSize: 12 }
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: '#F3F4F6', type: 'dashed' } },
                    axisLabel: { color: '#9CA3AF', fontSize: 12 }
                },
                series
            };
            this.barChartIns.setOption(option, true);
            this.barChartIns.resize();
        },
        // 渲染环形图（行为类型分布）
        renderDonutChart() {
            const dom = this.$refs.donutChart;
            if (!dom) {
                this.disposeDonutChart();
                return;
            }
            if (!this.apiBehTypes.length) {
                this.disposeDonutChart();
                return;
            }
            if (!this.donutChartIns) {
                this.donutChartIns = echarts.init(dom);
            }
            const data = this.apiBehTypes.map(b => ({
                name: b.behTypeName,
                value: b.totalScoreNum,
                itemStyle: { color: b.color }
            }));
            const total = this.apiTotalScore;
            const option = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(31, 41, 55, 0.92)',
                    borderColor: 'transparent',
                    textStyle: { color: '#fff', fontSize: 12 },
                    formatter: (p) => {
                        const pct = total ? ((p.value / total) * 100).toFixed(1) : 0;
                        return `<div style="display:flex;align-items:center;gap:6px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};"></span><span style="font-weight:600;">${p.name}</span></div><div style="margin-top:4px;">得分 <span style="font-weight:600;">${p.value}</span> 分 · 占比 <span style="font-weight:600;">${pct}%</span></div>`;
                    }
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 'center',
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: { color: '#374151', fontSize: 12 },
                    formatter: (name) => {
                        const hit = this.apiBehTypes.find(b => b.behTypeName === name);
                        const pct = (hit && total) ? Math.round((hit.totalScoreNum / total) * 100) : 0;
                        return `${name}  ${pct}%`;
                    }
                },
                series: [{
                    name: '行为类型',
                    type: 'pie',
                    radius: ['55%', '78%'],
                    center: ['32%', '50%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        position: 'center',
                        formatter: [`{title|${total}}`, '{sub|总计}'].join('\n'),
                        rich: {
                            title: {
                                fontSize: 26,
                                fontWeight: 700,
                                color: '#1F2937',
                                lineHeight: 32
                            },
                            sub: {
                                fontSize: 12,
                                color: '#9CA3AF',
                                lineHeight: 18
                            }
                        }
                    },
                    labelLine: { show: false },
                    emphasis: {
                        scale: true,
                        scaleSize: 6,
                        label: {
                            show: true,
                            formatter: [`{title|${total}}`, '{sub|总计}'].join('\n')
                        },
                        itemStyle: {
                            shadowBlur: 12,
                            shadowColor: 'rgba(0,0,0,0.18)'
                        }
                    },
                    data
                }]
            };
            this.donutChartIns.setOption(option, true);
            this.donutChartIns.resize();
        }
    }
};
</script>

<style scoped lang="scss">
$primary: #F2762C;
$text: #1F2937;
$sub: #6B7280;
$muted: #9CA3AF;
$card: #FFFFFF;
$border: #F0F0F0;

.class-review-detail {
    padding: 20px 24px;
    box-sizing: border-box;
    font-size: 14px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* 顶部 */
.detail-header {
    position: relative;
    padding: 20px 24px;
    margin-bottom: 4px;
    background: linear-gradient(135deg, #fff7ed 0%, #ffffff 60%, #fef3c7 100%);
    border: 1px solid rgba(242, 118, 44, 0.12);
    border-radius: 18px;
    box-shadow: 0 6px 18px -10px rgba(242, 118, 44, 0.18);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #f2762c 0%, #f59e0b 100%);
        border-radius: 4px 0 0 4px;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .course-info {
        flex: 1;
        min-width: 0;
    }

    .title-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .course-title {
        font-size: 22px;
        font-weight: 700;
        color: $text;
        line-height: 1.2;
        background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .custom-tag {
        padding: 3px 10px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #f2762c 0%, #f59e0b 100%);
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 10px -3px rgba(242, 118, 44, 0.45);
    }

    .sub-row {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 14px;
        font-size: 13px;
        color: $sub;
    }

    .sub-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(229, 231, 235, 0.8);
        border-radius: 999px;

        i {
            color: $primary;
            font-size: 13px;
        }
    }
}

/* 顶部返回 */
.page-top {
    margin-bottom: 12px;

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(6px);
        color: #4b5563;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid rgba(255, 136, 51, 0.15);
        transition: all 0.25s ease;

        i {
            font-size: 14px;
        }

        &:hover {
            color: #FF8833;
            background: #fff;
            border-color: rgba(255, 136, 51, 0.4);
            box-shadow: 0 4px 12px rgba(255, 136, 51, 0.15);
            transform: translateX(-2px);

            i {
                transform: translateX(0);
            }
        }
    }
}

/* 主体 */
.detail-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 8px 70px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 通用面板 */
.panel {
    background: $card;
    border: 1px solid $border;
    border-radius: 20px;
    padding: 22px 26px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    transition: box-shadow 0.25s ease;

    &:hover {
        box-shadow: 0 8px 24px -12px rgba(0, 0, 0, 0.08);
    }
}

.panel-title {
    position: relative;
    padding-left: 12px;
    font-size: 18px;
    font-weight: 600;
    color: $text;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background: linear-gradient(180deg, #f2762c 0%, #f59e0b 100%);
        border-radius: 2px;
    }

    &.inline {
        padding-left: 0;
        display: inline;

        &::before {
            display: none;
        }
    }
}

.panel-sub {
    padding-left: 12px;
    font-size: 13px;
    color: $sub;
    margin-top: 6px;
}

/* 维度卡 */
.metric-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.metric-card {
    border: 1px solid;
    border-radius: 20px;
    padding: 20px 22px;
    cursor: default;
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 28px -14px rgba(0, 0, 0, 0.12);
    }

    .metric-top {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
    }

    .metric-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 700;
        overflow: hidden;
    }

    .metric-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
    }

    .metric-label {
        font-size: 17px;
        font-weight: 600;
    }

    .metric-value {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin-top: 4px;

        .num {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -1px;
        }

        .unit {
            font-size: 13px;
            opacity: .7;
            font-weight: 500;
        }
    }

    .metric-foot {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: $sub;
    }
}

/* 小组活跃度 */
.group-grid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
}

.group-card {
    position: relative;
    border: 1.5px solid $border;
    border-radius: 16px;
    padding: 22px 18px 18px;
    background: #fff;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease, background 0.25s ease;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 12px;
        width: 4px;
        height: calc(100% - 24px);
        border-radius: 0 999px 999px 0;
        background: transparent;
        transition: background 0.2s ease, opacity 0.2s ease;
        opacity: 0;
    }

    &:hover {
        border-color: rgba(242, 118, 44, 0.35);
        box-shadow: 0 10px 22px -12px rgba(242, 118, 44, 0.22);
        transform: translateY(-2px);
    }

    &.active {
        transform: translateY(-3px);

        &::before {
            background: currentColor;
            opacity: 0.9;
        }

        .gname,
        .gscore {
            color: currentColor;
        }

        .gpeople {
            background: rgba(255, 255, 255, 0.72);
            color: $text;
        }
    }

    .selected-corner {
        position: absolute;
        top: 0;
        right: 0;
        width: 34px;
        height: 34px;
        color: #fff;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding: 4px 5px 0 0;
        box-sizing: border-box;
        clip-path: polygon(100% 0, 0 0, 100% 100%);
        background: currentColor;
        z-index: 2;

        i {
            font-size: 12px;
            transform: scale(0.9);
        }
    }

    .rank-badge {
        position: absolute;
        top: 0;
        right: 0;
        width: 26px;
        height: 26px;
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 16px 0 10px;
    }

    .rank-1 {
        background: linear-gradient(135deg, #F59E0B, #D97706);
    }

    .rank-2 {
        background: linear-gradient(135deg, #9CA3AF, #6B7280);
    }

    .rank-3 {
        background: linear-gradient(135deg, #B45309, #92400E);
    }

    .group-head {
        display: flex;
        align-items: center;
        gap: 8px;

        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .gname {
            font-size: 16px;
            font-weight: 600;
            color: $text;
        }

        .gpeople {
            font-size: 11px;
            color: $sub;
            background: #F3F4F6;
            padding: 2px 8px;
            border-radius: 999px;
            margin-left: auto;
        }

        .gscore {
            font-size: 18px;
            font-weight: 800;
            color: $primary;
        }
    }

    .tag-row {
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .tag {
        font-size: 11px;
        padding: 3px 10px;
        border-radius: 999px;
        font-weight: 500;
    }
}

.tag-empty {
    background: #F3F4F6;
    color: $muted;
}

/* 学生互动 */
.sub-divider {
    margin: 20px 0 18px;
    height: 1px;
    background: $border;
}

.sub-title {
    font-size: 14px;
    color: $sub;
    margin-bottom: 14px;
}

.student-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.student-card {
    border: 1px solid $border;
    border-radius: 14px;
    padding: 15px;
    background: #fff;
    transition: transform 0.2s ease, box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 18px -10px rgba(0, 0, 0, 0.1);
    }

    .stu-head {
        display: flex;
        align-items: center;
        gap: 10px;

        .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FDBA74, #FB923C);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
            flex-shrink: 0;
        }

        .avatar-img {
            object-fit: cover;
            background: #F3F4F6;
            border: 1px solid $border;
        }

        .stu-meta {
            flex: 1;
            min-width: 0;
        }

        .stu-name {
            font-size: 14px;
            font-weight: 600;
            color: $text;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .stu-sub {
            font-size: 11px;
            color: $sub;
            margin-top: 2px;
        }

        .stu-score {
            font-size: 18px;
            font-weight: 800;
            color: #FF8833;
        }
    }

    .dim-row {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
    }

    .dim-box {
        border-radius: 10px;
        padding: 8px 0;
        text-align: center;

        .dv {
            font-size: 16px;
            font-weight: 700;
            line-height: 1.1;
        }

        .dl {
            font-size: 11px;
            margin-top: 2px;
            opacity: .85;
        }
    }

    .dim-empty {
        grid-column: 1 / -1;
        background: #F3F4F6;
        color: #9CA3AF;
    }
}

/* 双图表行 */
.chart-row {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 16px;
}

/* ECharts 容器 */
.echart-bar {
    width: 100%;
    height: 280px;
    margin-top: 8px;
}

.echart-donut {
    width: 100%;
    height: 240px;
    margin-top: 8px;
}

.echart-empty {
    margin-top: 12px;
    height: 240px;
}

/* 图例 */
.legend {
    display: flex;
    gap: 14px;
    margin: 12px 0 6px;
}

.legend-wrap {
    flex-wrap: wrap;
    row-gap: 6px;
}

.lg {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: $sub;

    i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
    }
}

/* 柱状图 */
.bar-chart {
    margin-top: 12px;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 8px;
    height: 200px;
    padding: 0 4px;
}

.bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 0;
    height: 100%;

    .bars {
        flex: 1;
        min-height: 0;
        width: 100%;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 3px;
    }

    .bar {
        width: 10px;
        border-radius: 3px 3px 0 0;
        min-height: 4px;
        transition: opacity 0.2s ease;

        &:hover {
            opacity: 0.85;
        }
    }

    .bar-name {
        margin-top: 10px;
        font-size: 12px;
        color: $sub;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        text-align: center;
    }
}

/* 环形图 */
.donut-wrap {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
    padding: 10px 0;
}

.donut {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
    box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.18);

    .donut-hole {
        position: absolute;
        inset: 24px;
        background: #fff;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .dn-v {
            font-size: 26px;
            font-weight: 800;
            color: $text;
            line-height: 1;
        }

        .dn-l {
            font-size: 12px;
            color: $sub;
            margin-top: 4px;
        }
    }
}

.donut-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .dl-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: $text;

        i {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
    }
}

/* 最有价值的问题 */
.panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.head-left {
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.star-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #FEF3C7;
    color: #F59E0B;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.star-tag {
    font-size: 12px;
    color: #D97706;
    background: #FEF3C7;
    padding: 4px 10px;
    border-radius: 999px;
}

.empty-box {
    padding: 36px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .empty-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #F3F4F6;
        color: $muted;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }

    .empty-title {
        font-size: 14px;
        color: $text;
        margin-top: 6px;
    }

    .empty-sub {
        font-size: 12px;
        color: $muted;
    }
}

/* 精选问题列表 */
.featured-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 14px;
}

.featured-item {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255, 251, 235, 0.96), rgba(255, 247, 237, 0.9));
    border: 1px solid rgba(245, 158, 11, 0.22);
    border-radius: 16px;
    padding: 14px 16px 16px;
    box-shadow: 0 10px 26px -20px rgba(217, 119, 6, 0.45);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #F59E0B, #FB923C);
    }

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(245, 158, 11, 0.42);
        box-shadow: 0 16px 34px -22px rgba(217, 119, 6, 0.6);
    }
}

.featured-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    .featured-star {
        color: #F59E0B;
        font-size: 14px;
    }

    .featured-name {
        font-size: 13px;
        font-weight: 600;
        color: $text;
    }

    .featured-tag {
        font-size: 11px;
        color: #F59E0B;
        background: rgba(245, 158, 11, 0.12);
        padding: 2px 8px;
        border-radius: 999px;
    }

    .featured-time {
        margin-left: auto;
        font-size: 11px;
        color: $muted;
    }
}

.featured-content {
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    p {
        margin: 0;
        padding: 10px 12px;
        font-size: 13px;
        color: #374151;
        line-height: 1.6;
        word-break: break-all;
        background: rgba(255, 255, 255, 0.58);
        border: 1px solid rgba(245, 158, 11, 0.1);
        border-radius: 10px;
    }

    .featured-images {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
        gap: 10px;
        max-width: 520px;
    }

    .featured-image {
        position: relative;
        aspect-ratio: 4 / 3;
        border-radius: 12px;
        overflow: hidden;
        cursor: zoom-in;
        background: #fff;
        border: 1px solid rgba(245, 158, 11, 0.16);
        box-shadow: 0 8px 18px -16px rgba(0, 0, 0, 0.35);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

        &::after {
            content: '查看';
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            background: rgba(17, 24, 39, 0.34);
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        &:hover {
            transform: translateY(-2px) scale(1.02);
            border-color: rgba(245, 158, 11, 0.45);
            box-shadow: 0 12px 24px -16px rgba(0, 0, 0, 0.45);

            &::after {
                opacity: 1;
            }
        }

        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-index {
            position: absolute;
            right: 6px;
            top: 6px;
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            border-radius: 999px;
            color: #fff;
            background: rgba(17, 24, 39, 0.68);
            font-size: 11px;
            line-height: 20px;
            text-align: center;
            z-index: 1;
        }
    }

    /* 可点击播放的语音 */
    .featured-audio.audio-player {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        font-size: 12px;
        background: linear-gradient(135deg, #DBEAFE, #E0E7FF);
        color: #2563EB;
        transition: all 0.2s ease;

        &:hover {
            background: linear-gradient(135deg, #BFDBFE, #C7D2FE);
            color: #1D4ED8;
        }

        &.playing {
            background: linear-gradient(135deg, #FEF3C7, #FDE68A);
            color: #D97706;

            &:hover {
                background: linear-gradient(135deg, #FDE68A, #FCD34D);
                color: #B45309;
            }
        }

        .audio-play-icon {
            display: inline-flex;
            align-items: center;
            svg {
                display: block;
            }
        }

        .audio-wave {
            display: inline-flex;
            align-items: center;
            gap: 2px;

            i {
                display: inline-block;
                width: 3px;
                height: 12px;
                border-radius: 2px;
                background: currentColor;
                animation: audio-wave 0.8s ease-in-out infinite alternate;

                &:nth-child(2) { animation-delay: 0.15s; height: 16px; }
                &:nth-child(3) { animation-delay: 0.3s; height: 10px; }
                &:nth-child(4) { animation-delay: 0.45s; height: 14px; }
            }
        }

        .audio-text {
            font-weight: 500;
        }
    }
}

/* 空状态 */
.empty-inline {
    grid-column: 1 / -1;
    align-self: center;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    color: $muted;
    font-size: 13px;
    padding: 28px 16px;
    background: #FAFBFC;
    border: 1px dashed #E5E7EB;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;

    .ei-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #F3F4F6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        line-height: 1;
        margin-bottom: 4px;
    }

    .ei-title {
        font-size: 14px;
        font-weight: 600;
        color: $text;
    }

    .ei-sub {
        font-size: 12px;
        color: $muted;
    }
}

/* 语音波形动画 */
@keyframes audio-wave {
    from { transform: scaleY(0.4); }
    to { transform: scaleY(1); }
}

/* ========== 图片预览弹层 ========== */
.img-preview-mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    box-sizing: border-box;
    animation: fadeIn 0.18s ease;
}

.img-preview-img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    user-select: none;
}

.img-preview-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.16);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: rgba(242, 118, 44, 0.9);
    }
}

.img-preview-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.16);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: rgba(242, 118, 44, 0.9);
    }

    &.prev { left: 24px; }
    &.next { right: 24px; }
}

.img-preview-counter {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 12px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    line-height: 1.4;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* 响应式 */
@media (max-width: 1280px) {
    .metric-row {
        grid-template-columns: repeat(2, 1fr);
    }

    .group-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .student-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .detail-content {
        padding: 8px 24px 24px;
    }
}

@media (max-width: 960px) {

    .group-grid,
    .student-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .chart-row {
        grid-template-columns: 1fr;
    }
}
</style>
