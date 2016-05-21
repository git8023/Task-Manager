package org.yong.tm.service.verifier;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.yong.tm.dao.UserTaskDao;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Attachment;
import org.yong.tm.model.entities.UserTask;
import org.yong.tm.service.iface.UserTaskService;
import org.yong.tm.util.TMConstants;
import org.yong.util.page.Page;
import org.yong.util.page.PageCondition;
import org.yong.util.string.StringUtil;

/**
 * @Author Huang.Yong
 * @Description: 用户任务服务验证实现
 * @Date 2016年4月14日 上午9:42:22
 * @Version 0.1
 */
@Service
public class UserTaskServiceVerifier implements UserTaskService {

	@Resource
	private UserTaskService userTaskServiceImpl;

	@Autowired
	private UserTaskDao userTaskDao;

	@Override
	public boolean saveAttachments(List<Attachment> accessories, Integer taskId, String account) throws VerifyParameterException {
		String errMsg = null;
		if (CollectionUtils.isEmpty(accessories)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Attachment]";
		} else if (null == taskId || 0 >= taskId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Key]";
		} else if (StringUtil.isEmpty(account, true)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_INVALID_USER;
		} else {
			Integer userTaskId = userTaskDao.selectIdByTaskAndAccount(taskId, account);
			if (null == userTaskId) {
				errMsg = "Access denied, Undistributed task can't upload attachments";
			}
		}

		throwException(errMsg);
		return userTaskServiceImpl.saveAttachments(accessories, taskId, account);
	}

	@Override
	public List<UserTask> getTasksByUser(String account) throws VerifyParameterException {
		String errMsg = null;
		if (StringUtil.isEmpty(account, true)) {
			errMsg = TMConstants.ACCESS_DENIED + ",Specify a user is invalid[userId=" + account + "]";
		}
		throwException(errMsg);
		return userTaskServiceImpl.getTasksByUser(account);
	}

	@Override
	public boolean assign(Integer taskId, String performer, String manager) throws VerifyParameterException {
		String errMsg = null;
		if (null == taskId || 0 >= taskId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Key]";
		} else if (StringUtil.isEmpty(performer, true)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Performer Primary-Key]";
		} else if (StringUtil.isEmpty(manager, true)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Manager Primary-Key]";
		} else {
			// 指定任务是否已经被指派
			boolean assigned = (1 <= userTaskDao.countRelationshipByTaskId(taskId));
			if (assigned) {
				errMsg = TMConstants.ACCESS_DENIED + ",Specified task has been assigned to performer";
			}
		}

		throwException(errMsg);
		return userTaskServiceImpl.assign(taskId, performer, manager);
	}

	@Override
	public boolean unassignTasks(Integer[] userTaskIds, String performerKey, String manager) throws VerifyParameterException {
		String errMsg = null;

		if (null == userTaskIds || 0 == userTaskIds.length) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Keys]";
		} else if (StringUtil.isEmpty(performerKey, true)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Performer Primary-Key]";
		} else if (StringUtil.isEmpty(manager, true)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Manager Primary-Key]";
		}

		throwException(errMsg);
		return userTaskServiceImpl.unassignTasks(userTaskIds, performerKey, manager);
	}

	@Override
	public Page<Attachment> getAttachmentsByTaskId(PageCondition pageCondition, Integer taskId) throws VerifyParameterException {
		String errMsg = null;
		if (null == taskId || 0 >= taskId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Key]";
		}
		throwException(errMsg);
		return userTaskServiceImpl.getAttachmentsByTaskId(pageCondition, taskId);
	}

	@Override
	public boolean removeAttachments(Integer[] attachmentIds) throws VerifyParameterException {
		String errMsg = null;
		if (null == attachmentIds || 0 >= attachmentIds.length) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Attachment Primary-Keys]";
		}
		throwException(errMsg);
		return userTaskServiceImpl.removeAttachments(attachmentIds);
	}

	@Override
	public String getAttachmentNoteByAttachmentId(Integer attachmentId) throws VerifyParameterException {
		String errMsg = null;
		if (null == attachmentId || 0 == attachmentId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Attachment Primary-Key]";
		}
		throwException(errMsg);
		return userTaskServiceImpl.getAttachmentNoteByAttachmentId(attachmentId);
	}

	@Override
	public void updateAttachmentNote(Integer attachmentId, String note) throws VerifyParameterException {
		String errMsg = null;
		if (null == attachmentId || 0 == attachmentId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Attachment Primary-Key]";
		}
		throwException(errMsg);
		userTaskServiceImpl.updateAttachmentNote(attachmentId, note);
	}

	@Override
	public List<Attachment> downloadAttachments(Integer[] attachmentsIds) throws VerifyParameterException {
		String errMsg = null;
		if (null == attachmentsIds || 0 == attachmentsIds.length) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Attachment Primary-Keys]";
		}
		throwException(errMsg);
		return userTaskServiceImpl.downloadAttachments(attachmentsIds);
	}

	@Override
	public List<Attachment> getSQLFilesByTaskId(Integer taskId) throws VerifyParameterException {
		String errMsg = null;
		if (null == taskId || 0 >= taskId) {
			errMsg = TMConstants.ACCESS_DENIED_OF_PARAMETERS + "[Task Primary-Key]";
		}
		throwException(errMsg);
		return userTaskServiceImpl.getSQLFilesByTaskId(taskId);
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
