export default {
    data() {
        return {
            maxH: '',
            maxW: '',
            cutH: 270,
            cutW: 230,
            contentCut:177,
            contentMax:'',
            columnMax:'',
            addServiceHeight:''
        }
    },
    mounted() {
        this.addServiceHeight=document.body.clientHeight-this.contentCut-98;
        this.contentMax=document.body.clientHeight-this.contentCut;
        this.columnMax=document.body.clientHeight-this.contentCut-30;
        this.maxH = document.body.clientHeight - this.cutH;
        this.maxW = document.body.clientWidth - this.cutW;
        window.addEventListener("resize", this.windowResize, false)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.windowResize, false)
    },
    methods: {
        windowResize() {
            this.addServiceHeight=document.body.clientHeight-this.contentCut-98;
            this.contentMax=document.body.clientHeight-this.contentCut;
            this.columnMax=document.body.clientHeight-this.contentCut-30;
            this.maxH = document.body.clientHeight - this.cutH;
            this.maxW = document.body.clientWidth - this.cutW;
        }
    }
}