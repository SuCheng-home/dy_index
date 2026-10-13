<template>
  <div class="index-container">
    <!--主体内容-->
    <div class="main-container main-containerTwo">
      <div class="main-wrapper">
        <div class="main-content">
          <div class="rollModuleBox clearfix">
            <div class="rollModule">
              <div
                class="tag"
                :rollModuleJsonTwo="rollModuleJsonTwo"
                @click="noJump(rollModuleJsonTwo)"
              >
                <i class="fa fa-bullhorn roll-icon" aria-hidden="true"></i>
                <span class="title">{{rollModuleJsonTwo.name}}：</span>
              </div>
              <div class="cont clearfix">
                <ul
                  class="rollUl clearfix"
                  id="rollUl"
                  @mouseover.stop="rollUlOver"
                  @mouseout.stop="rollUlOut"
                >
                  <li v-for="(rollItem,rollIndex) in rollModuleData" :key="rollIndex">
                    <a
                      href="javascript:;"
                      @click="jumpTo('/webTwo/main/column/newdetail',rollModuleJsonTwo,rollItem)"
                      v-if="rollItem.messageType==1"
                    >{{rollItem.title}}</a>
                    <a
                      :href="rollItem.messageUrl"
                      v-if="rollItem.messageType==2"
                      target="_blank"
                    >{{rollItem.title}}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="searchBox">
              <input
                class="search-input"
                v-model.trim="searchTitle"
                @keyup.enter="searchHandler"
                type="text"
                placeholder="请输入关键字"
              />
              <span class="search-icon" @click="searchHandler">
                <i class="fa fa-search" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          <div class="mainItem-wrap clearfix">
            <div class="leftMainBox">
              <div class="leftTopBox">
                <div class="global-top2" :leftModuleJsonTwo="leftModuleJsonTwo">
                  <div class="title">{{leftModuleJsonTwo.name}}</div>
                  <div class="more" @click="noJump(leftModuleJsonTwo)">
                    MORE
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="leftTopCont">
                  <template v-for="(leftModuleItem,leftIndex) in leftModuleJsonData">
                    <a
                      class="item"
                      href="javascript:;"
                      :key="leftIndex"
                      @click="jumpTo('/webTwo/main/column/newdetail',leftModuleJsonTwo,leftModuleItem)"
                      v-if="leftModuleItem.messageType==1"
                    >
                      <div class="leftDataTag">
                        <div class="data-top">{{leftModuleItem.createTime|filterMonth}}月</div>
                        <div class="data-bottom">{{leftModuleItem.createTime|filterDay}}日</div>
                      </div>
                      <div class="rightNews">
                        <span>{{leftModuleItem.title}}</span>
                      </div>
                    </a>
                    <a
                      class="item"
                      :key="leftIndex"
                      :href="leftModuleItem.messageUrl"
                      target="_blank"
                      v-if="leftModuleItem.messageType==2"
                    >
                      <div class="leftDataTag">
                        <div class="data-top">{{leftModuleItem.createTime|filterMonth}}月</div>
                        <div class="data-bottom">{{leftModuleItem.createTime|filterDay}}日</div>
                      </div>
                      <div class="rightNews">
                        <span>{{leftModuleItem.title}}</span>
                      </div>
                    </a>
                  </template>
                </div>
              </div>
              <div class="leftTwoBox">
                <div class="global-top">
                  <div class="title">快速通道</div>
                  <div class="more"></div>
                </div>
                <div class="leftUrlBox">
                  <div v-for="(urlItem,urlIndex) in urlLeftModuleJsonTwo" :key="urlIndex">
                    <a
                      class="leftUrlItem"
                      href="javascript:;"
                      v-if="urlItem.name.indexOf('校长信箱')!==-1"
                      @click="headmasterJump"
                    >
                      <img :src="urlItem.logoUrl" alt />
                      <span>{{urlItem.name}}</span>
                      <div class="goMore">
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                      </div>
                    </a>
                    <a
                      class="leftUrlItem"
                      :href="urlItem.columnUrl"
                      target="_blank"
                      v-if="urlItem.name.indexOf('校长信箱')==-1"
                    >
                      <img :src="urlItem.logoUrl" alt />
                      <span>{{urlItem.name}}</span>
                      <div class="goMore">
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                      </div>
                    </a>
                  </div>
                </div>
                <div class="leftBottomBox">
                  <div
                    class="leftBottomItem"
                    :leftMessageJsonData="leftMessageJsonData"
                    @click="jumpToDetail('/webTwo/main/detail',leftMessageJsonData)"
                  >
                    <div class="title">
                      <img :src="leftMessageJsonData.logoUrl" alt />
                      <span>{{leftMessageJsonData.title}}</span>
                    </div>
                    <div class="content" v-html="leftMessageJsonData.content"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="middleMainBox">
              <div v-if="middleModuleJsonTwo&&middleModuleJsonTwo.length==1">
                <div class="global-top" :middleModuleJsonTwoObject="middleModuleJsonTwoObject">
                  <div class="title">{{middleModuleJsonTwoObject.name}}</div>
                  <div class="more" @click="noJump(middleModuleJsonTwoObject)">
                    MORE
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="smallLunbo">
                  <div class="lunbo-box">
                    <el-carousel
                      :interval="shufflingTimeTwo*1000"
                      arrow="never"
                      trigger="click"
                      height="204px"
                      @change="lunboSwitch"
                    >
                      <el-carousel-item v-for="(item,index) in firstFiveData" :key="index">
                        <a
                          href="javascript:;"
                          @click="jumpTo('/webTwo/main/column/newdetail',middleModuleJsonTwoObject,item)"
                          v-if="item.messageType==1"
                        >
                          <div class="photo-item" :style="{backgroundImage:`url(${item.logoUrl})`}"></div>
                        </a>
                        <a :href="item.messageUrl" target="_blank" v-if="item.messageType==2">
                          <div class="photo-item" :style="{backgroundImage:`url(${item.logoUrl})`}"></div>
                        </a>
                      </el-carousel-item>
                      <div class="olBox">
                        <ul>
                          <li
                            v-for="(numItem,index) in lunboNum"
                            :class="{'is-active':lunboIndex==index}"
                            :key="index"
                          >{{numItem}}</li>
                        </ul>
                      </div>
                    </el-carousel>
                  </div>
                </div>
                <div class="middleNewList">
                  <ul>
                    <li
                      class="middleNewLi"
                      v-for="(lastFiveItem,lastFiveIndex) in lastFiveData"
                      :key="lastFiveIndex"
                    >
                      <a
                        href="javascript:;"
                        @click="jumpTo('/webTwo/main/column/newdetail',middleModuleJsonTwoObject,lastFiveItem)"
                        v-if="lastFiveItem.messageType==1"
                      >{{lastFiveItem.title}}</a>
                      <a
                        :href="lastFiveItem.messageUrl"
                        target="_blank"
                        v-if="lastFiveItem.messageType==2"
                      >{{lastFiveItem.title}}</a>
                      <div class="dataText">[{{lastFiveItem.createTime|filterTime}}]</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="middleModuleJsonTwo&&middleModuleJsonTwo.length==2">
                <div>
                  <div class="global-top" :middleModuleJsonTwoObject1="middleModuleJsonTwoObject1">
                    <div class="title">{{middleModuleJsonTwoObject1.name}}</div>
                    <div class="more" @click="noJump(middleModuleJsonTwoObject1)">
                      MORE
                      <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div class="smallLunbo">
                    <div class="lunbo-box">
                      <el-carousel
                        :interval="shufflingTimeTwo*1000"
                        arrow="never"
                        trigger="click"
                        height="204px"
                        @change="lunboSwitch"
                      >
                        <el-carousel-item v-for="(item,index) in firstFiveData" :key="index">
                          <a
                            href="javascript:;"
                            @click="jumpTo('/webTwo/main/column/newdetail',middleModuleJsonTwoObject1,item)"
                            v-if="item.messageType==1"
                          >
                            <div
                              class="photo-item"
                              :style="{backgroundImage:`url(${item.logoUrl})`}"
                            ></div>
                          </a>
                          <a :href="item.messageUrl" target="_blank" v-if="item.messageType==2">
                            <div
                              class="photo-item"
                              :style="{backgroundImage:`url(${item.logoUrl})`}"
                            ></div>
                          </a>
                        </el-carousel-item>
                        <div class="olBox">
                          <ul>
                            <li
                              v-for="(numItem,index) in lunboNum"
                              :class="{'is-active':lunboIndex==index}"
                              :key="index"
                            >{{numItem}}</li>
                          </ul>
                        </div>
                      </el-carousel>
                    </div>
                  </div>
                </div>
                <div class="middleModule2">
                  <div class="global-top" :middleModuleJsonTwoObject2="middleModuleJsonTwoObject2">
                    <div class="title">{{middleModuleJsonTwoObject2.name}}</div>
                    <div class="more" @click="noJump(middleModuleJsonTwoObject2)">
                      MORE
                      <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div class="middleNewList">
                    <ul>
                      <li
                        class="middleNewLi"
                        v-for="(lastFiveItem,lastFiveIndex) in lastFiveData"
                        :key="lastFiveIndex"
                      >
                        <a
                          href="javascript:;"
                          @click="jumpTo('/webTwo/main/column/newdetail',middleModuleJsonTwoObject2,lastFiveItem)"
                          v-if="lastFiveItem.messageType==1"
                        >{{lastFiveItem.title}}</a>
                        <a
                          :href="lastFiveItem.messageUrl"
                          target="_blank"
                          v-if="lastFiveItem.messageType==2"
                        >{{lastFiveItem.title}}</a>
                        <div class="dataText">[{{lastFiveItem.createTime|filterTime}}]</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="rightMainBox">
              <div
                v-for="(rightColumnItem,rightColumnIndex) in rightColumnListTwo"
                :key="rightColumnIndex"
              >
                <div class="global-top">
                  <div class="title">{{rightColumnItem.name}}</div>
                  <div class="more"></div>
                </div>
                <ul class="rightItemUl clearfix">
                  <li
                    class="rightItemLi"
                    v-for="(subColumnItem,subColumnIndex) in rightColumnItem.moduleList"
                    :key="subColumnIndex"
                    @click="noJumpModule(rightColumnItem.id,subColumnItem)"
                  >
                    <a href="javascript:;">
                      <img :src="subColumnItem.logoUrl" alt />
                      <span :title="subColumnItem.name">{{subColumnItem.name}}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="bottomLunbo-wrap">
          <div class="top" :bottomPhotoModuleJsonTwo="bottomPhotoModuleJsonTwo">
            <img
              src="https://cdnfile-10043692.file.myqcloud.com/web/images/template2/bottomLogo.png"
              alt
            />
            <span>{{bottomPhotoModuleJsonTwo.name}}</span>
            <div class="more" @click="noJump(bottomPhotoModuleJsonTwo)">
              MORE
              <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            </div>
          </div>
          <div class="bottomLunbo">
            <div
              class="swiper-container"
              ref="mySwiper"
              @mouseover.stop="swiperStop"
              @mouseout.stop="swiperStart"
            >
              <div class="swiper-wrapper">
                <div
                  class="swiper-slide"
                  v-for="(item,index) in bottomPhotoModuleJsonData"
                  :key="index"
                >
                  <a
                    href="javascript:;"
                    @click="jumpTo('/webTwo/main/column/newdetail',bottomPhotoModuleJsonTwo,item)"
                    v-if="item.messageType==1"
                  >
                    <div
                      v-if="item.logoUrl"
                      class="photo-item"
                      :style="{backgroundImage:`url(${item.logoUrl})`}"
                    ></div>
                  </a>
                  <a :href="item.messageUrl" target="_blank" v-if="item.messageType==2">
                    <div
                      class="photo-item"
                      v-if="item.logoUrl"
                      :style="{backgroundImage:`url(${item.logoUrl})`}"
                    ></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-for="(allItem,allindex) in allData">
      <float-view
        v-if="allData&&allData.length!==0"
        @floatView="floatView"
        @closeView="closeView"
        :json="allItem"
        :key="allindex"
      ></float-view>
    </template>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import { mapGetters } from "vuex";
