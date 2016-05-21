package org.yong.tm.util;

import org.yong.util.DateUtil;

/**
 * @Author Huang.Yong
 * @Description: 系统常量类
 * @Date 2016年3月27日 下午1:45:06
 * @Version 0.1
 */
public abstract class TMConstants {

	/** 保存或获取Session中已登陆用户 */
	public static final String SESSION_EFFECTIVE_USER = "user";

	/** 消息提醒: 请求拒绝 */
	public static final String ACCESS_DENIED = "The request failed";

	/** 消息提醒: 当前用户无效 */
	public static final String ACCESS_DENIED_OF_INVALID_USER = ACCESS_DENIED + ", Invalid local users.";

	/** 消息提醒: 请求拒绝 */
	public static final String ACCESS_DENIED_OF_PARAMETERS = ACCESS_DENIED + ", Missing requirement parameters";

	/** Request域中保存的请求参数 */
	public static final String REQUEST_PARAM = "param";

	/** 文件上传路径 */
	public static final String DIRECTORY_UPLOAD = "upload/";

	/** SQL 文件保存路径 */
	public static final String DIRECTORY_SQL = "sql/";

	/** 任意文件保存路径 */
	public static final String DIRECTORY_ANY = "any/";

	/** 多个附件下载时的文件名称 */
	public static final String DOWNLOAD_NAME_OF_ATTACHMENTS = "attachments";

	/** 下载文件夹 */
	public static final String DOWNLOAD_DIR = "download/tmp/";

	/** 模板: 导出Issue的PDF格式 */
	public static final String EXPORT_PDF_OF_ISSUE = "exportTemplates/issue/export_pdf.html";

	/**
	 * @Title: getDownloadDir
	 * @Description: 获取下载文件夹路径
	 * @return String 下载文件夹路径
	 */
	public static final String getDownloadDir() {
		return DOWNLOAD_DIR + DateUtil.formatNow(DateUtil.PATTERN_YMD) + "/";
	}
}
