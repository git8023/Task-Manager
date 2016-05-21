package org.yong.tm.model.entities;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.yong.tm.model.enums.TaskStatus;

public class UserTask implements Serializable {

	private static final long serialVersionUID = 1026553219819711865L;

	private Integer id;

	private Task task;

	private User performer;

	private Date createdDate;

	private Date finishDate;

	private User manager;

	private Integer order;

	private TaskStatus status;

	// 任务附件
	private List<Attachment> accessories;

	public UserTask() {
		super();
	}

	/**
	 * @Title: UserTask
	 * @Description: 用户任务关联实例
	 * @param taskId 任务ID
	 * @param performerPK 执行者Key
	 * @param managerPK 任务分配者Key
	 */
	public UserTask(Integer taskId, String performerPK, String managerPK) {
		this.task = new Task(taskId);
		this.performer = new User(performerPK);
		this.manager = new User(managerPK);
		this.createdDate = new Date();
		this.status = TaskStatus.DOING;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

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

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getFinishDate() {
		return finishDate;
	}

	public void setFinishDate(Date finishDate) {
		this.finishDate = finishDate;
	}

	public User getManager() {
		return manager;
	}

	public void setManager(User manager) {
		this.manager = manager;
	}

	public Integer getOrder() {
		return order;
	}

	public void setOrder(Integer order) {
		this.order = order;
	}

	public TaskStatus getStatus() {
		return status;
	}

	public void setStatus(TaskStatus status) {
		this.status = status;
	}

	public List<Attachment> getAccessories() {
		return accessories;
	}

	public void setAccessories(List<Attachment> accessories) {
		this.accessories = accessories;
	}

	@Override
	public String toString() {
		return "UserTask [id=" + id + ", task=" + task + ", performer=" + performer + ", createdDate=" + createdDate
				+ ", finishDate=" + finishDate + ", manager=" + manager + ", order=" + order + ", status=" + status
				+ ", accessories=" + accessories + "]";
	}

}
