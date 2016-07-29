package org.yong.tm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.yong.tm.model.entities.Task;
import org.yong.tm.model.enums.TaskStatus;
import org.yong.tm.model.vo.TaskSearchCondition;
import org.yong.tm.model.vo.TaskVO;

/**
 * @Author Huang.Yong
 * @Description: 任务数据访问接口
 * @Date 2016年4月3日 下午8:45:45
 * @Version 0.1
 */
@Repository
public interface TaskDao {

	/**
	 * @Title: countListByCondition
	 * @Description: 查询任务数量
	 * @param taskSearchCondition 任务查询条件
	 * @return Integer 任务数量
	 */
	Integer countListByCondition(@Param("condition") TaskSearchCondition taskSearchCondition);

	/**
	 * @Title: selectListByCondition
	 * @Description: 查询任务数量
	 * @param begin 开始行号
	 * @param pageSize 分页大小
	 * @param taskSearchCondition 任务查询条件
	 * @return List&lt;Task&gt; 分页数据
	 */
	List<Task> selectListByCondition(@Param("begin") Integer begin, @Param("size") Integer pageSize,
			@Param("condition") TaskSearchCondition taskSearchCondition);

	/**
	 * @Title: countByNameAndModuleId
	 * @Description: 查询任务名数量
	 * @param name 任务名
	 * @param moduleId 模块ID
	 * @return Integer 数量
	 */
	Integer countByNameAndModuleId(@Param("name") String name, @Param("moduleId") Integer moduleId);

	/**
	 * @Title: insert
	 * @Description: 插入任务数据
	 * @param task 任务详情
	 * @param createdBy 任务创建者
	 * @return Integer 数据库受影响行数
	 */
	Integer insert(@Param("task") Task task, @Param("createdBy") String createdBy);

	/**
	 * @Title: countListByConditionForVO
	 * @Description: 查询任务总数量
	 * @param taskSearchCondition 查询条件
	 * @return Integer 总数量
	 */
	Integer countListByConditionForVO(@Param("condition") TaskSearchCondition taskSearchCondition);

	/**
	 * @Title: selectListByConditionForVO
	 * @Description: 分页而获取任务列表
	 * @param begin 开始行号
	 * @param pageSize 每页大小
	 * @param taskSearchCondition 查询条件
	 * @return List&lt;TaskVO&gt; 分页数据
	 */
	List<TaskVO> selectListByConditionForVO(@Param("begin") Integer begin, @Param("size") Integer pageSize,
			@Param("condition") TaskSearchCondition taskSearchCondition);

	/**
	 * @Title: countByTaskIdAndAccount
	 * @Description: 指定任务ID和用户账户获取任务数量
	 * @param taskId 任务ID
	 * @param performer 任务执行者账户
	 * @return Integer 任务数量
	 */
	Integer countByTaskIdAndAccount(@Param("taskId") Integer taskId, @Param("performer") String performer);

	/**
	 * @Title: countByTaskIdAndStatus
	 * @Description: 指定任务ID和状态查询任务数量
	 * @param taskId 任务ID
	 * @param taskStatus 任务状态(等于指定值或者NULL值)
	 * @return Integer 任务数量
	 */
	Integer countByTaskIdAndStatusOrNull(@Param("taskId") Integer taskId, @Param("taskStatus") TaskStatus taskStatus);

	/**
	 * @Title: updateStatusByIdAndAccount
	 * @Description: 更新与用户相关的任务状态
	 * @param taskId 任务ID
	 * @param performer 任务执行这
	 * @param taskStatus 任务状态
	 * @return Integer 数据库受影响行数
	 */
	Integer updateStatusByIdAndAccount(@Param("taskId") Integer taskId, @Param("performer") String performer,
			@Param("taskStatus") TaskStatus taskStatus);

	/**
	 * @Title: updateStatusById
	 * @Description: 更新任务状态
	 * @param taskId 任务ID
	 * @param taskStatus 状态
	 * @return Integer 数据库受影响行数
	 */
	Integer updateStatusById(@Param("taskId") Integer taskId, @Param("taskStatus") TaskStatus taskStatus);

}
