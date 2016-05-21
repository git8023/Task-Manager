/*
 * @FileName: BaseTest.java
 * @Author Huang.Yong
 * @Description:
 * @Date 2015年10月9日 下午4:19:49
 */
package org.yong.test;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.CollectionUtils;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter;
import org.yong.util.string.StringUtil;

import com.google.common.collect.Lists;

/**
 * @Author Huang.Yong
 * @Description: 测试基类
 * @CopyRight CNP Corporation
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-mvc.xml" })
public abstract class BaseControllerTest {

	private MockHttpServletRequest request;

	private MockHttpServletResponse response;

	private Map<String, String[]> params = new HashMap<String, String[]>();

	@Autowired
	private AnnotationMethodHandlerAdapter handlerAdapter;

	@Before
	public void before() {
		this.request = new MockHttpServletRequest();
		request.setCharacterEncoding("UTF-8");
		request.setAttribute(HandlerMapping.INTROSPECT_TYPE_LEVEL_MAPPING, true);

		this.response = new MockHttpServletResponse();
	}

	/**
	 * @Title: invockMethod
	 * @Description: 发起URL请求
	 * @param url URL
	 * @param params 参数
	 * @return ModelAndView 响应
	 * @throws Exception
	 */
	protected ModelAndView invockMethod(String url) throws Exception {
		if (!CollectionUtils.isEmpty(params)) {
			request.addParameters(params);
		}
		request.setRequestURI(url);

		Object controller = getController();
		return handlerAdapter.handle(request, response, controller);
	}

	/**
	 * @Title: getResponseText
	 * @Description: 获取响应字符串
	 * @return 响应字符串
	 * @throws UnsupportedEncodingException String
	 */
	protected String getResponseText() throws UnsupportedEncodingException {
		return this.response.getContentAsString();
	}

	/**
	 * @Title: addParam
	 * @Description: 添加请求参数
	 * @param key 参数名
	 * @param vals 参数值
	 */
	protected void addParam(String key, Object... vals) {
		boolean hasVals = (null != vals && 0 < vals.length);
		if (StringUtil.isNotEmpty(key, true) && hasVals) {
			List<String> eachVals = Lists.newArrayList();
			for (Object val : vals) {
				if (null != val) {
					eachVals.add(val.toString());
				}
			}
			String[] stringParams = new String[eachVals.size()];
			eachVals.toArray(stringParams);
			this.params.put(key, stringParams);
		}
	}

	/**
	 * @Title: getController
	 * @Description: 获取控制器对象
	 * @return Object 控制器对象
	 */
	protected abstract Object getController();

}
