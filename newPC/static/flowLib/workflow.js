var initFunc4 = function () {
    var restoreData = {};
    if(window.workFlowJson) {
        restoreData = JSON.parse(workFlowJson)
    }
    $('#myflow').myflow(
        {
            basePath: "",
            allowStateMutiLine: true,
            restore: restoreData,
            tools: {
                save: function (data) {
                    window.localStorage.setItem("data", data)
                },
                publish: function (data) {
                },
                addPath: function (id, data) {
                },
                addRect: function (id, data) {
                    //console.log("添加状态",id,eval("("+data+")"));
                },
                clickPath: function (id) {
                    //console.log("点击线",id)
                },
                clickRect: function (id, data) {
                    //console.log("点击状态",id,eval("("+data+")"));
                },
                deletePath: function (id) {
                    //console.log("删除线",id);
                },
                deleteRect: function (id, data) {
                    //console.log("删除状态",id,eval("("+data+")"));
                },
                revoke: function (id) {

                }
            }
        });

}