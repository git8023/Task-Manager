package org.yong.tm.model.entities;

import java.io.Serializable;
import java.util.Date;

public class TaskLog implements Serializable {

	private static final long serialVersionUID = -393425018290682226L;

	private Task task;

	private User performer;

	private User manager;

	private Date createdDate;

	private TaskAction action;

	private String note;

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public User getPerformer() {
		return performer;
	}

	public void setPerformer(User performer) {
		this.performer = performer;
	}

	public User getManager() {
		return manager;
	}

	public void setManager(User manager) {
		this.manager = manager;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public TaskAction getAction() {
		return action;
	}

	public void setAction(TaskAction action) {
		this.action = action;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	@Override
	public String toString() {
		return "TaskLog [task=" + task + ", performer=" + performer + ", manager=" + manager + ", createdDate=" + createdDate
				+ ", action=" + action + ", note=" + note + "]";
	}
}
