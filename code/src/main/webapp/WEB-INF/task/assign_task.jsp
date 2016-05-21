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
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/assignTask.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/assignTask.js"></script>
</head>
<body>

    <!-- 任务分配 -->
    <div class="assign_task_ctnr">
        <input type="hidden" value="${param.taskId }" id="taskId" name="taskId" />
        <div class="list_ctnr">
            <!-- 工具栏 -->
            <div class="tools menus">
                <a href="javascript:;" class="menu assign_task disabled" id="assign"><img src="<%=basePath %>static/image/task/assign_task.png"/>Assign To User</a>
                <span class="separator">|</span>
                <a href="javascript:;" class="menu clear_tasts disabled" id="clearTasksForUser"><img src="<%=basePath %>static/image/task/task_clear.ico"/>Clear Tasks</a>
                <span class="separator">|</span>
                <a href="javascript:;" class="fn delete_tasks disabled" id="clearTasksForUser"><img src="<%=basePath %>static/image/task/delete_tasks.png"/>Delete Tasks</a>
            </div>
            
            <!-- 用户列表 -->
            <div class="users_ctnr">
                <div class="title">User List</div>
                <div class="list">
                    <ul>
                        <li class="no_record_found">No Record Found</li>
                    </ul>
                </div>
            </div>
            
            <!-- 任务列表 -->
            <div class="tasks_ctnr">
                <div class="title">Task List</div>
                <div class="list">
                    <ul>
                        <li class="no_record_found">No Record Found</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

</body>
</html>