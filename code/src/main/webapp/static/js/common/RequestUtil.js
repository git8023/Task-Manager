window.console && window.console.log("RequestUtil.js");
/**
 * 请求工具, 依赖工具 : prototype.js, jQuery.js
 */
function __RequestUtil() {
	var $thisObj = this;
	var AJAX_REQUEST_INVALID_TO_URL = "/";
	/** 字符串工具 */
	var stringUtil = new StringUtil();
	$thisObj.debug = true;
	/**
	 * jQuery ajax请求
	 * @param param 参数配置(与jQuery.ajax保持一致)
	 */
	this.ajax = function(param) {
		// 参数修复
		var revisedParam = reviseParam(param);

		// 参数验证
		if (!revisedParam["url"]) {
			log("Parameters invalid!");
			return;
		}

		// 包装参数
		wrapperCallback(revisedParam);

		// 发起 jQuery.ajax 请求
		$.ajax(revisedParam);
	};
	
	/**
	 * jQuery ajax 请求, 
	 * @param param 请求参数, dataType 属性总是 JSON
	 */
	this.jsonAjax = function(param) {
		var regex = /^dataType$/i;
		for (var prop in param) {
			if (regex.test(prop)) {
				delete param[prop];
			}
		}
		param["dataType"] = "JSON";
		
		$thisObj.ajax(param);
	};
	
	/**
	 * 执行链
	 * @param conf1<b>,conf2,...confN</b>
	 * <p>配置参数, 接受多个配置参数对象, 每个配置参数对象属性参照 $.ajax() 接口.</p> 
	 * <p style='color:#F00;'>注意:success处理函数需要返回值:true-继续执行后续节点, 否则将会终止执行链</p> 
	 */
	this.ajaxChain = function() {
		var args = [];
		if (0 >= arguments.length) {
			return;
		}
		
		for (var index in arguments) {
			var arg = arguments[index];
			if (true == isAjaxParam(arg)) {
				args.push(arg);
			}
		}
		
		if (0 < args.length) {
			invokAjaxChain(args);
		}
	}
	
	/**
	 * 文件下载
	 * @param conf 请求配置
	 * <pre>
	 * url : 下载请求地址,
	 * param : 附加参数
	 * </pre>
	 */
	this.download = function(conf) {
		if (!conf)return;

		var ID_FORM_DOWNLOAD = "_form_download";
		$("#"+ID_FORM_DOWNLOAD).remove();
		
		var url = stringUtil.getRealUrl(conf.url);
		var form = $("<form/>", {id:ID_FORM_DOWNLOAD});
		form.attr({action:url, method:"POST"});
		form.css({display:"none"});
		
		if (conf.param) {
			for (var i in conf.param) {
				var val = conf.param[i];
				if (!validator.isFunction(val)){
					var input=$("<input/>");
					if (val instanceof Array) {val=val;}
					input.attr({name:i, value:val});
					form.append(input);
				}
			}
		}

		$("body").append(form);
		form.submit();
	}
	
	/**
	 * 检测是否是 ajax 参数
	 * @param arg 参数
	 * @returns {Boolean} true-是ajax参数, false-不是ajax参数
	 */
	function isAjaxParam(arg) {
		if (arg && typeof arg === "object") {
			if ((typeof arg["url"] === "string") && (arg["success"] instanceof Function)) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 执行Ajax链条
	 * @param args 执行参数数组
	 */
	function invokAjaxChain(args) {
		if (0 >= args.length) {
			return;
		}
		
		var arg = wrapperChainParam(arg, args);
		$.ajax(arg);
	}
	
	/**
	 * 包装 Ajax 执行链参数
	 * @param args 执行链参数
	 */
	function wrapperChainParam(arg, args) {
		var arg = args.splice(0, 1);
		var successFn = arg["success"];
		
		arg["success"] = function(data) {
			var isContinue = false;
			if (successFn instanceof Function) {
				isContinue = successFn(data);
				if (true == isContinue) {
					invokAjaxChain(args);
				}
			}
		}
		
		return arg;
	}

	/**
	 * 包装回调函数
	 * 
	 * @param param
	 *            参数
	 */
	function wrapperCallback(param) {
		proxyFn(param, "success");
		// proxyFn(param, "error");
	}

	/**
	 * 代理原函数, 当服务器响应数据为以下数据时，当前页面将跳转到 data.toUrl 指定地址
	 * 
	 * <pre>
	 * {
	 * 	flag : false,
	 * 	message : Anything,
	 * 	data : {
	 * 		toUrl : "",
	 * 		isInvalidAjax : true
	 * 	}
	 * }
	 * </pre>
	 * 
	 * @param param
	 *            目标对象
	 * @param fnName
	 *            属性名
	 */
	function proxyFn(param, fnName) {
		var fn = param[fnName];
		param[fnName] = function(data) {
			if (data) {
				var tData = validator.toJSON(data);
				
				// 当前请求需要跳转到指定地址
				if (!validator.isEmpty(tData) && false == tData.flag && tData.data) {
					if ((true == tData.data["isInvalidAjax"]) && false == invalidHandle(tData)) {
						
						// SSO 用户弹出消息提示, 普通用户直接跳转首页
						if (/^SSO/.test($("#userRole").val())) {
							if (!$("#sending").size()) {
								// 用户过期提醒
								$.alert({
									title : "WARNING",
									content : "The session has expired, Please click " + $("<span/>").css({"color":"#0AA"}).html("Catalog Single Sign On").getHTML() + " to login again.<span id='sending'>&nbsp;<span/>",
									confirm : function() {
										log(tData.message);
										location.href = getRightUrl(tData.data.toUrl);
									}
								});
							}
						} else {
							location.href = getRightUrl(tData.data.toUrl);
						}
						
						return;
					}
				}
			}

			if (fn instanceof Function) {
				fn(data);
			}
		};
	}
	
	/**
	 * 无效请求处理
	 * @param responseData 响应数据
	 * @returns {Boolean} 是否继续执行其他：false-截断，不继续执行；true-继续执行
	 */
	function invalidHandle(responseData) {
		var toUrl = responseData.data["toUrl"];
		if (!toUrl) {
			// 跳转到默认页面
			toUrl = AJAX_REQUEST_INVALID_TO_URL;
		}
		
		return false;
	}

	/**
	 * 获取正确的 URL 地址
	 * 
	 * @param url
	 *            相对/绝对 Http 请求
	 * @returns {String} 完整 Http 请求
	 */
	function getRightUrl(url) {
		var rightUrl = url;
		if (!(rightUrl instanceof String)) {
			rightUrl = "";
		} else {
			// 必须引入 prototype.js 和 jQuery.js
			rightUrl = rightUrl.trim();
		}

		if (/^\/|\\/.test(url)) {
			url = url.substring(1);
		}
		rightUrl = stringUtil.getBaseUrl() + rightUrl;
		return rightUrl;
	}

	/**
	 * 参数修复
	 * 
	 * @param param
	 *            原始参数
	 * @returns {JSON} 修复后参数
	 */
	function reviseParam(param) {
		var rParam = {};
		if (param && param["url"]) {
			// Copy 原属性， 降低修改属性时带来的风险
			for (var key in param) {rParam[key]=param[key];}
			
			// 默认值修复
			reviseDefault(rParam, {type:"POST", dataType:"JSON"});
		}
		return rParam;
	}
	
	/**
	 * 修复默认值
	 * @param target 目标对象
	 * @param defaultData 默认对象属性
	 */
	function reviseDefault(target, defaultData) {
		if (target && defaultData) {
			for (var key in defaultData) {
				var val = target[key];
				if (null==val || undefined==val) {target[key]=defaultData[key];}
			}
			target["url"]=stringUtil.getRealUrl(target["url"]);
		}
	}

	function log(msg) {$thisObj.debug && console && console.log(msg);}
	
	return this;
}
var requestUtil = new __RequestUtil();