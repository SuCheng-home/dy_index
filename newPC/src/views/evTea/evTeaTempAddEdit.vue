<template>
  <div
    id="evTeaTempAddEdit"
    class="page"
  >
    <back-tool>
      <el-button
        size="medium"
        @click="questionnairePublish(1)"
        type="primary"
      >保存</el-button>
    </back-tool>
    <div class="main-container">
      <div class="question-type-container">
        <div class="question-type-container__title">常用类型</div>
        <ul class="question-type">
          <li
            @click="addQuestion('single-choice')"
            class="question-type-item"
          >
            <span class="question-type-item__icon question-type-item__icon--single-choice"></span>
            <span>单选题</span>
            </li>
            <li
              @click="addQuestion('multiple-choice')"
              class="question-type-item"
            >
              <span class="question-type-item__icon question-type-item__icon--multiple-choice"></span>
              <span>多选题</span>
              </li>
              <li
                v-if="isNormal || isByQues"
                @click="addQuestion('single-choice-score')"
                class="question-type-item"
              >
                <span class="question-type-item__icon question-type-item__icon--single-choice"></span>
                <span>评分单选</span>
                </li>
                <li
                  v-if="isNormal"
                  @click="addQuestion('pic-single-choice')"
                  class="question-type-item"
                >
                  <span class="question-type-item__icon question-type-item__icon--pic-single-choice"></span>
                  <span>图片单选题</span>
                  </li>
                  <li
                    v-if="isNormal"
                    @click="addQuestion('pic-multiple-choice')"
                    class="question-type-item"
                  >
                    <span class="question-type-item__icon question-type-item__icon--pic-multiple-choice"></span>
                    <span>图片多选题</span>
                    </li>
                    <li
                      v-if="isNormal"
                      @click="addQuestion('qna')"
                      class="question-type-item"
                    >
                      <span class="question-type-item__icon question-type-item__icon--qna"></span>
                      <span>问答题</span>
                      </li>

        </ul>
      </div>
      <div
        class="questionnaire-container"
        :style="{height: `${maxH + 40}px`}"
      >
        <div class="questionnaire-title">
          <input
            maxlength="40"
            type="text"
            v-model.trim="tempTitle"
            placeholder="模板标题"
          />
        </div>
        <div class="questionnaire-desc">
          <textarea
            maxlength="500"
            placeholder="模板说明"
            v-model.trim="tempDesc"
          ></textarea>
        </div>
        <div
          class="curr-list"
          v-if="isByOpt || isByQues"
        >
          <div class="left-part">
            学科
          </div>
          <div class="right-part">
            <el-checkbox-group v-model="checkedCurr">
              <el-checkbox
                v-for="currItem in currList"
                :label="currItem.id"
                :key="currItem.id"
              >{{currItem.name}}</el-checkbox>
            </el-checkbox-group>
          </div>

    </div>
    <div class="question-container">
      <template v-for="(questionItem, questionIndex) in topicList">
        <div
          :key="questionIndex"
          class="question-item"
        >
          <div class="question-item__left">
            <el-tag type="primary">Q{{questionItem.topicNum}}</el-tag>
            <ul class="question-operation">
              <li v-if="questionIndex !== 0">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="上移本题"
                  placement="left"
                >
                  <i
                    @click="changeQuestionPosition('up', questionIndex)"
                    class="operation-icon up-icon"
                  ></i>
                    </el-tooltip>
              </li>
              <li v-if="questionIndex !== topicList.length - 1">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="下移本题"
                  placement="left"
                >
                  <i
                    @click="changeQuestionPosition('down', questionIndex)"
                    class="operation-icon down-icon"
                  ></i>
                    </el-tooltip>
              </li>
              <li>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除本题"
                  placement="left"
                >
                  <i
                    @click="deleteQuestion(questionIndex)"
                    class="operation-icon question-delete-icon"
                  ></i>
                    </el-tooltip>
              </li>
              <li>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="复制本题"
                  placement="left"
                >
                  <i
                    @click="cloneQuestion(questionIndex)"
                    class="operation-icon question-clone-icon"
                  ></i>
                    </el-tooltip>
              </li>
            </ul>
          </div>

          <!--单选-->
          <div
            class="question-item__right"
            v-if="questionItem.topicType === 1"
          >
            <div class="question-item__title">
              <input v-model="questionItem.topicTitle" />
            </div>
            <div class="question-item__body">
              <template v-if="isNormal || isByQues">
                <div
                  v-for="(optionItem, optionIndex) in questionItem.optionList"
                  class="question-option-container"
                >
                  <el-radio
                    disabled
                    v-model="optionItem.isBlank"
                    :label="1"
                  >
                    <input
                      @focus.stop="focusInput(questionIndex, optionIndex)"
                      placeholder="请输入选项标题"
                      @blur.stop="blurInput"
                      v-model="optionItem.optionTitle"
                    />
                    <i
                      :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                      @click.stop.prevent="deleteOption(questionIndex, optionIndex)"
                    ></i>
                      </el-radio>
            </div>
            </template>

            <template v-else>
              <div
                v-for="currItem in currJson"
                class="question-option-container"
              >
                <el-radio
                  disabled
                  :value="false"
                >
                  {{currItem.currName}}
                  </el-radio>
    </div>
    </template>
    <div
      v-if="isNormal || isByQues"
      class="question-choice-options"
    >
      <i
        class="operation-icon add-choice-icon"
        @click="addChoiceHandler(questionItem)"
      ></i>
        <i
          class="operation-icon batch-add-choice-icon"
          @click="batchAddClickHandler(questionItem)"
        ></i>
          </div>
          </div>
          </div>
          <!--评分单选-->
          <div
            class="question-item__right"
            v-if="questionItem.topicType === 24"
          >
            <div class="question-item__title">
              <input v-model="questionItem.topicTitle" />
            </div>
            <div class="question-item__body">
              <div
                v-for="(optionItem, optionIndex) in questionItem.optionList"
                class="question-option-container"
              >
                <el-radio
                  disabled
                  v-model="optionItem.isBlank"
                  :label="1"
                >
                  <input
                    @focus.stop="focusInput(questionIndex, optionIndex)"
                    placeholder="请输入选项标题"
                    @blur.stop="blurInput"
                    v-model="optionItem.optionTitle"
                  /> 分值：
                  <input
                    class="score-input"
                    @blur="numberBlurHandler(optionItem)"
                    type="number"
                    v-model="optionItem.score"
                  />
                  <i
                    :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                    @click.stop.prevent="deleteOption(questionIndex, optionIndex)"
                  ></i>
                    </el-radio>
            </div>
            <div class="question-choice-options">
              <i
                class="operation-icon add-choice-icon"
                @click="addChoiceHandler(questionItem)"
              ></i>
                <i
                  class="operation-icon batch-add-choice-icon"
                  @click="batchAddClickHandler(questionItem)"
                ></i>
            </div>
            </div>
            </div>

            <!--                            多选-->
            <div
              class="question-item__right"
              v-if="questionItem.topicType === 2"
            >
              <div class="question-item__title">
                <input v-model="questionItem.topicTitle" /> 限选
                <el-input-number
                  style="width: 130px;"
                  size="small"
                  :min="0"
                  :max="isByOpt ? (currJson.length === 0 ? Infinity : currJson.length) : questionItem.optionList.length"
                  v-model="questionItem.limitSelect"
                ></el-input-number>
              </div>
              <div class="question-item__body">
                <template v-if="isNormal || isByQues">
                  <div
                    v-for="(optionItem, optionIndex) in questionItem.optionList"
                    class="question-option-container"
                  >
                    <el-checkbox
                      disabled
                      :true-label="1"
                      :false-label="0"
                      v-model="optionItem.isBlank"
                    >
                      <input
                        @focus.stop="focusInput(questionIndex, optionIndex)"
                        placeholder="请输入选项标题"
                        @blur.stop="blurInput"
                        v-model="optionItem.optionTitle"
                      />
                      <i
                        :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                        @click.stop.prevent="deleteOption(questionIndex, optionIndex)"
                      ></i>
                        </el-checkbox>
              </div>
              </template>
              <template v-else>
                <div
                  v-for="currItem in currJson"
                  class="question-option-container"
                >
                  <el-checkbox
                    disabled
                    :true-label="1"
                    :false-label="0"
                  >
                    {{currItem.currName}}
                    </el-checkbox>
                    </div>
              </template>
              <div
                v-if="isNormal || isByQues"
                class="question-choice-options"
              >
                <i
                  class="operation-icon add-choice-icon"
                  @click="addChoiceHandler(questionItem)"
                ></i>
                  <i
                    class="operation-icon batch-add-choice-icon"
                    @click="batchAddClickHandler(questionItem)"
                  ></i>
                    </div>
                    </div>
                    </div>

                    <!--图片单选-->
                    <div
                      class="question-item__right quetion-item--pic-single-choice"
                      v-if="questionItem.topicType === 3"
                    >
                      <div class="question-item__title">
                        <input v-model="questionItem.topicTitle" />
                      </div>
                      <div class="question-item__body">
                        <div
                          class="question-option-container"
                          v-for="(optionItem, optionIndex) in questionItem.optionList"
                        >
                          <div
                            class="question-pic"
                            :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"
                          ></div>
                      <div class="question-pic-desc">
                        <span>
                          <el-radio
                            disabled
                            v-model="optionItem.isBlank"
                            :label="1"
                          >
                            <input
                              @focus.stop="focusInput(questionIndex, optionIndex)"
                              placeholder="请输入选项标题"
                              @blur.stop="blurInput"
                              v-model="optionItem.optionTitle"
                            />
                            </el-radio>
                        </span>
                        <i
                          :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                          @click.stop="deleteOption(questionIndex, optionIndex)"
                        ></i>
                      </div>
                      </div>
                      <uploader
                        v-model="questionItem.pics"
                        :multiple="true"
                        :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                        showMode="image"
                        showResult="no"
                        :successCallback="optionPicUploadSuccessHandler(questionIndex)"
                      >
                        </uploader>
                        </div>
                        </div>

                        <!--图片多选-->
                        <div
                          class="question-item__right quetion-item--pic-multiple-choice"
                          v-if="questionItem.topicType === 4"
                        >
                          <div class="question-item__title">
                            <input v-model="questionItem.topicTitle" /> 限选
                            <el-input-number
                              size="small"
                              :min="0"
                              :max="questionItem.optionList.length"
                              v-model="questionItem.limitSelect"
                            ></el-input-number>
                          </div>
                          <div class="question-item__body">
                            <div
                              class="question-option-container"
                              v-for="(optionItem, optionIndex) in questionItem.optionList"
                            >
                              <div
                                class="question-pic"
                                :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"
                              ></div>
                          <div class="question-pic-desc">
                            <span>
                              <el-checkbox
                                disabled
                                :true-label="1"
                                :false-label="0"
                                v-model="optionItem.isBlank"
                              >
                                <input
                                  @focus.stop="focusInput(questionIndex, optionIndex)"
                                  placeholder="请输入选项标题"
                                  @blur.stop="blurInput"
                                  v-model="optionItem.optionTitle"
                                />
                                </el-checkbox>
                            </span>
                            <i
                              :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                              @click.stop="deleteOption(questionIndex, optionIndex)"
                            ></i>
                          </div>
                          </div>
                          <uploader
                            v-model="questionItem.pics"
                            :multiple="true"
                            :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                            showMode="image"
                            showResult="no"
                            :successCallback="optionPicUploadSuccessHandler(questionIndex)"
                          >
                            </uploader>
                            </div>
                            </div>
                            <!--问答题-->

                            <div
                              class="question-item__right"
                              v-if="questionItem.topicType === 5"
                            >
                              <div class="question-item__title">
                                <input v-model="questionItem.topicTitle" />
                              </div>
                              <div
                                class="question-item__body"
                                style="margin-bottom: 10px;"
                              >
                                <el-input
                                  type="textarea"
                                  :rows="3"
                                  disabled
                                  placeholder="请输入选项标题"
                                  :value="''"
                                >
                                  </el-input>
                                  </div>
                                  </div>
                                  <div
                                    v-if="isNormal"
                                    class="more-setting-container"
                                  >更多设置：
                                    <span
                                      class="link"
                                      @click="openLinkSetting(questionItem, questionIndex)"
                                    >题目关联</span>
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                      <span
                                        v-show="questionItem.topicType != 5"
                                        class="link"
                                        @click="openMoreSetting(questionItem, questionIndex)"
                                      >选项设置</span>
                                        </div>
                                        <div
                                          v-if="isByQues&&(questionItem.topicType ==1||questionItem.topicType ==24)"
                                          class="more-setting-container"
                                        >更多设置：

                                          <span
                                            class="link"
                                            @click="openMoreSetting(questionItem, questionIndex)"
                                          >选项设置</span>
                                            </div>
                                            </div>
                                            </template>
                                            </div>
                                            </div>
                                            </div>
                                            <el-dialog
                                              title="批量添加"
                                              :visible.sync="isDialogShow"
                                              @close="batchAddQuestionContent = ' '"
                                            >
                                              <div style="margin-bottom: 10px;">每行代表一个选项，可以添加多个选项</div>
                                              <el-input
                                                type="textarea"
                                                :rows="3"
                                                :maxlength="500"
                                                v-model="batchAddQuestionContent"
                                              >
                                                </el-input>
                                                <div class="dialog-button-container">
                                                  <el-button
                                                    type="primary"
                                                    size="medium"
                                                    @click="confirmClickHandler"
                                                  >添加</el-button>
                                                    <el-button
                                                      type="default"
                                                      size="medium"
                                                      @click="cancelClickHandler"
                                                    >取消</el-button>
                                                </div>
                                                </el-dialog>
                                                <el-dialog
                                                  title="选项设置"
                                                  :visible.sync="isMoreSettingShow"
                                                >
                                                  <div style="margin-bottom: 10px;">当前题目：{{currentQuestion.topicNum}}.
                                                    <el-input
                                                      size="small"
                                                      style="width: 80%"
                                                      v-model="currentQuestion.topicTitle"
                                                    ></el-input>
                                                  </div>
                                                  <el-table
                                                    stripe
                                                    :data="currentQuestion.optionList"
                                                    border
                                                    fit
                                                    highlight-current-row
                                                    style="width: 100%"
                                                  >
                                                    <el-table-column
                                                      align="center"
                                                      label="选项文字"
                                                    >
                                                      <template slot-scope="scope">
                                                        <el-input
                                                          size="small"
                                                          style="width: 100%"
                                                          v-model="scope.row.optionTitle"
                                                        ></el-input>
                                                      </template>
                                                      </el-table-column>
                                                      <el-table-column
                                                        align="center"
                                                        label="允许填空"
                                                        prop="totalScore"
                                                      >
                                                        <template slot-scope="scope">
                                                          <el-checkbox
                                                            @change="isBlankChangeHandler($event, scope.row)"
                                                            v-model="scope.row.isBlank"
                                                            :true-label="1"
                                                            :false-label="0"
                                                          ></el-checkbox>
                                                            <i
                                                              class="el-icon-s-tools"
                                                              v-show="scope.row.isBlank == 1"
                                                              @click="openOptionSetting(scope.row)"
                                                            ></i>
                                                        </template>
                                                        </el-table-column>
                                                        <el-table-column
                                                          v-if="currentQuestion.topicType == 24"
                                                          align="center"
                                                          label="分数"
                                                          prop="choseAwardName"
                                                        >
                                                          <template slot-scope="scope">
                                                            <el-input-number
                                                              size="small"
                                                              v-model="scope.row.score"
                                                            ></el-input-number>
                                                          </template>
                                                          </el-table-column>
                                                          <el-table-column
                                                            align="center"
                                                            label="上移下移"
                                                          >
                                                            <template slot-scope="scope">
                                                              <i
                                                                v-if="scope.$index !== 0"
                                                                @click="changeOptionPosition('up', scope.$index)"
                                                                class="operation-icon operation-icon--show up-icon"
                                                              ></i>
                                                                <i
                                                                  v-if="scope.$index !== currentQuestion.optionList.length -1 "
                                                                  @click="changeOptionPosition('down', scope.$index)"
                                                                  class="operation-icon operation-icon--show down-icon"
                                                                  style="position: relative;top: 3px;"
                                                                ></i>
                                                            </template>
                                                            </el-table-column>
                                                            </el-table>
                                                            <div class="dialog-button-container">
                                                              <el-button
                                                                type="primary"
                                                                size="medium"
                                                                @click="isMoreSettingShow = false"
                                                              >确定</el-button>
                                                            </div>
                                                            </el-dialog>

                                                            <el-dialog
                                                              title="增加选项内容"
                                                              :visible.sync="isOptionSettingShow"
                                                            >
                                                              <div style="margin-bottom: 10px;">如果想让填写者在可填空的输入框中进行下拉选择，可以在下面输入框中输入选项,以换行分隔。</div>
                                                              <div>
                                                                <el-input
                                                                  type="textarea"
                                                                  :rows="4"
                                                                  placeholder="请输入内容"
                                                                  v-model="optionText"
                                                                >
                                                                  </el-input>
                                                              </div>
                                                              <div class="dialog-button-container">
                                                                <el-button
                                                                  type="primary"
                                                                  size="medium"
                                                                  @click="optionSettingConfirm()"
                                                                >确定</el-button>
                                                                  <el-button
                                                                    type="default"
                                                                    size="medium"
                                                                    @click="isOptionSettingShow = false"
                                                                  >取消</el-button>
                                                              </div>
                                                              </el-dialog>

                                                              <el-dialog
                                                                title="题目关联"
                                                                :visible.sync="isLinkShow"
                                                              >
                                                                <div style="margin-bottom: 10px;">
                                                                  <div class="dialog-label">当前题目：</div>
                                                                  <div class="dialog-value">{{currentQuestion.topicNum}}.{{currentQuestion.topicTitle}}</div>
                                                                </div>
                                                                <div style="margin-bottom: 10px;">
                                                                  <div class="dialog-label">关联题目1：</div>
                                                                  <div class="dialog-value">
                                                                    <div style="margin-bottom: 10px;">
                                                                      <el-select
                                                                        @change="linkSelectChangeHandler()"
                                                                        size="medium"
                                                                        v-model="linkForm.isLink"
                                                                        placeholder="请选择关联题目"
                                                                      >
                                                                        <el-option
                                                                          label="请选择关联题目"
                                                                          :value="0"
                                                                        ></el-option>
                                                                          <el-option
                                                                            :label="previousQuestion.topicTitle"
                                                                            :value="1"
                                                                          ></el-option>
                                                                            </el-select>
                                                                    </div>
                                                                    <div v-show="linkForm.isLink == 1">
                                                                      <div style="margin-bottom: 10px;">
                                                                        当“{{previousQuestion.topicTitle}}”选择下面的选项：
                                                                      </div>
                                                                      <div>
                                                                        <div
                                                                          v-for="(optionItem, optionIndex) in previousQuestion.optionList"
                                                                          class="question-option-container"
                                                                        >
                                                                          <el-checkbox
                                                                            v-model="optionItem.relevanceTopicNum"
                                                                            :true-label="currentQuestion.topicNum"
                                                                            :false-label="''"
                                                                          >
                                                                            {{optionItem.optionTitle}}
                                                                            </el-checkbox>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                                </div>
                                                                <div class="dialog-button-container">
                                                                  <el-button
                                                                    type="danger"
                                                                    size="medium"
                                                                    @click="confirmClickHandler"
                                                                  >删除所有题目关联</el-button>
                                                                    <el-button
                                                                      type="primary"
                                                                      size="medium"
                                                                      @click="linkConfirmHandler"
                                                                    >确定</el-button>
                                                                </div>
                                                                </el-dialog>
                                                                </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import { querySchoolAllCourse } from "@/api/common/common";
