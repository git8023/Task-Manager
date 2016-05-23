package org.yong.tm.service.iface;

import java.util.List;

import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Attachment;
import org.yong.tm.model.entities.UserTask;
import org.yong.tm.model.enums.AttachmentType;
import org.yong.util.page.Page;
import org.yong.util.page.PageCondition;

/**
 * @Author Huang.Yong
 * @Description: 用户任务服务接口
 * @Date 2016年4月14日 上午9:40:48
 * @Version 0.1
 */
public interface UserTaskService {

	/**
	 * @Title: saveAccessories
	 * @Description: 保存附件
	 * @param accessories 附件列表
	 * @param taskId 任务ID
	 * @param account 当前用户
	 * @return boolean true-所有附件保存成功, false-至少一个附件保存失败
	 * @throws VerifyParameterException
	 */
	boolean saveAttachments(List<Attachment> accessories, Integer taskId, String account) throws VerifyParameterException;

	/**
	 * @Title: getTasksByUser
	 * @Description: 获取指定用户的任务列表
	 * @param account 用户账户
	 * @return List&lt;UserTask&gt; 任务关联列表
	 * @throws VerifyParameterException
	 */
	List<UserTask> getTasksByUser(String account) throws VerifyParameterException;

	/**
	 * @Title: assign
	 * @Description: 分配任务
	 * @param taskId 任务ID
	 * @param performer 任务执行者(接受者)
	 * @param manager 执行本次操作的管理员
	 * @return true-执行成功, false-执行失败
	 * @throws VerifyParameterException
	 */
	boolean assign(Integer taskId, String performer, String manager) throws VerifyParameterException;

	/**
	 * @Title: unassignTasks
	 * @Description: 取消已分配任务
	 * @param userTaskIds 任务ID列表
	 * @param performerKey 任务执行者(接受者)
	 * @param manager 执行本次操作的管理员
	 * @return true-执行成功, false-执行失败
	 * @throws VerifyParameterException
	 */
	boolean unassignTasks(Integer[] userTaskIds, String performerKey, String manager) throws VerifyParameterException;

	/**
	 * @Title: getAttachmentsByTaskId
	 * @Description: 获取附件列表
	 * @param pageCondition 分页详情
	 * @param taskId 任务ID
	 * @return List&lt;Attachment&gt; 附件列表
	 * @throws VerifyParameterException
	 */
	Page<Attachment> getAttachmentsByTaskId(PageCondition pageCondition, Integer taskId) throws VerifyParameterException;

	/**
	 * @Title: removeAttachments
	 * @Description: 删除附件
	 * @param attachmentIds 附件ID列表
	 * @return boolean true-删除成功, false-删除失败
	 * @throws VerifyParameterException
	 */
	boolean removeAttachments(Integer[] attachmentIds) throws VerifyParameterException;

	/**
	 * @Title: getAttachmentNoteByAttachmentId
	 * @Description: 获取附件备注
	 * @param attachmentId 附件ID
	 * @return String 备注
	 * @throws VerifyParameterException
	 */
	String getAttachmentNoteByAttachmentId(Integer attachmentId) throws VerifyParameterException;

	/**
	 * @Title: updateAttachment
	 * @Description: 更新附件备注
	 * @param attachmentId 附件ID
	 * @param note 附件备注
	 * @throws VerifyParameterException
	 */
	void updateAttachmentNote(Integer attachmentId, String note) throws VerifyParameterException;

	/**
	 * @Title: downloadAttachments
	 * @Description: 下载附件
	 * @param attachmentsIds 附件ID列表
	 * @return File ID列表长度为1时, 返回指定附件; 否则返回多个附件压缩包(.zip)
	 * @throws VerifyParameterException
	 */
	List<Attachment> downloadAttachments(Integer[] attachmentsIds) throws VerifyParameterException;

	/**
	 * @Title: getSQLFilesByTaskId
	 * @Description: 获取SQL附件列表
	 * @param taskId 任务ID
	 * @return List&lt;Attachment&gt; SQL附件列表
	 * @throws VerifyParameterException
	 */
	List<Attachment> getSQLFilesByTaskId(Integer taskId) throws VerifyParameterException;

	/**
	 * @Title: getAttachmentContent
	 * @Description: 获取附件内容(查阅可以将附件内容转换为字符串的附件类型).
	 * @param attachmentType 附件类型
	 * @param attachmentId 附件ID
	 * @return String 附件内容, 如果内容不可转为字符串总是返回<i>null<i>
	 * @throws VerifyParameterException
	 */
	String getAttachmentContent(AttachmentType attachmentType, Integer attachmentId) throws VerifyParameterException;
}
