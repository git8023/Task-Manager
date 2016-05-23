package org.yong.tm.model.enums;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.yong.tm.model.entities.Attachment;
import org.yong.util.string.StringUtil;

/**
 * @Author Huang.Yong
 * @Description: 附件类型枚举
 * @Date 2016年5月23日 上午10:59:32
 * @Version 0.1
 */
public enum AttachmentType {
	/** SQL附件 */
	SQL,
	/** 图片附件 */
	IMAGE,
	/** Word 附件:.doc, .docx */
	WORD,
	/** PFD 附件 */
	PDF,
	/** 其他附件 */
	OTHER,
	/** 错误的附件类型 */
	ERROR;

	private static final Logger LOGGER = LoggerFactory.getLogger(AttachmentType.class);

	/**
	 * @Title: contentToString
	 * @Description: 检测附件内容是否可以转换为字符串, 当前仅支持{@link #SQL}
	 * @param type 附件类型
	 * @return boolean true-可以转换为字符串, false-不能转换为字符串
	 */
	public static boolean contentToString(AttachmentType type) {
		if (null == type) {
			return false;
		}
		return (SQL == type);
	}

	/**
	 * @Title: getFile
	 * @Description: 获取附件文件
	 * @param attachment 附件对象
	 * @return File 附件文件
	 */
	public File getFile(Attachment attachment) {
		String path = null;
		if (null != attachment) {
			AttachmentType type = getAttachmentType(attachment);
			switch (type) {
			case SQL:
				path = attachment.getSqlPath();
				break;

			case IMAGE:
				path = attachment.getImagePath();
				break;
			case WORD:
				LOGGER.warn("Now the current type is not support[" + type + "]");
				break;
			case PDF:
				LOGGER.warn("Now the current type is not support[" + type + "]");
				break;
			case OTHER:
				path = attachment.getOtherPath();
				break;
			case ERROR:
				LOGGER.warn("Cannot converted to the correct Attachment-Type");
				break;
			default:
				LOGGER.warn("Ignored attachment type[" + type + "]");
				break;
			}
		}

		return (StringUtil.isNotEmpty(path, true) ? new File(StringUtil.getWebProjectPath(), path) : null);
	}

	/**
	 * @Title: getAttachmentType
	 * @Description: 获取附件类型
	 * @param attachment 附件对象
	 * @return AttachmentType 附件类型
	 */
	public static AttachmentType getAttachmentType(Attachment attachment) {
		AttachmentType type = ERROR;
		if (null != attachment) {
			if (StringUtil.isNotEmpty(attachment.getSqlPath(), true)) {
				type = SQL;
			} else if (StringUtil.isNotEmpty(attachment.getImagePath(), true)) {
				type = IMAGE;
			} else if (StringUtil.isNotEmpty(attachment.getOtherPath(), true)) {
				type = OTHER;
			}
		}
		return type;
	}
}
