package org.yong.tm.web.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Issue;
import org.yong.tm.model.entities.User;
import org.yong.tm.service.iface.IssueService;
import org.yong.tm.util.TMConstants;
import org.yong.tm.web.util.WebUtil;
import org.yong.util.file.FileUtil;
import org.yong.util.pdf.PDFExportConf;
import org.yong.util.pdf.PDFUtil;
import org.yong.util.string.StringUtil;

/**
 * @Author Huang.Yong
 * @Description: 任务Issue控制器
 * @Date 2016年5月1日 下午2:02:31
 * @Version 0.1
 */
@Controller
@RequestMapping("/issue")
public class IssueController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Resource(name = "issueServiceVerifier")
	private IssueService issueService;

	/**
	 * @Title: add
	 * @Description: 添加任务Issue
	 * @param issue Issue描述
	 * @return ModelMap flag:true-添加成功,false-添加失败; message:失败消息;
	 */
	@RequestMapping("/add")
	@ResponseBody
	public ModelMap add(Issue issue) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			if (null != issue) {
				issue.setCreatedBy(sessionUser);
			}
			flag = issueService.add(issue);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			message = "Add issue error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: getIssues
	 * @Description: 获取指定任务下所有的Issue
	 * @param taskId 任务ID
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:Issue列表
	 */
	@RequestMapping("/getIssues")
	@ResponseBody
	public ModelMap getIssues(Integer taskId) {
		boolean flag = false;
		String message = null;
		List<Issue> data = null;

		try {
			data = issueService.getIssuesByTaskId(taskId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Get issues error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: showDetail
	 * @Description: 展示Issue详情
	 * @param id Issue ID
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:Issue详情
	 */
	@RequestMapping("/showDetail")
	@ResponseBody
	public ModelMap showDetail(Integer id) {
		boolean flag = false;
		String message = null;
		Issue data = null;

		try {
			data = issueService.getDetailById(id);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: removeAll
	 * @Description: 指定任务ID删除所有Issue
	 * @param taskId 任务ID
	 * @return ModelMap flag:true-执行成功,false-执行失败; message:失败消息;
	 */
	@RequestMapping("/removeAll")
	@ResponseBody
	public ModelMap removeAll(Integer taskId) {
		boolean flag = false;
		String message = null;

		try {
			flag = issueService.removeAllByTask(taskId);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Remove all issues by task error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: removeById
	 * @Description: 指定ID删除Issue
	 * @param issueId Issue ID
	 * @return ModelMap flag:true-执行成功,false-执行失败; message:失败消息
	 */
	@RequestMapping("/removeIssue")
	@ResponseBody
	public ModelMap removeIssue(Integer issueId) {
		boolean flag = false;
		String message = null;

		try {
			flag = issueService.removeOneById(issueId);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Remove";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: exportWord
	 * @Description: 导出Word
	 * @param issueId Issue ID
	 */
	@RequestMapping("/exportWord")
	public void exportWord(Integer issueId, HttpServletResponse resp) {
		String message = null;
		File word = null;

		try {
			Issue issue = issueService.getDetailsById(issueId);
			word = transferToWord(issue);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			message = "Export word error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		if (StringUtil.isEmpty(message, true)) {
			try {
				WebUtil.download(word, resp);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
			}
		} else {
			LOGGER.error(message);
			WebUtil.writeMsg(message, resp);
		}
	}

	/**
	 * @Title: viewDetail
	 * @Description: 展示详情视图
	 * @param issueId Issue ID
	 * @return String 详情视图逻辑视图
	 */
	@RequestMapping("/viewDetail")
	public String viewDetail(Integer issueId) {
		boolean flag = false;
		String message = null;
		Issue data = null;

		try {
			data = issueService.getDetailById(issueId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "View detail error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		if (flag) {
			WebUtil.setRequestAttr(TMConstants.REQUEST_TEXT_CONTENT, data);
			WebUtil.setRequestAttr(TMConstants.REQUEST_ATTACHMENT_TYPE, TMConstants.ATTACHMENT_TYPE_OF_ISSUE);
			return "task/preview_issue";
		} else {
			WebUtil.setRequestAttr(TMConstants.REQUEST_ERROR_MESSAGE, message);
			return TMConstants.URL_ERROR_PAGE;
		}
	}

	/**
	 * @Title: transferToWord
	 * @Description: Issue转换为Word对象
	 * @param issue Issue对象
	 * @return File Word文件对象
	 * @throws Exception
	 */
	private File transferToWord(Issue issue) throws Exception {
		File template = WebUtil.getFile(TMConstants.EXPORT_PDF_OF_ISSUE);
		String fileContent = FileUtil.parsePlaceholder(template, issue);

		// 修复 summernote 编辑器的不足
		fileContent = repairNonstandardTag(fileContent);

		// 使用临时文件保存替换后的数据
		String name = issue.getName().trim();
		File tmpFile = File.createTempFile(name, ".html");
		FileUtils.write(tmpFile, fileContent);
		String downloadFilePath = tmpFile.getAbsolutePath();

		String pdfPath = getPdfPath(name);
		PDFExportConf conf = new PDFExportConf(downloadFilePath, true, pdfPath);
		PDFUtil pdfUtil = new PDFUtil(conf);
		return pdfUtil.export();
	}

	/**
	 * @Title: repairNonstandardTag
	 * @Description: 修复不标准的HTML标签
	 * @param html
	 * @return String
	 */
	private static String repairNonstandardTag(String html) {
		html = html.replace("\t", "");

		// <br>
		html = html.replace("<br>", "<br/>");

		// <p>
		// html = html.replace("<p>", "<p/>");

		// <img>
		Pattern imgRegex = Pattern.compile("<img[\\s\\S&&[^>]]+[^/]>");
		Matcher imgMatcher = imgRegex.matcher(html);
		while (imgMatcher.find()) {
			String imgTag = imgMatcher.group();
			String repairedImgTag = imgTag.replace(">", "/>");
			html = html.replace(imgTag, repairedImgTag);
		}

		return html;
	}

	/**
	 * @Title: getPdfPath
	 * @Description: 获取PDF路径
	 * @param issueName Issue Name, PDF文件名
	 * @return String PDF文件路径
	 * @throws IOException
	 */
	private String getPdfPath(String issueName) throws IOException {
		String downloadDir = TMConstants.getDownloadDir();
		File dir = WebUtil.getFile(downloadDir);
		File pdf = new File(dir, issueName + ".pdf");
		return pdf.getAbsolutePath();
	}

}