package org.yong.tm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.yong.tm.model.entities.Attachment;
import org.yong.tm.model.entities.UserTask;

/**
 * @Author Huang.Yong
 * @Description: 用户任务附件数据访问接口
 * @Date 2016年4月17日 下午5:40:17
 * @Version 0.1
 */
public interface UserTaskDao {

	/**
	 * @Title: selectIdByTaskAndAccount
	 * @Description: 查询任务/用户关联ID
	 * @param taskId 任务ID
	 * @param account 用户账户
	 * @return Integer 关联ID
	 */
	Integer selectIdByTaskAndAccount(@Param("taskId") Integer taskId, @Param("account") String account);

	/**
	 * @Title: insertAttachments
	 * @Description: 插入任务附件记录
	 * @param attachments 附件列表
	 * @param userTaskId 任务用户ID
	 * @return Integer 数据库受影响行数
	 */
	Integer insertAttachments(@Param("attachments") List<Attachment> attachments, @Param("userTaskId") Integer userTaskId);

	/**
	 * @Title: selectByAccount
	 * @Description: 查询指定用户绑定的任务列表
	 * @param account 用户账户
	 * @return List&lt;UserTask&gt; 用户&任务关联列表
	 */
	List<UserTask> selectByAccount(String account);

	/**
	 * @Title: insertUserTask
	 * @Description: 插入用户任务关联关系
	 * @param userTask 关联详情
	 * @return Integer 数据库受影响行数
	 */
	Integer insertUserTask(@Param("userTask") UserTask userTask);

	/**
	 * @Title: selectAttachmentsByRIds
	 * @Description: 获取任务附件列表, 指定用户任务关系ID
	 * @param utIds 用户&任务关系ID列表
	 * @return List&lt;Attachment&gt; 附件列表
	 */
	List<Attachment> selectAttachmentsByRIds(@Param("userTaskIds") List<Integer> utIds);

	/**
	 * @Title: deleteAttachmentByRIds
	 * @Description: 删除附件记录
	 * @param utIds 用户&任务关系ID列表
	 * @return Integer 数据库受影响行数
	 */
	Integer deleteAttachmentByRIds(@Param("userTaskIds") List<Integer> utIds);

	/**
	 * @Title: deleteByIds
	 * @Description: 删除用户任务关系
	 * @param utIds 用户&任务关系ID列表
	 * @return Integer 数据库受影响行数
	 */
	Integer deleteByIds(@Param("userTaskIds") List<Integer> utIds);

	/**
	 * @Title: countRelationshipByTaskId
	 * @Description: 查询任务与用户的关系数量
	 * @param taskId 任务ID
	 * @return Integer 关系数量
	 */
	Integer countRelationshipByTaskId(Integer taskId);

	/**
	 * @Title: selectAttachmentsByTaskId
	 * @Description: 分页查询附件列表
	 * @param begin 开始行数
	 * @param size 每页大小
	 * @param taskId 任务ID
	 * @return List&lt;Attachment&gt; 附件列表
	 */
	List<Attachment> selectAttachmentsByTaskId(@Param("begin") Integer begin, @Param("size") Integer size,
			@Param("taskId") Integer taskId);

	/**
	 * @Title: countAttachmentsByTaskId
	 * @Description: 查询附件数量
	 * @param taskId 任务ID
	 * @return Integer 附件数量
	 */
	Integer countAttachmentsByTaskId(@Param("taskId") Integer taskId);

	/**
	 * @Title: selectAttachmentsByIds
	 * @Description: 查询附件列表
	 * @param attaIds 附件ID列表
	 * @return List&lt;Attachment&gt; 附件对象列表
	 */
	List<Attachment> selectAttachmentsByIds(@Param("attachmentIds") List<Integer> attaIds);

	/**
	 * @Title: deleteAttachmentByIds
	 * @Description: 删除附件记录
	 * @param attaIds 附件ID列表
	 * @return Integer 数据库受影响行数
	 */
	Integer deleteAttachmentByIds(@Param("attachmentIds") List<Integer> attaIds);

	/**
	 * @Title: selectAttachmentNoteByAttachmentId
	 * @Description: 查询附件备注
	 * @param attachmentId 附件ID
	 * @return String 备注
	 */
	String selectAttachmentNoteByAttachmentId(Integer attachmentId);

	/**
	 * @Title: updateAttachmentNote
	 * @Description: 更新附件备注
	 * @param attachmentId 附件ID
	 * @param note 备注
	 * @return Integer 数据库受影响行数
	 */
	Integer updateAttachmentNote(@Param("attachmentId") Integer attachmentId, @Param("note") String note);

	/**
	 * @Title: selectAttachmentByAttachmentIds
	 * @Description: 查询附件列表
	 * @param attachmentIds 附件ID列表
	 * @return List&lt;Attachment&gt; 附件列表
	 */
	List<Attachment> selectAttachmentByAttachmentIds(@Param("attachmentIds") List<Integer> attachmentIds);

}
