<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
    <base href="<%=basePath %>" />
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>title</title>
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/common/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/common/jquery-confirm.min.css" />
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/index.css" />
    
    <script type="text/javascript" src="<%=basePath %>static/js/common/jquery-1.10.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/jquery-confirm.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/prototype.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/Validation.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/StringUtil.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/Form.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/RequestUtil.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>static/js/index.js"></script>
</head>
<body>
    <div id="login_form">
        <div class="form_border">
            <div class="title btn-info disabled">User Login</div>
            <form class="form-horizontal" action="/user/login.cmd" onsubmit="return false;">
              <div class="form-group">
                <label for="account" class="col-sm-2 control-label">Account</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="account" name="account" placeholder="Account"
                        regex="/^\w{5,20}$/ig"
                        regexError="Account only accept letters/Numbers/underline and length between 5 to 20"/>
                </div>
              </div>
              <div class="form-group">
                <label for="password" class="col-sm-2 control-label">Password</label>
                <div class="col-sm-10">
                  <input type="password" class="form-control" id="password" name="pwd" placeholder="Password"
                        regex="/^\w{6,30}$/ig"
                        regexError="Password length between 6 to 30"/>
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                  <div class="checkbox" style="display:inline-block;">
                    <label>
                      <input type="checkbox" name="remember" value="1"> Remember me
                    </label>
                  </div>
                  <button id="submit" class="btn btn-success" style="float:right;">Sign in</button>
                </div>
              </div>
            </form>
        </div>
    </div>
</body>
</html>