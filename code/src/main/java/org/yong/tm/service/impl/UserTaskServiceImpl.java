package org.yong.tm.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.yong.tm.dao.AttachmentDao;
import org.yong.tm.dao.TaskDao;
import org.yong.tm.dao.UserTaskDao;
import org.yong.tm.model.entities.Attachment;
import org.yong.tm.model.entities.UserTask;
import org.yong.tm.model.enums.AttachmentType;
import org.yong.tm.model.enums.TaskStatus;
import org.yong.tm.service.iface.UserTaskService;
import org.yong.util.file.FileUtil;
import org.yong.util.page.DataHandler;
import org.yong.util.page.Page;
import org.yong.util.page.PageCondition;
import org.yong.util.string.StringUtil;

import com.google.common.collect.Lists;

/**
 * @Author Huang.Yong
 * @Description: 任务服务实现
 * @Date 2016年4月14日 上午9:44:28
 * @Version 0.1
 */
@Service
public class UserTaskServiceImpl implements UserTaskService {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Autowired
	private UserTaskDao userTaskDao;

	@Autowired
	private TaskDao taskDao;

	@Autowired
	private AttachmentDao attachmentDao;

	@Override
	public boolean saveAttachments(List<Attachment> accessories, Integer taskId, String account) {
		Integer userTaskId = userTaskDao.selectIdByTaskAndAccount(taskId, account);
		Integer rowCount = userTaskDao.insertAttachments(accessories, userTaskId);
		return (rowCount == accessories.size());
	}

	@Override
	public List<UserTask> getTasksByUser(String account) {
		return userTaskDao.selectByAccount(account);
	}

	@Override
	@Transactional
	public boolean assign(Integer taskId, String performer, String manager) {
		UserTask userTask = new UserTask(taskId, performer, manager);
		TaskStatus taskStatus = TaskStatus.DOING;

		userTask.setStatus(taskStatus);
		userTaskDao.insertUserTask(userTask);
		taskDao.updateStatusById(taskId, taskStatus);

		return true;
	}

	@Override
	public boolean unassignTasks(Integer[] userTaskIds, String performerKey, String manager) {
		// 获取所有附件
		List<Integer> utIds = Lists.newArrayList(userTaskIds);
		List<Attachment> attachments = userTaskDao.selectAttachmentsByRIds(utIds);

		// 删除附件
		deleteAttachmentFiles(attachments);
		userTaskDao.deleteAttachmentByRIds(utIds);

		// 解除用户&任务关系
		Integer rowCount = userTaskDao.deleteByIds(utIds);
		return (userTaskIds.length == rowCount);
	}

	/**
	 * @Title: deleteAttachmentFiles
	 * @Description: 删除附件文件
	 * @param attachments 附件对象列表
	 */
	private void deleteAttachmentFiles(List<Attachment> attachments) {
		for (Attachment attachment : attachments) {
			String sqlPath = attachment.getSqlPath();
			if (StringUtil.isEmpty(sqlPath, true)) {
				FileUtil.deleteByRelativePath(sqlPath);
			}

			String imagePath = attachment.getImagePath();
			if (StringUtil.isEmpty(imagePath, true)) {
				FileUtil.deleteByRelativePath(imagePath);
			}

			String otherPath = attachment.getOtherPath();
			if (StringUtil.isEmpty(otherPath, true)) {
				FileUtil.deleteByRelativePath(otherPath);
			}
		}
	}

	@Override
	public Page<Attachment> getAttachmentsByTaskId(PageCondition pageCondition, final Integer taskId) {
		return new Page<Attachment>(pageCondition, new DataHandler<Attachment>() {
			@Override
			public List<Attachment> getElements(Integer pageIndex, Integer pageSize) {
				Integer begin = (pageIndex - 1) * pageSize;
				return userTaskDao.selectAttachmentsByTaskId(begin, pageSize, taskId);
			}

			@Override
			public Integer getRowCount() {
				return userTaskDao.countAttachmentsByTaskId(taskId);
			}
		});
	}

	@Override
	public boolean removeAttachments(Integer[] attachmentIds) {
		List<Integer> attaIds = Lists.newArrayList(attachmentIds);
		List<Attachment> attachments = userTaskDao.selectAttachmentsByIds(attaIds);
		deleteAttachmentFiles(attachments);
		Integer rowCount = userTaskDao.deleteAttachmentByIds(attaIds);
		return (attaIds.size() == rowCount);
	}

	@Override
	public void updateAttachmentNote(Integer attachmentId, String note) {
		userTaskDao.updateAttachmentNote(attachmentId, note);
	}

	@Override
	public String getAttachmentNoteByAttachmentId(Integer attachmentId) {
		return userTaskDao.selectAttachmentNoteByAttachmentId(attachmentId);
	}

	@Override
	public List<Attachment> downloadAttachments(Integer[] attachmentsIds) {
		List<Integer> attaList = Lists.newArrayList(attachmentsIds);
		return userTaskDao.selectAttachmentByAttachmentIds(attaList);
	}

	@Override
	public List<Attachment> getSQLFilesByTaskId(Integer taskId) {
		return userTaskDao.selectSqlAttachmentByTaskId(taskId);
	}

	@Override
	public String getAttachmentContent(AttachmentType attachmentType, Integer attachmentId) {
		// 获取附件对象
		Attachment attachment = attachmentDao.selectById(attachmentId);

		// 获取附件文件对象
		File attachmentFile = attachmentType.getFile(attachment);

		// 将附件文件对象转换为字符串
		String content = null;
		if (attachmentFile.exists()) {
			// 返回结果(转换后的数据)
			try {
				content = FileUtils.readFileToString(attachmentFile);
			} catch (IOException e) {
				LOGGER.warn("Reading the attachment[" + attachmentType + "] file content error:" + e.getMessage(), e);
			}
		}
		return content;
	}
}
