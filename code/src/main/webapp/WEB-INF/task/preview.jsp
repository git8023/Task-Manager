<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" 
                    + request.getServerName() + ":" 
                    + request.getServerPort()
                    + path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>title</title>
    
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/js/common/googlePretifyPrint/prettify.css" />
    <link type="text/css" rel="stylesheet" href="<%=basePath %>static/css/preview.css" />

<%--页面单独测试时开启 --%>
<%--     <script type="text/javascript" src="<%=basePath %>static/js/common/jquery-1.10.2.js"></script> --%>
    <script type="text/javascript" src="<%=basePath %>static/js/common/googlePretifyPrint/prettify.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/preview.js"></script>
</head>
<body>
    <div class="preview_container" tabindex=0>
        <input type="hidden" id="attachmentType" value="${requestScope.attachmentType}" />
        <pre class="prettyprint lang-sql">${requestScope.textContent }</pre>
    </div>
</body>
</html>