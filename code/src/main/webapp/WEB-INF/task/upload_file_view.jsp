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

    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/js/common/fileUpload/css/jquery.fileupload-ui.css" />
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/js/common/fileUpload/css/jquery.fileupload.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/common/fileUpload/vendor/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/fileUpload/jquery.iframe-transport.js"></script>
    <script type="text/javascript" src="<%=basePath %>static/js/common/fileUpload/jquery.fileupload.js"></script>
    
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/uploadFile.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/uploadFile.js"></script>
</head>
<body>

    <!-- 任务文件上传 -->
    <div class="upload_file_ctnr">
        <input type="hidden" value="${param.taskId }" id="taskId" name="taskId" />
        <input type="hidden" value="${param.fileType }" id="fileType" name="fileType" />
        <form class="form-horizontal" onsubmit="return false">
            <!-- 选择自动/手动 -->
            <div class="form-group">
                <label for="sqlFile" class="col-sm-3 control-label clear">Auto Upload:</label>
                <div class="col-sm-9">
                    <div class="input-group upload_opt_container">
                        <label class="radio-inline">
                          <input type="radio" name="autoUpload" id="autoUpload" value="true" checked> Automation
                        </label>
                        <label class="radio-inline">
                          <input type="radio" name="autoUpload" id="manual" value="false"> Manual
                        </label>
                    </div>
                </div>
            </div>
            <!-- 上传SQL -->
            <div class="form-group sql_file chooser_container">
                <label for="sqlFile" class="col-sm-3 control-label clear">SQL File:</label>
                <div class="col-sm-9">
                    <div class="input-group">
                        <span class="btn btn-success fileinput-button">
                            <i class="glyphicon glyphicon-plus"></i>
                            <span>Add SQL files...</span>
                            <input type="file" class="file_choose" id="sqlFileChooser"
                                name="sql" accept-suffix=".sql,.SQL"
                                container="#sql_file_list" multiple data-url="task/uploadSqlFiles.cmd" />
                        </span>
                    </div>
                    <div id="sql_file_list" class="file_list"></div>
                </div>
            </div>
            <!-- 上传任意文件 -->
            <div class="form-group any_file chooser_container">
                <label for="anyFile" class="col-sm-3 control-label">Any File:</label>
                <div class="col-sm-9">
                    <div class="input-group">
                        <span class="btn btn-success fileinput-button">
                            <i class="glyphicon glyphicon-plus"></i>
                            <span>Add Any files...</span>
                            <input type="file" class="file_choose" id="anyFileChooser" 
                                container="#any_file_list" multiple data-url="task/uploadAnyFiles.cmd" />
                        </span>
                    </div>
                    <div id="any_file_list" class="file_list"></div>
                </div>
            </div>
        </form>
    </div>

</body>
</html>