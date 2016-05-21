package org.yong.tm.service.verifier;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Project;
import org.yong.tm.model.entities.User;
import org.yong.tm.model.enums.ProjectStatus;
import org.yong.tm.service.iface.ProjectService;
import org.yong.tm.util.TMConstants;
import org.yong.util.string.StringUtil;

/**
 * @Author Huang.Yong
 * @Description: 项目服务参数验证
 * @Date 2016年4月1日 下午5:55:40
 * @Version 0.1
 */
@Service
public class ProjectServiceVerifier implements ProjectService {

	@Autowired
	private ProjectService projectServiceImpl;

	@Override
	public boolean addProject(Project project, User createdBy) throws VerifyParameterException {
		String errMsg = null;
		if (null == project || StringUtil.isEmpty(project.getName(), true)) {
			errMsg = "In the service of the add project, project parameters is invalid.";
		} else if (null == createdBy || StringUtil.isEmpty(createdBy.getAccount(), true)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_INVALID_USER;
		}

		if (null != errMsg) {
			throw new VerifyParameterException(errMsg);
		} else {
			return projectServiceImpl.addProject(project, createdBy);
		}
	}

	@Override
	public List<Project> getProjectList() {
		return projectServiceImpl.getProjectList();
	}

	@Override
	public boolean modify(Project project) throws VerifyParameterException {
		String errMsg = null;
		if (null == project) {
			errMsg = "Missing target parameters";
		} else if (null == project.getId()) {
			errMsg = "Invalid request, Missing Parimay-Key";
		} else if (StringUtil.isEmpty(project.getName(), true)) {
			errMsg = "Invalid request, Missing New-name";
		}
		if (null != errMsg) {
			throw new VerifyParameterException(errMsg);
		} else {
			return projectServiceImpl.modify(project);
		}
	}

	@Override
	public ProjectStatus changeStatus(Integer id, ProjectStatus currentStatus) throws VerifyParameterException {
		String errMsg = null;
		if (null == id || 0 >= id) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Project Primary-Key]";
		} else if (null == currentStatus) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Project Status]";
		} else {
			// 下列校验等待确认是否需要
			// 1. 用户只能修改自己创建的项目状态
			// 2. 当前项目状态是否与参数(currentStatus)一致, 是否非法请求
		}

		throwException(errMsg);
		return projectServiceImpl.changeStatus(id, currentStatus);
	}

	/**
	 * @Title: throwException
	 * @Description: 抛出参数验证异常
	 * @param errMsg 错误消息
	 * @throws VerifyParameterException
	 */
	private void throwException(String errMsg) throws VerifyParameterException {
		if (null != errMsg) {
			throw new VerifyParameterException(errMsg);
		}
	}
}
