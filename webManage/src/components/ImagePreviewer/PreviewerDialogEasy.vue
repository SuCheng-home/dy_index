<template>
    <div class="image-previewer" v-show="isShow">
        <div class="image-previewer__mask"></div>
        <div class="image-previewer__content" @click.stop="isShow = false">
            <img class="current-image" :style="`backgroundImage:url(${src})`"/>
        </div>
        <!-- <operation-buttons
            :isPlay="isPlay"
            @zoom-in="zoomIn"
            @zoom-out="zoomOut"
            @reset-size="resetSize"
            @rotate-left="rotateLeft"
            @rotate-right="rotateRight"
            @reset-rotate="resetRotate"
            
            @flip-x="flipX"
            @flip-y="flipY"
        ></operation-buttons> -->
    </div>
</template>

<script>
    //import OperationButtons from '@/components/ImagePreviewer/OperationButtons.vue';
    export default {
        data() {
            return {
                multiplier: 1,
                rotateArg: 0,
                isShow: false,
                isFlipX: false,
                isFlipY: false,
                isPlay: false,
                playId: ''
            }
        },

        computed: {
            calcStyle() {
                const scaleX = this.multiplier * (this.isFlipX ? -1 : 1),
                    scaleY = this.multiplier * (this.isFlipY ? -1 : 1);
                const transform = [];
                transform.push(
                    'translate(-50%, -50%)',
                    `rotate(${ this.rotateArg * 90 }deg)`,
                    `scaleX(${ scaleX })`,
                    `scaleY(${ scaleY })`
                );
                return {
                    transform: transform.join(' ')
                }
            }
        },
        methods: {
            show() {
                this.resetAll();
                this.isShow = true;
                this.isPlay = false;
                const vm = this;
                if(vm.playId !== '') {
                    window.clearInterval(vm.playId);
                    vm.playId = '';
                }
            },
            zoomIn() {
                this.multiplier += 0.5;
            },
            zoomOut() {
                if(this.multiplier > 0.5) {
                    this.multiplier -= 0.5;
                }
            },
            resetSize() {
                this.multiplier = 1;
            },
            resetRotate() {
                this.rotateArg = 0;
            },
            resetFlip() {
                this.isFlipX = false;
                this.isFlipY = false;
            },
            resetAll() {
                this.resetSize();
                this.resetRotate();
                this.resetFlip();
                this.isFlipX = false;
                this.isFlipY = false;

            },
            rotateLeft() {
                this.rotateArg --;
            },
            rotateRight() {
                this.rotateArg ++;
            },
            nextPic() {
                this.resetAll();
               // this.$emit('next-pic')
            },
            prevPic() {
                this.resetAll();
               // this.$emit('prev-pic')
            },
            playPic() {
                const vm = this;
                if(vm.playId !== '') {
                    window.clearInterval(vm.playId);
                    this.isPlay = false;
                    vm.playId = '';
                } else {
                    this.isPlay = true;
                    vm.playId = window.setInterval(function() {
                        vm.resetAll();
                       // vm.$emit('play-pic');
                    }, 1000)
                }
            },
            flipX() {
                this.isFlipX = !this.isFlipX;
            },
            flipY() {
                this.isFlipY = !this.isFlipY;
            }
        },
        props: {
            src: {
                type: String,
                required: true
            },
            size: {
                type: Object,
                required: false
            },
            name: {
                type: String,
                required: false
            }
        },
        components: {
            //OperationButtons
        }
    };
</script>

<style>
    .current-image {
        position: absolute;
        left:0;
        top:0;
        right:0;
        bottom:0;
        width:100%;
        height:100%;
        background-size: 100% 100%;
    }
    .image-previewer {
        position: fixed;
        z-index: 10000;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .image-previewer__mask {
        background-color: rgba(0, 0, 0, 0.4);
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .image-previewer__content {
        position: absolute;
        z-index: 1000;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        text-align: center;
        line-height: 75;
    }
    .image-previewer__content img {
        
        margin: auto;
        transition: all 0.3s;
    }
</style>