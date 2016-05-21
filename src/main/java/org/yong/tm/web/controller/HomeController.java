package org.yong.tm.web.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yong.tm.web.util.WebUtil;
import org.yong.util.page.DataHandler;
import org.yong.util.page.Page;

import com.google.common.collect.Lists;

/**
 * @Author Huang.Yong
 * @Description: 主页控制器
 * @Date 2016年3月27日 下午5:39:27
 * @Version 0.1
 */
@Controller
@RequestMapping("/home")
public class HomeController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@RequestMapping("/taskTotal")
	@ResponseBody
	public ModelMap taskTotal(Integer pageIndex, Integer pageSize) {
		boolean flag = false;
		String message = null;
		Object data = null;

		try {
			data = new Page<Object>(pageIndex, pageSize, new DataHandler<Object>() {

				@Override
				public List<Object> getElements(Integer pageIndex, Integer pageSize) {
					return Lists.newArrayList();
				}

				@Override
				public Integer getRowCount() {
					return 5000;
				}
			});
			flag = true;
		} catch (Exception e) {
			flag = false;
			message = "";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

}
