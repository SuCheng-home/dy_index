<template>
  <div class="card_template_info_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
    </div>
    <div class="card_template_info_box" :style="`height: ${windowHeight - 170}px;`">
      <div class="goods_box">
        <div class="goods_img_box" v-if="goodsInfo.goodsLogo">
          <img :src="goodsInfo.goodsLogo" alt="" class="goods_pic">
          <div class="point_type">{{goodsInfo.typeName}}</div>
        </div>
        <div class="name_point_box">
          <div class="goods_name">{{goodsInfo.goodsName}}</div>
          <div class="point_box">所需积分：{{goodsInfo.requirePoint}}分</div>
        </div>
        <div class="goods_detail_box">
          <div v-html="goodsInfo.details"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import windowResize from '@/mixins/windowResize';
  import {getIntegralGoodsInfoById} from '@/api/integralBank';

  export default {
    name: "goodsInfo",
    data() {
      return {
        goodsId: this.$route.query.goodsId,
        goodsInfo: {}
      }
    },
    mixins: [windowResize],
    created() {
      this.getIntegralGoodsInfoById();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      toEditCardModule() {
        this.$router.push({path: 'goodsManageAdd', query: {goodsId: this.goodsId}})
      },
      getIntegralGoodsInfoById() {
        getIntegralGoodsInfoById({id: this.goodsId}).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.goodsInfo = data.data;
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './../../styles/mixin';

  .card_template_info_wrap{
    padding: 12px;

    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .card_template_info_box{
      @include scrollBar;
      .goods_box{
        width: 375px;
        margin: 20px auto;
        min-height: 667px;
        overflow: hidden;
        background-color: #f8f8f8;
        border: 1px solid #efefef;
        .goods_img_box{
          position: relative;
          background-color: #fff;
          .goods_pic{
            display: block;
            width: 100%;
          }
          .point_type{
            position: absolute;
            top: 6px;
            right: 12px;
            height: 20px;
            line-height: 20px;
            padding: 0 12px;
            font-size: 12px;
            color: #fff;
            background-color: #409EFF;
            border-radius: 10px;
          }
        }
        .name_point_box{
          background: #fff;
          overflow: hidden;
          margin-bottom: 10px;
          border-top: 1px solid #f7f7f7;
          .goods_name{
            height: 15px;
            line-height: 15px;
            margin-top: 12px;
            margin-left: 16px;
            font-size: 15px;
            font-weight: bold;
            color: #333;
          }
          .point_box{
            height: 24px;
            line-height: 24px;
            margin: 8px 10px;
            padding: 0 15px;
            color: #E6A23C;
            background-color: #FDF6EC;
            border: 1px solid #F5DAB1;
            border-radius: 12px;
          }
        }
        .goods_detail_box{
          padding: 5px 8px;
          background-color: #fff;
        }
      }
    }
  }
</style>
