package org.yong.tm.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.yong.tm.dao.ModuleDao;
import org.yong.tm.dao.TaskDao;
import org.yong.tm.model.entities.Task;
import org.yong.tm.model.entities.User;
import org.yong.tm.model.enums.TaskStatus;
import org.yong.tm.model.vo.InitTaskSearchConditionVO;
import org.yong.tm.model.vo.TaskSearchCondition;
import org.yong.tm.model.vo.TaskVO;
import org.yong.tm.service.iface.TaskService;
import org.yong.util.page.DataHandler;
import org.yong.util.page.Page;
import org.yong.util.page.PageCondition;
import org.yong.util.vo.EntryVO;

import com.google.common.collect.Lists;

/**
 * @Author Huang.Yong
 * @Description: 任务服务接口默认实现
 * @Date 2016年4月3日 下午8:24:51
 * @Version 0.1
 */
@Service
public class TaskServiceImpl implements TaskService {

	@Autowired
	private TaskDao taskDao;

	@Autowired
	private ModuleDao moduleDao;

	@Override
	public Page<Task> getPage(final TaskSearchCondition taskSearchParameter, PageCondition pageCondition) {
		return new Page<Task>(pageCondition, new DataHandler<Task>() {

			@Override
			public List<Task> getElements(Integer pageIndex, Integer pageSize) {
				Integer begin = (pageIndex - 1) * pageSize;
				return taskDao.selectListByCondition(begin, pageSize, taskSearchParameter);
			}

			@Override
			public Integer getRowCount() {
				return taskDao.countListByCondition(taskSearchParameter);
			}
		});
	}

	@Override
	public boolean addTask(Task task, User createdBy) {
		task.setCreatedDate(new Date());
		taskDao.insert(task, createdBy.getAccount());
		return true;
	}

	@Override
	public boolean exist(String name, Integer moduleId) {
		return (1 == taskDao.countByNameAndModuleId(name, moduleId));
	}

	@Override
	public Task getDetailsById(Integer taskId) {
		// 基本信息
		TaskSearchCondition condition = new TaskSearchCondition(taskId);
		List<Task> tasks = taskDao.selectListByCondition(0, 1, condition);
		Task task = null;
		if (1 == tasks.size()) {
			task = tasks.get(0);
			// TODO 查询任务 Issue 列表
			// TODO 查询任务关联的文件列表
		}
		return task;
	}

	@Override
	public List<TaskStatus> getAllTaskStatus() {
		return Lists.newArrayList(TaskStatus.values());
	}

	@Override
	public Page<TaskVO> getPageForManager(final TaskSearchCondition taskSearchCondition, PageCondition pageCondition) {
		return new Page<TaskVO>(pageCondition, new DataHandler<TaskVO>() {

			@Override
			public List<TaskVO> getElements(Integer pageIndex, Integer pageSize) {
				Integer begin = (pageIndex - 1) * pageSize;
				return taskDao.selectListByConditionForVO(begin, pageSize, taskSearchCondition);
			}

			@Override
			public Integer getRowCount() {
				return taskDao.countListByConditionForVO(taskSearchCondition);
			}
		});
	}

	@Override
	@Transactional
	public boolean submitToVerifying(Integer taskId, String currentAccount) {
		// 更新用户的任务状态
		taskDao.updateStatusByIdAndAccount(taskId, currentAccount, TaskStatus.VERIFYING);
		// 维护原任务状态
		taskDao.updateStatusById(taskId, TaskStatus.VERIFYING);
		return true;
	}

	@Override
	public InitTaskSearchConditionVO getInitTaskSearchCondition(Integer moduleId) {
		InitTaskSearchConditionVO searchCondition = new InitTaskSearchConditionVO();

		searchCondition.setTaskStatus(Lists.newArrayList(TaskStatus.values()));

		List<EntryVO<String, String>> usersInModule = Lists.newArrayList();
		searchCondition.setUsersInModule(usersInModule);
		List<User> users = moduleDao.selectUsersByModuleId(moduleId);
		for (User user : users) {
			usersInModule.add(new EntryVO<String, String>(user.getAccount(), user.getName()));
		}

		return searchCondition;
	}

	@Override
	public Boolean isAssigned(Integer taskId) {
		return !(1 == taskDao.countByTaskIdAndStatus(taskId, TaskStatus.FREE));
	}
}
