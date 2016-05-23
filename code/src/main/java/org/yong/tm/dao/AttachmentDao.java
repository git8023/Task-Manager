package org.yong.tm.dao;

import org.springframework.stereotype.Repository;
import org.yong.tm.model.entities.Attachment;

/**
 * @Author Huang.Yong
 * @Description: 附件数据访问接口
 * @Date 2016年5月23日 上午11:45:13
 * @Version 0.1
 */
@Repository
public interface AttachmentDao {

	/**
	 * @Title: selectById
	 * @Description: 查询附件数据, 指定附件ID
	 * @param attachmentId 附件ID
	 * @return Attachment 附件对象
	 */
	Attachment selectById(Integer attachmentId);

}
