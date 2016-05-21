/**
 * @FileName: WebUtil.java
 * @Author 
 * @Description:
 * @Date 2015年6月18日 下午2:00:40
 * @CopyRight CNP Corporation
 */
package org.yong.tm.web.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.Writer;
import java.net.URL;
import java.net.URLEncoder;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.ui.ModelMap;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.yong.util.string.StringUtil;

/**
 * @Description: Web工具类
 * @Date 2015年6月18日 下午2:00:40
 */
public class WebUtil {

	/**
	 * @Title: getModelMap
	 * @Description: 获取响应对象
	 * @param flag 成功或失败标记
	 * @param data 成功后响应数据
	 * @param message 失败后消息
	 * @return ModelMap flag:处理成功或失败, data:处理结果数据, message:处理失败消息
	 */
	public static ModelMap getModelMap(boolean flag, Object data, String message) {
		return new ModelMap("flag", flag).addAttribute("data", data).addAttribute("message", message);
	}

	/**
	 * @Title: getRequest
	 * @Description: 获取HttpServletRequest对象
	 * @return HttpServletRequest
	 */
	public static HttpServletRequest getRequest() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		return request;
	}

	/**
	 * @Title: getSessionAttr
	 * @Description: 获取Session域保存的数据
	 * @param key 保存时使用的关键字
	 * @return T 明确类型
	 */
	@SuppressWarnings("unchecked")
	public static <T> T getSessionAttr(String key) {
		return (T) getRequest().getSession(true).getAttribute(key);
	}

	/**
	 * @Title: setSessionAttr
	 * @Description: 在Session域中保存数据
	 * @param key 关键字
	 * @param value 数据对象
	 */
	public static void setSessionAttr(String key, Object value) {
		getRequest().getSession().setAttribute(key, value);
	}

	/**
	 * @Title: setRequestAttr
	 * @Description: 在Request作用域设置属性
	 * @param key 关键字
	 * @param value 值
	 */
	public static void setRequestAttr(String key, Object value) {
		getRequest().setAttribute(key, value);
	}

	/**
	 * @Title: getClassPath
	 * @Description: 获取ClassPath根目录(文件系统)
	 * @return String clssPath根目录
	 */
	public static String getClassPath() {
		URL resource = Thread.currentThread().getContextClassLoader().getResource("");
		String path = resource.getPath();

		if (isWindowsSys()) {
			path = path.substring(1);
		}

		return path;
	}

	/**
	 * @Title: isWindowsSys
	 * @Description: 前前统统是否 MS Windows 系统
	 * @return boolean
	 */
	public static boolean isWindowsSys() {
		return "\\".equals(System.getProperty("file.separator"));
	}

	/**
	 * @Title: getBaseFilPath
	 * @Description: 获取项目根路径(文件系统)
	 * @return String 项目相对路劲, 总是以"/"结尾
	 */
	public static String getBaseFilePath() {
		String basePath = getRequest().getSession().getServletContext().getRealPath("/");
		basePath = basePath.replace("\\", "/");
		if (!basePath.endsWith("/")) {
			basePath += "/";
		}
		return basePath;
	}

	/**
	 * @Title: getFile
	 * @Description: 获取文件, 总是保证文件夹一定存在.
	 * @param path 相对项目根径
	 * @return File 文件对象
	 * @throws IOException
	 */
	public static File getFile(String path) throws IOException {
		if (StringUtil.isEmpty(path, true)) {
			path = "";
		} else {
			path = path.replace("\\", "/");
			// 仅windows才有的操作
			// if (path.startsWith("/")) {
			// int length = path.length();
			// path = (length <= 1 ? "" : path.substring(1));
			// }
		}

		// 获取文件路径
		String baseFilePath = getBaseFilePath();
		String pathName = path;
		File file = null;
		if (pathName.startsWith(baseFilePath)) {
			file = new File(pathName);
		} else {
			file = new File(baseFilePath, pathName);
		}

		// 保证文件存在
		if (!file.exists()) {
			File dir = file.getParentFile();
			if (!dir.exists()) {
				dir.mkdirs();
			}
			dir.createNewFile();
		}
		return file;
	}

	/**
	 * @Title: getIpAddr
	 * @Description: 获取客户端IP地址
	 * @return String IP地址
	 */
	public static String getIpAddr() {
		HttpServletRequest request = getRequest();
		String ip = request.getHeader("X-Forwarded-For");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	/**
	 * @Title: getParameter
	 * @Description: 获取请求参数
	 * @param paramName 参数名
	 * @return String 请求值
	 */
	public static String getParameter(String paramName) {
		return getRequest().getParameter(paramName);
	}

	/**
	 * @Title: getModelMap
	 * @Description: 获取响应对象
	 * @param flag 成功或失败标记
	 * @param message 失败后消息
	 * @return ModelMap flag:标记, data:数据, message:消息
	 */
	public static ModelMap getModelMap(boolean flag, String message) {
		return getModelMap(flag, null, message);
	}

	/**
	 * @Title: getSession
	 * @Description: 获取当前Web会话
	 * @return HttpSession 当前会话
	 */
	public static HttpSession getSession() {
		return getRequest().getSession();
	}

	/**
	 * @Title: download
	 * @Description: 远程下载
	 * @param downloadableFile 可以被下载的文件
	 * @param resp 响应对象
	 * @throws Exception
	 */
	public static void download(File downloadableFile, HttpServletResponse resp) throws Exception {
		download(downloadableFile, null, resp);
	}

	/**
	 * @Title: download
	 * @Description: 远程下载
	 * @param downloadableFile 可以被下载的文件
	 * @param displayFileName 下载文件重命名
	 * @param resp 响应对象
	 * @throws Exception
	 */
	public static void download(File downloadableFile, String displayFileName, HttpServletResponse resp) throws Exception {
		resp.setContentType("application/download");
		if (StringUtil.isEmpty(displayFileName, true)) {
			displayFileName = downloadableFile.getName();
		}
		String encode = URLEncoder.encode(displayFileName, "UTF-8");
		encode = encode.replace("+", "%20");
		resp.setHeader("content-disposition", "attachment; filename=" + encode);

		ServletOutputStream outputStream = resp.getOutputStream();
		// FileUtils.copyFile(downloadableFile, outputStream);
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(downloadableFile);
			IOUtils.copy(fis, outputStream);
		} catch (Exception e) {
			// ignore
		} finally {
			IOUtils.closeQuietly(fis);
		}
	}

	/**
	 * @Title: getBaseUrl
	 * @Description: 获取项目根路劲URL
	 * @return String 项目根路劲URL
	 */
	public static String getBaseUrl() {
		HttpServletRequest request = getRequest();
		String path = request.getContextPath();
		String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
		return basePath;
	}

	/**
	 * @Title: setParams
	 * @Description: 设置非标准参数
	 * @param condition void
	 */
	public static <T> T setParams(Class<T> clazz) {
		try {
			T param = clazz.newInstance();
			BeanUtils.copyProperties(param, getRequest().getParameterMap());
			return param;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * @Title: writeMsg
	 * @Description: 向浏览器写出消息
	 * @param msg 消息
	 * @param resp 响应对象
	 */
	public static void writeMsg(String msg, HttpServletResponse resp) {
		Writer out = null;
		try {
			out = resp.getWriter();
			IOUtils.write(msg, out);
		} catch (IOException e) {
			// Ignore
		} finally {
			IOUtils.closeQuietly(out);
		}
	}

	/**
	 * @Title: removeSessionAttr
	 * @Description: 移除Session中保存的属性
	 * @param sessionKey 关键字
	 */
	public static void removeSessionAttr(String sessionKey) {
		getSession().removeAttribute(sessionKey);
	}

	/**
	 * @Title: getFileDir
	 * @Description: 获取文件夹, 总是保证文件夹一定存在
	 * @param dirPath 文件夹相对路径
	 * @return 代表文件夹的文件对象
	 * @throws IOException File
	 */
	public static File getFileDir(String dirPath) throws IOException {
		File dir = getFile(dirPath);
		if (!dir.exists()) {
			dir.mkdir();
		}
		return dir;
	}
}
