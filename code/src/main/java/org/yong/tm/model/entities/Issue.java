package org.yong.tm.model.entities;

import java.io.Serializable;
import java.util.Date;

/**
 * @Author Huang.Yong
 * @Description: 任务Issue
 * @Date 2016年5月1日 下午2:06:05
 * @Version 0.1
 */
public class Issue implements Serializable {

	private static final long serialVersionUID = 2092686896064634677L;

	private Integer id;

	private String name;

	private Task task;

	private Date createdDate;

	private String description;

	private String solution;

	private User createdBy;

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

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getSolution() {
		return solution;
	}

	public void setSolution(String solution) {
		this.solution = solution;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "Issue [id=" + id + ", name=" + name + ", task=" + task + ", createdDate=" + createdDate + ", description="
				+ description + ", solution=" + solution + ", createdBy=" + createdBy + "]";
	}

}
