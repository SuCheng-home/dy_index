<template>
    <div class='gaode-map-input'>
        <el-autocomplete
            style="width: 100%;"
            v-model="keyword"
            :fetch-suggestions="debouncedFetch"
            placeholder="请输入内容"
            @select="handleSelect"
            >
            <template #default="{item}">
                <div>
                    {{ item.name }}
                </div>
            </template>
        </el-autocomplete>
        <div id="map_container"></div>
    </div>
</template>

<script>
import { loadAMap } from './utils'
import _ from 'lodash';
export default {
    name: 'gaode-map-input',
    props: {
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            keyword: '',
            AMap: null,
            mapInstance: null,
            placeSearcher: null,
            geocoder: null,
            marker: null
        }
    },
    async mounted() {
        this.AMap = await loadAMap()
        this.mapInstance = new this.AMap.Map('map_container', {
            zoom: 11,
        });
        this.mapInstance.on('click', this.handleMapClick.bind(this))
        this.AMap.plugin(['AMap.PlaceSearch','AMap.AutoComplete', 'AMap.Geocoder'], () => {
            this.placeSearcher = new AMap.PlaceSearch({
                // map: this.mapInstance // 不关联地图实例的搜索
            });
            this.geocoder = new AMap.Geocoder({
                city: '全国' // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            })

            // if (this.value.length) {
            //     this.getAddressByPosition(this.value)
            // }
        });
    },
    methods: {
        getPosition() {
            return this.marker ? this.marker._position : []
        },
        // 地图点击
        handleMapClick(e) {
            const { lng, lat } = e.lnglat
            this.getAddressByPosition([lng, lat])
        },
        // 根据经纬度获取地点信息
        getAddressByPosition(position) {
            this.geocoder.getAddress(position, (status, result) => {
                if (status === 'complete') {
                    const title = result.regeocode.formattedAddress
                    this.createMarker(position, title)
                }
            })
        },
        // 地址搜索
        handleQuerySearch(str, cb) {
            try {
                this.placeSearcher.search(str, (e, res) => {
                    if (e === 'error' || !res.info || res.info !== 'OK') {
                        cb && cb([])
                    } else {
                        cb && cb(res.poiList.pois)
                        const address = res.poiList.pois.find(i => i.name === this.value)
                        address && this.handleSelect(address)
                    }
                })

            } catch (err) {
                console.log(err)
            }
        },
        // 地址选择
        handleSelect(item) {
            const lnglat = [
                item.location.lng,
                item.location.lat
            ]
            this.createMarker(lnglat, item.name)
        },
        // 创建地图标记点
        createMarker(position, title) {
            this.keyword = title
            if (this.marker) {
                this.marker.setMap(null);
                this.marker = null;
            }
            this.marker = new this.AMap.Marker({
                // icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                position,
                offset: new AMap.Pixel(0, 0)
            });
            this.marker.setLabel({
                direction: 'bottom',
                offset: new AMap.Pixel(0, 10),
                content: title
            })
            this.marker.setMap(this.mapInstance);
            this.$emit('input', position)
            this.$emit('change', position)
            if (this.mapInstance.getZoom() < 14) {
                // 自适应中心和层级
                this.mapInstance.setFitView()
            } else {
                this.mapInstance.setCenter(position)
            }
        },
        getLocationText() {
            return this.keyword;
        },
        refresh() {
            if (this.value.length) {
                this.getAddressByPosition(this.value)
            }
        }
    },
     created() {
    this.debouncedFetch = _.debounce(this.handleQuerySearch, 2000); // 500 毫秒后调用 fetchSuggestions
  }
}
</script>

<style lang='scss' scoped>
#map_container {
    height: 400px;
    margin-top: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
    /deep/ .amap-marker-label {
        border-color: #999;
    }
}
</style>
