/**
 * @FileName: OgnlUtil.java
 * @Author Huang.Yong
 * @Description:
 * @Date 2015年10月15日 下午3:06:27
 * @CopyRight CNP Corporation
 */
package org.yong.util.string;

import org.apache.ibatis.ognl.Ognl;
import org.apache.ibatis.ognl.OgnlContext;
import org.apache.ibatis.ognl.OgnlException;

/**
 * @Author Huang.Yong
 * @Description: 对象导航图工具
 * @CopyRight CNP Corporation
 */
public abstract class OgnlUtil {

	/**
	 * @Title: getValue
	 * @Description: 获取属性值
	 * @param ognl 属性导航图
	 * @param object 目标对象
	 * @return 属性值
	 * @throws OgnlException
	 */
	@SuppressWarnings("unchecked")
	public static <T> T getValue(String ognl, Object object) throws OgnlException {
		OgnlContext context = getOgnlContext(object);
		return (T) Ognl.getValue(createExpression(ognl), context, context.getRoot());
	}

	/**
	 * @Title: setValue
	 * @Description: 设置属性值
	 * @param ognl 属性导航图
	 * @param value 属性值
	 * @param object 目标对象
	 * @throws OgnlException
	 */
	public static void setValue(String ognl, Object value, Object object) throws OgnlException {
		OgnlContext context = getOgnlContext(object);
		Ognl.setValue(createExpression(ognl), context, context.getRoot(), value);
	}

	/**
	 * @Title: getOgnlContext
	 * @Description:
	 * @param object
	 * @return OgnlContext
	 */
	private static OgnlContext getOgnlContext(Object object) {
		OgnlContext context = new OgnlContext();
		context.setRoot(object);
		return context;
	}

	/**
	 * @Title: createExpression
	 * @Description: 创建表达式对象
	 * @param ognl 对象导航图
	 * @return Object 表达式对象
	 * @throws OgnlException
	 */
	private static Object createExpression(String ognl) throws OgnlException {
		return Ognl.parseExpression(ognl);
	}

}
