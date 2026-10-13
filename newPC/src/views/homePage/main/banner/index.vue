<template>
    <div class="home-page-main-banner">
        <div :class="['info-container', `info-container--${dateInfo.dayPart}`]">
            <div class="student-info__info">
                <div class="student-info__main-info">
          <span class="student-name"
          >{{ userInfo.name }}老师，{{ dayPartText }}好</span
          >
                </div>
                <!-- <div class="student-info__sub-info">
                  <i class="address-icon icon"></i>
                  <span>{{ postname }}</span>
                </div> -->
            </div>
            <div class="student-info__date-info">
                {{ dateInfo.year }}-{{ dateInfo.month }}-{{
                dateInfo.date
                }}&nbsp;&nbsp;{{ dateInfo.day }}&nbsp;&nbsp;{{ dateInfo.hour }}:{{
                dateInfo.minute
                }}
                <i :class="['weather-icon', dateInfo.weatherIcon]"></i
                >{{ dateInfo.weather }}&nbsp;&nbsp;{{ dateInfo.temp }}
            </div>
        </div>
    </div>
</template>

<script>
    /* utils */
    import {mapGetters} from "vuex";
    import moment from "moment";

    /* components */

    /* api */
    import {getWeatherByCityNm, findDicsByCode} from "@/api/homePage/main/banner/index";

    function getWeatherByCityNmIcon(weatherStr) {
        var icon = "";
        const weatherIcon = [
            {
                name: "晴",
                icon: "sunny",
            },
            {
                name: "大雨",
                icon: "rainy",
            },
            {
                name: "中雨",
                icon: "rainy",
            },
            {
                name: "小雨",
                icon: "rainy",
            },
            {
                name: "暴雨",
                icon: "rainy",
            },
            {
                name: "暴雪",
                icon: "sowny",
            },
            {
                name: "大雪",
                icon: "sowny",
            },
            {
                name: "中雪",
                icon: "sowny",
            },
            {
                name: "小雪",
                icon: "sowny",
            },
            {
                name: "阴",
                icon: "cloudy",
            },
            {
                name: "阴转多云",
                icon: "cloudy",
            },
            {
                name: "多云",
                icon: "cloudy",
            },
            {
                name: "雷阵雨",
                icon: "rainy",
            },
        ];
        weatherIcon.forEach(function (iconItem) {
            if (weatherStr.indexOf(iconItem.name) !== -1) {
                icon = iconItem.icon;
            }
        });
        return icon;
    }

    export default {
        name: "homePageMainBanner",
        mixins: [],
        components: {},
        computed: {
            ...mapGetters([
                "studentName",
                "schoolName",
                "learnYear",
                "departName",
                "avatar",
                "classId",
                "schoolId",
                "studentId",
                "fromExternal",
                "indexPermission",
                "userInfo",
                "schoolInfo",
            ]),
            dayPartText() {
                return {
                    "": "",
                    morning: "上午",
                    noon: "中午",
                    afternoon: "下午",
                    night: "晚上",
                }[this.dateInfo.dayPart];
            },
        },
        filters: {},
        data() {
            return {
                postname: "",
                dateInfo: {
                    year: "--",
                    month: "--",
                    date: "--",
                    day: "--",
                    hour: "--",
                    minute: "--",
                    dayPart: "",
                    temp: "--",
                    weather: "",
                    weatherIcon: "",
                },
            };
        },
        created() {
            const currentDate = moment();
            const weekdayMapping = [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
            ];
            [
                this.dateInfo.year,
                this.dateInfo.month,
                this.dateInfo.date,
                this.dateInfo.day,
            ] = [
                currentDate.format("YYYY"),
                currentDate.format("MM"),
                currentDate.format("DD"),
                weekdayMapping[currentDate.format("e")],
            ];
            this.getWeatherByCityNm();
            this.findDicsByCode();
            this.calcTime();
            window.setInterval(this.calcTime, 30 * 1000);
        },
        methods: {
            calcTime() {
                const currentTime = moment().format("HH:mm");
                [this.dateInfo.hour, this.dateInfo.minute] = currentTime.split(":");
                if (this.dateInfo.hour >= 5 && this.dateInfo.hour < 11) {
                    this.dateInfo.dayPart = "morning";
                } else if (this.dateInfo.hour >= 11 && this.dateInfo.hour < 13) {
                    this.dateInfo.dayPart = "noon";
                } else if (this.dateInfo.hour >= 13 && this.dateInfo.hour <= 18) {
                    this.dateInfo.dayPart = "afternoon";
                } else {
                    this.dateInfo.dayPart = "night";
                }
                this.dateInfo.weatherIcon = `${getWeatherByCityNmIcon(this.dateInfo.weather)}-${
                    this.dateInfo.dayPart
                    }`;
            },
            // 天气
            getWeatherByCityNm() {
                getWeatherByCityNm({
                    cityNm: this.schoolInfo.orgAreaName ? this.schoolInfo.orgAreaName.split(' ')[1] : '南京',
                })
                    .then(res => res.data)
                    .then((data) => {
                        if (data.result) {
                            var wdata = data.result;
                            this.dateInfo.weather = wdata.weather;
                            this.dateInfo.temp = wdata.temperature;
                            this.dateInfo.weatherIcon = `${getWeatherByCityNmIcon(wdata.weather)}-${
                                this.dateInfo.dayPart
                                }`;
                        }
                    });
            },
            findDicsByCode() {
                findDicsByCode({
                    dicCode: "postcode",
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        const postObj = data.find(
                            ({code}) => code == this.schoolInfo.postcode
                        );
                        this.postname = postObj ? postObj.value : "";
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
        },
    };
</script>
<style lang="scss" scoped>
    @import "../../../../styles/mixin";

    .home-page-main-banner {
        max-width: 1246px;
        height: 123px;

        .student-info__info {
            @include middleIB;
            margin: 20px 0 0 64px;
            font-size: 16px;

            .student-name {
                font-size: 30px;
            }

            .student-info__sub-info {
                font-size: 12px;
                margin-top: 10px;

                span:first-child {
                    margin-right: 0.1rem;
                }
            }
        }

        .student-info__date-info {
            float: right;
            text-align: center;
            margin: 12px 12px 0 0;
            line-height: 1em;
            font-size: 12px;

            .date-info__year-month {
                font-size: 0.2rem;
                padding: 0.02rem 0.04rem;
                background-color: #1992fb;
                color: #fff;
            }

            .date-info__day {
                font-size: 0.16rem;
                margin-top: 0.1rem;
                color: #333;
            }
        }

        .address-icon {
            width: 12px;
            height: 16px;
            @include middleIB;
            position: relative;
            top: -2px;
            @include cover-bg;
            margin-right: 8px;
        }

        .info-container {
            background-color: #fff;
            border-radius: 5px;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background: no-repeat cover center / 100% 100%;

            &.info-container--morning {
                background-image: url(../../../../assets/images/homePage/morning-header.png);
                color: #67c23a;

                .address-icon {
                    background-image: url(../../../../assets/images/homePage/address-icon--morning.png);
                }
            }

            &.info-container--noon {
                background-image: url(../../../../assets/images/homePage/noon-header.png);
                color: #f77e26;

                .address-icon {
                    background-image: url(../../../../assets/images/homePage/address-icon--noon.png);
                }
            }

            &.info-container--afternoon {
                background-image: url(../../../../assets/images/homePage/afternoon-header.png);
                color: #7f91f5;

                .address-icon {
                    background-image: url(../../../../assets/images/homePage/address-icon--afternoon.png);
                }
            }

            &.info-container--night {
                background-image: url(../../../../assets/images/homePage/night-header.png);
                color: #427b8f;

                .address-icon {
                    background-image: url(../../../../assets/images/homePage/address-icon--night.png);
                }
            }
        }

        .weather-icon {
            @include wh(20px, 20px);
            @include middleIB;
            @include cover-bg;
            margin: 0 10px 0 28px;
            position: relative;
            top: -3px;

            &.cloudy-morning {
                background-image: url(../../../../assets/images/homePage/weather_icons/cloudy-morning.png);
            }

            &.cloudy-noon {
                background-image: url(../../../../assets/images/homePage/weather_icons/cloudy-noon.png);
            }

            &.cloudy-afternoon {
                background-image: url(../../../../assets/images/homePage/weather_icons/cloudy-afternoon.png);
            }

            &.cloudy-night {
                background-image: url(../../../../assets/images/homePage/weather_icons/cloudy-night.png);
            }

            &.sunny-morning {
                background-image: url(../../../../assets/images/homePage/weather_icons/sunny-morning.png);
            }

            &.sunny-noon {
                background-image: url(../../../../assets/images/homePage/weather_icons/sunny-noon.png);
            }

            &.sunny-afternoon {
                background-image: url(../../../../assets/images/homePage/weather_icons/sunny-afternoon.png);
            }

            &.sunny-night {
                background-image: url(../../../../assets/images/homePage/weather_icons/sunny-night.png);
            }

            &.snowy-morning {
                background-image: url(../../../../assets/images/homePage/weather_icons/snowy-morning.png);
            }

            &.snowy-noon {
                background-image: url(../../../../assets/images/homePage/weather_icons/snowy-noon.png);
            }

            &.snowy-afternoon {
                background-image: url(../../../../assets/images/homePage/weather_icons/snowy-afternoon.png);
            }

            &.snowy-night {
                background-image: url(../../../../assets/images/homePage/weather_icons/snowy-night.png);
            }

            &.mist-morning {
                background-image: url(../../../../assets/images/homePage/weather_icons/mist-morning.png);
            }

            &.mist-noon {
                background-image: url(../../../../assets/images/homePage/weather_icons/mist-noon.png);
            }

            &.mist-afternoon {
                background-image: url(../../../../assets/images/homePage/weather_icons/mist-afternoon.png);
            }

            &.mist-night {
                background-image: url(../../../../assets/images/homePage/weather_icons/mist-night.png);
            }

            &.rainy-morning {
                background-image: url(../../../../assets/images/homePage/weather_icons/rainy-morning.png);
            }

            &.rainy-noon {
                background-image: url(../../../../assets/images/homePage/weather_icons/rainy-noon.png);
            }

            &.rainy-afternoon {
                background-image: url(../../../../assets/images/homePage/weather_icons/rainy-afternoon.png);
            }

            &.rainy-night {
                background-image: url(../../../../assets/images/homePage/weather_icons/rainy-night.png);
            }
        }
    }
</style>
