package org.yong.tm.web.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.User;
import org.yong.tm.service.iface.UserService;
import org.yong.tm.util.TMConstants;
import org.yong.tm.web.util.WebUtil;

import com.google.common.collect.Maps;

/**
 * @Author Huang.Yong
 * @Description: 用户控制器
 * @Date 2016年3月27日 下午1:06:06
 * @Version 0.1
 */
@Controller
@RequestMapping("/user")
public class UserController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Resource(name = "userServiceVerifier")
	private UserService userService;

	/**
	 * @Title: login
	 * @Description: 用户登陆
	 * @param account 用户账户
	 * @param pwd 密码
	 * @return ModelMap flag:标记, data:{登陆失败消息}, message:消息
	 */
	@RequestMapping("/login")
	@ResponseBody
	public ModelMap login(String account, String pwd, boolean remember, HttpServletResponse resp) {
		boolean flag = false;
		String message = null;
		Map<String, String> data = Maps.newHashMap();

		try {
			User loginUser = userService.login(account, pwd);
			flag = (null != loginUser);
			if (!flag) {
				message = "Login Failed. Account or Password error.";
			} else {
				if (remember) {
					Cookie cookie = new Cookie(TMConstants.SESSION_EFFECTIVE_USER, account);
					cookie.setMaxAge(-1);
					resp.addCookie(cookie);
				}
			}
			WebUtil.setSessionAttr(TMConstants.SESSION_EFFECTIVE_USER, loginUser);
		} catch (VerifyParameterException e) {
			flag = false;
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Do login error.";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: signOut
	 * @Description: 退出登陆
	 * @return ModelMap flag:标记, data:{Boolean}, message:消息
	 */
	@RequestMapping("/signOut")
	@ResponseBody
	public ModelMap signOut() {
		boolean flag = false;
		String message = null;
		Boolean data = null;

		try {
			WebUtil.removeSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			flag = true;
			data = true;
		} catch (Exception e) {
			flag = false;
			message = "Exit login failed";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	@RequestMapping("/userList")
	@ResponseBody
	public ModelMap userList() {
		boolean flag = false;
		String message = null;
		List<User> data = null;

		try {
			data = userService.getList();
			flag = true;
			// 至少存在当前用户, 所以不需要下面的校验
			// message = (CollectionUtils.isEmpty(data) ? null :
			// "Cannot find user list, Please add users.");
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Get user list error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}
}
