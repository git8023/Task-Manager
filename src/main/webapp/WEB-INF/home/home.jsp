<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false"%>
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
    <title>Task-Manager Home</title>
    
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/common/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/common/jquery-confirm.min.css" />
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/js/common/dataGrid/css/pager.css" />
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/js/common/datetimepicker/bootstrap-datetimepicker.min.css" />
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/js/common/select2/select2.min.css" />
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/home.css" />
    
    <script type="text/javascript" src="<%=basePath %>static/js/common/jquery-1.10.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/bootstrap.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/jquery-confirm.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/datetimepicker/bootstrap-datetimepicker.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/select2/select2.min.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>static/js/common/prototype.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/Validation.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/StringUtil.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/RequestUtil.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/OgnlUtil.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/Form.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/dataGrid/DataGrid.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/dataGrid/Pager.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>static/js/home.js"></script>
</head>
<body>
    <div class="container">
        <%-- 头部,展示logo和user --%>
        <div class="row main_top">
            <div class="col-md-3 padding_0">
                <div class="logo main_top_height">Task Management System</div>
            </div>
            <div class="col-md-9 padding_0">
                <div class="user main_top_height">
                    <div class="account">
                        <span class="fl_l" id="account">${sessionScope.user.name }&nbsp;</span>
                        <div class="account_menu fl_r">
                            <div style="display:inline-block;">
                                <ul>
                                    <li class="separator">|</li>
                                    <li class="menu" fn="info" style="background:url('<%=basePath %>static/image/user_info.png') no-repeat 0;">Information</li>
                                    <li class="separator">|</li>
                                    <li class="menu" fn="restPwd" style="background:url('<%=basePath %>static/image/reset_pwd.png') no-repeat 0;">Reset Password</li>
                                    <li class="separator">|</li>
                                    <li class="menu" fn="message" style="background:url('<%=basePath %>static/image/msg.png') no-repeat 0;">Message</li>
                                    <li class="separator">|</li>
                                    <li class="menu" fn="exit" style="background:url('<%=basePath %>static/image/exit.ico') no-repeat 0;">Exit</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <%-- 中部 S --%>
        <%-- 左边,树形菜单展示项目和模块 --%>
        <%-- 右边,上边搜索条件,下边展示任务 --%>
        <%-- 中部 E --%>
        <div class="row main_body">
            <div class="col-md-2 padding_0">
                <div class="main_body_height projects">
                    <div class="title">Project List
                        <img id="projectSettings" class="project_settings" title="Project Settings" src="<%=basePath %>static/image/project_settings.gif" alt="Project Settings" />
                        <div class="clr_both"></div>
                    </div>
                    <div class="items"></div>
                </div>
            </div>
            <div class="col-md-10 padding_0">
                <div class="main_body_height task_list">
                    <div class="search">
                        <div class="title">Search Conditions <div class="min_max min" target="#min_max_ctnr">&nbsp;</div></div>
                        <div class="search_form" id="min_max_ctnr">
                            <table>
                                <tr>
                                    <td class="title"><label for="name">Name</label></td>
                                    <td class="item"><input class="form-control" type="text" name="task.name" id="name" /></td>
                                    <td class="title"><label for="created_by">Created By</label></td>
                                    <td class="item">
