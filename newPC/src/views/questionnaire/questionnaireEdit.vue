<template>
  <div
    id="questionnaireEdit"
    class="page"
  >
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
          @click="switchTab('logic')"
        >逻辑</div>
      </div>
      <div class="tab-header__actions">
        <el-button
          v-show="activeTab === 'content'"
          class="tab-header__action"
          size="medium"
          @click="questionnairePublish(0)"
        >预览</el-button>
        <el-button
          v-show="activeTab === 'content'"
          class="tab-header__action"
          size="medium"
          @click="questionnairePublish(1)"
          type="primary"
        >保存</el-button>
        <el-button
          v-show="activeTab === 'content'"
          class="tab-header__action"
          size="medium"
          @click="questionnairePublish(2)"
          type="success"
        >发布</el-button>
      </div>
    </div>
    <div class="main-container" v-show="activeTab === 'content'" :style="{height: `${maxH + 40}px`}">
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
                @click="addQuestion('single-choice-score')"
                class="question-type-item"
              >
                <span class="question-type-item__icon question-type-item__icon--single-choice"></span>
                <span>评分单选</span>
                </li>
                <li
                  @click="addQuestion('pic-single-choice')"
                  class="question-type-item"
                >
                  <span class="question-type-item__icon question-type-item__icon--pic-single-choice"></span>
                  <span>图片单选题</span>
                  </li>
                  <li
                    @click="addQuestion('pic-multiple-choice')"
                    class="question-type-item"
                  >
                    <span class="question-type-item__icon question-type-item__icon--pic-multiple-choice"></span>
                    <span>图片多选题</span>
                    </li>
                    <li
                      @click="addQuestion('single-select')"
                      class="question-type-item"
                    >
                      <span class="question-type-item__icon question-type-item__icon--single-choice"></span>
                      <span>下拉单选</span>
                      </li>
                      <li
                        @click="addQuestion('multiple-select')"
                        class="question-type-item"
                      >
                        <span class="question-type-item__icon question-type-item__icon--multiple-choice"></span>
                        <span>下拉多选</span>
                        </li>
                        <li
                          @click="addQuestion('qna')"
                          class="question-type-item"
                        >
                          <span class="question-type-item__icon question-type-item__icon--qna"></span>
                          <span>问答题</span>
                          </li>
                          <li
                            @click="addQuestion('fillblank')"
                            class="question-type-item"
                          >
                            <span class="question-type-item__icon question-type-item__icon--fill"></span>
                            <span>填空</span>
                            </li>
                            <li
                              @click="addQuestion('multipleChooseFill')"
                              class="question-type-item"
                            >
                              <span class="question-type-item__icon question-type-item__icon--multi-fill"></span>
                              <span>多项填空</span>
                              </li>
                              <li
                                @click="addQuestion('label')"
                                class="question-type-item"
                              >
                                <span class="question-type-item__icon question-type-item__icon--label"></span>
                                <span>描述</span>
                                </li>
                                <li
                                  @click="addQuestion('divider')"
                                  class="question-type-item"
                                >
                                  <span class="question-type-item__icon question-type-item__icon--divider"></span>
                                  <span>分割线</span>
                                  </li>
                                  <li
                                    @click="addQuestion('address')"
                                    class="question-type-item"
                                  >
                                    <span class="question-type-item__icon question-type-item__icon--address"></span>
                                    <span>地址</span>
                                    </li>
                                    <li
                                      @click="addQuestion('pic-single-uploader')"
                                      class="question-type-item"
                                    >
                                      <span class="question-type-item__icon question-type-item__icon--pic"></span>
                                      <span>单个图片上传</span>
                                      </li>
                                      <li
                                        @click="addQuestion('pic-multiple-uploader')"
                                        class="question-type-item"
                                      >
                                        <span class="question-type-item__icon question-type-item__icon--pic"></span>
                                        <span>多个图片上传</span>
                                        </li>
                                        <li
                                          @click="addQuestion('rate')"
                                          class="question-type-item"
                                        >
                                          <span class="question-type-item__icon question-type-item__icon--rating"></span>
                                          <span>评分题</span>
                                          </li>
                                          <li
                                            @click="addQuestion('phone_num')"
                                            class="question-type-item"
                                          >
                                            <span class="question-type-item__icon question-type-item__icon--phone"></span>
                                            <span>手机号</span>
                                            </li>
                                            <li
                                              @click="addQuestion('email')"
                                              class="question-type-item"
                                            >
                                              <span class="question-type-item__icon question-type-item__icon--email"></span>
                                              <span>邮箱</span>
                                              </li>
                                              <li
                                                @click="addQuestion('id_num')"
                                                class="question-type-item"
                                              >
                                                <span class="question-type-item__icon question-type-item__icon--id"></span>
                                                <span>身份证</span>
                                                </li>
                                                <li
                                                  @click="addQuestion('date')"
                                                  class="question-type-item"
                                                >
                                                  <span class="question-type-item__icon question-type-item__icon--date"></span>
                                                  <span>日期</span>
                                                  </li>
                                                  <li
                                                    @click="addQuestion('time')"
                                                    class="question-type-item"
                                                  >
                                                    <span class="question-type-item__icon question-type-item__icon--time"></span>
                                                    <span>时间</span>
                                                    </li>
        </ul>
      </div>
      <div
        class="questionnaire-container"
      >
        <div class="questionnaire-title">
          <input
            maxlength="40"
            type="text"
            v-model.trim="voteTitle"
            placeholder="问卷标题"
          />
        </div>
        <div class="questionnaire-desc">
          <textarea
            maxlength="3000"
            placeholder="欢迎参加本次答题"
            v-model.trim="voteDesc"
          ></textarea>
        </div>
        <div class="questionnaire-setting">
          <div class="base-setting">
            发布范围：
            <el-select
              style="width: 100px;"
              v-model="sendUserType"
              placeholder="请选择"
            >
              <el-option
                label="老师"
                :value="1"
              ></el-option>
                <el-option
                  label="学生"
                  :value="2"
                ></el-option>
                  </el-select>
                  <div class="address-book-container">
                    <address-book
                      v-if="sendUserType === 1"
                      ref="addressTeacher"
                      v-model="teacherAddressData"
                      :config="teacherAddressConfigData"
                    ></address-book>
                      <address-book
                        v-else
                        ref="addressStudent"
                        v-model="studentAddressData"
                        :config="studentAddressConfigData"
                      ></address-book>
                  </div>
          </div>
    </div>
    <div class="question-container">
      <template v-for="(questionItem, questionIndex) in topicList">
        <div
          :key="questionIndex"
          class="question-item quetion-item--single-choice"
        >
          <div class="question-item__left">
            <el-tag
              type="primary"
              v-if="questionItem.topType === 7"
            >描述</el-tag>
              <el-tag
                type="primary"
                v-else-if="questionItem.topType === 8"
              >分割</el-tag>
                <el-tag
                  type="primary"
                  v-else
                >Q{{questionItem.topicSeq}}</el-tag>
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
          <div
            class="question-item__right"
            v-if="questionItem.topType === 1"
          >
            <div class="question-item__title">
              <input v-model="questionItem.topicTitle" />
              <el-checkbox
                v-model="questionItem.isHaveToDo"
                :true-label="0"
                :false-label="1"
              >必做
                </el-checkbox>&nbsp;&nbsp;
            </div>
            <div class="question-item__extra">
              排序
              <el-input
                type="text"
                style="width: 60px;"
                size="small"
                :min="0"
                :max="1000"
                :key="questionIndex"
                v-model="questionItem.topicOrder"
                @input="questionTopicOrderInputHandler"
                @change="questionTopicOrderChangeHandler(questionItem)"
                :controls="false"
              ></el-input>
            </div>
            <div class="question-item__body">
              <div
                v-for="(optionItem, optionIndex) in questionItem.optionList"
                class="question-option-container radius"
              >
                <el-checkbox
                  :true-label="1"
                  :false-label="0"
                  v-model="optionItem.isHaveReason"
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
    <div
      class="question-item__right"
      v-if="questionItem.topType === 22"
    >
      <div class="question-item__title">
        <input v-model="questionItem.topicTitle" />
        <el-checkbox
          v-model="questionItem.isHaveToDo"
          :true-label="0"
          :false-label="1"
        >必做</el-checkbox>&nbsp;&nbsp;
      </div>
      <div class="question-item__extra">
        排序
        <el-input
          type="text"
          style="width: 60px;"
          size="small"
          :min="0"
          :max="1000"
          :key="questionIndex"
          v-model="questionItem.topicOrder"
          @input="questionTopicOrderInputHandler"
          @change="questionTopicOrderChangeHandler(questionItem)"
          :controls="false"
        ></el-input>
      </div>
      <div class="question-item__body">
        <div
          v-for="(optionItem, optionIndex) in questionItem.optionList"
          class="question-option-container"
        >
          <input
            @focus.stop="focusInput(questionIndex, optionIndex)"
            placeholder="请输入选项标题"
            style="width: 500px;"
            @blur.stop="blurInput"
            v-model="optionItem.optionTitle"
          />
          <i
            :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
            @click.stop.prevent="deleteOption(questionIndex, optionIndex)"
          ></i>
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

      <!--单项填空-->
      <div
        class="question-item__right"
        v-if="questionItem.topType === 14"
      >
        <div class="question-item__title">
          <input v-model="questionItem.topicTitle" />
        </div>
        <div class="question-item__extra">
          排序
          <el-input
            type="text"
            style="width: 60px;"
            size="small"
            :min="0"
            :max="1000"
            :key="questionIndex"
            v-model="questionItem.topicOrder"
            @input="questionTopicOrderInputHandler"
            @change="questionTopicOrderChangeHandler(questionItem)"
            :controls="false"
          ></el-input>
        </div>
        <div class="question-item__body">
          <div
            v-for="(optionItem, optionIndex) in questionItem.optionList"
            class="question-option-container"
          >
            <el-checkbox
              :true-label="1"
              :false-label="0"
              v-model="optionItem.isHaveReason"
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
        <!--多选-->
        <div
          class="question-item__right"
          v-if="questionItem.topType === 2"
        >
          <div class="question-item__title">
            <input v-model="questionItem.topicTitle" />
            <el-checkbox
              v-model="questionItem.isHaveToDo"
              :true-label="0"
              :false-label="1"
            >必做
              </el-checkbox>
          </div>
          <div class="question-item__extra">
            排序
            <el-input
              type="text"
              style="width: 60px;"
              size="small"
              :min="0"
              :max="1000"
              :key="questionIndex"
              v-model="questionItem.topicOrder"
              @input="questionTopicOrderInputHandler"
              @change="questionTopicOrderChangeHandler(questionItem)"
              :controls="false"
            ></el-input>
              &nbsp;&nbsp;&nbsp;&nbsp; 限选
              <el-input-number
                style="width: 130px;"
                size="small"
                :min="0"
                :max="questionItem.optionList.length"
                v-model="questionItem.selectedMax"
              ></el-input-number>
          </div>
          <div class="question-item__body">
            <div
              v-for="(optionItem, optionIndex) in questionItem.optionList"
              class="question-option-container"
            >
              <el-checkbox
                :true-label="1"
                :false-label="0"
                v-model="optionItem.isHaveReason"
              >
                <input
                  @focus.stop="focusInput(questionIndex, optionIndex)"
                  placeholder="请输入选项标题"
                  @blur.stop="blurInput"
                  v-model="optionItem.optionTitle"
                />
                <i
                  :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                  @click.stop="deleteOption(questionIndex, optionIndex)"
                ></i>
                  </el-checkbox>
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
          <div
            class="question-item__right"
            v-if="questionItem.topType === 23"
          >
            <div class="question-item__title">
              <input v-model="questionItem.topicTitle" />
              <el-checkbox
                v-model="questionItem.isHaveToDo"
                :true-label="0"
                :false-label="1"
              >必做</el-checkbox>&nbsp;&nbsp;
            </div>
            <div class="question-item__extra">
              排序
              <el-input
                type="text"
                style="width: 60px;"
                size="small"
                :min="0"
                :max="1000"
                :key="questionIndex"
                v-model="questionItem.topicOrder"
                @change="questionTopicOrderChangeHandler(questionItem)"
                :controls="false"
              ></el-input>
                &nbsp;&nbsp;&nbsp;&nbsp; 限选
                <el-input-number
                  style="width: 130px;"
                  size="small"
                  :min="0"
                  :max="questionItem.optionList.length"
                  v-model="questionItem.selectedMax"
                ></el-input-number>
            </div>
            <div class="question-item__body">
              <div
                v-for="(optionItem, optionIndex) in questionItem.optionList"
                class="question-option-container"
              >
                <input
                  @focus.stop="focusInput(questionIndex, optionIndex)"
                  placeholder="请输入选项标题"
                  style="width: 500px;"
                  @blur.stop="blurInput"
                  v-model="optionItem.optionTitle"
                />
                <i
                  :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                  @click.stop.prevent="deleteOption(questionIndex, optionIndex)"
                ></i>
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
            <!--多项填空-->
            <div
              class="question-item__right"
              v-if="questionItem.topType === 21"
            >
              <div class="question-item__title">
                <input v-model="questionItem.topicTitle" />
              </div>
              <div class="question-item__extra">
                排序
                <el-input
                  type="text"
                  style="width: 60px;"
                  size="small"
                  :min="0"
                  :max="1000"
                  :key="questionIndex"
                  v-model="questionItem.topicOrder"
                  @input="questionTopicOrderInputHandler"
                  @change="questionTopicOrderChangeHandler(questionItem)"
                  :controls="false"
                ></el-input>
              </div>
              <div class="question-item__body">
                <div
                  v-for="(optionItem, optionIndex) in questionItem.optionList"
                  class="question-option-container"
                >
                  <el-checkbox
                    :true-label="1"
                    :false-label="0"
                    v-model="optionItem.isHaveReason"
                  >
                    <input
                      @focus.stop="focusInput(questionIndex, optionIndex)"
                      placeholder="请输入选项标题"
                      @blur.stop="blurInput"
                      v-model="optionItem.optionTitle"
                    />
                    <i
                      :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                      @click.stop="deleteOption(questionIndex, optionIndex)"
                    ></i>
                      </el-checkbox>
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
              <!--评分单选-->
              <div
                class="question-item__right"
                v-if="questionItem.topType === 24"
              >
                <div class="question-item__title">
                  <input v-model="questionItem.topicTitle" />
                  <el-checkbox
                    v-model="questionItem.isHaveToDo"
                    :true-label="0"
                    :false-label="1"
                  >必做</el-checkbox>&nbsp;&nbsp;
                </div>
                <div class="question-item__extra">
                  排序
                  <el-input
                    type="text"
                    style="width: 60px;"
                    size="small"
                    :min="0"
                    :max="1000"
                    :key="questionIndex"
                    v-model="questionItem.topicOrder"
                    @input="questionTopicOrderInputHandler"
                    @change="questionTopicOrderChangeHandler(questionItem)"
                    :controls="false"
                  ></el-input>
                </div>
                <div class="question-item__body">
                  <div
                    v-for="(optionItem, optionIndex) in questionItem.optionList"
                    class="question-option-container radius"
                  >
                    <el-checkbox
                      :true-label="1"
                      :false-label="0"
                      v-model="optionItem.isHaveReason"
                    >
                      <input
                        @focus.stop="focusInput(questionIndex, optionIndex)"
                        placeholder="请输入选项标题"
                        @blur.stop="blurInput"
                        v-model="optionItem.optionTitle"
                      />
                      <span>分值：</span><input
                        class="score-input"
                        @mouseup.stop.prevent
                        @blur="numberBlurHandler(optionItem)"
                        type="number"
                        v-model="optionItem.score"
                      />
                      <i
                        :class="['operation-icon', 'option-del-icon', currentFocusInput === `${questionIndex}-${optionIndex}` ? 'option-del-icon--show' : '']"
                        @click.stop.prevent="deleteOption(questionIndex, optionIndex)"
                      ></i>
                        </el-checkbox>
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
                <!--图片单选-->
                <div
                  class="question-item__right quetion-item--pic-single-choice"
                  v-if="questionItem.topType === 3"
                >
                  <div class="question-item__title">
                    <input v-model="questionItem.topicTitle" />
                    <el-checkbox
                      v-model="questionItem.isHaveToDo"
                      :true-label="0"
                      :false-label="1"
                    >必做
                      </el-checkbox>&nbsp;&nbsp;
                  </div>
                  <div class="question-item__extra">
                    排序
                    <el-input
                      type="text"
                      style="width: 60px;"
                      size="small"
                      :min="0"
                      :max="1000"
                      :key="questionIndex"
                      v-model="questionItem.topicOrder"
                      @input="questionTopicOrderInputHandler"
                      @change="questionTopicOrderChangeHandler(questionItem)"
                      :controls="false"
                    ></el-input>
                  </div>
                  <div class="question-item__body">
                    <div
                      class="question-option-container radius"
                      v-for="(optionItem, optionIndex) in questionItem.optionList"
                    >
                      <div
                        class="question-pic"
                        :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"
                      ></div>
                  <div class="question-pic-desc">
                    <span>
                      <el-checkbox
                        :true-label="1"
                        :false-label="0"
                        v-model="optionItem.isHaveReason"
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
                    module="wenjuan"
                    pathPrefix="wenjuan"
                    moduleCode="2054"
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
                      v-if="questionItem.topType === 4"
                    >
                      <div class="question-item__title">
                        <input v-model="questionItem.topicTitle" />
                        <el-checkbox
                          v-model="questionItem.isHaveToDo"
                          :true-label="0"
                          :false-label="1"
                        >必做
                          </el-checkbox>
                      </div>
                      <div class="question-item__extra">
                        排序
                        <el-input
                          type="text"
                          style="width: 60px;"
                          size="small"
                          :min="0"
                          :max="1000"
                          :key="questionIndex"
                          v-model="questionItem.topicOrder"
                          @input="questionTopicOrderInputHandler"
                          @change="questionTopicOrderChangeHandler(questionItem)"
                          :controls="false"
                        ></el-input>
                          &nbsp;&nbsp;&nbsp;&nbsp; 限选
                          <el-input-number
                            style="width: 130px;"
                            size="small"
                            :min="0"
                            :max="questionItem.optionList.length"
                            v-model="questionItem.selectedMax"
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
                            :true-label="1"
                            :false-label="0"
                            v-model="optionItem.isHaveReason"
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
                        module="wenjuan"
                        pathPrefix="wenjuan"
                        moduleCode="2054"
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
                          v-if="questionItem.topType === 5"
                        >
                          <div class="question-item__title">
                            <input v-model="questionItem.topicTitle" />
                            <el-checkbox
                              v-model="questionItem.isHaveToDo"
                              :true-label="0"
                              :false-label="1"
                            >必做
                              </el-checkbox>&nbsp;&nbsp;
                          </div>
                          <div class="question-item__extra">
                            排序
                            <el-input
                              type="text"
                              style="width: 60px;"
                              size="small"
                              :min="0"
                              :max="1000"
                              :key="questionIndex"
                              v-model="questionItem.topicOrder"
                              @input="questionTopicOrderInputHandler"
                              @change="questionTopicOrderChangeHandler(questionItem)"
                              :controls="false"
                            ></el-input>
                          </div>
                          <div class="question-item__body">
                            <el-input
                              type="textarea"
                              :rows="3"
                              placeholder="请输入选项标题"
                              :value="''"
                            >
                              </el-input>
                          </div>
                          </div>
                          <!--填空题-->
                          <div
                            class="question-item__right"
                            v-if="questionItem.topType === 6"
                          >
                            <div class="question-item__title">
                              <el-checkbox
                                v-model="questionItem.isHaveToDo"
                                :true-label="0"
                                :false-label="1"
                              >必做
                                </el-checkbox>&nbsp;&nbsp;
                            </div>
                            <div class="question-item__extra">
                              排序
                              <el-input
                                type="text"
                                style="width: 60px;"
                                size="small"
                                :min="0"
                                :max="1000"
                                :key="questionIndex"
                                v-model="questionItem.topicOrder"
                                @input="questionTopicOrderInputHandler"
                                @change="questionTopicOrderChangeHandler(questionItem)"
                                :controls="false"
                              ></el-input>
                            </div>
                            <div class="question-item__body">
                              <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="填空题(空处用{n}表示)"
                                v-model="questionItem.topicTitle"
                              >
                                </el-input>
                            </div>
                            </div>
                            <!--描述-->
                            <div
                              class="question-item__right"
                              v-if="questionItem.topType === 7"
                            >
                              <div class="question-item__body">
                                <el-input
                                  type="text"
                                  v-model="questionItem.topicTitle"
                                >
                                  </el-input>
                              </div>
                              <br />
                              <div class="question-item__extra">
                                排序
                                <el-input
                                  type="text"
                                  style="width: 60px;"
                                  size="small"
                                  :min="0"
                                  :max="1000"
                                  :key="questionIndex"
                                  v-model="questionItem.topicOrder"
                                  @input="questionTopicOrderInputHandler"
                                  @change="questionTopicOrderChangeHandler(questionItem)"
                                  :controls="false"
                                ></el-input>
                              </div>
                              </div>
                              <!--分割线-->
                              <div
                                class="question-item__right"
                                v-if="questionItem.topType === 8"
                              >
                                <div class="divider"></div>
                                <br />
                                <div class="question-item__extra">
                                  排序
                                  <el-input
                                    type="text"
                                    style="width: 60px;"
                                    size="small"
                                    :min="0"
                                    :max="1000"
                                    :key="questionIndex"
                                    v-model="questionItem.topicOrder"
                                    @input="questionTopicOrderInputHandler"
                                    @change="questionTopicOrderChangeHandler(questionItem)"
                                    :controls="false"
                                  ></el-input>
                                </div>
                                </div>
                                <!--地址-->
                                <div
                                  class="question-item__right"
                                  v-if="questionItem.topType === 9"
                                >
                                  <div class="question-item__title">
                                    <input v-model="questionItem.topicTitle" />
                                    <el-checkbox
                                      v-model="questionItem.isHaveToDo"
                                      :true-label="0"
                                      :false-label="1"
                                    >必做
                                      </el-checkbox>&nbsp;&nbsp;
                                  </div>
                                  <div class="question-item__extra">
                                    排序
                                    <el-input
                                      type="text"
                                      style="width: 60px;"
                                      size="small"
                                      :min="0"
                                      :max="1000"
                                      :key="questionIndex"
                                      v-model="questionItem.topicOrder"
                                      @input="questionTopicOrderInputHandler"
                                      @change="questionTopicOrderChangeHandler(questionItem)"
                                      :controls="false"
                                    ></el-input>
                                  </div>
                                  </div>
                                  <!--单个图片上传-->
                                  <div
                                    class="question-item__right quetion-item--pic-single-uploader"
                                    v-if="questionItem.topType === 10"
                                  >
                                    <div class="question-item__title">
                                      <input v-model="questionItem.topicTitle" />
                                      <el-checkbox
                                        v-model="questionItem.isHaveToDo"
                                        :true-label="0"
                                        :false-label="1"
                                      >必做
                                        </el-checkbox>&nbsp;&nbsp;
                                    </div>
                                    <div class="question-item__extra">
                                      排序
                                      <el-input
                                        type="text"
                                        style="width: 60px;"
                                        size="small"
                                        :min="0"
                                        :max="1000"
                                        :key="questionIndex"
                                        v-model="questionItem.topicOrder"
                                        @input="questionTopicOrderInputHandler"
                                        @change="questionTopicOrderChangeHandler(questionItem)"
                                        :controls="false"
                                      ></el-input>
                                    </div>
                                    <div class="question-item__body">
                                      <div class="img-upload">
                                      </div>
                                    </div>
                                    </div>
                                    <!--多个图片上传-->
                                    <div
                                      class="question-item__right quetion-item--pic-multiple-uploader"
                                      v-if="questionItem.topType === 11"
                                    >
                                      <div class="question-item__title">
                                        <input v-model="questionItem.topicTitle" />
                                        <el-checkbox
                                          v-model="questionItem.isHaveToDo"
                                          :true-label="0"
                                          :false-label="1"
                                        >必做
                                          </el-checkbox>&nbsp;&nbsp;
                                      </div>
                                      <div class="question-item__extra">
                                        排序
                                        <el-input
                                          type="text"
                                          style="width: 60px;"
                                          size="small"
                                          :min="0"
                                          :max="1000"
                                          :key="questionIndex"
                                          v-model="questionItem.topicOrder"
                                          @input="questionTopicOrderInputHandler"
                                          @change="questionTopicOrderChangeHandler(questionItem)"
                                          :controls="false"
                                        ></el-input>
                                      </div>
                                      <div class="question-item__body">
                                        <div class="img-upload">
                                        </div>
                                      </div>
                                      </div>
                                      <!--评分题-->
                                      <div
                                        class="question-item__right"
                                        v-if="questionItem.topType === 12"
                                      >
                                        <div class="question-item__title">
                                          <input v-model="questionItem.topicTitle" />
                                          <el-checkbox
                                            v-model="questionItem.isHaveToDo"
                                            :true-label="0"
                                            :false-label="1"
                                          >必做
                                            </el-checkbox>
                                        </div>
                                        <div class="question-item__extra">
                                          排序
                                          <el-input
                                            type="text"
                                            style="width: 60px;"
                                            size="small"
                                            :min="0"
                                            :max="1000"
                                            :key="questionIndex"
                                            v-model="questionItem.topicOrder"
                                            @input="questionTopicOrderInputHandler"
                                            @change="questionTopicOrderChangeHandler(questionItem)"
                                            :controls="false"
                                          ></el-input>
                                        </div>
                                        <div class="question-item__body">
                                          <el-rate></el-rate>
                                        </div>
                                        </div>
                                        <!--手机号-->
                                        <div
                                          class="question-item__right"
                                          v-if="questionItem.topType === 15"
                                        >
                                          <div class="question-item__title">
                                            <input v-model="questionItem.topicTitle" />
                                            <el-checkbox
                                              v-model="questionItem.isHaveToDo"
                                              :true-label="0"
                                              :false-label="1"
                                            >必做
                                              </el-checkbox>&nbsp;&nbsp;
                                          </div>
                                          <div class="question-item__extra">
                                            排序
                                            <el-input
                                              type="text"
                                              style="width: 60px;"
                                              size="small"
                                              :min="0"
                                              :max="1000"
                                              :key="questionIndex"
                                              v-model="questionItem.topicOrder"
                                              @input="questionTopicOrderInputHandler"
                                              @change="questionTopicOrderChangeHandler(questionItem)"
                                              :controls="false"
                                            ></el-input>
                                          </div>
                                          <div class="question-item__body">
                                            <el-input
                                              type="text"
                                              :value="''"
                                            >
                                              </el-input>
                                          </div>
                                          </div>
                                          <!--邮箱-->
                                          <div
                                            class="question-item__right"
                                            v-if="questionItem.topType === 16"
                                          >
                                            <div class="question-item__title">
                                              <input v-model="questionItem.topicTitle" />
                                              <el-checkbox
                                                v-model="questionItem.isHaveToDo"
                                                :true-label="0"
                                                :false-label="1"
                                              >必做
                                                </el-checkbox>&nbsp;&nbsp;
                                            </div>
                                            <div class="question-item__extra">
                                              排序
                                              <el-input
                                                type="text"
                                                style="width: 60px;"
                                                size="small"
                                                :min="0"
                                                :max="1000"
                                                :key="questionIndex"
                                                v-model="questionItem.topicOrder"
                                                @input="questionTopicOrderInputHandler"
                                                @change="questionTopicOrderChangeHandler(questionItem)"
                                                :controls="false"
                                              ></el-input>
                                            </div>
                                            <div class="question-item__body">
                                              <el-input
                                                type="text"
                                                :value="''"
                                              >
                                                </el-input>
                                            </div>
                                            </div>
                                            <!--身份证-->
                                            <div
                                              class="question-item__right"
                                              v-if="questionItem.topType === 17"
                                            >
                                              <div class="question-item__title">
                                                <input v-model="questionItem.topicTitle" />
                                                <el-checkbox
                                                  v-model="questionItem.isHaveToDo"
                                                  :true-label="0"
                                                  :false-label="1"
                                                >必做
                                                  </el-checkbox>&nbsp;&nbsp;
                                              </div>
                                              <div class="question-item__extra">
                                                排序
                                                <el-input
                                                  type="text"
                                                  style="width: 60px;"
                                                  size="small"
                                                  :min="0"
                                                  :max="1000"
                                                  :key="questionIndex"
                                                  v-model="questionItem.topicOrder"
                                                  @input="questionTopicOrderInputHandler"
                                                  @change="questionTopicOrderChangeHandler(questionItem)"
                                                  :controls="false"
                                                ></el-input>
                                              </div>
                                              <div class="question-item__body">
                                                <el-input
                                                  type="text"
                                                  :value="''"
                                                >
                                                  </el-input>
                                              </div>
                                              </div>
                                              <!--日期-->
                                              <div
                                                class="question-item__right"
                                                v-if="questionItem.topType === 18"
                                              >
                                                <div class="question-item__title">
                                                  <input v-model="questionItem.topicTitle" />
                                                  <el-checkbox
                                                    v-model="questionItem.isHaveToDo"
                                                    :true-label="0"
                                                    :false-label="1"
                                                  >必做
                                                    </el-checkbox>&nbsp;&nbsp;
                                                </div>
                                                <div class="question-item__extra">
                                                  排序
                                                  <el-input
                                                    type="text"
                                                    style="width: 60px;"
                                                    size="small"
                                                    :min="0"
                                                    :max="1000"
                                                    :key="questionIndex"
                                                    v-model="questionItem.topicOrder"
                                                    @input="questionTopicOrderInputHandler"
                                                    @change="questionTopicOrderChangeHandler(questionItem)"
                                                    :controls="false"
                                                  ></el-input>
                                                </div>
                                                <div class="question-item__body">
                                                  <el-input
                                                    type="text"
                                                    :value="''"
                                                  >
                                                    </el-input>
                                                </div>
                                                </div>
                                                <!--时间-->
                                                <div
                                                  class="question-item__right"
                                                  v-if="questionItem.topType === 19"
                                                >
                                                  <div class="question-item__title">
                                                    <input v-model="questionItem.topicTitle" />
                                                    <el-checkbox
                                                      v-model="questionItem.isHaveToDo"
                                                      :true-label="0"
                                                      :false-label="1"
                                                    >必做
                                                      </el-checkbox>&nbsp;&nbsp;
                                                  </div>
                                                  <div class="question-item__extra">
                                                    排序
                                                    <el-input
                                                      type="text"
                                                      style="width: 60px;"
                                                      size="small"
                                                      :min="0"
                                                      :max="1000"
                                                      :key="questionIndex"
                                                      v-model="questionItem.topicOrder"
                                                      @input="questionTopicOrderInputHandler"
                                                      @change="questionTopicOrderChangeHandler(questionItem)"
                                                      :controls="false"
                                                    ></el-input>
                                                  </div>
                                                  <div class="question-item__body">
                                                    <el-input
                                                      type="text"
                                                      :value="''"
                                                    >
                                                      </el-input>
                                                  </div>
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
            <el-select class="setting-select--user-type" v-model="sendUserType" placeholder="请选择">
              <el-option label="老师" :value="1"></el-option>
              <el-option label="学生" :value="2"></el-option>
            </el-select>
            <div class="address-book-container setting-address-book">
              <address-book
                v-if="sendUserType === 1"
                  id="addressStudentSetting"
                ref="addressTeacherSetting"
                v-model="teacherAddressData"
                :config="teacherAddressConfigData"
              ></address-book>
              <address-book
                v-else
                ref="addressStudentSetting"
                v-model="studentAddressData"
                :config="studentAddressConfigData"
                id="addressStudentSetting"
              ></address-book>
            </div>
          </div>
        </div>
        <div class="setting-form-item">
          <label class="setting-label">权限设置</label>
          <div class="setting-content">
            <el-checkbox v-model="isShowResult" :true-label="1" :false-label="2">可查看问卷结果</el-checkbox>
            <el-select size="mini" class="setting-inline-select" v-model="anonymous">
              <el-option label="匿名问卷" :value="1"></el-option>
              <el-option label="实名问卷" :value="2"></el-option>
            </el-select>
            <el-checkbox v-model="isLimitVoteCount" class="setting-inline-control">限答人数</el-checkbox>
            <el-input
              v-if="isLimitVoteCount"
              type="text"
              @blur="maxVoteBlurHandler"
              size="mini"
              class="setting-vote-count"
              v-model="maxVoteCount"
            ></el-input>
            <span v-if="isLimitVoteCount" class="setting-unit">人</span>
          </div>
        </div>
        <div class="setting-form-item">
          <label class="setting-label">截止时间</label>
          <div class="setting-content">
            <el-date-picker
              v-model="expriyDate"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              type="datetime"
              :editable="false"
              :clearable="false"
              placeholder="请选择时间"
            ></el-date-picker>
          </div>
        </div>
        <div class="setting-form-item">
          <label class="setting-label"><el-checkbox v-model="enableOnSendTime">定时发送</el-checkbox></label>
          <div class="setting-content">
            <el-date-picker
              v-model="onSendTime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              type="datetime"
              :editable="false"
              placeholder="请选择时间"
            ></el-date-picker>
          </div>
        </div>
        <div class="setting-form-item">
          <label class="setting-label">落款</label>
          <div class="setting-content">
            <el-select class="setting-inscribe-select" allow-create filterable v-model="inscribe" placeholder="请选择">
              <el-option v-for="item in departList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="setting-form-item">
          <label class="setting-label">封面</label>
          <div class="setting-content">
            <div class="image-upload-container">
              <div class="image-upload-container__inner">
                <uploader
                  module="wenjuan"
                  pathPrefix="wenjuan"
                  moduleCode="2054"
                  ref="coverUploader"
                  :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']"
                  showResult="image"
                  showMode="button"
                  v-model="images"
                  :multiple="false"
                ></uploader>
                <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除封面</div>
              </div>
              <div class="cover-hint">
                <i class="el-icon-info"></i>推荐尺寸 450*192
              </div>
            </div>
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
              <div class="logic-toolbar__desc">配置题目选项触发后的显示、隐藏或跳转关系</div>
            </div>
            <div class="logic-toolbar__actions">
              <el-button type="primary" size="medium" @click="addLogicRule">添加逻辑</el-button>
              <el-button type="success" size="medium" :loading="loading.logic" @click="saveLogicRules">保存逻辑</el-button>
            </div>
          </div>
          <div class="logic-rules-list">
            <div class="logic-rule-card" v-for="(rule, ruleIndex) in logicRules" :key="rule.id || ruleIndex">
              <div class="logic-rule-card__header">
                <span class="logic-rule-card__title">规则 {{ ruleIndex + 1 }}</span>
                <div class="logic-rule-card__actions">
                  <el-button type="text" size="mini" class="logic-delete-text" @click="removeLogicRule(ruleIndex)">删除</el-button>
                </div>
              </div>
              <div class="logic-rule-row">
                <span class="logic-keyword">如果</span>
                <el-select v-model="rule.conditionQuestion" placeholder="请选择题目" class="logic-select logic-select--question" @change="onConditionQuestionChange(ruleIndex)">
                  <el-option v-for="q in choiceQuestions" :key="q.topicSeq" :label="formatQuestionLabel(q)" :value="q.topicSeq"></el-option>
                </el-select>
                <span class="logic-operator">选中</span>
                <el-select v-model="rule.conditionOption" placeholder="请选择选项" class="logic-select logic-select--option">
                  <el-option v-for="opt in getQuestionOptions(rule.conditionQuestion)" :key="opt.optionSeq" :label="formatOptionLabel(opt)" :value="opt.optionSeq"></el-option>
                </el-select>
              </div>
              <div class="logic-rule-row">
                <span class="logic-keyword">则</span>
                <el-select v-model="rule.actionType" class="logic-select logic-select--action" @change="onActionTypeChange(ruleIndex)">
                  <el-option label="显示" value="show"></el-option>
                  <el-option label="隐藏" value="hide"></el-option>
                  <el-option label="跳转到" value="jump"></el-option>
                </el-select>
                <el-select v-model="rule.actionQuestion" placeholder="目标题目" class="logic-select logic-select--question">
                  <el-option v-for="q in getTargetQuestions(rule.conditionQuestion)" :key="q.topicSeq" :label="formatQuestionLabel(q)" :value="q.topicSeq"></el-option>
                </el-select>
              </div>
              <div class="logic-rule-row">
                <span class="logic-keyword">否则</span>
                <span class="logic-else-fixed">{{ getElseText(rule.actionType) }}</span>
              </div>
            </div>
            <div class="logic-empty" v-if="logicRules.length === 0">
              <p>暂无逻辑规则</p>
              <el-button type="primary" plain size="small" @click="addLogicRule">立即添加</el-button>
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
            添加逻辑规则后，将在此处实时展示题目之间的流转关系
          </div>
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
                                                          :loading="loading.replay"
                                                          @click="confirmClickHandler"
                                                        >添加</el-button>
                                                          <el-button
                                                            type="default"
                                                            :loading="loading.replay"
                                                            @click="cancelClickHandler"
                                                          >取消</el-button>
                                                      </div>
                                                      </el-dialog>
                                                      </div>
