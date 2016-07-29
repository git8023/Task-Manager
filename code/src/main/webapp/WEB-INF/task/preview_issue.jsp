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
    
    <link rel="stylesheet" type="text/css" href="<%=basePath %>static/css/issue/preview.css" />
    <script type="text/javascript" src="<%=basePath %>static/js/issue/preview.js"></script>
</head>
<body>
    
    <div class="preview_issue_container">
        <input name="issueId" type="hidden" value="${requestScope.param.issueId[0] }" />
        <div class="full_ctnr_dialog">
            <div class="title">Issue Details <div class="min_max max_full" style="display:none;"></div></div>

            <div class="form_ctnr">
                <form onsubmit="return false;" class="form-horizontal">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="name" class="col-sm-4 control-label">Name</label>
                                <div class="col-sm-8">
                                    <input type="text" name="name" class="form-control" id="name" placeholder="Issue Name">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="createdBy" class="col-sm-4 control-label">Performer</label>
                                <div class="col-sm-8">
                                    <input type="text" name="createdBy.account" class="form-control" id="createdBy" placeholder="Issue Name">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="createdDate" class="col-sm-4 control-label">Created Date</label>
                                <div class="col-sm-8">
                                    <input type="text" name="createdDate" handler="date" format="yyyy-MM-dd hh:mm" class="form-control" id="createdDate" placeholder="Created Date">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">&nbsp;</div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Description</label>
                                <div class="col-sm-10">
                                    <textarea name="description" show-container="#description_show" class="form-control"></textarea>
                                    <div class="show_container form-control" id="description_show"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Solution</label>
                                <div class="col-sm-10">
                                    <textarea name="solution" show-container="#solution_show" class="form-control"></textarea>
                                    <div class="show_container form-control" id="solution_show"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>