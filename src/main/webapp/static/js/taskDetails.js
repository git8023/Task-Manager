var TaskDetailsDebug = true;
TaskDetailsDebug && window.console && console.log("taskDetails.js");

$(function() {
	var thisPageFn = new TaskDetailsFn();
	thisPageFn.initEvents();
	thisPageFn.initData();
});

/**
 * @description task_view.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年4月7日 - 下午2:28:55
 */
function TaskDetailsFn() {
	var $thisObj = this;
	var baseCtnr = $(".task_view");

	/** 初始化事件 */
	this.initEvents = function() {
	}

	/** 初始化数据 */
	this.initData = function() {
		taskBackfill();
	}
	
	// 任务回填
	function taskBackfill() {
		var taskId=baseCtnr.find("#taskId").val();
		requestUtil.jsonAjax({
			url : "task/taskDetails.cmd",
			data : {taskId:taskId},
			success : function(rData){
				if (rData.flag) {
					var form=new Form(baseCtnr.find("form"), TaskDetailsDebug);
					form.fillForm({data:rData.data});
				}
				else {warning(rData.message);}
			},
			error : function(){warning();},
		});
	}

	/**
	 * 展示警告
	 * @param msg 警告消息
	 */
	function warning(msg) {$.alert({title:"Warning", content:(msg || "The system is unusual, please try again later.")});}
	
	/** 日志记录 */
	function log(msg) {
		window.console && console.log(msg);
	}

	return this;
}