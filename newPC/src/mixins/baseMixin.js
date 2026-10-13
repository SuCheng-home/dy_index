import FileSaver from 'file-saver';
import XLSX from 'xlsx';

export default {
    data() {
        return {
            basePath: global.BasePath,
            pagination: {
                pageSize: 20,
                pages: 0,
                total: 0,
                pageNo: 1,
            }
        }
    },
    filters: {
        timeSuffixFilter(datetime) {
            return datetime && datetime.includes('.') ? datetime.slice(0, datetime.indexOf('.')) : datetime;
        }
    },
    activated() {
        if (this.$refs.table) {
            this.$nextTick(() => {
                console.log('doLayout')
                this.$refs.table.doLayout(); //解决表格错位
            });
        }
    },
    // beforeRouteLeave(to, from, next) {
    //     console.log('to', to)
    //     if(to.meta.clearCache) {
    //         console.log('clearCache', this)
    //     }
    //     next();
    // },
    methods: {
        jumpToPage(path, query = {}, isReplace = false, isRefresh = false, refreshTimeout = 300) {
            if (isReplace) {
                this.$router.replace({
                    path,
                    query
                })
            } else {
                this.$router.push({
                    path,
                    query
                })
            }
            if (isRefresh) {
                setTimeout(() => {
                    window.location.reload();
                }, refreshTimeout);
            }
        },
        changeSize(pageSize) {
            this.pagination.pageNo = 1;
            this.pagination.pageSize = pageSize;
        },
        changeCurrent(pageNo) {
            this.pagination.pageNo = pageNo;
        },
        checkIndexPermission(permissionList, permissionPath) {
            return permissionList.indexOf(permissionPath) !== -1;
        },
        exportExcel(id, title) {
            let xlsxParam = {
                raw: true
            }; //转换成excel时，使用原始的格式
            /* generate workbook object from table */
            // const wb = XLSX.utils.table_to_book(document.querySelector(id));
            const wb = XLSX.utils.table_to_book(document.querySelector(id), xlsxParam);
            /* get binary string as output */
            const wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'array'
            });
            try {
                FileSaver.saveAs(new Blob([wbout], {
                    type: 'application/octet-stream'
                }), title)
            } catch (e) {
                if (typeof console !== 'undefined') console.log(e, wbout)
            }
            return wbout;
        },
        // 获得距现在天数的日期
        getDate(n) {
            const data = new Date();
            data.setTime(data.getTime() + 3600 * 1000 * 24 * n);
            let localDateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
            return localDateStr;
        },
        getStrDate(data) {
            let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
            return strDate;
        },
        fillZero(n) {
            return n < 10 ? '0' + n : n;
        },
    }
}
