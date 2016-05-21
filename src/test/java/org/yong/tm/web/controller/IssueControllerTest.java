package org.yong.tm.web.controller;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.yong.test.BaseControllerTest;

public class IssueControllerTest extends BaseControllerTest {

	@Autowired
	private IssueController issueController;

	@Test
	public void testExportWord() throws Exception {
		this.addParam("issueId", 16);
		ModelAndView modelAndView = this.invockMethod("/issue/exportWord.cmd");
		System.err.println(modelAndView);

		String responseText = getResponseText();
		System.err.println(responseText);
	}

	@Override
	protected Object getController() {
		return issueController;
	}
}
