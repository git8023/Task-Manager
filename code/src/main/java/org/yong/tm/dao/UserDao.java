package org.yong.tm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.yong.tm.model.entities.User;

public interface UserDao {

	/**
	 * @Title: selectByAccountAndPwd
	 * @Description: 指定用户名和密码查询用户
	 * @param account 用户名
	 * @param pwd 密码
	 * @return User 用户对象
	 */
	User selectByAccountAndPwd(@Param("account") String account, @Param("pwd") String pwd);

	/**
	 * @Title: selectList
	 * @Description: 查询用户列表
	 * @return List&lt;User&gt; 用户列表
	 */
	List<User> selectList();

}
