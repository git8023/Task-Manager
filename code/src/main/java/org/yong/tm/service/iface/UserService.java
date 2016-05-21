package org.yong.tm.service.iface;

import java.util.List;

import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.User;

public interface UserService {

	/**
	 * @Title: login
	 * @Description: 用户登陆
	 * @param account 用户名
	 * @param pwd 密码
	 * @return User 登陆成功的用户
	 * @throws VerifyParameterException
	 * @throws Exception
	 */
	User login(String account, String pwd) throws VerifyParameterException;

	/**
	 * @Title: getList
	 * @Description: 获取用户列表
	 * @return List&lt;User&gt; 用户列表
	 */
	List<User> getList() throws VerifyParameterException;

}
