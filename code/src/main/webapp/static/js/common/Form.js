/**
 * 表单工具
 * @param container 配置对象: { <br>
 * 		tag			: jQuery,	[容器对象, 优先级最高] <br>
 * 		id			: String,	[容器ID属性, 优先于tagName + css] <br>	
 * 		css			: String,	[容器所包含的样式表, 默认获取首个标签, 可以tagName联合使用] <br>
 * 		tagName		: String	[容器标签名, 默认获取首个匹配标签, css辅助属性, 独自出现时不处理] <br>
 * } <br>
 * @param showLog 是否启用控制台日志
 * 
 * @returns {Object} 创建表单对象失败时返回null, 否则返回Form对象
 * @author Huang·Yong(邮箱:jinlong_8023@163.com)
 * @version 0.1 beta
 * @date 2015-9-4
 */
function Form(container, showLog) {
	var $$form = this;
	$$form.debug = showLog;
	var validator = new Validator();
	var stringUtil = new StringUtil();
	var _BASE_URL = stringUtil.getBaseUrl();
	
	/** 表单验证工具, 
	 * Key:{String}验证器唯一名称, 
	 * value:{Function}验证器, 参数:调用者配置参数, 返回值:false-终止后续验证
	 */
	var formValidators = {};
	initFormValidators();
	
	// 获取表单项默认配置
	var findItemDefConf = {
		include		: ["input", "select", "textarea"],
		exclByStyle	: [],
		cachedTag	: true
	};
	
	// 表单回填处理器
	$$form.fillFormHandlers={};
	initFillFormHandlers();

	// 远程验证处理器名称 函数 invokeHanlder 将依赖处理器名称顺序 
	var REMOTE_HANDLER_NAMES = ["handler", "success", "failure"];
	
	// Ajax 请求默认配置
	var AJAX_DEFAULT_CONFIG = {
		"type"		: "POST",
		"dataType"	: "JSON"
	};
	
	if (container instanceof jQuery) {
		$$form.container = container;
	} else {
		$$form.container = getContainer(container);
	}
	
	if (validator.isEmpty($$form.container)) {
		if ($$form.debug) {console.log("未找到表单容器");}
		return null;
	}
	
	/**
	 * 获取表单对象中包含的键值对, 表单元素表中可以使用属性"validator"指向当前标签验证器. <br>
	 * 调用filter之前会先调用validator, 如果有.
	 * @param config 配置对象: {  <br>
	 * 		include: Array(DF : input, select, textarea),[包含的表单元素. 指定时, 即覆盖默认值; 只保留包含name属性的表单元素] <br>
	 * 		exclByStyle: Array(DF : []),[需要排除的元素, 通过类样式区分] <br>
	 * 		filter: {Function}[自定义过滤器, 参数列表: { name : {value:String},  tag : jQuery }, 返回值{name:{value:String}}, 
	 * 				无返回值时获取的表单对象不包含当前键值对] <br>
	 * 		cachedTag: Boolean(DF : true) [是否缓存表单元素标签, 动态表单推荐不缓存] <br>	 
	 * } <br>
	 * 
	 * @returns 包含指定表单元素的对象
	 * <pre>
	 * <b>其中表单提交配置如下:</b>
	 * config 配置项:
	 *	  url : {String}, 如果当前没有配置则从表单容器中查找 'action'（较高优先级） 属性值 或 'submitUrl' 属性值，
	 *	  			'action' 和 'submitUrl' 都没找到时，将执行表单提交操作;
	 *	  type : {String}, Ajax 提交类型，默认"POST";
	 *	  dataType : {String}, 服务器响应格式，默认"JSON";
	 *	  beforeSubmit: {Function} 发送前回调函数，返回false则取消表单提交, 
	 *	  				参数：formData-将要发送的表单数据，Form-表单对象
	 *	  success: {Function} 服务器响应成功后回调函数
	 *	  afterSubmit : {Function} 表单提交完成后回调函数, 当前函数触发时机：success/error 执行完成后
	 *	  其他配置参照 $.ajax() 配置参数
	 * </pre>
	 * <pre>
	 * <b>获取真实表单数据:</b> 
	 * var formData = getData();
	 * var realData = formData.getRealData();
	 * </pre>
	 */
	this.getData = function (config) {
		if (!config) config = {};
		var items = $$form.items;
		var data = {};
		if (!items) {
			config = reviseConfig(findItemDefConf, config);
			
			// items
			items = getItems(config);
		} 
		
		// filter
		var data = fullData(data, items, config.filter);
		
		// submit form data
		submit(data);
		
		// just only data
		getRealData(data);
		
		return data;
	}
	
	/**
	 * 清空表单项内容
	 */
	this.cleanForm = function() {
		var cleaner = {
			// 输入框/单选框/复选框
			input : function(tag){
				tag = $(tag);
				var type = tag.attr("type");
				if (-1 != $.inArray(type, ["checkbox", "radio"])) {
					var isChecked=validator.isNotEmpty(tag.attr("checked"));
					tag.attr({"checked":isChecked});
					if (isChecked)tag.click();
				} else {
					tag.val(tag[0].defaultValue);
				}
			},
			// 下拉框
			select : function(tag) {
				tag = $(tag);
				var opt = tag.find("option:selected");
				if (0 < opt.size()) opt = tag.find("option:eq(0)");
				var val = "";
				if (0 < opt.size()) val = opt.val();
				tag.val(val);
			},
			// 多行文本框
			textarea : function(tag) {
				tag = $(tag);
				tag.val(tag[0].defaultValue||"");
			}
		}
		
		var setDefaultVal = function(items){
			$.each(items, function(idx, tag){
				var tagName = ("" + tag.tagName).toLowerCase();
				var executor = cleaner[tagName];
				if (executor) {
					executor(tag);
				}
			});
		}
		
		setDefaultVal($$form.container.find("input"));
		setDefaultVal($$form.container.find("select"));
		setDefaultVal($$form.container.find("textarea"));
	}
	
	/**
	 * 填充表单项
	 * @param config 
	 * <pre>
	 * data    : {Object}, 表单初始数据. Key:表单项name属性, value:表单项值属性
	 * preFill : {Function}, 表单项填充前置回调函数, 此函数定义由调用者赋值
	 *            参数: value[值], name[表单项名称], item[表单项]
	 *            返回值 : false-终止当前填充操作, undefined-继续由系统赋值, true-跳过当前表单项继续后续操作
	 * </pre>
	 */
	this.fillForm = function(config) {
		if (config && config.data && !validator.isEmpty(config.data)) {
			reviseConfig(config);
			
			var preFill = config.preFill;
			if (!validator.isFunction(preFill)) {
				preFill = false;
			}

			// 获取配置
			$$form.getData(config);
			var items = getItems(config);
			$.each(items, function(idx, item) {
				item = $(item);
				var name = item.attr("name");
				var value = ognlUtil.getValue(config.data, name);
				if (preFill) {
					if (false === preFill({value:value, name:name, tagItem:item}))return false;
				} else {
					var handlerName=item.attr("handler");
					var handler=$$form.fillFormHandlers[handlerName];
					if (handler instanceof Function) {value=handler(value, item);}
					setFormItemVal(item, value);
				}
			});
		} else {
			log("缺少配置");
		}
	}

	// 为表单项赋值
	function setFormItemVal(item, value){
		if (undefined==value || null==value)return;
		var tagName=item[0].tagName.toUpperCase();
		switch(tagName){
		case "TEXTAREA": item.val(value);break;
		case "SELECT": 
			// 通过value获取option
			// 获取失败, 获取 option[selected]
			// 获取失败, 获取 option:eq(0)
			var opt=item.find("option[value='"+value+"']");
			if (!(opt || opt.size()))opt=item.find("option[selected]");
			if (!(opt || opt.size()))opt=item.find("option:eq(0)");
			
			// 成功找到option, 设置select的值
			if (opt&&opt.size()){item.val(opt.attr("value"));}
			break;
		case "INPUT":
			var iptType=item.attr("type").toUpperCase();
			if ("RADIO"==iptType){
				item.val()==value&&item.click();
			} else if("CHECKBOX"==iptType){
				value=value.toString();
				var checkboxVal=item.val();
				value.split(",").each(function(v){if(v.trim()==checkboxVal){item.click();return;}});
			} else {
				item.val(value);
			}
			break;
		default:log("不支持的表单项"); break;
		}
	}
	
	/**
	 * 表单验证
	 * @param config 配置项
	 * <pre>
	 * 	// 正则表达式验证, 获取所有带有 name 属性的输入项：input, select, textarea
	 * 	regex : {
	 * 		excludeNames : {Array}，需要排除的表单项名称(name)
	 * 		pattern : {String}，正则表达式，如果没有则从表单项中获取 regex 属性作为标准
	 * 		success : {Function}，验证通过回调函数，参数:error:{String}消息(总是空字符串), item:{jQuery}被验证项，
	 * 		failure : {Function}，验证失败回调函数，参数:error:{String}消息(表单项regexErr属性), item:{jQuery}被验证项;
	 * 					返回值 false-终止后续验证
	 * 	}
	 * </pre>
	 */
	this.validate = function(config) {
		log("执行表单验证");
		
		if (validator.isEmpty(config)) {
			log("无任何验证配置,执行结束");
			return false;
		}
		
		// 匹配验证器
//		{
//			include		: ["input", "select", "textarea"],
//			exclByStyle	: [],
//			cachedTag	: false
//		}
		var items = getItems(reviseConfig(findItemDefConf, {}));
		var itemLen = items.length;
		if (0 <= itemLen) {
			for (var key in formValidators) {
				if (config[key] && (false == formValidators[key](config[key], items))) {
					break;
				}
			}
		} else {
			log("获取需要验证的表单项[" + itemLen + "]条,验证结束");
		}
	};
	
	/////////////////////////////////////////////////////////////////////
	// 初始化表单回填处理器
	function initFillFormHandlers() {
		$$form.fillFormHandlers={
			// 日期处理器
			date:function(v,el){
				v+="";
				if (isNaN(v))return"";
				var fmt=el.attr("format").trim()||"yyyy-MM-dd hh:mm:ss";
				return new Date(parseInt(v)).format(fmt);
			}
		};
	}
	
	/**
	 * 初始化表单验证器
	 */
	function initFormValidators() {
		formValidators.regex = regexValidator;
		formValidators.remote = remoteValidator;
	}
	
	/**
	 * 远程验证器，当前验证器优先级低于 Regex
	 * @param config 配置参数
	 * <pre>
	 * 	remoteUrl : {String}，配置当前参数后，所有验证将统一使用当前远程验证地址；
	 * 				如果没有配置当前项，则仅验证带有特定属性[remoteUrl]表单项; 
	 * 				远程验证响应数据类型{Boolean}:true-验证通过，false-验证失败
	 * 	isSync : {Boolean}，是否同步验证，true-同一时刻只触发一个远程验证；
	 * 				默认同步验证(true)，当值设置为false时总是验证所有需要验证的表单项
	 *	success : {Function}，远程验证成功（true）回调函数，参数：resultData:{Boolean}远程响应数据；item:{jQuery}远程验证表单项
	 *	failure : {Function}，远程验证失败（响应false）回调函数，参数：resultData:{Boolean}远程响应数据；item:{jQuery}远程验证表单项
	 *	handler : {Function}，统一处理器，使用当前配置将导致 success 和 failure 失效
	 * </pre>
	 * @param items 表单项
	 * @returns {Boolean} true-继续其他验证，false-终止其他验证
	 */
	function remoteValidator(config, items) {
		log("触发远程验证器");
		var handlers = {};
		
		log("正在验证配置参数是否合法");
		if (validator.isEmpty(config)) {
			log("缺少配置参数, 终止验证");
			return;
		} else {
			log("设置回调函数处理器");
			for (var idx in REMOTE_HANDLER_NAMES) {
				setHandler(handlers, config, REMOTE_HANDLER_NAMES[idx]);
			}
			
			if (validator.isEmpty(handlers)) {
				log("至少配置一种处理器(success/failure/handler), 当前找到0项, 终止验证");
				return;
			}
		}
		
		// 获取需要验证的表单项
		log("获取需要验证的表单项");
		var needValidItems = getNeedValidItems(config["remoteUrl"], items);
		
		// 开始验证
		if (config["isSync"]) {
			log("执行同步远程验证");
			doQueueValid(config["remoteUrl"], needValidItems, handlers, true);
		} else {
			log("执行并发远程验证");
			doAsyncValid(config["remoteUrl"], needValidItems, handlers);
		}
	}
	
	/**
	 * 设置远程验证结果处理器
	 * @param handlerContainer 处理器容器
	 * @param config 配置参数
	 * @param handlerName 处理器名称
	 */
	function setHandler(handlerContainer, config, handlerName) {
		var handler = config[handlerName];
		if (validator.isFunction(handler)) {
			handlerContainer[handlerName] = handler;
		}
	}
	
	/**
	 * 异步执行远程验证
	 * @param remoteUrl 远程验证地址
	 * @param needValidItems 需要验证的表单项
	 * @param handlers 处理器集
	 */
	function doAsyncValid(remoteUrl, needValidItems, handlers) {
		log("正在执行异步验证, 下一条验证将不会等待上一条远程响应");
		
		for (var itemName in needValidItems) {
			var itemObj = needValidItems[itemName];
			
			// 获取远程验证地址
			if (validator.isEmpty(remoteUrl)) {
				log("未配置统一请求地址,将从表单项中获取[remoteUrl]属性值作为验证地址");
				remoteUrl = stringUtil.getFullUrl(itemObj["remoteUrl"]);
			}
			
			log("已获取 remoteURL:" + remoteUrl);
			if (validator.isEmpty(remoteUrl)) {
				log("remoteURL 获取失败, 跳过表单项:" + itemName);
				continue;
			}
			
			// itemName, itemObj, remoteUrl, handlers
			var param = getRemoteParam(itemName, itemObj, remoteUrl, handlers);
			
			// 发送Ajax请求
			log("发送远程验证请求");
			sendAjax(param);
		}
	}
	
	/**
	 * 获取远程验证参数
	 * @param itemName 表单项名
	 * @param itemObj 表单项包装对象
	 * @param remoteUrl 调用时配置的remoteURL
	 * @param handlers 回调函数处理器集
	 * 
	 * @param sync_needValidItems 同步验证参数, 剩余需要验证的表单项
	 * @param sync_isContinue 同步验证参数, 是否继续验证
	 * @param handlers 同步验证参数, 处理器集
	 * 
	 * @returns {Object} 发送ajax需要的参数
	 */
	function getRemoteParam(
			itemName, 
			itemObj, 
			remoteUrl, 
			handlers, 
			
			sync_needValidItems, 
			sync_isContinue,
			sync_fn
			){
		// 获取表单值
		var val = itemObj["item"].val();
		
		// 包装参数
		var data = {};
		data[itemName] = val;
		var param = {
			url : remoteUrl,
			type : "POST",
			data : data,
			success : function(data) {
				// 同步验证器参数:
				// 带有注释的是同步验证器需要的参数
				invokeHanlder(
						// handlers, 
						handlers, 
						data, 
						itemObj,
						
						// remoteUrl, 
						remoteUrl,
						// needValidItems,
						sync_needValidItems,
						// isContinue
						sync_isContinue,
						// doQueueValid
						sync_fn
						);
			}
		};
		return param;
	}
	
	/**
	 * 执行远程验证结果处理器
	 * @param handlers 处理器集
	 * @param data 远程响应结果
	 * @param item 表单项
	 * 
	 * @param sync_remoteUrl 同步验证参数, 统一配置
	 * @param sync_needValidItems 同步验证参数, 剩余需要验证的表单项
	 * @param sync_isContinue 同步验证参数, 是否继续验证
	 */
	function invokeHanlder(
			handlers, 
			data, 
			item,
			
			sync_remoteUrl,
			sync_needValidItems,
			sync_isContinue,
			sync_fn
			) {
		var unifyHandlerName = REMOTE_HANDLER_NAMES[0];
		if (validator.isFunction(handlers[unifyHandlerName])) {
			log("执行统一处理器配置:handler");
			handlers[unifyHandlerName](data, item);
			return;
		} 
		
		if(data) {
			log("执行成功处理器配置:success");
			validator.invokeFunction(handlers[REMOTE_HANDLER_NAMES[1]], data, item);
		} else {
			log("执行失败处理器配置:failure");
			sync_isContinue = validator.invokeFunction(handlers[REMOTE_HANDLER_NAMES[2]], data, item);
		}
		
		validator.invokeFunction(
				// doQueueValid(
				sync_fn, 
				// remoteUrl, 
				sync_remoteUrl, 
				// needValidItems, 
				sync_needValidItems, 
				// handlers, 
				handlers, 
				// isContinue
				sync_isContinue
				);
	}
	
	/**
	 * 发送 Ajax 请求
	 * @param param 请求参数
	 */
	function sendAjax(param) {
		log("发送 Ajax, 请求参数");
		param = validator.repairDefaultValue(param, AJAX_DEFAULT_CONFIG);
		
		log(param);
		$.ajax(param);
	}
	
	/**
	 * 列队执行远程验证
	 * @param remoteUrl 远程验证地址
	 * @param needValidItems 需要验证的表单项
	 * @param handlers 处理器集
	 * @param isContinue 是否继续验证
	 * @returns {Boolean} true-继续验证, false-终止后续验证
	 */
	function doQueueValid(remoteUrl, needValidItems, handlers, isContinue) {
		var props=validator.getProps(needValidItems);
		log("执行同步验证, 需要验证的表单项数量:" + props.length);
		/*
		 * needValidItems: 
		 * key-表单项名称, 
		 * value:{
		 *     remoteUrl : {String}，远程验证地址
		 *     item : {jQuery}，表单项
		 * }
		 */
		if (false == isContinue) {
			log("终止验证, 获取继续执行标识:" + isContinue);
			return;
		}
		
		if (0 >= props.length) {
			log("结束验证, 需要验证的表单项数量为0");
			return;
		}
		
		// 添加计数器
		var checkedCount = needValidItems["checkedCount"];
		if (undefined == checkedCount) {
			needValidItems["checkedCount"] = 1;
		} else {
			needValidItems["checkedCount"] ++;
		}

		var itemName = props[0]; 
		log("当前验证第[" + needValidItems["checkedCount"] + "]项:" + itemName);
		if (itemName == "checkedCount") {
			log("已完成所有验证");
			delete needValidItems["checkedCount"];
			return;
		}
		
		// 获取验证项包装对象
		var itemObj = needValidItems[itemName];
		
		// 从列队中移除当前表单项
		delete needValidItems[itemName];
		
		// 验证请求地址
		log("校验[remoteURL]配置");
//			if (validator.isEmpty(remoteUrl)) {
//				log("remoteURL 配置无效, 从表单项获取[remoteURL]属性值");
			remoteUrl = itemObj["remoteUrl"];
			
			if (validator.isEmpty(remoteUrl)) {
				log("未配置[remoteURL], 跳过当前表单项:" + itemName + "继续后续验证");
				doQueueValid(remoteUrl, needValidItems, handlers, isContinue);
				return;
			}
			
			// 修正 remoteURL 值
			remoteUrl = stringUtil.getFullUrl(remoteUrl);
//			}
		log("修复后 remoteURL 值:" + remoteUrl);
		
		var param = getRemoteParam(
					itemName, 
					itemObj, 
					remoteUrl, 
					handlers,
					
					// 以下是同步请求参数
					needValidItems, 
					isContinue,
					doQueueValid
					);
		log("获取 ajax 请求参数");
		log(param);
		
		log("开始发送请求");
		sendAjax(param);
		
//			log("当前验证表单项:" + itemName);
//			var itemObj = needValidItems[itemName];
//			
//			log("验证 remoteURL:" + remoteUrl);
//			if (validator.isEmpty(remoteUrl)) {
//				remoteUrl = itemObj["item"].attr("remoteUrl");
//				log("获取表单项[remoteUrl]配置:" + remoteUrl);
//				
//				if (validator.isEmpty(remoteUrl)) {
//					log("未配置[remoteURL], 跳过当前表单项:" + itemName);
//					continue;
//				} else {
//					remoteUrl = stringUtil.getFullUrl(remoteUrl);
//					log("修复后:" + remoteUrl);
//				}
//			}
//			if (0 < props.length) {
//				return doQueueValid(remoteUrl, needValidItems, handlers, isContinue);
//			}
	}
	
	/**
	 * 获取需要远程验证的表单项
	 * @param remoteUrl 统一远程验证地址, 指定当前值后，将验证所有表单项
	 * @param items 所有表单项
	 * @returns {Array} 需要验证的表单项, 
	 * 			key-表单项名称, 
	 * 			value:{
	 * 				remoteUrl : {String}，远程验证地址
	 * 				item : {jQuery}，表单项
	 * 			}
	 */
	function getNeedValidItems(remoteUrl, items) {
		var needValidItems = [];
		
		if (validator.isEmpty(remoteUrl)) {
			log("未配置统一远程验证地址, 开始筛选包含特定属性表单项: remoteUrl");
			needValidItems = getRemoteValidItems(remoteUrl, items, true);
		} else {
			log("已配置统一远程验证地址，将验证所有表单项");
			needValidItems = getRemoteValidItems(remoteUrl, items, false);
		}

		log("已找到[" + validator.getProps(needValidItems).length + "]条需要远程验证的表单项");
		return needValidItems;
	}
	
	/**
	 * 获取远程验证项
	 * @param remoteUrl 当前远程地址配置项
	 * @param items 所有表单项
	 * @param validUrl 是否要整表单项必须含有 remoteUrl 属性
	 */
	function getRemoteValidItems(remoteUrl, items, validUrl) {
		var needValidItems = {};
		for (var i in items) {
			var item = $(items[i]);
			
			// 总是想要获取正确验证地址
			var tRemoteUrl = remoteUrl;
			if (validator.isEmpty(tRemoteUrl)) {
				item.attr("remoteUrl");
			}
			
			var itemName=item.attr("name");
			if (validator.isNotEmpty(itemName)) {
				needValidItems[itemName] = {
					remoteUrl:tRemoteUrl,
					item:item
				};
			}
		}
		return needValidItems;
	}
	
	/**
	 * 正则表达式验证器
	 * @param config 配置参数
	 * <prev>
	 * regex : {
	 * 		excludeNames : {Array}，需要排除的表单项名称(name)
	 * 		pattern : {String}，正则表达式，如果没有则从表单项中获取 regex 属性作为标准
	 * 		success : {Function}，验证通过回调函数，参数:error:{String}消息(总是空字符串), item:{jQuery}被验证项，
	 * 		failure : {Function}，验证失败回调函数，参数:error:{String}消息(表单项regexError属性), item:{jQuery}被验证项;
	 * 					返回值 false-终止后续验证
	 * 	}
	 * </prev>
	 * @param items 表单项
	 * @returns {Boolean} true-继续其他验证，false-终止其他验证
	 */
	function regexValidator(config, items){
		if (validator.isEmpty(config)) return;
		
		log("触发本地验证器:regex/equalTo/unequalTo");
		var REGEX_PATTERN_PROPERTY_NAME = "regex";
		var REGEX_ERROR_MESSAGE_PROPERTY_NAME = "regexError";
		
		var excludeNames = config["excludeNames"];
		log("过滤排除的表单项:" + (validator.isNotEmpty(excludeNames) ? excludeNames : "无"));
		if (excludeNames instanceof Array) {
			log("排除表单项:" + excludeNames);
			$.each(items, function(idx, item){
				items.splice(idx, 1);
			});
		}
		
		var hasPattern = (!(validator.isEmpty(config["pattern"])));
		log("已配置 Regex pattern :" + hasPattern);
		
		// 默认继续其他验证
		var result = true;
		
		log("开始校验...");
		$.each(items, function(idx, item){
			item = $(item);
			var pattern = (hasPattern ? config["pattern"] : item.attr(REGEX_PATTERN_PROPERTY_NAME));

			log("验证表单项:" + item.attr("name"));
			var isMatched = true;
			var errMsg;
			var hasValidation = false;
			
			if (validator.isNotEmpty(pattern)) {
				log("正则表达式验证表单项");
				// 兼容字符串模式
				// 标签中所有属性都是字符串
				var regexObj = eval(pattern);
				isMatched = ((item.val() != null) && regexObj.test(item.val()));
				if (false == isMatched) {
					errMsg = item.attr(REGEX_ERROR_MESSAGE_PROPERTY_NAME);
				}
				hasValidation = true;
			}
			
			// 其他模式验证：equalTo
			if (isMatched) {
				var result = equalToValid(item);
				if (result) {
					if (!result.flag) {
						isMatched = result.flag;
						errMsg = result.errMsg;
					}
					hasValidation = true;
				}
			}
			
			if (hasValidation) {
				// 执行回调函数
				if (isMatched) {
					log("执行回调函数:success");
					errMsg = "";
					validator.invokeFunction(config["success"], errMsg, item);
				} else {
					log("执行回调函数:failure");
					var isContinue = validator.invokeFunction(config["failure"], errMsg, item);
					if (false == isContinue) {
						log("回调函数[failure]终止后续 Regex 验证, 返回值:" + isContinue);
						result = false;
						return false;
					}
				}
			} else {
				log("无任何验证");
			}
		});
		return result;
	}
	
	/**
	 * 相等或不相等验证，只验证其中一种
	 * @param item 表单项
	 */
	function equalToValid(item) {
		var equalToFn = function(item, attrName) {
			var targetItem = $(stringUtil.getJQueryID(item.attr(attrName)));
			return {
				flag : (0 < targetItem.size() ? targetItem.val() == item.val() : false),
				errMsg : item.attr(attrName + "Error")
			}
		};
		
		var otherValidators = {
			// 匹配相等
			equalTo : function(item){
				var result = equalToFn(item, "equalTo");
				if (result.flag) result.errMsg = "";
				return result;
			},
			// 匹配不相等
			unequalTo : function(item){
				var result = equalToFn(item, "unequalTo");
				result.flag = !result.flag;
				if (result.flag) result.errMsg = "";
				return result;
			}
		};
		
		// 开始匹配
		for (var key in otherValidators) {
			if (validator.isNotEmpty(item.attr(key))) {
				log("执行相等匹配, 匹配模式[" + item.attr("name") + " " + key + " " + item.attr(key) + "]");
				return otherValidators[key](item);
			}
		}
	}
	
	// 仅获取真实数据
	function getRealData(data) {
		data.getRealData = function() {
			var realData = {};
			for (var k in data) {if (!validator.isFunction(data[k])) {realData[k] = data[k];}}
			return realData;
		}
	}
	
	/**
	 * 表单提交
	 * @param data 表单数据
	 */
	function submit(data) {
		if (!data) return;

		// 不提交空数据
		var isEmpty = validator.isEmpty(data);
		if (isEmpty) return;
		
		/*
		 * config 配置项:
		 * url : {String}, 如果当前没有配置则从表单容器中查找 'action'（较高优先级） 属性值 或 'submitUrl' 属性值，
		 * 			'action' 和 'submitUrl' 都没找到时，将拒绝执行表单提交操作;
		 * type : {String}, Ajax 提交类型，默认"POST";
		 * dataType : {String}, 服务器响应格式，默认"JSON";
		 * 
		 * beforeSubmit: {Function} 发送前回调函数，返回false则取消表单提交, 
		 * 				参数：formData-将要发送的表单数据，Form-表单对象
		 * success: {Function} 服务器响应成功后回调函数
		 * afterSubmit : {Function} 表单提交完成后回调函数, 当前函数触发时机：success/error 执行完成后
		 * 其他配置参照 $.ajax() 配置参数
		 */
		data.submit = function(config) {
			var BEFORE_SUBMIT = "beforeSubmit";
			var AFTER_SUBMIT = "afterSubmit";
			
			// 配置校验
			log("校验配置项是否为null或空对象");
			if (validator.isEmpty(config)) return;
			
			// 表单提交地址校验
			log("校验 url 配置");
			var url = getSubmitUrl(config["url"]);
			if (validator.isEmpty(url)) {
				log("获取 url 失败，终止提交");
				return;
			}
			config.url = url;
			log("url 校验通过:" + url);
			
			// 参数修复
			config = validator.repairDefaultValue(config, AJAX_DEFAULT_CONFIG);
			log("配置修复后:");
			log(config);
			
			// 发送请求前
			var beforeSubmit = config[BEFORE_SUBMIT];
			delete data.submit;
			if (beforeSubmit instanceof Function) {
				log("执行请求发送前置回调函数[beforeSubmit]");
				if (false == beforeSubmit(data, $$form)) {
					log("回调函数[beforeSubmit]终止表单提交.");
					return;
				}
			}
			
			// 包装 success 函数和 afterSubmit 函数
			wrapperSuccess(config, AFTER_SUBMIT);
			
			// 发送Ajax请求
			config.data = data;
			deleteOtherEvent(config, [BEFORE_SUBMIT, AFTER_SUBMIT]);
			log("提交表单参数");
			log(config);
			
//				$.ajax(config);
			sendAjax(config);
			log("表单提交完成");
		};
	}
	
	/**
	 * 包装成功回调函数
	 * @param config Ajax 请求参数
	 * @param afterSubmitFnKey 回调函数属性名
	 */
	function wrapperSuccess(config, afterSubmitFnKey) {
		log("包装后置回调函数[afterSubmig]");
		var afterFn = config[afterSubmitFnKey];
		// 成功后回调
		var successFn = config["success"];
		config["success"] = function(data) {
			if (validator.isFunction(successFn)) successFn(data);
			log("调用回调函数[afterSubmit]");
			if (validator.isFunction(afterFn)) afterFn(data);
		}
		
		// 失败后回调
		var errorFn = config["error"];
		config["error"] = function(data) {
			if (validator.isFunction(errorFn)) errorFn(data);
			log("调用回调函数[afterSubmit]");
			if (validator.isFunction(afterFn)) afterFn(data);
		}
	}
	
	/**
	 * 删除 ajax 提交时多余配置项
	 * @param config 当前配置参数
	 * @param propNames 需要删除的属性名
	 */
	function deleteOtherEvent(config, propNames) {
		if (null == propNames || !propNames.length) return;
		if (!config) return;
		
		for (var i in propNames) {
			delete config[propNames[i]];
		}
	}
	
	/**
	 * 获取表单提交地址
	 * @param url 配置地址
	 * @returns {String} 如果配置地址错误，则获取表单容器中配置的目标属性'action'或'submitUrl'
	 */
	function getSubmitUrl(url) {
		if (!validator.isEmpty(url))
			return url;
		
		var attrs = ["action", "submitUrl"];
		for (var idx in attrs) {
			var attr = attrs[idx];
			if (!validator.isFunction(attr)){
				url = $$form.container.attr(attr);
				if (!validator.isEmpty(url)) {
					return stringUtil.getRealUrl(url);
				}
			}
		}
		
		return null;
	}
	
	/**
	 * 填充表单元素到指定对象
	 * @param 	data 数据容器(js)对象
	 * @param 	items 标签列表数组
	 * @param 	filter 前置过滤器
	 * @returns 	{Object} 包含指定表单元素的(js)对象, {name:value/text}
	 */
	function fullData(data, items, filter) {
		if (validator.isEmpty(data)) {
			data = {};
		}
		
		$.each(items, function(i, item) {
			item = $(item);
			var name = item.attr("name");
			if (validator.isEmpty(name)) {
				return true;
			}
			
			var rsVal = getFormItemValue(item);
			if (rsVal) {
				var tmp = {tag:item};
				tmp[name] = rsVal;

				// 当前参数中未配置filter, 从标签中找
				if (validator.isEmpty(filter)) {
					var filter = item.attr("filter");
					try {
						if (!validator.isEmpty(filter)) {

							// 只截取函数名
							if (/^[\w]+\(\)$/.test(filter)) {
								filter = filter.match(/[\w]+/)[0];
							}
							
							filter = eval(filter);
						}
					} catch (e) {
						filter = null;
					}
				}
				
				// filter
				if (validator.isFunction(filter)) {
					tmp = filter(tmp);
				} 
				
				if (tmp) {
					if (tmp === "STOP_2_RETURN") {
						return data;
					}
					
					setValue(data, {
						propName : name,
						value : tmp[name].value
					}, tmp[name].isAppend);
				}
			}
		});
		
		return data;
	}
	
	/**
	 * 为表单对象赋值
	 * @param data 表单对象容器, 目标对象
	 * @param tmp {propName:String, value:String}临时对象
	 * @param appendVal 是否追加到原值后面, 将原值转换为数组对象
	 */
	function setValue(data, tmp, appendVal) {
		var val = data[tmp.propName];
		if (appendVal) {
			// append value
			if (val instanceof Array) {
				// 追加值保存在数组中
				val.push(tmp.value);
			} else {
				if (val == undefined) {
					// 首次赋值
					data[tmp.propName] = tmp.value;
				} else {
					// 第二次赋值时，将数据类型转换为 Array
					var arr = [tmp.value];
					arr.push(val);
					data[tmp.propName] = arr;
				}
			}
		} else {
			// undefined
			data[tmp.propName] = tmp.value;
		}
	}
	
	/**
	 * 获取表单元素标签值
	 * @param tag 表单元素标签
	 * @returns {value:String, isAppend:Boolean}
	 */
	function getFormItemValue(tag) {
		tag = $(tag);
		var VALUE = "value";
		var IS_APPEND = "isAppend";
		var rsData = null;
		
		switch (tag[0].tagName.toLowerCase()) {
		case "select":
		case "textarea":
			rsData = {};
			rsData[VALUE] = tag.val();
			break;
		case "input":
			rsData = {};
			var type = tag[0].type;
			if (-1 < $.inArray(type, ["checkbox", "radio"])) {
				if (tag[0].checked) {
					rsData[IS_APPEND] = true;
					rsData[VALUE] = tag.val();
				} else {
					rsData = null;
				}
			} else if (-1 != $.inArray(type, ["text", "password", "hidden"])) {
				rsData[VALUE] = tag.val();
			} else {
				rsData = null;
			}
			break;
		default:
			break;
		}
		
		return rsData;
	}
	
	/**
	 * 获取表单元素
	 * @param config 配置对象
	 * @returns {Array<jQuery>}  表单元素标签数组
	 */
	function getItems(config) {
		var tagNames = config.include;
		var exclStyle = config.exclByStyle;

		var items = [];
		
		// 获取标签集合
		var container = $$form.container;
		$.each(tagNames, function(i, tagName) {
			$.each(container.find(tagName), function(j, tag) {
				tag = $(tag);
				if (tag.attr("name") && !validator.intersection(tag.attr("class"), exclStyle)) {
					items.push(tag);
				}
			});
		});
		
		// cachedTag
		if (config.cachedTag) {
			$$form.items = items;
		}
		
		return items;
	}

	/**
	 * 修复配置参数
	 * @param config 目标配置
	 * @returns 目标配置
	 */
	function reviseConfig(config) {
		if (!config) {
			config = {};
		} 
			
		if (!validator.isEmpty(findItemDefConf)) {
			for (var prop in findItemDefConf) {
				if (validator.isEmpty(config[prop])) {
					config[prop] = findItemDefConf[prop];
				}
			}
		}
		
		return config;
	}
	
	/**
	 * 修复表单容器
	 * @param container 容器对象
	 * @returns {jQuery} 修复后的容器对象
	 */
	function getContainer(container) {
		var ctt = container.tag;
		
		// jQuery tag
		if (ctt && ctt instanceof jQuery) {
			return ctt;
		}
		
		// ID
		ctt = container.id;
		if (!validator.isEmpty(ctt)) {
			return $(stringUtil.getJQueryID(ctt));
		}
		
		// css + tagName
		var css = container.css;
		if (!validator.isEmpty(css)) {
			var cssTags = $(stringUtil.getJQueryClass(css));
			if (0 == cssTags.size()) {
				return;
			}
			
			// + tagName
			var tagName = container.tagName;
			if (validator.isEmpty(tagName)) {
				return $(cssTags[0]);
			}
			
			tagName = tagName.trim();
			$.each(cssTags, function(i, cssTag) {
				if (cssTag.tagName == tagName) {
					return $(cssTag);
				}
			});
		}
		
		return;
	}
	
	/**
	 * 打印日志
	 * @param msg 消息
	 */
	function log(msg) {
		if ($$form.debug == true) {
			window.console && console.log(msg);
		}
	}
	
	return this;
}