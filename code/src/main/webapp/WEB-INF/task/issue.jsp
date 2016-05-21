<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" 
                    + request.getServerName() + ":" 
                    + request.getServerPort()
                    + path + "/";
%>
<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> -->
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>title</title>
    <link type="text/css" rel="stylesheet" href="<%=basePath %>static/js/common/summernote/summernote.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/common/summernote/summernote.min.js"></script>

    <link type="text/css" rel="stylesheet" href="<%=basePath %>static/css/issue.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/issue.js"></script>
</head>
<body>
    
    <div class="issue_ctnr">
        <input type="hidden" value="${param.taskId }" id="taskId" name="taskId" />
        
        <div class="menus">
            <a href="javascript:;" class="menu add"><img src="<%=basePath %>static/image/task/issue/issue_add.gif"/>Add</a>
            <span class="separator">|</span>
            <a href="javascript:;" class="menu clear disabled"><img src="<%=basePath %>static/image/task/issue/issue_clear.png"/>Clear</a>
            <span class="separator">|</span>
            <a href="javascript:;" class="menu delete disabled"><img src="<%=basePath %>static/image/task/issue/issue_delete.gif"/>Delete</a>
            <span class="separator">|</span>
            <a href="javascript:;" class="menu export_word disabled"><img src="<%=basePath %>static/image/task/issue/export_word.ico"/>Export Word</a>
        </div>
        
        <div class="issue_list">
            <div class="list">
                <div class="title">Issue List</div>
                <ul class="issues">
                    <li class="issue" id="1">Issue 01</li>
                    <li class="issue current" id="2">Issue 02</li>
                    <li class="issue" id="3">Issue 03</li>
                    <li class="issue" id="4">Issue 04</li>
                    <li class="issue" id="5">Issue 05</li>
                </ul>
            </div>
            
            <div class="detail">
                <div class="full_ctnr_background"></div>
                <div class="full_ctnr_dialog">
                    <div class="title">Details <div class="min_max max_full"></div></div>
                    <div class="form_ctnr">
                        <form action="/issue/add.cmd" onsubmit="return false;" class="form-horizontal">
                            <div class="form-group">
                                <label for="name" class="col-sm-4 control-label">Name</label>
                                <div class="col-sm-8">
                                  <input type="text" name="name" class="form-control" id="name" placeholder="Issue Name">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="createdBy" class="col-sm-4 control-label">Performer</label>
                                <div class="col-sm-8">
                                  <input type="text" name="createdBy.account" class="form-control" id="createdBy" placeholder="Issue Name">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="createdDate" class="col-sm-4 control-label">Created Date</label>
                                <div class="col-sm-8">
                                  <input type="text" name="createdDate" handler="date" format="yyyy-MM-dd hh:mm" class="form-control" id="createdDate" placeholder="Created Date">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-4 control-label">Description</label>
                                <div class="col-sm-12">
                                  <textarea name="description" show-container="#description_show" class="form-control"></textarea>
                                  <div class="show_container" id="description_show"></div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-4 control-label">Solution</label>
                                <div class="col-sm-12">
                                  <textarea name="solution" show-container="#solution_show" class="form-control"></textarea>
                                  <div class="show_container" id="solution_show"></div>
                                </div>
                            </div>
                            <input type="button" class="btn btn-default submit" value="Submit" />
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
        
    </div>
    
</body>
</html>