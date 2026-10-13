<template>
    <div id="questionnaireDetail" class="page">
        <div class="tab-header">
            <el-button class="tab-header__back" @click="$router.back()" icon="el-icon-arrow-left" size="medium">返回</el-button>
            <div class="tab-header__tabs">
                <div
                    :class="['tab-header__tab', activeTab === 'content' ? 'tab-header__tab--active' : '']"
                    @click="activeTab = 'content'"
                >内容</div>
                <div
                    :class="['tab-header__tab', activeTab === 'setting' ? 'tab-header__tab--active' : '']"
                    @click="activeTab = 'setting'"
                >设置</div>
                <div
                    :class="['tab-header__tab', activeTab === 'logic' ? 'tab-header__tab--active' : '']"
                    @click="activeTab = 'logic'"
                >逻辑</div>
            </div>
            <div class="tab-header__actions">
                <template v-if="isSelectedYearCurrent">
                    <el-button class="tab-header__action" type="primary" size="medium" v-if="voteStatus === 1" @click="jumpToPage('questionnaireEdit', {id})">编辑</el-button>
                    <el-button class="tab-header__action" type="success" size="medium" v-if="voteStatus === 1" @click="questionnairePublish">发布</el-button>
                    <span class="tab-header__address-btn"><address-book size="medium" v-model="teacherAddressData" v-if="voteStatus === 2 && !isOnSend && sendUserType === 1" :config="teacherAddressConfigData" :isbutton="true" @input="reissueQuestionnaire">补发</address-book></span>
                    <span class="tab-header__address-btn"><address-book size="medium" v-model="studentAddressData" v-if="voteStatus === 2 && !isOnSend && sendUserType === 2" :config="studentAddressConfigData" :isbutton="true" @input="reissueQuestionnaire">补发</address-book></span>
                    <el-button class="tab-header__action" size="medium" type="primary" v-if="!isArea && voteStatus !== 1" @click="updateExpriyDate">保存</el-button>
                </template>
                <el-button class="tab-header__action" size="medium" @click="printHandler">打印</el-button>
            </div>
        </div>
        <div class="questionnaire-container" v-show="activeTab === 'content'" :style="{height: `${maxH + 40}px`}">
            <div class="questionnaire-header" ref="print">
                <div class="questionnaire-title">{{voteTitle}}</div>
                <div class="questionnaire-sub">
                    <div>
                        {{(sendTime || createTime) }}
                    </div>
                    <div>
                        {{inscribe || createUserName}}
                    </div>
                    <div>
                        截止时间：
                        <el-date-picker
                            v-if="!isArea && voteStatus === 2"
                            v-model="expriyDate"
                            format="yyyy-MM-dd HH:mm"
                            type="datetime"
                            size="small"
                            :editable="false"
                            :clearable="false"
                            placeholder="选择截止时间">
                        </el-date-picker>
                        <span v-else>{{expriyDate}}</span>
                    </div>
                </div>
                <pre class="questionnaire-desc" >{{voteDesc}}</pre>
                <div class="questionnaire-info">
                    <template v-if="!isArea">
                        本次问卷调查范围
                        <template v-if="sendUserType === 1">
                            <span v-for="item in thScope.userList">{{item.name}}</span><span v-for="item in thScope.groupList">{{item.name}}</span><span v-for="item in thScope.departList">{{item.name}}</span>
                        </template>
                        <template v-else>
                            <span v-for="item in stuDepart">{{item.name}}</span><span v-for="item in stuUser">{{item.name}}</span><span v-for="item in stuGroupJson">{{item.name}}</span>
                        </template>
                        。
                    </template>
                    <span v-if="maxVoteCount !== 0">限选{{maxVoteCount}}人，</span>
                    问卷类型：<span v-if="sendUserType === 1">老师问卷</span><span v-else>学生问卷</span>
                    <el-checkbox v-model="isShowResult" :true-label="1" :false-label="2">可查看结果</el-checkbox>
                    <el-checkbox v-model="anonymous" :true-label="1" :false-label="2">匿名</el-checkbox>
                </div>
                <div class="questionnaire-content">
                    <template v-for="(questionItem, questionIndex) in topicList">
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 1"
                            class="question-item quetion-item--single-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.selectedMax !== 0" type="primary">限选{{questionItem.selectedMax}}</el-tag>
                            </div>
                            <div class="question-item__choice radius" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                <el-checkbox :true-label="1" :false-label="0" :value="optionItem.isHaveReason" :label="optionItem.optionTitle" />
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 22"
                            class="question-item quetion-item--single-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.selectedMax !== 0" type="primary">限选{{questionItem.selectedMax}}</el-tag>
                            </div>
                            <div class="question-item__choice">
                                <el-select>
                                    <el-option :value="optionItem.isHaveReason" :label="optionItem.optionTitle" v-for="(optionItem, optionIndex) in questionItem.optionList"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 24"
                            class="question-item quetion-item--single-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">评分单选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.selectedMax !== 0" type="primary">限选{{questionItem.selectedMax}}</el-tag>
                            </div>
                            <div class="question-item__choice radius" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                <el-checkbox :true-label="1" :false-label="0" :value="optionItem.isHaveReason" :label="optionItem.optionTitle" />
                                <span class="question-item__score">{{optionItem.score}}分</span>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 14"
                            class="question-item quetion-item--multiple-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">多项填空</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.selectedMax !== 0" type="primary">限选{{questionItem.selectedMax}}</el-tag>
                            </div>
                            <div class="question-item__choice" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                <span class="request-hint" v-if="optionItem.isHaveReason === 1">*</span>
                                <span v-html="parseFillblank(optionItem.optionTitle)"></span>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 2"
                            class="question-item quetion-item--multiple-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">多选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.selectedMax !== 0" type="primary">限选{{questionItem.selectedMax}}</el-tag>
                            </div>
                            <div class="question-item__choice" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                <el-checkbox :true-label="1" :false-label="0" :value="optionItem.isHaveReason" :label="optionItem.optionTitle" />
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 23"
                            class="question-item quetion-item--multiple-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">多选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.selectedMax !== 0" type="primary">限选{{questionItem.selectedMax}}</el-tag>
                            </div>
                            <div class="question-item__choice">
                                <el-select >
                                    <el-option :value="optionItem.isHaveReason" :label="optionItem.optionTitle" v-for="(optionItem, optionIndex) in questionItem.optionList"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 21"
                            class="question-item quetion-item--multiple-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">多项填空</el-tag>&nbsp;&nbsp;
                            </div>
                            <div class="question-item__choice" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                <span class="request-hint" v-if="optionItem.isHaveReason === 1">*</span>
                                <span v-html="parseFillblank(optionItem.optionTitle)"></span>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 3"
                            class="question-item quetion-item--pic-multiple-choice"
                        >
                            <div class="question-item__title">{{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.selectedMax !== 0" type="primary">限选{{questionItem.selectedMax}}</el-tag>
                            </div>
                            <image-previewer tag="richtext" viewclass="question-item__choice-pic" :images="questionItem.picList">
                                <div class="question-pic-container">
                                    <div class="question-item__choice radius" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                        <div class="question-item__choice-pic" :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"></div>
                                        <img :src="optionItem.optionPicUrl" class="print-only question-pic" />
                                        <div><el-checkbox :true-label="1" :false-label="0" :value="optionItem.isHaveReason" :label="optionItem.optionTitle" /></div>
                                    </div>
                                </div>
                            </image-previewer>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 4"
                            class="question-item quetion-item--pic-multiple-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">多选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.selectedMax !== 0" type="primary">限选{{questionItem.selectedMax}}</el-tag>
                            </div>
                            <image-previewer tag="richtext" viewclass="question-item__choice-pic" :images="questionItem.picList">
                                <div class="question-pic-container">
                                    <div class="question-item__choice" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                        <div class="question-item__choice-pic" :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"></div>
                                        <img :src="optionItem.optionPicUrl" class="print-only question-pic" />
                                        <div><el-checkbox :true-label="1" :false-label="0" :value="optionItem.isHaveReason" :label="optionItem.optionTitle" /></div>
                                    </div>
                                </div>

                            </image-previewer>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 5"
                            class="question-item question-item--qna"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">简答</el-tag>&nbsp;&nbsp;
                            </div>
                            <div class="question-item__answer-area">
                                <el-input type="textarea" :rows="5" :disabled="true"></el-input>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 6"
                            class="question-item question-item--fill-blank"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span><span v-html="parseFillblank(questionItem.topicTitle)"></span>
                                <el-tag type="primary">填空</el-tag>&nbsp;&nbsp;
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 7"
                            class="question-item question-item--fill-label"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicTitle}}
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 8"
                            class="question-item question-item--fill-label"
                        >
                            <div class="divider"></div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 9"
                            class="question-item question-item--address"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">地址</el-tag>&nbsp;&nbsp;
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 10"
                            class="question-item quetion-item--pic-single-uploader"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">单张图片上传</el-tag>&nbsp;&nbsp;
                            </div>
                            <div>
                                <div class="img-upload"></div>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 11"
                            class="question-item quetion-item--pic-multiple-uploader"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">多张图片上传</el-tag>&nbsp;&nbsp;
                            </div>
                            <div>
                                <div class="img-upload"></div>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 12"
                            class="question-item quetion-item--rate"
                        >
                            <div class="question-item__title">{{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">评分</el-tag>&nbsp;&nbsp;
                            </div>
                            <div>
                                <el-rate></el-rate>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 15"
                            class="question-item quetion-item--rate"
                        >
                            <div class="question-item__title">{{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">手机号</el-tag>&nbsp;&nbsp;
                            </div>
                            <div>
                                <el-input type="text" readonly="readonly" :value="''">
                                </el-input>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 16"
                            class="question-item quetion-item--rate"
                        >
                            <div class="question-item__title">{{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">邮箱</el-tag>&nbsp;&nbsp;
                            </div>
                            <div>
                                <el-input type="text" readonly="readonly" :value="''">
                                </el-input>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 17"
                            class="question-item quetion-item--rate"
                        >
                            <div class="question-item__title">{{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">身份证</el-tag>&nbsp;&nbsp;
                            </div>
                            <div>
                                <el-input type="text" readonly="readonly" :value="''">
                                </el-input>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 18"
                            class="question-item quetion-item--rate"
                        >
                            <div class="question-item__title">{{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">日期</el-tag>&nbsp;&nbsp;
                            </div>
                            <div>
                                <el-input type="text" readonly="readonly" :value="''">
                                </el-input>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topType === 19"
                            class="question-item quetion-item--rate"
                        >
                            <div class="question-item__title">{{questionItem.topicSeq}}.<span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">时间</el-tag>&nbsp;&nbsp;
                            </div>
                            <div>
                                <el-input type="text" readonly="readonly" :value="''">
                                </el-input>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </div>
        <!-- 设置面板 -->
        <div class="setting-panel" v-show="activeTab === 'setting'">
            <div class="setting-form">
                <div class="setting-form-item">
                    <label class="setting-label">发送范围</label>
                    <div class="setting-content">
                        <!-- <span class="setting-value">{{ sendUserType === 1 ? '老师' : '学生' }}</span> -->
                        <div class="setting-scope" v-if="!isArea">
                            <template v-if="sendUserType === 1">
                                <el-tag size="small" v-for="item in thScope.userList" :key="item.id">{{item.name}}</el-tag>
                                <el-tag size="small" v-for="item in thScope.groupList" :key="item.id">{{item.name}}</el-tag>
                                <el-tag size="small" v-for="item in thScope.departList" :key="item.id">{{item.name}}</el-tag>
                            </template>
                            <template v-else>
                                <el-tag size="small" v-for="item in stuDepart" :key="item.id">{{item.name}}</el-tag>
                                <el-tag size="small" v-for="item in stuUser" :key="item.id">{{item.name}}</el-tag>
                                <el-tag size="small" v-for="item in stuGroupJson" :key="item.id">{{item.name}}</el-tag>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="setting-form-item">
                    <label class="setting-label">权限设置</label>
                    <div class="setting-content">
                        <el-tag :type="isShowResult === 1 ? 'success' : 'info'" size="small">{{ isShowResult === 1 ? '可查看问卷结果' : '不可查看结果' }}</el-tag>
                        <el-tag :type="anonymous === 1 ? '' : 'warning'" size="small">{{ anonymous === 1 ? '匿名问卷' : '实名问卷' }}</el-tag>
                        <el-tag v-if="maxVoteCount !== 0" type="primary" size="small">限答 {{ maxVoteCount }} 人</el-tag>
                    </div>
                </div>
                <div class="setting-form-item">
                    <label class="setting-label">截止时间</label>
                    <div class="setting-content">
                        <span class="setting-value">{{ expriyDate }}</span>
                    </div>
                </div>
                <div class="setting-form-item" v-if="onSendTime">
                    <label class="setting-label">定时发送</label>
                    <div class="setting-content">
                        <span class="setting-value">{{ onSendTime }}</span>
                    </div>
                </div>
                <div class="setting-form-item">
                    <label class="setting-label">落款</label>
                    <div class="setting-content">
                        <span class="setting-value">{{ inscribe || '无' }}</span>
                    </div>
                </div>
                <div class="setting-form-item" v-if="logoUrl">
                    <label class="setting-label">封面</label>
                    <div class="setting-content">
                        <img class="setting-cover" :src="logoUrl" />
                    </div>
                </div>
            </div>
        </div>
        <!-- 逻辑设置面板 -->
        <div class="logic-panel" v-show="activeTab === 'logic'" :style="{height: `${maxH + 40}px`}">
            <div class="logic-workspace">
                <div class="logic-config-panel">
                    <div class="logic-toolbar">
                        <div>
                            <div class="logic-toolbar__title">逻辑规则</div>
                            <div class="logic-toolbar__desc">以下为该问卷配置的逻辑规则（只读）</div>
                        </div>
                    </div>
                    <div class="logic-rules-list">
                        <div class="logic-rule-card" v-for="(rule, ruleIndex) in logicRules" :key="rule.id || ruleIndex">
                            <div class="logic-rule-card__header">
                                <span class="logic-rule-card__title">规则 {{ ruleIndex + 1 }}</span>
                            </div>
                            <div class="logic-rule-row">
                                <span class="logic-keyword">如果</span>
                                <span class="logic-value">{{ formatQuestionLabel(getLogicQuestion(rule.conditionQuestion)) }}</span>
                                <span class="logic-operator">选中</span>
                                <span class="logic-value">{{ formatOptionLabel(getLogicOptionObj(rule.conditionQuestion, rule.conditionOption)) }}</span>
                            </div>
                            <div class="logic-rule-row">
                                <span class="logic-keyword">则</span>
                                <span class="logic-value">{{ getActionText(rule.actionType) }}</span>
                                <span class="logic-value">{{ formatQuestionLabel(getLogicQuestion(rule.actionQuestion)) }}</span>
                            </div>
                            <div class="logic-rule-row">
                                <span class="logic-keyword">否则</span>
                                <span class="logic-else-fixed">{{ getElseText(rule.actionType) }}</span>
                            </div>
                        </div>
                        <div class="logic-empty" v-if="logicRules.length === 0">
                            <p>暂无逻辑规则</p>
                        </div>
                    </div>
                </div>
                <div class="logic-preview-panel">
                    <div class="logic-preview-panel__title">逻辑流程预览</div>
                    <div class="logic-flow" v-if="logicFlowNodes.length">
                        <div class="logic-flow-node logic-flow-node--start">开始</div>
                        <div v-for="(node, nodeIndex) in logicFlowNodes" :key="node.key" class="logic-flow-group">
                            <div class="logic-flow-line"></div>
                            <div class="logic-flow-node">{{ node.title }}</div>
                            <div class="logic-flow-branches" v-if="node.rules.length">
                                <div class="logic-flow-branch" v-for="rule in node.rules" :key="rule.id">
                                    <div class="logic-flow-branch__condition">{{ rule.optionTitle }}</div>
                                    <div class="logic-flow-branch__line"></div>
                                    <div :class="['logic-flow-node', 'logic-flow-node--target', 'logic-flow-node--' + rule.actionType]">
                                        {{ rule.actionText }} {{ rule.targetTitle }}
                                    </div>
                                </div>
                            </div>
                            <div class="logic-flow-line" v-if="nodeIndex === logicFlowNodes.length - 1"></div>
                        </div>
                        <div class="logic-flow-node logic-flow-node--end">提交</div>
                    </div>
                    <div class="logic-preview-empty" v-else>
                        暂无逻辑规则
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import baseMixin from '@/mixins/baseMixin';
    import moment from 'moment';
    import mixin from '@/mixins/windowResize';
    import {getVoteTwoById, againSendVote, updateVoteTwoExpriyDate, updateVoteTwo, getVoteTwoRuleList} from '@/api/questionnaire';
    import {mapGetters} from "vuex";

    export default {
        name: "questionnaireDetail",
        computed: {
            ...mapGetters(['isSelectedYearCurrent', 'selectedSchoolYear']),
            logicFlowNodes() {
                const validRules = this.logicRules.filter(rule => rule.conditionQuestion && rule.conditionOption && rule.actionQuestion);
                // 仅排除 show/hide 规则的目标题目，jump 跳转目标保留在主流程中
                const branchTargetSeqs = validRules.filter(rule => rule.actionType !== 'jump').map(rule => rule.actionQuestion);
                return this.topicList
                    .filter(item => item.topicSeq && item.topType !== 7 && item.topType !== 8 && branchTargetSeqs.indexOf(item.topicSeq) === -1)
                    .map(question => {
                        const rules = validRules
                            .filter(rule => rule.conditionQuestion === question.topicSeq)
                            .map(rule => {
                                const option = this.getQuestionOptions(rule.conditionQuestion).find(item => item.optionSeq === rule.conditionOption);
                                const target = this.topicList.find(item => item.topicSeq === rule.actionQuestion);
                                return {
                                    id: `${rule.id}-hit`,
                                    actionType: rule.actionType,
                                    actionText: this.getActionText(rule.actionType),
                                    optionTitle: option ? this.formatOptionLabel(option) : '选项' + rule.conditionOption,
                                    targetTitle: target ? '题目' + target.topicSeq : '未选择题目'
                                };
                            });
                        return {
                            key: question.topicSeq,
                            title: '题目' + question.topicSeq,
                            rules
                        };
                    });
            }
        },
        data: function() {
            return {
                activeTab: 'content',
                logicRules: [],

                isArea: this.$route.query.isArea == 1,
                isOnSend: this.$route.query.isOnSend == 1,

                sendTime: '',
                createTime: '',

                createUserName: '',
                inscribe: '',
                expriyDate: '',
                oldExpriyDate: '',
                id: this.$route.query.id,
                voteTitle: '',
                voteDesc: '',
                sendUserType: null,
                anonymous: 1,
                topicList: [],
                voteStatus: null,
                isShowResult: 2,
                maxVoteCount: 0,
                stuDepartJson: '[]',
                stuDepart: [],
                stuGroupJson:[],
                stuUser: [],
                stuUserJson: '[]',
                thScopeJson: '{}',
                thScope: {},
                teacherAddressData: {},
                studentAddressData: {},
                logoUrl: '',
                onSendTime: '',

                teacherAddressConfigData: {
                    title: '请选择老师',
                    depart: {target: 'all', departType: 't', userTypes: '1', notCheckSchool: true},
                    group: true,

                },
                studentAddressConfigData: {
                    title: '请选择学生班级',
                    depart: {target: 'all', departType: 's', userTypes: '2', notCheckSchool: true},
                    notCheckSchool: true,
                   group: {
                            groupTarget: 'all',
                            groupScope: [2]
                        }
                }
            }
        },
        
        mixins: [baseMixin,mixin],
        components: {
            ImagePreviewer,
            AddressBook
        },
        created() {
            getVoteTwoById({
                voteId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    pageData.topicList.forEach(item => {
                        if (item.topType === 4 || item.topType === 3) {
                            item.picList = item.optionList.map(item => ({src: item.optionPicUrl}));
                        }
                    });
                    this.inscribe = pageData.inscribe;
                    this.createUserName = pageData.createUserName;
                    this.voteTitle = pageData.voteTitle;
                    this.voteDesc = pageData.voteDesc;
                    this.sendUserType = pageData.sendUserType;
                    this.expriyDate = moment(pageData.expriyDate).format('YYYY-MM-DD HH:mm');
                    this.oldExpriyDate = moment(pageData.expriyDate).format('YYYY-MM-DD HH:mm');
                    this.onSendTime = pageData.onSendTime ? this.$moment(pageData.onSendTime).format('YYYY-MM-DD HH:mm') : '';
                    this.anonymous = pageData.anonymous;
                    this.topicList = pageData.topicList;
                    if(!this.isArea) {
                        this.stuDepartJson = pageData.stuDepartJson;
                        this.stuDepart = JSON.parse(pageData.stuDepartJson);
                        this.thScopeJson = pageData.thScopeJson;
                        this.thScope = JSON.parse(pageData.thScopeJson);
                        this.stuUser = JSON.parse(pageData.stuUserJson || '[]');
                        this.stuGroupJson= JSON.parse(pageData.stuGroupJson || '[]');
                        this.stuUserJson = pageData.stuUserJson || '[]';

                    }
                    this.voteStatus = pageData.voteStatus;
                    this.isShowResult = pageData.isShowResult;
                    this.maxVoteCount = pageData.maxVoteCount;
                    this.sendTime = pageData.sendTime;
                    this.createTime = pageData.createTime;
                    this.logoUrl = pageData.logoUrl;

                    if(pageData.sendUserType === 1) {
                        const thScope = JSON.parse(pageData.thScopeJson);

                        this.teacherAddressData = {
                            userJson: [],
                            departJson: [],
                            groupJson: []
                        };
                    } else {
                        this.studentAddressData = {
                            userJson: [],
                            departJson: [],
                            groupJson: []
                        }
                    }
                    this.loadLogicRules();
                });
        },
        methods: {
            printHandler(){
                this.$print(this.$refs.print);
            },
            parseFillblank(title) {
                return title.replace(/{(\d+?)}/g, function(_, num) {
                    return `<input disabled type="text" class="blank" maxlength="${num}" style="width: ${num * 20}px" />`
                });
            },
            updateExpriyDate() {
                if(!this.expriyDate) {
                    this.$message.error('请填写截止时间！');
                } else {
                    updateVoteTwoExpriyDate({
                        expriyDate: moment(this.expriyDate).format('YYYY-MM-DD HH:mm'),
                        id: this.id,
                        anonymous: this.anonymous,
                        isShowResult: this.isShowResult
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                const _this = this;
                                this.$message({
                                    message: '修改成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            }
                        })
                }

            },
            questionnairePublish() {
                if(this.onSendTime && this.onSendTime > this.expriyDate) {
                    this.$message.error('定时发送时间须小于截止时间');
                } else if(this.onSendTime && this.onSendTime > this.$moment().add('days', 7).format('YYYY-MM-DD HH:mm')) {
                    this.$message.error('定时发送时间距今须小于7天');
                } else if(this.onSendTime && this.onSendTime < this.$moment().format('YYYY-MM-DD HH:mm')) {
                    this.$message.error('定时发送时间须大于当前时间');
                } else {
                    const formData = {
                        inscribe: this.inscribe,
                        anonymous: this.anonymous,
                        expriyDate: this.expriyDate,
                        id: this.id,
                        isShowResult: this.isShowResult,
                        maxVoteCount: this.maxVoteCount,
                        sendUserType: this.sendUserType,
                        stuDepartJson: this.stuDepartJson,
                        stuUserJson: this.stuUserJson,
                        thScopeJson: this.thScopeJson,
                        stuGroupJson:this.stuGroupJson,
                        topicList: this.topicList,
                        voteDesc: this.voteDesc,
                        voteStatus: 2,
                        voteTitle: this.voteTitle,
                        logoUrl: this.logoUrl,
                        onSendTime: this.onSendTime ? `${this.$moment(this.onSendTime).format('YYYY-MM-DD HH:mm')}:00` : '',
                        onTime: this.onSendTime ? 2 : 1
                    };

                    updateVoteTwo(formData)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                const _this = this;

                                this.$message({
                                    message: '发布成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            }
                        })
                }

            },
            reissueQuestionnaire() {
                const teacherAddressData = {
                    userList: this.teacherAddressData.userJson || [],
                    departList: this.teacherAddressData.departJson || [],
                    groupList: this.teacherAddressData.groupJson || [],
                };

                if(this.sendUserType === 1 &&
                    teacherAddressData.userList.length === 0 &&
                    teacherAddressData.departList.length === 0 &&
                    teacherAddressData.groupList.length === 0
                ) {
                    this.$message.error('请选择补发人员');
                } else if(this.sendUserType === 2 &&
                    this.studentAddressData.departJson.length === 0 && this.studentAddressData.userJson.length === 0&& this.studentAddressData.groupJson.length===0) {
                    this.$message.error('请选择补发人员');
                } else if(moment().format('YYYY-MM-DD HH:mm') >= moment(this.oldExpriyDate).format('YYYY-MM-DD HH:mm')) {
                    this.$message.error('截止时间须大于当前时间');
                } else {
                    againSendVote({
                        id: this.id,
                        sendUserType: this.sendUserType,
                        stuDepartJson: this.sendUserType === 2 ? this.studentAddressData.departJson : {},
                        stuUserJson: this.sendUserType === 2 ? this.studentAddressData.userJson : {},
                        stuGroupJson:this.sendUserType === 2 ? this.studentAddressData.groupJson : [],
                        thScopeJson: this.sendUserType === 1 ? teacherAddressData : {},
                        logoUrl: this.logoUrl,
                        againType: 3
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                const _this = this;
                                this.$message({
                                    message: '补发成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            }
                        })
                }


            },
            loadLogicRules() {
                if (!this.id) return;
                const schoolYear = this.getCurrentSchoolYear();
                getVoteTwoRuleList({ voteId: this.id }, schoolYear)
                    .then(res => res.data)
                    .then(data => {
                        if ((data.result || data.code === 200) && data.data) {
                            this.logicRules = data.data.map(item => this.normalizeLogicRule(item));
                        }
                    });
            },
            getCurrentSchoolYear() {
                if (this.selectedSchoolYear && typeof this.selectedSchoolYear === 'object') {
                    return this.selectedSchoolYear.year || this.selectedSchoolYear.id || '';
                }
                return this.selectedSchoolYear || '';
            },
            normalizeLogicRule(item) {
                const conditionQuestion = this.findTopicSeqByCode(item.topicCode);
                const actionQuestion = this.findTopicSeqByCode(item.topicCodeShow);
                return {
                    id: item.id || Date.now() + Math.random(),
                    conditionQuestion,
                    conditionOption: this.findOptionSeqByCode(conditionQuestion, item.optionCode),
                    actionType: item.showType === 2 ? 'hide' : item.showType === 3 ? 'jump' : 'show',
                    actionQuestion,
                    elseActionType: 'hide',
                    elseActionQuestion: ''
                };
            },
            findTopicSeqByCode(topicCode) {
                const code = String(topicCode || '');
                if (!code) return '';
                const question = this.topicList.find(item => {
                    return String(item.topicCode || '') === code
                        || String(item.id || '') === code
                        || String(item.topicSeq || '') === code;
                });
                return question ? question.topicSeq : '';
            },
            findOptionSeqByCode(topicSeq, optionCode) {
                const code = String(optionCode || '');
                if (!code || !topicSeq) return '';
                const options = this.getQuestionOptions(topicSeq);
                const option = options.find(item => {
                    return String(item.optionCode || '') === code
                        || String(item.id || '') === code
                        || String(item.optionSeq || '') === code;
                });
                return option ? option.optionSeq : '';
            },
            getLogicQuestion(topicSeq) {
                return this.topicList.find(item => item.topicSeq === topicSeq);
            },
            getQuestionOptions(topicSeq) {
                const question = this.topicList.find(item => item.topicSeq === topicSeq);
                return question && question.optionList ? question.optionList : [];
            },
            getLogicOptionObj(topicSeq, optionSeq) {
                const options = this.getQuestionOptions(topicSeq);
                return options.find(item => item.optionSeq === optionSeq);
            },
            formatQuestionLabel(question) {
                if (!question) return '未选择题目';
                return `题目${question.topicSeq} ${question.topicTitle || ''}`;
            },
            formatOptionLabel(option) {
                if (!option) return '未选择选项';
                return option.optionTitle || `选项${option.optionSeq}`;
            },
            getActionText(actionType) {
                const actionTextMap = {
                    show: '显示',
                    hide: '隐藏',
                    jump: '跳转到',
                    next: '进入'
                };
                return actionTextMap[actionType] || '处理';
            },
            getElseText(actionType) {
                if (actionType === 'hide') return '显示';
                if (actionType === 'jump') return '进入下一题';
                return '隐藏';
            }
        }
    }
</script>
<style>
.question-item__choice.radius .el-checkbox__inner{
   border-radius: 50%;
}
.question-item__choice.radius .el-checkbox__input.is-checked .el-checkbox__inner:after{
    transform: translate(-50%, -50%) scale(1);
}
.question-item__choice.radius .el-checkbox__inner::after{
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #fff;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform .15s ease-in;
}
</style>

<style scoped lang="scss">
    @import "../../styles/mixin";
    @include globalstyle;

    .page {
        min-height: 100vh;
        padding: 16px;
        background: #f5f7fb;
        box-sizing: border-box;
    }

    .tab-header {
        position: sticky;
        top: 16px;
        z-index: 100;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 64px;
        padding: 0 18px;
        margin: 0 auto 22px;
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid #ebeef5;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(31, 45, 61, 0.12);
        box-sizing: border-box;
        backdrop-filter: blur(8px);

        .tab-header__back {
            border-radius: 18px;
        }

        .tab-header__tabs {
            display: flex;
            align-items: center;
            margin-left: 24px;
            padding: 4px;
            background: #f2f6fc;
            border-radius: 22px;
        
            .tab-header__tab {
                min-width: 74px;
                padding: 9px 18px;
                font-size: 14px;
                line-height: 1;
                color: #606266;
                text-align: center;
                cursor: pointer;
                border-radius: 18px;
                transition: color 0.2s, background-color 0.2s, box-shadow 0.2s;
        
                &:hover {
                    color: #409eff;
                    background: #fff;
                }
        
                &.tab-header__tab--active {
                    color: #409eff;
                    background: #fff;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.18);
                }
            }
        }

        .tab-header__actions {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: auto;

            .tab-header__action {
                min-width: 76px;
                border-radius: 18px;
            }

            .tab-header__address-btn {
                display: inline-block;

                /deep/ .el-button.filter-item {
                    min-width: 76px;
                    border-radius: 18px;
                    padding: 10px 20px;
                    font-size: 14px;
                }
            }
        }
    }

    .questionnaire-container {
        width: 1024px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 28px 40px;
        overflow-y: auto;
        background: #fff;
        border: 1px solid #ebeef5;
        border-radius: 14px;
        box-shadow: 0 10px 28px rgba(31, 45, 61, 0.08);

        .questionnaire-title {
            color: #303133;
            font-size: 28px;
            text-align: center;
            font-weight: 700;
            margin-bottom: 12px;
        }
        .questionnaire-info {
            padding: 14px 18px;
            background: #f7faff;
            border-radius: 10px;
            border: 1px solid #ebeef5;
            margin-bottom: 12px;
            font-size: 14px;
            color: #606266;
            span {
                color: #409eff;
                margin: 0 4px;
            }
        }
        .questionnaire-content {
            margin-top: 16px;
            border-top: 1px solid #ebeef5;
            padding-top: 24px;
        }
        .question-item {
            @include clearfix;
            padding: 14px 18px;
            margin-bottom: 12px;
            border: 1px solid #f0f2f5;
            border-radius: 10px;
            background: #fafcff;
            transition: box-shadow 0.2s;

            &:hover {
                box-shadow: 0 4px 12px rgba(64, 158, 255, 0.08);
            }

            & > * {
                margin: 5px 0;
            }
            .question-item__title {
                font-size: 15px;
                font-weight: 600;
                color: #303133;
            }
            .question-item__choice-pic {
                @include cover-bg;
                @include wh(150px, 150px);
                margin-bottom: 5px;
                border-radius: 8px;
            }
        }
        .quetion-item--pic-multiple-choice, .quetion-item--pic-multiple-choice {
            .question-item__choice {
                float: left;
                margin-right: 10px;
            }
        }
    }
    img.question-pic {
        @include wh(150px, 150px);
    }
    .question-pic-container {
        @include clearfix;
    }
    .blank {
        border: 0 !important;
        border-bottom: 1px solid #303133 !important;
    }
    .divider {
        border: 1px solid #dcdfe6;
        border-radius: 2px;
    }
    .upload-hint {
        width: 160px;
        height: 190px;
        float: left;
        border: 1px solid #dcdfe6;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 8px;
        background: url(../../assets/images/picinput.png) no-repeat;
        background-position: center center;
        cursor: pointer;
    }
    .request-hint {
        margin-right: 5px;
        color: #f56c6c;
    }
    .question-item__score {
        font-size: 14px;
        color: #606266;
        margin-left: 8px;
    }

    .questionnaire-sub {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        padding: 10px 0;
        margin-bottom: 12px;
        color: #606266;
        font-size: 14px;
    }
    .questionnaire-header {
        & > * {
            margin: 5px 0;
        }
    }
    .questionnaire-desc {
        white-space: pre-wrap;
        word-break: break-all;
        font-size: 14px;
        color: #606266;
        line-height: 1.8;
        padding: 12px 18px;
        background: #f7faff;
        border-radius: 8px;
        margin-bottom: 12px;
    }

    /* 设置面板 */
    .setting-panel {
        max-width: 1024px;
        margin: 18px auto 0;
        padding: 28px 34px;
        background: #fff;
        border: 1px solid #ebeef5;
        border-radius: 14px;
        box-shadow: 0 10px 28px rgba(31, 45, 61, 0.08);

        .setting-form {
            .setting-form-item {
                display: flex;
                align-items: flex-start;
                padding: 18px 0;
                border-bottom: 1px solid #f0f2f5;

                &:first-child {
                    padding-top: 0;
                }

                &:last-child {
                    padding-bottom: 0;
                    border-bottom: 0;
                }

                .setting-label {
                    width: 112px;
                    padding-right: 22px;
                    line-height: 36px;
                    flex-shrink: 0;
                    color: #303133;
                    font-weight: 600;
                    text-align: right;
                    box-sizing: border-box;
                }

                .setting-content {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 6px;
                    min-height: 36px;
                    line-height: 36px;
                    color: #606266;
                }
            }
        }

        .setting-scope {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .setting-cover {
            max-width: 200px;
            max-height: 140px;
            border-radius: 8px;
            border: 1px solid #ebeef5;
        }
    }

    /* 逻辑面板 */
    .logic-panel {
        padding: 18px 0 0;
        box-sizing: border-box;
        overflow: hidden;

        .logic-workspace {
            display: flex;
            gap: 18px;
            height: 100%;
        }

        .logic-config-panel,
        .logic-preview-panel {
            background: #fff;
            border: 1px solid #ebeef5;
            border-radius: 14px;
            box-sizing: border-box;
            box-shadow: 0 10px 28px rgba(31, 45, 61, 0.08);
        }

        .logic-config-panel {
            width: 56%;
            min-width: 620px;
            padding: 22px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .logic-preview-panel {
            flex: 1;
            padding: 22px;
            overflow: auto;
        }

        .logic-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f0f2f5;
        }

        .logic-toolbar__title,
        .logic-preview-panel__title {
            position: relative;
            padding-left: 10px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;

            &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 50%;
                width: 3px;
                height: 16px;
                background: #409eff;
                border-radius: 2px;
                transform: translateY(-50%);
            }
        }

        .logic-toolbar__desc {
            margin-top: 7px;
            padding-left: 10px;
            font-size: 12px;
            color: #909399;
        }

        .logic-rules-list {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding-right: 8px;
        }

        .logic-rule-card {
            margin-bottom: 16px;
            padding: 16px 18px;
            background: linear-gradient(180deg, #fbfdff 0%, #f7faff 100%);
            border: 1px solid #d9ecff;
            border-radius: 12px;
            box-shadow: 0 6px 18px rgba(64, 158, 255, 0.08);
        }

        .logic-rule-card__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
        }

        .logic-rule-card__title {
            font-weight: 600;
            color: #303133;
        }

        .logic-rule-row {
            display: flex;
            align-items: center;
            margin-top: 12px;
        }

        .logic-keyword {
            min-width: 40px;
            margin-right: 10px;
            color: #409eff;
            font-weight: 600;
        }

        .logic-value {
            display: inline-flex;
            align-items: center;
            min-height: 32px;
            padding: 0 12px;
            color: #606266;
            background: #f4f4f5;
            border-radius: 16px;
            font-size: 13px;
        }

        .logic-operator {
            margin: 0 10px;
            color: #606266;
        }

        .logic-else-fixed {
            display: inline-flex;
            align-items: center;
            min-height: 32px;
            padding: 0 12px;
            color: #606266;
            background: #f4f4f5;
            border-radius: 16px;
        }

        .logic-empty,
        .logic-preview-empty {
            margin-top: 20px;
            padding: 70px 20px;
            color: #909399;
            text-align: center;
            background: #fafcff;
            border: 1px dashed #dcdfe6;
            border-radius: 12px;
        }

        .logic-flow {
            min-width: 360px;
            padding: 24px 0;
            text-align: center;
        }

        .logic-flow-group {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .logic-flow-line {
            width: 2px;
            height: 30px;
            background: linear-gradient(180deg, #c6e2ff, #dcdfe6);
        }

        .logic-flow-node {
            min-width: 116px;
            padding: 10px 16px;
            color: #303133;
            background: #fff;
            border: 1px solid #dcdfe6;
            border-radius: 18px;
            box-sizing: border-box;
            box-shadow: 0 4px 12px rgba(31, 45, 61, 0.06);
        }

        .logic-flow-node--start,
        .logic-flow-node--end {
            color: #409eff;
            background: #ecf5ff;
            border-color: #409eff;
            font-weight: 600;
        }

        .logic-flow-branches {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 18px;
            margin: 16px 0 4px;
        }

        .logic-flow-branch {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .logic-flow-branch__condition {
            padding: 5px 12px;
            color: #606266;
            font-size: 12px;
            background: #f4f4f5;
            border-radius: 14px;
        }

        .logic-flow-branch__line {
            width: 2px;
            height: 18px;
            background: #c6e2ff;
        }

        .logic-flow-node--target {
            min-width: 128px;
            font-size: 12px;
        }

        .logic-flow-node--show {
            color: #67c23a;
            background: #f0f9eb;
            border-color: #67c23a;
        }

        .logic-flow-node--hide {
            color: #f56c6c;
            background: #fef0f0;
            border-color: #f56c6c;
        }

        .logic-flow-node--jump {
            color: #e6a23c;
            background: #fdf6ec;
            border-color: #e6a23c;
        }
    }
</style>
<style lang="scss">

    #questionnaireDetail  {
        .el-checkbox__label {
            white-space: normal;
        }
        .img-upload {
            width: 160px;
            height: 190px;
            float: left;
            border: 1px solid #dcdfe6;
            margin-right: 10px;
            margin-bottom: 10px;
            border-radius: 8px;
            background: url(../../assets/images/picinput.png) no-repeat center center;
            cursor: pointer;
        }
        .question-item__choice {
            padding: 6px 0;
        }
    }
    @media print {
        .tab-header {
            display: none !important;
        }
        .question-item {
            clear: both;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
        }
        .question-item__choice {
            float: left;
            margin-right: 10px;
        }
        .print-container, .questionnaire-title {
            width: 100% !important;
        }
        .questionnaire-title {
            text-align: center !important;
            font-size: 26px !important;
        }
    }

</style>
