/**
 * Element UI TimeSpinner 运行时补丁
 * 使分钟和秒的选择以5为步进间隔
 * 通过 MutationObserver 检测时间滚轮 DOM 出现后修补其 Vue 实例
 * 同时拦截"此刻"按钮和确认按钮，将时间吸附到最近的5分钟/5秒间隔
 */
import Vue from 'vue'

var STEP = 5
var ITEM_HEIGHT = 32

function snapToStep(value) {
  var snapped = Math.round(value / STEP) * STEP
  if (snapped >= 60) snapped = 55
  if (snapped < 0) snapped = 0
  return snapped
}

function getWrapEl(vm, type) {
  var ref = vm.$refs && vm.$refs[type]
  if (!ref) return null
  // el-scrollbar 暴露 wrap 计算属性指向 .el-scrollbar__wrap DOM 元素
  if (ref.wrap) return ref.wrap
  if (ref.$refs && ref.$refs.wrap) return ref.$refs.wrap
  return null
}

function getItemHeight(vm, type) {
  try {
    var h = vm.typeItemHeight && vm.typeItemHeight(type)
    return (h && h > 0) ? h : ITEM_HEIGHT
  } catch (e) {
    return ITEM_HEIGHT
  }
}

// 修补时间滚轮实例
function patchTimeSpinner(vm) {
  if (!vm || vm._timeStepPatched) return
  if (!vm.modifyDateField) return
  vm._timeStepPatched = true

  // 滚动保护标记：用户滚动时阻止 adjustCurrentSpinner 干扰
  vm._userScrolling = {}

  // 保存原始方法
  var origHandleScroll = vm.handleScroll
  var origAdjustSpinner = vm.adjustSpinner
  var origScrollDown = vm.scrollDown

  // === 修正 handleScroll ===
  vm.handleScroll = function (type) {
    if (type === 'minutes' || type === 'seconds') {
      var el = getWrapEl(vm, type)
      if (!el) return
      var itemHeight = getItemHeight(vm, type)
      var visibleIndex = Math.round(el.scrollTop / itemHeight)
      var value = Math.min(Math.max(visibleIndex * STEP, 0), 55)
      vm.modifyDateField(type, value)
      // 标记用户正在滚动，防止 adjustCurrentSpinner 用旧值覆盖
      vm._userScrolling[type] = true
      clearTimeout(vm._userScrolling[type + '_timer'])
      vm._userScrolling[type + '_timer'] = setTimeout(function () {
        vm._userScrolling[type] = false
      }, 300)
    } else {
      origHandleScroll && origHandleScroll.call(vm, type)
    }
  }

  // === 修正 adjustSpinner ===
  vm.adjustSpinner = function (type, value) {
    if (vm.arrowControl) return
    var el = getWrapEl(vm, type)
    if (!el) return
    if (type === 'minutes' || type === 'seconds') {
      value = snapToStep(value)
      var itemHeight = getItemHeight(vm, type)
      el.scrollTop = Math.max(0, (value / STEP) * itemHeight)
    } else {
      var h = getItemHeight(vm, type)
      el.scrollTop = Math.max(0, value * h)
    }
  }

  // === 修正 adjustCurrentSpinner：防止 mousemove 用旧值覆盖滚动位置 ===
  vm.adjustCurrentSpinner = function (type) {
    // 用户正在滚动时不调整，避免用尚未更新的旧值重置位置
    if ((type === 'minutes' || type === 'seconds') && vm._userScrolling[type]) {
      return
    }
    vm.adjustSpinner(type, vm[type])
  }

  // === 修正 adjustSpinners ===
  vm.adjustSpinners = function () {
    vm.adjustSpinner('hours', vm.hours)
    vm.adjustSpinner('minutes', vm.minutes)
    vm.adjustSpinner('seconds', vm.seconds)
  }

  // === 修正 handleClick ===
  vm.handleClick = function (type, obj) {
    if (!obj.disabled) {
      var value = obj.value
      if (type === 'minutes' || type === 'seconds') {
        value = snapToStep(value)
      }
      vm.modifyDateField(type, value)
      vm.emitSelectRange(type)
      vm.adjustSpinner(type, value)
    }
  }

  // === 修正 scrollDown（键盘箭头）===
  if (origScrollDown) {
    vm.scrollDown = function (step) {
      if (!vm.currentScrollbar) {
        vm.emitSelectRange('hours')
      }
      var label = vm.currentScrollbar
      if (label === 'hours') {
        origScrollDown.call(vm, step)
        return
      }
      var now = vm[label]
      var direction = step > 0 ? STEP : -STEP
      now = (now + direction + 60) % 60
      now = snapToStep(now)
      vm.modifyDateField(label, now)
      vm.adjustSpinner(label, now)
      vm.$nextTick(function () { vm.emitSelectRange(vm.currentScrollbar) })
    }
  }

  // 重新绑定滚动事件（覆盖 bindScrollEvent 设置的 onscroll）
  rebindScroll(vm, 'minutes')
  rebindScroll(vm, 'seconds')
}

