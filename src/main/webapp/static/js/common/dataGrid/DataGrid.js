window.console && window.console.log("DataGrid.js");

/**
 * TODO DataGrid需要重构
 * 获取History数据网格, 使用方法:
 * @param gridCtt {jQuery} 数据网格容器对象
 * @param parseStruct {Boolean} 解析HTML结构中的定义
 * @solution
 * <pre>
 * 1. JSP:
 *   table>thead>tr>th
 *     th[propName=""][listStyle=""][handler="date"][format="yyyy-MM-dd"][style=""][listClass=""][emptyFor="--"]{Title}
 * 
 * 2. 获取实例
 *   a. 通过jQuery扩展获取
 *      var grid = $("table").parent().dataGrid();
 *   b. 通过实例对象获取(<i style="color:#F00;">推荐使用</i>)
 *      var grid = new DataGrid($("table").parent(), true);
 * </pre>
 */
function DataGrid(gridCtt, parseStruct) {
	var operation_Content = "history_operation_content";
	var nothing = "No Record Found";
	var headersConf=[];
	if (true === parseStruct) {headersConf=DataGrid.parseJspStruct($(gridCtt));}
	
	var ROW_PROPERTIES=[{attr:"rowClass", childAttr:"class"}];
	var rowConf=getRowConf($(gridCtt));
	
	var $thisObj = this;
	$thisObj.gridCtt = $(gridCtt);
	$thisObj.heads; // 表头信息
	$thisObj.dataUrl; // 数据请求地址
	$thisObj.filterRow; // 行过滤器
	$thisObj.callback; // 数据网格填充完成后回调函数
	$thisObj.handler={
		date:function(c,v){return new Date(v).format(c["format"]?c["format"]:"yyyy/MM/dd");}	
	}; // 单元格数据处理器
	
	$thisObj.grid = $("<table/>"); // 数据网格容器
	var tabClass = $thisObj.gridCtt.find("table").attr("class");
	if (tabClass) $thisObj.grid.addClass(tabClass);
	$thisObj.gridCtt.html("").append($thisObj.grid);
	
	/**
	 * 获取根URL
	 */
	function getBasePath() {
		var obj = window.location;
		var contextPath = obj.pathname.split("/")[1];
		var basePath = obj.protocol + "//" + obj.host + "/" + contextPath + "/";
		return basePath;
		// return "http://localhost:8080/catalog/";
	}
	var basePath = getBasePath();
	$thisObj.baseUrl = basePath;
	
	// 获取行配置
	function getRowConf($gridCtt) {
		var conf={};
		var tr=$gridCtt.find("thead>tr");
		ROW_PROPERTIES.each(function(prop){
			var childAttrVal=tr.attr(prop["attr"]);
			if (childAttrVal)conf[prop["childAttr"]]=childAttrVal.trim();
		});
		return conf;
	}
	
	/**
	 * 创建表格
	 * @param heads 表头,Array,{propName:数据属性名称, text:表头显示字符串, style:表头单元格样式, listStyle:当前列数据单元格样式}
	 * @param url 数据请求地址, {flag:获取数据成功标志, message:获取数据失败消息, data:数据列表,Array}
	 * @param param 请求参数
	 * @param filterCell 将行添加到数据网格行之前回调函数, 参数:cell(jQuery),cellData{propName,value}, 返回值:true-跳过当前行,false-继续追加
	 * @param filterRow 将行添加到数据网格之前回调函数, 参数:row(jQuery), 返回值:true-跳过当前行,false-继续追加
	 * @param callback 数据网格填充完成后回调函数
	 */
	this.createGrid = function(heads, url, param, filterRow, callback, filterCell) {
		$thisObj.heads = heads;
		$thisObj.dataUrl = url;
		$thisObj.filterRow = filterRow;
		$thisObj.filterCell = filterCell;
		$thisObj.callback = callback;
		
		setHeads();
		setData(param);
		return $thisObj.grid;
	};
	
	/**
	 * 填充网格, 填充行之前调用filterRow回调函数
	 * @param data 数据,Array
	 * @param isAppend true-追加,false-覆盖
	 * @param heads 表头,Array,{propName:数据属性名称, text:表头显示字符串, style:表头单元格样式, listStyle:当前列数据单元格样式}
	 */
	this.fillGrid = function(data, isAppend, heads) {
		if (!data.data)data.data={length:0};
		if (!isAppend) {
			$thisObj.grid.find("tbody").remove();
		}
		
		if (heads instanceof Array) {
			$thisObj.heads = heads;
			setHeads();
		}
		
		var dataCtt = $("<tbody/>").appendTo($thisObj.grid);
		if (!data.data.length) {
			$("<tr/>").append($("<td/>",{
				"html"		: nothing, 
				"colspan"	: $thisObj.heads.length
			}).css({
				"text-align": "center"
			})).appendTo(dataCtt);
		} else {
			$.each(data.data, function(dIdx, rowData) {
				if (!rowData) return true;
				var row = $("<tr/>");
				
				$.each($thisObj.heads, function(hIdx, head) {
					var propName = head.propName;

					//  支持 OGNL 表达式
					var val = getValueByOgnl(rowData, propName);
					if (!val) {val = "";}
					val=handleVal(head, val);

					// 空值替换
					if (!val) {
						var head = $thisObj.heads[hIdx];
						if (validator.isNotEmpty(head)) {
							val = head["emptyFor"];
						}
					}
					
					var cell = $("<td/>",{html:val, "style":head.listStyle, "nowrap":"nowrap"});
					if (head.listClass) cell.addClass(head.listClass);
					
					if (typeof($thisObj.filterCell) == "function") {
						var isSkip = $thisObj.filterCell(cell, {propName:propName, value:val, index:hIdx});
						if (isSkip) {return true;}
					}
					cell.appendTo(row);
				});

				// 处理行样式
				handleRowStyle(row);
				if (typeof($thisObj.filterRow) == "function") {
					var isSkip = $thisObj.filterRow(row, rowData, dIdx);
					// 未定义过滤器, 跳过并执行下次(行数据)循环
					if (isSkip) {return true;}
				}
				
				row.appendTo(dataCtt);
			});
		}
		
		// 填充完数据后回调函数, 每次执行
		if ($thisObj.filled instanceof Function) {$thisObj.filled();}
		
		return $thisObj.grid;
	};
	
	// 处理行样式
	function handleRowStyle(row) {
		ROW_PROPERTIES.each(function(prop){
			var childAttrName=prop["childAttr"];
			var childAttrVal=rowConf[childAttrName];
			if (childAttrVal){row.attr(childAttrName, childAttrVal);}
		});
	}

	/**
	 * 更新指定列数据
	 * @param data 服务器响应数据
	 * @param configData 配置数据
	 * <pre>{
	 * updateName:指定需要刷新的列名，
	 * primaryName:指定唯一匹配属性列名
	 *}</pre>
	 * @param events 事件配置
	 * <pre>{
	 * matchingFn:匹配成功后调用{primaryName:primaryVal，cell:需要更新的列，data:服务器响应的行数据}
	 * unmatchFn:存在不匹配数据行时调用，返回true中断更新，
	 * completed:matchingFn执行完成后调用
	 *}</pre>
	 */
	this.updateLine = function(data, configData, events) {
		// 非空验证
		if (data == null || !(data = data.data) || data.length == 0) {return;}
		if (configData == null) {return;}

		// 参数提取
		var upPropName = configData["updateName"];
		var pkPropName = configData["primaryName"];
		var unmatchFn = events["unmatchFn"];
		if (typeof(unmatchFn) != "function") {unmatchFn = function(){};}
		
		// 验证configData合法性
		// 是否包含需要更新的列和需要匹配的列
		var upHeadIndex = null;
		var pkHeadIndex = false;
		$.each($thisObj.heads, function(idx, hConfig) {
			var propVal = hConfig["propName"];
			if (upPropName == propVal) {upHeadIndex = idx;}
			if (pkPropName == propVal) {pkHeadIndex = idx;}
			if (upHeadIndex!=null && pkHeadIndex!=null) return false;
		});
		if (upHeadIndex==null) {return;}
		if (pkHeadIndex==null) {return;}
		
		// 1. 验证匹配列数据是否一致，
		// 只有当匹配列数据完全一致时，
		// 才能执行更新操作
		var grid = $thisObj.grid;
		
		// 当前页数据与服务器响应的数据行数不一致时
		var currRows = grid.find("tbody>tr");
		if ((currRows.size() != data.length) && unmatchFn()) {return;}
		
		// 2. 遍历是否存在不匹配的关键属性值
		// 获取服务器响应的关键属性值列表 
		var respPkVals = [];
		$.each(data, function(idx, eData){respPkVals.push(eData[pkPropName]);});
		
		// 获取当前页面记录的关键属性值列表,
		// 匹配成功后记录列表
		var matchedList = [];
		var isReturn = false;
		$.each(currRows, function(idx, row){
			row=$(row);
			var td=row.find("td:eq(" + pkHeadIndex + ")");
			var currVal=parseInt(td.text());
			if (-1==$.inArray(currVal, respPkVals) && unmatchFn()){isReturn=true;return false;}
			
			var matched = {};
			matched["cell"] = row.find("td:eq("+upHeadIndex+")");
			matched[pkPropName]=currVal;
			matched["updatePropName"]=upPropName;
			$.each(data, function(idx, eData) {
				if (eData[pkPropName] == currVal) {
					matched["data"] = eData;
					return false;
				}
			});
			matched["datas"] = data;
			matchedList.push(matched);
		});
		if (isReturn){return;}
		
		// 更新指定列数据
		var matchingFn = events["matchingFn"];
		if (typeof(matchingFn) != "function"){
			matchingFn = function(matchedData){
				window.console &&  window.console.info("Invoking defualt matchingFn");
				var cell = $(matchedData["cell"]);
				var rowData = matchedData["data"];
				var text = rowData[matchedData["updatePropName"]];
				cell.html(text);
			};
		}
		$.each(matchedList, function(idx, matched){matchingFn(matched);});
		
		// 调用后续操作
		var completed = events["completed"];
		if (typeof(completed) == "function"){
			completed(grid);
		}
	};
	
	/**
	 * 获取单元格的值
	 * @param propName {String} 配置中的属性名, 即：TH[propName]
	 * @param row {Number|jQuery|Element|Function} 获取哪一行的数据
	 * @returns {String} 指定单元格的值
	 */
	this.getCellValue=function(propName, row){
		// 跳过非法参数
		if(!row && 0!=row){log("非法参数:row");return stringUtil.EMPTY_STRING;}
		if(stringUtil.isEmpty(propName, true)){log("非法参数:propName");return stringUtil.EMPTY_STRING;}
		propName=propName.toString();
		
		// 获取属性在行配置中的下标
		var thOfProp=$thisObj.grid.find("thead>tr>th[propName='"+propName.trim()+"']");
		if(!thOfProp.size())return stringUtil.EMPTY_STRING;
		var propIdx=thOfProp[0].cellIndex;
		
		// 获取行
		var dataRow=null;
		if(!isNaN(row))dataRow=$thisObj.grid.find("tbody>tr:eq('"+row+"')");
		else if(row instanceof Function)dataRow=row();
		else dataRow=$(row);

		if(!dataRow){
			log("获取数据行失败");
			return stringUtil.EMPTY_STRING;
		}else{
			return dataRow.find("td:eq('"+propIdx+"')").text();
		}
	}
	
	/**
	 * 事件注册
	 * @param events 事件集
	 * <pre>
	 * // 数据网格填充完成后回调函数
	 * callback : {Function}
	 * 参数:
	 *  grid : {jQuery}
	 * 
	 * // 行过滤器, 将行添加到数据网格之前回调函数
	 * filterRow : {Function}
	 * 参数:{
	 *   row:{jQuery}
	 *   rowData:{Object}
	 * }
	 * 
	 * // 单元格过滤器, 将行添加到数据网格行之前回调函数
	 * filterCell : {Function}
	 * 参数:{
	 *   cell:{jQuery},
	 *   cellData:{
	 *     propName:{String},
	 *     value:{Object}
	 *   }, 
	 * 返回值:
	 *   true-跳过当前行,false-继续追加
	 *   
	 * // 本次数据填充完成后回调函数, 每次填充完成都会执行
	 * filled : {Function}
	 * </pre>
	 */
	this.registerEvents = function(events) {
		if (validator.isNotEmpty(events)) {
			$thisObj.filterRow = events["filterRow"];
			$thisObj.filterCell = events["filterCell"];
			$thisObj.filled = events["filled"];
			$thisObj.callback = events["callback"];
		}
	};
	
	/**
	 * 指定属性导航, 获取属性值
	 * @param d {Object} 对象
	 * @param p {String} 属性名(ognl)
	 */
	function getValueByOgnl(d, p) {
		if (validator.isEmpty(d) || stringUtil.isEmpty(p, true)) return null;
		p+="";
		
		// 得到属性名
		var spIdx=p.indexOf(".");
		var fp=p.substring(0, spIdx);
		
		// 简单属性
		if (stringUtil.isEmpty(fp, true)) return d[p];
		
		// 得到属性值
		var v=d[fp];
		
		// 递归检测
		if (fp==p) {
			return v;
		} else {
			// 执行递归
			var np=p.substring(spIdx+1);
			return getValueByOgnl(v,np);
		}
	}
	
	/**
	 * 单元格值处理
	 * @param c 表头配置参数
	 * @param v 单元格值
	 */
	function handleVal(c, v) {
		var h=$thisObj.handler[c["handler"]];
		return validator.isFunction(h)?h(c,v):v;
	}
	
	/**
	 * 设置表头
	 */
	function setHeads() {
		$thisObj.grid.find("thead").remove();
		var headCtt = $("<thead/>").appendTo($thisObj.grid);
		var tr = $("<tr/>").appendTo(headCtt);
		$.each($thisObj.heads, function(idx, head) {
			var th = $("<th/>", {
				"propName"	: head.propName,
				"style"		: head.style,
				"nowrap"	: "nowrap", // 表头不换行
			}).append($("<span/>",{
				"html"		: head.text,
			})).appendTo(tr);

			if (typeof title === "string") {
				th.attr({"title":head.text});
			}
		});
	}
	
	/**
	 * 设置数据
	 */
	function setData(param) {
//		loading();
		requestUtil.ajax({
			url		:$thisObj.dataUrl,
			type	:"POST",
			data	:param,
			dataType:"JSON",
			success	:function(data) {
				$thisObj.data = data;
				if (!data.flag) {
					// 填错误信息
					var msgRow = $("<tr/>");
					var msgCell = $("<td/>",{"colspan":$thisObj.heads.length}).html(data.message);
					var tbody = $thisObj.grid.find("tbody");
					if (!tbody.size()) {
						tbody = $("<tbody>");
						tbody.appendTo($thisObj.grid);
					}
					tbody.html("");
					msgRow.append(msgCell).appendTo(tbody);
				} else {
					// 填充数据网格
					$thisObj.fillGrid(data.data, true);
				}

				if (typeof($thisObj.callback) == "function") {
					$thisObj.callback($thisObj.data);	
				}
//				completed();
			},
			error : function(data) {
				log("Invoke function error:setData");
			}
		});
	}
	
	/**
	 * 日志
	 * @param msg 消息
	 */
	function log(msg) {
	}
	
//	var loadingWin = new LoadingWin($thisObj.gridCtt);
//	function loading() {loadingWin.loading();}
//	function completed() {loadingWin.complete();}

	// 是否需要直接解析HTML结构
	if (true === parseStruct) {
		$thisObj.fillGrid({}, false, headersConf);
	}
	
	return this;
}

