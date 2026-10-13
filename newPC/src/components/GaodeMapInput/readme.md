## GaodeMapInput 高德地图地址输入框

### 引入 高德 api
``` html
<script type="text/javascript">
window._AMapSecurityConfig = {
    securityJsCode:"fbdf8704c1986d9a5c878b14db1dbc98",
}
</script>
<script src="https://webapi.amap.com/loader.js"></script>
```

### 组件式 引用
``` vue
<template>
    <gaode-map-input v-model="addressDesc"
        @change="handleAddressChange">
    </gaode-map-input>
</template>
<script>
import GaodeMapInput from '@/components/GaodeMapInput'
export default {
    components: {
        GaodeMapInput
    },
    data() {
        return {
            addressDesc: ''
        }
    },
    methods: {
        handleAddressChange(title, position) {
            // 经纬度
            const [lng, lat] = position
            console.log(title, lng, lat)
        }
    }
}
</script>
```

### 工具方法 引用
``` js
import { loadAMap, computedDistance, getLocalPosition } from '@/components/GaodeMapInput/utils'
```

#### 方法
| 名称 | 描述 | 参数 | 返回值 |
| - | - | - | - |
| loadAMap | 初始化加载 高德 实例 | - | `AMap` 实例对象 |
| getLocalPosition | 获取浏览器定位的经纬度（pc会存在兼容问题） | target | Promise |
| computedDistance | 通过经纬度计算两点的距离 | p1, p2, target | Number 单位：米 |

#### 参数
| 名称 | 描述 | 必传 |
| - | - | - |
| target | `AMap` 实例对象。也可以通过 `call` 将 `this` 指定 `AMap` | false |
| p1 | 经纬度数组 [经度，纬度] | true |
| p2 | 经纬度数组 [经度，纬度] | true |
