/**
 * 类型验证工具
 * @author Huang·Yong(邮箱:jinlong_8023@163.com)
 * @version 0.1 beta
 * @date 2015-9-4
 */
function Validator() {
	var $$validator = this;
	
	/**
	 * 参数是否为可执行函数
	 * @param obj 参数对象
	 * @returns {Boolean} true-是函数, false-不是函数, undefined-不是对象参数
	 */
	this.isFunction = function(obj) {
		if (obj == undefined || obj == null) {
			return;
		}
		return (obj instanceof Function);
	}
	
	/**
	 * 对象未包含属性, 或字符串未初始化, 或数组长度为0
	 * @param obj 目标字符串
	 * @returns {Boolean} false-对象已初始化, true-对象未初始化
	 */
	this.isEmpty = function(obj) {
		var isEmpty = (null==obj || undefined==obj);
		if (isEmpty) return true;
		if (obj instanceof Array) return (obj.length <= 0);
		
		switch (typeof(obj)) {
		case "string":
		case "array":
			isEmpty = (obj.length <= 0);
			break;
		case "object":
			for (var i in obj) {
				if ((null!=obj[i]&&undefined!=obj[i]) && !(obj[i] instanceof Function)) {
					return false;
				}
			}
			break;
		default:
			break;
		}
		return isEmpty;
	}
	
	/**
	 * 对象不是null或空字符串，或空数组，或无属性对象
	 * @param target
	 */
	this.isNotEmpty = function(target) {
		return (!($$validator.isEmpty(target)));
	};
	
	/**
	 * 验证两个对象是否有交集属性或元素值
	 * @param obj1 被验证对象1
	 * @param obj2 被验证对象2
	 * @returns {Boolean} true-存在交集, false-不存在交集
	 */
	this.intersection = function(obj1, obj2) {
		if (!($$validator.isEmpty(obj1) || $$validator.isEmpty(obj2))) {
			for (var prop in obj2) {
				if (obj1[prop] === obj2[prop]) {
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * 默认值修复
	 * @param target 目标对象
	 * @param defaultVal 默认值对象
	 * @returns {Object} 修复后对象
	 */
	this.repairDefaultValue = function(target, defaultVal) {
		var rObj = {};
		if (null == target) target = {};
		if (null == defaultVal) defaultVal = {};
		
		// 复制目标属性
		for (var key in target) {
			rObj[key] = target[key];
		}
		
		// 修复默认值
		for (var key in defaultVal) {
			if (null == rObj[key]) {
				rObj[key] = defaultVal[key];
			}
		}
		
		return rObj;
	}
	
	/**
	 * 执行函数
	 * @param 参数：
	 * <pre>
	 * 第一个参数：fnObj 函数对象，当前参数不是函数将不会执行
	 * 第二个参数：invokeParam1 执行函数需要的参数1
	 * 第三个参数：invokeParam2 执行函数需要的参数2
	 * ...
	 * 第N个参数：invokeParamN 执行函数需要的参数N
	 * </pre>
	 */
	this.invokeFunction = function(fnObj) {
		var argsLen = arguments.length;
		if (argsLen > 0) {
			if (this.isFunction(fnObj)) {
				var targetFnArgsLen = fnObj.length;
				
				// 参数拼接
				var argsStr = "";
				
				// 排除第一个参数：fnObj
				var realArgsLen = targetFnArgsLen + 1;
				
				// 拼接参数
				for (var i=1; i<realArgsLen; i++) {
					var arg = arguments[i];
					if (typeof arg == "string") {
						argsStr += ",'" + arg.replace(/'/g,"\\'") + "'";
					} else {
						argsStr += ",eval(arguments[" + i + "])";
					}
				}
				
				// 校正参数字符串
				if (argsStr.length > 1) {
					argsStr = argsStr.substring(1);
				}
				
				// 执行函数
				return eval("fnObj(" + argsStr + ")");
			}
		}
	};
	
	/**
	 * 获取对象的所有属性
	 * @param obj 目标对象
	 * @returns {Array} 属性列表,对象非法(null/undefined)时总是返回空数组
	 */
	this.getProps = function(obj) {
		var props = [];
		if ($$validator.isNotEmpty(obj)) {
			for (var prop in obj) {
				props.push(prop);
			}
		}
		return props;
	};
	
	/**
	 * 将字符串转换为 JSON 对象
	 * @param jsonObj JSON 字符串
	 * @returns {JSON} JSON 对象
	 */
	this.toJSON = function(jsonObj) {
		if (null!=jsonObj && undefined!=jsonObj) {
			var tObj = {};
			var regExp = /^[\[|\{]/;
			var type = (typeof jsonObj);
			switch(type) {
			case "object" : 
				tObj = jsonObj; 
				break;
				
			case "string" :
				if (regExp.test(jsonObj))tObj=eval("("+jsonObj+")");
				break;
				
			default : 
				tObj = undefined;
			}
			return tObj;
		}
		
		return jsonObj;
	}
	
	/**
	 * 字符串值解析
	 * @param value 字符串值, {true|false}-Boolean, {0~N}-Number, 其他值原样返回
	 * @returns {Object} 解析后数据
	 */
	this.parseValue = function(value) {
		var isNumber = /^\d+(\.\d*)?[f|d|l]?$/ig;
		var isBoolean = /^true|false$/ig;
		if (typeof value === "string") {
			if (isNumber.test(value)) return Number(/f|d|l$/.test(value)?value.deleteAt(-1):value);
			if (isBoolean.test(value)) return eval(value);
		}
		return value;
	};
	
	return this;
}
var validator = new Validator();