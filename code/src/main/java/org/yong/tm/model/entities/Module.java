package org.yong.tm.model.entities;

import java.io.Serializable;
import java.util.Date;

import org.yong.tm.model.enums.ModuleStatus;

public class Module implements Serializable {

	private static final long serialVersionUID = 2301955349248024506L;

	private Integer id;

	private String name;

	private Project project;

	private Date createdDate;

	private User createdBy;

	private String note;

	private ModuleStatus status;

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

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
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

	public ModuleStatus getStatus() {
		return status;
	}

	public void setStatus(ModuleStatus status) {
		this.status = status;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "Module [id=" + id + ", name=" + name + ", project=" + project + ", createdDate=" + createdDate + ", createdBy="
				+ createdBy + ", note=" + note + ", status=" + status + "]";
	}

}
