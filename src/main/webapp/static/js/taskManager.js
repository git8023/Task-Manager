var TaskManagerDebug = true;
TaskManagerDebug && window.console && console.log("taskManager.js");

$(function() {
	var thisPageFn = new TaskManagerFn();
	thisPageFn.initEvents();
	thisPageFn.initData();
});

/**
 * @description task_manager.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年5月14日-下午5:05:52
 */
function TaskManagerFn() {
	var CLASS_ANCHOR = "anchor";
	var DISABLED = "disabled";
	var CELL_VALUE_OF_FREE_STATUS="FREE";
	var PROPERTY_NAME_OF_STATUS = "status";
	
	var $thisObj = this;
	var baseCtnr = $(".task_manager_container");
	
	var pager = new Pager(baseCtnr.find(".grid_pager"), TaskManagerDebug);
	var grid = new DataGrid(baseCtnr.find(".data_grid"), true);
	
	/** 初始化事件 */
	this.initEvents = function() {
		try {
			registerDelegateEvents();
			registerGridEvents();
			registerMenuEvents();
		} catch (e) {
			log(e.message);
		}
	};

	// 注册菜单事件
	function registerMenuEvents(){
		baseCtnr.find(".menu.verifying").click(verifyingEvent);
		baseCtnr.find(".menu.assign_to").click(assignTasksToUserEvent);
		baseCtnr.find(".menu.unassign").click(unassignTasksEvent);
		baseCtnr.find(".menu.do_disabled").click(deleteChoosedTasksEvent);
	}
	
	// TODO 批量删除选中的任务; 
	// 只能删除为下放的任务, 如果任务存在附件让用户确认是否下载附件后, 再删除
	function deleteChoosedTasksEvent(){
		$.jc.warning("Please waiting...deleteChoosedTasksEvent");
	}
	
	// TODO 批量取消已下放的任务
	function unassignTasksEvent(){
		$.jc.warning("Please waiting...unassignTasksEvent");
	}
	
	// TODO 批量下发任务到指定用户
	function assignTasksToUserEvent(){
		$.jc.warning("Please waiting...assignTasksToUserEvent");
	}
	
	// TODO 管理员审核事件
	function verifyingEvent(){
		$.jc.warning("Please waiting...verifyingEvent");
	}
	
	// 注册委托事件
	function registerDelegateEvents(){
		// 任务选择事件
		baseCtnr.undelegate(".choosable", "click").delegate(".choosable", "click", function(){
			$(this).toggleClass("choosed"); 
			enabledMenus();
		});
	}
	
	// 启用功能菜单
	function enabledMenus(){
		var taskIds=getChoosedTasksId();
		var choosedTasks=getChoosedTasks();
		var menus=baseCtnr.find(".menus .menu").addClass(DISABLED);
		if (!taskIds.length)return;

		// 开启所有功能
		menus.removeClass(DISABLED);

		var CELL_VALUE_OF_DOING_STATUS="DOING";
		var CELL_VALUE_OF_VERIFYING_STATUS="VERIFYING";
		
		var assignableBatch=true, disabledBatch=true, freeableBatch=true;
		choosedTasks.each(function(i,task){
			var status=grid.getCellValue(PROPERTY_NAME_OF_STATUS, task);
			assignableBatch=(assignableBatch && CELL_VALUE_OF_FREE_STATUS.equals(status, true, true));
			disabledBatch=(disabledBatch && assignableBatch);
			freeableBatch=(freeableBatch && (CELL_VALUE_OF_DOING_STATUS.equals(status, true, true) || CELL_VALUE_OF_VERIFYING_STATUS.equals(status, true, true)));
			
			if (!(assignableBatch && disabledBatch && freeableBatch))return false;
		});

		// 批量分配: 只有当所有选中的Task状态为FREE
		// 批量废弃: 只有当所有选中的Task状态为FREE
		if(!assignableBatch){
			baseCtnr.find(".menu.assign_to").addClass(DISABLED);
			baseCtnr.find(".menu.do_disabled").addClass(DISABLED);
		}
		
		// 批量释放: 只有当搜索选中的Task状态为 DOING or VERIFYING 时
		if(!freeableBatch){baseCtnr.find(".menu.unassign").addClass(DISABLED);}
		
		// 审核菜单
		if (1 == taskIds.length){
			var taskStatus = grid.getCellValue(PROPERTY_NAME_OF_STATUS, choosedTasks[0]);
			// 只能审核 VERIFYING 状态的任务
			var STATUS_OF_VERIFYING = "VERIFYING";
			STATUS_OF_VERIFYING.notEquals(taskStatus, true, true) && baseCtnr.find(".menus .menu.verifying").addClass(DISABLED);
		} else {
			baseCtnr.find(".menus .menu.verifying").addClass(DISABLED);
		}
		
	}
	
	// 获取选中的任务
	function getChoosedTasksId(){var ids=[];getChoosedTasks().each(function(i,el){ids.push($(el).attr("id").trim());}); return ids;}
	function getChoosedTasks(){return grid.grid.find(".task.choosed");};
	
	// 注册网格事件
	function registerGridEvents() {
		grid.registerEvents({
			filterRow : function(row, rowData){
				row.attr("id",rowData["id"]);
			},
			filterCell : function(cell, cellData){
				var propName=cellData["propName"];
				switch(propName){
				case "id":
					cell.html("").append(createAnchroCtnr());
					break;
				}
			},
			filled : function(){
				this.grid.resize();
			}
		});
	}
	
	// 创建选中锚点标记
	function createAnchroCtnr(){return $("<div/>").html("&nbsp;").addClass(CLASS_ANCHOR);}

	/** 初始化数据 */
	this.initData = function() {
		try {
			initConditionData();
			initGrid();
		} catch (e) {
			log(e.message);
		}
	};
	
	// 初始化任务
	function initConditionData() {
		requestUtil.jsonAjax({
			url : "task/getTaskStatus.cmd",
			async : false,
			success : function(rData){
				if (!rData.flag){$.jc.warning(rData.message); return;}
				var sl=baseCtnr.find(".condition_form select[name='taskStatus']");
				sl.setOptions(rData.data)
					.prepend($("<option/>",{value:"",html:"All",selected:"selected"}))
					.change(initGrid)
					.select2({minimumResultsForSearch: Infinity});
			},
			error : function(){$.jc.error();}
		});
	}
	
	// 初始化数据网格
	function initGrid() {
		pager.init({
			beforeSend : function(data){
				data["task.module.id"]=getModuleID();
				data["task.status"]=baseCtnr.find(".condition_form [name='taskStatus']").val();
			},
			afterClick : function(index, rData) {
				grid.fillGrid(rData.data);
			}
		});
	}

	// 获取当前模块ID
	function getModuleID(){return baseCtnr.find("#moduleId").val();}
	
	/** 日志记录 */
	function log(msg) {
		TaskManagerDebug && window.console && console.log(msg);
	}

	return this;
}