import floatView from "@/components/floatView/index";
import {
  getSchoolWebModuleMessageList,
  getSchoolWebModuleMessageById,
  getSchoolWebSuspendMessageListByTime,
} from "@/api/firstPage";

export default {
  components: {
    floatView,
  },
  data() {
    return {
      rollModuleId: null,
      rollModuleData: [],
      i: 0,
      timer: null,
      leftModuleJsonId: null,
      leftModuleJsonData: [],
      middleModuleJsonId: null,
      middleModuleJsonId1: null,
      middleModuleJsonId2: null,
      middleModuleJsonData: [],
      middleModuleJsonTwoObject: {},
      middleModuleJsonTwoObject1: {},
      middleModuleJsonTwoObject2: {},
      leftMessageJsonId: null,
      leftMessageJsonData: {},
      firstFiveData: [],
      lastFiveData: [],
      lunboIndex: 0,
      lunboNum: [],
      bottomPhotoModuleJsonId: null,
      bottomPhotoModuleJsonData: [],
      mySwiper: null,
      secondColumn: 2,
      indexid: 1,
      searchData: [],
      searchTitle: "",
      allData: [],
    };
  },
  computed: {
    ...mapGetters([
      "id", //网站id
      "webName", //网站名称
      "shufflingTimeTwo",
      "rollModuleJsonTwo", //滚动消息模块
      "leftModuleJsonTwo", //左侧固定消息模块
      "urlLeftModuleJsonTwo", //左侧url模块数组
      "leftMessageJsonTwo",
      "middleModuleJsonTwo",
      "rightColumnListTwo",
      "bottomPhotoModuleJsonTwo",
    ]),
  },
  created() {
    this.rollModuleId = this.rollModuleJsonTwo.id;
    this.leftModuleJsonId = this.leftModuleJsonTwo.id;
    this.leftMessageJsonId = this.leftMessageJsonTwo.id;
    if (this.leftMessageJsonTwo && this.leftMessageJsonTwo.length !== 0) {
      this.getSchoolWebModuleMessageByIdFunc();
    }
    if (this.middleModuleJsonTwo && this.middleModuleJsonTwo.length == 1) {
      this.middleModuleJsonTwoObject = this.middleModuleJsonTwo[0];
      this.middleModuleJsonId = this.middleModuleJsonTwo[0].id;
      this.getMiddleModuleJsonFunc();
    }
    if (this.middleModuleJsonTwo && this.middleModuleJsonTwo.length == 2) {
      this.middleModuleJsonTwoObject1 = this.middleModuleJsonTwo[0];
      this.middleModuleJsonId1 = this.middleModuleJsonTwo[0].id;
      this.getMiddleModuleJsonFunc1();
      this.middleModuleJsonTwoObject2 = this.middleModuleJsonTwo[1];
      this.middleModuleJsonId2 = this.middleModuleJsonTwo[1].id;
      this.getMiddleModuleJsonFunc2();
    }
    this.bottomPhotoModuleJsonId = this.bottomPhotoModuleJsonTwo.id;
  },
  mounted() {
    if (this.rollModuleJsonTwo && this.rollModuleJsonTwo.length !== 0) {
      this.getSchoolWebModuleMessageListFunc();
      var This = this;
      setTimeout(function () {
        This.autoScroll();
      }, 0);
    }
    if (this.leftModuleJsonTwo && this.leftModuleJsonTwo.length !== 0) {
      this.getLeftModuleJsonFunc();
    }
    if (
      this.bottomPhotoModuleJsonTwo &&
      this.bottomPhotoModuleJsonTwo.length !== 0
    ) {
      this.getBottomPhotoModuleFunc();
      var This = this;
      setTimeout(function () {
        This.$nextTick(function () {
          This.carousel();
        });
      }, 500);
    }
    this.getSchoolWebSuspendMessageListByTimeFunc();
  },
  filters: {
    filterMonth(month) {
      return month ? month.slice(5, 7) : "";
    },
    filterDay(day) {
      return day ? day.slice(8, 10) : "";
    },
    filterTime(date) {
      return date ? date.slice(0, 10) : "";
    },
  },
  methods: {
    headmasterJump() {
      this.$router.push({ path: "/webTwo/main/headmaster/index" });
    },
    getSchoolWebSuspendMessageListByTimeFunc() {
      getSchoolWebSuspendMessageListByTime({
        webId: this.id,
        searchTime: this.$moment(new Date()).format("YYYY-MM-DD"),
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200) {
            this.floatData = data.data;
            this.allData = [];
            this.floatData.forEach((res, index) => {
              this.allData.push({
                fileJson: res.fileJson,
                messageType: res.messageType,
                id: res.id,
                messageUrl: res.messageUrl,
                messageJson: res.messageJson,
                title: res.title,
                left: Math.floor(Math.random() * 10 * index * 100 + 1),
                top: Math.floor(Math.random() * 10 * index * 100 + 1),
              });
            });
          }
        });
    },
    floatView(json) {
      //console.log("ss",json);
      if (json.messageType == 2) {
        window.open(json.messageUrl);
      } else if (json.messageType == 1) {
        let messageJson = JSON.parse(json.messageJson);
        //	console.log("ss",messageJson);
        const { href } = this.$router.resolve({
          path: "/webTwo/main/detail",
          query: {
            parentsid: json.id,
            columnName: messageJson.title,
            id: messageJson.id,
          },
        });
        window.open(href, "_blank");
        //	this.$router.push({path:'/webOne/main/detail',query:{parentsid:json.id, columnName:messageJson.title,id:messageJson.id}})
      }
    },
    closeView(json) {
      //	console.log("json",json);
      this.allData.forEach((item, index) => {
        if (item.id == json.id) {
          this.allData.splice(index, 1);
        }
      });
    },
    searchHandler() {
      if (this.searchTitle == "") {
        this.$message({
          type: "error",
          message: "请输入关键字!",
        });
        return false;
      }
      let routeData = this.$router.resolve({
        path: "/webTwo/main/search",
        query: {
          searchTitle: this.searchTitle,
        },
      });
      window.open(routeData.href, "_blank");
    },
    noJumpModule(parentsId, query) {
      if (query.type == 2) {
        this.$router.push({
          path: "/webTwo/main/column/newlist",
          query: {
            id: query.id,
            columnName: query.name,
            secondColumn: this.secondColumn,
            type: query.type,
            indexid: this.indexid,
          },
        });
      } else if (query.type == 3) {
        this.$router.push({
          path: "/webTwo/main/column/piclist",
          query: {
            id: query.id,
            columnName: query.name,
            secondColumn: this.secondColumn,
            type: query.type,
            indexid: this.indexid,
          },
        });
      } else if (query.type == 1) {
        this.$router.push({
          path: "/webTwo/main/detail",
          query: {
            id: query.id,
            secondColumn: this.secondColumn,
            type: query.type,
            columnName: query.name,
          },
        });
      } else if (query.type == 4) {
        window.open(query.columnUrl);
      }
    },
    jumpToDetail(url, query) {
      this.$router.push({ path: url, query: { id: query.id, onlyDetail: 1 } });
    },
    noJump(query) {
      if (query.type == 2) {
        this.$router.push({
          path: "/webTwo/main/column/newlist",
          query: {
            id: query.id,
            columnName: query.name,
            secondColumn: this.secondColumn,
            type: query.type,
            indexid: this.indexid,
          },
        });
      } else if (query.type == 3) {
        this.$router.push({
          path: "/webTwo/main/column/piclist",
          query: {
            id: query.id,
            columnName: query.name,
            secondColumn: this.secondColumn,
            type: query.type,
            indexid: this.indexid,
          },
        });
      }
    },
    jumpTo(url, parquery, query) {
      if (parquery.type == 2) {
        this.$router.push({
          path: url,
          query: {
            id: parquery.id,
            columnName: parquery.name,
            moduleType: 2,
            messageId: query.id,
            messageType: query.messageType,
          },
        });
      } else if (parquery.type == 3) {
        this.$router.push({
          path: url,
          query: {
            id: parquery.id,
            columnName: parquery.name,
            moduleType: 3,
            messageId: query.id,
            messageType: query.messageType,
          },
        });
      }
      //this.$router.push({path:url,query:{parentsid:parquery.id, columnName:parquery.name,id:query}})
    },
    swiperStart() {
      // this.mySwiper.autoplay.start();
      this.mySwiper.startAutoplay();
    },
    swiperStop() {
      // console.log(this.mySwiper)
      // this.mySwiper.autoplay.stop();
      this.mySwiper.stopAutoplay();
    },
    carousel() {
      // console.log(123)
      if (this.mySwiper != null) return;
      this.mySwiper = new Swiper(".swiper-container", {
        autoplay: true,
        loop: true,
        slidesPerView: 4,
        spaceBetween: 20,
        autoplayDisableOnInteraction: false,
        speed: this.shufflingTimeTwo * 1000,
        nextButton: ".swiper-button-next",
        prevButton: ".swiper-button-prev",
        observer: true,
      });
    },
    getBottomPhotoModuleFunc() {
      this.bottomPhotoModuleJsonData = [];
      getSchoolWebModuleMessageList({
        moduleId: this.bottomPhotoModuleJsonId,
        pageNo: 1,
        pageSize: 12,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.data) {
            data.data.dataList.forEach((item, index) => {
              if (item.logoUrl !== "") {
                this.bottomPhotoModuleJsonData.push(item);
              }
            });
          }
        });
    },
    lunboSwitch(val) {
      this.lunboIndex = val;
    },
    rollUlOut() {
      this.autoScroll();
      this.i++;
    },
    rollUlOver() {
      clearInterval(this.timer);
    },
    autoScroll() {
      var This = this;
      var rollUl = document.getElementById("rollUl");
      var rollLi = rollUl.getElementsByTagName("li");
      var ulBox = 0;
      var speed = 3;
      for (var j = 0; j < rollLi.length; j++) {
        ulBox += rollUl.getElementsByTagName("li")[j].offsetWidth;
      }
      rollUl.style.width = ulBox + "px";
      if (rollLi[0]) {
        this.timer = setInterval(function () {
          if (rollLi[0].offsetWidth + parseInt(rollUl.style.marginLeft) <= 0) {
            rollUl.appendChild(rollLi[0]);
            This.i = 0;
          }
          This.i++;
          rollUl.style.marginLeft = -This.i * speed + "px";
        }, 100);
      }
    },
    getSchoolWebModuleMessageByIdFunc() {
      getSchoolWebModuleMessageById({
        messageId: this.leftMessageJsonId,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200) {
            this.leftMessageJsonData = data.data;
          }
        });
    },
    getLeftModuleJsonFunc() {
      getSchoolWebModuleMessageList({
        moduleId: this.leftModuleJsonId,
        pageNo: 1,
        pageSize: 4,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.data) {
            this.leftModuleJsonData = data.data.dataList;
          }
        });
    },
    getMiddleModuleJsonFunc() {
      this.firstFiveData = [];
      this.lastFiveData = [];
      this.lunboNum = [];
      getSchoolWebModuleMessageList({
        moduleId: this.middleModuleJsonId,
        pageNo: 1,
        pageSize: 9,
      })
        .then((res) => res.data)
        .then((data) => {
          //	console.log("data",data.data.dataList);
          if (data.data) {
            this.middleModuleJsonData = data.data.dataList;
            const dataWithPic = data.data.dataList.filter(
              (item) => item.logoUrl
            );
            dataWithPic.forEach((item, index) => {
              if (index < 5) {
                this.firstFiveData.push(item);
                this.lunboNum.push(index + 1);
              }
            });
            this.lastFiveData = this.middleModuleJsonData;
          }
        });
    },
    getMiddleModuleJsonFunc1() {
      this.firstFiveData = [];
      getSchoolWebModuleMessageList({
        moduleId: this.middleModuleJsonId1,
        pageNo: 1,
        pageSize: 5,
      })
        .then((res) => res.data)
        .then((data) => {
          //	console.log("data",data.data.dataList);
          if (data.data) {
            this.firstFiveData = data.data.dataList;
            let index = 0;
            for (var i = 0; i < this.firstFiveData.length; i++) {
              index++;
              this.lunboNum.push(index);
            }
          }
        });
    },
    getMiddleModuleJsonFunc2() {
      this.lastFiveData = [];
      getSchoolWebModuleMessageList({
        moduleId: this.middleModuleJsonId2,
        pageNo: 1,
        pageSize: 8,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.data) {
            this.lastFiveData = data.data.dataList;
          }
        });
    },
    getSchoolWebModuleMessageListFunc() {
      getSchoolWebModuleMessageList({
        moduleId: this.rollModuleId,
        pageNo: 1,
        pageSize: 5,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.data) {
            this.rollModuleData = data.data.dataList;
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/mixin.scss";
.index-container {
  position: relative;
  width: 100%;
  min-width: 1200px;
}
/*主体内容*/
.main-container {
  width: 100%;
  min-width: 1200px;
  min-height: 313px;
  padding: 8px 0 10px;
  box-sizing: border-box;
  background-color: #fff;
}
.main-wrapper {
  @include clearfix;
  width: 1200px;
  min-height: 313px;
  height: auto;
  margin: 0 auto;
  background: #ececec;
  border-radius: 4px;
  overflow: hidden;
}
.main-content {
  width: 100%;
  padding: 6px 20px 0;
  box-sizing: border-box;
}
.rollModuleBox {
  width: 100%;
  height: 36px;
  .rollModule {
    float: left;
    width: 70%;
    height: 36px;
    line-height: 36px;
    margin-top: 2px;
    .tag {
      float: left;
      //color:#007a6c;
      cursor: pointer;
      .roll-icon {
        font-size: 18px;
        margin-right: 4px;
        animation: top 1s infinite ease-in-out;
      }
      .title {
        font-size: 14px;
      }
    }
    @keyframes top {
      0% {
        transform: rotateZ(0deg);
      }
      30% {
        transform: rotateZ(15deg);
      }
      50% {
        transform: rotateZ(0%);
      }
      75% {
        transform: rotateZ(-15deg);
      }
      100% {
        transform: rotateZ(0deg);
      }
    }
    .cont {
      float: left;
      width: 650px;
      height: 36px;
      overflow: hidden;
      .rollUl {
        width: auto;
        white-space: nowrap;
      }
      li {
        display: inline-block;
        padding-right: 20px;
        a {
          color: #6f6f6f;
          font-size: 14px;
        }
      }
      li:hover {
        a {
          //color:#007a6c;
        }
      }
    }
  }
  .searchBox {
    float: right;
    height: 36px;
    width: 26%;
    border: 1px solid #e8e8e8;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    padding: 4px 4px 2px;
    box-shadow: 2px 3px 2px #e8e8e8 inset;
    box-sizing: border-box;
    .search-input {
      float: left;
      width: 88%;
      height: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      border: none;
      background: none;
      outline: none;
      //color:#148d7f;
      font-size: 14px;
    }
    .search-input::-webkit-input-placeholder {
      //color:#148d7f;
    }
    .search-icon {
      float: right;
      width: 22px;
      height: 22px;
      overflow: hidden;
      margin: 4px 6px 0 0;
      cursor: pointer;
      i {
        //color:#007a6c;
        font-size: 20px;
      }
    }
  }
}
.mainItem-wrap {
  width: 100%;
  padding-top: 0px;
}
.leftMainBox {
  width: 30%;
  float: left;
  margin-right: 2%;
  .leftTopBox {
    width: 100%;
    .leftTopCont {
      padding: 10px 0 0 14px;
      box-sizing: border-box;
      .item {
        display: block;
        width: 100%;
        height: 47px;
        padding: 3px 3px 3px 6px;
        border: 1px solid #dbdbdb;
        box-sizing: border-box;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 0 6px #dbdbdb;
        margin-bottom: 6px;
        transition: 0.2s linear;
        .leftDataTag {
          float: left;
          width: 38px;
          margin-right: 10px;
          .data-top {
            width: 100%;
            height: 20px;
            line-height: 20px;
            //background: #006055;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            //color:#fff;
            font-size: 10px;
            text-align: center;
            overflow: hidden;
          }
          .data-bottom {
            width: 100%;
            height: 18px;
            line-height: 18px;
            //background: #eee;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            // color:#006055;
            font-size: 10px;
            text-align: center;
            overflow: hidden;
          }
        }
        .rightNews {
          float: left;
          font-size: 14px;
          display: table;
          width: 80%;
          height: 38px;
          color: #666;
          cursor: pointer;
          overflow: hidden;
          span {
            display: table-cell;
            vertical-align: middle;
          }
        }
        .rightNews:hover {
          //color:#007a6c;
        }
      }
      .item:hover {
        -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        -webkit-transform: translate3d(0, -2px, 0);
        transform: translate3d(0, -2px, 0);
      }
    }
  }
}
.leftTwoBox {
  width: 100%;
}
.leftUrlBox {
  padding: 10px 0 0 14px;
  box-sizing: border-box;
  .leftUrlItem {
    display: block;
    width: 100%;
    height: 54px;
    padding-left: 8%;
    border: 1px solid #dbdbdb;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0 6px #dbdbdb;
    margin-bottom: 6px;
    position: relative;
    vertical-align: middle;
    transition: all 0.3s linear 0s;
    cursor: pointer;
    & > img {
      position: absolute;
      left: 8%;
      top: 4px;
      display: inline-block;
      max-width: 68px;
      height: 46px;
      vertical-align: middle;
    }
    & > span {
      line-height: 54px;
      font-size: 17px;
      color: #323232;
      padding-left: 80px;
    }
    .goMore {
      position: absolute;
      right: 20px;
      top: 50%;
      width: 22px;
      height: 32px;
      margin-top: -13px;
      color: #bbb;
      animation: right 1.5s infinite ease-in-out;
      font-size: 0;
      i {
        font-size: 26px;
        font-weight: 100;
      }
    }
  }
  @keyframes right {
    0% {
      webkit-transform: translateX(0);
    }
    50% {
      -webkit-transform: translateX(-5px);
    }
    100% {
      -webkit-transform: translateX(0);
    }
  }
}
.leftBottomBox {
  padding: 0px 0 0 14px;
  box-sizing: border-box;
  .leftBottomItem {
    width: 100%;
    height: auto;
    max-height: 300px;
    border: 1px solid #dbdbdb;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0 6px #dbdbdb;
    margin-bottom: 10px;
    position: relative;
    vertical-align: middle;
    transition: all 0.3s linear 0s;
    padding: 10px;
    box-sizing: border-box;
    .title {
      width: 100%;
      height: 34px;
      line-height: 34px;
      img {
        float: left;
        display: block;
        width: 42px;
        height: 34px;
        margin-right: 10px;
        animation: leftRight 1s infinite ease-in-out;
      }
      span {
        font-size: 14px;
        // color:#007a6c;
        cursor: pointer;
      }
    }
    @keyframes leftRight {
      0% {
        transform: rotateY(0deg);
      }
      30% {
        transform: rotateY(20deg);
      }
      50% {
        transform: rotateY(0%);
      }
      75% {
        transform: rotateY(-20deg);
      }
      100% {
        transform: rotateY(0deg);
      }
    }
    .content {
      width: 100%;
      text-align: center;
      color: #94947d;
    }
  }
}
.middleMainBox {
  width: 34%;
  float: left;
  margin-right: 2%;
  .smallLunbo {
    width: 97%;
    height: 224px;
    background: #979780;
    padding: 8px;
    box-sizing: border-box;
    position: relative;
    margin-top: 10px;
    .lunbo-box {
      width: 100%;
      height: 208px;
      position: relative;
      overflow: hidden;
      .photo-item {
        display: block;
        width: 100%;
        height: 204px;
        background-size: cover;
        background-position: center center;
      }
      .olBox {
        position: absolute;
        left: 0;
        bottom: 0px;
        width: 100%;
        height: 30px;
        z-index: 4;
        text-align: right;
        padding-right: 8px;
        li {
          display: inline-block;
          width: 17px;
          height: 17px;
          line-height: 17px;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          text-align: center;
          margin-right: 4px;
        }
        li.is-active {
          background: #fe2f2f;
        }
      }
    }
  }
  .middleModule2 {
    padding-top: 6px;
  }
}
.rightMainBox {
  width: 32%;
  float: left;
  .rightItemUl {
    padding: 3px 0 2px;
    .rightItemLi {
      float: left;
      width: 49%;
      height: 52px;
      line-height: 50px;
      border: 1px solid #cccccc;
      transform: translate3d(0 0 0);
      transition: all 0.2s linear;
      background: #f2f2f2;
      border-radius: 4px;
      box-shadow: 0 0 3px #dbdbdb;
      overflow: hidden;
      margin-right: 2%;
      position: relative;
      box-sizing: border-box;
      margin-top: 9px;
      /*! autoprefixer: off */
      background: -webkit-gradient(
        linear,
        100% 0,
        0 0,
        from(rgb(253, 253, 253)),
        to(rgb(221, 221, 221))
      );
      background: -webkit-linear-gradient(
        top,
        rgb(253, 253, 253) 0%,
        rgb(221, 221, 221) 100%
      );
      /* autoprefixer: on */
      background: -moz-linear-gradient(
        top,
        rgb(253, 253, 253) 0%,
        rgb(221, 221, 221) 100%
      );
      background: -ms-linear-gradient(
        top,
        rgb(253, 253, 253) 0%,
        rgb(221, 221, 221) 100%
      );
      background: -o-linear-gradient(
        top,
        rgb(253, 253, 253) 0%,
        rgb(221, 221, 221) 100%
      );
      background: linear-gradient(
        top,
        rgb(253, 253, 253) 0%,
        rgb(221, 221, 221) 100%
      );
      a {
        width: 100%;
        height: 52px;
        display: block;
        line-height: 42px;
        text-align: center;
        padding: 5px;
        box-sizing: border-box;
      }
      img {
        float: left;
        display: block;
        width: 40px;
        height: 40px;
        margin-right: 4px;
        font-size: 0;
        margin-top: 2px;
      }
      span {
        display: block;
        float: left;
        font-size: 14px;
        white-space: nowrap;
        //color:#319300;
        max-width: 90px;
        text-overflow: ellipsis;
        overflow: hidden;
        letter-spacing: 0px;
      }
    }
    .rightItemLi:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translate3d(0, -2px, 0);
    }
    .rightItemLi:nth-child(even) {
      margin-right: 0;
    }
  }
}
.global-top {
  height: 36px;
  line-height: 35px;
  // border-bottom:1px solid #006055;
  box-sizing: border-box;
  .title {
    float: left;
    display: block;
    padding: 0 14px;
    font-size: 16px;
    // color:#007a6c;
    height: 100%;
    // border-bottom:2px solid #006055;
    box-sizing: border-box;
  }
  .more {
    float: right;
    font-size: 12px;
    margin-right: 10px;
    cursor: pointer;
    i {
      font-size: 18px;
      display: inline-block;
      margin-left: 4px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }
  .more:hover {
    // color:#007a6c;
  }
}
.middleNewList {
  padding-top: 6px;
}
.middleNewLi {
  height: 24px;
  line-height: 24px;
  width: 97%;
  padding-left: 18px;
  position: relative;
  // background:url(https://cdnfile-10043692.file.myqcloud.com/web/images/template2/left_tag.png) 0 6px no-repeat;
  box-sizing: border-box;
  font-size: 14px;
  margin-bottom: 6px;
  a {
    float: left;
    width: 74%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #292929;
  }
  a:hover {
    //color:#007a6c;
  }
  .dataText {
    text-align: right;
    float: right;
    width: 20%;
    font-size: 12px;
    color: #838381;
  }
}
.middleNewLi:before {
  // position: absolute;
  // left:0;
  // top:6px;
  // content:'';
  // width:0;
  // height: 0;
  // border-top:9px solid #148D7E;
  // border-right:9px solid transparent;
}
.global-top2 {
  height: 36px;
  line-height: 35px;
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
  .title {
    float: left;
    display: block;
    padding: 0 14px;
    font-size: 16px;
    // color:#007a6c;
    height: 100%;
    border-bottom: 2px solid transparent;
    box-sizing: border-box;
  }
  .more {
    float: right;
    font-size: 12px;
    margin-right: 10px;
    cursor: pointer;
    i {
      font-size: 18px;
      display: inline-block;
      margin-left: 4px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }
  .more:hover {
    // color:#007a6c;
  }
}
.bottomLunbo-wrap {
  width: 100%;
  .top {
    width: 100%;
    height: 41px;
    line-height: 41px;
    // background:#1e766c;
    padding-left: 45px;
    box-sizing: border-box;
    position: relative;
    img {
      display: inline-block;
      font-size: 0;
      width: 30px;
      height: 30px;
      overflow: hidden;
      margin-top: -3px;
      background-size: 100% 100%;
      vertical-align: middle;
    }
    span {
      font-size: 16px;
      color: #fff;
      padding-left: 8px;
    }
    .more {
      position: absolute;
      top: 0;
      right: 45px;
      color: #fff;
      cursor: pointer;
      i {
        font-size: 18px;
        display: inline-block;
        margin-left: 4px;
        vertical-align: middle;
        margin-top: -3px;
      }
    }
  }
  .bottomLunbo {
    width: 100%;
    padding: 10px 40px;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    .swiper-container,
    .swiper-wrapper {
      width: 100%;
      height: 100%;
    }
    .swiper-slide {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }
    .photo-item {
      width: 100%;
      height: 200px;
      background-size: cover;
    }
  }
}
</style>
<style lang="scss">
.smallLunbo .el-carousel__indicators {
  position: absolute;
  list-style: none;
  bottom: 0;
  right: 0;
  margin: 0;
  width: 100%;
  text-align: right;
  z-index: 4;
  box-sizing: border-box;
}
.smallLunbo .el-carousel__indicators {
  position: absolute;
  list-style: none;
  bottom: 0;
  right: 0;
  margin: 0;
  width: 100%;
  text-align: right;
  padding-right: 8px;
  z-index: 4;
  box-sizing: border-box;
  opacity: 0;
}
.smallLunbo .el-carousel__button {
  display: block;
  opacity: 1;
  width: 14px;
  height: 14px;
  background-color: #fff;
  border: none;
  outline: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  border-radius: 50%;
  opacity: 0;
}
.main-containerTwo {
  .content {
    p {
      margin: 0 0 4px;
    }
    p:last-child {
      margin: 0;
    }
  }
}
</style>
