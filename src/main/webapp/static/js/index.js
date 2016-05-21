window.console && console.log("index.js");

$(function() {
	var thisPageFn = new IndexFn();
	thisPageFn.initEvents();
	thisPageFn.initData();
});

/**
 * @description index.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年3月27日 - 下午3:44:31
 */
function IndexFn() {
	var $thisObj = this;
	var baseCtt = $("#login_form");

	/** 初始化事件 */
	this.initEvents = function() {
		baseCtt.find("#submit").click(loginEvent);
	}

	/** 初始化数据 */
	this.initData = function() {}
	
	// 登陆事件
	function loginEvent() {
		var form = new Form({tag:baseCtt.find("form:eq(0)")}, true);
		var isValid = true,errClass="err_ipt";
		form.validate({
		 	regex : {
		 		success : function(error,item){
		 			item.removeClass(errClass).removeAttr("title");
		 		},
		 		failure : function(error,item){
		 			item.addClass(errClass).attr({"title":error});
		 			isValid = false;
		 			return true;
		 		}
		 	}
		});
		
		if (isValid) {
			var formData = form.getData();
			formData.submit({
				success : function(rData) {
					if (!rData.flag) {
						$.confirm({title:"Warning", content:rData.message, confirm:function(){baseCtt.find("#password").val("");}});
					} else {
						window.location.href = stringUtil.getRealUrl("/home.cmd");
					}
				},
				error : function(){warning();}
			});
		}
	}

	/**
	 * 展示警告
	 * @param msg 警告消息
	 */
	function warning(msg) {$.alert({title:"Warning", content:(msg || "The system is unusual, please try again later.")});}
	
	return this;
}