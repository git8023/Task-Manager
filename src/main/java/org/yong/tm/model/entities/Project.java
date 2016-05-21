package org.yong.tm.model.entities;

import java.io.Serializable;
import java.util.Date;

import org.yong.tm.model.enums.ProjectStatus;

public class Project implements Serializable {

	private static final long serialVersionUID = -1065935224132707177L;

	private Integer id;

	private String name;

	private Date createdDate;

	private User createdBy;

	private String note;

	private ProjectStatus status;

	private String icoPath;

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

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public ProjectStatus getStatus() {
		return status;
	}

	public void setStatus(ProjectStatus status) {
		this.status = status;
	}

	public String getIcoPath() {
		return icoPath;
	}

	public void setIcoPath(String icoPath) {
		this.icoPath = icoPath;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "Project [id=" + id + ", name=" + name + ", createdDate=" + createdDate + ", createdBy=" + createdBy + ", note="
				+ note + ", status=" + status + ", icoPath=" + icoPath + "]";
	}

}
