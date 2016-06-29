/**
 * 日期格式化
 * 
 * @param format
 *            格式化规则
 */
Date.prototype.format = function(format) {
    var time = this.getTime();
    if (isNaN(time)) { return; }

    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
    // millisecond
    };

    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/**
 * 解析日期字符串
 * 
 * @param dateStr
 *            {String} 日期字符串
 * @param pattern
 *            {String} 字符串规则, 默认值:yyyy-MM-dd
 * @returns {Date} 成功解析后返回日期对象, 解析失败返回null
 */
Date.prototype.parseDate = function(dateStr, pattern) {
    var metaPatterns = {
        metas: {
            y: {
                name: "Year",
                beginIndex: -1,
                pLength: 0,
                original: "",
                setYear: function(date) {
                    date.setFullYear(this.original || 0);
                }
            },
            M: {
                name: "Month",
                beginIndex: -1,
                pLength: 0,
                original: "",
                setMonth: function(date) {
                    date.setMonth((!this.original.length || isNaN(this.original)) ? 0 : (this.original - 1));
                }
            },
            d: {
                name: "Day",
                beginIndex: -1,
                pLength: 0,
                original: "",
                setDay: function(date) {
                    date.setDate(this.original || 0);
                }
            },
            h: {
                name: "Hour",
                beginIndex: -1,
                pLength: 0,
                original: "",
                setHour: function(date) {
                    date.setHours(this.original || 0);
                }
            },
            m: {
                name: "Minute",
                beginIndex: -1,
                pLength: 0,
                original: "",
                setMinute: function(date) {
                    date.setMinutes(this.original || 0);
                }
            },
            s: {
                name: "Second",
                beginIndex: -1,
                pLength: 0,
                original: "",
                setSecond: function(date) {
                    date.setSeconds(this.original || 0);
                }
            },
            // FIXME
            S: {
                name: "Millisecond",
                beginIndex: -1,
                pLength: 0,
                original: "",
                setMillisecond: function(date) {
                    date.setMilliseconds(this.original || 0);
                }
            },
        },
        setValues: function(date) {
            this.metas.y.setYear(date);
            this.metas.M.setMonth(date);
            this.metas.d.setDay(date);
            this.metas.h.setHour(date);
            this.metas.m.setMinute(date);
            this.metas.s.setSecond(date);
            this.metas.S.setMillisecond(date);
        },
        validate: function(orgiDateStr, tgtPattern) {
            var NUMBER_PATTERN = "\\d";
            var replacedPattern = (tgtPattern || "") + "";
            if (!replacedPattern) return false;

            // 替换pattern中年月日时分秒的字符为\d
            var metasStr = [];
            for ( var meta in this.metas) {
                metasStr.push(meta);
            }

            replacedPattern = replacedPattern.replace(/\//g, "\\/");
            metasStr.each(function(meta) {
                replacedPattern = replacedPattern.replace(eval("(/" + meta + "/g)"), NUMBER_PATTERN);
            });
            replacedPattern = replacedPattern.replace(/\\\\/g, "\\").replace(/[\/]/g, "\/");

            // 使用替换后的pattern校验dateStr是否有效
            var result = eval("(/^" + replacedPattern + "$/)").test(orgiDateStr);

            if (result) {
                var _this = this;
                // 校验通过, 按顺序设置元规则开始索引和值
                // > 按元规则分组
                var metasGroup = metasStr.join("");
                // /([yMdhms])\1*/g: 提取的元规则
                var groupRegExp = eval("(/([" + metasGroup + "])\\1*/g)");
                // 替换掉日期字符串分隔符字符
                var onlyNumberDateStr = orgiDateStr.replace(/[^\d]+/g, "");
                var orgiValIdx = 0;
                // 把原pattern中的年月日时分秒解为有序的正则表达式数组,
                tgtPattern.match(groupRegExp).each(function(metaGroup) {
                    // :> 设置每个组的 beginIndex, pLength, original
                    var meta = _this.metas[metaGroup[0]];
                    meta.beginIndex = tgtPattern.indexOf(metaGroup);
                    meta.pLength = metaGroup.length;
                    meta.original = onlyNumberDateStr.substring(orgiValIdx, (orgiValIdx + meta.pLength));
                    orgiValIdx += meta.pLength;
                });
            }
            return result;
        }
    };

    // 解析完成后按Date构造顺序构建目标Date对象
    var success = metaPatterns.validate(dateStr, pattern);
    console.log(success);
    if (!success) { return null; }

    var date = new Date();
    metaPatterns.setValues(date);
    return date;
};
/**
 * 两个日期相减求差值, 当前日期毫秒数 - 目标日期毫秒数
 * 
 * @param d
 *            目标日期
 * @param type
 *            返回值类型, 默认返回毫秒数. "MS", "HH", "DAY"
 */
Date.prototype.diffDays = function(d, type) {
    // var tps = ["MS", "HH", "DAY", "MT"];
    if (!type) type = "MS";
    if (!d) return false;
    if (d == this) return 0;
    var rt = function(ms, val) {
        return parseInt((ms + val - 1) / val);
    };
    return {
        /** 默认值, 返回毫秒差值 */
        MS: function(ms) {
            return ms;
        },

        /** 将毫秒数转化为小时, 不足1时记为1 */
        HH: function(ms) {
            return rt(ms, 60 * 60 * 1000);
        },

        /** 将毫秒数转换为天数, 不足1时记为1 */
        DAY: function(ms) {
            return rt(ms, 24 * 60 * 60 * 1000);
        }
    }[type](this.getTime() - d.getTime());
};

/**
 * 修改日期--DAY
 * 
 * @param d
 *            {Number} 差值
 * @returns {Date} 修改后的日期
 */
Date.prototype.addDays = function(d) {
    return new Date(this.getTime() + d * 24 * 60 * 60 * 1000);
};

/**
 * 利用正则表达式去掉前后空格
 * 
 * @returns {String} 去除前后空格后的当前字符串
 */
String.prototype.trim = function() {
    if (this.length) {
        var s = this.match(/\S+(\s*\S+)*/ig);
        return (s ? s[0] : "");
    }
    return this;
};

/**
 * 删除指定下标字符
 * 
 * @param index
 *            {Number} 下标, -1:删除最后一个, 否则数据非法时返回当前字符串
 * @returns {String} 删除后的值
 */
String.prototype.deleteAt = function(index) {
    if (isNaN(index)) return this.toString();
    index = parseInt(index);
    var len = this.length;
    if (0 >= len) return "";
    if (-1 == index) index = len - 1;
    var tmpArr = [];
    for (var i = 0; i < len; i++)
        if (index != i) tmpArr.push(this[i]);
    return tmpArr.join("");
};

/**
 * 从后往前截取字符串
 * 
 * @param length
 *            {Number} 要截取的长度, 值小于1时返回空字符串, 大于length时返回当前字符串
 * @returns {String} 截取的目标字符串
 */
String.prototype.reverseSubstring = function(length) {
    if (isNaN(length)) return null;
    return this.substring(this.length - parseInt(length));
};

/**
 * (第一个)单词首字母大写, 每个单词已空格分割
 */
String.prototype.upperFirst = function() {
    // 多个单词
    var spArr = this.split(" ");
    // 第一个单词
    var arr = [];
    var ls = spArr[0].split("");
    arr.push(ls[0].toUpperCase());
    ls.each(function(v, i) {
        arr.push(v.toLowerCase());
    }, 1);
    var fWord = arr.join(""), str = fWord;
    spArr.splice(0, 1);
    return (0 < spArr.length ? (fWord + " " + spArr.join(" ")) : fWord);
};

/**
 * 验证两个字符串是否相等
 * 
 * @param other
 *            {String} 其他字符串
 * @param isIgnoreCase
 *            {Boolean} 是否忽略大小写
 * @param isTrim
 *            {Boolean} 是否去掉前后空格
 */
String.prototype.equals = function(other, isIgnoreCase, isTrim) {
    if (this == other) return true;
    if (null == other || undefined == other) return false;
    var thisStr = this.toString();
    if (true == isIgnoreCase) {
        thisStr = thisStr.toLowerCase(), other = other.toLowerCase();
    }
    thisStr = thisStr.toString();
    if (true == isTrim) {
        thisStr = thisStr.trim(), other = other.trim();
    }
    return (thisStr == other);
};

/**
 * 验证两个字符串是否不相等
 * 
 * @param other
 *            其他字符串
 * @param isIgnoreCase
 *            是否忽略大小写
 * @param isTrim
 *            是否去掉前后空格
 */
String.prototype.notEquals = function(other, isIgnoreCase, isTrim) {
    return !this.equals(other, isIgnoreCase, isTrim);
}

/**
 * 截取尾部字符串
 * 
 * @param maxLen
 *            字符串最大长度
 * @param suffix
 *            截取后添加的后缀, 当前值只获取字符串类型
 * @returns {String} 当this.length&lt;=maxLen 时,原样返回;
 *          否则,返回值:当前字符串截取0~maxLen长度+suffix
 */
String.prototype.replaceSuffix = function(maxLen, suffix) {
    if (this.length <= maxLen) return this.toString();
    var mLen = maxLen;
    if (typeof suffix === "string") maxLen -= suffix.length;
    else suffix = "";
    return this.substring(0, maxLen) + suffix;
}

/**
 * 去除重复的值
 */
Array.prototype.unique = function() {
    var tmp = {};
    var target = new Array();
    for (var i = 0, len = this.length, val; i < len; i++)
        if (!tmp[val = this[i]]) target.push(val) && (tmp[val] = true);
    this.length = 0;
    for (var i = 0; i < target.length; i++)
        this.push(target[i]);
    return this;
};

/**
 * 遍历数组
 * 
 * @param callback
 *            回调函数, 参数:v-[value],i-[index]
 * @param begin
 *            开始下标, 默认0
 */
Array.prototype.each = function(callback, begin) {
    begin = begin || 0;
    begin = isNaN(begin) ? begin : 0;
    for (var i = 0; i < this.length; i++)
        if (i >= begin && false == callback(this[i], i)) break;
};

/**
 * 查找数组元素
 * 
 * @param val
 *            需要匹配的值
 * @param key
 *            {String|undefined}-数组元素属性值.<br>
 *            如果当前值未定义则匹配规则为: <i>arr[idx]===val</i><br>
 *            如果指定Key值匹配规则: <i>arr[idx][key]===val</i>
 * @returns {Object}-匹配成功的元素
 */
Array.prototype.find = function(val, key) {
    var el = null, finded = false;
    this.length && this.each(function(v) {
        // 指定 key 时, 匹配元素属性值
        if (key) {
            if (val === v[key]) {
                el = v;
                finded = true;
            }
        }
        // 不指定 key 时, 直接匹配数组元素
        else if (val === v) {
            el = v;
            finded = true;
        }

        return !finded;
    });
    return el;
}

/**
 * 获取数组最后一个元素
 */
Array.prototype.end = function() {
    return this.length ? this[this.length - 1] : undefined;
};

/**
 * 检测两个数组是否相同
 * 
 * @param otherArray
 *            另一个数组
 * @param byIndex
 *            是否通过索引匹配, true-元素序列号必须一致(默认), false-包含即可但长度必须一致
 */
Array.prototype.equals = function(otherArray, byIndex) {
    if (undefined == byIndex) byIndex = true;
    // 同一个对象
    if (this == otherArray) return true;

    // 另一个不是数组
    if (!otherArray || !(otherArray instanceof Array)) return false;

    var otherLen = otherArray.length;
    var thisLen = this.length;

    // 长度不一致
    if (otherLen != thisLen) return false;

    // 包含匹配, 无序
    var isEquals = true;
    this.each(function(val, i) {
        isEquals = (true == byIndex ? (val === otherArray[i]) : (-1 != otherArray.indexOf(val)));
        if (!isEquals) return false;
    });

    return isEquals;
};

/**
 * 数组过滤
 * 
 * @param p
 *            {Function} predicate 断言测试函数, 返回值:true-保留, 参数:元素值
 * @returns {Array} 被排除元素列表
 */
Array.prototype.filter = function(p) {
    if (0 >= this.length) return;
    var incEl = [], excEl = [], _this = this;
    this.each(function(v, i) {
        if (true == p(v)) {
            incEl.push(v);
        } else {
            excEl.push(v);
        }
    });
    this.length = 0;
    incEl.each(function(v, i) {
        _this.push(v);
    });
    return excEl;
};

/**
 * 追加元素
 * 
 * @param el
 *            {Object|Array} 被追加元素(或数组)
 */
Array.prototype.append = function(el) {
    var _this = this;
    if (el instanceof Array) el.each(function(v, i) {
        _this.push(v);
    });
    else _this.push(el);
    return _this;
}

/**
 * 匹配指定值是否在数组中存在
 * 
 * @param target
 *            {Object} 目标值
 * @param matcher
 *            {Function} 匹配器, 未定义时使用全等匹配(===); 参数:originalValue, targetValue;
 *            返回值:true-已找到匹配元素;
 * @returns {Number} 元素在数组中的下标, -1不包含指定元素
 */
Array.prototype.match = function(target, matcher) {
    if (!validator.isFunction(matcher)) matcher = function(origV, tV) {
        return origV === v;
    }
    var idx = -1;
    this.each(function(v, i) {
        if (true == matcher(v, target)) {
            idx = i;
            return false;
        }
    });
    return idx;
}

/**
 * 分段处理数组
 * 
 * @param size
 *            -{Number} 每次处理的最大长度
 * @param handler
 *            -{Function} 分段处理器
 * @param timer
 *            -{Number} 指定setInterval间隔时长, 是否需要使用 setInterval 处理
 */
Array.prototype.limit = function(size, handler, timer) {
    size = (size || 500), timer = (timer || 0), timer = (timer > 0 ? timer : 0);
    var count = 0, thisObj = this;

    // 进入后首先执行一次
    var endIdx = (count + 1) * size;
    endIdx = (thisObj.length < endIdx) ? thisObj.length : endIdx;
    var arr = thisObj.slice(count * size, endIdx);
    if (0 == arr.length) {
        clearInterval(_timer_Id_);
        return;
    }
    handler(arr);
    count++;

    var _timer_Id_ = setInterval(function() {
        var endIdx = (count + 1) * size;
        endIdx = (thisObj.length < endIdx) ? thisObj.length : endIdx;
        var arr = thisObj.slice(count * size, endIdx);
        if (0 == arr.length) {
            clearInterval(_timer_Id_);
            return;
        }
        handler(arr);
        count++;
    }, timer);
};

// jQuery扩展
if ($) {
    /**
     * 禁用控件
     * 
     * @param countdown
     *            {Number} 禁用倒计时, x秒后启用当前控件. 接受正整数.
     */
    $.fn.disable = function(countdown) {
        var val = parseInt(countdown);
        if (val != countdown || 0 >= val) val = 0;
        var $this = $(this);
        if (val) {
            setTimeout(function() {
                $this.removeAttr("disabled");
            }, val);
        } else {
            $this.attr({
                "disabled": "disabled"
            });
        }
        return $(this);
    };

    /**
     * 获取当前元素HTML定义
     * 
     * @returns {String} 当前元素HTML定义
     */
    $.fn.getHTML = function() {
        return $("<div/>").append($(this).clone()).html();
    };

    /**
     * 限时禁用指定控件
     * 
     * @param timer
     *            倒计时(ms), 默认值3000ms
     */
    $.fn.limitedDisplay = function(timer) {
        timer = parseInt(timer);
        timer = (0 >= timer ? 3000 : timer);
        var $this = $(this).attr("disabled", "disabled");
        setTimeout(function() {
            $this.removeAttr("disabled")
        }, timer);
        return $this;
    };

    /**
     * 为select控件设置option列表
     * 
     * @param data
     *            {Array} option数据, eg:[{value:String, text:String},
     *            {value:String, text:String}, ...], eg2:[String, String, ...]
     * @param isAppend
     *            {Boolean} true-追加在原来的数据后面, false-清理原来的数据(default)
     * @param value
     *            {String} select选中的值
     */
    $.fn.setOptions = function(data, isAppend, value) {
        var $this = $(this);
        if (!"SELECT".equals($this[0].tagName, true, true)) return;
        if (!isAppend) $this.html("");
        if (data instanceof Array) {
            data.each(function(v) {
                if ("string".equals(typeof v, true, true)) {
                    v = {
                        value: v,
                        text: v
                    }
                }

                $("<option/>", {
                    value: v["value"],
                    html: v["text"]
                }).appendTo($this);
            });
            if (undefined != value && true != value && (value && typeof value !== "object")) $this.val(value);
        }
        ;
        return $this;
    };

    /** window滚动条判断 */
    $.hasScroll = function() {
        return {
            right: document.documentElement.clientHeight < document.documentElement.offsetHeight,
            bottom: undefined
        };
    };

    /** 找不到记录 */
    $.getNoRecordFound = function() {
        return $("<div/>").addClass("no_record_found").html("No Record Found");
    };

    /** 获取红色文字控件 */
    $.red = function(ctt) {
        return $("<font/>", {
            html: ctt || ""
        }).css({
            "color": "#F00"
        });
    };

    /** 表单项的值是不是可以重复的, 目前支持:INPUT[TYPE="CHECKBOX"] */
    $.fn.repeatableValue = function() {
        var tagName = this[0].tagName.toUpperCase();
        if ("INPUT" === tagName) {
            return "CHECKBOX".equals(this.attr("TYPE"), true, true);
        } else {
            return false;
        }
    }
}
