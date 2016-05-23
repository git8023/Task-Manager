package org.yong.tm.web.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Attachment;
import org.yong.tm.model.entities.Task;
import org.yong.tm.model.entities.User;
import org.yong.tm.model.entities.UserTask;
import org.yong.tm.model.enums.AttachmentType;
import org.yong.tm.model.enums.TaskStatus;
import org.yong.tm.model.vo.InitTaskSearchConditionVO;
import org.yong.tm.model.vo.TaskSearchCondition;
import org.yong.tm.model.vo.TaskVO;
import org.yong.tm.service.iface.TaskService;
import org.yong.tm.service.iface.UserTaskService;
import org.yong.tm.util.TMConstants;
import org.yong.tm.web.util.WebUtil;
import org.yong.util.file.FileUtil;
import org.yong.util.page.Page;
import org.yong.util.page.PageCondition;
import org.yong.util.string.StringUtil;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * @Author Huang.Yong
 * @Description: 任务控制器
 * @Date 2016年4月3日 下午5:07:42
 * @Version 0.1
 */
@Controller
@RequestMapping("/task")
public class TaskController {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Resource(name = "taskServiceVerifier")
	private TaskService taskService;

	@Resource(name = "userTaskServiceVerifier")
	private UserTaskService userTaskService;

	/**
	 * @Title: searchTaskList
	 * @Description: 查询任务列表
	 * @param taskSearchCondition 任务查询参数
	 * @param pageCondition 分页查询条件
	 * @return ModelMap flag:true-查询成功,false-查询失败; message:查询失败消息; data:分页对象
	 */
	@RequestMapping("/searchTaskList")
	@ResponseBody
	public ModelMap searchTaskList(TaskSearchCondition taskSearchCondition, PageCondition pageCondition) {
		boolean flag = false;
		String message = null;
		Page<Task> data = null;

		try {
			data = taskService.getPage(taskSearchCondition, pageCondition);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			message = "Search task list error.";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: searchTaskListForManager
	 * @Description: 查询任务列表(管理界面)
	 * @param taskSearchCondition 查询条件
	 * @param pageCondition 分页条件
	 * @return ModelMap flag:true-查询成功,false-查询失败; message:查询失败消息; data:分页对象
	 */
	@RequestMapping("/searchTaskListForManager")
	@ResponseBody
	public ModelMap searchTaskListForManager(TaskSearchCondition taskSearchCondition, PageCondition pageCondition) {
		boolean flag = false;
		String message = null;
		Page<TaskVO> data = null;

		try {
			data = taskService.getPageForManager(taskSearchCondition, pageCondition);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Search task list for manager error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: addTask
	 * @Description: 添加任务
	 * @param task 任务详情
	 * @return ModelMap flag:true-添加成功,false-添加失败; message:失败消息
	 */
	@RequestMapping("/addTask")
	@ResponseBody
	public ModelMap addTask(Task task) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			flag = taskService.addTask(task, sessionUser);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Add task error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: exist
	 * @Description: 验证任务名是否存在
	 * @param name 任务名
	 * @param moduleId 模块ID
	 * @return ModelMap flag:true-处理成功,false-处理失败; message:失败消息;
	 *         data:true-已经存在,false-不存在
	 */
	@RequestMapping("/exist")
	@ResponseBody
	public ModelMap exist(String name, Integer moduleId) {
		boolean flag = false;
		String message = null;
		Map<String, Object> data = Maps.newHashMap();

		try {
			boolean exist = taskService.exist(name, moduleId);
			data.put("exist", exist);
			data.put("msg", "The name of the task already exist.");
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Search task name exists error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: taskDetails
	 * @Description: 获取任务详情
	 * @param taskId 任务ID
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:任务对象
	 */
	@RequestMapping("/taskDetails")
	@ResponseBody
	public ModelMap taskDetails(Integer taskId) {
		boolean flag = false;
		String message = null;
		Task data = null;

		try {
			data = taskService.getDetailsById(taskId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Search task details error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: uploadSqls
	 * @Description: 任务SQL文件上传(支持多文件上传)
	 * @param req 请求对象
	 * @param taskId 任务ID
	 * @return ModelMap flag:true-上传成功,false-至少一个上传失败; message-上传失败消息
	 */
	@RequestMapping("/uploadSqlFiles")
	@ResponseBody
	public ModelMap uploadSqlFiles(HttpServletRequest req, Integer taskId) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			boolean fileUpload = (req instanceof MultipartHttpServletRequest);
			if (!fileUpload) {
				flag = false;
				message = "Missing upload files";
			} else {
				String account = sessionUser.getAccount();
				String sqlDirPath = getSqlDir(account);
				List<Attachment> attachments = transferUploadFile(req, sqlDirPath);

				// 保存附件、任务、用户之间的关系
				flag = userTaskService.saveAttachments(attachments, taskId, account);
				if (!flag) {
					message = "Save accessories failed";
				}
			}
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Upload task attachments error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: transferUploadFile
	 * @Description: 转换上传的文件
	 * @param req 请求对象
	 * @param dirPath 保存文件夹
	 * @return List&lt;Attachment&gt; 附件列表
	 * @throws IOException
	 */
	private List<Attachment> transferUploadFile(HttpServletRequest req, String dirPath) throws IOException {
		MultipartHttpServletRequest mReq = (MultipartHttpServletRequest) req;
		String basePath = WebUtil.getBaseFilePath();
		WebUtil.getFileDir(dirPath);

		// 上传文件转换为附件列表
		List<Attachment> accessories = Lists.newArrayList();
		Map<String, MultipartFile> fileMap = mReq.getFileMap();
		for (Entry<String, MultipartFile> me : fileMap.entrySet()) {
			MultipartFile mFile = me.getValue();

			String origFileName = mFile.getOriginalFilename();
			String newFileName = UUID.randomUUID().toString();
			String suffix = origFileName.substring(origFileName.lastIndexOf('.'));
			String relationFilePath = dirPath + newFileName + suffix;
			accessories.add(new Attachment(origFileName, relationFilePath));

			Attachment attachment = new Attachment();
			attachment.setName(origFileName);
			if (suffix.toUpperCase().endsWith("SQL")) {
				attachment.setSqlPath(relationFilePath);
			} else {
				attachment.setOtherPath(relationFilePath);
			}
			mFile.transferTo(new File(basePath, relationFilePath));
		}
		return accessories;
	}

	/**
	 * @Title: uploadAnyFiles
	 * @Description: 任务任意文件上传(支持多文件上传)
	 * @param req 请求对象
	 * @param taskId 任务ID
	 * @return ModelMap flag:true-上传成功,false-至少一个上传失败; message-上传失败消息
	 */
	@RequestMapping("/uploadAnyFiles")
	@ResponseBody
	public ModelMap uploadAnyFiles(HttpServletRequest req, Integer taskId) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			boolean fileUpload = (req instanceof MultipartHttpServletRequest);
			if (!fileUpload) {
				flag = false;
				message = "Missing upload files";
			} else {
				String account = sessionUser.getAccount();
				String dirPath = getOtherDir(account);
				List<Attachment> attachments = transferUploadFile(req, dirPath);

				// 保存附件、任务、用户之间的关系
				flag = userTaskService.saveAttachments(attachments, taskId, account);
				if (!flag) {
					message = "Save accessories failed";
				}
			}
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: taskListByUser
	 * @Description: 获取指定用户关联的任务列表
	 * @param userId 用户ID
	 * @return ModelMap flag:true-获取成功, false-获取失败; message:失败消息; data:任务列表
	 */
	@RequestMapping("/taskListByUser")
	@ResponseBody
	public ModelMap taskListByUser(String userId) {
		boolean flag = false;
		String message = null;
		List<UserTask> data = null;

		try {
			data = userTaskService.getTasksByUser(userId);
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
	 * @Title: assignToUser
	 * @Description: 将任务分配到指定用户
	 * @param taskId 任务ID
	 * @param performerKey 目标用户Key
	 * @return ModelMap flag:true-分配成功,false-分配失败; message:失败消息
	 */
	@RequestMapping("/assignToUser")
	@ResponseBody
	public ModelMap assignToUser(Integer taskId, String performerKey) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			flag = userTaskService.assign(taskId, performerKey, sessionUser.getAccount());
			if (!flag) {
				message = "The task assigned to the performers have failed";
			}
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Assign task error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: unassignTasks
	 * @Description: 解除任务委派
	 * @param userTaskIds 用户任务关联ID列表
	 * @param performerKey
	 * @return ModelMap
	 */
	@RequestMapping("/unassignTasks")
	@ResponseBody
	public ModelMap unassignTasks(@RequestParam("userTaskIds[]") Integer[] userTaskIds, String performerKey) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			flag = userTaskService.unassignTasks(userTaskIds, performerKey, sessionUser.getAccount());
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Unassign tasks error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: getAttachments
	 * @Description: 获取附件列表
	 * @param taskId 任务ID
	 * @param pageCondition 分页详情
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:附件列表
	 */
	@RequestMapping("/getAttachments")
	@ResponseBody
	public ModelMap getAttachments(PageCondition pageCondition, Integer taskId) {
		boolean flag = false;
		String message = null;
		Page<Attachment> data = null;

		try {
			data = userTaskService.getAttachmentsByTaskId(pageCondition, taskId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Get attachments error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: removeAttachments
	 * @Description: 移除附件
	 * @param attachmentIds 附件ID列表
	 * @return ModelMap flag:true-移除成功,false-移除失败; message:失败消息
	 */
	@RequestMapping("/removeAttachments")
	@ResponseBody
	public ModelMap removeAttachments(@RequestParam("attachmentIds[]") Integer[] attachmentIds) {
		boolean flag = false;
		String message = null;

		try {
			flag = userTaskService.removeAttachments(attachmentIds);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Remove attachments error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: getAttachmentNote
	 * @Description: 获取附件备注
	 * @param attachmentId 附件ID
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:附件备注
	 */
	@RequestMapping("/getAttachmentNote")
	@ResponseBody
	public ModelMap getAttachmentNote(Integer attachmentId) {
		boolean flag = false;
		String message = null;
		String data = null;

		try {
			data = userTaskService.getAttachmentNoteByAttachmentId(attachmentId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Get attachment note error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: updateAttachmentNote
	 * @Description: 更新附件文件说明
	 * @param attachmentId 附件ID
	 * @param note 附件说明
	 * @return ModelMap flag:true-更新成功,false-更新失败; message:失败消息;
	 */
	@RequestMapping("/updateAttachmentNote")
	@ResponseBody
	public ModelMap updateAttachmentNote(Integer attachmentId, String note) {
		boolean flag = false;
		String message = null;

		try {
			userTaskService.updateAttachmentNote(attachmentId, note);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: downloadAttachments
	 * @Description: 下载附件
	 * @param attachmentsIds 附件ID列表
	 */
	@RequestMapping("/downloadAttachments")
	public void downloadAttachments(@RequestParam("attachmentsIds") Integer[] attachmentsIds, HttpServletResponse resp) {
		String message = null;
		List<Attachment> downloadableFile = null;

		// 获取附件对象列表
		try {
			downloadableFile = userTaskService.downloadAttachments(attachmentsIds);
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			message = "Download attachments error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		// 下载附件
		if (!CollectionUtils.isEmpty(downloadableFile)) {
			try {
				packagingDownloadAttachments(downloadableFile, resp);
			} catch (Exception e) {
				message = "Download attachments error";
				LOGGER.warn(message + " : " + e.getMessage(), e);
			}
			return;
		} else {
			message = "Cann't find attachment list";
		}

		// 获取附件失败
		LOGGER.warn(message);
		try {
			resp.getWriter().write(message);
		} catch (IOException e) {
			// Ignore
		}
	}

	/**
	 * @Title: getSearchConditionForManager
	 * @Description: 获取任务管理界面的查询条件
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:查询条件
	 */
	@RequestMapping("/getTaskStatus")
	@ResponseBody
	public ModelMap getTaskStatus() {
		boolean flag = false;
		String message = null;
		List<TaskStatus> data = null;

		try {
			data = taskService.getAllTaskStatus();
			flag = true;
		} catch (Exception e) {
			flag = false;
			message = "Get search condition for manager error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: submitToVerifying
	 * @Description: 提交任务
	 * @param taskId 任务ID
	 * @return ModelMap flag:true-提交成功, false-提交失败; message:失败消息
	 */
	@RequestMapping("/submit")
	@ResponseBody
	public ModelMap submit(Integer taskId) {
		boolean flag = false;
		String message = null;

		try {
			User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
			flag = taskService.submitToVerifying(taskId, sessionUser.getAccount());
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Submit task error, Please try again later.";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, message);
	}

	/**
	 * @Title: getSearchConditions
	 * @Description: 获取查询条件
	 * @param moduleId 模块ID
	 * @return ModelMap flag:true-获取成功,false-获取失败; message:失败消息; data:查询条件
	 */
	@RequestMapping("/getSearchConditions")
	@ResponseBody
	public ModelMap getSearchConditions(Integer moduleId) {
		boolean flag = false;
		String message = null;
		InitTaskSearchConditionVO data = null;

		try {
			data = taskService.getInitTaskSearchCondition(moduleId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Get search conditions error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: getSqlFiles
	 * @Description: 获取指定任务关联的 SQL 文件
	 * @param taskId 任务ID
	 * @return ModelMap flag:true-获取成功, false-获取失败; message:失败消息; data:SQL文件列表
	 */
	@RequestMapping("/getSqlAttachmentFiles")
	@ResponseBody
	public ModelMap getSqlAttachmentFiles(Integer taskId) {
		boolean flag = false;
		String message = null;
		List<Attachment> data = null;

		try {
			data = userTaskService.getSQLFilesByTaskId(taskId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Get SQL files error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: previewAttachment
	 * @Description: 预览附件
	 * @param attachmentType 附件类型
	 * @param attachmentId 附件ID
	 * @return ModelMap flag:true-获取预览数据成功,false-获取预览数据失败; message:失败消息;
	 *         data:预览数据
	 */
	@RequestMapping("/previewAttachment")
	@ResponseBody
	public ModelMap previewAttachment(AttachmentType attachmentType, Integer attachmentId) {
		boolean flag = false;
		String message = null;
		String data = null;

		try {
			data = userTaskService.getAttachmentContent(attachmentType, attachmentId);
			flag = true;
		} catch (VerifyParameterException e) {
			message = e.getMessage();
		} catch (Exception e) {
			flag = false;
			message = "Get the attachment preview content error";
			LOGGER.warn(message + " : " + e.getMessage(), e);
		}

		return WebUtil.getModelMap(flag, data, message);
	}

	/**
	 * @Title: downloadAttachments
	 * @Description: 打包下载附件
	 * @param attachments 附件对象列表
	 * @param resp 响应对象
	 * @throws Exception
	 */
	private void packagingDownloadAttachments(List<Attachment> attachments, HttpServletResponse resp) throws Exception {
		String downloadFileName = StringUtil.EMPTY_STRING;
		File downloadFile = null;
		boolean singleFile = (1 == attachments.size());

		if (singleFile) {
			// 单文件
			Attachment attachment = attachments.get(0);
			downloadFileName = attachment.getName();

			String effectivePath = attachment.getEffectivePath();
			downloadFile = WebUtil.getFile(effectivePath);
		} else {
			// 多文件
			downloadFileName = TMConstants.DOWNLOAD_NAME_OF_ATTACHMENTS + ".zip";
			downloadFile = getZipAttachments(attachments, downloadFileName);
		}

		// 下载文件
		WebUtil.download(downloadFile, downloadFileName, resp);

		// 删除.zip文件
		if (downloadFileName.endsWith(".zip")) {
			downloadFile.delete();
		}
	}

	/**
	 * @Title: getZipAttachments
	 * @Description: 压缩附件列表
	 * @param attachments 附件对象列表
	 * @param zipFileName 压缩文件名
	 * @return File 压缩文件
	 * @throws Exception
	 */
	private File getZipAttachments(List<Attachment> attachments, String zipFileName) throws Exception {
		// 获取文件列表
		Map<String, File> files = Maps.newHashMap();
		for (Attachment attachment : attachments) {
			String originalName = attachment.getName();
			String effectivePath = attachment.getEffectivePath();
			File file = WebUtil.getFile(effectivePath);
			files.put(originalName, file);
		}

		// 还原文件名
		String downloadDir = getDownloadDirOfUser();
		for (Entry<String, File> me : files.entrySet()) {
			String fileName = me.getKey();
			File file = new File(downloadDir, fileName);
			FileUtils.copyFile(me.getValue(), file);
			me.setValue(file);
		}

		// 压缩文件 .zip
		List<File> zipabledFiles = Lists.newArrayList(files.values());
		File zipFile = new File(downloadDir, zipFileName);
		FileUtil.zip(zipabledFiles, zipFile);

		// 删除文件列表
		for (File file : zipabledFiles) {
			FileUtils.deleteQuietly(file);
		}

		return zipFile;
	}

	/**
	 * @Title: getDownloadDirOfUser
	 * @Description: 获取下载临时文件夹
	 * @return String 下载临时文件夹(绝对路径)
	 */
	private String getDownloadDirOfUser() {
		User sessionUser = WebUtil.getSessionAttr(TMConstants.SESSION_EFFECTIVE_USER);
		String userDownloadDir = TMConstants.DOWNLOAD_DIR + sessionUser.getAccount() + "/";
		// 如果需要定时清理, 可以用日期作为分界线
		// DOWNLOAD_DIR + DateUtil.formatNow(DateUtil.PATTERN_YMD) +
		// /[account]/;
		return WebUtil.getBaseFilePath() + userDownloadDir;
	}

	/**
	 * @Title: getOtherDir
	 * @Description: 获取任意附件文件夹
	 * @param account 用户账户
	 * @return String 任意附件文件夹
	 */
	private String getOtherDir(String account) {
		return TMConstants.DIRECTORY_UPLOAD + account + "/" + TMConstants.DIRECTORY_ANY;
	}

	/**
	 * @Title: getSqlDir
	 * @Description: 获取SQL文件目录
	 * @param account 用户账户
	 * @return String SQL文件目录
	 */
	private String getSqlDir(String account) {
		return TMConstants.DIRECTORY_UPLOAD + account + "/" + TMConstants.DIRECTORY_SQL;
	}
}
