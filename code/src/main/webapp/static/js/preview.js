var PreviewDebug = true;
PreviewDebug && window.console && console.log("preview.js");

$(function() {
	var thisPageFn = new PreviewFn();
	thisPageFn.initEvents();
	thisPageFn.initData();
});

/**
 * @description preview.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年5月25日-下午3:01:01
 */
function PreviewFn() {
	var $thisObj = this;
	var baseCtnr = $(".preview_container");

	/** 初始化事件 */
	this.initEvents = function() {
		try {
			baseCtnr
				.dblclick(function(){$(this).toggleClass("max");})
				.keydown(function(e){var esc=(27==e.which);if(esc)$(this).removeClass("max");})
				.mousedown(function(){$(this).focus();});
		} catch (e) {
			log(e.message);
		}
	};

	/** 初始化数据 */
	this.initData = function() {
		try {
			prettyPrint();
			setStyleForString();
		} catch (e) {
			log(e.message);
		}
	};

	// 设置字符串样式
	function setStyleForString(){
		baseCtnr.find(":contains('\'')").each(function(){
			// 只操作叶子节点标签
			if(this.childElementCount)return;
			
			var $this=$(this), text=$this.text();
			if(/^['].*[']$/.test(text)){
				// 将内容装载到 .chars 中
				var chars=$("<chars/>",{html:text});
				$this.html("").append(chars);
			}
		});
	}
	
	/** 日志记录 */
	function log(msg) {
		PreviewDebug && window.console && console.log(msg);
	}

	return this;
}