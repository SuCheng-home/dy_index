<template>
    <div>
        <div class="page-modal" style="opacity: 1;display: none;">
            <div class="result-display buff" style="position: relative; top: -20px; ">
                <img class="light"
                     src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/light.png">
                <div>
                    <div class="photo"
                         style="background-image: url(https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_default_head.jpg);"></div>
                </div>
                <div class="banner-container">
                    <span class="display-banner">{{scoreDisplayInfo.studentName}}</span>
                </div>
                <div class="hint-container">
                    <div class="hint-inner-container">
                        <span class="desc" style="color: rgb(255, 255, 255);">{{scoreDisplayInfo.scoreName}}</span><span
                        class="score buff" v-show="scoreDisplayInfo.scoreNum">+{{scoreDisplayInfo.scoreNum}}</span>
                    </div>
                </div>
                <img class="result-background"
                     src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/buff-bg.png">
            </div>
            <div class="result-display debuff" style="position: relative; top: -20px; ">
                <div>
                    <div class="photo"
                         style="background-image: url(https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_default_head.jpg);"></div>
                </div>
                <div class="banner-container">
                    <span class="display-banner">{{scoreDisplayInfo.studentName}}</span>
                </div>
                <div class="hint-container">
                    <div class="hint-inner-container">
                        <span class="desc" style="color: rgb(255, 255, 255);">{{scoreDisplayInfo.scoreName}}</span><span
                        class="score debuff" v-show="scoreDisplayInfo.scoreNum">-{{scoreDisplayInfo.scoreNum}}</span>
                    </div>
                </div>
                <img class="result-background"
                     src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/penalty-bg.png">
            </div>

        </div>
        <audio src="https://cdnfile-10043692.file.myqcloud.com/admin/vedio/success.mp3" class="buff"></audio>
        <audio src="https://cdnfile-10043692.file.myqcloud.com/admin/vedio/failure.mp3" class="debuff"></audio>
    </div>

</template>

<script>
    import $ from 'jquery';
    export default {
        name: "ScoreDisplay",
        data() {
            return {
                scoreDisplayInfo: {
                    studentName: '',
                    scoreName: '',
                    scoreNum: '',
                    type: 0 // 0 +  1 -
                }
            }
        },
        methods: {
            displayScore(args) {
                this.scoreDisplayInfo = args;
                this.resultShow(args.type == 0 ? '.buff' : '.debuff');
            },
            dialogClose() {
                var $modal = $('.page-modal'),
                    $modalDialog = $('.page-modal__dialog');
                $modalDialog.animate({
                    top: '-20px',
                    opacity: 0
                }, 300, function () {
                    $modalDialog.hide();
                });

            },
            maskClose() {
                var $modal = $('.page-modal'),
                    $modalDialog = $('.page-modal__dialog');
                $modal.animate({
                    opacity: 1
                }, 300, function () {
                    $modal.hide();
                });
            },

            dialogOpen() {
                var $modal = $('.page-modal'),
                    $modalDialog = $('.page-modal__dialog');
                $modal.show();
                $modalDialog.show().animate({
                    top: 0,
                    opacity: 1
                }, 300);
            },

            resultShow(typeClass) {
                var $modal = $('.page-modal'),
                    $resultDisplay = $('.result-display'),
                    $resultAudo = $('audio');
                $modal.show();
                $resultDisplay.filter(typeClass).show().animate({
                    top: 0,
                    opacity: 1
                }, 300);
                $resultAudo.filter(typeClass)[0].play();
                setTimeout(() => {
                    $resultDisplay.filter(typeClass).show().animate({
                        top: '-20px',
                        opacity: 0
                    }, 300, () => {
                        $resultDisplay.hide();
                        this.maskClose();
                    })
                }, 1000);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @keyframes rotateAnim {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    audio {
        position: absolute;
        left: -10000px;
    }
    .page-modal {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: rgba(55, 55, 55, .6);
        z-index: 900;
    }

    .result-display {
        width: 675px;
        margin: 120px auto 0 auto;
        text-align: center;
        height: 400px;
        position: relative;
        display: none;
    }

    .result-display .photo {
        position: relative;
        display: inline-block;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        z-index: 1100;
        width: 180px;
        height: 180px;
        top: -20px;
        border-radius: 50%;
    }

    .banner-container {
        position: relative;
        z-index: 1300;
        display: inline-block;
        font-size: 36px;
        line-height: 72px;
        color: #fff;
        top: -53px;
    }

    .display-banner {
        display: inline-block;
        height: 115px;
    }

    .buff .display-banner {
        background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/banner.png) no-repeat 0 0;
        width: 675px;
        position: relative;
        top: -70px;
        padding-top: 54px;
    }

    .debuff .display-banner {
        background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/banner-penalty.png) no-repeat 0 0;
        width: 675px;
        position: relative;
        top: -70px;
        padding-top: 54px;
    }

    img.light {
        position: absolute;
        z-index: 1000;
        left: 94px;
        top: -80px;
        width: 70%;
        animation: rotateAnim 4s linear infinite;
        -webkit-animation: rotateAnim 4s linear infinite;
        -moz-animation: rotateAnim 4s linear infinite;
    }

    .hint-container {
        position: absolute;
        text-align: center;
        background: -webkit-linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0));
        width: 100%;
        top: 135px;
        height: 91px;
        line-height: 130px;
        z-index: 200;
    }

    .hint-inner-container {
        font-size: 26px;
        color: #fff;
    }

    .result-background {
        position: absolute;
        left: 228px;
        top: -40px;
        width: 230px;
        z-index: 1200;
    }

    .hint-inner-container span.score {
        border: 3px solid #fff;
        padding: 0 5px;
        border-radius: 30px;
        font-size: 18px;
        margin-left: 5px;
    }

    .hint-inner-container span.buff {
        background-color: #0099e8;
    }

    .hint-inner-container span.debuff {
        background-color: #FF3B3B;
    }
</style>
