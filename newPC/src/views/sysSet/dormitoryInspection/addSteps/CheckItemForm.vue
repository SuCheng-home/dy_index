<template>
  <div class="check-item-form demo-ruleForm">
    <div class="check-item-header">
      <el-checkbox v-model="selectAll" @change="handleSelectAll">
        全选
      </el-checkbox>
    </div>
    <div class="check-items">
      <div 
        v-for="(item) in itemList" 
        :key="item.id" 
        class="check-item"
        :class="{ active: item.checked }"
      >
        <div class="check-item-content">
          <el-checkbox v-model="item.checked" @change="handleCheckChange(item)">
            {{ item.title }}
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGroup, getItemList, addGroupItemList, getGroupItemList } from '@/api/dormitoryInspection';
export default {
  name: 'CheckItemForm',
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
  },
  data() {
    return {
      groupInfo: {},
      itemList: [],
      groupItemList: [],
      selectAll: false
    }
  },
  async created() {
    await this.getGroup();
    await this.getGroupItemList();
    this.getItemList();
  },
  methods: {
    async getGroup() {
      try {
        const res = await getGroup(this.id)
        let data = res.data;
        if (data.code === 200) {
          this.groupInfo = data.data;
        }
      } catch (error) {
        console.error('获取检查组失败:', error);
      }
    },
    async getGroupItemList() {
      try {
        const res = await getGroupItemList({
          groupId: this.id
        })
        this.groupItemList = (res.data.data || []).map(i => i.itemId)
      } catch (error) {
        console.error('获取检查项失败:', error);
      }
    },
    getItemList() {
      getItemList({
        title: '',
        pageNo: 1,
        pageSize: 9999,
      }).then(res => {
          let data = res.data;
          if (data.code === 200) {
            this.itemList = data.data.dataList
              .filter(i => i.isStar == this.groupInfo.isStar)
              .map(i => ({
                ...i,
                checked: this.groupItemList.includes(i.id)
              }))
            this.updateSelectAllStatus()
          }
      }).catch(() => {
      })
    },
    async handleSave() {
      try {
        const itemList = this.itemList.filter(i => i.checked)
          .map(i => ({
            groupId: this.id,
            itemId: i.id
          }))
        if (itemList.length === 0) {
          this.$message.error('请选择检查项');
          return Promise.reject();
        }
        await addGroupItemList(itemList)
        this.$message.success('保存成功');
      } catch (err) {
        return Promise.reject(err);
      }
    },
    // 处理检查项变更
    handleCheckChange(item) {
      // 更新全选状态
      this.updateSelectAllStatus();
    },
    // 处理全选
    handleSelectAll() {
      this.itemList.forEach(item => {
        item.checked = this.selectAll;
      });
    },
    // 更新全选状态
    updateSelectAllStatus() {
      if (this.itemList.length === 0) {
        this.selectAll = false;
        return;
      }
      this.selectAll = this.itemList.every(item => item.checked);
    }
  }
}
</script>

<style lang='scss' scoped>
.check-item-form {
  padding: 20px 0;
}

.check-item-header {
  margin-bottom: 20px;
  padding: 12px 16px;
  // background: #fafafa;
  // border-radius: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.check-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 30px;
}

.check-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s;
  cursor: pointer;
  min-width: 200px;
  max-width: 300px;
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  }
  
  &.active {
    border-color: #1890ff;
    background: #e6f7ff;
  }
}

.check-item-content {
  flex: 1;
  margin-right: 12px;
}

.check-item-actions {
  flex-shrink: 0;
}

.mobile-check {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #262626;
    margin-bottom: 16px;
  }
}

// 自定义checkbox样式
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #1890ff;
  border-color: #1890ff;
}

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #1890ff;
  font-weight: 500;
}

.el-button--text {
  color: #999;
  
  &:hover {
    color: #1890ff;
  }
  
  &:disabled {
    color: #d9d9d9;
    cursor: not-allowed;
  }
}
</style>
