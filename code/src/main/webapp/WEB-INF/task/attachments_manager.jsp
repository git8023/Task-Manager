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
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/attachmentsManager.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/attachmentsManager.js"></script>
</head>
<body>

    <!-- 任务分配 -->
    <div class="attachment_mgr_ctnr">
        <input type="hidden" value="${param.taskId }" id="taskId" name="taskId" />
        <div class="list_ctnr">
            <!-- 工具栏 -->
            <div class="tools menus">
                <a href="javascript:;" class="menu clear_attachments"><img src="<%=basePath %>static/image/task/task_clear.ico"/>Clear</a>
                <span class="separator">|</span>
                <a href="javascript:;" class="menu delete_attachments disabled"><img src="<%=basePath %>static/image/task/delete_tasks.png"/>Delete</a>
                <span class="separator">|</span>
                <a href="javascript:;" class="menu note disabled"><img src="<%=basePath %>static/image/attachment/comment.gif"/>Note</a>
                <span class="separator">|</span>
                <a href="javascript:;" class="menu download_files disabled"><img src="<%=basePath %>static/image/attachment/attachment_export.gif"/>Download</a>
            </div>
            
            <!-- 用户列表 -->
            <div class="attachments_ctnr">
                <div class="title">Attachment List
                    <div class="grid_pager" 
                        url="task/getAttachments.cmd" 
                        current="1" 
                        reload="true" 
                        pageSizes="10,15,50" 
                        numberCount="5" 
                        reloadBySize="true"></div>
                </div>
                <div class="clr_both"></div>
                
                <div class="data_grid">
                    <table class="table table-hover min_width_100">
                        <thead>
                            <tr>
                                <th propName="name" style="" liststyle="" handler="" format="" emptyFor="--">Name</th>
                                <th propName="operator" style="" liststyle="" handler="" format="" emptyFor="--">Operator</th>
                                <th propName="createdDate" style="" liststyle="" handler="date" format="yyyy-MM-dd hh:mm:ss" emptyFor="--" >Created Date</th>
                                <th propName="fileType" style="" liststyle="" handler="" format="" emptyFor="--" >File Type</th>
                            </tr>
                        </thead>
                    </table>
                </div><!-- data_grid -->
                
            </div>
        </div>
    </div>

</body>
</html>