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
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/task.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/task.js"></script>
</head>
<body>

    <div class="task_view" style="margin-top:-10px;">
        <!-- 添加任务视图 -->
        <div class="task_detail">
            <form action="module/addModule.cmd">
                <input type="hidden" name="module.id" id="moduleId" value="${requestScope.param.moduleId[0] }" regex="/^[\S]+$/"/>
                <input type="hidden" name="id" id="taskId"/>
                <div class="form-group">
                    <div class="width_50">
                        <label for="moduleName">Project Name</label>
                        <input type="text" name="module.project.name" class="form-control" disabled="disabled" placeholder="New Module Name">
                    </div>
                    <div class="width_50">
                        <label for="moduleName">Module Name</label>
                        <input type="text" name="module.name" class="form-control" disabled="disabled" placeholder="New Module Name">
                    </div>
                    <div class="width_50">
                        <label for="taskName">Task Name</label>
                        <input type="text" id="taskName" name="name" class="form-control" placeholder="New Task Name"
                            regex="/^[\S][\s\S]{4,20}$/" regexError="Cannot begin with a space, And the length is between 4 to 20."
                            />
                    </div>
                    <div class="width_50">
                        <label for="status">Status</label>
                        <select name="status" id="status" class="form-control" regex="/^[\S]+$/" regexError="Status cannot be empty.">
                            <option value="FREE" selected="selected">FREE</option>
                        </select>
                    </div>
                    <div class="width_50">
                        <label for="targetDate">Target Date</label>
                        <div class="input-append date form_datetime">
                            <input type="text" id="targetDate" class="form-control" name="targetDate" readonly="readonly" style="cursor:pointer;"
                            regex="/^[\S][\s\S]+$/" regexError="Please select a expected completion date."
                                />
                            <span class="add-on"><i class="icon-th"></i></span>
                        </div>
                    </div>
                    <div class="width_50">
                        <label for="order">Order</label>
                        <select name="order" id="order" class="form-control" regex="/^[\S]+$/" regexError="Order cannot be empty.">
                            <option value="PRECEDENCE" selected="selected">PRECEDENCE</option>
                            <option value="NORMAL">NORMAL</option>
                            <option value="BEHIND">BEHIND</option>
                        </select>
                    </div>
                </div>
                <div class="clr_both"></div>
                <div class="form-group">
                    <label for="note">Note</label>
                    <textarea name="note" class="form-control" rows="10" placeholder="Add Module Description" style="resize:none"></textarea>
                </div>
            </form>
        </div>
    </div>
</body>
</html>