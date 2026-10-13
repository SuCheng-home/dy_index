export default {
    data() {
        return {
            maxH: '',
            maxW: '',
            cutH: 270,
            cutW: 230
        }
    },
    mounted() {
        this.maxH = document.body.clientHeight - this.cutH;
        this.maxW = document.body.clientWidth - this.cutW;
        window.addEventListener("resize", this.windowResize, false)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.windowResize, false)
    },
    methods: {
        windowResize() {
            this.maxH = document.body.clientHeight - this.cutH;
            this.maxW = document.body.clientWidth - this.cutW;
        }
    }
}