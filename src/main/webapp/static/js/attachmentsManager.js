var AttachmentsManagerDebug = true;
AttachmentsManagerDebug && window.console && console.log("attachmentsManager.js");

$(function() {
	var thisPageFn = new AttachmentsManagerFn();
	thisPageFn.initEvents();
	thisPageFn.initData();
});

/**
 * @description attachments_manager.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年4月24日-下午12:51:33
 */
function AttachmentsManagerFn() {
	var MAX_LENGTH = 20;
	var ANCHOR_SHOW = "anchor_show";
	var CHOOSED = "choosed";
	var DISABLED = "disabled";
	var ANCHOR_HOVER_IMG_SRC=stringUtil.getRealUrl("static/image/attachment/anchor.png");
	var ANCHOR_CHOOSED_IMG_SRC=stringUtil.getRealUrl("static/image/attachment/anchor_choosed.gif");
	
	var $thisObj = this;
	var baseCtnr = $(".attachment_mgr_ctnr");
	var pager = new Pager(baseCtnr.find(".title>.grid_pager"), HomeDebug);
	var grid = baseCtnr.find(".data_grid").dataGrid();
	var taskId = baseCtnr.find("#taskId").val();
	
	/** 初始化事件 */
	this.initEvents = function() {
		registerPagerEvents();
		registerDataGridEvents();
		baseCtnr.find(".menu.clear_attachments").click(clearAttachmentsEvent);
		baseCtnr.find(".menu.delete_attachments").click(deleteAttachmentsEvent);
		baseCtnr.find(".menu.note").click(managerNoteEvent);
		baseCtnr.find(".menu.download_files").click(downloadAttachmentsEvent);
	}
	
	// 下载附件事件
	function downloadAttachmentsEvent() {
		var attachmentsIds=getChoosedAttachmentIds();
//		window.open(stringUtil.getRealUrl("task/downloadAttachments.cmd?attachmentsIds[]="+attachmentsIds));
		
		requestUtil.download({
			url : "task/downloadAttachments.cmd",
			param : {attachmentsIds:attachmentsIds}
		});
	}
	
	// 管理附件备注
	function managerNoteEvent() {
		var $this = $(this);
		if ($this.hasClass(DISABLED))return;
		
		// 获取附件信息
		var nameTitleIdx, attachment=$(getChoosedAttachments()[0]);
		grid.grid.find("th").each(function(i,v){if("name"===$(v).attr("propName")){nameTitleIdx=i;return false;}});
		var arrachmentName=attachment.find("td:eq("+nameTitleIdx+")").text();
		var attachmentId=attachment.attr("attachmentId");
		
		// 获取原来的备注
		requestUtil.jsonAjax({
			url : "task/getAttachmentNote.cmd",
			data : {attachmentId:attachmentId},
			success : function(rData){
				if (!rData.flag) {warning(rData.message); return;}
				showAttachmentNote(attachmentId, arrachmentName, rData.data);
			},
			error : function(){warning();}
		});
	}
	
	// 查看附件备注
	function showAttachmentNote(attachmentId, arrachmentName, origNote) {
		var attachment=$(getChoosedAttachments()[0]);
		
		// 弹出附件备注修改框
		var jc=$.alert({
			title:"Attachment Note - "+arrachmentName, 
			content:$("<textarea/>").addClass("attachmen_note").getHTML(),
			backgroundDismiss:false,
			confirm:function(){
				var newNote=this.contentDiv.find(".attachmen_note").val();
				
				// 提交修改
				requestUtil.jsonAjax({
					url:"task/updateAttachmentNote.cmd",
					data:{attachmentId:attachmentId, note:newNote},
					success:function(rData){
						if (!rData.flag){warning(rData.message); return;}
						setPopover(attachment, "Note", newNote);
					},
					error:function(){warning();}
				});
			}
		});
		jc.contentDiv.find(".attachmen_note").val(origNote?origNote:"");
	}
	
	// 设置 Popover
	function setPopover($tag, title, content) {
		$($tag).attr({
			"data-toggle":"popover",
			"data-original-title":title,
			"data-content":content,
			"data-placement":"top",
			"data-trigger":"hover",
			"data-container":".data_grid"
		}).popover();
	}
	
	// 删除选中的附件事件
	function deleteAttachmentsEvent() {
		if ($(this).hasClass(DISABLED)) return;
		var attachmentIds=getChoosedAttachmentIds();
		if (0 == attachmentIds.length) return;
		
		$.confirm({title:"Warning", content:"Confirm to delete the attachment?", confirm:function(){
			requestUtil.jsonAjax({
				url : "task/removeAttachments.cmd",
				data : {attachmentIds:attachmentIds},
				success : function(rData){
					if (!rData.flag) {warning(rData.message); return;}
					pager.reload();
				},
				error : function(){warning();}
			});
		}});
	}

	// 获取选中的附件ID
	function getChoosedAttachmentIds() {
		var attachmentIds=[];
		grid.grid.find("tr.choosed").each(function(i,v){attachmentIds.push($(v).attr("attachmentId").trim());});
		return attachmentIds;
	}
	
	// 删除所有附件事件
	function clearAttachmentsEvent() {
		grid.grid.find(".attachment").addClass(CHOOSED);
		deleteAttachmentsEvent();
	}
	
	// 获取当前任务ID
	function getTaskId() {return baseCtnr.find("#taskId").val();}
	
	// 注册数据网格事件
	function registerDataGridEvents() {
		var fileTypeIdx=-1;
		grid.grid.find("th").each(function(i,th){if ("fileType" === $(th).attr("propname")) {fileTypeIdx=i;return false;}});
		grid.registerEvents({
			filterCell : function(cell, cellData){
				var val=cellData["value"];
				switch (cellData["propName"]) {
				case "name":
					cell.html(stringUtil.setLength(val, MAX_LENGTH)).attr({title:val});
					$("<img/>",{src:ANCHOR_HOVER_IMG_SRC}).addClass("anchor_hover anchor_hide").prependTo(cell);
					break;
				}
			},
			filterRow : function(row, rowData){
				row.addClass("attachment").attr({attachmentId:rowData["id"]})
					.click(chooseAttachmentEvent)
					.hover(function(){
						var $this = $(this);
						if (!$this.hasClass(CHOOSED)) $this.find("img.anchor_hover").addClass(ANCHOR_SHOW);
					},function(){
						var $this = $(this);
						if (!$this.hasClass(CHOOSED)) $this.find("img.anchor_hover").removeClass(ANCHOR_SHOW);
					});

				// 添加描述信息
				var note=rowData["summary"];
				if (note) {
					setPopover(row, "Note", note);
				}

				// 文件类型
				var fileName=rowData["name"];
				var split=fileName.split(/\./);
				var fileType=(2==split.length?split[split.length-1].toUpperCase():"TEXT");
				if (-1!=fileTypeIdx) row.find("td:eq("+fileTypeIdx+")").html("").append($("<span/>",{html:fileType}));
			},
			filled : function() {
				$("[data-toggle='popover']").popover();
			}
		});
	}
	
	// 选择要操作的附件事件
	function chooseAttachmentEvent(){
		var $this =$(this), anchor=$(this).find("img.anchor_hover"), anchorSrc;
		if ($this.hasClass(CHOOSED)) {$this.removeClass(CHOOSED); anchorSrc=ANCHOR_HOVER_IMG_SRC;} 
		else {$this.addClass(CHOOSED); anchorSrc=ANCHOR_CHOOSED_IMG_SRC;}
		anchor.attr({src:anchorSrc});
		enabledFn();
	}

	// 启动删除选中附件功能
	function enabledFn() {
		var choosedSize=getChoosedAttachments().size();
		
		var delBtn = baseCtnr.find(".menu.delete_attachments");
		if (1<=choosedSize) {delBtn.removeClass(DISABLED); baseCtnr.find(".menu.download_files").removeClass(DISABLED);}
		else {delBtn.addClass(DISABLED); baseCtnr.find(".menu.download_files").addClass(DISABLED);}
		
		var noteBtn = baseCtnr.find(".menu.note");
		if (1==choosedSize) {noteBtn.removeClass(DISABLED);}
		else {noteBtn.addClass(DISABLED);}
	}
	
	// 获取选中的附件
	function getChoosedAttachments() {return grid.grid.find("tr.choosed");}
	
	// 页脚事件
	function registerPagerEvents() {
		pager.init({
			beforeSend : function(data){
				baseCtnr.find(".menu.delete_attachments").addClass(DISABLED);
				data.taskId=taskId; 
				return data;
			},
			afterClick : function(index, rData) {grid.fillGrid(rData.data);}
		});
	}

	/** 初始化数据 */
	this.initData = function() {
	}

	/**
	 * 展示警告
	 * @param msg 警告消息
	 */
	function warning(msg) {$.alert({title:"Warning", content:(msg || "The system is unusual, please try again later.")});}
	
	/** 日志记录 */
	function log(msg) {
		AttachmentsManagerDebug && window.console && console.log(msg);
	}

	return this;
}