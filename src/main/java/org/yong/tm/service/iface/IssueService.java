package org.yong.tm.service.iface;

import java.util.List;

import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Issue;

/**
 * @Author Huang.Yong
 * @Description: Issue服务接口
 * @Date 2016年5月1日 下午2:11:43
 * @Version 0.1
 */
public interface IssueService {

	/**
	 * @Title: add
	 * @Description: 新增任务问题
	 * @param issue 任务问题描述
	 * @return boolean true-执行成功, false-执行失败
	 * @throws VerifyParameterException
	 */
	boolean add(Issue issue) throws VerifyParameterException;

	/**
	 * @Title: getIssuesByTaskId
	 * @Description: 获取指定任务下所有的Issue
	 * @param taskId 任务ID
	 * @return List&lt;Issue&gt; Issue列表
	 * @throws VerifyParameterException
	 */
	List<Issue> getIssuesByTaskId(Integer taskId) throws VerifyParameterException;

	/**
	 * @Title: getDetailById
	 * @Description: 获取详情
	 * @param id Issue ID
	 * @return Issue Issue 对象
	 * @throws VerifyParameterException
	 */
	Issue getDetailById(Integer id) throws VerifyParameterException;

	/**
	 * @Title: removeAllByTask
	 * @Description: 移除指定任务中所有Issue
	 * @param taskId 任务ID
	 * @return boolean true-执行成功, false-执行失败
	 * @throws VerifyParameterException
	 */
	boolean removeAllByTask(Integer taskId) throws VerifyParameterException;

	/**
	 * @Title: removeOneById
	 * @Description: 删除指定Issue
	 * @param issueId Issue ID
	 * @return boolean true-执行成功, false-执行失败
	 * @throws VerifyParameterException
	 */
	boolean removeOneById(Integer issueId) throws VerifyParameterException;

	/**
	 * @Title: getDetailsById
	 * @Description: 获取Issue详情, 包括: issue, task, model, project, performer 的信息
	 * @param issueId Issue ID
	 * @return Issue Issue详情
	 * @throws VerifyParameterException
	 */
	Issue getDetailsById(Integer issueId) throws VerifyParameterException;

}
