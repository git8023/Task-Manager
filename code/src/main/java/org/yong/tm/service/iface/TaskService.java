package org.yong.tm.service.iface;

import java.util.List;

import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Task;
import org.yong.tm.model.entities.User;
import org.yong.tm.model.enums.TaskStatus;
import org.yong.tm.model.vo.InitTaskSearchConditionVO;
import org.yong.tm.model.vo.TaskSearchCondition;
import org.yong.tm.model.vo.TaskVO;
import org.yong.util.page.Page;
import org.yong.util.page.PageCondition;

/**
 * @Author Huang.Yong
 * @Description: 任务服务接口
 * @Date 2016年4月3日 下午8:17:06
 * @Version 0.1
 */
public interface TaskService {

	/**
	 * @Title: getPage
	 * @Description: 分页获取任务列表
	 * @param taskSearchParameter 查询条件
	 * @param pageCondition 分页条件
	 * @return Page&lt;Task&gt; 分页对象
	 * @throws VerifyParameterException
	 */
	Page<Task> getPage(TaskSearchCondition taskSearchParameter, PageCondition pageCondition) throws VerifyParameterException;

	/**
	 * @Title: addTask
	 * @Description: 添加任务
	 * @param task 任务详情
	 * @param createdBy 任务创建者
	 * @return boolean true-成功,false-失败
	 * @throws VerifyParameterException
	 */
	boolean addTask(Task task, User createdBy) throws VerifyParameterException;

	/**
	 * @Title: exist
	 * @Description: 验证是否已存在的任务名
	 * @param name 任务名称
	 * @param moduleId 模块ID
	 * @return boolean true-已存在, false-不存在
	 * @throws VerifyParameterException
	 */
	boolean exist(String name, Integer moduleId) throws VerifyParameterException;

	/**
	 * @Title: getDetailsById
	 * @Description: 获取任务详情, 包括相关SQL文件,Issue,其他文件等关联信息
	 * @param taskId 任务ID
	 * @return Task 任务详情
	 * @throws VerifyParameterException
	 */
	Task getDetailsById(Integer taskId) throws VerifyParameterException;

	/**
	 * @Title: getAllTaskStatus
	 * @Description: 获取所有任务状态
	 * @return List&lt;TaskStatus&gt; 任务状态列表
	 */
	List<TaskStatus> getAllTaskStatus();

	/**
	 * @Title: getPageForManager
	 * @Description: 分页获取任务列表
	 * @param taskSearchCondition 查询条件
	 * @param pageCondition 分页条件
	 * @return Page&lt;TaskVO&gt; 任务分页对象
	 * @throws VerifyParameterException
	 */
	Page<TaskVO> getPageForManager(TaskSearchCondition taskSearchCondition, PageCondition pageCondition)
			throws VerifyParameterException;

	/**
	 * @Title: submitToVerifying
	 * @Description: 提交任务到等待审核状态
	 * @param taskId 任务ID
	 * @param currentAccount 当前用户账户
	 * @return boolean true-提交成功, false-提交失败
	 * @throws VerifyParameterException
	 */
	boolean submitToVerifying(Integer taskId, String currentAccount) throws VerifyParameterException;

	/**
	 * @Title: getInitTaskSearchCondition
	 * @Description: 获取初始化任务查询条件
	 * @param moduleId 模块ID
	 * @return InitTaskSearchConditionVO 初始化任务查询条件对象
	 * @throws VerifyParameterException
	 */
	InitTaskSearchConditionVO getInitTaskSearchCondition(Integer moduleId) throws VerifyParameterException;

	/**
	 * @Title: isAssigned
	 * @Description: 校验指定任务是否已经被分配
	 * @param taskId 任务ID
	 * @return Boolean true-已被分配, false-没有被分配
	 * @throws VerifyParameterException
	 */
	Boolean isAssigned(Integer taskId) throws VerifyParameterException;

}
