var UploadFileDebug = true;
UploadFileDebug && window.console && console.log("uploadFile.js");

$(function() {
	var thisPageFn = new UploadFileFn();
	thisPageFn.initEvents();
	thisPageFn.initData();
});

/**
 * @description upload_file_view.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年4月10日-下午3:23:06
 */
function UploadFileFn() {
	var $thisObj = this;
	var baseCtnr = $(".upload_file_ctnr");
	var fileType = baseCtnr.find("#fileType").val();

	/** 初始化事件 */
	this.initEvents = function() {
		// 文件上传
		$("body").undelegate(".upload_file_ctnr .file_choose", "change").delegate(".upload_file_ctnr .file_choose", "change", uploadFileChangeEvent);
		$("body").undelegate(".upload_file_ctnr .clear", "mouseup").delegate(".upload_file_ctnr .clear", "mouseup", clearChooseFileEvent);
		
		// 注册fileUpload
		registerFileUpload();
	}

	// 注册文件上传事件
	function registerFileUpload(){
		// 文件上传完成处理事件
		var uploadDone = function(trigger){$(trigger.attr("container")).find(".fn").parent().addClass("disabled btn-danger");};
		// SQL 文件上传
		registerUploadEvent(baseCtnr.find("#sqlFileChooser"), uploadDone).click(function(){baseCtnr.find(".sql_file").show();});
		// 任意文件上传
		registerUploadEvent(baseCtnr.find("#anyFileChooser"), uploadDone).click(function(){baseCtnr.find(".any_file").show();});
	}
	
	/**
	 * 注册单个文件选择器事件
	 * @param chooser {jQuery}-文件域对象
	 * @param uploadDoneFn {Function}-文件上传完成后回调函数
	 */
	function registerUploadEvent(chooser, uploadDoneFn) {
		// 文件列表容器
		var fileListCtnr=$(chooser.attr("container"));
		
		// 文件验证
		chooser.bind("fileuploadchange", function(e, data){
			var $this=$(this), isOk=true, regStr="", reg, errFile;
			var acceptSuffix=$this.attr("accept-suffix");
			// 无任何验证 
			if (stringUtil.isNotEmpty(acceptSuffix, true)) {
				acceptSuffix.split(",").each(function(v,i){
					// 正则表达式中.代表任意值, 需要转义
					regStr += "|" + v.trim().replace(".","\\.");
				});
				regStr = regStr.substring(1);
				reg=eval("/\\S+(" + regStr + ")$/i");
				
				// 当前文件
				data.files.each(function(f){
					isOk=reg.test(f.name); 
					if(!isOk){errFile=f.name;return false;}
				});
				var suffix = regStr.replace(/\\/g, "").replace(/\|/g, ", ");
				if(!isOk)warning("Please select a legal documents suffixes[<span style='color:#F00'>" + suffix + "</span>]");
			}
			return isOk;
		});
		
		chooser.bind("fileuploadfail", function(e, data){
			alert("文件上传失败啦");
		}); 
		
		// jQuery.fileupload 事件
		chooser.fileupload({
			
			// 每一个文件应属于指定任务
			formData : {taskId:$("#taskId").val()},
			
			// 成功添加文件
			add:function(e,data){
				var file=data.files[0], 
				fileItem=$('<div/>').addClass("input-group file_item ").appendTo(fileListCtnr);
				
				// 文件名
				var name=$("<div/>").addClass("form-control").appendTo(fileItem);
				$("<div/>", {readonly:"readonly", html:file.name}).addClass("name").appendTo(name);
				
				// 进度条
				var processCtnr = $("<div/>").addClass("process_ctnr").appendTo(name);
				$("<div/>").addClass("process bg-info transparent_50").appendTo(processCtnr);
				
				// 上传
				var uploadBtn = $("<div/>",{title:"Upload"})
									.addClass("input-group-addon upload btn btn-primary")
									.click(function () {data.submit(); uploadDoneFn(chooser);})
									.appendTo(fileItem);
				var uploadBtnIco = $("<i/>").addClass("glyphicon glyphicon-upload fn").appendTo(uploadBtn);
				
				// 删除
				var delBtn = $("<div/>",{title:"Delete"})
									.addClass("input-group-addon btn btn-danger delete")
									.appendTo(fileItem)
									.click(function () {fileItem.remove();});
				var delBtnIco = $("<i/>").addClass("glyphicon glyphicon-trash fn").appendTo(delBtn);
		
				// 设置动态表单内容
				data.context = fileItem;
				
				// 自动上传
				var autoUpload = eval(baseCtnr.find(".upload_opt_container input:checked").val());
				if (autoUpload) {data.submit();}
			},
			
			// 上传完成
			done:function(e,data){
				var rData = data.result;
				if (!rData.flag) {
					warning(rData.message);
					// 阻止其他附件自动上传
					baseCtnr.find("#manual").click();
				}
			},
			
			// 上传进度条
			progress: function (e, data) {
				var file = data.files[0];
				var progress = parseInt(data.loaded/data.total * 100);
				var nameCtnr = baseCtnr.find(".file_list .name:contains('" + file.name + "')");
				var processCtnr = nameCtnr.parent().find(".process");
				// 上传完成
				processCtnr.animate({width:progress+'%'}, 500, function(){if(100 == progress)uploadDoneFn(chooser);});
			}
		});
		return chooser;
	}
	
	// 选择上传文件事件
	function uploadFileChangeEvent() {
		var $this = $(this);
		var filePaths=$this.val().split("\\");
		$($this.attr("target")).val(filePaths[filePaths.length-1]);
	}
	
	// 清理已选择文件
	function clearChooseFileEvent() {
		$(this).parent().find("input").val("");
	}
	
	/** 初始化数据 */
	this.initData = function() {
		setUploadCtnr();
	}

	// 设置可上传文件类型
	function setUploadCtnr() {
		baseCtnr.find(".chooser_container").hide();
		if ("SQL" === fileType) {baseCtnr.find(".chooser_container.sql_file").show();}
		else {baseCtnr.find(".chooser_container.any_file").show();}
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