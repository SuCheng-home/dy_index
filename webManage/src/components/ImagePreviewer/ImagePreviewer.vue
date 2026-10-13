<template>
    <div class="previewer">
        <div class="previewer-text" @click="showPreviewer" v-if="text">
            {{text}}
        </div>
        <div @click="imageClickHandler">
            <div
                    v-show="text.length === 0"
                    v-if="isShowPlate"
                    class="images"
                    :is="tag"
                    v-for="(imageObj, index) in imageArr"
                    :key="index"
                    :src="isImg ? imageObj.src : false"
                    :style="isImg ? {} : { backgroundImage: 'url(' + imageObj.src + ')' }"
            ></div>
            <div v-show="text.length === 0" class="slot-container" ref="slotContainer">
                <slot></slot>
            </div>
            <previewer-dialog
                    ref="previewer"
                    :src="picSrc"
                    :size="picSize"
                    :name="picName"
                    @next-pic="nextPic"
                    @prev-pic="prevPic"
                    @play-pic="playPic"
            ></previewer-dialog>
        </div>

    </div>
</template>

<script>
    import PreviewerDialog from '@/components/ImagePreviewer/PreviewerDialog.vue';

    export default {
        name: 'ImagePreviewer',
        data() {
            return {
                currentIndex: 0,
                sizeArr: [],
                imageArr: []
            }
        },
        computed: {
            isShowPlate() {
                return this.tag !== 'none' && this.tag !== 'richtext';
            },
            picSrc() {
                if (this.imageArr.length !== 0) {
                    return this.imageArr[this.currentIndex].src
                }
                else {
                    return '';
                }

            },
            picSize() {
                if (this.sizeArr.length !== 0) {
                    return this.sizeArr[this.currentIndex];
                } else {
                    return {
                        width: 0,
                        height: 0
                    }
                }
            },
            picName() {
                if (this.imageArr.length !== 0 && this.imageArr[this.currentIndex].name !== undefined) {
                    return this.imageArr[this.currentIndex].name;
                }
                return '';
            },
            isImg() {
                return this.tag === 'img';
            }
        },
        methods: {
            showPreviewer() {
                this.currentIndex = 0;
                this.$refs.previewer.show();
            },
            imageClickHandler(event) {
                let currentIndex = 0;
                if (this.tag === 'richtext' && event.target.tagName.toUpperCase() === 'IMG') {
                    this.imageArr = [];
                    const elCollection = this.$refs.slotContainer.querySelectorAll('img, .image_view');
                    for (let i = 0, length = elCollection.length; i < length; i++) {
                        const el = elCollection[i];
                        if (el === event.target) {
                            currentIndex = i;
                        }
                        if (el.tagName.toUpperCase() === 'IMG') {
                            this.imageArr.push({
                                src: el.src
                            });
                        } else {
                            const backgroundImage = el.style.backgroundImage;
                            this.imageArr.push({
                                src: /^url\((['"]?)(.*)\1\)$/g.exec(backgroundImage)[2]
                            });
                        }
                    }
                    this.currentIndex = currentIndex;
                    this.$refs.previewer.show();
                } else {
                    const target = event.target;
                    let allNodes = null;
                    let isIndexChanged = false;

                    if (target.tagName.toLowerCase() === this.tag.toLowerCase()) {
                        allNodes = target.parentNode.getElementsByClassName('images');
                        isIndexChanged = true;
                    }
                    else if (target.classList.contains(this.viewclass)) {
                        let closest = target.parentNode;
                        while (!closest.classList.contains('slot-container')) {
                            closest = closest.parentNode;
                        }
                        allNodes = closest.getElementsByClassName(this.viewclass);
                        isIndexChanged = true;

                    }
                    if (isIndexChanged) {
                        let index = -1;
                        for (let i = 0; i < allNodes.length; i++) {
                            if (allNodes[i] === target) {
                                index = i;
                            }
                        }
                        this.$refs.previewer.show();
                        this.currentIndex = index;
                    }
                }
            },
            nextPic() {
                if (this.currentIndex < this.imageArr.length - 1) {
                    this.currentIndex++;
                }
            },
            prevPic() {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                }
            },
            playPic() {
                this.currentIndex = (this.currentIndex + 1 + this.imageArr.length) % this.imageArr.length;
            }
        },
        created() {
            if (this.images !== undefined) {
                this.imageArr = this.images;
            }
        },
        watch: {
            images: function(newArr) {
                this.currentIndex = 0;
                this.imageArr = newArr;
            }
        },
        components: {
            PreviewerDialog
        },
        props: {
            images: {
                type: Array,
                required: false
            },
            tag: {
                type: String,
                required: true
            },
            viewclass: {
                type: String,
                required: false
            },
            text: {
                type: String,
                required: false,
                default: ''
            }
        }
    };
</script>

<style scoped="scoped">
    body, ul, ol, li, p, h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0;
    }

    a {
        color: inherit;
        text-decoration: inherit;
    }

    .previewer-text {
        cursor: pointer;
    }

    .images {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>