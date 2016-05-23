package org.yong.tm.model.entities;

import java.io.Serializable;
import java.util.Date;

/**
 * @Author Huang.Yong
 * @Description: 任务附件. <b> [ 附件数据类型设计的有问题, 无法获取当前附件是什么类型, 导致获取附件文件时较为复杂 ] </b>
 * @Date 2016年3月27日 下午12:04:19
 * @Version 0.1
 */
public class Attachment implements Serializable {

	private static final long serialVersionUID = -2333362050099603564L;

	private Integer id;

	private String name;

	private UserTask userTask;

	private String sqlPath;

	private String imagePath;

	private String otherPath;

	private String summary;

	private Date createdDate;

	public Attachment() {
		super();
	}

	/**
	 * @Title: Attachment
	 * @Description: 创建SQL文件附件
	 * @param name 原文件名
	 * @param sqlPath SQL文件路径
	 */
	public Attachment(String name, String sqlPath) {
		this.name = name;
		this.sqlPath = sqlPath;
		this.createdDate = new Date();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UserTask getUserTask() {
		return userTask;
	}

	public void setUserTask(UserTask userTask) {
		this.userTask = userTask;
	}

	public String getSqlPath() {
		return sqlPath;
	}

	public void setSqlPath(String sqlPath) {
		this.sqlPath = sqlPath;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public String getOtherPath() {
		return otherPath;
	}

	public void setOtherPath(String otherPath) {
		this.otherPath = otherPath;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	/**
	 * @Title: getEffectivePath
	 * @Description: 获取真实有效的文件路径
	 * @return String 文件路径
	 */
	public String getEffectivePath() {
		if (null != sqlPath) {
			return sqlPath;
		} else if (null != imagePath) {
			return imagePath;
		} else {
			return otherPath;
		}
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "Attachment [id=" + id + ", name=" + name + ", userTask=" + userTask + ", sqlPath=" + sqlPath + ", imagePath="
				+ imagePath + ", otherPath=" + otherPath + ", summary=" + summary + ", createdDate=" + createdDate + "]";
	}

}
