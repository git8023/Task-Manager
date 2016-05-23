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
<!-- <!DOCTYPE html > -->
<!-- <html> -->
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>title</title>
    
<%--     <link rel="stylesheet" type="text/css" href="<%=basePath %>static/js/common/googlePretifyPrint/prettify.css" /> --%>
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/task_manager.css" />
    
<%--     <script type="text/javascript" src="<%=basePath %>static/js/common/googlePretifyPrint/prettify.js"></script> --%>
<%--     <script type="text/javascript" src="<%=basePath %>static/js/common/googlePretifyPrint/run_prettify.js"></script> --%>
    <script type="text/javascript" src="<%=basePath %>static/js/taskManager.js"></script>
</head>
<body>

    <div class="task_manager_container">
        <input type="hidden" value="${param.moduleId }" id="moduleId" name="moduleId" />
        
        <div class="menus">
            <a href="javascript:;" class="menu verifying disabled" title="Verify to Redo or COMPLETED"><img src="<%=basePath %>static/image/task/issue/issue_add.gif"/>Verify</a>
            <span class="separator">|</span>
            <a href="javascript:;" class="menu assign_to disabled" title="Batch Assigning To One User"><img src="<%=basePath %>static/image/task/issue/issue_clear.png"/>Assign</a>
            <span class="separator">|</span>
            <a href="javascript:;" class="menu unassign disabled" title="Batch Free"><img src="<%=basePath %>static/image/task/issue/issue_delete.gif"/>Free</a>
            <span class="separator">|</span>
            <a href="javascript:;" class="menu do_disabled disabled" title="Disabled batch"><img src="<%=basePath %>static/image/task/issue/issue_delete.gif"/>Disabled</a>
            
            <div class="fl_r condition_form">
                <label for="taskStatus">Task Status:</label>
                <select name="taskStatus" id="taskStatus"></select>
            </div>
        </div>
        
        <div class="title">Task List
            <div class="grid_pager pager_h25" 
                url="task/searchTaskListForManager.cmd"
                current="1"
                reload="true"
                pageSizes="10,15,50"
                numberCount="5"
                reloadBySize="true"/>
            <div class="clr_both"></div>
        </div>
        
        <div class="data_grid">
            <table class="table table-hover min_width_100">
                <thead>
                    <tr rowClass="choosable task">
                        <th propname="id" 
                            liststyle="" 
                            handler="" 
                            format="" 
                            style="" 
                            listclass="" 
                            emptyfor="--"
                            >&nbsp;</th>
                            
                        <th propname="name" 
                            liststyle="" 
                            handler="" 
                            format="" 
                            style="" 
                            listclass="" 
                            emptyfor="--"
                            >Task Name</th>
                            
                        <th propname="performer" 
                            liststyle="" 
                            handler="" 
                            format="" 
                            style="" 
                            listclass="" 
                            emptyfor="--"
                            >Performer</th>
                            
                        <th propname="status" 
                            liststyle="" 
                            handler="" 
                            format="" 
                            style="" 
                            listclass="" 
                            emptyfor="--"
                            >Status</th>
                            
                        <th propname="createdDate" 
                            liststyle="" 
                            handler="date" 
                            format="yyyy-MM-dd" 
                            style="" 
                            listclass="" 
                            emptyfor="--"
                            >Created Date</th>
                    </tr>
                </thead>
            </table>
        </div>
        
        
        
        
        <div class="src">
            <!-- 任务审核 -->
            <div class="verifying_container">
                <div class="menus">
                    <a href="javascript:;" class="menu completed" title="Verify to Redo or COMPLETED"><img src="<%=basePath %>static/image/task/issue/issue_add.gif"/>Completed</a>
                    <span class="separator">|</span>
                    <a href="javascript:;" class="menu redo" title="Verify to Redo or COMPLETED"><img src="<%=basePath %>static/image/task/issue/issue_add.gif"/>Redo</a>
                    <span class="separator">|</span>
                    <a href="javascript:;" class="menu free" title="Verify to Redo or COMPLETED"><img src="<%=basePath %>static/image/task/issue/issue_add.gif"/>Free</a>
                </div>
                
                <div class="spliter_container">
                    <div class="left">
                        <div class="task_detail">
                            <form class="form-horizontal">
                                <div class="form-group">
                                    <label for="taskName" class="col-sm-3 control-label">Task Name</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" id="taskName" name="name" disabled="disabled">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="targetDate" class="col-sm-3 control-label">Target Date</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" id="targetDate" name="targetDate" 
                                            disabled="disabled" handler="date" format="yyyy-MM-dd hh:mm:ss">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-12">
                                        <textarea name="note" class="form-control" cols="30" rows="10" disabled="disabled"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div class="fns_container">
                            <ul>
                                <li class="fn" handler="issue" to-title="Issue" url-data="task/getIssues.cmd">Issues</li>
                                <li class="fn" handler="file.sql" to-title="SQL Files" url-data="task/getSqlAttachmentFiles.cmd">SQL Files</li>
                                <li class="fn" handler="file.other" to-title="Other Files" url-data="task/getOtherFiles.cmd">Other Files</li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- 右边 -->
                    <div class="right hidden">
                        <div class="title">To Tile</div>
                        <ul class="list">
                            <li>Item_Name_1</li>
                            <li>Item_Name_2</li>
                            <li>Item_Name_3</li>
                            <li>Item_Name_4</li>
                            <li>Item_Name_5</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
</html>