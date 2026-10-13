export default {
    data() {
        return {
            cutH: 90,
            comHeader:200,
            cutH2:168,
            innerBodyTitle:97,
            innerBodyTitle2:188,
            mainHeight:'',
            maxH:'',//无下划线
            innerBodyH:'',
            innerBodyH2:''//有下划线
        }
    },
    mounted() {
        this.mainHeight = window.innerHeight - this.comHeader;
        this.maxH=window.innerHeight-this.cutH2-this.comHeader;//常规的表格（体质健康数据汇总那种）
        this.innerBodyH=window.innerHeight-this.innerBodyTitle-this.comHeader;
        this.innerBodyH2=window.innerHeight-this.innerBodyTitle2-this.comHeader;//比常规的多一根下划线（例如设置荣誉级别设置）
        window.addEventListener("resize", this.windowResize, false);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.windowResize, false);
    },
    methods: {
        windowResize() {
            this.mainHeight = window.innerHeight - this.comHeader;
            this.maxH=window.innerHeight-this.cutH2-this.comHeader;
            this.innerBodyH=window.innerHeight-this.innerBodyTitle-this.comHeader;
            this.innerBodyH2=window.innerHeight-this.innerBodyTitle2-this.comHeader;
        }
    }
}
