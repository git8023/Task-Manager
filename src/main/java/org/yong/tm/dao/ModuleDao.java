package org.yong.tm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.yong.tm.model.entities.Module;
import org.yong.tm.model.entities.User;

/**
 * @Author Huang.Yong
 * @Description: 模块数据访问接口
 * @Date 2016年4月2日 上午9:55:26
 * @Version 0.1
 */
public interface ModuleDao {

	/**
	 * @Title: selectByProjectId
	 * @Description: 指定项目ID查询模块列表
	 * @param projectId 项目ID
	 * @return List&ltgModule&gt; 模块列表
	 */
	List<Module> selectByProjectId(Integer projectId);

	/**
	 * @Title: insert
	 * @Description: 插入模块
	 * @param module 模块详情
	 * @return Integer 数据库受影响行数
	 */
	Integer insert(@Param("module") Module module);

	/**
	 * @Title: updateById
	 * @Description: 更新模块信息
	 * @param id 模块ID
	 * @param module 模块信息
	 * @return Integer 数据库受影响行数
	 */
	Integer updateById(@Param("id") Integer id, @Param("module") Module module);

	/**
	 * @Title: selectById
	 * @Description: 指定模块ID查询模块详情
	 * @param moduleId 模块ID
	 * @return Module 模块详情
	 */
	Module selectById(Integer moduleId);

	/**
	 * @Title: selectUsersByModuleId
	 * @Description: 查询与模块ID关联的用户列表
	 * @param moduleId 模块ID
	 * @return List&lt;User&gt; 任务列表
	 */
	List<User> selectUsersByModuleId(Integer moduleId);

}
