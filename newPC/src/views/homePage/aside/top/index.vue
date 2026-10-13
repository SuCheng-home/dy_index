<template>
  <div class="home-page-aside-top" ref="asideItem">
    <div class="school-title" ref="schoolName">{{ schoolInfo.name }}
      <!-- <div class="red"> {{userSize}}G/{{limitSize}}G</div> -->
      </div>
    <div class="aside-content-wrapper">
      <div class="title" ref="title">
        <span>今日课表</span>
        
      </div>
      <div class="content">
        <el-table
          style="width: 100%"
          size="medium"
          :show-header="false"
          :height="tabHeight"
          :data="tabList"
        >
          <el-table-column show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.title || "--" }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip>
            <template slot-scope="scope">{{
              scope.row.className || "--"
            }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip>
            <template slot-scope="scope">{{
              scope.row.currName || "--"
            }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import { userClassScheduleDetails,getWxfileInfoSchool,getSchoolTimeAllList,getSeveralWeekListBySchoolTImeId,userClassScheduleDetailsWeek} from "@/api/classScheduleCard";

export default {
  name: "homePageAsideTop",
  mixins: [mixin],
  components: {},
  computed: {
    ...mapGetters(["schoolInfo", "userInfo"]),
  },
  data() {
    return {
      // 表格数据
      tabList: [],
      tabHeight: "",
      userSize:0,
      limitSize:0,
      selectWeek:''
    };
  },
  created() {
     getSchoolTimeAllList().then(res => {
                   res.data.data.forEach((item) => {
                        if (item.isCurrent === 1) {
                             getSeveralWeekListBySchoolTImeId(item.id).then((res) => {
                              const data = res.data.data;
                              if (res.data.code === 200) {
                                  if (data.map(item => item.nowWeek).indexOf(1) > -1) {
                                      this.selectWeek = data[data.map(item => item.nowWeek).indexOf(1)].week;
                                  } else {
                                      this.selectWeek = data[0].week;
                                  }
                                 this.userClassScheduleDetailsWeek();
                              }
                          }).catch(() => {
                          });
                        }
                    });
                }).catch();
    
    getWxfileInfoSchool(this.schoolInfo.id).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
             this.userSize=parseFloat(data.userSize/(1024*1024*1024)).toFixed(2);
             this.limitSize=parseFloat(data.limitSize/(1024*1024*1024)).toFixed(2)
          }
        });
  },
  methods: {
    // 根据教师id获取教师课程表
    userClassScheduleDetailsWeek() {
      userClassScheduleDetailsWeek(this.userInfo.id, this.selectWeek)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            let {
              morningScheduleCurrListList,
              forenoonScheduleCurrListList,
              noonScheduleCurrListList,
              afternoonScheduleCurrListList,
              nightScheduleCurrListList,
            } = data.classSchedule;
            let day = this.$moment().day();
            let mydata=this.$moment().format('YYYY-MM-DD')+''
            for(let i=0;i<data.schoolTimeDateList.length;i++){
              if(mydata==data.schoolTimeDateList[i].schoolTimeDate){
                if (Array.isArray(morningScheduleCurrListList)&&morningScheduleCurrListList.length) {
                if (
                  morningScheduleCurrListList[0][i] &&
                  Array.isArray(morningScheduleCurrListList[0][i])
                ) {
                  morningScheduleCurrListList[0][i].map((item) => {
                    this.tabList.push({
                      title: `早自习`,
                      className: item.className,
                      currName: item.currName,
                    });
                  });
                }
              }

              if (Array.isArray(forenoonScheduleCurrListList)) {
                forenoonScheduleCurrListList.forEach((classList, index) => {
                  classList[i].forEach((item) => {
                    this.tabList.push({
                      title: `上午第${index + 1}节课`,
                      className: item.className,
                      currName: item.currName,
                    });
                  });
                });
              }
              if (Array.isArray(noonScheduleCurrListList) &&noonScheduleCurrListList.length) {
                if (
                  noonScheduleCurrListList[0][i] &&
                  Array.isArray(noonScheduleCurrListList[0][i])
                ) {
                  noonScheduleCurrListList[0][i].map((item, index) => {
                    this.tabList.push({
                      title: `午自习`,
                      className: item.className,
                      currName: item.currName,
                    });
                  });
                }
              }
              if (Array.isArray(afternoonScheduleCurrListList)) {
                afternoonScheduleCurrListList.forEach((classList, index) => {
                  classList[i].forEach((item) => {
                    this.tabList.push({
                      title: `下午第${index + 1}节课`,
                      className: item.className,
                      currName: item.currName,
                    });
                  });
                });
              }
              if (Array.isArray(nightScheduleCurrListList) &&nightScheduleCurrListList.length) {
                if (
                  nightScheduleCurrListList[0][i] &&
                  Array.isArray(nightScheduleCurrListList[0][i])
                ) {
                  nightScheduleCurrListList[0][i].map((item, index) => {
                    this.tabList.push({
                      title: `晚自习`,
                      className: item.className,
                      currName: item.currName,
                    });
                  });
                }
              }
              let schoolNameH = this.$refs["schoolName"].offsetHeight;
              let titleH = this.$refs["title"].offsetHeight;
              this.tabHeight =
                this.$refs["asideItem"].clientHeight -
                40 -
                schoolNameH -
                20 -
                titleH -
                10;
              }

            }
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.home-page-aside-top {
  .school-title {
    font-family: SourceHanSansCN-Bold;
    font-size: 32px;
    font-weight: bold;
    color: #37608d;
    text-align: center;
     .red{
      color:#F56C6C;
      top:10px;
      right:10px;
      font-size: 16px;
      line-height: 32px;
    }
  }
}
</style>