<!--                                         <input class="form-control" type="text" name="task.createdBy.account" id="created_by"/></td> -->
                                        <select name="task.createdBy.account" id="created_by" class="form-control"></select>
                                    <td class="title"><label for="status">Status</label></td>
                                    <td class="item">
                                        <select name="task.status" id="status" class="form-control"></select>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="title"><label for="createdFromDate">Start Created Date</label></td>
                                    <td class="item">
                                        <div class="input-group">
                                            <input class="form-control date" readonly="readonly" type="text" name="createdFromDate" id="createdFromDate" />
                                            <div class="input-group-addon clear" title="Clear"></div>
                                        </div>
                                    </td>
                                    <td class="title"><label for="createdEndDate">End Created Date</label></td>
                                    <td class="item">
                                        <div class="input-group">
                                            <input class="form-control date" readonly="readonly" type="text" name="createdEndDate" />
                                            <div class="input-group-addon clear" title="Clear"></div>
                                        </div>
                                    </td>
                                    <td colspan="2"></td>
                                </tr>
                                <tr>
                                    <td class="title"><label for="finishFromDate">Start Finish Date</label></td>
                                    <td class="item">
                                        <div class="input-group">
                                            <input class="form-control date" readonly="readonly" type="text" name="finishFromDate" id="finishFromDate" />
                                            <div class="input-group-addon clear" title="Clear"></div>
                                        </div>
                                    </td>
                                    <td class="title"><label for="finishEndDate">End Finish Date</label></td>
                                    <td class="item">
                                        <div class="input-group">
                                            <input class="form-control date" readonly="readonly" type="text" name="finishEndDate" id="finishEndDate" />
                                            <div class="input-group-addon clear" title="Clear"></div>
                                        </div>
                                    </td>
                                    <td colspan="2" style="text-align:right;"><button id="btnSearch" class="btn btn-danger">Search</button></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="tasks">
                        <div class="title">Task Repository
                            <div class="grid_pager" 
                                url="task/searchTaskList.cmd" 
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
                                        <th propName="name" style="" 
                                            liststyle="" handler="" format="" emptyFor="--" 
                                            >Name</th>
                                            
                                        <th propName="module.name" style="" 
                                            liststyle="" handler="" format="" emptyFor="--" 
                                            >Module Name</th>
                                            
                                        <th propName="createdDate" style="" 
                                            liststyle="" handler="date" format="yyyy-MM-dd hh:mm:ss" emptyFor="--" 
                                            >Created Date</th>
                                            
                                        <th propName="finishDate" style="" 
                                            liststyle="" handler="" format="" emptyFor="--" 
                                            >Finish Date</th>
                                            
                                        <th propName="targetDate" style="" 
                                            liststyle="" handler="date" format="yyyy-MM-dd hh:mm:ss" emptyFor="--" 
                                            >Expected Finish Date</th>
                                            
                                        <th propName="createdBy.account" style="" 
                                            liststyle="" handler="" format="" emptyFor="--" 
                                            >Created By</th>
                                            
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    <div class="task_bar" style="height:40px; border:1px solid #F00;"> 这是任务栏</div>
    
    <div class="src" style="height:0;">
        <!-- 模块右键菜单 -->
        <div class="context_menu module_context_menu">
            <div class="menu add_task" menu="addTask"><img src="<%=basePath %>static/image/module/task_add.ico"/>Add Task</div>
            <div class="menu task_mgr" menu="taskMgr"><img src="<%=basePath %>static/image/module/task_manager.ico"/>Task Manager</div>
            <div class="menu export_sql" menu="exportSql"><img src="<%=basePath %>static/image/module/export_sql.ico"/>Export Sql</div>
        </div>
        
        <!-- 任务右键菜单 -->
        <div class="context_menu task_context_menu">
            <div class="menu show_details"><img src="<%=basePath %>static/image/task/task_details.png"/>Show Details</div>
            <div class="menu issue"><img src="<%=basePath %>static/image/task/task_add_issue.gif"/>Issue</div>
            
            <hr class="menu_group" />
            <div class="menu assigning_task"><img src="<%=basePath %>static/image/task/assign_task.png"/>Assigning</div>
            <div class="menu submit_task"><img src="<%=basePath %>static/image/task/task_submit.ico"/>Submit</div>
            
            <hr class="menu_group" />
            <div class="menu upload_file menu_container"><img src="<%=basePath %>static/image/task/task_upload.ico"/>Upload Files<div class="more_right transparent_50">&nbsp;</div></div>
            <div class="menu attachments_manager"><img src="<%=basePath %>static/image/task/task_file_manager.gif"/>Manager Files</div>
            <div class="upload_ctnr component">
                <div class="menu" file-type="SQL"><img src="<%=basePath %>static/image/task/task_upload_sql.ico"/>SQL</div>
                <div class="menu" file-type="other"><img src="<%=basePath %>static/image/task/task_upload_other.gif"/>Other</div>
            </div>
        </div>
    </div>
</body>
</html>