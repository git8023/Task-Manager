var IssueDebug = true;
IssueDebug && window.console && console.log("issue.js");

$(function() {
    var thisPageFn = new IssueFn();
    thisPageFn.initEvents();
    thisPageFn.initData();
});

/**
 * @description issue.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年4月30日-下午1:35:55
 */
function IssueFn() {
    var TASK_ID;
    var FULLED_DETAILS = "fulled";
    var DETAILS_FULLED = "fulled";
    var DISABLED = "disabled";
    var CURRENT = "current";
    var HIDDEN = "hidden";
    var DISABLED_SCROLLABLE = "disabled_scrollable";

    var TIME_FOR_ISSUE_WINDOW_ANIMATE = 500;

    var $thisObj = this;
    var baseCtnr = $(".issue_ctnr");
    var defailForm = new Form(baseCtnr.find(".detail form:eq(0)"), IssueDebug);

    /** 初始化事件 */
    this.initEvents = function() {
        baseCtnr.find(".menus .menu.add").click(showAddIssueEvent);
        baseCtnr.find(".menus .menu.clear").click(clearIssueEvent);
        baseCtnr.find(".menus .menu.delete").click(deleteCurrentIssueEvent);
        baseCtnr.find(".menus .menu.export_word").click(exportWordEvent);
        baseCtnr.find(".detail .submit").click(submitAddEvent);
        baseCtnr.find(".detail .min_max.max_full").click(maxOrMinFullDetailEvent);

        var issueSelector = ".issue_list .issues .issue";
        baseCtnr.undelegate(issueSelector, "click").delegate(issueSelector, "click", showDetailsEvent);

        $(window).resize(windowResizeEvent);
    }

    // 导出Word事件
    function exportWordEvent() {
        var $this = $(this);
        if ($this.hasClass(DISABLED)) return;
        var issueId = getCurrentIssueId();
        if (!issueId) return;

        requestUtil.download({
            url: "issue/exportWord.cmd",
            param: {
                issueId: issueId
            }
        });
    }

    // 删除选中的Issue
    function deleteCurrentIssueEvent() {
        var $this = $(this);
        if ($this.hasClass(DISABLED)) return;

        var currentIssueId = getCurrentIssueId();
        if (currentIssueId) {
            $.jc.confirm("Info", "Will delete the specified issue[" + $.red(getCurrentIssueName()).getHTML()
                            + "], Are you sure continue?", function() {
                requestUtil.jsonAjax({
                    url: "issue/removeIssue.cmd",
                    data: {
                        issueId: currentIssueId
                    },
                    success: function(rData) {
                        if (!rData.flag) {
                            $.jc.warning(rData.message);
                            return;
                        } else initIssues();
                    },
                    error: function() {
                        $.jc.error();
                    }
                });
            });
        } else {
            $.jc.warning("Cannot found any issue");
        }
    }

    // 清除所有Issue的事件
    function clearIssueEvent() {
        var $this = $(this);
        if ($this.hasClass(DISABLED)) return;

        $.confirm({
            title: "Warning",
            content: "Will delete all Issues, Are your sure to continue?",
            confirm: function() {
                if (0 < issueIds.length) {
                    removeAll();
                } else {
                    $.jc.warning("Cannot found any issue");
                }
            }
        });
    }

    // 删除指定(ID)Issue
    function removeAll() {
        requestUtil.jsonAjax({
            url: "issue/removeAll.cmd",
            data: {
                taskId: getCachedTaskId()
            },
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }
                // 刷新Issue列表
                initIssues();
            },
            error: function() {
                $.jc.error();
            }
        })
    }

    // 最大化/最小化详情窗口
    function maxOrMinFullDetailEvent() {
        var $this = $(this), width = "100%", height = "100%";
        if ($this.hasClass(DISABLED)) return;

        var detailCtnr = getDetailCtnr().find(".full_ctnr_dialog");
        var dcOffset = detailCtnr.position();

        var isFull = (FULLED_DETAILS == $this.attr(FULLED_DETAILS));
        if (isFull) {
            $this.removeAttr(FULLED_DETAILS);
            detailCtnr.removeClass(DETAILS_FULLED);
            dcOffset.top = 0;
        } else {
            width = document.body.clientWidth;
            height = $(window).height();
            $this.attr("fulled", FULLED_DETAILS);
            detailCtnr.addClass(DETAILS_FULLED);
        }

        // 监控 window.resize 事件
        (function() {
            var $window = $(window);
            if (isFull) {
                $window.unbind("resize");
                return;
            }

            // TODO 浏览器视口变化时, 重新计算宽高
            // $window.resize(function() {
            // var winW = document.documentElement.clientWidth;
            // detailCtnr.width(parseFloat(winW));
            //
            // var detailCtnr = getDetailCtnr().find(".full_ctnr_dialog");
            // var dcOffset = detailCtnr.offset();
            // detailCtnr.css({
            // "top": -dcOffset.top,
            // "left": -dcOffset.left
            // });
            // });
        })();

        // 禁用滚动条
        // 当前窗口不是 FULL 状态时, 当前会执行 FULL 逻辑,
        // 此时需要禁用滚动条
        var scrollable = isFull;
        bodyEnableScroll(scrollable);

        detailCtnr.animate({
            "top": -dcOffset.top,
            "left": -dcOffset.left,
            "width": width,
            "height": height
        }, TIME_FOR_ISSUE_WINDOW_ANIMATE, function() {
            var labelCls = "col-sm-4 control-label", iptCls = "col-sm-8";
            if (!isFull) {
                $(".note-editable.panel-body").height(320);
                labelCls = "col-sm-2 control-label";
                iptCls = "col-sm-10";
            }
            var form = getDetailForm();
            form.find(".form-group>label[for]").removeClass().addClass(labelCls);
            form.find(".form-group>div>input").parent().removeClass().addClass(iptCls);
        });
    }

    // Body 启用滚动条
    function bodyEnableScroll(scrollable) {
        scrollable = (!!scrollable);
        var $body = $(".jconfirm-scrollpane");
        scrollable ? $body.removeClass(DISABLED_SCROLLABLE) : $body.addClass(DISABLED_SCROLLABLE);
    }

    // 提交添加事件
    function submitAddEvent() {
        var formData = defailForm.getData();
        formData["task.id"] = getCachedTaskId();
        log(formData);
        formData.submit({
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }
                initIssues();
            },
            error: function() {
                $.jc.error();
            }
        })
    }

    // 新增Issue
    function showAddIssueEvent() {
        var $this = $(this);
        defailForm.cleanForm();
        initHtmlEditors();
        enabledDetails();
    }

    // 展示详情
    function showDetailsEvent() {
        var $this = $(this);
        if ($this.hasClass(DISABLED)) return;
        disabledDetails();
        $this.parent().find("." + CURRENT).removeClass(CURRENT);
        $this.addClass(CURRENT);
        enabledMenusForAIssue();

        requestUtil.jsonAjax({
            url: "issue/showDetail.cmd",
            data: {
                id: getCurrentIssueId()
            },
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }
                defailForm.fillForm({
                    data: rData.data
                });

                showTxtDisplayContainer(true);
            },
            error: function() {
                $.jc.error();
            }
        });
    }

    /** 初始化数据 */
    this.initData = function() {
        disabledDetails();
        initIssues();
    }

    // 初始化Issue列表
    function initIssues() {
        var taskId = getCachedTaskId();
        requestUtil.jsonAjax({
            url: "issue/getIssues.cmd",
            data: {
                taskId: taskId
            },
            success: function(rData) {
                if (!rData.flag) {
                    $.jc.warning(rData.message);
                    return;
                }
                var issuesCtnr = baseCtnr.find(".issues");
                issuesCtnr.html("").append($("<li/>").append($.getNoRecordFound()));

                var issuesData = rData.data;
                if (issuesData instanceof Array) {
                    if (0 != issuesData.length) {
                        issuesCtnr.html("");
                        issuesData.each(function(issue) {
                            $("<li/>", {
                                issueId: issue["id"],
                                html: issue["name"]
                            }).addClass("issue").appendTo(issuesCtnr);
                        });
                        issuesCtnr.find(".issue:eq(0)").click();
                    }
                }

                enabledMenusForAIssue();
            },
            error: function() {
                $.jc.warning();
            }
        });
    }

    // 初始化富文本编辑器
    function initHtmlEditors() {
        var SUMMER_NOTE_CONF = {
            toolbar: [['view', ['fullscreen', 'codeview', 'help']]]
        };
        getDetailForm().find("textarea[name]").each(function(i, txt) {
            SUMMER_NOTE_CONF.height = $(txt).height();
            $(txt).summernote(SUMMER_NOTE_CONF);
            $($(txt).attr("show-container")).hide();
        });
    }

    // 释放富文本编辑器
    function destroySummerNote() {
        getDetailForm().find("textarea[name].form-control").each(function(i, txt) {
            $(txt).summernote("destroy");
            initTextarea($(txt));
        });
    }

    // 判断 textarea 是否包含有效数据
    function initTextarea($txt) {
        var val = $txt.val();
        $txt.val("<p><br></p>" == val ? "" : val);
    }

    // 启用部分菜单(至少选中一个Issue)
    function enabledMenusForAIssue() {
        if (getCurrentIssueId()) {
            baseCtnr.find(".menus .menu").removeClass(DISABLED);
        } else {
            baseCtnr.find(".menus .menu").addClass(DISABLED);
            baseCtnr.find(".menus .menu.add").removeClass(DISABLED);
        }
    }

    // 详情表单启用
    function enabledDetails() {
        var detailForm = getDetailForm();
        detailForm.find(".form-control").removeAttr("disabled");
        detailForm.find(".submit").removeClass(HIDDEN);
        detailForm.find("input[name='createdBy']").attr({
            "disabled": "disabled"
        }).val($("#account").text().trim());
        detailForm.find("input[name='createdDate']").attr({
            "disabled": "disabled"
        }).val(new Date().format("yyyy-MM-dd hh:mm"));
        getDetailCtnr().find(".detail .min_max.max_full").removeClass(HIDDEN);
    }

    // 详情表单禁用
    function disabledDetails() {
        var detailForm = getDetailForm();
        detailForm.find(".form-control").attr({
            "disabled": "disabled"
        });
        detailForm.find(".submit").addClass(HIDDEN);
        destroySummerNote();
    }

    // 窗口大小事件监听
    function windowResizeEvent() {
        var minMaxBtn = baseCtnr.find(".detail .min_max.max_full");
        if (minMaxBtn.attr(FULLED_DETAILS)) {
            var fullCtnr = baseCtnr.find(".full_ctnr_dialog");

            var width = $(window).width(), left = parseFloat(fullCtnr.css("left"));
            var winScroll = $.hasScroll();
            // 右侧滚动条
            if (winScroll.right) {
                var SCROLL_SIZE = 15;
                width -= SCROLL_SIZE;
                // 向右移动一个滚动条的宽度
                left += SCROLL_SIZE;
            }

            fullCtnr.height($(window).height()).width(width);
        }
    }

    // 展示或隐藏Textarea的内容展示控件
    function showTxtDisplayContainer(isShow) {
        getDetailForm().find("textarea[show-container]").each(function(i, txt) {
            txt = $(txt);
            var ctnr = $(txt.attr("show-container")).html(txt.val());
            if (isShow) {
                ctnr.show();
                txt.hide();
            } else {
                txt.show();
                ctnr.hide();
            }
        });
    }

    function getDetailForm() {
        return getDetailCtnr().find(".form_ctnr form:eq(0)");
    }
    function getDetailCtnr() {
        return baseCtnr.find(".detail");
    }
    function getCurrentTaskId() {
        return $("#taskId").val();
    }
    function getCachedTaskId() {
        return (TASK_ID ? TASK_ID : (TASK_ID = $("#taskId").val().trim()));
    }
    function getCurrentIssueId() {
        return getCurrentIssue().attr("issueId");
    }
    function getCurrentIssueName() {
        return getCurrentIssue().text();
    }
    function getCurrentIssue() {
        return baseCtnr.find(".issues .issue.current");
    }

    /** 日志记录 */
    function log(msg) {
        IssueDebug && window.console && console.log(msg);
    }

    return this;
}
