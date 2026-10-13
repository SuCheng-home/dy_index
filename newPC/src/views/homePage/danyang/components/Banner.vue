<template>
  <div class="banner-box">
    <div class="banner-wrapper" ref="bannerWrapper">
      <div v-for="(slide, index) in banners" :key="index" class="banner-slide">
        <img :src="slide" class="banner-img">
        <div class="banner-caption">
        </div>
      </div>
    </div>
    <div class="banner-dots">
      <span v-for="(dot, index) in banners" :key="index" class="dot" :class="{ active: currentBanner === index }" @click="switchBanner(index)"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { findSchoolDicsByCode } from "@/api/common/common"
export default {
  name: 'Banner',
  data() {
    return {
      // 轮播图
      banners: [],
      currentBanner: 0,
      bannerInterval: null,
    }
  },
  computed: {
    ...mapGetters([
      "schoolInfo",
    ])
  },
  mounted() {
    findSchoolDicsByCode({
      dicCode: 'schoolTitlePhoto',
      schoolId: this.schoolInfo.id,
    }).then(res => res.data)
      .then(data => {
        if (data.code === 200 && data.data.length) {
          console.log(111, data)
          this.banners = data.data.map(i => i.remark)
          this.initBanner();
        }
      })
  },
  beforeUnmount() {
    // 清除轮播图定时器
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }
  },
  methods: {
    // 初始化轮播图
    initBanner() {
      // 自动轮播
      this.bannerInterval = setInterval(() => {
        this.currentBanner = (this.currentBanner + 1) % this.banners.length;
        this.updateBannerPosition();
      }, 5000);
    },
    
    // 更新轮播图位置
    updateBannerPosition() {
      if (this.$refs.bannerWrapper) {
        this.$refs.bannerWrapper.style.transform = `translateX(-${this.currentBanner * 100}%)`;
      }
    },
    
    // 点击切换轮播图
    switchBanner(index) {
      this.currentBanner = index;
      this.updateBannerPosition();
    }
  }
}
</script>

<style lang='scss' scoped>
.banner-box {
  height: 280px;
  border-radius: var(--radius);
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.banner-wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.banner-slide {
  min-width: 100%;
  position: relative;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: #fff;
  padding: 20px 24px;
}

.banner-caption h3 {
  font-size: 20px;
  margin-bottom: 4px;
}

.banner-caption p {
  font-size: 13px;
  opacity: 0.9;
}

.banner-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.banner-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.banner-dots .dot.active {
  background: #fff;
  width: 20px;
  border-radius: 4px;
}
</style>
