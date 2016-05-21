package org.yong.tm.model.vo;

import org.yong.tm.model.entities.Task;

public class TaskVO extends Task {
	// @Fields serialVersionUID :
	private static final long serialVersionUID = 6230743575350788791L;

	private boolean assigned;

	private String performer;

	public boolean isAssigned() {
		return assigned;
	}

	public void setAssigned(boolean assigned) {
		this.assigned = assigned;
	}

	public String getPerformer() {
		return performer;
	}

	public void setPerformer(String performer) {
		this.performer = performer;
	}

	@Override
	public String toString() {
		return "TaskVO [assigned=" + assigned + ", performer=" + performer + "]";
	}

}
