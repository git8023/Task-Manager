package org.yong.tm.model.entities;

import java.io.Serializable;
import java.util.Date;

import org.yong.tm.model.enums.TaskOrder;
import org.yong.tm.model.enums.TaskStatus;

public class Task implements Serializable {

	private static final long serialVersionUID = 7474209081733990384L;

	private Integer id;

	private String name;

	private Module module;

	private Date createdDate;

	private Date targetDate;

	private Date finishDate;

	private User createdBy;

	private TaskStatus status;

	private TaskOrder order;

	private String note;

	public Task() {
		super();
	}

	/**
	 * @Title: Task
	 * @Description: 创建任务对象
	 * @param id 任务ID
	 */
	public Task(Integer id) {
		super();
		this.id = id;
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

	public Module getModule() {
		return module;
	}

	public void setModule(Module module) {
		this.module = module;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getTargetDate() {
		return targetDate;
	}

	public void setTargetDate(Date targetDate) {
		this.targetDate = targetDate;
	}

	public Date getFinishDate() {
		return finishDate;
	}

	public void setFinishDate(Date finishDate) {
		this.finishDate = finishDate;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public TaskStatus getStatus() {
		return status;
	}

	public void setStatus(TaskStatus status) {
		this.status = status;
	}

	public TaskOrder getOrder() {
		return order;
	}

	public void setOrder(TaskOrder order) {
		this.order = order;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "Task [id=" + id + ", name=" + name + ", module=" + module + ", createdDate=" + createdDate + ", targetDate="
				+ targetDate + ", finishDate=" + finishDate + ", createdBy=" + createdBy + ", status=" + status + ", order="
				+ order + ", note=" + note + "]";
	}

}
