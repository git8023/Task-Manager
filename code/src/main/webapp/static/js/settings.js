window.console && console.log("settings.js");
var SettingsDebug = true;

$(function() {
	var thisPageFn = new SettingsFn();
	thisPageFn.initEvents();
	thisPageFn.initData();
	SettingsDebug && window.console
			&& console.log("Page load event is complete");
});

/**
 * @description settings.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年4月1日 - 上午11:16:14
 */
function SettingsFn() {
	var MAX_PROJECT_LENGTH = 12;
	var NO_RECORD_FOUND = "No Record Found";
	
	var $thisObj = this;
	var baseCtt = $(".project_settings_container");
	var src = $("#src");

	/** 初始化事件 */
	this.initEvents = function() {
		baseCtt
			.undelegate(".edit_project_name", "click")
			.delegate(".edit_project_name", "click", editProjectNameEvent);
		
		baseCtt
			.undelegate(".projects .name label", "click")
			.delegate(".projects .name label", "click", showProjectDetailEvent);
		
		baseCtt
			.undelegate(".projects .opt .change_staus", "click")
			.delegate(".projects .opt .change_staus", "click", changeProjectStatusEvent);
		
		
		baseCtt
			.undelegate(".modules .module .edit", "click")
			.delegate(".modules .module .edit", "click", editModuleEvent);
		
		baseCtt
			.undelegate(".modules .module .status", "click")
			.delegate(".modules .module .status", "click", changeModuleStatusEvent);
		
		baseCtt.find("#addProject").click(addProjectEvent);
		baseCtt.find("#addModule").click(addModuleEvent);
	}
	
	// TODO 修改项目状态
	function changeProjectStatusEvent(){
		var $this = $(this), oldStatus=$this.attr("title");
		var projectTag=$this.parent().parent(), projectId=projectTag.attr("projectId");
		
		requestUtil.jsonAjax({
			url : "project/changeStatus.cmd",
			data : {projectId:projectId, currentStatus:oldStatus},
			success : function(rData){
				if (rData.flag) {
					var newStatus=rData.data;
					if (newStatus) {
						// 刷新当前这条Project的状态 
						var imgSrc=$this.attr("src");
						var newSrc=imgSrc.replace(oldStatus.toLowerCase(), newStatus.toLowerCase());
						$this.attr({"src":newSrc, title:newStatus});
						return;
					} 
				}
				
				// 更新失败或获取新状态失败时,
				// 刷新整个列表
				$.jc.warning(rData.message, initProjectList);
			},
			error : function(){$.jc.error();}
		});
	}
	
	// 修改模块状态事件
	function changeModuleStatusEvent() {
		var $this=$(this), opt=$this.parent(), status=$this.attr("title").toLowerCase();
		status = ("disabled"==status?"EFFECTIVE":"DISABLED");
		requestUtil.jsonAjax({
			url : "module/changeStatus.cmd",
			data : {id:opt.attr("moduleid"), status:status},
			success : function(rData) {
				var src = stringUtil.getRealUrl("static/image/module/module_" + status.toLowerCase() + ".ico");
				if (rData.flag) {$this.attr({src:src, title:stringUtil.firstUpperCase(status)});} 
				else {warning(rData.message);}
			},
			error : function(){warning();}
		})
		
	}
	
	// 编辑模块事件
	function editModuleEvent() {
		var $this=$(this), opt=$this.parent(), status=$this.attr("title").toLowerCase();
		var disabled = $this.attr("disabled");
		if (!disabled) {
			$this.limitedDisplay(1000);
			var jc=$.confirm({title:"Edit Module", content:"", backgroundDismiss:false, confirm:function() {
				var form = new Form({tag:this.contentDiv.find("form")}, SettingsDebug);
				var formData = form.getData();
				formData.submit({
					url : "module/changeDetail.cmd",
					success : function(rData){
						if (rData.flag) {reloadModules();} 
						else {warning(rData.message);}
					},
					error : function(){warning();}
				});
			}});
			jc.setContent(src.find(".src_add_module").getHTML());
			jc.contentDiv.find("input[name='project.id']").val(baseCtt.find(".name.active").attr("projectId"));
			
			// 回填数据
			requestUtil.jsonAjax({
				url : "module/getDetails.cmd",
				data : {moduleId:opt.attr("moduleid")},
				success : function(rData){
					if (rData.flag) {new Form(jc.contentDiv.find("form"), SettingsDebug).fillForm({data:rData.data});} 
					else {warning(rData.message);}
				},
				error : function(){warning();}
			})
		}
	}
	
	// 重新加载模块列表
	function reloadModules(){baseCtt.find(".name.active label").click();}
	
	// 添加模块事件
	function addModuleEvent() {
		var $this = $(this);
		var disabled = $this.attr("disabled");
		if (!disabled) {
			$this.limitedDisplay(1000);
			var jc=$.confirm({title:"Add Module", content:"", backgroundDismiss:false, confirm:function() {
				var form = new Form({tag:this.contentDiv.find("form")}, SettingsDebug);
				var formData = form.getData();
				formData.submit({
					success : function(rData){
						if (rData.flag) {baseCtt.find(".name.active label").click();} 
						else {warning(rData.message);}
					},
					error : function(){warning();}
				});
				console.log(formData);
			}});
			jc.setContent(src.find(".src_add_module").getHTML());
			jc.contentDiv.find("input[name='project.id']").val(baseCtt.find(".name.active").attr("projectId"));
		}
	}

	// 查看项目详情事件
	function showProjectDetailEvent() {
		var $this = $(this);
		var projectCtn=$this.parent(), projectsCtnr = projectCtn.parent();
		projectsCtnr.find(".name").each(function(i,el){$(el).removeClass("active");});
		projectCtn.addClass("active");

		// 模块容器
		var modulesCtnr = baseCtt.find(".modules");
		modulesCtnr.html("").append($("<div/>",{html:NO_RECORD_FOUND}).addClass("no_data"));
		
		// 获取模块列表
		requestUtil.jsonAjax({
			url : "module/getModulesByProject.cmd",
			data : {projectId:$this.parent().attr("projectid")},
			success : function(rData){
				if (rData.flag) {
					var modulData = rData.data;
					if ((modulData instanceof Array) && (0 < modulData.length)) {
						modulesCtnr.html("");
						modulData.each(function(v){
							var moduleCtner=$("<div/>").addClass("module").appendTo(modulesCtnr);
							$("<label/>",{text:v["name"]}).appendTo(moduleCtner);
							// 操作区
							var opt=$("<div/>",{moduleId:v["id"]}).addClass("opt").appendTo(moduleCtner);
							$("<img/>",{
								src:stringUtil.getRealUrl("/static/image/module/module_" + v.status.toLowerCase() + ".ico"), 
								title:stringUtil.firstUpperCase(v.status)
							}).addClass("ico status").appendTo(opt);
							$("<img/>",{
								src:stringUtil.getRealUrl("/static/image/module/module_edit.ico"), 
								title:"Edit"
							}).addClass("ico edit").appendTo(opt);
						});
					}
				} else {
					warning(rData.message);
				}
			},
			error : function(){warning();}
		})
	}
	
	// 新增项目事件
	function addProjectEvent() {
		var $this = $(this);
		var disabled = $this.attr("disabled");
		if (!disabled) {
			$this.limitedDisplay(1000);
			var jc=$.confirm({title:"Add Project", content:"", backgroundDismiss:false, confirm:function() {
				// 新项目名称
				var newPName=this.contentDiv.find("input").val();
				requestUtil.jsonAjax({
					url : "project/addProject.cmd",
					data : {name:newPName},
					success : function(data) {
						if (data.flag) {initProjectList();}
						else {warning(data.message);}
					}
				})
			}});
			jc.setContent(src.find(".src_add_project").getHTML());
		}
	}
	
	/**
	 * 创建项目名称容器
	 * @param id 项目ID
	 * @param icoPath 图标路径
	 * @param name 项目名称
	 * @param icoPath 图标路径
	 */
	function createProjectNameCtnr(id, icoPath, name, statuc) {
		// 创建项目栏位
		var addNameCtnr=$("<div/>",{title:name, projectId:id}).addClass("name");
		icoPath=(icoPath || "/static/image/projectManager/project_1.png");
		statuc=(statuc || "disabled");
		var lockImgSrc = "/static/image/projectManager/settings_project_" + statuc.toLowerCase() + ".png"
		
		// 项目名称截取
		var shortName = stringUtil.setLength(name, MAX_PROJECT_LENGTH);
		$("<img/>",{src:stringUtil.getRealUrl(icoPath)}).addClass("ico").appendTo(addNameCtnr);
		$("<label/>", {text:shortName}).appendTo(addNameCtnr);
		
		// 操作按钮
		var opt=$("<div/>").addClass("fl_r opt").appendTo(addNameCtnr);
		$("<img/>",{src:stringUtil.getRealUrl(lockImgSrc), title:statuc}).addClass("ico change_staus").appendTo(opt);
		$("<img/>",{src:stringUtil.getRealUrl("/static/image/projectManager/project_edit.ico"), title:"Edit Project Name"}).addClass("ico edit_project_name").appendTo(opt);
		
		return addNameCtnr;
	}
	
	// 修改项目名称
	function editProjectNameEvent() {
		var $this = $(this), opt=$this.parent(), ctn=opt.parent();
		var nameCtn=ctn.find("label").hide();
		var oldName=nameCtn.parent().attr("title");

		// 新名称输入框
		var ipt = $("<input/>").css({width:"95px"}).insertAfter(nameCtn).val(oldName);
		ipt.focus(function(){$(this).select();}).focus();
		
		// 离开输入框: submit or rollback
		ipt.blur(function(){
			var newName=$(this).val().trim();
			if (stringUtil.isEmpty(newName, true)) {$(this).remove();return;}
			requestUtil.jsonAjax({
				url : "project/modify.cmd",
				data : {"id":$(this).parent().attr("projectid"), "name":newName},
				success : function(rData){
					if (!rData.flag) {
						warning(rData.message);
					} else {
						// 修改成功直接使用新名称, 否则rollback
						nameCtn.html(stringUtil.setLength(newName, MAX_PROJECT_LENGTH)).show();
						nameCtn.parent().attr({title:newName});
					}
					ipt.remove();
				},
				error : function(){
					warning();
					nameCtn.show();
					ipt.remove();
				}
			})
		});
	}
	
	/** 初始化数据 */
	this.initData = function() {
		initProjectList();
	}
	
	// 初始化项目列表
	function initProjectList() {
		var projectsCtnr = baseCtt.find(".projects");
		projectsCtnr.html("").append($("<div/>",{html:NO_RECORD_FOUND}).addClass("no_data"));
		requestUtil.jsonAjax({
			url : "project/getProjectList.cmd",
			success : function(rData) {
				if (!rData.flag) {warning(rData.message); return;}
				
				var projects = rData.data;
				if (!(projects instanceof Array) || 0>= projects.length) {
					// 不存在项目时, 禁止添加模块
					baseCtt.find("#addModule").attr({"disabled":"disabled"}).addClass("disabled");
					return;
				}
				
				projectsCtnr.html("");
				projects.each(function(v){createProjectNameCtnr(v.id, v.icoPath, v.name, v.status).appendTo(projectsCtnr);});
				// 默认加载第一个项目下的模块列表
				projectsCtnr.find(".name:eq(0) label").click();
				baseCtt.find("#addModule").removeAttr("disabled").removeClass("disabled");
			}
		});
	}

	/** 日志记录 */
	function log(msg) {
		window.console && console.log(msg);
	}
	
	/**
	 * 展示警告
	 * @param msg 警告消息
	 */
	function warning(msg) {
		$.alert({title:"Warning", content:(msg || "The system is unusual, please try again later.")});
	}

	return this;
}