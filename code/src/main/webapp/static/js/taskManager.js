var TaskManagerDebug = true;
TaskManagerDebug && window.console && console.log("taskManager.js");

$(function() {
    var thisPageFn = new TaskManagerFn();
    thisPageFn.initEvents();
    thisPageFn.initData();
});

/**
 * @description task_manager.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年5月14日-下午5:05:52
 */
function TaskManagerFn() {
    var CLASS_ANCHOR = "anchor";
    var CLASS_ACTIVE = "active";
    var CLASS_OF_ROLLBACK = "orig";
    var CLASS_OF_JCONFIRM_BOX_OFFSET = "offset3 col-md-6 col-md-offset-3";
    var CLASS_OF_LAGER = "lager";

    var PROPERTY_NAME_OF_STATUS = "status";
    var DISABLED = "disabled";

    var STATUS_OF_FREE = "FREE";
    var STATUS_OF_DOING = "DOING";
    var STATUS_OF_VERIFYING = "VERIFYING";
    var STATUS_OF_COMPLETED = "COMPLETED";

    var $thisObj = this;
    var baseCtnr = $(".task_manager_container");
    $thisObj.ATTACHMENT_DECISION_TABLES_FOR_VERIFYING = null;

    var pager = new Pager(baseCtnr.find(".grid_pager"), TaskManagerDebug);
    var grid = new DataGrid(baseCtnr.find(".data_grid"), true);

    /** 初始化事件 */
    this.initEvents = function() {
        try {
            registerDelegateEvents();
            registerGridEvents();
            registerMenuEvents();
        } catch (e) {
            log(e.message);
        }
    };

    // 注册菜单事件
    function registerMenuEvents() {
        baseCtnr.find(".menu.verifying").click(verifyingEvent);
        baseCtnr.find(".menu.assign_to").click(assignTasksToUserEvent);
        baseCtnr.find(".menu.unassign").click(unassignTasksEvent);
        baseCtnr.find(".menu.do_disabled").click(deleteChoosedTasksEvent);
    }

    // TODO 批量删除选中的任务;
    // 只能删除为下放的任务, 如果任务存在附件让用户确认是否下载附件后, 再删除
    function deleteChoosedTasksEvent() {
        var $this = $(this);
        if ($this.hasClass(DISABLED)) return;
        $.jc.warning("Please waiting...deleteChoosedTasksEvent");
    }

    // TODO 批量取消已下放的任务
    function unassignTasksEvent() {
        var $this = $(this);
        if ($this.hasClass(DISABLED)) return;
        $.jc.warning("Please waiting...unassignTasksEvent");
    }

    // TODO 批量下发任务到指定用户
    function assignTasksToUserEvent() {
        var $this = $(this);
        if ($this.hasClass(DISABLED)) return;
        $.jc.warning("Please waiting...assignTasksToUserEvent");
    }

    // TODO 管理员审核事件
    function verifyingEvent() {
        var $this = $(this);
        if ($this.hasClass(DISABLED)) return;

        var taskId = getChoosedTasksId()[0];
        var taskName = grid.getCellValue("name", getChoosedTasks());
        var jc = $.confirm({
            title: "Task Verifying - " + taskName,
            content: "",
            confirm: function() {
                $.jc.warning("Submit verifying...");
            }
        });

        requestUtil.jsonAjax({
            url: "task/taskDetails.cmd",
            data: {
                taskId: taskId
            },
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }

                var verifyingCtnr = baseCtnr.find(".verifying_container").getHTML();
                jc.setContent(verifyingCtnr);
                var form = new Form(jc.contentDiv.find(".verifying_container"), TaskManagerDebug);
                form.fillForm({
                    data: rData.data
                });

                // 为动态添加的元素绑定事件
                jc.contentDiv.find(".fn").click(function() {
                    activeVerifyingFn($(this), jc, taskId);
                });
            },
            error: function() {
                $.jc.error();
            }
        });
    }

    // 审核时, 右侧功能激活事件
    function activeVerifyingFn($this, $jc, taskId) {
        var verifyingCtnr = $jc.contentDiv;
        var rightCtnr = verifyingCtnr.find(".right");
        var jcBoxCtnr = $jc.$el.find(".jconfirm-box-container");

        if ($this.hasClass(CLASS_ACTIVE)) {
            showRightCtnr($this, jcBoxCtnr, rightCtnr);
            return;
        } else {
            hideRightCtnr($this, jcBoxCtnr, rightCtnr);
        }

        // 请求列表数据
        requestUtil.jsonAjax({
            url: $this.attr("url-data"),
            data: {
                taskId: taskId
            },
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }

                var itemCtnr = rightCtnr.find(".list").html("");
                if (0 >= rData.data.length) {
                    itemCtnr.append($("<li/>").append($.getNoRecordFound()));
                    return;
                }

                handleAttachmentsData($this, $this.attr("handler"), rData.data);
            },
            error: function() {
                $.jc.error();
            }
        });
    }

    // 处理附属说明数据
    function handleAttachmentsData(trigger, handlerName, data) {
        // 获取决策(函数)表
        // 获取决策函数
        var attachmentDT = getAttachmentDecisionTables(trigger),
            decisionFn = ognlUtil.getValue(attachmentDT, handlerName);

        // 如果决策函数存在
        if (decisionFn instanceof Function) {
            // 调用函数, 处理数据
            decisionFn(data);
        } else {
            // 决策函数不存在, 打印错误消息
            $.jc.warning("Cann't support handler[" + handlerName + "]");
        }
    }

    // 获取附属信息决策表
    function getAttachmentDecisionTables(trigger) {
        if ($thisObj.ATTACHMENT_DECISION_TABLES_FOR_VERIFYING)
            return $thisObj.ATTACHMENT_DECISION_TABLES_FOR_VERIFYING;

        var ul = trigger.parent(), 
            fnsCtnr = ul.parent(), 
            leftCtnr = fnsCtnr.parent(), 
            spliterCtnr = leftCtnr.parent(),
            rightCtnr = spliterCtnr.find(".right");
        rightCtnr.find(".title").html(trigger.attr("to-title"));

        /** 右侧项列表容器 */
        var itemCtnr = rightCtnr.find(".list");
        $thisObj.ATTACHMENT_DECISION_TABLES_FOR_VERIFYING = {
            // TODO ISSUE 列表展示
            issue: function(issueArr) {
                addItemsToCtnr(issueArr, "ISSUE", itemCtnr, function() {
                    var $this = $(this), param = {
                        issueId: $this.parent().attr("itemId"),
                        url: "task/preview_issue"
                    };
                    previewEvent($this, "view.cmd", param);
                });
            },

            // 文件附件列表展示
            file: {
                // SQL 附件展示
                sql: function(sqlAttachmens) {
                    addItemsToCtnr(sqlAttachmens, "SQL", itemCtnr, function() {
                        var $this = $(this), param = {
                            attachmentType: $this.attr("attachmentType"),
                            attachmentId: $this.parent().attr("itemId")
                        };
                        previewEvent($this, "task/previewAttachment2.cmd", param);
                    });
                },
                // 其他附件展示
                other: function(otherAttachmens) {
                    $.jc.warning("Handling issue attachments...");
                }
            }
        };

        return $thisObj.ATTACHMENT_DECISION_TABLES_FOR_VERIFYING;
    }

    // 添加项到预览列表
    function addItemsToCtnr(dataArr, attachmentType, itemCtnr, previewEvent) {
        dataArr.each(function(data) {
            var name = data["name"];
            var item = createItem(data["id"], name, name).appendTo(itemCtnr);
            if (previewEvent instanceof Function) {
                $("<div/>", {
                    title: "Preview",
                    attachmentType: attachmentType
                }).addClass("sql_preview").appendTo(item).click(previewEvent);
            }
        });
    }

    // 创建附件项
    function createItem(itemId, name, title) {
        return $("<li/>", {
            itemId: itemId,
            html: name,
            title: title
        });
    }
    ;

    /**
     * 预览事件
     * 
     * @param $this
     *            {jQuery} 预览控件
     * @param url
     *            {String} 预览请求地址
     * @param param
     *            {Object} 请求参数
     */
    function previewEvent($this, url, param) {
        param = param || {};
        var jc = $.jc.info("Loading...");
        requestUtil.ajax({
            url: url,
            data: param,
            dataType: "html",
            success: function(html) {
                jc.setContent(html); 
                jc.setBoxClass(CLASS_OF_LAGER); 
                jc.setTitle("Preview");
            },
            error: function(args) {
                $.jc.error();
            }
        });
    }

    // 隐藏右边的容器
    function hideRightCtnr($this, jcBoxCtnr, rightCtnr) {
        $this.parent().find("." + CLASS_ACTIVE).removeClass(CLASS_ACTIVE);
        $this.addClass(CLASS_ACTIVE);
        jcBoxCtnr.removeClass(CLASS_OF_ROLLBACK).addClass(CLASS_OF_LAGER).removeClass(CLASS_OF_JCONFIRM_BOX_OFFSET);
        rightCtnr.removeClass("hidden");
    }

    // 显示右边的容器
    function showRightCtnr($this, jcBoxCtnr, rightCtnr) {
        $this.removeClass(CLASS_ACTIVE);
        jcBoxCtnr.removeClass(CLASS_OF_LAGER).addClass(CLASS_OF_ROLLBACK);
        setTimeout(function() {
            jcBoxCtnr.addClass(CLASS_OF_JCONFIRM_BOX_OFFSET).removeClass(CLASS_OF_ROLLBACK);
        }, 500);
        rightCtnr.addClass("hidden");
    }

    // 注册委托事件
    function registerDelegateEvents() {
        // 任务选择事件
        baseCtnr.undelegate(".choosable", "click").delegate(".choosable", "click", function() {
            $(this).toggleClass("choosed");
            enabledMenus();
        });

        // 审核功能事件, Jconfirm 动态添加后, 事件无效
        // $("body").undelegate(".fns_container .fn",
        // "click").delegate(".fns_container .fn", "click", function(){
        // var $this = $(this);
        // $this.parent().find("."+CLASS_ACTIVE).removeClass(CLASS_ACTIVE);
        // $this.addClass(CLASS_ACTIVE);
        // });
    }

    // 启用功能菜单
    function enabledMenus() {
        var taskIds = getChoosedTasksId();
        var choosedTasks = getChoosedTasks();
        var menus = baseCtnr.find(".menus .menu").addClass(DISABLED);
        if (!taskIds.length) return;

        // 开启所有功能
        menus.removeClass(DISABLED);

        /** 仅支持 FREE */
        var assignable = true;
        /** 仅支持 FREE */
        var disabled = true;
        /** 支持除了 completed 外的所有状态 */
        var freeable = true;
        choosedTasks.each(function(i, task) {
            var status = grid.getCellValue(PROPERTY_NAME_OF_STATUS, task);
            assignable = (assignable && STATUS_OF_FREE.equals(status, true, true));
            disabled = assignable;
            freeable = freeable && !(STATUS_OF_COMPLETED.equals(status, true, true));
            if (!(assignable || disabled || freeable)) return false;
        });

        if (!assignable) baseCtnr.find(".menu.assign_to").addClass(DISABLED);
        if (!disabled) baseCtnr.find(".menu.do_disabled").addClass(DISABLED);
        if (!freeable) baseCtnr.find(".menu.unassign").addClass(DISABLED);

        // 只能审核 VERIFYING 状态的一条任务记录
        if (1 == taskIds.length) {
            var taskStatus = grid.getCellValue(PROPERTY_NAME_OF_STATUS, choosedTasks[0]);
            if (STATUS_OF_VERIFYING.notEquals(taskStatus, true, true)) {
                baseCtnr.find(".menus .menu.verifying").addClass(DISABLED);
            }
        } else {
            baseCtnr.find(".menus .menu.verifying").addClass(DISABLED);
        }

    }

    // 获取选中的任务
    function getChoosedTasksId() {
        var ids = [];
        getChoosedTasks().each(function(i, el) {
            ids.push($(el).attr("id").trim());
        });
        return ids;
    }
    function getChoosedTasks() {
        return grid.grid.find(".task.choosed");
    }
    ;

    // 注册网格事件
    function registerGridEvents() {
        grid.registerEvents({
            filterRow: function(row, rowData) {
                row.attr("id", rowData["id"]);
            },
            filterCell: function(cell, cellData) {
                var propName = cellData["propName"];
                switch (propName) {
                case "id":
                    cell.html("").append(createAnchroCtnr());
                    break;
                }
            },
            filled: function() {
                this.grid.resize();
            }
        });
    }

    // 创建选中锚点标记
    function createAnchroCtnr() {
        return $("<div/>").html("&nbsp;").addClass(CLASS_ANCHOR);
    }

    /** 初始化数据 */
    this.initData = function() {
        try {
            initConditionData();
            initGrid();
        } catch (e) {
            log(e.message);
        }
    };

    // 初始化任务
    function initConditionData() {
        requestUtil.jsonAjax({
            url: "task/getTaskStatus.cmd",
            async: false,
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }
                var sl = baseCtnr.find(".condition_form select[name='taskStatus']");
                sl.setOptions(rData.data).prepend($("<option/>", {
                    value: "",
                    html: "All",
                    selected: "selected"
                })).change(initGrid).select2({
                    minimumResultsForSearch: Infinity
                });
            },
            error: function() {
                $.jc.error();
            }
        });
    }

    // 初始化数据网格
    function initGrid() {
        pager.init({
            beforeSend: function(data) {
                data["task.module.id"] = getModuleID();
                data["task.status"] = baseCtnr.find(".condition_form [name='taskStatus']").val();
            },
            afterClick: function(index, rData) {
                grid.fillGrid(rData.data);
            }
        });
    }

    // 获取当前模块ID
    function getModuleID() {
        return baseCtnr.find("#moduleId").val();
    }

    /** 日志记录 */
    function log(msg) {
        TaskManagerDebug && window.console && console.log(msg);
    }

    return this;
}
