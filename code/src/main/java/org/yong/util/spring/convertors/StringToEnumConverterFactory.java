package org.yong.util.spring.convertors;

/**
 * @FileName: StringToEnumConverterFactory.java
 * @Author Huang.Yong
 * @Description:
 * @Date 2015年8月1日 下午3:26:20
 */

import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.converter.ConverterFactory;
import org.yong.util.string.StringUtil;

/**
 * @Author Huang.Yong
 * @Description:
 * @Version 1.0
 */
@SuppressWarnings("rawtypes")
public class StringToEnumConverterFactory implements ConverterFactory<String, Enum> {

	/**
	 * @param targetType
	 * @return
	 * @see org.springframework.core.convert.converter.ConverterFactory#getConverter(java.lang.Class)
	 */
	@Override
	public <T extends Enum> Converter<String, T> getConverter(Class<T> targetType) {
		return new EnumConverter<T>(targetType);
	}

	/**
	 * @Author Huang.Yong
	 * @Description: 枚举转换器
	 * @Version 1.0
	 */
	private class EnumConverter<T extends Enum> implements Converter<String, T> {

		private Class<T> targetType;

		private T[] constantFields;

		/**
		 * @Title: EnumConverter
		 * @Description: 获取枚举转换器实例对象
		 * @param targetType 目标类型
		 */

		public EnumConverter(Class<T> targetType) {
			this.targetType = targetType;
			constantFields = this.targetType.getEnumConstants();
		}

		/**
		 * @param source
		 * @return
		 * @see org.springframework.core.convert.converter.Converter#convert(java.lang.Object)
		 */
		@Override
		public T convert(String source) {
			T result = null;
			if (!StringUtil.isEmpty(source, true)) {
				boolean isNumber = StringUtil.isNumber(source);
				if (isNumber) {
					result = convertByOrdinal(Integer.valueOf(source));
				} else {
					result = convertByName(source);
				}
			}
			return result;
		}

		/**
		 * @Title: convertByName
		 * @Description: 通过 name 获取枚举值
		 * @param source name
		 * @return T 转换成功返回枚举值, 否则返回null
		 */
		@SuppressWarnings("unchecked")
		private T convertByName(String source) {
			try {
				return (T) Enum.valueOf(this.targetType, source);
			} catch (Exception e) {
				// e.printStackTrace();
			}
			return null;
		}

		/**
		 * @Title: convertByOrdinal
		 * @Description: 通过序列值转换枚举对象
		 * @param ordinal 枚举序列值
		 * @return T 非法序列值(小于0/大于序列长度-1)返回null, 否则返回枚举值
		 */

		private T convertByOrdinal(Integer ordinal) {
			try {
				return (ordinal >= 0 && constantFields.length - 1 >= ordinal) ? constantFields[ordinal] : null;
			} catch (Exception e) {
				// e.printStackTrace();
			}
			return null;
		}

	}
}
