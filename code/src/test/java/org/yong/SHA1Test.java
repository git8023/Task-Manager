package org.yong;

import org.apache.commons.codec.digest.DigestUtils;
import org.junit.Test;

public class SHA1Test {

	@Test
	public void sha1Test() throws Exception {
		String data = "123456";

		String pwd = DigestUtils.sha512Hex(data);
		System.out.println(pwd);
		System.out.println(pwd.length());

		pwd = DigestUtils.sha256Hex(data);
		System.out.println(pwd);
		System.out.println(pwd.length());
	}
}