</template>

<script>
import mixin from "@/mixins/windowResize";

import BackTool from "@/components/BackTool";
import AddressBook from "@/components/AddressBook/indexExpand";
import Uploader from "@/components/Uploader/WebUploader";
import {
  updateVoteTwo,
  sendViewVoteTwo,
  getVoteTwoById,
  addVoteTwoRuleList,
  delVoteTwoRuleList,
  getVoteTwoRuleList,
} from "@/api/questionnaire";
import { queryDepartByUserId } from "@/api/system";
import { mapGetters } from "vuex";

export default {
  name: "questionAdd",
  components: {
    BackTool,
    AddressBook,
    Uploader,
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["userInfo", "selectedSchoolYear"]),
    choiceQuestions() {
      return this.topicList.filter(item => [1, 2, 3, 4, 22, 23, 24].includes(item.topType) && item.topicSeq);
    },
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
      id: this.$route.query.id,

      activeTab: 'content',
      enableOnSendTime: false,
      currentFocusInput: null,

      isLimitVoteCount: false,
      maxVoteCount: 0,

      inscribe: "",
      departList: [],
      anonymous: 1,
      expriyDate: this.$moment().format("YYYY-MM-DD HH:mm"),
      onSendTime: "",

      isShowResult: 2,
      sendUserType: 1,

      images: [
        {
          fileUrl:
            "https://cdnfile-10043692.file.myqcloud.com/mobile/images/cover/voteInfo.jpg",
        },
      ],
      voteTitle: "",
      voteDesc: "",

      topicList: [],
      logicRules: [],

      loading: {
        replay: false,
        logic: false,
      },

      questionItemList: [],
      isDialogShow: false,
      batchAddQuestionContent: "",
      batchAddCurrentQuestion: null,

      teacherAddressData: {},
      teacherAddressConfigData: {
        title: "请选择老师",
        depart: {
          target: "all",
          departType: "t",
          userTypes: "1",
          notCheckSchool: true,
        },
        group: true,
      },
      studentAddressData: {},
      studentAddressConfigData: {
        title: "请选择学生班级",
        depart: {
          target: "all",
          departType: "s",
          userTypes: "2",
          notCheckSchool: true,
        },
         group: {
                            groupTarget: 'all',
                            groupScope: [2]
                        }
      },
    };
  },
  created() {
    queryDepartByUserId(this.userInfo.id, 7)
      .then(res => res.data)
      .then(data => {
        let departList = [];
        if (data.data) {
          departList = data.data.map(({ name, id }) => ({
            value: id,
            label: name,
          }));
        }
        departList.unshift({
          value: "",
          label: "无",
        });
        this.departList = departList;

        getVoteTwoById({
          voteId: this.id,
        })
          .then(res => res.data)
          .then(data => {
            const pageData = data.data;

            const depart = departList.find(
              ({ label }) => label === pageData.inscribe
            );

            this.inscribe = depart
              ? Number.parseInt(depart.value)
              : pageData.inscribe;
            this.anonymous = pageData.anonymous;
            this.expriyDate = this.$moment(pageData.expriyDate).format(
              "YYYY-MM-DD HH:mm"
            );
            this.onSendTime = pageData.onSendTime
              ? this.$moment(pageData.onSendTime).format("YYYY-MM-DD HH:mm")
              : "";
            this.isShowResult = pageData.isShowResult;
            this.sendUserType = pageData.sendUserType;
            this.voteTitle = pageData.voteTitle;
            this.voteDesc = pageData.voteDesc;
            this.topicList = pageData.topicList;
            this.logicRules = [];
            this.maxVoteCount = pageData.maxVoteCount;
            this.isLimitVoteCount = pageData.maxVoteCount !== 0;
            this.images = [
              {
                fileUrl: pageData.logoUrl,
              },
            ];

            if (pageData.sendUserType === 1) {
              const thScope = JSON.parse(pageData.thScopeJson);

              this.teacherAddressData = {
                userJson: thScope.userList,
                departJson: thScope.departList,
                groupJson: thScope.groupList,
              };
            } else {
              this.studentAddressData = {
                userJson: JSON.parse(pageData.stuUserJson || "[]"),
                departJson: JSON.parse(pageData.stuDepartJson || "[]"),
                groupJson:JSON.parse(pageData.stuGroupJson || "[]"),
              };
            }
            this.fetchLogicRules();
          });
      });
  },
  methods: {
    switchTab(tabName) {
      this.activeTab = tabName;
      if (tabName === 'logic' && this.getCurrentVoteId()) {
        this.fetchLogicRules();
      }
    },
    getCurrentVoteId() {
      return this.id;
    },
    getCurrentSchoolYear() {
      if (this.selectedSchoolYear && typeof this.selectedSchoolYear === 'object') {
        return this.selectedSchoolYear.year || this.selectedSchoolYear.id || '';
      }
      return this.selectedSchoolYear || '';
    },
    ensureVoteSaved() {
      return true;
    },
    getLogicQuestion(topicSeq) {
      return this.topicList.find(item => item.topicSeq === topicSeq);
    },
    getLogicOption(topicSeq, optionSeq) {
      const question = this.getLogicQuestion(topicSeq);
      return question ? (question.optionList || []).find(item => item.optionSeq === optionSeq) : null;
    },
    getLogicRulePayload() {
      const voteId = Number(this.getCurrentVoteId());
      return this.logicRules.map(rule => {
        const question = this.getLogicQuestion(rule.conditionQuestion) || {};
        const option = this.getLogicOption(rule.conditionQuestion, rule.conditionOption) || {};
        const targetQuestion = this.getLogicQuestion(rule.actionQuestion) || {};
        return {
          // 始终使用 topicSeq/optionSeq 作为标识，确保填写页能正确匹配
          optionCode: String(option.optionSeq || rule.conditionOption || ''),
          optionTitle: option.optionTitle || '',
          showType: rule.actionType === 'hide' ? 2 : rule.actionType === 'jump' ? 3 : 1,
          topicCode: String(question.topicSeq || rule.conditionQuestion || ''),
          topicCodeShow: String(targetQuestion.topicSeq || rule.actionQuestion || ''),
          topicTitle: question.topicTitle || '',
          topicTitleShow: targetQuestion.topicTitle || '',
          voteId
        };
      });
    },
    validateLogicRules() {
      if (!this.logicRules.length) {
        return true;
      }
      const invalidIndex = this.logicRules.findIndex(rule => !rule.conditionQuestion || !rule.conditionOption || !rule.actionQuestion);
      if (invalidIndex !== -1) {
        this.$message.error(`请完善规则 ${invalidIndex + 1} 的题目、选项和目标题目`);
        return false;
      }
      return true;
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
    fetchLogicRules() {
      const voteId = this.getCurrentVoteId();
      if (!voteId) {
        return Promise.resolve();
      }
      return getVoteTwoRuleList({ voteId }, this.getCurrentSchoolYear())
        .then(res => res.data)
        .then(data => {
          if (data.result || data.code === 200) {
            this.logicRules = (data.data || []).map(item => this.normalizeLogicRule(item));
          } else if (data.msg) {
            this.$message.error(data.msg);
          }
        });
    },
    saveLogicRules() {
      if (!this.ensureVoteSaved() || !this.validateLogicRules()) {
        return;
      }
      const voteId = this.getCurrentVoteId();
      const schoolYear = this.getCurrentSchoolYear();
      this.loading.logic = true;
      delVoteTwoRuleList({ voteId }, schoolYear)
        .then(res => res.data)
        .then(data => {
          if (!data.result && data.code !== 200) {
            return Promise.reject(data.msg || '删除原逻辑规则失败');
          }
          const ruleList = this.getLogicRulePayload();
          if (!ruleList.length) {
            return { result: true };
          }
          return addVoteTwoRuleList(ruleList, schoolYear).then(res => res.data);
        })
        .then(data => {
          if (data.result || data.code === 200) {
            this.$message.success('逻辑保存成功');
            return this.fetchLogicRules();
          }
          this.$message.error(data.msg || '逻辑保存失败');
        })
        .catch(error => {
          this.$message.error(typeof error === 'string' ? error : '逻辑保存失败');
        })
        .finally(() => {
          this.loading.logic = false;
        });
    },
    addLogicRule() {
      if (!this.ensureVoteSaved()) {
        return;
      }
      this.logicRules.push({
        id: Date.now() + Math.random(),
        conditionQuestion: '',
        conditionOption: '',
        actionType: 'show',
        actionQuestion: '',
        elseActionType: 'hide',
        elseActionQuestion: ''
      });
    },
    removeLogicRule(index) {
      this.logicRules.splice(index, 1);
    },
    onConditionQuestionChange(ruleIndex) {
      this.logicRules[ruleIndex].conditionOption = '';
      this.logicRules[ruleIndex].actionQuestion = '';
      this.logicRules[ruleIndex].elseActionQuestion = '';
    },
    getQuestionOptions(topicSeq) {
      const question = this.topicList.find(q => q.topicSeq === topicSeq);
      return question ? question.optionList || [] : [];
    },
    getTargetQuestions(excludeTopicSeq) {
      return this.topicList.filter(item => item.topicSeq && item.topicSeq !== excludeTopicSeq && item.topType !== 7 && item.topType !== 8);
    },
    formatQuestionLabel(question) {
      return `题目${question.topicSeq} ${question.topicTitle || ''}`;
    },
    formatOptionLabel(option) {
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
    },
    onActionTypeChange(ruleIndex) {
      this.logicRules[ruleIndex].actionQuestion = '';
    },
    questionTopicOrderInputHandler(value) {
      return /\s*\d+\s*/.test(value);
    },
    questionTopicOrderChangeHandler(questionItem) {
      this.topicList.forEach(item => {
        item.topicOrder = parseInt(item.topicOrder);
        if (
          (item.topicOrder == questionItem.topicOrder &&
            item !== questionItem) ||
          item.topicOrder > questionItem.topicOrder
        ) {
          item.topicOrder++;
        }
      });
      this.topicList.sort((a, b) => a.topicOrder - b.topicOrder);
      setTimeout(() => {
        let topicOrder = 1;
        this.topicList.forEach(item => {
          item.topicOrder = topicOrder;
          topicOrder++;
        });
        this.resetTopicSeq();
      }, 200);
    },
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
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
    resetTopicSeq() {
      let seq = 0;
      this.topicList.forEach(topicItem => {
        if (topicItem.topType !== 7 && topicItem.topType !== 8) {
          seq++;
          topicItem.topicSeq = seq;
        } else {
          topicItem.topicSeq = 0;
        }
      });
    },
    batchAddClickHandler(questionItem) {
      this.batchAddCurrentQuestion = questionItem;
      this.isDialogShow = true;
    },
    addChoiceHandler(questionItem) {
      questionItem.optionList.push({
        isHaveReason: 0,
        optionPicUrl: "",
        optionSeq: questionItem.optionList.length + 1,
        optionTitle:
          questionItem.topType === 14 || questionItem.topType === 21
            ? "选项标题(空处用{n}表示)"
            : "",
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
    questionnairePublish(voteStatus) {
      if (this.voteTitle === "") {
        this.$message.error("请填写问卷标题！");
      } else if (this.voteDesc === "") {
        this.$message.error("请填写问卷描述！");
      } else if (
        this.sendUserType === 1 &&
        (JSON.stringify(this.teacherAddressData) === "{}" ||
          !(
            this.teacherAddressData.userJson.length +
            this.teacherAddressData.departJson.length +
            this.teacherAddressData.groupJson.length
          ))
      ) {
        this.$message.error("请选择要发送的老师！");
      } else if (
        this.sendUserType === 2 &&
        (JSON.stringify(this.studentAddressData) === "{}" ||
          !(
            this.studentAddressData.userJson.length +
            this.studentAddressData.departJson.length +
            this.studentAddressData.groupJson.length
          ))
      ) {
        this.$message.error("请选择要发送的学生！");
      } else if (this.topicList.length === 0) {
        this.$message.error("问卷至少包含一个问题！");
      } else if (this.expriyDate <= this.$moment().format("YYYY-MM-DD HH:mm")) {
        this.$message.error("截止时间须大于当前时间");
      } else if (this.images.length === 0) {
        this.$message.error("请上传封面");
      } else if (this.onSendTime && this.onSendTime > this.expriyDate) {
        this.$message.error("定时发送时间须小于截止时间");
      } else if (
        this.onSendTime &&
        this.onSendTime >
          this.$moment()
            .add("days", 7)
            .format("YYYY-MM-DD HH:mm")
      ) {
        this.$message.error("定时发送时间距今须小于7天");
      } else if (
        this.onSendTime &&
        this.onSendTime < this.$moment().format("YYYY-MM-DD HH:mm")
      ) {
        this.$message.error("定时发送时间须大于当前时间");
      } else {
        let validFlag = true;
        const fillblankRegexp = /{\d+?}/;
        const topicList = [];
        this.topicList.forEach(topicItem => {
          if (validFlag) {
            if (topicItem.topicTitle === "" && topicItem.topType !== 8) {
              if (topicItem.topType === 7) {
                this.$message.error("描述不能为空！");
              } else {
                this.$message.error("问题标题不能为空！");
              }
              validFlag = false;
            } else if (
              [1, 2, 3, 4, 14, 21, 22, 23,24].indexOf(topicItem.topType) !== -1
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
              } else if (topicItem.topType === 21 || topicItem.topType === 14) {
                if (
                  topicItem.optionList.some(
                    ({ optionTitle }) => !fillblankRegexp.test(optionTitle)
                  )
                ) {
                  this.$message.error("多项填空格式不正确！");
                  validFlag = false;
                }
              }
            } else if (
              topicItem.topType === 6 &&
              !fillblankRegexp.test(topicItem.topicTitle)
            ) {
              this.$message.error("填空题格式不正确！");
              validFlag = false;
            }
            const topicObject = JSON.parse(JSON.stringify(topicItem));
            delete topicObject.pics;
            topicList.push(topicObject);
          }
        });
        if (validFlag) {
          const teacherAddressData = {
            userList: this.teacherAddressData.userJson || [],
            departList: this.teacherAddressData.departJson || [],
            groupList: this.teacherAddressData.groupJson || [],
          };

          let depart = "";
          if (this.inscribe !== "") {
            depart = this.departList.find(
              ({ value }) => value == this.inscribe
            );
          }
          const formData = {
            inscribe: depart ? depart.label : this.inscribe.trim(),
            id: this.id,
            anonymous: this.anonymous,
            expriyDate: this.expriyDate,
            isShowResult: this.isShowResult,
            maxVoteCount: this.isLimitVoteCount ? this.maxVoteCount : 0,
            sendUserType: this.sendUserType,
            stuDepartJson:
              this.sendUserType === 2 ? this.studentAddressData.departJson : {},
            stuUserJson:
              this.sendUserType === 2 ? this.studentAddressData.userJson : {},
             stuGroupJson:this.sendUserType === 2 ? this.studentAddressData.groupJson : [],

            thScopeJson: this.sendUserType === 1 ? teacherAddressData : {},
            topicList,
            voteDesc: this.voteDesc,
            voteStatus: voteStatus === 0 ? 1 : voteStatus,
            voteTitle: this.voteTitle,
            voteType: 0,
            logoUrl: this.images[0].fileUrl,
            onSendTime: this.onSendTime
              ? `${this.$moment(this.onSendTime).format("YYYY-MM-DD HH:mm")}:00`
              : "",
            onTime: this.onSendTime ? 2 : 1,
          };

          if (voteStatus === 0) {
            sendViewVoteTwo(formData)
              .then(res => res.data)
              .then(data => {
                if (data.result) {
                  this.$message({
                    message: "发送预览成功，请在手机上查看",
                    type: "success",
                    duration: 1000,
                  });
                }
              });
          } else {
            updateVoteTwo(formData)
              .then(res => res.data)
              .then(data => {
                if (data.result) {
                  const _this = this;
                  this.$message({
                    message: voteStatus === 1 ? "保存成功！" : "发布成功！",
                    type: "success",
                    duration: 1000,
                    onClose: function() {
                      _this.$router.back();
                    },
                  });
                }
              });
          }
        }
      }
    },
    optionPicUploadSuccessHandler(questionIndex) {
      return data => {
        this.topicList[questionIndex].optionList.push({
          isHaveReason: 0,
          optionPicUrl: data.fileUrl,
          optionSeq: this.topicList[questionIndex].optionList.length + 1,
          optionTitle: "",
        });
      };
    },
    deleteOption(questionIndex, optionIndex) {
      this.topicList[questionIndex].optionList = [
        ...this.topicList[questionIndex].optionList.slice(0, optionIndex),
        ...this.topicList[questionIndex].optionList.slice(optionIndex + 1),
      ];
      this.topicList[questionIndex].optionList.forEach((item, index) => {
        item.optionSeq = index + 1;
      });
    },
    confirmClickHandler() {
      const options = this.batchAddQuestionContent.split("\n");
      const optionList = [];
      options.filter(item => item.trim() !== "").forEach((item, index) => {
        optionList.push({
          isHaveReason: 0,
          optionPicUrl: "",
          optionSeq: this.batchAddCurrentQuestion.optionList.length + index,
          optionTitle: item,
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
    resetTopicOrder() {
      this.topicList.forEach((topicItem, index) => {
        topicItem.topicOrder = index + 1;
      });
    },
    deleteQuestion(questionIndex) {
      this.topicList = [
        ...this.topicList.slice(0, questionIndex),
        ...this.topicList.slice(questionIndex + 1),
      ];
      this.resetTopicOrder();
      this.resetTopicSeq();
    },
    cloneQuestion(questionIndex) {
      this.topicList = [
        ...this.topicList.slice(0, questionIndex + 1),
        JSON.parse(JSON.stringify(this.topicList[questionIndex])),
        ...this.topicList.slice(questionIndex + 1),
      ];
      this.resetTopicOrder();
      this.resetTopicSeq();
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
      this.resetTopicOrder();
      this.resetTopicSeq();
    },
    addQuestion(questionType) {
      const topicOrder = this.topicList.length + 1;
      let topicSeq =
        this.topicList.length -
        this.topicList.filter(item => item.topType === 7 || item.topType === 8)
          .length +
        1;
      let optionList = [],
        selectedMax = 0,
        topType = 0,
        topicTitle = "",
        isHaveToDo = 0;
      switch (questionType) {
        case "single-choice-score":
          selectedMax = 0;
          topType = 24;
          topicTitle = "评分单选";
          optionList = [
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 1,
              optionTitle: "",
              score: 0,
            },
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 2,
              optionTitle: "",
              score: 0,
            },
          ];
          break;
        case "singleChooseFill":
          selectedMax = 0;
          topType = 14;
          topicTitle = "单项填空";
          optionList = [
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 1,
              optionTitle: "选项标题(空处用{n}表示)",
            },
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 2,
              optionTitle: "选项标题(空处用{n}表示)",
            },
          ];
          break;
        case "multipleChooseFill":
          selectedMax = 0;
          topType = 21;
          topicTitle = "多项填空";
          optionList = [
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 1,
              optionTitle: "选项标题(空处用{n}表示)",
            },
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 2,
              optionTitle: "选项标题(空处用{n}表示)",
            },
          ];
          break;
        case "single-choice":
          selectedMax = 0;
          topType = 1;
          topicTitle = "文字单选";
          optionList = [
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 1,
              optionTitle: "",
            },
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 2,
              optionTitle: "",
            },
          ];
          break;
        case "multiple-choice":
          selectedMax = 0;
          topType = 2;
          topicTitle = "文字多选";
          optionList = [
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 1,
              optionTitle: "",
            },
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 2,
              optionTitle: "",
            },
          ];
          break;
        case "pic-single-choice":
          selectedMax = 0;
          topType = 3;
          topicTitle = "图片单选";
          optionList = [];
          break;
        case "pic-multiple-choice":
          selectedMax = 0;
          topType = 4;
          topicTitle = "图片多选";
          optionList = [];
          break;
        case "qna":
          selectedMax = 0;
          topType = 5;
          topicTitle = "问答题";
          optionList = [];
          break;
        case "fillblank":
          selectedMax = 0;
          topType = 6;
          topicTitle = "";
          optionList = [];
          break;
        case "label":
          selectedMax = 0;
          topType = 7;
          topicTitle = "描述";
          optionList = [];
          topicSeq = 0;
          isHaveToDo = 1;
          break;
        case "divider":
          selectedMax = 0;
          topType = 8;
          topicTitle = "分割线";
          optionList = [];
          topicSeq = 0;
          isHaveToDo = 1;
          break;
        case "address":
          selectedMax = 0;
          topType = 9;
          topicTitle = "地址";
          optionList = [];
          break;
        case "pic-single-uploader":
          selectedMax = 0;
          topType = 10;
          topicTitle = "单个图片上传";
          optionList = [];
          break;
        case "pic-multiple-uploader":
          selectedMax = 0;
          topType = 11;
          topicTitle = "多个图片上传";
          optionList = [];
          break;
        case "rate":
          selectedMax = 0;
          topType = 12;
          topicTitle = "评分题";
          optionList = [];
          break;
        case "phone_num":
          selectedMax = 0;
          topType = 15;
          topicTitle = "手机号";
          optionList = [];
          break;
        case "email":
          selectedMax = 0;
          topType = 16;
          topicTitle = "邮箱";
          optionList = [];
          break;
        case "id_num":
          selectedMax = 0;
          topType = 17;
          topicTitle = "身份证";
          optionList = [];
          break;
        case "date":
          selectedMax = 0;
          topType = 18;
          topicTitle = "日期";
          optionList = [];
          break;
        case "time":
          selectedMax = 0;
          topType = 19;
          topicTitle = "时间";
          optionList = [];
          break;
        case "single-select":
          selectedMax = 0;
          topType = 22;
          topicTitle = "下拉单选";
          optionList = [
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 1,
              optionTitle: "",
            },
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 2,
              optionTitle: "",
            },
          ];
          break;
        case "multiple-select":
          selectedMax = 0;
          topType = 23;
          topicTitle = "下拉多选";
          optionList = [
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 1,
              optionTitle: "",
            },
            {
              isHaveReason: 0,
              optionPicUrl: "",
              optionSeq: 2,
              optionTitle: "",
            },
          ];
          break;
      }
      this.topicList.push({
        isHaveToDo,
        optionList,
        selectedMax,
        topType,
        topicOrder,
        topicSeq,
        topicTitle,
        pics: [],
      });
    },
  },
};
</script>
<style>
.question-option-container.radius .el-checkbox__inner {
  border-radius: 50%;
}
.question-option-container.radius
  .el-checkbox__input.is-checked
  .el-checkbox__inner:after {
  transform: translate(-50%, -50%) scale(1);
}
.question-option-container.radius .el-checkbox__inner::after {
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background-color: #fff;
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease-in;
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
  }
}