function rebindScroll(vm, type) {
  var el = getWrapEl(vm, type)
  if (el) {
    el.onscroll = function () {
      vm.handleScroll(type)
    }
  }
}

// 扫描并补丁所有时间滚轮
function scanAndPatch() {
  var spinners = document.querySelectorAll('.el-time-spinner')
  for (var i = 0; i < spinners.length; i++) {
    var spinnerEl = spinners[i]
    var vm = spinnerEl.__vue__
    if (vm && !vm._timeStepPatched) {
      patchTimeSpinner(vm)
    }
  }
}

// MutationObserver 检测时间选择器弹出
// 使用 setTimeout 确保在 Vue 的 mounted + $nextTick(bindScrollEvent) 之后执行
var pendingPatch = null
var observer = new MutationObserver(function () {
  if (pendingPatch) return
  pendingPatch = setTimeout(function () {
    pendingPatch = null
    scanAndPatch()
  }, 50)
})

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true })
} else {
  document.addEventListener('DOMContentLoaded', function () {
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

// ========== 拦截此刻按钮和确认按钮 吸附到5分钟5秒间隔 ==========

function snapDateToStep(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return date
  var d = new Date(date.getTime())
  var min = Math.round(d.getMinutes() / STEP) * STEP
  var sec = Math.round(d.getSeconds() / STEP) * STEP
  if (min >= 60) min = 55
  if (sec >= 60) sec = 55
  d.setMinutes(min)
  d.setSeconds(sec)
  d.setMilliseconds(0)
  return d
}

Vue.mixin({
  mounted: function () {
    var vm = this
    // datetime面板: 有changeToNow和confirm方法
    if (vm.changeToNow && vm.confirm && !vm._dateTimePanelPatched) {
      vm._dateTimePanelPatched = true
      vm.changeToNow = function () {
        var now = snapDateToStep(new Date())
        if ((!vm.disabledDate || !vm.disabledDate(now)) && vm.checkDateWithinRange(now)) {
          vm.date = now
          vm.emit(vm.date)
        }
      }
      var origConfirm = vm.confirm
      vm.confirm = function () {
        if (vm.selectionMode === 'dates' || vm.selectionMode === 'months' || vm.selectionMode === 'years') {
          vm.emit(vm.value)
        } else {
          var value = vm.value
            ? snapDateToStep(new Date(vm.value))
            : snapDateToStep(vm.getDefaultValue ? vm.getDefaultValue() : new Date())
          vm.date = new Date(value)
          vm.emit(value)
        }
      }
    }
    // 独立time-panel（非range）: 有handleConfirm、handleChange、selectionRange、date（无minDate/maxDate）
    if (vm.handleConfirm && vm.handleChange && vm.selectionRange && vm.date && !vm.minDate && !vm._timePanelPatched) {
      vm._timePanelPatched = true
      vm.handleConfirm = function () {
        var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var first = arguments[1]
        if (first) return
        var date = snapDateToStep(vm.date)
        vm.date = date
        vm.$emit('pick', date, visible, first)
      }
    }
    // time-range面板（is-range）: 有handleConfirm、minDate、maxDate
    if (vm.handleConfirm && vm.minDate && vm.maxDate && !vm._timeRangePanelPatched) {
      vm._timeRangePanelPatched = true
      vm.handleConfirm = function () {
        var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        vm.minDate = snapDateToStep(vm.minDate)
        vm.maxDate = snapDateToStep(vm.maxDate)
        vm.$emit('pick', [vm.minDate, vm.maxDate], visible)
      }
    }
  }
})
