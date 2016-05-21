/**
 * OGNL表达式解析工具
 */
function OgnlUtil() {
	var $thisObj = this;
	
	/**
	 * 获取对象的值
	 * @param data 数据对象
	 * @param ognl ognl表达式
	 */
	this.getValue = function(data, ognl) {
		var keys = ognl.split(".");
		if (1 == keys.length) {
			// 非数组
			var regex = /\[/;
			if (!regex.test(ognl)) {
				return data?data[ognl.trim()]:data;
			} else {
				return getArrOgnlVal(data, ognl);
			}
		} else {
			var idx = ognl.indexOf(".");
			var key = ognl.substring(0, idx);
			return $thisObj.getValue(data[key], ognl.substring(idx + 1));
		}
	}
	
	/**
	 * 获取数组对象的值
	 * @param data 数据对象
	 * @param ognl ognl表达式
	 */
	function getArrOgnlVal(data, ognl) {
		// 获取数组对象
		var sIdx=ognl.indexOf("["), arrK=ognl.substring(0, sIdx),arr=data[arrK];
		var idxStr = ognl.substring(sIdx);
		var idxReg = /^(\[\d+\])+$/;
		if (!idxReg.test(idxStr)) throw new Error("非法下标索引:" + idxStr);
		
		// 获取值[1], [0][2]...
		var idxes = idxStr.split("][");
		if (1 == idxes) {
			// 一维数组
			var idx = idxes.replace("[","").replace("]","");
			return arr[parseInt(idx)];
		} else {
			// 多维数组
			var val=arr;
			idxes.each(function(v){
				var v = v.replace("[","").replace("]","");
				val=val[parseInt(v)];
			});
			return val;
		}
	}
}
var ognlUtil = new OgnlUtil();