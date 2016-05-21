/**
 * @FileName: DateUtil.java
 * @Author Huang.Yong
 * @Description:
 * @Date 2015年8月31日 下午3:32:41
 * @CopyRight CNP Corporation
 */
package org.yong.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.yong.util.string.StringUtil;

/**
 * @Author Huang.Yong
 * @Description: 日期工具类
 * @Version 1.0
 */
public class DateUtil {

	/** yyyy-MM-dd hh:mm:ss */
	public static final String PATTERN_CN = "yyyy-MM-dd hh:mm:ss";

	/** hh:mm:ss:ms */
	public static final String PATTERN_TIME = "hh:mm:ss:ms";

	/** yyyyMMdd */
	public static final String PATTERN_YMD = "yyyyMMdd";

	/**
	 * @Title: format
	 * @Description: 格式化日期
	 * @param targetDate 目标日期
	 * @param pattern 格式化规则
	 * @return String 格式化后字符串
	 * @throws RuntimeException <i>targetDate</i> 或 <i>pattern</i> 其中一个为null时
	 */
	public static String format(Date targetDate, String pattern) {
		return format(targetDate, pattern, null);
	}

	/**
	 * @Title: format
	 * @Description: 格式化日期
	 * @param targetDate 目标日期
	 * @param pattern 格式化规则
	 * @return String 格式化后字符串
	 * @throws RuntimeException <i>targetDate</i> 或 <i>pattern</i> 其中一个为null时
	 */
	public static String format(Date targetDate, String pattern, Locale locale) {
		if (null == targetDate) {
			return StringUtil.EMPTY_STRING;
		}

		if (StringUtil.isEmpty(pattern, true)) {
			throw new RuntimeException("Pattern is null");
		}

		if (null == locale) {
			locale = Locale.ENGLISH;
		}

		return new SimpleDateFormat(pattern.trim(), locale).format(targetDate);
	}

	/**
	 * @Title: parse
	 * @Description: 解析日期字符串
	 * @param formattedDate 格式化字符串
	 * @param pattern 格式化规则
	 * @return Date 解析后日期, 或解析失败返回 null
	 * @throws RuntimeException <i>formattedDate</i> 或 <i>pattern</i> 其中一个为null时
	 */
	public static Date parse(String formattedDate, String pattern) {
		if (StringUtil.isEmpty(formattedDate, true)) {
			throw new RuntimeException("Formatted date string is null");
		}

		if (StringUtil.isEmpty(pattern, true)) {
			throw new RuntimeException("Pattern is null");
		}

		try {
			return new SimpleDateFormat(pattern.trim()).parse(formattedDate.trim());
		} catch (ParseException e) {
			return null;
		}
	}

	/**
	 * @Title: format
	 * @Description: 日期格式化
	 * @param dateStr 日期格式化后字符串
	 * @param originalPattern 原规则
	 * @param newPattern 新规则
	 * @return String 新规则日期字符串, 格式化失败将返回null
	 */
	public static String format(String dateStr, String originalPattern, String newPattern) {
		try {
			Date date = new SimpleDateFormat(originalPattern).parse(dateStr);
			return format(date, newPattern);
		} catch (ParseException e) {
			return null;
		}
	}

	/**
	 * @Title: formatNow
	 * @Description: 格式化当前时间
	 * @param pattern 格式化规则
	 * @return String 格式化字符串
	 */
	public static String formatNow(String pattern) {
		return format(new Date(), pattern);
	}
}
