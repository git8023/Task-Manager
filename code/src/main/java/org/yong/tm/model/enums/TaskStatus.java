package org.yong.tm.model.enums;

/**
 * @Author Huang.Yong
 * @Description: 任务状态
 * @Date 2016年3月27日 上午11:55:23
 * @Version 0.1
 */
public enum TaskStatus {
	/** 空闲的 */
	FREE,
	/** 执行中 */
	DOING,
	/** 待审核 */
	VERIFYING,
	/** 已完成 */
	COMPLETED,
	/** 禁用的 */
	DISABLED;
}