/**
 * 数据网格定义来自于JSP, 当前函数解析其定义
 * <pre>
 *     &lt;th propName="Property Name:OGNL"
 *             style="Title Style"
 *             liststyle="Column Style"
 *             handler="date"
 *             format="Date Pattern:yyyy/MM/dd"
 *             &gt;Title Name&lt;/th&gt;
 * </pre>
 * @param tag
 * @returns {Array}
 */
DataGrid.parseJspStruct = function(tag) {
	if (!tag) return [];
	var ths = tag.find("table tr:eq(0)>th");
	if (0>=ths.size()) ths=tag.find("table tr:eq(0)>td");
	if (0 >= ths.size()) return [];
	
	var confNames=["propName", "listStyle", "handler", "format", "style", "listClass", "emptyFor"];
	var conf = function(el){var c={text:el.text()};confNames.each(function(v,i){c[v]=el.attr(v);});return c;};
	
	var heads = [];
	ths.each(function(i,el){heads.push(conf($(el)));});
	return heads;
};

/** 
 * 扩展到 jQuery 
 */
(function($) {
	$.fn.dataGrid=function(){var hs=DataGrid.parseJspStruct($(this)),grid=new DataGrid($(this));grid.fillGrid({}, false, hs);return grid;};
})(jQuery);