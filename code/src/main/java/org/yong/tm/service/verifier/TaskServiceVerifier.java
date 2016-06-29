package org.yong.tm.service.verifier;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yong.tm.dao.TaskDao;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Module;
import org.yong.tm.model.entities.Task;
import org.yong.tm.model.entities.User;
import org.yong.tm.model.enums.TaskStatus;
import org.yong.tm.model.vo.InitTaskSearchConditionVO;
import org.yong.tm.model.vo.TaskSearchCondition;
import org.yong.tm.model.vo.TaskVO;
import org.yong.tm.service.iface.TaskService;
import org.yong.tm.util.TMConstants;
import org.yong.util.page.Page;
import org.yong.util.page.PageCondition;
import org.yong.util.string.StringUtil;

/**
 * @Author Huang.Yong
 * @Description: 任务服务参数验证
 * @Date 2016年4月3日 下午8:26:01
 * @Version 0.1
 */
@Service
public class TaskServiceVerifier implements TaskService {

	@Autowired
	private TaskService taskServiceImpl;

	@Autowired
	private TaskDao taskDao;

	@Override
	public Page<Task> getPage(TaskSearchCondition taskSearchParameter, PageCondition pageCondition)
			throws VerifyParameterException {
		String errMsg = null;
		if (null == pageCondition) {
			pageCondition = new PageCondition();
		}

		throwException(errMsg);
		return taskServiceImpl.getPage(taskSearchParameter, pageCondition);
	}

	@Override
	public boolean addTask(Task task, User createdBy) throws VerifyParameterException {
		String errMsg = null;
		if (null == task) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Details]";
		} else {
			Module module = task.getModule();
			if (null == module || 0 >= module.getId()) {
				errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Module Primary-Key]";
			} else {
				String name = task.getName();
				if (StringUtil.isEmpty(name, true)) {
					errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task-Name]";
				}
			}
		}

		if (null == errMsg && (null == createdBy || StringUtil.isEmpty(createdBy.getAccount(), true))) {
			errMsg = TMConstants.ACCESS_DENIED_OF_INVALID_USER;
		}

		throwException(errMsg);
		return taskServiceImpl.addTask(task, createdBy);
	}

	@Override
	public boolean exist(String name, Integer moduleId) throws VerifyParameterException {
		String errMsg = null;
		if (StringUtil.isEmpty(name, true)) {
			errMsg = "Access denied, Missing requirement parameters[Task-Name]";
		} else if (null == moduleId || 0 >= moduleId) {
			errMsg = "Access denied, Missing requirement parameters[Module Promary-Key]";
		}

		throwException(errMsg);
		return taskServiceImpl.exist(name, moduleId);
	}

	@Override
	public Task getDetailsById(Integer taskId) throws VerifyParameterException {
		String errMsg = null;
		if (null == taskId || 0 >= taskId) {
			errMsg = "Missing repuirement parameters[Task Primary-Key]";
		}

		throwException(errMsg);
		return taskServiceImpl.getDetailsById(taskId);
	}

	@Override
	public List<TaskStatus> getAllTaskStatus() {
		return taskServiceImpl.getAllTaskStatus();
	}

	@Override
	public Page<TaskVO> getPageForManager(TaskSearchCondition taskSearchCondition, PageCondition pageCondition)
			throws VerifyParameterException {
		String errMsg = null;
		if (null == pageCondition) {
			pageCondition = new PageCondition();
		}

		throwException(errMsg);
		return taskServiceImpl.getPageForManager(taskSearchCondition, pageCondition);
	}

	@Override
	public boolean submitToVerifying(Integer taskId, String currentAccount) throws VerifyParameterException {
		String errMsg = null;
		if (null == taskId || 0 >= taskId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[taskId=" + taskId + "]";
		} else if (StringUtil.isEmpty(currentAccount, true)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_INVALID_USER;
		} else {
			// 执行者只能提交自己的任务
			boolean valided = (1 == taskDao.countByTaskIdAndAccount(taskId, currentAccount));
			if (!valided) {
				errMsg = TMConstants.ACCESS_DENIED + ",Task is to do not belong to user[" + currentAccount + "]";
			}

			// 只能提交正在执行的任务
			if (StringUtil.isEmpty(errMsg, true)) {
				boolean statusOfDoing = (1 == taskDao.countByTaskIdAndStatus(taskId, TaskStatus.DOING));
				if (!statusOfDoing) {
					errMsg = TMConstants.ACCESS_DENIED + ", Can only submit are performing tasks";
				}
			}
		}

		throwException(errMsg);
		return taskServiceImpl.submitToVerifying(taskId, currentAccount);
	}

	@Override
	public InitTaskSearchConditionVO getInitTaskSearchCondition(Integer moduleId) throws VerifyParameterException {
		String errMsg = null;
		if (null == moduleId || 0 >= moduleId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Module Primary-Key]";
		}
		throwException(errMsg);
		return taskServiceImpl.getInitTaskSearchCondition(moduleId);
	}

	@Override
	public Boolean isAssigned(Integer taskId) throws VerifyParameterException {
		String errMsg = null;
		if (null == taskId || 0 >= taskId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Key]";
		}
		throwException(errMsg);

		return taskServiceImpl.isAssigned(taskId);
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
