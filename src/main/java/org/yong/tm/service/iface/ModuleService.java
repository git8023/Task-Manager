package org.yong.tm.service.iface;

import java.util.List;

import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Module;
import org.yong.tm.model.entities.User;

/**
 * @Author Huang.Yong
 * @Description: 模块服务接口
 * @Date 2016年4月2日 上午9:52:29
 * @Version 0.1
 */
public interface ModuleService {

	/**
	 * @Title: getListByProjectId
	 * @Description: 获取列表
	 * @param projectId 项目ID
	 * @return List&lt;Module&gt; 项目ID
	 * @throws VerifyParameterException
	 */
	List<Module> getListByProjectId(Integer projectId) throws VerifyParameterException;

	/**
	 * @Title: addModule
	 * @Description: 添加项目模块
	 * @param module 模块详情
	 * @param createdBy 创建者
	 * @return boolean true-添加成功, false-添加失败
	 * @throws VerifyParameterException
	 */
	boolean addModule(Module module, User createdBy) throws VerifyParameterException;

	/**
	 * @Title: changeStatus
	 * @Description: 修改模块状态
	 * @param module 模块详情
	 * @return boolean true-成功, false-失败
	 * @throws VerifyParameterException
	 */
	boolean changeStatus(Module module) throws VerifyParameterException;

	/**
	 * @Title: getById
	 * @Description: 获取模块详情
	 * @param moduleId 模块ID
	 * @return Module 模块详情
	 * @throws VerifyParameterException
	 */
	Module getById(Integer moduleId) throws VerifyParameterException;

	/**
	 * @Title: modifyDetail
	 * @Description: 修改模块详情
	 * @param module 模块详情
	 * @return boolean true-修改成功, false-修改失败
	 * @throws VerifyParameterException
	 */
	boolean modifyDetail(Module module) throws VerifyParameterException;

}
