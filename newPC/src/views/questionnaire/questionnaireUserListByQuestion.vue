<template>
    <div class="page">
        <back-tool>
            <a :href="exportUrl" download="按选项导出" target="_blank"  v-if="userList.length">
                <el-button class="filter-item" size="medium"  type="primary">导出</el-button>
            </a>
            &nbsp;
            <el-select size="medium"  @change="getOptionUserListFunc" value="0" v-if="sendUserType === 2" v-model="classId"  placeholder="请选择">
                <el-option label="全部班级" :value="0">
                </el-option>
                <el-option :label="classItem.className" :value="classItem.classId" :key="index" v-for="(classItem, index) in classList"></el-option>
            </el-select>
        </back-tool>
        <div class="user-list" v-if="isHaveReason === 0 && type !== 14 && type !== 21">
            <div class="user-item" v-for="(userItem, index) in userList" :key="index">
                <div class="user-item__inner">
                    <div class="user-item__photo" :style="{ backgroundImage: `url(${userItem.avatar})` }"></div>
                    <div class="user-item__name">{{ userItem.userName }}</div>
                </div>
            </div>
        </div>
        <ul v-else class="answer-container">
            <li class="answer-item" v-for="(userItem, index) in userList" :key="index">
                <div v-if="type === 14 || type === 21" v-html="parseFillblank(userItem.optionAnswer)"></div>
                <div v-else>{{userItem.optionAnswer}}</div>
                <div class="answer-item__user-name">{{userItem.userName}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {getOptionUserList, getVoteClassListByVoteId} from '@/api/questionnaire';

    export default {
        name: "questionnaireUserListByQuestion",
        data: function() {
            return {
                type: parseInt(this.$route.query.type),
                voteId: this.$route.query.voteId,
                optionId: this.$route.query.optionId,
                sendUserType: parseInt(this.$route.query.sendUserType),
                isHaveReason: this.$route.query.isHaveReason,
                userList: [],
                classId: 0,
                classList: []
            }
        },
        components: {
            BackTool
        },
        computed: {
            exportUrl() {
                return `${global.homeworkfetch}structure/voteTwo/exportOptionUserList?classId=${this.classId}&schoolYear=${this.$store.getters.selectedSchoolYear}&isHaveReason=${this.isHaveReason}&optionId=${this.optionId}&sendUserType=${this.sendUserType}&token=${this.$store.getters.token}`;
            }
        },
        created() {
            if(this.sendUserType === 2) {
                getVoteClassListByVoteId({
                    voteId: this.voteId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.classList = data.data;
                        this.getOptionUserListFunc();
                    })
            } else {
                this.getOptionUserListFunc();
            }

        },
        methods: {
            parseFillblank(title) {
                return title.replace(/{(.*?)}/g, (_, content) => {
                    return `<span style="border-bottom: 1px solid #000;">${content || '_____'}</span>`;
                });
            },
            getOptionUserListFunc() {
                getOptionUserList({
                    classId: this.classId,
                    optionId: this.optionId
                })
                    .then(res =>res.data)
                    .then(data => {
                        this.userList = data.data.filter(userItem => !!userItem.userName);
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin";

    @include globalstyle;
    .page {
        padding:12px;
    }
    .user-list {
        height: 600px;
        overflow-y: auto;
        @include clearfix;
        margin-top: 20px;
        .user-item {
            width: 12.5%;
            margin-top: 5px;
            float: left;
            text-align: center;
            .user-item__photo {
                @include wh(80px, 80px);
                @include cover-bg;
                margin: 0 auto 5px auto;
                border-radius: 50%;
            }
        }
    }
    .answer-container {
        width: 70%;
        margin: 10px auto 0 auto;
        padding: 0 10px;
    }
    .answer-item {
        padding: 8px;
        border-bottom: 1px solid #ddd;
        .answer-item__user-name {
            text-align: right;
        }
    }
</style>
