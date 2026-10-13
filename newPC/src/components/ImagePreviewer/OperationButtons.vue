<template>
    <ul class="buttons-container">
        <li @click.stop="$emit('reset-to-init')">
            <i class="fa fa-square-o"></i>
        </li>
        <li @click.stop="$emit('zoom-in')">
            <i class="fa fa-plus"></i>
        </li>
        <li @click.stop="$emit('zoom-out')">
            <i class="fa fa-minus"></i>
        </li>
        <li @click.stop="$emit('prev-pic')">
            <i class="fa fa-arrow-left"></i>
        </li>
        <li @click.stop="togglePlay" :class="{ active: isPlay }">
            <i class="fa fa-play"></i>
        </li>
        <li @click.stop="$emit('next-pic')">
            <i class="fa fa-arrow-right"></i>
        </li>
        <li @click.stop="$emit('rotate-left')">
            <i class="fa fa-rotate-left"></i>
        </li>
        <li @click.stop="$emit('rotate-right')">
            <i class="fa fa-rotate-right"></i>
        </li>
        <li @click.stop="$emit('flip-x')">
            <i class="fa fa-arrows-h"></i>
        </li>
        <li @click.stop="$emit('flip-y')">
            <i class="fa fa-arrows-v"></i>
        </li>
    </ul>
</template>

<script>
    export default {
        methods: {
            togglePlay() {
                this.$emit('play-pic')
            }
        },
        props: {
            isPlay: {
                required: true,
                type: Boolean
            }
        }
    };
</script>

<style lang="scss" scoped="scoped">
    body, ul, ol, li, p, h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0;
    }
    a {
        color: inherit;
        text-decoration: inherit;
    }
    .buttons-container {
        /*text-align: center;*/
        /*position:relative;*/
        /*z-index: 2000;*/
        /*width: 800px;*/
        /*margin: 50% auto 0 auto;*/

        text-align: center;
        position: fixed;
        z-index: 2000;
        width: 100%;
        bottom: 2%;
        li {
            font-size: 18px;
            padding: 5px;
            box-sizing: border-box;
            width: 40px;
            height: 40px;
            line-height: 32px;
            text-align: center;
            color: #ffffff;
            background-color: #3C3C3C;
            border-radius: 50px;

            display: inline-block;
            margin: 0 10px;
            cursor: pointer;
        }

        .active {
            color: dodgerblue;
        }
    }

</style>
