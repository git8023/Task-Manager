var PreviewIssueDebug = true;
PreviewIssueDebug && window.console && console.log("preview.js");

$(function() {
    PreviewIssueFn.instance = new PreviewIssueFn();
    PreviewIssueFn.instance.initEvents();
    PreviewIssueFn.instance.initData();
});

/**
 * @description preview_issue.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年7月5日-下午3:36:50
 */
function PreviewIssueFn() {
    if (!(this instanceof PreviewIssueFn)) { return new PreviewIssueFn(false); }

    var $thisObj = this;
    var baseCtnr = $(".preview_issue_container");
    var issueForm = new Form(baseCtnr.find(".form_ctnr:first"), PreviewIssueDebug);
    var ISSUE_ID;

    var util = {
        VALUE: {
            getter: {
                issueId: function() {
                    return (!!ISSUE_ID ? ISSUE_ID : (ISSUE_ID = baseCtnr.find("[name='issueId']:hidden").val()));
                }
            },
            ajax: {
                getByIssueId: function() {
                    var rData = null, param = {
                        id: util.VALUE.getter.issueId()
                    };
                    requestUtil.jsonAjax({
                        url: "issue/showDetail.cmd",
                        async: false,
                        data: param,
                        success: function(data) {
                            rData = data;
                        },
                        error: function() {
                            rData = null;
                        }
                    });
                    return rData;
                }
            }
        },
        UI: {
            issueForm: {
                backfill: function() {
                    var rData = (util.VALUE.ajax.getByIssueId()||{}),
                        issueData = rData.data,
                        backfillConf = {
                            data: issueData,
                            preFill: formDataPreFillEvent
                        };
                    issueForm.fillForm(backfillConf);
                }
            }
        }
    };

    // 表单数据回填事件
    function formDataPreFillEvent(value, name, item) {

    }

    /** 初始化事件 */
    this.initEvents = function() {
        try {
        } catch (e) {
            log(e.message);
        }
    };

    /** 初始化数据 */
    this.initData = function() {
        try {
            util.UI.issueForm.backfill();
        } catch (e) {
            log(e.message);
        }
    };

    // 日志记录
    function log(msg) {
        if ($thisObj.debug) {
            var formattedNow = new Date().format("yyyy-MM-dd hh:mm:ss");
            var caller = arguments.callee.caller.name;
            caller = caller || "Anonymous";
            var local = "__LOCATION__";
            var logPrefix = "[" + local + "] [" + caller + "] [" + formattedNow + "] - ";
            if (window.console) {
                try {
                    throw new Error();
                } catch (e) {
                    var callerInfo = e.stack.match(/\n.*/g)[1];
                    callerInfo = callerInfo.match(/http:+.*[\d]/)[0];
                    // callerInfo = callerInfo.replace(stringUtil.getBaseUrl(),
                    // FINAL_VALUE.EMPTY_STRING);
                    logPrefix = logPrefix.replace(local, callerInfo);
                }

                console.log(logPrefix + JSON.stringify(msg));
                (msg instanceof Object) && console.log(msg);
            }
        }
    }

    return this;
}
