<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title"><i class="fas fa-bell"></i> 通知公告</div>
      <span class="card-extra" @click="gotoNotieRecive">更多</span>
    </div>
    <div class="card-body" style="padding: 10px 0;">
      <ul class="notice-list">
        <li v-for="(notice, index) in notices" :key="index" class="notice-item" @click="gotoNoticeDetail(notice)">
          <div class="notice-date">
            <div class="n-day">{{ notice.releaseDate | dayFilter }}</div>
            <div class="n-month">{{ notice.releaseDate | monthFilter }}</div>
          </div>
          <div class="notice-content-box">
            <h4><span class="notice-tag" :class="{
              unread: notice.readState !== 2,
              read: notice.readState === 2
            }">{{ notice.readState === 2 ? '已读' : '未读' }}</span>{{ notice.noticeTitle }}</h4>
            <div class="notice-meta">{{ notice.releaseUserName }} <i v-if="notice.attachmentNum > 0" class="fas fa-paperclip"></i></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Moment from 'moment';
import { mapGetters } from 'vuex'
import {getUserReceiveNoticeList} from "@/api/notice";
export default {
  name: 'NoticeList',
  filters: {
    dayFilter(val) {
      if (!val) return ''
      return Moment(val).format('DD')
    },
    monthFilter(val) {
      if (!val) return ''
      return Moment(val).format('MM')
    }
  },
  data() {
    return {
      // 通知公告
      notices: []
    }
  },
  computed: {
    ...mapGetters([
      "userInfo"
    ])
  },
  mounted() {
    this.getUserReceiveNoticeList()
  },
  methods: {
    // 用户接收的通知列表
    getUserReceiveNoticeList() {
      getUserReceiveNoticeList({
          pageNo: 1,
          pageSize: 5,
          searchTitle: "",
          noticeType: 0,
          receiveUserId: this.userInfo.id
      })
          .then((res) => {
              let _res = res.data;
              if (_res.code != 200) return Promise.reject(_res.msg);
              else return _res.data;
          })
          .then((data) => {
              let {dataList, pagination} = data;
              this.notices = [...dataList];
          })
          .catch((msg) => {
              this.$message({
                  message: msg,
                  type: "error",
              });
          });
    },
    // 收通知
    gotoNotieRecive() {
        this.$router.push({
            path: "/main/homeSchool/notice/notieRecive",
        });
    },
    // 收通知详情
    gotoNoticeDetail(item) {
        this.$router.push({
            path: "/main/homeSchool/notice/noticeDetail",
            query: {id: item.id, isReceive: 1, fromIndex: 1},
        });
    }
  }
}
</script>

<style lang="scss" scoped>
/* Right Column */
.notice-list {
  list-style: none;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.notice-item:hover {
  background: #fafafa;
  padding-left: 8px;
  padding-right: 8px;
  margin: 0 -8px;
  border-radius: 4px;
}

.notice-date {
  background: #f0f2f5;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
  min-width: 50px;
}

.n-day {
  font-size: 16px;
  font-weight: bold;
  color: var(--primary);
  line-height: 1;
}

.n-month {
  font-size: 10px;
  color: var(--text-light);
}

.notice-content-box h4 {
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 4px;
  line-height: 1.4;
  color: var(--text-main);
}

.notice-meta {
  font-size: 12px;
  color: var(--text-light);
}
.notice-tag {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  margin-right: 6px;
}

.notice-tag.unread {
  background: #fff1f0;
  color: #f5222d;
  border: 1px solid #ffa39e;
}

.notice-tag.read {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.badge-count {
  background: #f5222d;
  color: white;
  font-size: 10px;
  padding: 0 6px;
  border-radius: 10px;
  margin-left: 4px;
}
</style>
