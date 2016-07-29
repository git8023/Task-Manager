window.console && console.log("home.js");
var HomeDebug = false;

$(function() {
    var thisPageFn = new HomeFn();
    thisPageFn.initEvents();
    thisPageFn.initData();
    HomeDebug && window.console && console.log("Page load event is complete");
});

/**
 * @description home.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年3月30日 - 下午12:38:31
 */
function HomeFn() {
    var MAX_PROJECT_LENGTH = 11;
    var TIME_FOR_SEARCH_CONDITION_ANIMATE = 500;
    var NO_RECORD_FOUND = "No Record Found";

    var $thisObj = this;
    var baseCtnr = $(".container:eq(0)");
    var src = $(".src");
    var pager = new Pager(baseCtnr.find(".title>.grid_pager"), HomeDebug);
    var grid = baseCtnr.find(".data_grid").dataGrid();
    var taskCondition;

    /** 初始化事件 */
    this.initEvents = function() {
        registerGridEvent();
        registerSearchEvent();

        baseCtnr.find(".account_menu li.menu").click(accountMenuEvent);// 用户菜单事件
        baseCtnr.find("#projectSettings").click(projectSettingsEvent);// 项目管理事件

        // 初始化 $.confirm 关闭按钮事件
        $("body").undelegate(".projects .items .name", "click").delegate(".projects .items .name", "click",
                        showModulesEvent);

        // 项目右键菜单
        $("body").undelegate(".context_menu", "mouseleave").delegate(".context_menu", "mouseleave", function() {
            $(this).find(".component").hide();
            $(this).hide();
        });
        $("body").undelegate(".projects .items .module", "contextmenu").delegate(".projects .items .module",
                        "contextmenu", moduleContextMenuEvent);
        $("body").undelegate(".projects .items .module", "click").delegate(".projects .items .module", "click",
                        showTaskListEvent);
        src.find(".context_menu .menu").click(hideContextMenuEvent);
        src.find(".context_menu.module_context_menu .menu.add_task").click(addTaskEvent);
        src.find(".context_menu.module_context_menu .menu.task_mgr").click(taskMgrEvent);
        src.find(".context_menu.module_context_menu .menu.export_sql").click(exportModuleSqlEvent);

        // 任务右键菜单
        $("body").undelegate(".task_list .data_grid .task", "contextmenu").delegate(".task_list .data_grid .task",
                        "contextmenu", taskContextMenuEvent);
        $("body").undelegate(".task_list .data_grid .task", "mousedown").delegate(".task_list .data_grid .task",
                        "mousedown", chooseTaskEvent);
        src.find(".task_context_menu .menu").mouseover(function() {
            $(this).parent().find(".component").hide();
        });
        src.find(".task_context_menu .menu.assigning_task").click(assigningTaskEvent);
        src.find(".task_context_menu .menu.submit_task").click(submitTaskEvent);
        src.find(".task_context_menu .menu.show_details").click(showTaskDetailsEvent);
        src.find(".task_context_menu .menu.issue").click(showTaskIssueEvent);
        src.find(".task_context_menu .menu.upload_file").mouseover(showMoreUploadItemEvent);
        src.find(".task_context_menu .upload_ctnr .menu").click(showUploadSqlEvent);
        src.find(".task_context_menu .menu.attachments_manager").click(attachmentsManagerEvent);
    }

    // 任务提交事件(提交后将在管理员审核界面执行审核)
    function submitTaskEvent() {
        $.jc.warning("Task submited will not be able to edit again, Are you sure continue?", function() {
            requestUtil.jsonAjax({
                url: "task/submit.cmd",
                data: {
                    taskId: getCurrTaskId()
                },
                success: function(rData) {
                    if (!rData.flag) {
                        $.jc.warning(rData.message);
                        return;
                    }

                    // TODO 任务提交后, 执行者将不能再次对任务执行操作
                    $.jc.info("Task submited success", reloadTaskList);
                },
                error: function() {
                    $.jc.error();
                }
            });
        });
    }

    // 展示任务Issue
    function showTaskIssueEvent() {
        var jc = $.alert({
            title: "Task Issue - " + getCurrTaskName() + getCloseBtn(),
            content: "",
            backgroundDismiss: false,
            confirm: function() {
            }
        });

        requestUtil.ajax({
            url: "/view.cmd",
            data: {
                taskId: getCurrTaskId(),
                url: "task/issue"
            },
            dataType: "html",
            success: function(rData) {
                jc.setContent(rData);
            },
            error: function() {
                warning();
            }
        });
    }

    // 附件管理事件
    function attachmentsManagerEvent() {
        var taskId = getCurrTaskId();
        requestUtil.ajax({
            url: "view.cmd",
            data: {
                url: "task/attachments_manager",
                taskId: taskId
            },
            dataType: "html",
            success: function(rData) {
                var jc = $.alert({
                    title: "Task Attachments - " + getCurrTaskName() + getCloseBtn(),
                    content: "",
                    backgroundDismiss: false
                });
                jc.setContent(rData);
                setTimeout(function() {
                    jc.setDialogCenter();
                }, 500);
            },
            error: function() {
                warning();
            }
        });
    }

    // 分配任务
    function assigningTaskEvent() {
        var taskId = getCurrTaskId();

        // TODO 校验当前任务是否可以被分配
        var assigned = isAssigned(taskId);
        if (assigned) {
            $.jc.warning("The task has been assigned, please retry after release");
            return;
        }

        requestUtil.ajax({
            url: "view.cmd",
            data: {
                taskId: taskId,
                url: "task/assign_task"
            },
            dataType: "html",
            success: function(data) {
                var jc = $.alert({
                    title: "Assigning Task - " + getCurrTaskName() + getCloseBtn(),
                    content: "",
                    backgroundDismiss: false
                });
                jc.setContent(data);
                setTimeout(function() {
                    jc.setDialogCenter();
                }, 500);
            },
            error: function() {
                warning();
            }
        });
    }

    // TODO 校验指定任务是否已经被分配
    function isAssigned(taskId) {
        var assigned = false;
        requestUtil.jsonAjax({
            url: "/task/isAssigned.cmd",
            data: {
                taskId: taskId
            },
            async: false,
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }
                assigned = rData.data;
            },
            error: function() {
                $.jc.error("", function() {
                    assigned = true;
                });
            }
        });
        return assigned;
    }

    // 展示SQL上传视图
    function showUploadSqlEvent() {
        var $this = $(this);
        requestUtil.ajax({
            url: "view.cmd",
            data: {
                url: "task/upload_file_view",
                taskId: getCurrTaskId(),
                fileType: $this.attr("file-type")
            },
            dataType: "html",
            success: function(htmlData) {
                $.confirm({
                    title: "Upload Attachment File",
                    content: htmlData,
                    backgroundDismiss: false
                });
            },
            error: function() {
                warning();
            }
        });
    }

    // 隐藏右键菜单事件
    function hideContextMenuEvent() {
        if ($(this).hasClass("menu_container")) return;
        $(this).parent().hide();
    }

    // 查看任务详情事件
    function showTaskDetailsEvent() {
        var taskId = getCurrTaskId;
        var jc = $.alert({
            title: "Task - " + getCurrTaskName(),
            content: "",
            backgroundDismiss: false
        });
        requestUtil.ajax({
            url: "view.cmd",
            data: {
                taskId: taskId,
                url: "task/task_details_view"
            },
            dataType: "HTML",
            success: function(data) {
                jc.setContent(data);
            },
            error: function(e) {
                warning();
            }
        });
    }

    // 任务选择事件
    function chooseTaskEvent() {
        // 记录当前选择
        $(this).parent().find(".task").removeClass("current_task");
        $(this).addClass("current_task");
    }

    // 展示更多的上传文件选项事件
    function showMoreUploadItemEvent() {
        var $this = $(this);
        $this.parent().find(".upload_ctnr").css({
            left: $this.offset().left + $this.width() + parseInt($this.css("padding-left")),
            top: $this.offset().top - $(document).scrollTop()
        }).show();
    }

    // 任务右键菜单事件
    function taskContextMenuEvent(e) {
        var offset = 10, x = e.clientX - offset, y = e.clientY - offset;
        src.find(".task_context_menu").css({
            top: y,
            left: x,
        }).show();
        return false;
    }

    // 注册查询事件
    function registerSearchEvent() {
        baseCtnr.find("#btnSearch").click(searchTaskEvent);// 查询任务列表事件
        baseCtnr.find(".search_form .item input.date").focus(function() {
            var $this = $(this);
            setTimeout(function() {
                $this.blur();
            }, 1000);
        });
        var dtparams = {
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            clearBtn: true
        };

        var createdDateFromSelector = ".search_form .item input[name='createdFromDate']";
        var createdDateFrom = baseCtnr.find(createdDateFromSelector).datetimepicker(dtparams);
        var createdDateToSelector = ".search_form .item input[name='createdEndDate']";
        var createdDateTo = baseCtnr.find(createdDateToSelector).datetimepicker(dtparams);
        setClickDateScope(createdDateTo, createdDateFrom, "setStartDate");
        setClickDateScope(createdDateFrom, createdDateTo, "setEndDate");

        var finishDateFromSelector = ".search_form .item input[name='finishFromDate']";
        var finishDateFrom = baseCtnr.find(finishDateFromSelector).datetimepicker(dtparams);
        var finishDateToSelector = ".search_form .item input[name='finishEndDate']";
        var finishDateTo = baseCtnr.find(finishDateToSelector).datetimepicker(dtparams);
        setClickDateScope(finishDateTo, finishDateFrom, "setStartDate");
        setClickDateScope(finishDateFrom, finishDateTo, "setEndDate");

        var clearSelector = ".search_form .item .clear";
        $("body").undelegate(clearSelector, "click").delegate(clearSelector, "click", function() {
            $(this).parent().find(".date").val("");
        });

        var conditionToMinSelector = ".min_max.min";
        $("body").undelegate(conditionToMinSelector, "click")
                        .delegate(conditionToMinSelector, "click", searchFormToMin);

        var conditionToMaxSelector = ".min_max.max";
        $("body").undelegate(conditionToMaxSelector, "click")
                        .delegate(conditionToMaxSelector, "click", searchFormToMax);

    }

    // 查询表单最大化
    function searchFormToMax() {
        var $this = $(this), active = $this.attr("active");
        if (active) { return; }
        $this.attr("active", "active");

        var target = $($this.attr("target"));
        var tHeight = target.attr("org-height");
        target.slideDown(TIME_FOR_SEARCH_CONDITION_ANIMATE, function() {
            $this.removeClass("max").addClass("min").removeAttr("active");
        });
        var dg = baseCtnr.find(".tasks .data_grid");
        dg.animate({
            height: dg.height() - tHeight
        }, TIME_FOR_SEARCH_CONDITION_ANIMATE);
    }

    // 查询表单最小化
    function searchFormToMin() {
        var $this = $(this), active = $this.attr("active");
        if (active) { return; }
        $this.attr("active", "active");

        var target = $($this.attr("target"));
        var tHeight = target.height();
        tHeight += parseInt(target.css("padding-top"));
        tHeight += parseInt(target.css("padding-bottom"));
        target.attr("org-height", tHeight);
        target.slideUp(TIME_FOR_SEARCH_CONDITION_ANIMATE, function() {
            $this.removeClass("min").addClass("max").removeAttr("active");
        });
        var dg = baseCtnr.find(".tasks .data_grid");
        dg.animate({
            height: dg.height() + tHeight
        }, TIME_FOR_SEARCH_CONDITION_ANIMATE);
    }

    /**
     * 这是时间范围
     * 
     * @param trigger
     *            触发器
     * @param valTag
     *            值控件
     * @param prop
     *            属性 setStartDate|setEndDate
     */
    function setClickDateScope(trigger, valTag, prop) {
        trigger.click(function() {
            $(this).datetimepicker(prop, valTag.val());
        });
    }

    // 查询任务事件
    function searchTaskEvent() {
        pager.init({
            beforeSend: function(data) {
                var param = getTaskSearchCondition(true);
                param.pageIndex = data.pageIndex;
                param.pageSize = data.pageSize;
                return param;
            },
            afterClick: function(index, rData) {
                // 填充数据
                grid.fillGrid(rData.data);
            }
        });
    }

    // 导出模块包含SQL
    function exportModuleSqlEvent() {
        warning("Missing Support, Please warting...");
    }

    // 注册数据网格事件
    function registerGridEvent() {
        grid.registerEvents({
            filterRow: function(row, rowData, rowIdx) {
                row.attr({
                    "taskId": rowData["id"]
                });
                // 根据任务状态展示不同背景色
                var statusClass = {
                    DOING: "info",
                    COMPLETED: "success",
                    DISABLED: "danger"
                }
                row.addClass(statusClass[rowData["status"]]).addClass("task");
            }
        });
    }

    // TODO 任务管理事件
    function taskMgrEvent() {
        requestUtil.ajax({
            url: "view.cmd",
            data: {
                moduleId: getActiveModuleId(),
                url: "task/task_manager"
            },
            dataType: "html",
            success: function(html) {
                if (stringUtil.isEmpty(html, true)) {
                    $.jc.warning("Load task manager window failed.");
                    return;
                }

                var jc = $.alert({
                    title: "Task Manager - " + getActiveModuleName() + getCloseBtn(),
                    content: "",
                    backgroundDismiss: false,
                    confirm: function() {
                        $.jc.warning("Task Manager Success");
                        // TODO 刷新当前页面数据
                    }
                });
                jc.setContent(html);
                setTimeout(function() {
                    jc.setDialogCenter();
                }, 500);
            },
            error: function() {
                $.jc.error();
            }
        });
    }

    // 添加任务事件
    function addTaskEvent() {
        requestUtil.ajax({
            url: "/view.cmd",
            data: {
                moduleId: getActiveModuleId(),
                url: "task/task_view"
            },
            dataType: "html",
            success: function(data) {
                var jc = $.confirm({
                    title: "Add Task",
                    content: data,
                    backgroundDismiss: false,
                    confirm: submitAddTask,
                    cancel: function() {
                        jc.canClose = true;
                    }
                });
                setTimeout(function() {
                    jc.setDialogCenter(true);
                }, 50);
            },
            error: function() {
                warning();
            }
        });
    }

    // 提交添加任务
    function submitAddTask() {
        var jc = this, form = new Form(jc.contentDiv.find("form"), HomeDebug);
        jc.canClose = true;
        form.validate({
            regex: {
                success: function(error, item) {
                    $(item).removeAttr("title").removeClass("ipt_err");
                },
                failure: function(error, item) {
                    jc.canClose = false;
                    $(item).addClass("ipt_err").attr({
                        title: error
                    });
                }
            }
        });

        if (jc.canClose) {
            // 当前不允许关闭, 重名验证需要远程验证, 有延迟处理
            jc.canClose = false;
            var formData = form.getData();
            // 重名验证
            validationName(formData, function() {
                formData.submit({
                    url: "task/addTask.cmd",
                    success: function(rData) {
                        if (rData.flag) {
                            // 任务添加成功
                            jc.close();
                            refreshTaskList();
                        } else {
                            warning(rData.message);
                        }
                    },
                    error: function() {
                        warning();
                    }
                });
            }, jc);
        }
    }

    // 刷新当前任务列表
    function refreshTaskList() {
        baseCtnr.find(".projects .items .module.active").click();
    }

    /**
     * 重名验证
     * 
     * @param formData
     *            表单数据
     * @param callback
     *            回调函数
     * @param jc
     *            模态框
     */
    function validationName(formData, callback, jc) {
        requestUtil.jsonAjax({
            url: "task/exist.cmd",
            data: {
                name: formData["name"],
                moduleId: formData["module.id"]
            },
            success: function(rData) {
                if (rData.flag) {
                    if (rData.data) {
                        jc.canClose = true;
                        callback();
                    } else {
                        jc.canClose = false;
                        warning(rData.data.msg);
                    }
                } else {
                    warning();
                }
            },
            error: function() {
                warning();
            }
        })
    }

    // 显示任务列表
    function showTaskListEvent(e) {
        var $this = $(this);

        // 右键, 未选中时执行选中, 已选中时不做任何操作
        var mouseRightKey = (3 == e.which);
        if (mouseRightKey && $this.hasClass("active")) return;
        baseCtnr.find(".module").each(function(i, el) {
            $(this).removeClass("active");
        });
        $this.addClass("active");

        // 查询条件与每个模块相关
        // 切换模块时需要重新初始化查询条件
        initSearchCondition();
        reloadTaskList();
    }

    /**
     * 获取任务查询条件
     * 
     * @param latestParam
     *            true-获取最新查询条件, false-获取缓存的查询条件
     */
    function getTaskSearchCondition(latestParam) {
        if (latestParam || (null == taskCondition)) {
            var form = new Form(getSearchConditionFormCtnr(), HomeDebug);
            taskCondition = form.getData().getRealData();
        }
        // taskCondition.task = {module:{id:baseCtnr.find(".projects .items
        // .module.active").attr("moduleid")}};
        taskCondition["task.module.id"] = getActiveModuleId();
        return taskCondition;
    }

    function getSearchConditionFormCtnr() {
        return baseCtnr.find(".search_form");
    }
    function getActiveModuleId() {
        return getActiveModule().attr("moduleid");
    }
    function getActiveModuleName() {
        return getActiveModule().text();
    }
    function getActiveModule() {
        return baseCtnr.find(".projects .items .module.active");
    }

    // 模块右键菜单
    function moduleContextMenuEvent(e) {
        var offset = 10, x = e.clientX - offset, y = e.clientY - offset;
        src.find(".module_context_menu").css({
            top: y,
            left: x,
        }).show();
        return false;
    }

    // 展示模块列表
    function showModulesEvent() {
        var $this = $(this), projectId = $this.attr("projectId"), projectCtnr = $this.parent();
        baseCtnr.find(".module").remove();
        projectCtnr.parent().find(".no_record_found").remove();
        projectCtnr.append(getNoRecordFoundCtnr());
        requestUtil.jsonAjax({
            url: "module/getModulesByProject.cmd",
            data: {
                projectId: projectId
            },
            success: function(rData) {
                if (rData.flag) {
                    var data = rData.data;
                    if (data instanceof Array) {
                        var modulesLen = data.length;
                        if (0 < modulesLen) {
                            projectCtnr.find(".no_record_found").remove();
                            projectCtnr.find(".module").remove();
                            data.each(function(v) {
                                $("<div/>", {
                                    html: v["name"],
                                    moduleId: v["id"]
                                }).addClass("module").insertAfter($this);
                            });
                            projectCtnr.find(".module:eq(0)").click();
                        }
                    }
                } else {
                    warning(rData.message);
                }
            },
            error: function() {
                warning();
            }
        });
    }

    // 项目管理事件
    function projectSettingsEvent() {
        requestUtil.ajax({
            url: "/view.cmd",
            data: {
                url: "project/settings"
            },
            dataType: "html",
            success: function(data) {
                var jc = $.alert({
                    title: "Project Settings" + getCloseBtn(),
                    content: data,
                    backgroundDismiss: false,
                    confirm: initProjects
                });
                setTimeout(function() {
                    jc.setDialogCenter(true);
                }, 50);
            },
            error: function() {
                warning();
            }
        });
    }

    // 获取 $.confirm 关闭按钮
    function getCloseBtn() {
        return $("<div/>", {
            html: "&times;",
            onClick: "closerEvent(this)"
        }).addClass("confrim_closer").getHTML();
    }

    // 用户菜单事件
    function accountMenuEvent() {
        var $this = $(this);
        var fn = $this.attr("fn");
        switch (fn) {
        case "info":
            break;
        case "restPwd":
            break;
        case "message":
            break;
        case "exit":
            exit();
            break;
        default:
            log("Cannot support menu[fn=" + fn + "]");
        }
    }

    // 用户退出
    function exit() {
        $.confirm({
            title: 'Info',
            content: 'Are you sure you want to log out ?',
            autoClose: 'cancel|5000',// 自动关闭设置，可为confirm或cancel
            backgroundDismiss: false,
            confirm: function() {
                requestUtil.jsonAjax({
                    url: "user/signOut.cmd",
                    success: function(data) {
                        if (data.flag && data.data) {
                            location.href = stringUtil.getRealUrl("/index.jsp");
                        } else {
                            $.confirm({
                                title: "Warning",
                                content: data.message
                            });
                        }
                    }
                });
            },
            cancel: function() {
            }
        });
    }

    /** 初始化数据 */
    this.initData = function() {
        initProjects();
        // 消除 trans-tooltip 占用 bootstrap 高度, 引起的滚动条
        $(".trans-tooltip").css({
            "top": "0",
            "position": "fixed"
        });
    }

    // 初始化查询条件
    function initSearchCondition() {
        var moduleId = getActiveModuleId();
        requestUtil.jsonAjax({
            url: "task/getSearchConditions.cmd",
            data: {
                moduleId: moduleId
            },
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }

                var data = rData.data;
                if (data) {
                    // Task Status
                    var searchFormCtnr = getSearchConditionFormCtnr();
                    var statusSl = searchFormCtnr.find("select[name='task.status']");
                    statusSl.setOptions(data["taskStatus"]).prepend($("<option/>", {
                        value: "",
                        html: "ALL",
                        selected: "selected"
                    })).select2({
                        minimumResultsForSearch: Infinity
                    });

                    // User In Module
                    var createdBySl = searchFormCtnr.find("select[name='task.createdBy.account']");
                    var origUsersInModule = data["usersInModule"], usersInModule = [];
                    origUsersInModule.each(function(v) {
                        usersInModule.push({
                            value: v["key"],
                            text: v["value"]
                        });
                    });
                    createdBySl.setOptions(usersInModule).prepend($("<option/>", {
                        value: "",
                        html: "ALL",
                        selected: "selected"
                    })).select2();

                }
            },
            error: function(r) {
                $.jc.error();
            }
        });
    }

    // 初始化项目列表
    function initProjects() {
        var itemsCtnr = baseCtnr.find(".items").html("").append(getNoRecordFoundCtnr());
        requestUtil.jsonAjax({
            url: "project/getProjectList.cmd",
            success: function(rData) {
                if (rData.flag) {
                    var data = rData.data;
                    if (data instanceof Array) {
                        if (0 < data.length) {
                            itemsCtnr.html("");
                            data.each(function(v) {
                                var itemCtnr = $("<div/>").addClass("item").appendTo(itemsCtnr);
                                var nameCtnr = $("<div/>", {
                                    title: v["name"],
                                    text: stringUtil.setLength(v["name"], MAX_PROJECT_LENGTH)
                                }).addClass("name").attr({
                                    "projectId": v["id"]
                                }).appendTo(itemCtnr);
                                $("<img/>", {
                                    src: stringUtil.getRealUrl(v["icoPath"])
                                }).prependTo(nameCtnr);
                            });
                            itemsCtnr.find(".item:eq(0) .name").click();
                        }
                    }
                } else {
                    warning(rData.message);
                }
            },
            error: function() {
                warning();
            }
        });
    }

    // 获取当前任务ID
    function getCurrTaskId() {
        return baseCtnr.find(".data_grid .current_task").attr("taskId");
    }

    // 重新加载任务列表
    function reloadTaskList() {
        baseCtnr.find("#btnSearch").click();
    }

    // 获取当前任务ID
    function getCurrTaskName() {
        var nameIdx;
        grid.grid.find("thead th").each(function(i, th) {
            if ("name" === $(th).attr("propname")) {
                nameIdx = i;
                return false;
            }
        });
        return currTaskRow = baseCtnr.find(".data_grid .current_task td:eq('" + nameIdx + "')").text();
    }

    // 获取无记录信息容器
    function getNoRecordFoundCtnr() {
        return $("<div/>").addClass("no_record_found").html(NO_RECORD_FOUND);
    }

    /** 日志记录 */
    function log(msg) {
        HomeDebug && window.console && console.log(msg);
    }

    /**
     * 展示警告
     * 
     * @param msg
     *            警告消息
     */
    function warning(msg) {
        $.alert({
            title: "Warning",
            content: (msg || "The system is unusual, please try again later.")
        });
    }

    return this;
}

/**
 * 模态框关闭事件
 * 
 * @param el
 *            关闭控件
 */
function closerEvent(el) {
    var $this = $(el);
    var titleCtn = $this.parent();
    var dialogCtn = titleCtn.parent();
    dialogCtn.find(".buttons:last button:contains('Okay')").click()
}
