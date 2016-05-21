package org.yong.tm.service.iface;

import java.util.List;

import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Project;
import org.yong.tm.model.entities.User;
import org.yong.tm.model.enums.ProjectStatus;

/**
 * @Author Huang.Yong
 * @Description: 项目服务接口
 * @Date 2016年4月1日 下午5:51:18
 * @Version 0.1
 */
public interface ProjectService {

	/** 项目默认图标 */
	public static final String DEFAULT_ICO_PATH = "/static/image/project_default_ico_path.png";

	/**
	 * @Title: addProject
	 * @Description: 添加项目
	 * @param project 项目详情
	 * @param createdBy 项目创建者
	 * @return boolean true-添加成功, false-添加失败
	 * @throws VerifyParameterException
	 */
	boolean addProject(Project project, User createdBy) throws VerifyParameterException;

	/**
	 * @Title: getProjectList
	 * @Description: 获取项目列表
	 * @return List&lt;Project&gt; 项目列表
	 */
	List<Project> getProjectList();

	/**
	 * @Title: modify
	 * @Description: 修改项目信息
	 * @param project 项目详情
	 * @return boolean true-修改成功, false-修改失败
	 * @throws VerifyParameterException
	 */
	boolean modify(Project project) throws VerifyParameterException;

	/**
	 * @Title: changeStatus
	 * @Description: 修改项目状态, 禁用&启用状态交替(<i>启用->禁用</i> or <i>禁用->启用</i>)
	 * @param id 项目ID
	 * @param currentStatus 当前状态
	 * @return ProjectStatus 修改后的状态
	 * @throws VerifyParameterException
	 */
	ProjectStatus changeStatus(Integer id, ProjectStatus currentStatus) throws VerifyParameterException;

}
