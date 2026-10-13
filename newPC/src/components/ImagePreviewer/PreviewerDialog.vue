<template>
    <div class="image-previewer" v-show="isShow" id="ImagePreviewer">
        <div class="image-previewer__mask"></div>
        <div class="image-previewer__content" @click.stop="hide()">
            <img v-if="isShow" v-show="isTransition" @load="onImageLoad" ref="image" :class="['current-image', 'img--transition']" :style="calcStyle" :src="src" />
        </div>
        <div class="image-previewer__text" v-if="images[currentIndex]">{{images[currentIndex].remark}}</div>
        <div class="thumbnail-container" :style="{width: thumbnailContainerWidth}" ref="thumbnailContainer">
            <div class="thumbnail-container__inner">
                <div @click="choosePicHandler(index)" :class="['thumbnail-item', index == currentIndex ? 'thumbnail-item--current' : '']" v-for="(thumbnailItem, index) in images" :style="{backgroundImage: `url(${thumbnailItem.src})`}">
                </div>
            </div>

        </div>
        <operation-buttons
            :isPlay="isPlay"
            @zoom-in="zoomIn"
            @zoom-out="zoomOut"
            @reset-to-init="resetToInit"
            @rotate-left="rotateLeft"
            @rotate-right="rotateRight"
            @next-pic="nextPic"
            @prev-pic="prevPic"
            @play-pic="playPic"
            @flip-x="flipX"
            @flip-y="flipY"
        ></operation-buttons>
    </div>
</template>

<script>
    import OperationButtons from '@/components/ImagePreviewer/OperationButtons.vue';
    export default {
        data() {
            return {
                initMutiplier: 1,
                multiplier: 1,
                rotateArg: 0,
                isShow: false,
                isFlipX: false,
                isFlipY: false,
                isPlay: false,
                playId: '',

                thumbnailPerPage: 15,
                isTransition: false
            }
        },

        computed: {
            thumbnailContainerWidth() {
                return `${this.thumbnailPerPage * 70 + this.thumbnailPerPage * 6}px`;
            },
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
        watch: {
            currentIndex(currentIndex) {
                console.log('cc', currentIndex)
                this.isTransition = false;
                const pos = Math.max(0, currentIndex - Math.floor(this.thumbnailPerPage / 2));
                console.log('this.$refs.thumbnailContainer', this.$refs.thumbnailContainer);
                this.resetAll();

                setTimeout(() => {
                    this.$refs.thumbnailContainer.scrollLeft = pos * 70 + pos * 6;
                }, 300)
            }
        },
        methods: {
            onImageLoad() {
                console.log('multiplier', multiplier);
                let multiplier = 1;
                let widthRef = 1300, heightRef = 600;
                if(window.innerWidth < 1400) {
                    widthRef = 1200;
                }
                if(window.innerHeight < 800) {
                    heightRef = 400
                }
                if(this.$refs.image.width > widthRef || this.$refs.image.height > heightRef) {
                    const multiplierW = Math.floor(widthRef / this.$refs.image.width * 100) / 100;
                    const multiplierH = Math.floor(heightRef / this.$refs.image.height * 100) / 100;
                    multiplier = Math.min(multiplierW, multiplierH);
                }
                this.initMutiplier = multiplier;
                this.multiplier = multiplier;
                setTimeout(() => {
                    this.isTransition = true;
                }, 100);
            },
            show() {
                this.isShow = true;
                this.isPlay = false;
                const vm = this;
                if(vm.playId !== '') {
                    window.clearInterval(vm.playId);
                    vm.playId = '';
                }
                this.$emit('previewer-dialog-isshow', true);
            },
            hide() {
                this.isShow = false;
                this.$emit('previewer-dialog-isshow', false);
            },
            zoomIn() {
                this.multiplier += 0.5;
            },
            zoomOut() {
                if(this.multiplier > 0.5) {
                    this.multiplier = this.multiplier - 0.5 < 0.5 ? 0.5 : this.multiplier - 0.5;
                }
            },
            resetSize() {
                this.multiplier = 1;
            },
            resetSizeToInit() {
                this.multiplier = this.initMutiplier;
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
            },
            resetToInit() {
                this.resetSizeToInit();
                this.resetRotate();
                this.resetFlip();
            },
            rotateLeft() {
                this.rotateArg --;
            },
            rotateRight() {
                this.rotateArg ++;
            },
            nextPic() {
                this.$emit('next-pic')
            },
            prevPic() {
                this.$emit('prev-pic')
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
                        vm.$emit('play-pic');
                    }, 1000)
                }
            },
            flipX() {
                this.isFlipX = !this.isFlipX;
            },
            flipY() {
                this.isFlipY = !this.isFlipY;
            },
            choosePicHandler(index) {
                this.$emit('choose-pic', index);
            }
        },
        props: {
            src: {
                type: String,
                required: true
            },
            size: {
                type: Object,
                required: true
            },
            name: {
                type: String,
                required: false
            },
            images: {
                type: Array
            },
            currentIndex: {
                type: Number,
                default: 0
            }
        },
        components: {
            OperationButtons
        }
    };
</script>

<style lang="scss">
    .current-image {
        position: absolute;
        left: 50%;
        top: 46%;
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
        overflow: auto;
    }
    .image-previewer__content img {
        width: auto;
        height: auto;
        margin: auto;
    }
    .image-previewer__content img.img--transition {
        transition: all 0.3s;
    }
    .thumbnail-container {
        text-align: center;
        position: fixed;
        z-index: 2000;
        bottom: 9%;
        height: 80px;
        width: 323px;
        left: 50%;
        transform: translateX(-50%);
        overflow-x: auto;
        overflow-y: hidden;
    }
    .thumbnail-container__inner {
        white-space: nowrap;
    }
    .thumbnail-item {
        width: 70px;
        height: 70px;
        background: no-repeat center center / cover;
        margin-left: 3px;
        margin-right: 3px;
        border: 3px solid transparent;
        box-sizing: border-box;
        display: inline-block;
        cursor: pointer;
    }
    .thumbnail-item.thumbnail-item--current {
        border-color: #409EFF;
    }
    #ImagePreviewer {

        ::-webkit-scrollbar-thumb {
            background-color: #409EFF;
        }
    }
    .image-previewer__text {
        text-align: center;
        color: #fff;
        z-index: 10001;
        position: absolute;
        top: 50px;
        width: 100%;
    }
</style>
