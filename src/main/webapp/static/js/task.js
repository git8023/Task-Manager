var TaskDebug = true;
TaskDebug && window.console && console.log("task.js");

$(function() {
    var thisPageFn = new TaskFn();
    thisPageFn.initEvents();
    thisPageFn.initData();
    TaskDebug && window.console
            && console.log("Page load event is complete");
});

/**
 * @description addTask.jsp 页面交互
 * @author Huang.Yong
 * @version 0.1
 * @date 2016年4月4日 - 上午10:42:43
 */
function TaskFn() {
    var $thisObj = this;
    var baseCtnr = $(".task_view");

    /** 初始化事件 */
    this.initEvents = function() {
    }

    /** 初始化数据 */
    this.initData = function() {
        initTaskDetail();
        baseCtnr.find("#targetDate")
            .focus(function(){$(this).blur();})
            .click(function(){$(this).datetimepicker("setStartDate", new Date().format("yyyy-MM-dd"));})
            .datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                autoclose:true,
                todayBtn:true,
                pickerPosition: "bottom-left",
                todayBtn:false
            });
    }
    
    // 回填数据
    function initTaskDetail() {
        var taskId = baseCtnr.find("input#taskId").val();
        var moduleId = baseCtnr.find("input#moduleId").val();
        var param = {}, url;
        // 存在任务ID, 编辑任务|查看任务详情在其他视图执行操作
        if (taskId) {} 
        // 没有回填任务ID, 当前为新建任务
        else {addTask(moduleId);}
    }
    
    // 新增任务
    function addTask(moduleId) {
        requestUtil.jsonAjax({
            url : "module/getDetails.cmd",
            data : {moduleId:moduleId},
            success : function(rData){
                if (rData.flag){fillTaskDetail({module:rData["data"]});}
                else {warning(rData.message);}
            },
            error : function(){warning();}
        });
    }

    // 填充任务详情
    function fillTaskDetail(task) {
        log(task)
        var formCtnr=baseCtnr.find(".task_detail form");
        var form = new Form(formCtnr, TaskDebug);
        form.fillForm({data:task});
//        formCtnr.find("select").select2({minimumResultsForSearch:Infinity});
    }
    
    /** 日志记录 */
    function log(msg) {
        window.console && console.log(msg);
    }
    
    /**
     * 展示警告
     * @param msg 警告消息
     */
    function warning(msg) {$.alert({title:"Warning", content:(msg || "The system is unusual, please try again later.")});}

    return this;
}