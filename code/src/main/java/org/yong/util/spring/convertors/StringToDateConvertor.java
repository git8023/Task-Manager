/**
 * @FileName: StringToDate.java
 * @Author Huang.Yong
 * @Description:
 * @Date 2015年8月5日 上午10:58:39
 * @CopyRight CNP Corporation
 */
package org.yong.util.spring.convertors;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.core.convert.converter.Converter;
import org.yong.util.string.StringUtil;

/**
 * @Author Huang.Yong
 * @Description: 字符串到日期转换器
 *               <p>
 *               当前已支持 pattern 列表
 * 
 *               <pre>
 * final String[] FORMAT_PATTERNS = { &quot;yyyy-MM-dd hh:mm:ss&quot;, &quot;yyyy-MM-dd hh:mm&quot;, &quot;yyyy-MM-dd&quot;, &quot;yy-MM-dd&quot;, &quot;MM/dd/yyyy hh:mm:ss&quot;,
 * 		&quot;MM/dd/yyyy hh:mm&quot;, &quot;MM/dd/yyyy&quot; };
 * </pre>
 * 
 *               </p>
 * @Version 1.0
 */
public class StringToDateConvertor implements Converter<String, Date> {

	private final String[] FORMAT_PATTERNS = { "yyyy-MM-dd hh:mm:ss", "yyyy-MM-dd hh:mm", "yyyy-MM-dd", "yy-MM-dd",
			"MM/dd/yyyy hh:mm:ss", "MM/dd/yyyy hh:mm", "MM/dd/yyyy" };

	@Override
	public Date convert(String source) {
		Date date = null;
		boolean notEmpty = (!StringUtil.isEmpty(source, true));
		if (notEmpty) {
			boolean isNum = StringUtil.isNumber(source);
			if (isNum) {
				try {
					date = new Date(Long.valueOf(source));
					return date;
				} catch (Exception e) {
				}

			}

			for (String pattern : FORMAT_PATTERNS) {
				try {
					date = new SimpleDateFormat(pattern).parse(source);
					return date;
				} catch (Exception e) {
				}
			}
		}
		return date;
	}

}
