<template>
    <div id="questionnaire" class="page">
        <back-tool>
            <el-button type="primary" size="medium" v-if="!isEnd" @click.native="submitAnswer">提交</el-button>
            <el-button type="primary" size="medium" @click.native="jumpToPage('questionnaireAccounting', {voteId: id})"
                       v-if="isShowResult === 1 && isEnd">查看结果
            </el-button>
        </back-tool>
        <div :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <div class="main-container">
                <div class="questionnaire-container">
                    <div class="questionnaire-title">
                        {{voteTitle}}
                    </div>
                    <pre class="questionnaire-desc">{{voteDesc}}</pre>
                    <div class="questionnaire-setting">
                        截止时间：{{expriyDate | trimDate}}&nbsp;&nbsp;&nbsp;
                        {{inscribe}}
                    </div>
                    <div class="question-container">
                        <template v-for="(questionItem, questionIndex) in topicList">
                            <div v-show="!hiddenTopicMap[questionItem.topicSeq]" :data-topic-seq="questionItem.topicSeq" :key="'logic-' + questionIndex">
                            <!--单选-->
                            <div :key="questionIndex" v-if="questionItem.topType === 1"
                                 class="question-item quetion-item--single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">单选</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <div v-for="(optionItem, optionIndex) in questionItem.optionList"
                                             class="question-option-container radius">
                                            <div>
                                                <el-checkbox :disabled="isEnd" :name="questionItem.id.toString()"
                                                             @change="radioChangeHandler(questionItem, optionItem)"
                                                             :true-label="1" :false-label="0"
                                                             v-model="optionItem.isSelected">
                                                    {{optionItem.optionTitle}}
                                                </el-checkbox>
                                            </div>
                                            <div v-if="optionItem.isHaveReason === 1"
                                                 v-show="optionItem.isSelected === 1">
                                                <el-input
                                                    v-model.trim="optionItem.optionAnswer"
                                                    type="textarea"
                                                    :rows="3"
                                                    placeholder="请输入"
                                                    :maxlength="500"
                                                >
                                                </el-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div :key="questionIndex" v-if="questionItem.topType === 22"
                                 class="question-item quetion-item--single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">单选</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-select :disabled="isEnd" :name="questionItem.id.toString()" v-model="questionItem.selectedOptionId" @change="onDropdownChange(questionItem)">
                                            <el-option :value="optionItem.id" :label="optionItem.optionTitle" v-for="(optionItem, optionIndex) in questionItem.optionList"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                            <div :key="questionIndex" v-if="questionItem.topType === 23"
                                 class="question-item quetion-item--single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">多选</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-select :disabled="isEnd" multiple :name="questionItem.id.toString()" v-model="questionItem.selectedOptionId" @change="onDropdownChange(questionItem)">
                                            <el-option :value="optionItem.id" :label="optionItem.optionTitle" v-for="(optionItem, optionIndex) in questionItem.optionList"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                            <!--评分单选-->
                            <div :key="questionIndex" v-if="questionItem.topType === 24"
                                 class="question-item quetion-item--single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">单选</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <div v-for="(optionItem, optionIndex) in questionItem.optionList"
                                             class="question-option-container radius">
                                            <div>
                                                <el-checkbox :disabled="isEnd" :name="questionItem.id.toString()"
                                                             @change="radioChangeHandler(questionItem, optionItem)"
                                                             :true-label="1" :false-label="0"
                                                             v-model="optionItem.isSelected">
                                                    {{optionItem.optionTitle}}
                                                </el-checkbox>
                                            </div>
                                            <div v-if="optionItem.isHaveReason === 1"
                                                 v-show="optionItem.isSelected === 1">
                                                <el-input
                                                    v-model.trim="optionItem.optionAnswer"
                                                    type="textarea"
                                                    :rows="3"
                                                    placeholder="请输入"
                                                    :maxlength="500"
                                                >
                                                </el-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--多选填空-->
                            <div :key="questionIndex" v-if="questionItem.topType === 21"
                                 class="question-item quetion-item--single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">选项填空</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <div v-for="(optionItem, optionIndex) in questionItem.optionList"
                                             class="question-option-container">
                                            <span class="request-hint" v-if="optionItem.isHaveReason === 1">*</span>
                                            <template v-for="(part, partIndex) in optionItem.blankArray">
                                                <span v-if="!/{\d+?}/.test(part)">
                                                    {{part}}
                                                </span>
                                                <input v-else :disabled="isEnd"
                                                       v-model.trim="optionItem.blankAnswerArray[partIndex]" type="text"
                                                       class="blank" :maxlength="`${part.slice(1, part.length - 1)}`"
                                                       :style="{width: `${20 * parseInt(part.slice(1, part.length - 1))}px`}"/>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!--单选填空-->
                            <div :key="questionIndex" v-if="questionItem.topType === 14"
                                 class="question-item quetion-item--single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">选项填空</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <div v-for="(optionItem, optionIndex) in questionItem.optionList"
                                             class="question-option-container">
                                            <span class="request-hint" v-if="optionItem.isHaveReason === 1">*</span>
                                            <template v-for="(part, partIndex) in optionItem.blankArray">
                                                <span v-if="!/{\d+?}/.test(part)">
                                                    {{part}}
                                                </span>
                                                <input v-else :disabled="isEnd"
                                                       v-model.trim="optionItem.blankAnswerArray[partIndex]" type="text"
                                                       class="blank" :maxlength="`${part.slice(1, part.length - 1)}`"
                                                       :style="{width: `${20 * parseInt(part.slice(1, part.length - 1))}px`}"/>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!--多选-->
                            <div :key="questionIndex" v-if="questionItem.topType === 2"
                                 class="question-item quetion-item--multiple-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">多选</el-tag>
                                        <el-tag type="primary" v-if="questionItem.selectedMax !== 0">
                                            限选{{questionItem.selectedMax}}
                                        </el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <div v-for="(optionItem, optionIndex) in questionItem.optionList"
                                             class="question-option-container">
                                            <div>
                                                <el-checkbox
                                                    @click.native="checkboxClickhandler($event, optionItem.isSelected, questionItem)"
                                                    :disabled="isEnd" :name="questionItem.id.toString()" :true-label="1"
                                                    :false-label="0" v-model="optionItem.isSelected">
                                                    {{optionItem.optionTitle}}
                                                </el-checkbox>
                                            </div>
                                            <div v-if="optionItem.isHaveReason === 1"
                                                 v-show="optionItem.isSelected === 1">
                                                <el-input
                                                    v-model.trim="optionItem.optionAnswer"
                                                    type="textarea"
                                                    :rows="3"
                                                    placeholder="请输入"
                                                    :maxlength="500"
                                                >
                                                </el-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!--图片单选-->
                            <div :key="questionIndex" v-if="questionItem.topType === 3"
                                 class="question-item quetion-item--pic-single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">单选</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <image-previewer tag="richtext" viewclass="question-pic"
                                                         :images="questionItem.picList">
                                            <div class="question-option-container radius"
                                                 v-for="(optionItem, optionIndex) in questionItem.optionList">
                                                <div class="question-pic"
                                                     :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"></div>
                                                <div class="question-pic-desc">
                                                    <div>
                                                        <el-checkbox :disabled="isEnd"
                                                                     :name="questionItem.id.toString()"
                                                                     @change="radioChangeHandler(questionItem, optionItem)"
                                                                     :true-label="1" :false-label="0"
                                                                     v-model="optionItem.isSelected">
                                                            {{optionItem.optionTitle}}
                                                        </el-checkbox>
                                                    </div>
                                                    <div v-if="optionItem.isHaveReason === 1"
                                                         v-show="optionItem.isSelected === 1">
                                                        <el-input
                                                            v-model.trim="optionItem.optionAnswer"
                                                            type="textarea"
                                                            :rows="3"
                                                            placeholder="请输入"
                                                            :maxlength="500"
                                                        >
                                                        </el-input>
                                                    </div>
                                                </div>
                                            </div>
                                        </image-previewer>
                                    </div>
                                </div>
                            </div>
                            <!--图片多选-->
                            <div :key="questionIndex" v-if="questionItem.topType === 4"
                                 class="question-item quetion-item--pic-multiple-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">多选</el-tag>
                                        <el-tag type="primary" v-if="questionItem.selectedMax !== 0">
                                            {{questionItem.selectedMax}}
                                        </el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <image-previewer tag="richtext" viewclass="question-pic"
                                                         :images="questionItem.picList">
                                            <div class="question-option-container"
                                                 v-for="(optionItem, optionIndex) in questionItem.optionList">
                                                <div class="question-pic"
                                                     :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"></div>
                                                <div class="question-pic-desc">
                                                    <div>
                                                        <el-checkbox
                                                            @click.native="checkboxClickhandler($event, optionItem.isSelected, questionItem)"
                                                            :disabled="isEnd" :name="questionItem.id.toString()"
                                                            :true-label="1" :false-label="0"
                                                            v-model="optionItem.isSelected">
                                                            {{optionItem.optionTitle}}
                                                        </el-checkbox>
                                                    </div>
                                                    <div v-if="optionItem.isHaveReason === 1"
                                                         v-show="optionItem.isSelected === 1">
                                                        <el-input
                                                            v-model.trim="optionItem.optionAnswer"
                                                            type="textarea"
                                                            :rows="3"
                                                            placeholder="请输入"
                                                            :maxlength="500"
                                                            @click.native="checkboxClickhandler($event, optionItem.isSelected, questionItem)"
                                                        >
                                                        </el-input>
                                                    </div>
                                                </div>
                                            </div>
                                        </image-previewer>
                                    </div>
                                </div>
                            </div>

                            <!--问答题-->
                            <div :key="questionIndex" v-if="questionItem.topType === 5"
                                 class="question-item quetion-item--qna">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">问答</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-input
                                            :disabled="isEnd"
                                            type="textarea"
                                            :rows="3"
                                            :maxlength="500"
                                            placeholder="答题内容(1-500个字符)"
                                            v-model.trim="questionItem.topicAnswer">
                                        </el-input>
                                    </div>
                                </div>
                            </div>

                            <!--填空题-->
                            <div :key="questionIndex" v-if="questionItem.topType === 6"
                                 class="question-item quetion-item--fill-blank">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        <template v-for="(part, partIndex) in questionItem.blankArray">
                                        <span v-if="!/{\d+?}/.test(part)">
                                            {{part}}
                                        </span>
                                            <input v-else :disabled="isEnd"
                                                   v-model.trim="questionItem.blankAnswerArray[partIndex]" type="text"
                                                   class="blank" :maxlength="`${part.slice(1, part.length - 1)}`"
                                                   :style="{width: `${20 * parseInt(part.slice(1, part.length - 1))}px`}"/>
                                        </template>
                                        <el-tag type="primary">填空</el-tag>
                                    </div>
                                </div>
                            </div>
                            <!--描述-->
                            <div :key="questionIndex" v-if="questionItem.topType === 7"
                                 class="question-item quetion-item--fill-blank">
                                <div class="question-item__left">
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__body">
                                        {{questionItem.topicTitle}}
                                    </div>
                                </div>
                            </div>

                            <!--分割线-->
                            <div :key="questionIndex" v-if="questionItem.topType === 8"
                                 class="question-item quetion-item--divider">
                                <div class="question-item__left">
                                </div>
                                <div class="question-item__right">
                                    <div class="divider"></div>
                                </div>
                            </div>
                            <!--地址-->
                            <div :key="questionIndex" v-if="questionItem.topType === 9"
                                 class="question-item quetion-item--address">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">地址</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-cascader
                                            :disabled="isEnd"
                                            size="large"
                                            :options="options"
                                            v-model="questionItem.addressArray">
                                        </el-cascader>
                                        <el-input :disabled="isEnd" type="text"
                                                  v-model.trim="questionItem.detailAddress">
                                        </el-input>
                                    </div>
                                </div>
                            </div>

                            <!--单个图片上传-->
                            <div :key="questionIndex" v-if="questionItem.topType === 10"
                                 class="question-item quetion-item--pic-single-uploader">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">单图上传</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <div class="pic-item" :style="{backgroundImage: `url(${picItem})`}"
                                             v-for="(picItem, picIndex) in questionItem.picList">
                                            <span class="delete-icon" @click="deletePic(questionItem, picIndex)"></span>
                                        </div>
                                        <uploader
                                            :disabled="isEnd"
                                            module="wenjuan"
                                            pathPrefix="wenjuan"
                                            moduleCode="2054"
                                            v-show="questionItem.picList.length === 0"
                                            v-model="questionItem.pics"
                                            :multiple="true"
                                            :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                                            showMode="image"
                                            showResult="no"
                                            :successCallback="optionPicUploadSuccessHandler(questionItem)"
                                        >
                                        </uploader>
                                    </div>
                                </div>
                            </div>

                            <!--多个图片上传-->
                            <div :key="questionIndex" v-if="questionItem.topType === 11"
                                 class="question-item quetion-item--pic-multiple-uploader">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">多图上传</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <div class="pic-item" :style="{backgroundImage: `url(${picItem})`}"
                                             v-for="picItem in questionItem.picList">
                                            <span class="delete-icon" @click="deletePic(questionItem, picIndex)"></span>
                                        </div>
                                        <uploader
                                            :disabled="isEnd"
                                            v-model="questionItem.pics"
                                            :multiple="true"
                                            :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                                            showMode="image"
                                            showResult="no"
                                            module="wenjuan"
                                            pathPrefix="wenjuan"
                                            moduleCode="2054"
                                            :successCallback="optionPicUploadSuccessHandler(questionItem)"
                                        >
                                        </uploader>
                                    </div>
                                </div>
                            </div>

                            <!--评分题-->
                            <div :key="questionIndex" v-if="questionItem.topType === 12"
                                 class="question-item quetion-item--multiple-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">评分题</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-rate :disabled="isEnd" v-model="questionItem.topicAnswer"></el-rate>
                                    </div>
                                </div>
                            </div>

                            <!--手机号-->
                            <div :key="questionIndex" v-if="questionItem.topType === 15"
                                 class="question-item quetion-item--pic-single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">手机号</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-input :disabled="isEnd" @blur="inputBlurHandler(questionItem)" type="text"
                                                  v-model.trim="questionItem.topicAnswer">
                                        </el-input>
                                    </div>
                                </div>
                            </div>

                            <!--邮箱-->
                            <div :key="questionIndex" v-if="questionItem.topType === 16"
                                 class="question-item quetion-item--pic-single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">邮箱</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-input :disabled="isEnd" @blur="inputBlurHandler(questionItem)" type="text"
                                                  v-model.trim="questionItem.topicAnswer">
                                        </el-input>
                                    </div>
                                </div>
                            </div>

                            <!--身份证-->
                            <div :key="questionIndex" v-if="questionItem.topType === 17"
                                 class="question-item quetion-item--pic-single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">身份证</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-input :disabled="isEnd" @blur="inputBlurHandler(questionItem)" type="text"
                                                  v-model.trim="questionItem.topicAnswer">
                                        </el-input>
                                    </div>
                                </div>
                            </div>

                            <!--日期-->
                            <div :key="questionIndex" v-if="questionItem.topType === 18"
                                 class="question-item quetion-item--pic-single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">日期</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-date-picker
                                            :disabled="isEnd"
                                            v-model="questionItem.topicAnswer"
                                            type="date"
                                            placeholder="请选择日期">
                                        </el-date-picker>
                                    </div>
                                </div>
                            </div>

                            <!--时间-->
                            <div :key="questionIndex" v-if="questionItem.topType === 19"
                                 class="question-item quetion-item--pic-single-choice">
                                <div class="question-item__left">
                                    <el-tag type="primary">Q{{questionItem.topicSeq}}</el-tag>
                                </div>
                                <div class="question-item__right">
                                    <div class="question-item__title">
                                        <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                                        {{questionItem.topicTitle}}
                                        <el-tag type="primary">时间</el-tag>
                                    </div>
                                    <div class="question-item__body">
                                        <el-time-select
                                            :disabled="isEnd"
                                            v-model="questionItem.topicAnswer"
                                            placeholder="请选择时间"
                                            :picker-options="{
                                              start: '00:01',
                                              step: '00:01',
                                              end: '24:00'
                                            }"
                                        >
                                        </el-time-select>
                                    </div>
                                </div>
                            </div>
                            </div><!-- end v-show wrapper -->
                        </template>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {regionData, CodeToText} from 'element-china-area-data'
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';

    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Uploader from '@/components/Uploader/WebUploader';

    import {getVoteTwoById, addVoteTwoUserSelectedList, resetUserVote, getVoteTwoRuleList} from '@/api/questionnaire';
    import moment from 'moment';

    export default {
        name: "questionnaire",
        components: {
            BackTool,
            AddressBook,
            ImagePreviewer,
            Uploader
        },
        mixins: [baseMixin, mixin],
        data: function () {
            return {
                inscribe: '',
                isEnd: false,
                options: regionData,
                basePath: global.BasePath,
                showNav: false,
                userId: this.$route.query.userId,
                expriyDate: '',
                id: this.$route.query.id,
                voteTitle: '',
                voteDesc: '',
                sendUserType: null,
                anonymous: null,
                topicList: [],
                voteStatus: null,
                isShowResult: null,
                maxVoteCount: 0,
                stuDepartJson: '{}',
                thScopeJson: '{}',
                batchId: 0,
                logicRules: [],
                hiddenTopicMap: {},
                jumpedRules: []
            }
        },
        created() {
            getVoteTwoById({
                voteId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.inscribe = pageData.inscribe;
                    this.voteTitle = pageData.voteTitle;
                    this.voteDesc = pageData.voteDesc;
                    this.sendUserType = pageData.sendUserType;
                    this.expriyDate = pageData.expriyDate;
                    this.anonymous = pageData.anonymous;
                    this.isEnd = moment().format('YYYY-MM-DD HH:mm') > pageData.expriyDate;
                    this.batchId = pageData.batchId;

                    pageData.topicList.forEach(item => {
                        item.optionIdList = [];
                        item.pics = [];
                        item.topicAnswer = '';
                        if (item.topType === 4 || item.topType === 3) {
                            item.picList = item.optionList.map(item => ({src: item.optionPicUrl}));
                        }
                        if (item.topType === 14 || item.topType === 21) {
                            item.optionList.forEach(optionItem => {
                                optionItem.blankArray = optionItem.optionTitle.split(/({\d+?})/g).filter(item => item !== '');
                                optionItem.blankAnswerArray = [...optionItem.blankArray].map(item => /{\d+?}/g.test(item) ? '' : item);
                            })
                        }
                        if (item.topType === 6) {
                            item.blankArray = item.topicTitle.split(/({\d+?})/g).filter(item => item !== '');
                            item.blankAnswerArray = [...item.blankArray].map(item => /{\d+?}/g.test(item) ? '' : item);
                        }
                        if (item.topType === 10 || item.topType === 11) {
                            item.picList = [];
                        }
                        if (item.topType === 18) {
                            if (item.topicAnswer) {
                                item.topicAnswer = this.$moment().format('YYYY-MM-DD');
                            }

                        }
                        if (item.topType === 19) {
                            if (item.topicAnswer) {
                                item.topicAnswer = this.$moment().format('HH:mm');
                            }
                        }
                        if (item.topType === 9) {
                            item.addressArray = [];
                            item.detailAddress = '';
                        }
                        if(item.topType === 22) {
                            item.selectedOptionId = '';
                        }
                        if(item.topType === 23) {
                            item.selectedOptionId = [];
                        }

                    });

                    this.topicList = pageData.topicList;
                    this.stuDepartJson = pageData.stuDepartJson;
                    this.thScopeJson = pageData.thScopeJson;
                    this.voteStatus = pageData.voteStatus;
                    this.isShowResult = pageData.isShowResult;
                    this.maxVoteCount = pageData.maxVoteCount;

                    // 获取逻辑规则
                    this.fetchLogicRules();
                });
        },
        filters: {
            trimDate(value) {
                return value ? value.slice(0, value.lastIndexOf('.')) : '';
            }
        },
        methods: {
            beforeUploader(file) {
                if (['image/jpeg', 'image/bmp', 'image/gif', 'image/png'].indexOf(file.type) === -1) {
                    this.$message.error('上传图片仅支持.jpg .jpeg .gif .png .bmp图片格式！');
                    return false;
                }
                return true;
            },
            checkboxClickhandler(event, isSelected, questionItem) {
                if (questionItem.selectedMax !== 0) {
                    if (questionItem.optionList.filter(({isSelected}) => isSelected).length === questionItem.selectedMax && !isSelected) {
                        event.preventDefault();
                    }
                }
                // 触发逻辑规则评估（延迟执行以确保checkbox状态已更新）
                this.$nextTick(() => {
                    this.evaluateLogicRules();
                });
            },
            deletePic(questionItem, picIndex) {
                questionItem.picList.splice(picIndex, 1);
            },
            parseFillblank(title) {
                return title.replace(/{(\d+?)}/g, function (_, num) {
                    return `<input type="text" class="blank" maxlength="${num}" style="width: ${num * 20}px" />`
                });
            },
            radioChangeHandler(questionItem, optionItem) {
                questionItem.optionList.forEach(item => {
                    if (item.id !== optionItem.id) {
                        item.isSelected = 0;
                    }
                })
                // 触发逻辑规则评估（延迟执行以确保v-model已完成更新）
                this.$nextTick(() => {
                    this.evaluateLogicRules();
                });
            },
            optionPicUploadSuccessHandler(quesionItem) {
                return (data) => {
                    quesionItem.picList.push(data.fileUrl);
                }
            },
            // ==================== 逻辑规则相关方法 ====================
            // 获取逻辑规则列表
            fetchLogicRules() {
                if (!this.id) return;
                getVoteTwoRuleList({ voteId: this.id })
                    .then(res => res.data)
                    .then(data => {
                        const rawData = data.data || data.list || [];
                        if (data.result || data.code === 200) {
                            this.logicRules = rawData.map(item => this.normalizeLogicRule(item));
                            // 初始化题目显示状态
                            this.evaluateLogicRules();
                        }
                    })
                    .catch(() => {
                        // 获取逻辑规则失败不影响问卷正常显示
                    });
            },
            // 将后端返回的逻辑规则转换为前端格式
            normalizeLogicRule(item) {
                const conditionQuestion = this.findTopicSeqByCode(item.topicCode);
                const actionQuestion = this.findTopicSeqByCode(item.topicCodeShow);
                const conditionOption = this.findOptionSeqByCode(conditionQuestion, item.optionCode);
                return {
                    id: item.id || Date.now() + Math.random(),
                    conditionQuestion,
                    conditionOption,
                    actionType: item.showType === 2 ? 'hide' : item.showType === 3 ? 'jump' : 'show',
                    actionQuestion
                };
            },
            // 根据后端topicCode查找对应的topicSeq（统一转字符串比较，避免类型不匹配）
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
            // 根据后端optionCode查找对应的optionSeq（统一转字符串比较）
            findOptionSeqByCode(topicSeq, optionCode) {
                const code = String(optionCode || '');
                if (!code || !topicSeq) return '';
                const question = this.topicList.find(q => String(q.topicSeq) === String(topicSeq));
                if (!question) return '';
                const option = (question.optionList || []).find(item => {
                    return String(item.optionCode || '') === code
                        || String(item.id || '') === code
                        || String(item.optionSeq || '') === code;
                });
                return option ? option.optionSeq : '';
            },
            // 判断指定题目的指定选项是否被选中（统一转字符串比较，避免类型不匹配）
            isOptionSelected(topicSeq, optionSeq) {
                if (!topicSeq || !optionSeq) return false;
                const question = this.topicList.find(q => String(q.topicSeq) === String(topicSeq));
                if (!question) return false;
                // 下拉单选 (topType 22)
                if (question.topType === 22) {
                    if (!question.selectedOptionId) return false;
                    const opt = (question.optionList || []).find(
                        o => String(o.optionSeq) === String(optionSeq)
                    );
                    return opt ? String(opt.id) === String(question.selectedOptionId) : false;
                }
                // 下拉多选 (topType 23)
                if (question.topType === 23) {
                    if (!Array.isArray(question.selectedOptionId) || !question.selectedOptionId.length) return false;
                    const opt = (question.optionList || []).find(
                        o => String(o.optionSeq) === String(optionSeq)
                    );
                    return opt ? question.selectedOptionId.map(String).includes(String(opt.id)) : false;
                }
                // checkbox类题型 (topType 1,2,3,4,24)
                const opt = (question.optionList || []).find(
                    o => String(o.optionSeq) === String(optionSeq)
                );
                return opt ? opt.isSelected === 1 : false;
            },
            // 评估所有逻辑规则，更新题目显示状态
            evaluateLogicRules() {
                if (!this.logicRules.length) return;
                this.computeVisibility();
            },
            // 计算题目可见性：优先处理触发规则，再处理“否则”逻辑
            // hiddenTopicMap: true 表示隐藏，false/undefined 表示显示
            computeVisibility() {
                const hiddenMap = {};
                const triggeredRules = [];
                const untriggeredRules = [];
                const jumpTargets = [];
                const newJumpedRules = [];

                // 分离触发与未触发的规则，同时收集跳转目标和本次触发的跳转规则
                this.logicRules.forEach(rule => {
                    const triggered = this.isOptionSelected(rule.conditionQuestion, rule.conditionOption);
                    if (triggered) {
                        triggeredRules.push(rule);
                        if (rule.actionType === 'jump' && rule.actionQuestion) {
                            jumpTargets.push(rule.actionQuestion);
                            newJumpedRules.push(rule.id);
                        }
                    } else {
                        untriggeredRules.push(rule);
                    }
                });

                // 处理触发规则的动作
                triggeredRules.forEach(rule => {
                    const target = rule.actionQuestion;
                    if (!target) return;
                    if (rule.actionType === 'show') {
                        // 触发显示：目标题目不隐藏
                        hiddenMap[target] = false;
                    } else if (rule.actionType === 'hide') {
                        // 触发隐藏：跳过跳转目标，防止覆盖跳转的可见性
                        if (jumpTargets.indexOf(target) === -1) {
                            hiddenMap[target] = true;
                        }
                    } else if (rule.actionType === 'jump') {
                        // 跳转：确保目标题目可见
                        hiddenMap[target] = false;
                        // 仅在首次触发时执行滚动，避免重复跳转
                        if (this.jumpedRules.indexOf(rule.id) === -1) {
                            this.$nextTick(() => {
                                this.scrollToTopic(target);
                            });
                        }
                    }
                });

                // 处理未触发规则的"否则"逻辑
                untriggeredRules.forEach(rule => {
                    const target = rule.actionQuestion;
                    if (!target || hiddenMap[target] !== undefined) return;
                    if (rule.actionType === 'show') {
                        // 否则隐藏
                        hiddenMap[target] = true;
                    } else if (rule.actionType === 'hide') {
                        // 否则显示
                        hiddenMap[target] = false;
                    } else if (rule.actionType === 'jump') {
                        // 跳转的否则逻辑：不做任何隐藏操作
                    }
                });

                this.jumpedRules = newJumpedRules;
                this.hiddenTopicMap = hiddenMap;
            },
            // 平滑滚动到指定题目
            scrollToTopic(topicSeq) {
                const el = this.$el.querySelector('[data-topic-seq="' + topicSeq + '"]');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            },
            // 下拉框选择变化处理（topType 22/23）
            onDropdownChange(questionItem) {
                this.evaluateLogicRules();
            },
            // ==================== 逻辑规则方法结束 ====================
            inputBlurHandler(topicItem) {
                const validObj = this.checkFunc(topicItem);
                if (!validObj.valid) {
                    this.$message.error(validObj.errorText);
                }
            },
            checkFunc(topicItem) {
                let errorText = '';
                let valid = true;
                const selectedOptions = topicItem.optionList.filter(item => item.isSelected === 1);
                if (topicItem.isHaveToDo === 0 && topicItem.topType !== 7 && topicItem.topType !== 8) {
                    if (topicItem.topType === 6) {
                        if (topicItem.blankAnswerArray.some(item => item === '')) {
                            errorText = `第${topicItem.topicSeq}题请正确填空！`;
                            valid = false;
                        }
                    } else if (topicItem.topType === 21 || topicItem.topType === 14) {
                        if (topicItem.optionList.some(optionItem => optionItem.isHaveReason === 1 && optionItem.blankAnswerArray.some(item => item === ''))) {
                            errorText = `第${topicItem.topicSeq}题请正确填空！`;
                            valid = false;
                        }
                    } else if (topicItem.topType === 10 || topicItem.topType === 11) {
                        if (topicItem.picList.length === 0) {
                            errorText = `第${topicItem.topicSeq}题请上传图片！`;
                            valid = false;
                        }
                    } else if (topicItem.topType === 15) {
                        if (!/^1[345789]\d{9}$/.test(topicItem.topicAnswer)) {
                            errorText = `第${topicItem.topicSeq}题手机号格式不正确！`;
                            valid = false;
                        }

                    } else if (topicItem.topType === 16) {
                        if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(topicItem.topicAnswer)) {
                            errorText = `第${topicItem.topicSeq}题邮箱格式不正确！`;
                            valid = false;
                        }
                    } else if (topicItem.topType === 17) {
                        if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(topicItem.topicAnswer)) {
                            errorText = `第${topicItem.topicSeq}题身份证格式不正确！`;
                            valid = false;
                        }
                    } else if (topicItem.topType === 9) {
                        if (topicItem.addressArray.length === 0 || topicItem.detailAddress === '') {
                            errorText = `第${topicItem.topicSeq}题请正确填写地址！`;
                            valid = false;
                        }
                    } else if(topicItem.topType === 22) {
                        if (!topicItem.selectedOptionId) {
                            errorText = `第${topicItem.topicSeq}题尚未回答！`;
                            valid = false;
                        }
                    } else if(topicItem.topType === 23) {
                        if (!topicItem.selectedOptionId || topicItem.selectedOptionId.length === 0) {
                            errorText = `第${topicItem.topicSeq}题尚未回答！`;
                            valid = false;
                        }
                    } else if (selectedOptions.length === 0 && !topicItem.topicAnswer) {
                        errorText = `第${topicItem.topicSeq}题尚未回答！`;
                        valid = false;
                    }
                }
                if (topicItem.topType === 2 || topicItem.topType === 4) {
                    if (topicItem.selectedMax !== 0 && selectedOptions.length > topicItem.selectedMax) {
                        errorText = `第${topicItem.topicSeq}题超过限选数！`;
                        valid = false;
                    }
                } else if(topicItem.topType === 23) {
                    if (topicItem.selectedMax !== 0 && topicItem.selectedOptionId.length > topicItem.selectedMax) {
                        errorText = `第${topicItem.topicSeq}题超过限选数！`;
                        valid = false;
                    }
                }
                return {
                    valid,
                    errorText
                };
            },
            submitAnswer() {
                let isValid = true;
                let errorText = '';
                const voteTwoUserSelectedList = [];
                if (moment().format('YYYY-MM-DD HH:mm') > this.expriyDate) {
                    isValid = false;
                    errorText = '该问卷已超过截止时间';
                }
                this.topicList.forEach(topicItem => {
                    // 跳过被逻辑隐藏的题目，不参与校验和提交
                    if (this.hiddenTopicMap[topicItem.topicSeq]) {
                        return;
                    }
                    if (isValid) {
                        const selectedOptions = topicItem.optionList.filter(item => item.isSelected === 1);
                        const validObj = this.checkFunc(topicItem);
                        errorText = validObj.errorText;
                        isValid = validObj.valid;

                        let answerObj = null;

                        switch (topicItem.topType) {
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 24:
                                selectedOptions.forEach(option => {
                                    answerObj = {
                                        optionAnswer: option.optionAnswer || '',
                                        optionId: option.id,
                                        topicAnswer: '',
                                        topicId: topicItem.id,
                                        userId: this.userId,
                                        voteId: this.id,
                                        optionSeq: option.optionSeq,
                                        topicSeq: topicItem.topicSeq,
                                        batchId: this.batchId
                                    };
                                    voteTwoUserSelectedList.push(answerObj);
                                });
                                break;
                            case 5:
                            case 12:
                            case 15:
                            case 16:
                            case 17:
                            case 19:
                                answerObj = {
                                    optionAnswer: '',
                                    optionId: '',
                                    topicAnswer: topicItem.topicAnswer,
                                    topicId: topicItem.id,
                                    userId: this.userId,
                                    voteId: this.id,
                                    optionSeq: '',
                                    batchId: this.batchId,
                                    topicSeq: topicItem.topicSeq,
                                };
                                voteTwoUserSelectedList.push(answerObj);
                                break;
                            case 18:
                                answerObj = {
                                    optionAnswer: '',
                                    optionId: '',
                                    topicAnswer: !!topicItem.topicAnswer ? this.$moment(topicItem.topicAnswer).format('YYYY-MM-DD') : '',
                                    topicId: topicItem.id,
                                    userId: this.userId,
                                    voteId: this.id,
                                    batchId: this.batchId,
                                    optionSeq: '',
                                    topicSeq: topicItem.topicSeq
                                };
                                voteTwoUserSelectedList.push(answerObj);
                                break;
                            case 6:
                                const topicAnswer = topicItem.blankArray.map((item, index) => {
                                    return /{\d+?}/.test(item) ? `{${topicItem.blankAnswerArray[index]}}` : item;
                                }).join('');
                                answerObj = {
                                    optionAnswer: '',
                                    optionId: '',
                                    topicAnswer,
                                    topicId: topicItem.id,
                                    userId: this.userId,
                                    voteId: this.id,
                                    optionSeq: '',
                                    topicSeq: topicItem.topicSeq,
                                    batchId: this.batchId
                                };
                                voteTwoUserSelectedList.push(answerObj);
                                break;
                            case 9:
                                answerObj = {
                                    optionAnswer: '',
                                    optionId: '',
                                    topicAnswer: `${topicItem.addressArray.map(item => CodeToText[item]).join(' ')} ${topicItem.detailAddress}`,
                                    topicId: topicItem.id,
                                    userId: this.userId,
                                    voteId: this.id,
                                    optionSeq: '',
                                    topicSeq: topicItem.topicSeq,
                                    batchId: this.batchId
                                };
                                voteTwoUserSelectedList.push(answerObj);
                                break;
                            case 10:
                            case 11:
                                answerObj = {
                                    optionAnswer: '',
                                    optionId: '',
                                    topicAnswer: topicItem.picList,
                                    topicId: topicItem.id,
                                    userId: this.userId,
                                    voteId: this.id,
                                    optionSeq: '',
                                    topicSeq: topicItem.topicSeq,
                                    batchId: this.batchId
                                };
                                voteTwoUserSelectedList.push(answerObj);
                                break;
                            case 14:
                            case 21:
                                topicItem.optionList.forEach(option => {
                                    const optionAnswer = option.blankArray.map((item, index) => {
                                        return /{\d+?}/.test(item) ? `{${option.blankAnswerArray[index]}}` : item;
                                    }).join('');
                                    answerObj = {
                                        optionAnswer,
                                        optionId: option.id,
                                        topicAnswer: '',
                                        topicId: topicItem.id,
                                        userId: this.userId,
                                        voteId: this.id,
                                        optionSeq: option.optionSeq,
                                        topicSeq: topicItem.topicSeq,
                                        batchId: this.batchId
                                    };
                                    voteTwoUserSelectedList.push(answerObj);
                                });
                                break;
                            case 22:
                                topicItem.optionList.forEach(option => {
                                    if(topicItem.selectedOptionId == option.id) {
                                        answerObj = {
                                            optionAnswer: option.optionAnswer || '',
                                            optionId: option.id,
                                            topicAnswer: '',
                                            topicId: topicItem.id,
                                            userId: this.userId,
                                            voteId: this.id,
                                            optionSeq: option.optionSeq,
                                            topicSeq: topicItem.topicSeq,
                                            batchId: this.batchId
                                        };
                                        voteTwoUserSelectedList.push(answerObj);
                                    }
                                });
                                break;
                            case 23:
                                topicItem.optionList.forEach(option => {
                                    if(topicItem.selectedOptionId.includes(option.id)) {
                                        answerObj = {
                                            optionAnswer: option.optionAnswer || '',
                                            optionId: option.id,
                                            topicAnswer: '',
                                            topicId: topicItem.id,
                                            userId: this.userId,
                                            voteId: this.id,
                                            optionSeq: option.optionSeq,
                                            topicSeq: topicItem.topicSeq,
                                            batchId: this.batchId
                                        };
                                        voteTwoUserSelectedList.push(answerObj);
                                    }
                                });
                                break;
                        }
                    }
                });
                if (!isValid) {
                    this.$message.error(errorText);
                } else {
                    addVoteTwoUserSelectedList(voteTwoUserSelectedList)
                        .then(res => res.data)
                        .then(data => {
                            const _this = this;
                            if (data.result) {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            }
                        })
                }
            }
        }
    }
