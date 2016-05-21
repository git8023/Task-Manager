package org.yong.tm.service.verifier;

import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.User;
import org.yong.tm.service.iface.UserService;
import org.yong.util.string.StringUtil;

@Service
public class UserServiceVerifier implements UserService {

	@Resource(name = "userServiceImpl")
	private UserService userService;

	@Override
	public User login(String account, String pwd) throws VerifyParameterException {
		String msg = null;
		if (StringUtil.isEmpty(account, true)) {
			msg = "Missing User Account.";
		} else if (StringUtil.isEmpty(pwd, true)) {
			msg = "Missing Password";
		}

		if (null != msg) {
			throw new VerifyParameterException(msg);
		} else {
			pwd = DigestUtils.sha256Hex(pwd);
			return userService.login(account, pwd);
		}
	}

	@Override
	public List<User> getList() throws VerifyParameterException {
		return userService.getList();
	}
}
