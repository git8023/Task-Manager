<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" 
                    + request.getServerName() + ":" 
                    + request.getServerPort()
                    + path + "/";
%>
<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> -->
<!-- <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"> -->
<!DOCTYPE html >
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>title</title>
    
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/settings.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/common/Form.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/settings.js"></script>
</head>
<body>
    <!-- 管理模块 -->
    <div class="project_settings_container">
        <div class="tools">
            <a href="javascript:;" class="add_project" id="addProject"><img src="<%=basePath %>static/image/projectManager/settings_project_add.png"/>Add Project</a>
            <span class="separator">|</span>
            <a href="javascript:;" class="add_module" id="addModule"><img src="<%=basePath %>static/image/projectManager/settings_add_module.gif"/>Add Module</a>
        </div>
        <div class="projects">
            <div class="no_record_found">No Record Found</div>
        </div>
        <div class="modules">
            <div class="no_record_found">No Record Found</div>
        </div>
    </div>

    <div id="src" style="display:none">
        <!-- 添加项目 -->
        <div class="src_add_project">
            <form class="form-horizontal" onsubmit="return false">
              <div class="form-group" style="margin-bottom:15px; margin-top:15px;">
                <label for="newProjectName" class="col-sm-3 control-label">Project Name</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="newProjectName" placeholder="New Project Name">
                </div>
              </div>
            </form>
        </div>
        
        <!-- 添加模块 -->
        <div class="src_add_module">
            <form action="module/addModule.cmd">
                <input type="hidden" name="project.id" />
                <input type="hidden" name="id" />
                <div class="form-group">
                    <div class="width_50">
                        <label for="moduleName">Module Name</label>
                        <input type="text" name="name" class="form-control" id="moduleName" placeholder="New Module Name">
                    </div>
                    <div class="width_50">
                        <label for="status">Status</label>
                        <select name="status" id="status" class="form-control">
                            <option value="DISABLED">DISABLED</option>
                            <option value="EFFECTIVE">EFFECTIVE</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="note">Note</label>
                    <textarea name="note" class="form-control" rows="10" placeholder="Add Module Description" style="resize:none"></textarea>
                </div>
            </form>
        </div>
    </div>
</body>
</html>