</script>

<style>
.question-option-container.radius .el-checkbox__inner{
   border-radius: 50%;
}
.question-option-container.radius .el-checkbox__input.is-checked .el-checkbox__inner:after{
    transform: translate(-50%, -50%) scale(1);
}
.question-option-container.radius .el-checkbox__inner::after{
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
        padding: 12px;
    }

    .main-container {
        color: #717171;
    }


    .questionnaire-container {
        border: 1px solid #DBDBDB;
        width: 1024px;
        overflow-y: auto;
        margin: 10px auto;
        box-sizing: border-box;

        input[type=text], textarea {
            &:focus {
                background: #FDF9CD;
            }
        }

        .questionnaire-title, .questionnaire-desc, .questionnaire-setting {
            padding: 5px 50px;

            input, textarea {
                width: 100%;
                height: 100%;
                text-align: center;
                font-size: 20px;
                border: 0;
                resize: none;
            }
        }

        .address-book-container {
            width: 200px;
            display: inline-block;
            vertical-align: middle;
        }

        .questionnaire-title {
            font-size: 20px;
            height: 56px;
            text-align: center;
            line-height: 56px;
        }

        .questionnaire-desc {
            min-height: 90px;
            font-size: 18px;
        }

        .operation-icon {
            display: none;
            /*display: inline-block;*/
            vertical-align: middle;
            width: 20px;
            height: 20px;
            background-image: url(../../assets/images/wjsj_toolico_off.png);
            background-repeat: no-repeat;
            cursor: pointer;
        }

        .question-container {
            color: #000;
            padding: 5px 0;

            .question-item__body {
                margin-top: 10px;
            }

            .question-item {
                @include clearfix;
                padding: 10px 0;
                border-top: 1px solid #DBDBDB;

                &:hover {
                    .add-choice-icon, .batch-add-choice-icon, .up-icon, .down-icon, .question-delete-icon {
                        display: inline-block;
                    }
                }

                .question-item__left {
                    text-align: center;
                    width: 50px;
                    float: left;

                    .question-operation {
                        margin: 10px 0;

                        li {
                            margin-bottom: 5px;
                            display: block;
                            text-align: center;

                            &:last-child {
                                margin: 0;
                            }

                            .operation-icon {
                                &:hover {
                                    background-image: url(../../assets/images/wjsj_toolico.png);
                                }
                            }

                            .up-icon {
                                background-position: -23px -513px;
                            }

                            .down-icon {
                                background-position: -23px -538px;
                            }

                            .question-delete-icon {
                                background-position: -21px -180px;
                            }
                        }
                    }
                }

                .question-item__right {
                    float: left;
                    width: 815px;
                    box-sizing: border-box;
                    padding: 0 10px;

                    .question-item__title {
                        font-size: 14px;

                        input {
                            width: 67%;
                        }
                    }

                    .question-choice-options {
                        height: 26px;
                    }

                    input, textarea {
                        width: 100%;
                        height: 100%;
                        font-size: 14px;
                        border: 0;
                        resize: none;
                        margin-bottom: 5px;

                        &:focus {
                            background: #FDF9CD;
                        }
                    }

                    .option-del-icon {
                        margin-left: 5px;
                        background-position: -122px -241px;

                        &.option-del-icon--show {
                            display: inline-block !important;
                        }
                    }

                    .add-choice-icon {
                        margin-left: 20px;
                        background-position: -20px -200px;
                    }

                    .batch-add-choice-icon {
                        margin-left: 10px;
                        background-position: -20px -220px;
                    }

                }
            }

        }

        .quetion-item--pic-single-choice,
        .quetion-item--pic-multiple-choice,
        .quetion-item--pic-single-uploader,
        .quetion-item--pic-multiple-uploader {
            .question-option-container {
                width: 160px;
                float: left;
                border: 1px solid #ccc;
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 5px;

                .question-pic {
                    width: 160px;
                    height: 160px;
                    display: block;
                    margin-bottom: 5px;
                    @include cover-bg;
                }

                .question-pic-desc {
                    span {
                        @include middleIB;
                        width: 80%;
                    }

                    input {
                        width: 80% !important;
                    }
                }
            }

            .upload-hint {
                width: 160px;
                height: 160px;
                float: left;
                border: 1px solid #ccc;
                margin-right: 10px;
                margin-bottom: 10px;
                background: url(../../assets/images/picinput.png) no-repeat;
                background-position: center center;
                cursor: pointer;
            }
        }
    }

    input.blank {
        border-width: 0;
        border-bottom: 1px solid #000 !important;
    }

    .dialog-button-container {
        margin-top: 10px;
        text-align: right;
    }

    .question-option-container {
        margin-top: 10px;
    }

    .divider {
        border: 1px solid #999;
    }

    .pic-item {
        @include cover-bg;
        @include wh(160px, 160px);
        float: left;
        margin: 0 10px 10px 0;
        position: relative;

        .delete-icon {
            cursor: pointer;
            background-image: url(../../assets/images/wxcep_phone_close.png);
            z-index: 3000;
            position: absolute;
            right: 0;
            top: 0;
            @include wh(30px, 30px);
        }
    }

    .request-hint {
        margin-right: 5px;
        color: #ff0000;
    }
</style>
<style lang="scss">
    #questionnaire {
        .address-box-item {
            line-height: 36px;
        }

        .el-checkbox, .el-checkbox__input {
            white-space: normal !important;
        }

        .img-upload {
            width: 160px;
            height: 160px;
            float: left;
            border: 1px solid #ccc;
            margin-right: 10px;
            margin-bottom: 10px;
            background: url(../../assets/images/picinput.png) no-repeat center center;
            cursor: pointer;
        }
    }
</style>
