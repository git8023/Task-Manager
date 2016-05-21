package org.yong.tm.web.controller;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Project;
import org.yong.tm.model.entities.User;
import org.yong.tm.model.enums.ProjectStatus;
import org.yong.tm.service.iface.ProjectService;
import org.yong.tm.util.TMConstants;
import org.yong.tm.web.util.WebUtil;

/**
 * @Author Huang.Yong
 * @Description: 项目控制器
 * @Date 2016年3月31日 下午8:30:52
 * @Version 0.1
 */
@Controller
@RequestMapping("/project")
public class ProjectController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Resource(name = "projectServiceVerifier")
	private ProjectService projectService;

	/**
	 * @Title: addProject
	 * @Description: 添加项目
	 * @param project 项目详情
	 * @return ModelMap flag:true-添加成功, false-添加失败; message:添加失败消息
	 */
	@RequestMapping("/addProject")
	@ResponseBody
	public ModelMap addProject(Project project) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			flag = projectService.addProject(project, sessionUser);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			message = "Add project error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: getProjectList
	 * @Description: 获取项目列表
	 * @return ModelMap falg:true-获取成功,false-获取失败; message:失败消息; data:项目列表
	 */
	@RequestMapping("/getProjectList")
	@ResponseBody
	public ModelMap getProjectList() {
		boolean flag = false;
		String message = null;
		List<Project> data = null;

		try {
			data = projectService.getProjectList();
			flag = true;
		} catch (Exception e) {
			flag = false;
			message = "Get project list error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: modify
	 * @Description: 修改项目
	 * @param project 被修改项, 必须包含ID
	 * @return ModelMap flag:true-修改成功, false-修改失败; message:失败消息
	 */
	@RequestMapping("/modify")
	@ResponseBody
	public ModelMap modify(Project project) {
		boolean flag = false;
		String message = null;

		try {
			flag = projectService.modify(project);
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
	 * @Description: 修改项目状态
	 * @param projectId 项目ID
	 * @param currentStatus 当前状态
	 * @return ModelMap flag:true-修改成功, false-修改失败; message:失败消息
	 */
	@RequestMapping("/changeStatus")
	@ResponseBody
	public ModelMap changeStatus(Integer projectId, ProjectStatus currentStatus) {
		boolean flag = false;
		String message = null;
		ProjectStatus data = null;

		try {
			data = projectService.changeStatus(projectId, currentStatus);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Change project status error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}
}
