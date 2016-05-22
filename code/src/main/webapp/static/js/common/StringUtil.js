/**
 * 字符串工具
 */
function StringUtil() {
	var $thisObj = this;
	$thisObj.EMPTY_STRING="";
	
	/**
	 * 获取以"#"开头的ID
	 * @param id ID号
	 * @returns 包含"#"的ID号
	 */
	this.getJQueryID = function(id) {
		return getString("#", id);
	}
	
	/**
	 * 获取以"."开头的class样式字符串
	 * @param cssClass class样式
	 * @returns 以"."开头的class样式字符串
	 */
	this.getJQueryClass = function(cssClass) {
		return getString(".", cssClass);
	}
	
	/**
	 * 验证字符串是否未定义或长度为0
	 * @param target 目标字符串
	 * @param isTrim 计算长度时是否除去前后空格 
	 */
	this.isEmpty = function(target, isTrim) {
		if (undefined!=target && null!=target) {
			if (isTrim && (typeof target==="string"))target=target.trim();
			return target.length == 0;
		}
		return true;
	}
	
	/**
	 * 验证参数字符串是否非空
	 * @param target 目标字符串
	 * @param isTrim 计算长度时是否除去前后空格 
	 */
	this.isNotEmpty = function(target, isTrim) {
		return !($thisObj.isEmpty(target, isTrim));
	}
	
	/**
	 * 首字母转换大写
	 * @param target 目标字符串
	 */
	this.firstUpperCase = function(target) {
		if ($thisObj.isEmpty(target, true)) {
			return target;
		}
		return target.substring(0, 1).toUpperCase() + target.substring(1).toLowerCase();
	};
	
	/**
	 * 获取项目根路径
	 */
	this.getBaseUrl = function() {
	    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	    var curWwwPath=window.document.location.href;
	    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	    var pathName=window.document.location.pathname;
	    var pos=curWwwPath.indexOf(pathName);
	    //获取主机地址，如： http://localhost:8083
	    var localhostPaht=curWwwPath.substring(0,pos);
	    //获取带"/"的项目名，如：/uimcardprj
	    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	    return(localhostPaht+projectName+"/");
	}
	
	/**
	 * 获取真实 URL 路径
	 */
	this.getRealUrl = function(url) {
		if ($thisObj.isEmpty(url, true)) return null;
		url = url.replace("\\", "/");
		var isFullUrl = /^http:\/\/|https:\/\//.test(url);
		if (!isFullUrl) {
			if (/^\//.test(url)) {
				url = url.substring(1);
			}
			url = $thisObj.getBaseUrl() + url;
		}
		return url;
	}
	
	/**
	 * 设置字符串最大长度, 超出最大长度将使用后缀
	 * @param str 目标字符串
	 * @param maxLen 最大长度
	 * @param suffix 后缀
	 * @deprecated 当前接口已废弃, 当前接口容易让调用者混淆;
	 * 	相同功能应调用{@link stringUtil.maxLen(String, Number, String)}
	 */
	this.setLength = function(str, maxLen, suffix) {
		return $thisObj.maxLen(str, maxLen, suffix);
	}

	/**
	 * 设置字符串最大长度, 超出最大长度将使用后缀
	 * @param str {String} 目标字符串
	 * @param maxLen {Number} 最大长度
	 * @param suffix {String} 后缀, Default(...)
	 */
	this.maxLen=function(str, maxLen, suffix){
		suffix=suffix||"...", maxLen=maxLen||15;
		var len=str.length, offset=suffix.length;
		var maxLenLawful = (maxLen>0) && (maxLen>offset);
		var tooLong = maxLenLawful && $thisObj.isNotEmpty(str, true) && len>maxLen;
		return (tooLong?(str.substring(0, maxLen-offset)+suffix):str);
	}
	
	/**
	 * 转换为指定字符串
	 * @param prefix 前缀
	 * @param val 目标字符串
	 * @returns 带有唯一指定前缀的字符串
	 */
	function getString(prefix, val) {
		if (!val || typeof(val) != "string") return prefix;
		var lastIdx = val.lastIndexOf(prefix);
		return prefix + (val.substring(lastIdx + 1, val.length));
	}
	
	return this;
}
var stringUtil = new StringUtil();
