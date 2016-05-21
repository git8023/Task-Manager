$.pager = {
	style : {
		// 主容器
		mainContainer : "pg_container",
		// 触发器按钮
		trigger : "pg_btn",
		// 上一页
		prev : "prev",
		// 下一页
		next : "next",
		// 页码
		number : "pg_num",
		// 非触发器页码
		NaN : "pg_nan",
		// 激活页码
		current : "current"
	},
	// 页大小选项
	sizeList : [10,20,50],
	// 页码数量
	numberCount : 5,
	// 是否显示日志
	showLog : true
};

/**
 * <style>
 * red{color:#F00}
 * </style>
 * 数据网格页脚
 * <pre><b>最少配置:</b>
 * JSP:
 *     &lt;div class="grid_pager" 
 *          <red>url</red>="task/getAttachments.cmd"
 *          <red>current</red>="1"
 *          <red>reload</red>="true"
 *          <red>pageSizes</red>="10,15,50"
 *          <red>numberCount</red>="5"
 *          <red>reloadBySize</red>="true"/&gt;
 * 初始化：
 * <red>pager.init({
 *     // 请求发送前添加请求参数
 *     beforeSend : function(data){</red>
 *          var param = getTaskSearchCondition(true);
 *          param.pageIndex = data.pageIndex;
 *          param.pageSize = data.pageSize;
 *          return param;
 *     <red>},
 *     // 获取数据后, 处理返回的数据;
 *     响应格式 : {
 *         flag : {Boolean},
 *         message : {String},
 *         data : {
 *             pageSize : {Number},  // 页大小
 *             pageIndex : {Number}, // 当前页
 *             pageTotal : {Number}, // 总页数
 *             beginNum : {Number},  // 开始页码
 *             endNum : {Number},    // 结束页码
 *             rowCount : {Number},  // 总页数
 *             data : {Object}       // 分页数据
 *         }
 *     }
 *     afterClick : function(index, rData) {</red>
 *         // var grid=$(".data_grid").dataGrid();
 *         // 填充数据 
 *         grid.fillGrid(rData.data);
 *     <red>}
 * });</red>
 * </pre>
 * @param pagerCtt 页脚容器
 * @param showLog 是否显示日志信息
 */
