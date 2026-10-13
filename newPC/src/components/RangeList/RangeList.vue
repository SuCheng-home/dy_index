<template>
    <div :class="['range-list', plain ? 'range-list--plain' : '']">
        <template v-for="item in departJson">
            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/depart.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                <span class="range-item-des">{{item.name}}</span>
            </div>
        </template>
        <template v-for="item in groupJson">
            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/group.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                <span class="range-item-des">{{item.name}}</span>
            </div>
        </template>
        <template v-for="item in userJson">
            <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+item.avatar+')'}"></span>
                <span class="range-item-des">{{item.name}}</span>
            </div>
        </template>

        <div class="clear"></div>
    </div>
</template>

<script>
    export default {
        name: "RangeList",
        props: {
            plain: {
                type: Boolean,
                default: false
            },
            departJson: {
                default: function() {
                    return []
                },
                type: Array
            },
            groupJson: {
                default: function() {
                    return []
                },
                type: Array
            },
            userJson: {
                default: function() {
                    return []
                },
                type: Array
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../src/styles/mixin.scss";

    .range-list {
        line-height: 1em;
        padding: 16px;
        background-color: #F7FBFD;
        &.range-list--plain {
            background-color: transparent;
            padding: 0;
            vertical-align: middle;
            display: inline-block;
            .range-item {
                height: auto;
                background-color: #eee;
            }
        }
    }
    .range-item {
        height: 30px;
        box-sizing: border-box;
        line-height: 1em;
        @include middleIB;
        margin-right: 16px;
        & > * {
            @include middleIB;
        }
    }

    .range-item-img {
        height: 30px;
        width: 30px;
        background-position: center center;
        background-size: cover;
    }

    .range-item-des {
        padding-left: 4px;
        line-height: 30px;
        padding-right: 4px;
        color: #676A6C;
        font-size: 13px;
    }

</style>