.setting-panel {
  max-width: 1090px;
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

  .setting-select--user-type,
  .setting-inline-select {
    width: 110px;
  }

  .setting-address-book,
  .setting-inline-control,
  .setting-inline-select {
    margin-left: 18px;
  }

  .setting-vote-count {
    width: 70px;
    margin-left: 6px;
  }

  .setting-unit {
    margin-left: 6px;
    color: #909399;
  }

  .setting-inscribe-select {
    width: 320px;
  }
}

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

  .logic-toolbar__actions {
    display: flex;
    align-items: center;
    gap: 10px;
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

  .logic-delete-text {
    color: #f56c6c;
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

  .logic-select {
    margin-right: 8px;
  }

  .logic-select--question {
    width: 220px;
  }

  .logic-select--option {
    width: 170px;
  }

  .logic-select--action {
    width: 110px;
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

.main-container {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  align-items: stretch;
  width: 1100px;
  margin: 0 auto;
  padding: 0;
  color: #606266;
  box-sizing: border-box;
  overflow: hidden;
}

.question-type-container {
  width: 210px;
  @include clearfix;
  flex-shrink: 0;
  float: none;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(31, 45, 61, 0.08);

  .question-type-container__title {
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    cursor: pointer;
    color: #303133;
    background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
    border-bottom: 1px solid #ebeef5;
    font-size: 15px;
    font-weight: 600;
  }

  .question-type {
    margin: 0;
    padding: 10px 14px;
    box-sizing: border-box;

    .question-type-item {
      display: flex;
      align-items: center;
      min-height: 28px;
      margin: 2px 0;
      padding: 0 8px;
      color: #606266;
      cursor: pointer;
      border-radius: 8px;
      transition: color 0.2s, background-color 0.2s;

      & > * {
        @include middleIB;
      }

      &:hover {
        color: #409eff;
        background: #ecf5ff;

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

.questionnaire-container {
  flex: 1;
  float: none;
  width: auto;
  margin-left: 0;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(31, 45, 61, 0.08);
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
    background: #fafcff;
    border-top: 1px solid #f0f2f5;
    border-bottom: 1px solid #ebeef5;
    position: relative;
  }

  .address-book-container {
    min-width: 200px;
    max-width: 500px;
    display: inline-block;
    vertical-align: middle;
    .search-input {
      width: 180px;
      white-space: nowrap;
    }
  }

  .questionnaire-title {
    height: 56px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #f0f2f5;
    input {
      text-align: center;
    }
  }

  .questionnaire-desc {
    height: 77px;
    background: #fff;
    border-top: 0;
    border-bottom: 1px solid #f0f2f5;
    textarea {
      font-size: 18px;
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
  }

  .question-container {
    padding: 5px 0;

    .question-item__body {
      margin-top: 10px;
    }

    .question-item {
      @include clearfix;
      padding: 10px 0;
      border-top: 1px solid #ebeef5;

      &:hover {
        .add-choice-icon,
        .batch-add-choice-icon,
        .up-icon,
        .down-icon,
        .question-delete-icon,
        .question-clone-icon {
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
.more-setting-btn-container {
  text-align: center;
  position: absolute;
  right: 30px;
  top: 6px;
}
.base-setting {
  margin-bottom: 5px;
}
.more-setting {
  & > div {
    margin-bottom: 5px;
  }
}
</style>
<style lang="scss">
#questionnaireEdit {
  #addressStudentSetting .address-input {
    max-height: none !important;
    min-width: 180px !important;
    max-width: 600px !important;
  }
  .question-item__extra {
    font-size: 14px;
  }
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
}
</style>
