package org.yong.tm.model.vo;

import java.util.List;

import org.yong.tm.model.enums.TaskStatus;
import org.yong.util.vo.EntryVO;

/**
 * @Author Huang.Yong
 * @Description: 初始化任务查询条件
 * @Date 2016年5月18日 下午7:18:05
 * @Version 0.1
 */
public class InitTaskSearchConditionVO {

	private List<TaskStatus> taskStatus;

	private List<EntryVO<String, String>> usersInModule;

	public List<TaskStatus> getTaskStatus() {
		return taskStatus;
	}

	public void setTaskStatus(List<TaskStatus> taskStatus) {
		this.taskStatus = taskStatus;
	}

	public List<EntryVO<String, String>> getUsersInModule() {
		return usersInModule;
	}

	public void setUsersInModule(List<EntryVO<String, String>> usersInModule) {
		this.usersInModule = usersInModule;
	}

	@Override
	public String toString() {
		return "InitTaskSearchConditionVO [taskStatus=" + taskStatus + ", usersInModule=" + usersInModule + "]";
	}
}
