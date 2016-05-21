package org.yong.tm.service.verifier;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Issue;
import org.yong.tm.model.entities.Task;
import org.yong.tm.model.entities.User;
import org.yong.tm.service.iface.IssueService;
import org.yong.tm.util.TMConstants;
import org.yong.util.string.StringUtil;

@Service
public class IssueServiceVerifier implements IssueService {

	@Resource
	private IssueService issueServiceImpl;

	@Override
	public boolean add(Issue issue) throws VerifyParameterException {
		String errMsg = null;
		if (null == issue) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Issue]";
		} else {
			// Name
			String name = issue.getName();
			if (StringUtil.isEmpty(name, true)) {
				errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Issue Name]";
			}

			// Task
			Task task = issue.getTask();
			if (null == task) {
				errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task]";
			} else {
				Integer taskId = task.getId();
				if (null == taskId || 0 >= taskId) {
					errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Key]";
				}
			}

			// Created By
			User createdBy = issue.getCreatedBy();
			if (null == createdBy || StringUtil.isEmpty(createdBy.getAccount(), true)) {
				errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Performer]";
			}
		}

		throwException(errMsg);
		return issueServiceImpl.add(issue);
	}

	@Override
	public List<Issue> getIssuesByTaskId(Integer taskId) throws VerifyParameterException {
		String errMsg = null;
		if (null == taskId || 0 >= taskId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Key]";
		}

		throwException(errMsg);
		return issueServiceImpl.getIssuesByTaskId(taskId);
	}

	@Override
	public Issue getDetailById(Integer id) throws VerifyParameterException {
		String errMsg = null;
		if (null == id || 0 >= id) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Issue Primary-Key]";
		}

		throwException(errMsg);
		return issueServiceImpl.getDetailById(id);
	}

	@Override
	public boolean removeAllByTask(Integer taskId) throws VerifyParameterException {
		String errMsg = null;
		if (null == taskId || 0 >= taskId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Key]";
		}

		throwException(errMsg);
		return issueServiceImpl.removeAllByTask(taskId);
	}

	@Override
	public boolean removeOneById(Integer issueId) throws VerifyParameterException {
		String errMsg = null;
		if (null == issueId || 0 >= issueId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Issue Primary-Key]";
		}

		throwException(errMsg);
		return issueServiceImpl.removeOneById(issueId);
	}

	@Override
	public Issue getDetailsById(Integer issueId) throws VerifyParameterException {
		String errMsg = null;
		if (null == issueId || 0 >= issueId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Issue Primary-Key]";
		}

		throwException(errMsg);
		return issueServiceImpl.getDetailsById(issueId);
	}

	/**
	 * @Title: throwException
	 * @Description: 抛出验证异常
	 * @param errMsg 异常消息
	 * @throws VerifyParameterException
	 */
	private void throwException(String errMsg) throws VerifyParameterException {
		if (null != errMsg) {
			throw new VerifyParameterException(errMsg);
		}
	}
}
