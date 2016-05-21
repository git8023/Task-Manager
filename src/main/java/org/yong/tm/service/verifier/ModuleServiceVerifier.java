package org.yong.tm.service.verifier;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Module;
import org.yong.tm.model.entities.Project;
import org.yong.tm.model.entities.User;
import org.yong.tm.service.iface.ModuleService;
import org.yong.tm.util.TMConstants;
import org.yong.util.string.StringUtil;

@Service
public class ModuleServiceVerifier implements ModuleService {

	@Resource
	private ModuleService moduleServiceImpl;

	@Override
	public List<Module> getListByProjectId(Integer projectId) throws VerifyParameterException {
		String errMsg = null;
		if (null == projectId || 0 >= projectId) {
			errMsg = "Access denied, Missing requirement parameters [Project Primary-Key]";
		}

		throwException(errMsg);
		return moduleServiceImpl.getListByProjectId(projectId);
	}

	@Override
	public boolean addModule(Module module, User createdBy) throws VerifyParameterException {
		String errMsg = null;
		if (null == createdBy || StringUtil.isEmpty(createdBy.getAccount(), true)) {
			errMsg = TMConstants.ACCESS_DENIED_OF_INVALID_USER;
		} else if (null == module) {
			errMsg = "Access denied, Invalid parameters [Module-Details]";
		} else if (StringUtil.isEmpty(module.getName(), true)) {
			errMsg = "Access denied, Invalid parameters [Module-Name]";
		} else {
			Project project = module.getProject();
			if (null == project || null == project.getId() || 0 >= project.getId()) {
				errMsg = "Access denied, Missing requirement parameters [Porject Primary-Key]";
			}
		}

		throwException(errMsg);
		return moduleServiceImpl.addModule(module, createdBy);
	}

	@Override
	public boolean changeStatus(Module module) throws VerifyParameterException {
		String errMsg = null;
		if (null == module) {
			errMsg = "Access denied, Invalid parameters [Module-Details]";
		} else if (null == module.getId() || 0 >= module.getId()) {
			errMsg = "Access denied, Missing requirement parameters [Module Primary-Key]";
		}

		throwException(errMsg);
		return moduleServiceImpl.changeStatus(module);
	}

	@Override
	public Module getById(Integer moduleId) throws VerifyParameterException {
		String errMsg = null;
		if (null == moduleId || 0 >= moduleId) {
			errMsg = "Missing requirement parameters [Module Primary-Key]";
		}

		throwException(errMsg);
		return moduleServiceImpl.getById(moduleId);
	}

	@Override
	public boolean modifyDetail(Module module) throws VerifyParameterException {
		String errMsg = null;
		if (null == module) {
			errMsg = "Access denied, Missing requirement parameters";
		}

		throwException(errMsg);
		return moduleServiceImpl.modifyDetail(module);
	}

	/**
	 * @Title: throwException
	 * @Description: 抛出验证异常
	 * @param errMsg 异常消息
	 * @throws VerifyParameterException
	 */
	private void throwException(String errMsg) throws VerifyParameterException {
		if (null != errMsg) {
			throw new VerifyParameterException(errMsg);
		}
	}
}