import {
  addEvaluateTwTemp,
  updateEvaluateTwTemp,
  getEvaluateTwTemp,
} from "@/api/evTea";
import BackTool from "@/components/BackTool";
import AddressBook from "@/components/AddressBook/indexExpand";
import Uploader from "@/components/Uploader/WebUploader";
import { mapGetters } from "vuex";

export default {
  components: {
    BackTool,
    AddressBook,
    Uploader,
  },
  computed: {
    ...mapGetters(["userInfo"]),
    currJson() {
      const currJson = [];
      this.checkedCurr.forEach(id => {
        const currItem = this.currList.find(item => item.id == id);
        if (currItem) {
          currJson.push({
            currId: currItem.id,
            currName: currItem.name,
            currOrder: currItem.order,
          });
        }
      });
      return currJson;
    },
  },
  mixins: [mixin],
  data: function() {
    return {
      checkedCurr: [],
      currList: [],

      id: this.$route.query.id,
      isEdit: !!this.$route.query.isEdit,
      isCopy: !!this.$route.query.isCopy,
      isShowMoreSetting: false,

      currentFocusInput: null,

      isLimitVoteCount: false,
      maxVoteCount: 0,

      tempTitle: "",
      tempDesc: "",

      topicList: [],

      questionItemList: [],
      isDialogShow: false,
      batchAddQuestionContent: "",
      batchAddCurrentQuestion: null,

      currentQuestion: {},
      previousQuestion: {},
      currentQuestionIndex: 0,
      currentOption: {},

      isMoreSettingShow: false,

      isOptionSettingShow: false,
      optionText: "",
      linkForm: {
        isLink: 0,
        linkOption: [],
      },

      isLinkShow: false,

      isNormal: this.$route.query.isNormal == 1,
      isByQues: this.$route.query.isByQues == 1,
      isByOpt: this.$route.query.isByOpt == 1,
    };
  },
  created() {
    if (this.isCopy || this.isEdit) {
      getEvaluateTwTemp({
        tempId: this.id,
      })
        .then(res => res.data)
        .then(data => {
          const pageData = data.data;
          pageData.topicList.forEach(topicItem => {
            topicItem.optionList.forEach(optionItem => {
              optionItem.blankSelect = JSON.parse(optionItem.blankSelect);
            });
          });
          this.checkedCurr = JSON.parse(pageData.currJson).map(
            item => item.currId
          );
          this.topicList = pageData.topicList;
          this.tempDesc = pageData.tempDesc;
          this.tempTitle = pageData.tempTitle;
        });
    }
    if (this.isByQues || this.isByOpt) {
      querySchoolAllCourse()
        .then(res => res.data)
        .then(data => {
          this.currList = data.data;
        });
    }
  },
  methods: {
    linkSelectChangeHandler() {
      if (this.linkForm.isLink == 0) {
        this.previousQuestion.optionList.forEach(item => {
          item.relevanceTopicNum = "";
        });
      }
    },
    isBlankChangeHandler(value, optionItem) {
      if (value == 0) {
        optionItem.blankSelect = [];
      }
    },
    openMoreSetting(questionItem, questionIndex) {
      this.currentQuestion = questionItem;
      this.currentQuestionIndex = questionIndex;
      this.isMoreSettingShow = true;
      console.log(questionItem);
    },
    openOptionSetting(optionItem) {
      this.optionText = optionItem.blankSelect.join("\n");
      this.currentOption = optionItem;
      this.isOptionSettingShow = true;
    },
    optionSettingConfirm() {
      this.currentOption.blankSelect = this.optionText.split("\n");
      this.isOptionSettingShow = false;
    },
    numberBlurHandler(optionItem) {
      let score = parseInt(optionItem.score);
      if (score < 0) {
        score = 0;
      }
      optionItem.score = score;
    },
    maxVoteBlurHandler() {
      if (!this.maxVoteCount) {
        this.maxVoteCount = 1;
      } else {
        this.maxVoteCount = Math.floor(this.maxVoteCount);
      }
    },
    resettopicNum() {
      let seq = 0;
      this.topicList.forEach(topicItem => {
        if (topicItem.topicType !== 7 && topicItem.topicType !== 8) {
          seq++;
          topicItem.topicNum = seq;
        } else {
          topicItem.topicNum = 0;
        }
      });
    },
    resetoptionNum() {
      let seq = 0;
      this.currentQuestion.optionList.forEach(optionItem => {
        seq++;
        optionItem.optionNum = seq;
        optionItem.topicNum = seq;
      });
    },
    batchAddClickHandler(questionItem) {
      this.batchAddCurrentQuestion = questionItem;
      this.isDialogShow = true;
    },
    addChoiceHandler(questionItem) {
      questionItem.optionList.push({
        isBlank: 0,
        optionPicUrl: "",
        optionNum: questionItem.optionList.length + 1,
        optionTitle: "",
        blankSelect: [],
        score: 0,
        relevanceTopicNum: "",
      });
    },
    focusInput(questionIndex, optionIndex) {
      setTimeout(() => {
        this.currentFocusInput = `${questionIndex}-${optionIndex}`;
      }, 250);
    },
    blurInput() {
      setTimeout(() => {
        this.currentFocusInput = null;
      }, 200);
    },
    questionnairePublish() {
      if (this.tempTitle === "") {
        this.$message.error("请填写模板标题！");
      } else if (this.tempDesc === "") {
        this.$message.error("请填写模板描述！");
      } else if (this.topicList.length === 0) {
        this.$message.error("模板至少包含一个问题！");
      } else if (
        (this.isByQues || this.isByOpt) &&
        this.currJson.length === 0
      ) {
        this.$message.error("至少选择一个学科！");
      } else {
        let validFlag = true;
        const topicList = [];
        this.topicList.forEach(topicItem => {
          if (validFlag) {
            if (topicItem.topicTitle === "" && topicItem.topicType !== 8) {
              this.$message.error("问题标题不能为空！");
              validFlag = false;
            } else if (
              [1, 2, 3, 4, 14, 21, 22, 23, 24].indexOf(topicItem.topicType) !==
                -1 &&
              !this.isByOpt
            ) {
              if (topicItem.optionList.length === 0) {
                this.$message.error("问题至少包含一个选项！");
                validFlag = false;
              } else if (
                topicItem.optionList.some(
                  optionItem => optionItem.optionTitle === ""
                )
              ) {
                this.$message.error("选项描述不能为空！");
                validFlag = false;
              }
            }
            const topicObject = JSON.parse(JSON.stringify(topicItem));
            delete topicObject.pics;
            if (this.isByOpt) {
              topicObject.optionList = [];
            }
            topicList.push(topicObject);
          }
        });
        if (validFlag) {
          const args = {
            currJson: [],
            tempDesc: this.tempDesc,
            tempTitle: this.tempTitle,
            tempType: this.isNormal ? 1 : this.isByQues ? 2 : 3,
            topicList,
          };
          if (!this.isNormal) {
            args.currJson = this.currJson;
          }
          new Promise(resolve => {
            if (this.isEdit) {
              args.id = this.id;
              updateEvaluateTwTemp(args)
                .then(res => res.data)
                .then(resolve);
            } else {
              addEvaluateTwTemp(args)
                .then(res => res.data)
                .then(resolve);
            }
          }).then(data => {
            if (data.result) {
              this.$message.success(
                `${this.isEdit ? "编辑" : this.isCopy ? "复制" : "新增"}成功`
              );
              setTimeout(() => {
                this.$router.back();
              }, 1000);
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      }
    },
    optionPicUploadSuccessHandler(questionIndex) {
      return data => {
        this.topicList[questionIndex].optionList.push({
          isBlank: 0,
          optionPicUrl: data.fileUrl,
          optionNum: this.topicList[questionIndex].optionList.length + 1,
          optionTitle: "",
          blankSelect: [],
          relevanceTopicNum: "",
        });
      };
    },
    deleteOption(questionIndex, optionIndex) {
      const questionItem = this.topicList[questionIndex];
      new Promise(resolve => {
        if (questionItem.optionList[optionIndex].relevanceTopicNum != "") {
          this.$confirm("本选项关联题目!", "删除", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              resolve();
            })
            .catch(() => {});
        } else {
          resolve();
        }
      }).then(() => {
        questionItem.optionList = [
          ...this.topicList[questionIndex].optionList.slice(0, optionIndex),
          ...this.topicList[questionIndex].optionList.slice(optionIndex + 1),
        ];
        questionItem.optionList.forEach((item, index) => {
          item.optionNum = index + 1;
        });
      });
    },
    getLinkedOption(questionItem, optionNum) {
      return questionItem.link.linkOption.find(
        item => item.optionNum == optionNum
      );
    },
    getLinkedOptionIndex(questionItem, optionNum) {
      return questionItem.link.linkOption.findIndex(
        item => item.optionNum == optionNum
      );
    },
    openLinkSetting(questionItem, index) {
      const previousQuestion = this.topicList
        .slice(0, index)
        .reverse()
        .find(questionItem => questionItem.topicType != 5);

      if (!previousQuestion) {
        this.$message.error("第一题不能设置关联逻辑！");
      } else {
        this.currentQuestion = questionItem;
        this.previousQuestion = previousQuestion;
        this.currentQuestionIndex = index;
        this.linkForm = {
          isLink: previousQuestion.optionList.some(
            item => item.relevanceTopicNum != ""
          )
            ? 1
            : 0,
        };
        this.isLinkShow = true;
      }
    },
    linkConfirmHandler() {
      this.isLinkShow = false;
    },
    confirmClickHandler() {
      const options = this.batchAddQuestionContent.split("\n");
      const optionList = [];
      options.filter(item => item.trim() !== "").forEach((item, index) => {
        optionList.push({
          isBlank: 0,
          optionPicUrl: "",
          optionNum: this.batchAddCurrentQuestion.optionList.length + index + 1,
          optionTitle: item,
          blankSelect: [],
          relevanceTopicNum: "",
        });
      });
      this.batchAddCurrentQuestion.optionList = [
        ...this.batchAddCurrentQuestion.optionList,
        ...optionList,
      ];
      this.batchAddCurrentQuestion = null;
      this.batchAddQuestionContent = "";
      this.isDialogShow = false;
    },
    cancelClickHandler() {
      this.batchAddCurrentQuestion = null;
      this.batchAddQuestionContent = "";
      this.isDialogShow = false;
    },
    resettopicOrder() {
      this.topicList.forEach((topicItem, index) => {
        topicItem.topicOrder = index + 1;
      });
    },
    deleteQuestion(questionIndex) {
      this.topicList = [
        ...this.topicList.slice(0, questionIndex),
        ...this.topicList.slice(questionIndex + 1),
      ];
      this.resettopicOrder();
      this.resettopicNum();
    },
    cloneQuestion(questionIndex) {
      this.topicList = [
        ...this.topicList.slice(0, questionIndex + 1),
        JSON.parse(JSON.stringify(this.topicList[questionIndex])),
        ...this.topicList.slice(questionIndex + 1),
      ];
      this.resettopicOrder();
      this.resettopicNum();
    },
    changeQuestionPosition(type, questionIndex) {
      if (type === "up") {
        this.topicList = [
          ...this.topicList.slice(0, questionIndex - 1),
          this.topicList[questionIndex],
          this.topicList[questionIndex - 1],
          ...this.topicList.slice(questionIndex + 1),
        ];
      } else {
        this.topicList = [
          ...this.topicList.slice(0, questionIndex),
          this.topicList[questionIndex + 1],
          this.topicList[questionIndex],
          ...this.topicList.slice(questionIndex + 2),
        ];
      }
      this.resettopicNum();
      this.resettopicOrder();
    },
    changeOptionPosition(type, optionIndex) {
      if (type === "up") {
        this.currentQuestion.optionList = [
          ...this.currentQuestion.optionList.slice(0, optionIndex - 1),
          this.currentQuestion.optionList[optionIndex],
          this.currentQuestion.optionList[optionIndex - 1],
          ...this.currentQuestion.optionList.slice(optionIndex + 1),
        ];
      } else {
        this.currentQuestion.optionList = [
          ...this.currentQuestion.optionList.slice(0, optionIndex),
          this.currentQuestion.optionList[optionIndex + 1],
          this.currentQuestion.optionList[optionIndex],
          ...this.currentQuestion.optionList.slice(optionIndex + 2),
        ];
      }
      this.resetoptionNum();
    },
    addQuestion(questionType) {
      const topicOrder = this.topicList.length + 1;
      let topicNum =
        this.topicList.length -
        this.topicList.filter(
          item => item.topicType === 7 || item.topicType === 8
        ).length +
        1;
      let optionList = [],
        limitSelect = 0,
        topicType = 0,
        topicTitle = "";
      switch (questionType) {
        case "single-choice":
          limitSelect = 0;
          topicType = 1;
          topicTitle = "文字单选";
          optionList = [
            {
              blankSelect: [],
              isBlank: 0,
              optionPicUrl: "",
              optionNum: 1,
              optionTitle: "",
              relevanceTopicNum: "",
            },
            {
              blankSelect: [],
              isBlank: 0,
              optionPicUrl: "",
              optionNum: 2,
              optionTitle: "",
              relevanceTopicNum: "",
            },
          ];
          break;
        case "single-choice-score":
          limitSelect = 0;
          topicType = 24;
          topicTitle = "评分单选";
          optionList = [
            {
              blankSelect: [],
              isBlank: 0,
              optionPicUrl: "",
              optionNum: 1,
              optionTitle: "",
              score: 0,
              relevanceTopicNum: "",
            },
            {
              blankSelect: [],
              isBlank: 0,
              optionPicUrl: "",
              optionNum: 2,
              optionTitle: "",
              score: 0,
              relevanceTopicNum: "",
            },
          ];
          break;
        case "multiple-choice":
          limitSelect = 0;
          topicType = 2;
          topicTitle = "文字多选";
          optionList = [
            {
              blankSelect: [],
              isBlank: 0,
              optionPicUrl: "",
              optionNum: 1,
              optionTitle: "",
              relevanceTopicNum: "",
            },
            {
              blankSelect: [],
              isBlank: 0,
              optionPicUrl: "",
              optionNum: 2,
              optionTitle: "",
              relevanceTopicNum: "",
            },
          ];
          break;
        case "pic-single-choice":
          limitSelect = 0;
          topicType = 3;
          topicTitle = "图片单选";
          optionList = [];
          break;
        case "pic-multiple-choice":
          limitSelect = 0;
          topicType = 4;
          topicTitle = "图片多选";
          optionList = [];
          break;
        case "qna":
          limitSelect = 0;
          topicType = 5;
          topicTitle = "问答题";
          optionList = [];
          break;
      }
      this.topicList.push({
        optionList,
        limitSelect,
        topicType,
        topicOrder,
        topicNum,
        topicTitle,
        pics: [],
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../styles/mixin";

@include globalstyle;
.page {
  padding: 12px;
}

.main-container {
  color: #717171;
  width: 1100px;
  margin: 10px auto;
}

.question-type-container {
  width: 210px;
  @include clearfix;
  float: left;
  border: 1px solid #dbdbdb;

  .question-type-container__title {
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    font-weight: bold;
  }

  .question-type {
    margin: 0;
    padding-left: 45px;
    box-sizing: border-box;

    .question-type-item {
      margin: 10px 0;
      cursor: pointer;

      & > * {
        @include middleIB;
      }

      &:hover {
        color: #000;

        .question-type-item__icon {
          background-image: url(../../assets/images/wjsj_toolico.png);
        }
      }

      .question-type-item__icon {
        background-image: url(../../assets/images/wjsj_toolico_off.png);
        width: 20px;
        height: 20px;
        margin-left: 10px;
        margin-right: 4px;

        &.question-type-item__icon--single-choice {
          background-position: 0 -119px;
        }

        &.question-type-item__icon--multiple-choice {
          background-position: 0 -140px;
        }

        &.question-type-item__icon--pic-single-choice {
          background-position: 0 -119px;
        }

        &.question-type-item__icon--pic-multiple-choice {
          background-position: 0 -140px;
        }

        &.question-type-item__icon--qna {
          background-position: 0 -160px;
        }

        &.question-type-item__icon--multi-fill {
          background-position: 0px -221px;
        }

        &.question-type-item__icon--label {
          background-position: 0px -200px;
        }

        &.question-type-item__icon--divider {
          background-position: 0px -240px;
        }

        &.question-type-item__icon--address {
          background-position: 0px -526px;
        }

        &.question-type-item__icon--pic {
          background-position: 0px -630px;
        }

        &.question-type-item__icon--rating {
          background-position: 0 -300px;
        }

        &.question-type-item__icon--phone {
          background-position: 0 -441px;
        }

        &.question-type-item__icon--email {
          background-position: 0 -506px;
        }

        &.question-type-item__icon--id {
          background-position: 0 -751px;
        }

        &.question-type-item__icon--date {
          background-position: 0 -815px;
        }

        &.question-type-item__icon--time {
          background-position: 0 -486px;
        }

        &.question-type-item__icon--fill {
          background-position: 0px -358px;
        }
      }
    }
  }
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

  &.operation-icon--show {
    display: inline-block;
    vertical-align: middle;
  }
}

.up-icon {
  background-position: -23px -513px;
}

.down-icon {
  background-position: -23px -538px;
}

.question-item:hover {
  .add-choice-icon,
  .batch-add-choice-icon,
  .up-icon,
  .down-icon,
  .question-delete-icon,
  .question-clone-icon {
    display: inline-block;
  }
}

.questionnaire-container {
  margin-left: 10px;
  border: 1px solid #dbdbdb;
  width: 875px;
  height: 618px;
  overflow-y: auto;
  float: left;
  box-sizing: border-box;

  input[type="text"],
  textarea {
    &:focus {
      background: #fdf9cd;
    }
  }

  .questionnaire-title,
  .questionnaire-desc,
  .questionnaire-setting {
    padding: 5px 50px;

    input,
    textarea {
      width: 100%;
      height: 100%;
      font-size: 20px;
      border: 0;
      resize: none;
    }
  }

  .questionnaire-setting {
    border-bottom: 1px solid #dbdbdb;
    position: relative;
  }

  .address-book-container {
    width: 200px;
    display: inline-block;
    vertical-align: middle;

    .search-input {
      width: 180px;
      white-space: nowrap;
    }

    .address-input {
      height: 40px;
    }
  }

  .questionnaire-title {
    height: 56px;
    text-align: center;

    input {
      text-align: center;
    }
  }

  .questionnaire-desc {
    height: 77px;
    border-top: 1px solid #dbdbdb;

    textarea {
      font-size: 18px;
    }
  }

  .question-container {
    padding: 5px 0;

    .question-item__body {
      margin-top: 10px;
    }

    .question-item {
      @include clearfix;
      padding: 10px 0;
      border-top: 1px solid #dbdbdb;

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

            .question-delete-icon {
              background-position: -21px -180px;
            }

            .question-clone-icon {
              background-position: -21px -360px;
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

        input,
        textarea {
          width: 100%;
          height: 100%;
          font-size: 14px;
          border: 0;
          resize: none;
          margin-bottom: 5px;

          &:focus {
            background: #fdf9cd;
          }
        }

        .score-input {
          width: 10%;
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
      height: 190px;
      float: left;
      border: 1px solid #ccc;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 5px;

      .question-pic {
        width: 150px;
        height: 150px;
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
      height: 190px;
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

.dialog-button-container {
  margin-top: 10px;
  text-align: right;
}

.divider {
  border: 1px solid #999;
}

.more-setting-container {
  clear: both;
  border-top: 1px dashed #dbdbdb;
  padding: 10px 10px 0 10px;
  font-size: 12px;
}
.curr-list {
  padding: 5px 0;
}
.left-part,
.right-part {
  display: inline-block;
  vertical-align: top;
}
.left-part {
  width: 50px;
  text-align: center;
}
.right-part {
  width: 815px;
  box-sizing: border-box;
  padding: 0 10px;
}
</style>
<style lang="scss">
#evTeaTempAddEdit {
  .address-box-item {
    line-height: 36px;
  }

  .search-input {
    width: 100%;
    margin: 0;
  }

  .img-upload {
    width: 160px;
    height: 190px;
    float: left;
    border: 1px solid #ccc;
    margin-right: 10px;
    margin-bottom: 10px;
    background: url(../../assets/images/picinput.png) no-repeat center center;
    cursor: pointer;
  }

  .image-upload-container {
    display: inline-block;
    vertical-align: top;

    .image-upload-container__inner {
      position: relative;
    }

    .cover-hint {
      position: relative;
      margin-top: 5px;
      font-size: 12px;

      i {
        margin-right: 5px;
      }
    }

    .upload-block-container,
    .upload-file-item {
      height: 148px;
      width: 288px;
    }

    .icon--block-del {
      display: none;
    }

    .image-upload__delete {
      height: 40px;
      line-height: 40px;
      background-color: #409efe;
      color: #fff;
      text-align: center;
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .el-icon-s-tools {
    vertical-align: middle;
    cursor: pointer;
    color: #606266;
  }

  .dialog-label {
    display: inline-block;
    vertical-align: top;
    width: 6em;
    margin-right: 10px;
    text-align: right;
  }

  .dialog-value {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
