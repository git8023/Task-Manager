package org.yong.tm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.yong.tm.model.entities.Project;

/**
 * @Author Huang.Yong
 * @Description: 项目数据访问接口
 * @Date 2016年4月1日 下午6:10:04
 * @Version 0.1
 */
@Repository
public interface ProjectDao {

	/**
	 * @Title: insertProject
	 * @Description: 插入项目信息
	 * @param project 项目对象
	 * @return Integer 数据库受影响行数
	 */
	Integer insertProject(@Param("project") Project project);

	/**
	 * @Title: selectListByCondition
	 * @Description: 指定条件查询项目列表
	 * @return List&lt;Project&gt; 项目列表
	 */
	List<Project> selectListByCondition();

	/**
	 * @Title: updateById
	 * @Description: 更新项目信息
	 * @param id 项目ID
	 * @param project 更新详情
	 * @return Integer 数据库受影响行数
	 */
	Integer updateById(@Param("id") Integer id, @Param("project") Project project);

}
