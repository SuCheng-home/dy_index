<template>
  <div class="todo-list">
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
      <h4 style="font-size: 14px; margin: 0; position: relative; display: inline-block;">
        待办事项
        <span style="position: absolute; top: -6px; right: -18px; background: #f5222d; color: white; font-size: 10px; padding: 0 5px; height: 16px; line-height: 16px; border-radius: 8px; font-weight: normal; transform: scale(0.9);">{{ todosTotal }}</span>
      </h4>
      <span style="font-size: 12px; color: var(--primary); cursor: pointer;" @click="gotoWorkReminderIndex">更多</span>
    </div>
    <ul class="todo-list">
      <li v-for="(todo, index) in todos" :key="index" class="todo-item" style="cursor: pointer;" @click="gotoDetail(todo)">
        <i class="fas fa-angle-right" style="color: var(--text-light); font-size: 12px; margin-right: 4px;"></i>
        <span class="todo-text">{{ todo.moduleName }}：{{ todo.title }}</span>
        <span class="todo-time">{{ todo.createTime | filterDate }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Moment from 'moment';
import { getBackLogNotList } from "@/api/homePage/aside/middle/workReminder";
export default {
  name: 'todoList',
  filters: {
    filterDate(val) {
      return val ? Moment(val).format("YYYY-MM-DD HH:mm") : "--";
    }
  },
  data() {
    return {
      // 待办事项
      todos: [],
      todosTotal: 0,
    }
  },
  mounted() {
    this.getBackLogNotList()
  },
  methods: {
    // 待办详情
    gotoDetail(item) {
      console.log(item.pcUrl);
      this.$router.push({
        path: item.pcUrl,
      });
    },
    gotoWorkReminderIndex() {
      sessionStorage.removeItem("workReminderTabActiveName");
      this.$router.push({
        path: "/main/homePage/workReminder/index",
      });
    },
    // 根据用户id，模块code,主题查询待办
    getBackLogNotList() {
      getBackLogNotList({
        moduleCode: 0,
        title: '',
        pageNo: 1,
        pageSize: 5,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data) {
            let { dataList, pagination } = data.data;
            this.todos = [...dataList];
            this.todosTotal = pagination.total;
          }
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-check {
  width: 16px;
  height: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.todo-check.checked {
  background: var(--primary);
  border-color: var(--primary);
}

.todo-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-item:hover {
  background-color: #fafafa;
}
</style>