function Pager(pagerCtt, showLog) {
	// 空间可配置参数
	var CONF_ATTRS = ["url", "current", "reload", "pageSizes", "numberCount", "reloadBySize"];
	// 事件列表
	var EVENT_NAMES = ["beforeClick", "afterClick", "completed", "beforeSend"];
	// 非数值页码
	var OTHER_NUMBER = "...";
	
	var $thisObj = this;
	$thisObj.pagerCtt = $(pagerCtt);
	
	/** 配置项 */
	$thisObj.conf = {};

	///** 主容器 */
	//$thisObj.pager = null;
	
	/** 事件列表 */
	$thisObj.events = {};
	
	/**
	 * 初始化页脚
	 * @param conf 初始化配置参数
	 * <pre>
	 * // 数据获取请求地址, 页脚容器中同名属性优先级更高
	 * url : {String}
	 * 响应格式 : {
	 *   flag : {Boolean},
	 *   message : {String},
	 *   data : {
	 *     pageSize : {Number},  // 页大小
	 *     pageIndex : {Number}, // 当前页
	 *     pageTotal : {Number}, // 总页数
	 *     beginNum : {Number},  // 开始页码
	 *     endNum : {Number},    // 结束页码
	 *     rowCount : {Number},  // 总页数
	 *     data : {Object}       // 分页数据
	 *   }
	 * }
	 * 
	 * // 可选页大小(引文逗号分割","), 页脚容器中同名属性优先级更高, 默认值: 10,20,50
	 * pageSizes : {Array}-{Number}
	 * 
	 * // 改变页大小时重新加载数据, 页脚容器中同名属性优先级更高, 默认值:true
	 * reloadBySize : {Boolean}
	 * 
	 * // 当前激活的页码, 页脚容器中同名属性优先级更高, 默认值:1
	 * <span style="text-decoration:line-through;">initIndex : {Number}</span>
	 *  
	 * // 页码激活样式, 页脚容器中同名属性优先级更高, 默认值: current
	 * current : {String} 
	 * 
	 * // 是否允许重复加载数据, 页脚容器中同名属性优先级更高, 默认值:false
	 * reload : {Boolean}
	 * 
	 * // 需要显示的页码数量, 页脚容器中同名属性优先级更高, 默认值:5
	 * numberCount : {Number} 
	 * 
	 * // 页码点击前触发 
	 * beforeClick : {Function} 
	 * 参数:{
	 *   index:{Number}, 
	 *   next:{Number}
	 * }, 
	 * 返回值:
	 *   false-截断执行
	 * 
	 * // 点击页码并从远端得到数据后触发
	 * afterClick : {Function} 
	 * 参数:{
	 *   index:{Number}, // 当前页码
	 *   data:{Object} // 远程响应数据
	 * }
	 * 
	 * // 页脚创建完成后触发, 该函数仅执行一次
	 * completed : {Function}
	 * 参数:{
	 *   pager : {jQUery}
	 * }
	 * 
	 * // 每次请求发送前触发
	 * beforeSend : {Function}
	 * 参数:{
	 *   param : {JSON} // 默认请求参数
	 * },
	 * 返回值:
	 *   发送Ajax请求时需要的参数,
	 *   如果返回值为[undefined|null]则使用默认值,
	 *   否则将使用处理后的返回值
	 * 
	 * </pre>
	 */
	this.init = function(conf) {
		conf = conf||{};
		getConf(conf);
		getEvent(conf);
		validConf();
		$thisObj.create();
		
		log("The footer has been created.");
		log("Executing the callback function:completed");
		$thisObj.events["completed"]($thisObj.pager);
	};
	
	/**
	 * 创建页脚
	 */
	this.create = function() {
		/* 
		 * [pageSize]{[prev][1] ... [11][12][*13] ... [25][next] }
		 */
		var pager = createBlock("", $.pager.style.mainContainer);
		$thisObj.pager = pager;
		$thisObj.pagerCtt.html("").append($thisObj.pager);
		
		// pageSize
		createPageSize($thisObj.conf["pageSizes"]).appendTo(pager);
		
		// prev
		createBlock("&lt;", $.pager.style.trigger, $.pager.style.prev)
			.appendTo(pager)
			.unbind("click")
			.click(toPage);
		
		// next
		createBlock("&gt;", $.pager.style.trigger, $.pager.style.next)
			.appendTo(pager)
			.unbind("click")
			.click(toPage);
		
		// 默认页码1
		createNum(1);
		
	};
	
	/**
	 * 设置或获取当前页码
	 * @param currentIndex 需要设置的页码, 当前值非法时则获取当前页码
	 */
	this.current = function(currentIndex) {
		var isNum = !isNaN(currentIndex);
		
		if (isNum) {
			// 设置页码
			createNum(currentIndex);
		} else {
			// 获取页码
			var currTag = $thisObj.pager.find("." + $.pager.style.current);
			var currNum = parseInt(currTag.text());
			if (isNaN(currNum)) {
				log("当前页码非法");
				currNum = 0;
			}
			return currNum;
		}
	};
	
	/**
	 * 重新加载当前页面数据
	 */
	this.reload = function(){
		var currIdx = $thisObj.current();
		createNum(currIdx);
	};
	
	/**
	 * 创建页大小选项列表
	 * @param arr 页大小列表
	 */
	function createPageSize(arr) {
		var sl = $("<select/>", {"name" : "pageSize"})
		// 监听页大小改变
		if ($thisObj.conf["reloadBySize"])sl.unbind("change").change(function(){$thisObj.reload();});
		arr.each(function(item, i){$("<option/>", {"value":item,"html":item}).appendTo(sl);});
		return $("<div/>").addClass("pg_size").append(sl);
	}

	/**
	 * 创建页码
	 * @param index 当前页码
	 */
	function createNum(index) {
		log("执行前置函数:beforeClick");
		var bfrClick = $thisObj.events["beforeClick"];
		/*
		 * 参数:{
		 *   index:{Number}, 
		 *   next:{Number}
		 * }, 
		 * 返回值:
		 *   false-截断执行
		 */
		if (false == bfrClick($thisObj.current(), index)) return;

		log("Perform event functoin: beforeSend");
		var beforeSend = $thisObj.events["beforeSend"];
		var param = getUrlParam(index);
		var tmpParam = beforeSend(param);
		param = (tmpParam || param);
		
		requestUtil.jsonAjax({
			url : $thisObj.conf.url,
			data : param,
//			sync : false,
			type : "POST",
			success : function(data) {
				if (data.flag) {
					$thisObj.data = data.data;
					// 按照 url 返回值规则解析
					/*
			 		 * 响应格式 : {
					 *   flag : {Boolean},
					 *   message : {String},
					 *   data : {
					 *     pageSize : {Number},  // 页大小
					 *     pageIndex : {Number}, // 当前页
					 *     pageTotal : {Number}, // 总页数
					 *     beginNum : {Number},  // 开始页码
					 *     endNum : {Number},    // 结束页码
					 *     rowCount : {Number},  // 总页数
					 *     data : {Object}       // 分页数据
					 *   }
					 * }
					 */
					createNumAfter();
					
					/*
					 * 参数:{
					 *   index:{Number}, // 当前页码
					 *   data:{Object} // 远程响应数据
					 * }
					 */
					var afterClick = $thisObj.events["afterClick"];
					afterClick(index, data);
					
				} else {
					log(data.message);
				}
			}
		});
	}
	
	/**
	 * 获取请求
	 * @param pageIndex 页码
	 */
	function getUrlParam(pageIndex) {
		var pageSize=$thisObj.pager.find("select[name='pageSize']:eq(0)").val();
		return {pageSize:pageSize, pageIndex:pageIndex};
	}
	
	/**
	 * 创建页码
	 */
	function createNumAfter() {
		// 按照 url 返回值规则解析
		/*
 		 * 响应格式 : {
		 *   flag : {Boolean},
		 *   message : {String},
		 *   data : {
		 *     pageSize : {Number},  // 页大小
		 *     pageIndex : {Number}, // 当前页
		 *     pageTotal : {Number}, // 总页数
		 *     beginNum : {Number},  // 开始页码
		 *     endNum : {Number},    // 结束页码
		 *     rowCount : {Number},  // 总页数
		 *     data : {Object}       // 分页数据
		 *   }
		 * }
		 */
		var data = $thisObj.data;
		var index = data.pageIndex, total = data.pageTotal;
		
		var NUM_OTHERS = "...";
		var nums = [];
		nums.push(1);
		// total=10, index=4
		// [<] [1] ... [3] [4] [5] ... [10] [>]
		
		// total=10, index=1,2,3
		// [<] [1] [2] [3] [4] ... [10] [>]
		
		// total=10, index=8,9,10
		// [<] [1] ... [7] [8] [9] [10] [>]

		var numCnt = $thisObj.conf["numberCount"];
		var offset = parseInt(numCnt / 2);
		// 计算开始页码
		var begin = index - offset;
		// 计算结束页码
		var end = index + offset;
		// 修复页码
		if (1 > begin) {
			end += 1 - begin;
			begin = 1;
		}
		if (total < end) {
			begin -= end - total;
			end = total;
			if (1 > begin) {
				begin = 1;
			}
		}
		
		// 常规页码
		var tmpNums = [];
		for (var i=begin; i<=end; i++) {
			tmpNums.push(i);
		}
		
		// 开始页码 > 2, 则包含[...]
		if (2 < begin) {
			tmpNums.shift();
			nums.push(OTHER_NUMBER);
		}
		
		// 添加显示页码
		if (1 == tmpNums[0]) nums.shift();
		if (2 == tmpNums[0] && tmpNums.end()<total) {tmpNums.splice(0, 1, OTHER_NUMBER);}
		for (var i=0; i<tmpNums.length; i++) {nums.push(tmpNums[i]);}

		/*
		 * 当前显示的页码数量比总页码多,
		 * 且最后一位页码正好比最大页码少1,
		 * 那么最后一位因该是非数值页码
		 */
		var tmlLen = nums.length;
		if (($.pager.numberCount < tmlLen) && (total - 1 == nums.end())) {
			nums.splice(tmlLen - 1, 1, OTHER_NUMBER, total);
		}
		
		// 结束页码 < total - 1, 则包含[...]
		if (total - 1 > end) {
			// 省略号位置
			nums.pop();
			nums.push(OTHER_NUMBER);
			nums.push(total);
		}
		
		// 添加页码
		updateNums(nums, index);
	}
	
	/**
	 * 更新页码
	 * @param nums 页码列表
	 * @param index 当前页码
	 */
	function updateNums(nums, index) {
		// [prev] [...] [3] [4] [5] [...] [10] [next]
		clearNum();
		var next = $thisObj.pager.find("." + $.pager.style.next);
		for (var i=0; i<nums.length; i++) {
			var num = nums[i];
			var btn = $("<div/>",{"html":num});
			if (isNaN(num)) {
				btn.addClass($.pager.style.NaN);
			} else {
				btn.unbind("click")
					.click(toPage)
					.addClass($.pager.style.trigger)
					.addClass($.pager.style.number);
				if (index == num) {
					btn.addClass($.pager.style.current);
				}
			}
			next.before(btn);
		}
	}
	
	/**
	 * 清理过时页码
	 */
	function clearNum() {
		$thisObj.pager.find("." + $.pager.style.number).remove();
		$thisObj.pager.find("." + $.pager.style.NaN).remove();
	}
	
	/**
	 * 页面跳转
	 */
	function toPage() {
		var $this = $(this);
		var curr = $thisObj.current();
		var num = parseInt($this.text());
		var isNum = !isNaN(num);
		
		if (!isNum) {
			num = getNextNum(curr, $this);
		}

		// 验证是否需要重新加载数据
		if (curr == num) {
			var isReload = eval($thisObj.conf["reload"]);
			if (!isReload) {
				log("Skip request, Configured cannot repeat load the same data[reload=" + isReload + "].");
				return false;
			}
		}
		
		createNum(num);
	}
	
	/**
	 * 获取下一个页码
	 * @param curr 当前页码
	 * @param btn 被点击的按钮
	 */
	function getNextNum (curr, btn){
		var toNum = -1;
		
		var clazz = btn.attr("class");
		var prevRegex = eval("/" + $.pager.style.prev + "/");
		var nextRegex = eval("/" + $.pager.style.next + "/");

		if (prevRegex.test(clazz)) {
			// 上一页
			toNum = (curr==1 ? 1 : curr-1);
		} else {
			// 下一页
			var maxNum = $thisObj.data.pageTotal;
			toNum = (curr>=maxNum ? maxNum : curr+1);
		}
		return toNum;
	}
	
	/**
	 * 创建块结构
	 * @param arguments1-样式表1, arguments2-样式表2, ...argumentsN-样式表N
	 */
	function createBlock() {
		var block = $("<div/>");
		var len = arguments.length;
		if (1 <= len) {
			block.html(arguments[0]);
			for (var i=1; len>1&&i<len; i++) {
				var clazz = arguments[i];
				if (!stringUtil.isEmpty(clazz, true)) {
					block.addClass(clazz);
				}
			}
		}
		return block;
	}
	
	/**
	 * 获取事件
	 * @param conf 配置参数
	 */
	function getEvent(conf) {
		EVENT_NAMES.each(function(name, index){
			var event = conf[name];
			if (!validator.isFunction(event)) {
				event = function(){log("Invoke default event:" + name);};
			}
			$thisObj.events[name] = event;
		});
	}
	
	/**
	 * 配置项验证, 至少包含url
	 */
	function validConf() {
		var url = $thisObj.conf["url"];
		if (stringUtil.isEmpty(url, true)) {
			$thisObj.conf = undefined;
			throw new Error("缺少必要配置[url], 页脚初始化失败");
		}
		
		validator.repairDefaultValue($thisObj.conf, $.pager.style);
		var numCnt = $thisObj.conf["numberCount"];
		if (stringUtil.isEmpty(numCnt, true) || 1 > numCnt) {
			numCnt = $.pager.numberCount;
		}
		$thisObj.conf["numberCount"] = numCnt;
		
		log("初始化成功:");
		log($thisObj.conf);
	}
	
	/**
	 * 获取配置项
	 * @param conf 调用时配置项
	 */
	function getConf(conf) {
		CONF_ATTRS.each(function(prop, i){
			i = parseInt(i);
			if (isNaN(i)) return;
			var val = pagerCtt.attr(prop);
			val = (val?val.trim():null);
			if (!val || 0>=val.length) {val = conf[prop];val = (val?val.trim():null);}
			$thisObj.conf[prop] = validator.parseValue(val);
		});
		
		// 转换页大小列表
		var sizeListStr = $thisObj.conf["pageSizes"];
		var sizeList = [];
		if (sizeListStr) {
			sizeListStr = sizeListStr.trim();
			sizeListStr.split(",").each(function(size, i){size=size.trim();if(!isNaN(size))sizeList.push(size);});
			$thisObj.conf["pageSizes"] = sizeList;
		} else {
			$thisObj.conf["pageSizes"] = $.pager.sizeList;
		}
	}
	
	/**
	 * 日志记录
	 * @param msg 消息
	 */
	function log(msg) {
	}
	
	return this;
}
	
(function($){
	$.fn.pager = function(showLog){return new Pager($(this), showLog)};
})(jQuery);