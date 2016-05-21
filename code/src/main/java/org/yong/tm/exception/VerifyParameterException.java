package org.yong.tm.exception;

/**
 * @Author Huang.Yong
 * @Description: 参数验证异常, 服务验证失败时抛出
 * @Date 2016年3月27日 下午1:38:16
 * @Version 0.1
 */
public class VerifyParameterException extends Exception {

	// @Fields serialVersionUID :
	private static final long serialVersionUID = 7384676175395687461L;

	public VerifyParameterException() {
		super();
	}

	public VerifyParameterException(String message, Throwable cause) {
		super(message, cause);
	}

	public VerifyParameterException(String message) {
		super(message);
	}

	public VerifyParameterException(Throwable cause) {
		super(cause);
	}

}
