package org.yong.tm.model.vo;

import java.util.Date;

import org.yong.tm.model.entities.Task;

/**
 * @Author Huang.Yong
 * @Description: 任务查询参数
 * @Date 2016年4月3日 下午7:53:46
 * @Version 0.1
 */
public class TaskSearchCondition {

	private Task task;

	private Date createdFromDate;

	private Date createdEndDate;

	private Date finishFromDate;

	private Date finishEndDate;

	public TaskSearchCondition() {
		super();
	}

	public TaskSearchCondition(Integer taskId) {
		this.task = new Task();
		this.task.setId(taskId);
	}

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public Date getCreatedFromDate() {
		return createdFromDate;
	}

	public void setCreatedFromDate(Date createdFromDate) {
		this.createdFromDate = createdFromDate;
	}

	public Date getCreatedEndDate() {
		return createdEndDate;
	}

	public void setCreatedEndDate(Date createdEndDate) {
		this.createdEndDate = createdEndDate;
	}

	public Date getFinishFromDate() {
		return finishFromDate;
	}

	public void setFinishFromDate(Date finishFromDate) {
		this.finishFromDate = finishFromDate;
	}

	public Date getFinishEndDate() {
		return finishEndDate;
	}

	public void setFinishEndDate(Date finishEndDate) {
		this.finishEndDate = finishEndDate;
	}

	@Override
	public String toString() {
		return "TaskSearchParameter [task=" + task + ", createdFromDate=" + createdFromDate + ", createdEndDate="
				+ createdEndDate + ", finishFromDate=" + finishFromDate + ", finishEndDate=" + finishEndDate + "]";
	}

}
