var AssignTaskDebug = true;
AssignTaskDebug && window.console && console.log("assignTask.js");

$(function() {
	var thisPageFn = new AssignTaskFn();
	thisPageFn.initEvents();
	thisPageFn.initData();
});

/**
 * @description assign_task.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年4月20日-下午11:41:41
 */
function AssignTaskFn() {
	var CURRENT_USER = "current";
	var DISABLED_MENU = "disabled";
	var NO_RECORD_FOUND = "no_record_found";

	var $thisObj = this;
	var baseCtnr = $(".assign_task_ctnr");

	/** 初始化事件 */
	this.initEvents = function() {
		baseCtnr.undelegate(".users_ctnr .user", "click").delegate(".users_ctnr .user", "click", showUserTasksEvent);
		baseCtnr.undelegate(".tasks_ctnr .task .chooser", "click").delegate(".tasks_ctnr .task .chooser", "click", chooseTaskEvent);
		baseCtnr.find(".menu.assign_task").click(assignTaskEvent);
		baseCtnr.find(".menu.clear_tasts").click(clearTaskEvent);
		baseCtnr.find(".fn.delete_tasks").click(unassignTaskEvent);
	}
	
	// 解除指定用户绑定的所有任务事件
	function clearTaskEvent() {
		var $this = $(this);
		if ($this.hasClass("disabled"))return;
		$this.addClass("disabled");
		$("[type='checkbox']").each(function(i,chooser){if (!$(chooser).is(":checked"))$(chooser).click();});
		unassignTaskEvent();
	}

	// 解除选中的任务事件
	function unassignTaskEvent() {
		var $this = $(this);
		if ($this.hasClass("disabled"))return;
		$this.addClass("disabled");
		
		var performerKey=getSpecifyUserId();
		var userTaskIds=getChoosedTaskIds();
		if (0 == userTaskIds.length)return;
		
		$.confirm({title:"Warning", content:"Delete tasks at the same time the attachment, if there is.<br/>Are you sure continue?", confirm:function(){
			doUnassignTasks(userTaskIds, performerKey);
		}});
	}
	
	// 执行解除委派
	function doUnassignTasks(userTaskIds, performerKey) {
		log("Unassigned tasks["+userTaskIds+"] for user["+performerKey+"]");
		requestUtil.jsonAjax({
			url : "task/unassignTasks.cmd",
			data : {userTaskIds:userTaskIds, performerKey:performerKey},
			success : function(rData){
				if (!rData.flag) {warning(rData.message); return;}
				refreshTasks();
			},
			error : function(){warning();}
		});
	}
	
	// 选中任务事件
	function chooseTaskEvent() {
		var choosed=getChoosedTasks();
		if (0 < choosed.size()) {baseCtnr.find(".fn.delete_tasks").removeClass("disabled");} 
		else {baseCtnr.find(".fn.delete_tasks").addClass("disabled");}
	}
	
	// 获取以选中的任务
	function getChoosedTasks() {return baseCtnr.find(".tasks_ctnr .task .chooser:checked");}

	// 获取选中的已分配任务ID列表
	function getChoosedTaskIds() {
		var taskIds=[];
		var tasks=getChoosedTasks();
		tasks.each(function(i,task){taskIds.push($(task).attr("userTaskId"));});
		return taskIds;
	}
	
	// 把当前任务分配给指定用户
	function assignTaskEvent() {
		var $this = $(this);
		if ($this.hasClass(DISABLED_MENU))return;
		var taskId = getTaskId();
		var performerKey = getSpecifyUserId();
		log("Assign task[" + taskId + "] to user[" + performerKey + "]");
		requestUtil.jsonAjax({
			url : "task/assignToUser.cmd",
			data : {taskId:taskId, performerKey:performerKey},
			success : function(rData){
				if (!rData.flag) {warning(rData.message); return;}
				refreshTasks();
			},
			error : function(){warning();}
		})
	}

	// 刷新任务列表
	function refreshTasks(){getSpecifyUser().click();}
	// 获取指定的用户ID
	function getSpecifyUserId() {return getSpecifyUser().attr("userId");}
	// 获取指定的用户
	function getSpecifyUser() {return baseCtnr.find(".user.current");}
	
	// 获取当前任务ID
	function getTaskId(){return baseCtnr.find("#taskId").val();}
	
	// 展示当前用户关联的任务列表事件
	function showUserTasksEvent() {
		var $this=$(this), userId=$this.attr("userId").trim();
		$this.parent().find(".current").removeClass(CURRENT_USER);
		$this.addClass(CURRENT_USER);
		showUserTasks(userId);
		// 启用管理菜单
		disabledManageBtns();
	}
	
	// 启用任务管理菜单
	function disabledManageBtns() {baseCtnr.find(".list_ctnr .menu").removeClass(DISABLED_MENU);}
	
	// 禁用任务管理菜单
	function enabledManageBtns() {baseCtnr.find(".list_ctnr .menu").addClass(DISABLED_MENU);}
	
	// 展示用户关联的任务列表
	function showUserTasks(userId) {
		requestUtil.jsonAjax({
			url : "task/taskListByUser.cmd",
			data : {userId:userId},
			success : function(rData){
				if(!rData.flag){warning(rData.message); return;}

				var userTasks = rData.data;
				var tasksCtnr = baseCtnr.find(".tasks_ctnr ul").html("");
				if(!(userTasks instanceof Array) || 0==userTasks.length) {
					$("<li/>",{text:"No Record Found"}).addClass(NO_RECORD_FOUND).appendTo(tasksCtnr);
					return;
				}
				
				userTasks.each(function(userTask){
					var task = userTask["task"];
					var taskTag=$("<li/>").addClass("task").appendTo(tasksCtnr);
					var ctnr=$("<div/>").addClass("checkbox").appendTo(taskTag);
					var label=$("<label/>",{html:task["name"]}).appendTo(ctnr);
					var chooser=$("<input/>",{type:"checkbox", userTaskId:userTask["id"]}).addClass("chooser").prependTo(label);
				});
			},
			error : function(){warning();}
		});
	}
	
	/** 初始化数据 */
	this.initData = function() {
		enabledManageBtns();
		initUserList();
	}
	
	// 获取用户列表
	function initUserList() {
		requestUtil.jsonAjax({
			url : "user/userList.cmd",
			success : function(rData){
				if (!rData.flag) {warning(rData.message); return;}
				
				var users = rData.data;
				if (!(users instanceof Array)) return;
				
				var usersCtnr = baseCtnr.find(".users_ctnr ul");
				usersCtnr.html("");
				users.each(function(u){$("<li/>",{userId:u["account"], html:u["name"]}).addClass("user").appendTo(usersCtnr);});
			},
			error : function(){warning();}
		});
	}

	/**
	 * 展示警告
	 * @param msg 警告消息
	 */
	function warning(msg) {$.alert({title:"Warning", content:(msg || "The system is unusual, please try again later.")});}
	
	/** 日志记录 */
	function log(msg) {
		AssignTaskDebug && window.console && console.log(msg);
	}

	return this;
}