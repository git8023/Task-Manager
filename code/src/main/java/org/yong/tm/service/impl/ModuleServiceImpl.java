package org.yong.tm.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yong.tm.dao.ModuleDao;
import org.yong.tm.exception.VerifyParameterException;
import org.yong.tm.model.entities.Module;
import org.yong.tm.model.entities.User;
import org.yong.tm.service.iface.ModuleService;

@Service
public class ModuleServiceImpl implements ModuleService {

	@Autowired
	private ModuleDao moduleDao;

	@Override
	public List<Module> getListByProjectId(Integer projectId) {
		return moduleDao.selectByProjectId(projectId);
	}

	@Override
	public boolean addModule(Module module, User createdBy) {
		module.setCreatedBy(createdBy);
		module.setCreatedDate(new Date());
		moduleDao.insert(module);
		return true;
	}

	@Override
	public boolean changeStatus(Module module) throws VerifyParameterException {
		moduleDao.updateById(module.getId(), module);
		return true;
	}

	@Override
	public Module getById(Integer moduleId) {
		return moduleDao.selectById(moduleId);
	}

	@Override
	public boolean modifyDetail(Module module) {
		moduleDao.updateById(module.getId(), module);
		return true;
	}
}
