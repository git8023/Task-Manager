package org.yong.tm.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.yong.tm.util.TMConstants;
import org.yong.tm.web.util.WebUtil;

@Controller
public class IndexController {

	/**
	 * @Title: view
	 * @Description: 获取视图
	 * @param url 视图路径
	 * @return String 视图虚拟路径
	 */
	@RequestMapping("/view")
	public String view(String url) {
		WebUtil.setRequestAttr(TMConstants.REQUEST_PARAM, WebUtil.getRequest().getParameterMap());
		return url;
	}

	/**
	 * @Title: home
	 * @Description: 跳转Home主页
	 * @return String 主页逻辑视图
	 */
	@RequestMapping("/home")
	public String home() {
		return "home/home";
	}
}