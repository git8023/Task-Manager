package org.yong.tm.service.impl;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yong.tm.dao.ProjectDao;
import org.yong.tm.model.entities.Project;
import org.yong.tm.model.entities.User;
import org.yong.tm.model.enums.ProjectStatus;
import org.yong.tm.service.iface.ProjectService;

/**
 * @Author Huang.Yong
 * @Description: 项目服务默认实现
 * @Date 2016年4月1日 下午5:59:32
 * @Version 0.1
 */
@Service
public class ProjectServiceImpl implements ProjectService {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProjectDao projectDao;

	@Override
	public boolean addProject(Project project, User createdBy) {
		project.setCreatedBy(createdBy);
		project.setStatus(ProjectStatus.DISABLED);
		project.setCreatedDate(new Date());
		project.setIcoPath(DEFAULT_ICO_PATH);
		Integer row = projectDao.insertProject(project);
		return (1 == row);
	}

	@Override
	public List<Project> getProjectList() {
		return projectDao.selectListByCondition();
	}

	@Override
	public boolean modify(Project project) {
		projectDao.updateById(project.getId(), project);
		return true;
	}

	@Override
	public ProjectStatus changeStatus(Integer id, ProjectStatus currentStatus) {
		ProjectStatus newStatus = transferStatus(currentStatus);
		Project project = new Project();
		project.setStatus(newStatus);
		return (1 == projectDao.updateById(id, project)) ? newStatus : currentStatus;
	}

	/**
	 * @Title: transferStatus
	 * @Description: 转换项目状态
	 * @param currentStatus 当前状态
	 * @return ProjectStatus 转换后状态
	 */
	private ProjectStatus transferStatus(ProjectStatus currentStatus) {
		ProjectStatus newStatus = ProjectStatus.DISABLED;
		switch (currentStatus) {
		case DISABLED:
			newStatus = ProjectStatus.EFFECTIVE;
			break;
		case EFFECTIVE:
			newStatus = ProjectStatus.DISABLED;
			break;
		default:
			LOGGER.warn("Can't support status[" + currentStatus + "]");
			break;
		}
		return newStatus;
	}
}
