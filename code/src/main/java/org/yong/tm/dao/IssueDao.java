package org.yong.tm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.yong.tm.model.entities.Issue;

@Repository
public interface IssueDao {

	/**
	 * @Title: insert
	 * @Description: 添加任务Issue记录
	 * @param issue issue记录详情
	 * @return Integer 数据库受影响行数
	 */
	Integer insert(@Param("issue") Issue issue);

	/**
	 * @Title: selectByTaskId
	 * @Description: 指定任务ID查询Issue列表
	 * @param taskId 任务ID
	 * @return List&lt;Issue&gt; Issue列表
	 */
	List<Issue> selectByTaskId(Integer taskId);

	/**
	 * @Title: selectById
	 * @Description: 指定ID查询详情
	 * @param id Issue ID
	 * @return Issue 详情对象
	 */
	Issue selectById(Integer id);

	/**
	 * @Title: deleteAllByTaskId
	 * @Description: 指定任务ID删除相关Issue所有记录
	 * @param taskId 任务ID
	 * @return Integer 数据库受影响行数
	 */
	Integer deleteAllByTaskId(Integer taskId);

	/**
	 * @Title: deleteById
	 * @Description: 指定ID删除Issue
	 * @param issueId Issue ID
	 * @return Integer 数据库受影响行数
	 */
	Integer deleteById(Integer issueId);

	/**
	 * @Title: selectMoreInfosById
	 * @Description: 指定ID查询Issue信息, 包括: issue, task, model, project, performer的信息
	 * @param issueId Issue ID
	 * @return Issue Issue 详情
	 */
	Issue selectMoreInfosById(Integer issueId);

}
