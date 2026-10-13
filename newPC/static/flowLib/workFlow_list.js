//删除工作流程
function delWorkFlowById(id) {
	wxcepConfirm("您确认删除此流程吗?", function() {
		$.ajax({
			type : "POST",
			url : cepPath + "/workFlow/delWorkFlowById?workFlowId=" + id,
			error : function() {
				wxcepAlert("服务器异常！");
			},

			success : function(resultData) {
				if (resultData.result) {
					wxcepAlert("删除成功！");
					window.location.href = cepPath+ "/workFlow/getWorkFlowList";
				} else {
					wxcepAlert(resultData.msg);
				}
			}
		});
	});

}