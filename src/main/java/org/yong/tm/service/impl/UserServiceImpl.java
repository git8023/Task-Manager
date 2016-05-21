package org.yong.tm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yong.tm.dao.UserDao;
import org.yong.tm.model.entities.User;
import org.yong.tm.service.iface.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;

	@Override
	public User login(String account, String pwd) {
		return userDao.selectByAccountAndPwd(account, pwd);
	}

	@Override
	public List<User> getList() {
		return userDao.selectList();
	}

}
