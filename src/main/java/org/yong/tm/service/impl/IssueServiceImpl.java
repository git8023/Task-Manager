package org.yong.tm.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yong.tm.dao.IssueDao;
import org.yong.tm.model.entities.Issue;
import org.yong.tm.service.iface.IssueService;

@Service
public class IssueServiceImpl implements IssueService {

	@Autowired
	private IssueDao issueDao;

	@Override
	public boolean add(Issue issue) {
		issue.setCreatedDate(new Date());
		return (1 == issueDao.insert(issue));
	}

	@Override
	public List<Issue> getIssuesByTaskId(Integer taskId) {
		return issueDao.selectByTaskId(taskId);
	}

	@Override
	public Issue getDetailById(Integer id) {
		return issueDao.selectById(id);
	}

	@Override
	public boolean removeAllByTask(Integer taskId) {
		issueDao.deleteAllByTaskId(taskId);
		return true;
	}

	@Override
	public boolean removeOneById(Integer issueId) {
		return (1 == issueDao.deleteById(issueId));
	}

	@Override
	public Issue getDetailsById(Integer issueId) {
		return issueDao.selectMoreInfosById(issueId);
	}
}
