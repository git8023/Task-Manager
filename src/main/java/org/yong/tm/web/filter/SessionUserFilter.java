package org.yong.tm.web.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Repository;
import org.springframework.web.filter.OncePerRequestFilter;
import org.yong.tm.model.entities.User;
import org.yong.tm.util.TMConstants;

/**
 * @Author Huang.Yong
 * @Description: 登陆用户拦截器
 * @Date 2016年4月2日 上午11:57:43
 * @Version 0.1
 */
@Repository
public class SessionUserFilter extends OncePerRequestFilter {

	private List<String> excludUrl = Arrays.asList("/user/login.cmd");

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String requestURI = request.getRequestURI();
		String projectName = request.getContextPath();
		String path = requestURI.substring(projectName.length());

		User sessionUser = (User) request.getSession(true).getAttribute(TMConstants.SESSION_EFFECTIVE_USER);
		if (excludUrl.contains(path) || null != sessionUser) {
			filterChain.doFilter(request, response);
		} else {
			response.sendRedirect(projectName + "/index.jsp");
		}
	}

}
