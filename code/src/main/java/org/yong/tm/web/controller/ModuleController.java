package org.yong.tm.web.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Module;
import org.yong.tm.model.entities.User;
import org.yong.tm.service.iface.ModuleService;
import org.yong.tm.util.TMConstants;
import org.yong.tm.web.util.WebUtil;

/**
 * @Author Huang.Yong
 * @Description: 模块控制器
 * @Date 2016年4月2日 上午2:23:35
 * @Version 0.1
 */
@Controller
@RequestMapping("/module")
public class ModuleController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Autowired
	private ModuleService moduleServiceVerifier;

	/**
	 * @Title: getModulsByProject
	 * @Description: 获取模块列表
	 * @param projectId 项目ID
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:模块列表
	 */
	@RequestMapping("/getModulesByProject")
	@ResponseBody
	public ModelMap getModulesByProject(Integer projectId) {
		boolean flag = false;
		String message = null;
		List<Module> data = null;
		try {
			data = moduleServiceVerifier.getListByProjectId(projectId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Get modules error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}
		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: addModule
	 * @Description: 添加项目模块
	 * @param module 模块详情
	 * @return ModelMap flag:true-添加成功,false-添加失败; message:失败消息
	 */
	@RequestMapping("/addModule")
	@ResponseBody
	public ModelMap addModule(Module module) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			flag = moduleServiceVerifier.addModule(module, sessionUser);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: changeStatus
	 * @Description: 修改模块状态
	 * @param module 模块详情
	 * @return ModelMap flag:true-成功, false-失败; message:失败消息
	 */
	@RequestMapping("/changeStatus")
	@ResponseBody
	public ModelMap changeStatus(Module module) {
		boolean flag = false;
		String message = null;

		try {
			flag = moduleServiceVerifier.changeStatus(module);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: getDetails
	 * @Description: 获取模块详情
	 * @param moduleId 模块ID
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:模块详情
	 */
	@RequestMapping("/getDetails")
	@ResponseBody
	public ModelMap getDetails(Integer moduleId) {
		boolean flag = false;
		String message = null;
		Module data = null;

		try {
			data = moduleServiceVerifier.getById(moduleId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: changeDetail
	 * @Description: 修改模块详情
	 * @param module 模块详情
	 * @return ModelMap flag:true-修改成功,false-修改失败; message:失败消息;
	 */
	@RequestMapping("/changeDetail")
	@ResponseBody
	public ModelMap changeDetail(Module module) {
		boolean flag = false;
		String message = null;

		try {
			flag = moduleServiceVerifier.modifyDetail(module);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}
}